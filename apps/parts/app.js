// apps/parts/app.js

function initPartsLogic() {
    let state = StateManager.getAppData('parts');
    let activeArea = "All Parts";
    let html5QrcodeScanner = null;

    // --- Core Rendering ---
    function renderAreaTabs() {
        const container = document.getElementById('parts-area-tabs');
        container.innerHTML = '';
        
        const areas = ["All Parts", ...Object.keys(state.areaTags || {})];
        
        areas.forEach(area => {
            const btn = document.createElement('button');
            btn.className = area === activeArea ? 'btn-primary' : 'btn-outline';
            btn.innerText = area;
            btn.onclick = () => { activeArea = area; renderAreaTabs(); renderTable(); };
            container.appendChild(btn);
        });
    }

    function renderTable() {
        const tbody = document.getElementById('parts-table-body');
        tbody.innerHTML = '';

        let filteredParts = state.partsCatalog || [];
        if (activeArea !== "All Parts") {
            const allowedIds = state.areaTags[activeArea] || [];
            filteredParts = filteredParts.filter(p => allowedIds.includes(p.id));
        }

        if (filteredParts.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 20px;">No parts found in this area.</td></tr>`;
            return;
        }

        filteredParts.forEach(part => {
            const isCritEmpty = part.isCritical && Number(part.qty) === 0;
            const isLow = Number(part.qty) <= Number(part.minQty) && !isCritEmpty;
            
            const imgHtml = (part.media && part.media[0] && part.media[0].url) 
                ? `<img src="${part.media[0].url}" class="part-media-thumb">` 
                : `<div class="part-media-thumb" style="display:flex; align-items:center; justify-content:center; background:#eee; color:#999; font-size:0.8rem;">No Img</div>`;

            const tr = document.createElement('tr');
            if (isCritEmpty) tr.className = 'critical-row';

            tr.innerHTML = `
                <td>${imgHtml}</td>
                <td>
                    <strong style="cursor: pointer; color: var(--accent-primary);" class="edit-part-trigger" data-id="${part.id}">${part.name}</strong><br>
                    <span style="font-size: 0.85rem; color: var(--text-secondary);">SKU: ${part.sku}</span>
                </td>
                <td>${part.location || 'Unassigned'}</td>
                <td style="text-align: center; font-size: 1.2rem;">
                    <span class="${isLow ? 'low-stock-text' : ''} ${isCritEmpty ? 'low-stock-text' : ''}" style="${isCritEmpty ? 'color: var(--danger-color);' : ''}">${part.qty}</span>
                </td>
                <td style="text-align: center;">
                    <div style="display: flex; gap: 5px; justify-content: center;">
                        <button class="btn-outline qty-btn deduct-btn" data-id="${part.id}">-</button>
                        <button class="btn-outline qty-btn add-btn" data-id="${part.id}">+</button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    // --- Adjust Quantity & Transactions ---
    function adjustQty(partId, amount) {
        const partIdx = state.partsCatalog.findIndex(p => p.id === partId);
        if (partIdx === -1) return;
        
        let newQty = Number(state.partsCatalog[partIdx].qty) + amount;
        if (newQty < 0) newQty = 0;
        
        state.partsCatalog[partIdx].qty = newQty;
        
        // Log transaction
        if (!state.transactions) state.transactions = [];
        state.transactions.push({
            id: 'txn_' + Date.now(),
            timestamp: new Date().toISOString(),
            partId: partId,
            type: amount > 0 ? 'Add' : 'Deduct',
            qtyChange: amount,
            newTotal: newQty
        });

        StateManager.setAppData('parts', state);
        renderTable();

        // Check for substitute
        if (newQty === 0 && state.partsCatalog[partIdx].substituteId) {
            const sub = state.partsCatalog.find(p => p.id === state.partsCatalog[partIdx].substituteId);
            if (sub && Number(sub.qty) > 0) {
                NotificationSystem.show(`Out of stock. Substitute available: ${sub.name}`, "error");
            }
        }
    }

    // --- Part Editor Handlers ---
    const editorModal = document.getElementById('parts-editor-modal');

    document.getElementById('parts-add-btn').onclick = () => openEditor(null);
    document.getElementById('parts-close-editor').onclick = () => editorModal.close();

    document.getElementById('parts-table-body').addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-part-trigger')) {
            openEditor(e.target.getAttribute('data-id'));
        }
        if (e.target.classList.contains('deduct-btn')) adjustQty(e.target.getAttribute('data-id'), -1);
        if (e.target.classList.contains('add-btn')) adjustQty(e.target.getAttribute('data-id'), 1);
    });

    function openEditor(partId) {
        const tagsContainer = document.getElementById('part-edit-area-tags');
        tagsContainer.innerHTML = '';
        Object.keys(state.areaTags || {}).forEach(area => {
            tagsContainer.innerHTML += `<label style="display:flex; align-items:center; gap:5px; padding:5px; background:rgba(0,0,0,0.03); border-radius:4px;"><input type="checkbox" class="area-tag-cb" value="${area}"> ${area}</label>`;
        });

        if (partId) {
            const part = state.partsCatalog.find(p => p.id === partId);
            if (!part) return;
            document.getElementById('parts-editor-title').innerText = "Edit Part";
            document.getElementById('part-edit-id').value = part.id;
            document.getElementById('part-edit-name').value = part.name;
            document.getElementById('part-edit-sku').value = part.sku;
            document.getElementById('part-edit-sub').value = part.substituteId || '';
            document.getElementById('part-edit-qty').value = part.qty;
            document.getElementById('part-edit-min').value = part.minQty;
            document.getElementById('part-edit-loc').value = part.location || '';
            document.getElementById('part-edit-vendor-url').value = part.vendor?.url || '';
            document.getElementById('part-edit-vendor-price').value = part.vendor?.lastPrice || '';
            document.getElementById('part-edit-img').value = (part.media && part.media[0]) ? part.media[0].url : '';
            document.getElementById('part-edit-critical').checked = part.isCritical;
            
            // Check off active areas
            document.querySelectorAll('.area-tag-cb').forEach(cb => {
                if (state.areaTags[cb.value] && state.areaTags[cb.value].includes(partId)) cb.checked = true;
            });
            document.getElementById('part-delete-btn').style.display = 'block';
        } else {
            document.getElementById('parts-editor-title').innerText = "Add New Part";
            document.getElementById('part-edit-id').value = 'part_' + Date.now();
            ['name', 'sku', 'sub', 'qty', 'min', 'loc', 'vendor-url', 'vendor-price', 'img'].forEach(id => document.getElementById(`part-edit-${id}`).value = '');
            document.getElementById('part-edit-critical').checked = false;
            document.getElementById('part-delete-btn').style.display = 'none';
        }
        editorModal.showModal();
    }

    document.getElementById('part-save-btn').onclick = () => {
        const id = document.getElementById('part-edit-id').value;
        const name = document.getElementById('part-edit-name').value.trim();
        if(!name) return NotificationSystem.show("Part name required", "error");

        const newPart = {
            id: id,
            name: name,
            sku: document.getElementById('part-edit-sku').value,
            substituteId: document.getElementById('part-edit-sub').value,
            qty: Number(document.getElementById('part-edit-qty').value || 0),
            minQty: Number(document.getElementById('part-edit-min').value || 0),
            location: document.getElementById('part-edit-loc').value,
            isCritical: document.getElementById('part-edit-critical').checked,
            vendor: { url: document.getElementById('part-edit-vendor-url').value, lastPrice: document.getElementById('part-edit-vendor-price').value },
            media: [{ type: "image", url: document.getElementById('part-edit-img').value }]
        };

        const idx = state.partsCatalog.findIndex(p => p.id === id);
        if (idx > -1) state.partsCatalog[idx] = newPart; else state.partsCatalog.push(newPart);

        // Update Area Tags
        document.querySelectorAll('.area-tag-cb').forEach(cb => {
            const areaName = cb.value;
            if(!state.areaTags[areaName]) state.areaTags[areaName] = [];
            
            const hasId = state.areaTags[areaName].includes(id);
            if(cb.checked && !hasId) state.areaTags[areaName].push(id);
            if(!cb.checked && hasId) state.areaTags[areaName] = state.areaTags[areaName].filter(tagId => tagId !== id);
        });

        StateManager.setAppData('parts', state);
        editorModal.close();
        renderTable();
        NotificationSystem.show("Part Saved");
    };

    document.getElementById('part-delete-btn').onclick = async () => {
        const id = document.getElementById('part-edit-id').value;
        const confirmed = await DialogSystem.confirm("Delete Part", "Are you sure? This deletes the part globally.");
        if (confirmed) {
            state.partsCatalog = state.partsCatalog.filter(p => p.id !== id);
            Object.keys(state.areaTags).forEach(area => {
                state.areaTags[area] = state.areaTags[area].filter(tagId => tagId !== id);
            });
            StateManager.setAppData('parts', state);
            editorModal.close();
            renderTable();
            NotificationSystem.show("Part Deleted");
        }
    };

    // --- Area Management ---
    const areaModal = document.getElementById('parts-area-modal');
    document.getElementById('parts-manage-areas-btn').onclick = () => { renderAreaManager(); areaModal.showModal(); };
    document.getElementById('parts-close-area').onclick = () => areaModal.close();

    function renderAreaManager() {
        const list = document.getElementById('parts-area-list');
        list.innerHTML = '';
        Object.keys(state.areaTags || {}).forEach(area => {
            const div = document.createElement('div');
            div.style = "display:flex; justify-content:space-between; align-items:center; padding:10px; background:var(--bg-surface); border:1px solid var(--border-color); border-radius:4px;";
            div.innerHTML = `<strong>${area}</strong> <button class="btn-danger parts-del-area-btn" data-area="${area}">🗑️</button>`;
            list.appendChild(div);
        });
    }

    document.getElementById('parts-add-area-btn').onclick = () => {
        const val = document.getElementById('parts-new-area-name').value.trim();
        if (val && !state.areaTags[val]) {
            state.areaTags[val] = [];
            StateManager.setAppData('parts', state);
            document.getElementById('parts-new-area-name').value = '';
            renderAreaManager();
            renderAreaTabs();
        }
    };

    document.getElementById('parts-area-list').addEventListener('click', async (e) => {
        if (e.target.classList.contains('parts-del-area-btn')) {
            const area = e.target.getAttribute('data-area');
            const confirmed = await DialogSystem.confirm("Delete Area Tab", `Remove the ${area} tab? The parts themselves will NOT be deleted.`);
            if (confirmed) {
                delete state.areaTags[area];
                if (activeArea === area) activeArea = "All Parts";
                StateManager.setAppData('parts', state);
                renderAreaManager();
                renderAreaTabs();
                renderTable();
            }
        }
    });

    // --- Scanner Logic ---
    const scanModal = document.getElementById('parts-scanner-modal');
    
    document.getElementById('parts-close-scanner').onclick = () => { 
        try {
            if (html5QrcodeScanner) {
                html5QrcodeScanner.clear().catch(err => console.warn("Scanner clear forced:", err));
            }
        } catch (e) {
            console.error("Scanner failed to gracefully close.", e);
        } finally {
            // Force the modal closed and empty the div to kill any hanging video elements
            scanModal.close(); 
            document.getElementById('qr-reader').innerHTML = '';
            html5QrcodeScanner = null;
        }
    };

    document.getElementById('parts-scan-btn').onclick = () => {
        if (typeof Html5QrcodeScanner === 'undefined') return NotificationSystem.show("Scanner library not loaded", "error");
        scanModal.showModal();
        
        html5QrcodeScanner = new Html5QrcodeScanner("qr-reader", { fps: 10, qrbox: {width: 250, height: 250} }, false);
        html5QrcodeScanner.render((decodedText) => {
            
            // Immediately hard-kill the scanner once a code is read
            try {
                html5QrcodeScanner.clear().catch(err => console.warn("Scanner clear forced:", err));
            } catch(e) {}
            scanModal.close();
            document.getElementById('qr-reader').innerHTML = '';
            html5QrcodeScanner = null;
            
            // Allow exact ID or SKU matching
            const part = state.partsCatalog.find(p => p.id === decodedText || p.sku === decodedText);
            if (part) {
                DialogSystem.confirm("Quick Deduct", `Deduct 1 unit of ${part.name}?`).then(confirmed => {
                    if (confirmed) adjustQty(part.id, -1);
                });
            } else {
                DialogSystem.confirm("Part Not Found", "Barcode not recognized. Add as new part?").then(confirmed => {
                    if (confirmed) {
                        openEditor(null);
                        document.getElementById('part-edit-sku').value = decodedText;
                    }
                });
            }
        }, (err) => { /* Ignore constant read errors */ });
    };

    // Boot
    renderAreaTabs();
    renderTable();
}