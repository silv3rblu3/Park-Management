// apps/inventory/app.js

function initInventoryLogic() {
    let invData = StateManager.getAppData('inventory');
    
    // Initialize defaults if empty
    if (!invData.items) {
        invData = { items: [], transactions: [] };
        StateManager.setAppData('inventory', invData);
    }

    const safeSave = () => {
        StateManager.setAppData('inventory', invData);
    };

    // --- Core Logic Helpers (From your logic.js) ---
    const getCurrentQty = (sku) => {
        let qty = 0;
        const itemTrans = invData.transactions.filter(t => t.sku === sku);
        
        itemTrans.forEach(t => {
            if (t.type === 'Stock In') qty += parseFloat(t.quantity);
            else if (t.type === 'Stock Out') qty -= parseFloat(t.quantity);
            else if (t.type === 'Audit Correction') qty = parseFloat(t.quantity); 
        });
        return qty;
    };

    // --- UI Routing (Tabs) ---
    const tabs = document.querySelectorAll('.inv-tab');
    const stage = document.getElementById('inv-main-stage');

    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            tabs.forEach(t => { t.classList.remove('btn-primary'); t.classList.add('btn-outline'); });
            e.target.classList.remove('btn-outline'); e.target.classList.add('btn-primary');
            renderInvView(e.target.getAttribute('data-target'));
        });
    });

    function renderInvView(viewName) {
        stage.innerHTML = '';
        
        if (viewName === 'inv-view-dashboard') {
            let html = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; flex-wrap: wrap; gap: 10px;">
                    <h3>Master Dashboard</h3>
                    <input type="text" id="inv-local-search" class="app-input" placeholder="Search SKU or Name..." style="max-width: 300px; margin-bottom: 0;">
                </div>
                <div class="app-table-container">
                    <table class="app-table">
                        <thead>
                            <tr>
                                <th>SKU</th>
                                <th>Item Name</th>
                                <th>Category</th>
                                <th>Location</th>
                                <th>Current Qty</th>
                                <th>Target</th>
                            </tr>
                        </thead>
                        <tbody id="inv-dashboard-body">`;
            
            if (invData.items.length === 0) {
                html += `<tr><td colspan=\"6\" style=\"text-align:center;\">No items found. Import a CSV or add manually.</td></tr>`;
            } else {
                invData.items.forEach(item => {
                    const qty = getCurrentQty(item.sku);
                    let rowStyle = '';
                    if (qty <= 0) rowStyle = 'background-color: rgba(231, 76, 60, 0.1);';
                    else if (qty <= item.reorderLevel) rowStyle = 'background-color: rgba(243, 156, 18, 0.1);';

                    html += `<tr style="${rowStyle}">
                                <td><strong>${item.sku}</strong></td>
                                <td>${item.name}</td>
                                <td>${item.category}</td>
                                <td>${item.location || 'N/A'}</td>
                                <td style=\"font-size: 1.1rem; font-weight: bold;\">${qty}</td>
                                <td>${item.targetQty}</td>
                             </tr>`;
                });
            }
            html += `</tbody></table></div>`;
            stage.innerHTML = html;

            // Bind Local Search
            document.getElementById('inv-local-search').addEventListener('input', (e) => {
                const term = e.target.value.toLowerCase();
                const rows = document.querySelectorAll('#inv-dashboard-body tr');
                rows.forEach(row => {
                    const text = row.innerText.toLowerCase();
                    row.style.display = text.includes(term) ? '' : 'none';
                });
            });
        } 
        else if (viewName === 'inv-view-transactions') {
            let html = `<h3>Recent Transactions</h3>
                        <div class="app-table-container" style="margin-top: 15px;">
                            <table class="app-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Type</th>
                                        <th>SKU</th>
                                        <th>Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>`;
            
            const recent = [...invData.transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 50);
            if (recent.length === 0) {
                html += `<tr><td colspan=\"4\" style=\"text-align:center;\">No recent transactions.</td></tr>`;
            } else {
                recent.forEach(t => {
                    html += `<tr>
                                <td>${new Date(t.date).toLocaleDateString()} ${new Date(t.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                                <td>${t.type}</td>
                                <td><strong>${t.sku}</strong></td>
                                <td>${t.quantity}</td>
                             </tr>`;
                });
            }
            html += `</tbody></table></div>`;
            stage.innerHTML = html;
        }
        else if (viewName === 'inv-view-reports') {
            let html = `<div style="display: flex; justify-content: space-between; align-items: center;">
                            <h3>Reorder List</h3>
                            <button id="print-reorder-btn" class="btn-outline">🖨️ Print List</button>
                        </div>
                        <div class="app-table-container" style="margin-top: 15px;">
                            <table class="app-table" id="reorder-print-area">
                                <thead>
                                    <tr>
                                        <th>SKU</th>
                                        <th>Item Name</th>
                                        <th>Current Qty</th>
                                        <th>Target Qty</th>
                                        <th>Qty To Order</th>
                                    </tr>
                                </thead>
                                <tbody>`;
            
            let reorderNeeded = false;
            invData.items.forEach(item => {
                const qty = getCurrentQty(item.sku);
                if (qty <= item.reorderLevel) {
                    reorderNeeded = true;
                    let orderAmount = item.targetQty - qty;
                    html += `<tr>
                                <td><strong>${item.sku}</strong></td>
                                <td>${item.name}</td>
                                <td style=\"color: var(--danger-color); font-weight: bold;\">${qty}</td>
                                <td>${item.targetQty}</td>
                                <td style=\"font-weight: bold; font-size: 1.1rem;\">${orderAmount}</td>
                             </tr>`;
                }
            });

            if(!reorderNeeded) html += `<tr><td colspan=\"5\" style=\"text-align:center;\">All stock levels are optimal!</td></tr>`;
            html += `</tbody></table></div>`;
            stage.innerHTML = html;

            document.getElementById('print-reorder-btn').addEventListener('click', () => {
                const printContent = document.getElementById('reorder-print-area').outerHTML;
                const win = window.open('', '', 'width=800,height=600');
                win.document.write('<html><head><title>Reorder List</title><style>table{width:100%;border-collapse:collapse;}th,td{border:1px solid #000;padding:8px;text-align:left;}</style></head><body>');
                win.document.write('<h2>Inventory Reorder List</h2>');
                win.document.write(printContent);
                win.document.write('</body></html>');
                win.document.close();
                win.print();
            });
        }
    }

    // --- Modal Logic ---

    // 1. Add Item Modal
    const itemModal = document.getElementById('inv-item-modal');
    document.getElementById('inv-add-item-btn').addEventListener('click', () => itemModal.showModal());
    document.getElementById('close-item-modal').addEventListener('click', () => itemModal.close());
    
    document.getElementById('inv-item-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const sku = document.getElementById('item-sku').value.toUpperCase();
        
        if(invData.items.find(i => i.sku === sku)) {
            NotificationSystem.show('SKU already exists!', 'error');
            return;
        }

        invData.items.push({
            sku: sku,
            name: document.getElementById('item-name').value,
            vendor: document.getElementById('item-vendor').value || '',
            description: document.getElementById('item-desc').value || '',
            category: document.getElementById('item-category').value,
            location: document.getElementById('item-location').value,
            reorderLevel: parseFloat(document.getElementById('item-reorder').value),
            targetQty: parseFloat(document.getElementById('item-target').value),
            unitCost: parseFloat(document.getElementById('item-cost').value)
        });

        safeSave();
        e.target.reset();
        itemModal.close();
        NotificationSystem.show('Item Added', 'success');
        renderInvView(document.querySelector('.inv-tab.btn-primary').getAttribute('data-target'));
    });

    // 2. Transaction Modal
    const transModal = document.getElementById('inv-trans-modal');
    document.getElementById('inv-log-trans-btn').addEventListener('click', () => {
        const select = document.getElementById('trans-sku');
        select.innerHTML = '<option value=\"\">Select an Item...</option>';
        invData.items.forEach(i => {
            select.innerHTML += `<option value=\"${i.sku}\">[${i.sku}] ${i.name}</option>`;
        });
        transModal.showModal();
    });
    document.getElementById('close-trans-modal').addEventListener('click', () => transModal.close());

    document.getElementById('inv-trans-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const sku = document.getElementById('trans-sku').value;
        const item = invData.items.find(i => i.sku === sku);

        invData.transactions.push({
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
            type: document.getElementById('trans-type').value,
            sku: sku,
            quantity: parseFloat(document.getElementById('trans-qty').value),
            actualUnitCost: item ? item.unitCost : 0,
            notes: document.getElementById('trans-notes').value
        });

        safeSave();
        e.target.reset();
        transModal.close();
        NotificationSystem.show('Transaction Saved', 'success');
        renderInvView(document.querySelector('.inv-tab.btn-primary').getAttribute('data-target'));
    });

    // 3. Audit/Scan Modal (html5-qrcode Integration)
    const auditModal = document.getElementById('inv-audit-modal');
    const startScannerBtn = document.getElementById('start-scanner-btn');
    let html5QrcodeScanner = null;
    
    document.getElementById('inv-audit-btn').addEventListener('click', () => {
        document.getElementById('audit-sku-input').value = '';
        document.getElementById('audit-result-area').style.display = 'none';
        document.getElementById('reader').innerHTML = ''; // Clear old scanner instances
        startScannerBtn.style.display = 'block';
        auditModal.showModal();
    });
    
    document.getElementById('close-audit-modal').addEventListener('click', () => {
        if(html5QrcodeScanner) {
            html5QrcodeScanner.clear().catch(error => console.error("Failed to clear scanner.", error));
            html5QrcodeScanner = null;
        }
        auditModal.close();
    });

    // Manual Barcode Entry Fallback
    document.getElementById('audit-sku-input').addEventListener('change', (e) => {
        processScannedSKU(e.target.value.toUpperCase());
    });

    startScannerBtn.addEventListener('click', () => {
        startScannerBtn.style.display = 'none';
        html5QrcodeScanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: {width: 250, height: 250} }, false);
        
        html5QrcodeScanner.render((decodedText) => {
            // Stop scanner on success
            html5QrcodeScanner.clear().then(() => {
                startScannerBtn.style.display = 'block';
                processScannedSKU(decodedText.trim().toUpperCase());
            }).catch(error => console.error("Failed to clear scanner.", error));
        }, (error) => { /* ignore frame errors */ });
    });

    function processScannedSKU(sku) {
        const item = invData.items.find(i => i.sku === sku);
        if(!item) {
            NotificationSystem.show('SKU Not Found in Master List', 'error');
            document.getElementById('audit-sku-input').value = '';
            return;
        }

        document.getElementById('audit-sku-input').value = sku;
        document.getElementById('audit-item-title').innerText = item.name;
        document.getElementById('audit-sys-qty').innerText = getCurrentQty(sku);
        document.getElementById('audit-physical-qty').value = '';
        document.getElementById('audit-result-area').style.display = 'block';
    }

    document.getElementById('submit-audit-btn').addEventListener('click', () => {
        const sku = document.getElementById('audit-sku-input').value.toUpperCase();
        const physicalQty = parseFloat(document.getElementById('audit-physical-qty').value);
        
        if (isNaN(physicalQty)) return;

        const systemQty = getCurrentQty(sku);
        const discrepancy = physicalQty - systemQty;

        if (discrepancy !== 0) {
            const item = invData.items.find(i => i.sku === sku);
            invData.transactions.push({
                id: crypto.randomUUID(),
                date: new Date().toISOString(),
                type: 'Audit Correction',
                sku: sku,
                quantity: physicalQty, 
                actualUnitCost: item ? item.unitCost : 0,
                notes: `System said ${systemQty}, Physical count was ${physicalQty}`
            });
            safeSave();
            NotificationSystem.show('Audit Discrepancy Corrected', 'success');
        } else {
            NotificationSystem.show('Count matches system. No change needed.', 'success');
        }

        if(html5QrcodeScanner) {
            html5QrcodeScanner.clear().catch(e => console.error(e));
            html5QrcodeScanner = null;
        }
        auditModal.close();
        renderInvView(document.querySelector('.inv-tab.btn-primary').getAttribute('data-target'));
    });

    // 4. CSV Imports (PapaParse Integration)
    document.getElementById('import-items-btn').addEventListener('click', () => document.getElementById('file-import-items').click());
    document.getElementById('file-import-items').addEventListener('change', (e) => {
        if(e.target.files.length > 0) {
            Papa.parse(e.target.files[0], {
                header: true, skipEmptyLines: true,
                complete: function(results) {
                    const newItems = results.data.map(row => {
                        return {
                            sku: row['SKU'] || '',
                            name: row['Item Name'] || '',
                            vendor: row['Vendor'] || '',
                            description: row['Description'] || '',
                            category: row['Category'] || '',
                            location: row['Location'] || '',
                            reorderLevel: parseInt(row['Reorder Level'] || 0),
                            targetQty: parseInt(row['Target Qty'] || 0),
                            unitCost: parseFloat((row['Unit Cost'] || '0').replace(/[^0-9.-]+/g,""))
                        };
                    }).filter(item => item.sku !== '');
                    
                    invData.items = newItems;
                    safeSave();
                    e.target.value = ''; // reset input
                    NotificationSystem.show('Master Items Imported Successfully!', 'success');
                    renderInvView(document.querySelector('.inv-tab.btn-primary').getAttribute('data-target'));
                }
            });
        }
    });

    document.getElementById('import-trans-btn').addEventListener('click', () => document.getElementById('file-import-trans').click());
    document.getElementById('file-import-trans').addEventListener('change', (e) => {
        if(e.target.files.length > 0) {
            Papa.parse(e.target.files[0], {
                header: true, skipEmptyLines: true,
                complete: function(results) {
                    const newTrans = results.data.map(row => {
                        return {
                            id: crypto.randomUUID(),
                            date: row['Date'] ? new Date(row['Date']).toISOString() : new Date().toISOString(),
                            sku: row['SKU'] || '',
                            type: row['Type'] || 'Stock In',
                            quantity: parseFloat(row['Quantity'] || 0),
                            actualUnitCost: parseFloat((row['Unit Cost (Actual)'] || '0').replace(/[^0-9.-]+/g,"")),
                            notes: row['Notes'] || ''
                        };
                    }).filter(t => t.sku !== '');
                    
                    invData.transactions = newTrans;
                    safeSave();
                    e.target.value = '';
                    NotificationSystem.show('Transactions Imported Successfully!', 'success');
                    renderInvView(document.querySelector('.inv-tab.btn-primary').getAttribute('data-target'));
                }
            });
        }
    });

    // Initialize Default View
    renderInvView('inv-view-dashboard');
}