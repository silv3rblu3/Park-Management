// apps/inventory/app.js

function initInventoryLogic() {
    let invData = StateManager.getAppData('inventory');
    
    if (!invData.items || !invData.categories) {
        invData = { 
            items: [], 
            transactions: [],
            categories: [
                "General Supplies",
                "Plumbing",
                "Electrical",
                "Camping Gear",
                "Medical",
                "Fishing Gear",
                "Kitchen"
            ]
        };
        StateManager.setAppData('inventory', invData);
    }
    const safeSave = () => { StateManager.setAppData('inventory', invData); };

    // --- Core Logic ---
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

    const getReorderList = () => {
        let reorderList = [];
        invData.items.forEach(item => {
            const currentQty = getCurrentQty(item.sku);
            if (currentQty <= item.reorderLevel) {
                let orderAmount = item.targetQty - currentQty;
                if (orderAmount < 0) orderAmount = 0;
                reorderList.push({ sku: item.sku, itemName: item.name, currentQty: currentQty, qtyToOrder: orderAmount });
            }
        });
        return reorderList;
    };

    const addTransaction = (type, sku, quantity, notes) => {
        const item = invData.items.find(i => i.sku === sku);
        if (!item) return false;
        invData.transactions.push({
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
            sku: sku, type: type,
            quantity: parseFloat(quantity),
            actualUnitCost: item.unitCost || 0,
            notes: notes || ''
        });
        safeSave(); return true;
    };

    // --- Tab Routing ---
    const tabs = document.querySelectorAll('.inv-tab');
    const stage = document.getElementById('inv-stage');

    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            tabs.forEach(t => { t.classList.remove('btn-primary'); t.classList.add('btn-outline'); });
            e.target.classList.remove('btn-outline'); e.target.classList.add('btn-primary');
            renderInvView(e.target.getAttribute('data-target'));
        });
    });

    populateCategoryDatalist();

    function populateCategoryDatalist() {
        const dl = document.getElementById('inv-master-categories');
        if (dl) {
            dl.innerHTML = '';
            invData.categories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat;
                dl.appendChild(option);
            });
        }
    }

    let pendingAuditSku = null;
    let html5QrCode = null;

    function renderInvView(viewName) {
        stage.innerHTML = '';
        
        if (viewName !== 'audit' && html5QrCode) {
            html5QrCode.stop().then(() => {
                html5QrCode.clear();
                html5QrCode = null;
            }).catch(err => console.error("Scanner clear failed", err));
        }

        if (viewName !== 'reports') populateCategoryDatalist();

        if (viewName === 'dashboard') {
            let html = `
            <div class="app-card">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; flex-wrap: wrap; gap: 10px;">
                    <h3 style="margin: 0;">Main Dashboard</h3>
                    <input type="text" id="inv-search" class="app-input" placeholder="Search SKU or Name..." style="max-width: 300px; margin: 0;">
                </div>
                <div class="app-table-container">
                    <table class="app-table">
                        <thead><tr><th>SKU</th><th>Item Name</th><th>Category</th><th>Location</th><th>Qty on Hand</th><th>Reorder Level</th><th>Target Qty</th></tr></thead>
                        <tbody id="inv-dash-body">`;
            
            if (invData.items.length === 0) { html += `<tr><td colspan="7" style="text-align:center;">No items found. Import a CSV or add manually.</td></tr>`; } 
            else {
                invData.items.forEach(item => {
                    const qty = getCurrentQty(item.sku);
                    let rowClass = '';
                    if (qty <= 0) rowClass = 'inv-row-danger';
                    else if (qty <= item.reorderLevel) rowClass = 'inv-row-warning';

                    html += `<tr class="${rowClass}">
                                <td><strong>${item.sku}</strong></td><td>${item.name}</td><td>${item.category || ''}</td><td>${item.location || ''}</td>
                                <td style="font-size: 1.1rem; font-weight: bold;">${qty}</td><td>${item.reorderLevel}</td><td>${item.targetQty}</td>
                             </tr>`;
                });
            }
            html += `</tbody></table></div></div>`;
            stage.innerHTML = html;

            document.getElementById('inv-search').addEventListener('input', (e) => {
                const term = e.target.value.toLowerCase();
                const rows = document.querySelectorAll('#inv-dash-body tr');
                rows.forEach(row => { row.style.display = row.innerText.toLowerCase().includes(term) ? '' : 'none'; });
            });
        } 
        else if (viewName === 'transactions') {
            let html = `
            <div class="inv-split-layout">
                <div class="app-card">
                    <h3 style="margin-bottom: 15px; border-bottom: 1px solid var(--border-color); padding-bottom: 10px;">Log New Transaction</h3>
                    <form id="inv-trans-form">
                        <div style="display: flex; gap: 15px; margin-bottom: 15px; font-weight: bold;">
                            <label><input type="radio" name="t-type" value="Stock In" checked> Stock In (+)</label>
                            <label><input type="radio" name="t-type" value="Stock Out"> Stock Out (-)</label>
                        </div>
                        <label>Item (SKU)</label>
                        <select id="t-sku" class="app-select" required><option value="">Select an Item...</option>
                            ${invData.items.map(i => `<option value="${i.sku}">[${i.sku}] ${i.name}</option>`).join('')}
                        </select>
                        <label>Quantity</label><input type="number" id="t-qty" class="app-input" min="1" required>
                        <label>Notes</label><textarea id="t-notes" class="app-input" rows="2"></textarea>
                        <button type="submit" class="btn-primary" style="width: 100%;">Submit Transaction</button>
                    </form>
                </div>
                <div class="app-card">
                    <h3 style="margin-bottom: 15px; border-bottom: 1px solid var(--border-color); padding-bottom: 10px;">Recent Transactions</h3>
                    <div class="app-table-container" style="max-height: 400px; overflow-y: auto;">
                        <table class="app-table">
                            <thead><tr><th>Date</th><th>Type</th><th>Item</th><th>Qty</th></tr></thead>
                            <tbody>`;
            const recent = [...invData.transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 50);
            if (recent.length === 0) { html += `<tr><td colspan="4" style="text-align:center;">No recent transactions.</td></tr>`; } 
            else {
                recent.forEach(t => {
                    const iName = invData.items.find(i => i.sku === t.sku)?.name || 'Unknown';
                    html += `<tr><td>${new Date(t.date).toLocaleString([], {month:'numeric', day:'numeric', hour:'2-digit', minute:'2-digit'})}</td>
                             <td>${t.type}</td><td>${iName}</td><td>${t.type === 'Audit Correction' ? '' : (t.type === 'Stock In' ? '+' : '-')}${t.quantity}</td></tr>`;
                });
            }
            html += `</tbody></table></div></div></div>`;
            stage.innerHTML = html;

            document.getElementById('inv-trans-form').addEventListener('submit', (e) => {
                e.preventDefault();
                const type = document.querySelector('input[name="t-type"]:checked').value;
                if (addTransaction(type, document.getElementById('t-sku').value, document.getElementById('t-qty').value, document.getElementById('t-notes').value)) {
                    NotificationSystem.show('Transaction Saved', 'success'); renderInvView('transactions');
                }
            });
        }
        else if (viewName === 'audit') {
            stage.innerHTML = `
            <div class="app-card" style="text-align: center; max-width: 600px; margin: 0 auto;">
                <h3 style="margin-bottom: 15px;">Inventory Audit Scanner</h3>
                <input type="text" id="audit-manual-sku" class="app-input" placeholder="Type SKU manually and hit Enter..." style="font-size: 1.2rem; text-align: center; margin-bottom: 20px;">
                <div id="reader" style="width: 100%; margin: 0 auto 20px auto;"></div>
                <button id="start-scanner" class="btn-outline" style="width: 100%; margin-bottom: 20px;">📷 Start Camera Scanner</button>
                
                <div id="audit-form-area" class="hidden" style="background: rgba(0,0,0,0.03); padding: 20px; border-radius: var(--radius-md); border: 1px solid var(--accent-primary);">
                    <h2 id="audit-item-name" style="color: var(--accent-primary); margin-bottom: 10px;">Item Name</h2>
                    <p style="font-size: 1.1rem; margin-bottom: 5px;">SKU: <strong id="audit-sku-lbl"></strong></p>
                    <p style="font-size: 1.1rem; margin-bottom: 15px;">System Qty: <strong id="audit-sys-qty"></strong></p>
                    <form id="audit-process-form">
                        <input type="hidden" id="audit-hidden-sku">
                        <label style="font-weight: bold;">Actual Physical Count:</label>
                        <input type="number" id="audit-phys-qty" class="app-input" style="font-size: 1.5rem; text-align: center; width: 60%; margin: 10px auto;" required>
                        <div style="display: flex; gap: 10px; justify-content: center; margin-top: 15px;">
                            <button type="button" id="cancel-audit-btn" class="btn-outline">Cancel</button>
                            <button type="submit" class="btn-primary">Save Correction</button>
                        </div>
                    </form>
                </div>
            </div>`;

            const startBtn = document.getElementById('start-scanner');
            const formArea = document.getElementById('audit-form-area');
            const readerDiv = document.getElementById('reader');

            const loadAuditItem = (sku) => {
                const item = invData.items.find(i => i.sku === sku);
                
                if (!item) {
                    if (html5QrCode) { 
                        html5QrCode.stop().then(() => {
                            html5QrCode.clear(); 
                            html5QrCode = null;
                        }).catch(err => console.log(err)); 
                        startBtn.style.display = 'block'; 
                    }
                    readerDiv.classList.add('hidden');
                    startBtn.classList.add('hidden');
                    
                    DialogSystem.confirm("Barcode Not Found", `The SKU [${sku}] isn't in your master list. Do you want to add it now?`)
                    .then(confirm => {
                        if (confirm) {
                            document.getElementById('new-sku').value = sku;
                            document.getElementById('inv-add-modal').showModal();
                        } else {
                            document.getElementById('audit-manual-sku').value = '';
                            startBtn.classList.remove('hidden');
                        }
                    });
                    return;
                }
                
                if (html5QrCode) { 
                    html5QrCode.stop().then(() => {
                        html5QrCode.clear(); 
                        html5QrCode = null;
                    }).catch(err => console.log(err)); 
                    startBtn.style.display = 'block'; 
                }
                
                document.getElementById('audit-item-name').innerText = item.name;
                document.getElementById('audit-sku-lbl').innerText = item.sku;
                document.getElementById('audit-sys-qty').innerText = getCurrentQty(sku);
                document.getElementById('audit-hidden-sku').value = item.sku;
                document.getElementById('audit-phys-qty').value = '';
                
                readerDiv.classList.add('hidden'); 
                startBtn.classList.add('hidden');
                formArea.classList.remove('hidden');
                document.getElementById('audit-phys-qty').focus();
            };

            document.getElementById('audit-manual-sku').addEventListener('change', (e) => loadAuditItem(e.target.value.toUpperCase()));

            startBtn.addEventListener('click', () => {
                startBtn.style.display = 'none'; 
                readerDiv.classList.remove('hidden');
                
                html5QrCode = new Html5Qrcode("reader");
                html5QrCode.start(
                    { facingMode: "environment" }, 
                    { fps: 10, qrbox: { width: 250, height: 250 } },
                    (decodedText) => { loadAuditItem(decodedText.trim().toUpperCase()); },
                    (err) => {} // Ignore frame errors
                ).catch((err) => {
                    NotificationSystem.show("Camera access denied or rear camera unavailable.", "error");
                    startBtn.style.display = 'block';
                    readerDiv.classList.add('hidden');
                });
            });

            document.getElementById('cancel-audit-btn').addEventListener('click', () => {
                formArea.classList.add('hidden'); 
                readerDiv.classList.remove('hidden'); 
                startBtn.classList.remove('hidden'); 
                startBtn.style.display = 'block';
                document.getElementById('audit-manual-sku').value = '';
            });

            document.getElementById('audit-process-form').addEventListener('submit', (e) => {
                e.preventDefault();
                const sku = document.getElementById('audit-hidden-sku').value;
                const physical = parseFloat(document.getElementById('audit-phys-qty').value);
                const sysQty = getCurrentQty(sku);
                const discrepancy = physical - sysQty;

                if (discrepancy !== 0) {
                    addTransaction('Audit Correction', sku, physical, `System said ${sysQty}, Physical was ${physical}`);
                    NotificationSystem.show('Audit Correction Logged', 'success');
                } else {
                    NotificationSystem.show('Count matches. No change made.', 'success');
                }
                
                formArea.classList.add('hidden'); 
                readerDiv.classList.remove('hidden'); 
                startBtn.style.display = 'block'; 
                startBtn.classList.remove('hidden');
                document.getElementById('audit-manual-sku').value = '';
            });

            if (pendingAuditSku) {
                const skuToLoad = pendingAuditSku;
                pendingAuditSku = null;
                setTimeout(() => loadAuditItem(skuToLoad), 100); 
            }
        }
        else if (viewName === 'reports') {
            
            // Calculate defaults for Date Pickers
            const todayStr = new Date().toISOString().split('T')[0];
            const lastYear = new Date();
            lastYear.setFullYear(lastYear.getFullYear() - 1);
            const lastYearStr = lastYear.toISOString().split('T')[0];

            stage.innerHTML = `
            <div class="inv-split-layout">
                
                <div class="app-card inv-no-print" style="border-left: 4px solid var(--accent-primary);">
                    <h3 style="margin-bottom: 15px; border-bottom: 1px solid var(--border-color); padding-bottom: 10px;">Yearly Usage Report Generator</h3>
                    <p style="color: var(--text-secondary); margin-bottom: 15px;">Define a date range to calculate total item usage and restocking history.</p>
                    
                    <div style="display: flex; gap: 15px; flex-wrap: wrap; margin-bottom: 15px; align-items: flex-end;">
                        <div style="flex: 1; min-width: 150px;">
                            <label style="font-weight: bold; font-size: 0.9rem;">Start Date</label>
                            <input type="date" id="report-start" class="app-input" value="${lastYearStr}" style="margin-bottom: 0;">
                        </div>
                        <div style="flex: 1; min-width: 150px;">
                            <label style="font-weight: bold; font-size: 0.9rem;">End Date</label>
                            <input type="date" id="report-end" class="app-input" value="${todayStr}" style="margin-bottom: 0;">
                        </div>
                        <button id="generate-report-btn" class="btn-primary" style="flex: 1; min-width: 150px; padding: 11px;">📊 Generate Report</button>
                        <button id="print-report-btn" class="btn-outline hidden" style="flex: 1; min-width: 150px; padding: 11px;">🖨️ Print Report</button>
                    </div>
                    
                    <div id="report-results-container" class="app-table-container hidden" style="margin-top: 20px; max-height: 400px; overflow-y: auto;">
                        </div>
                </div>

                <div class="app-card inv-no-print">
                    <h3 style="margin-bottom: 15px; border-bottom: 1px solid var(--border-color); padding-bottom: 10px;">Database Sync & Backup</h3>
                    
                    <div style="display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap;">
                        <input type="file" id="csv-import-items" accept=".csv" class="hidden">
                        <button class="btn-outline" style="flex: 1; min-width: 200px;" onclick="document.getElementById('csv-import-items').click()">📥 Import Items (CSV)</button>
                        
                        <input type="file" id="csv-import-trans" accept=".csv" class="hidden">
                        <button class="btn-outline" style="flex: 1; min-width: 200px;" onclick="document.getElementById('csv-import-trans').click()">📥 Import Trans (CSV)</button>
                    </div>

                    <h4 style="margin-top: 20px; margin-bottom: 10px;">Full Inventory Sync (JSON)</h4>
                    <p style="color: var(--text-secondary); margin-bottom: 10px; font-size: 0.85rem;">Export or merge complete inventory state (items, categories, and transactions) to sync across devices.</p>
                    
                    <button id="export-inv-json-btn" class="btn-primary" style="width: 100%; margin-bottom: 10px;">⬇️ Export Inventory Sync File (.json)</button>
                    
                    <input type="file" id="import-inv-json-file" accept=".json" class="hidden">
                    <button class="btn-outline" style="width: 100%; margin-bottom: 10px; border-color: var(--accent-primary); color: var(--accent-primary);" onclick="document.getElementById('import-inv-json-file').click()">🔄 Merge Sync File (.json)</button>
                </div>
                
                <div class="app-card inv-no-print">
                    <h3 style="margin-bottom: 15px; border-bottom: 1px solid var(--border-color); padding-bottom: 10px;">Category Manager</h3>
                    <p style="color: var(--text-secondary); margin-bottom: 15px;">Add or soft-delete categories in the master list. Soft-deleted categories won't appear in the dropdown but existing items are unaffected.</p>
                    
                    <div style="display: flex; gap: 10px; margin-bottom: 15px; flex-wrap: wrap;">
                        <input type="text" id="new-master-cat" class="app-input" placeholder="New category name..." style="flex: 2; min-width: 200px; margin-bottom: 0;">
                        <button id="add-master-cat" class="btn-primary" style="flex: 1; min-width: 150px;">+ Add to Master</button>
                    </div>
                    
                    <div class="app-table-container" style="max-height: 250px; overflow-y: auto;">
                        <table class="app-table">
                            <thead><tr><th>Active Master Categories</th><th style="width: 50px; text-align: center;">⚙️</th></tr></thead>
                            <tbody>
                                ${invData.categories.map((cat, index) => `
                                    <tr>
                                        <td>${cat}</td>
                                        <td style="text-align: center;">
                                            <button class="btn-danger delete-master-cat" data-index="${index}" style="padding: 2px 6px; font-size: 0.8rem;">X</button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>`;

            // --- Report Generator Logic ---
            document.getElementById('generate-report-btn').addEventListener('click', () => {
                const startStr = document.getElementById('report-start').value;
                const endStr = document.getElementById('report-end').value;
                
                if(!startStr || !endStr) return NotificationSystem.show("Please select both dates", "error");
                
                const startDate = new Date(startStr);
                const endDate = new Date(endStr);
                endDate.setHours(23, 59, 59, 999); // Push end date to the very end of the day

                // Build mapping object
                const usageStats = {};
                invData.items.forEach(i => {
                    usageStats[i.sku] = { name: i.name, added: 0, used: 0 };
                });

                // Tally transactions within date range
                invData.transactions.forEach(t => {
                    const tDate = new Date(t.date);
                    if (tDate >= startDate && tDate <= endDate && usageStats[t.sku]) {
                        const qty = parseFloat(t.quantity);
                        if (t.type === 'Stock In') usageStats[t.sku].added += qty;
                        if (t.type === 'Stock Out') usageStats[t.sku].used += qty;
                        // Note: Audit Corrections are skipped here because they reflect a static count, not active usage.
                    }
                });

                let tableHtml = `
                <table class="app-table">
                    <thead><tr><th>SKU</th><th>Item Name</th><th style="text-align: center;">Stock Added (+)</th><th style="text-align: center;">Stock Used (-)</th></tr></thead>
                    <tbody>
                `;
                
                let hasData = false;
                for (const sku in usageStats) {
                    if (usageStats[sku].added > 0 || usageStats[sku].used > 0) {
                        hasData = true;
                        tableHtml += `
                            <tr>
                                <td><strong>${sku}</strong></td>
                                <td>${usageStats[sku].name}</td>
                                <td style="color: var(--accent-primary); font-weight: bold; text-align: center;">${usageStats[sku].added > 0 ? '+' + usageStats[sku].added : 0}</td>
                                <td style="color: var(--danger-color); font-weight: bold; text-align: center;">${usageStats[sku].used > 0 ? '-' + usageStats[sku].used : 0}</td>
                            </tr>
                        `;
                    }
                }

                if (!hasData) {
                    tableHtml += `<tr><td colspan="4" style="text-align: center;">No inventory activity found in this date range.</td></tr>`;
                }
                tableHtml += `</tbody></table>`;

                const resultsContainer = document.getElementById('report-results-container');
                resultsContainer.innerHTML = tableHtml;
                resultsContainer.classList.remove('hidden');
                document.getElementById('print-report-btn').classList.remove('hidden');
            });

            // --- Report Print Logic ---
            document.getElementById('print-report-btn').addEventListener('click', () => {
                const start = document.getElementById('report-start').value;
                const end = document.getElementById('report-end').value;
                const tableHtml = document.getElementById('report-results-container').innerHTML;
                
                const printStage = document.getElementById('inv-print-stage');
                printStage.innerHTML = `
                    <div style="margin-bottom: 20px; border-bottom: 2px solid black; padding-bottom: 10px;">
                        <h2 style="margin-bottom: 5px;">Inventory Usage Report</h2>
                        <p style="font-size: 1.1rem;"><strong>Date Range:</strong> ${start} to ${end}</p>
                    </div>
                    ${tableHtml}
                `;
                window.print();
            });

            // JSON Export/Import Integrations
            document.getElementById('export-inv-json-btn').addEventListener('click', () => {
                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(invData, null, 2));
                const anchor = document.createElement('a');
                anchor.setAttribute("href", dataStr); 
                anchor.setAttribute("download", `PMH_Inventory_Sync_${new Date().toISOString().split('T')[0]}.json`);
                document.body.appendChild(anchor); 
                anchor.click(); 
                anchor.remove();
                NotificationSystem.show('Inventory Sync File Exported', 'success');
            });

            document.getElementById('import-inv-json-file').addEventListener('change', (e) => {
                if(e.target.files.length > 0) {
                    DialogSystem.confirm("Merge Inventory Data?", "This will sync the uploaded file with your current data. It updates existing items, adds new items, and merges transaction logs without creating duplicates. Proceed?")
                    .then(confirm => {
                        if (confirm) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                                try {
                                    const importedData = JSON.parse(event.target.result);
                                    if (!importedData.items || !importedData.transactions || !importedData.categories) {
                                        throw new Error("Invalid inventory sync format.");
                                    }

                                    importedData.categories.forEach(cat => {
                                        if (!invData.categories.includes(cat)) {
                                            invData.categories.push(cat);
                                        }
                                    });

                                    importedData.items.forEach(importedItem => {
                                        const existingIndex = invData.items.findIndex(i => i.sku === importedItem.sku);
                                        if (existingIndex > -1) {
                                            invData.items[existingIndex] = { ...invData.items[existingIndex], ...importedItem };
                                        } else {
                                            invData.items.push(importedItem);
                                        }
                                    });

                                    importedData.transactions.forEach(importedTx => {
                                        if (!invData.transactions.some(t => t.id === importedTx.id)) {
                                            invData.transactions.push(importedTx);
                                        }
                                    });

                                    safeSave();
                                    NotificationSystem.show('Inventory Data Merged Successfully', 'success');
                                    renderInvView('reports'); 
                                } catch (err) { 
                                    NotificationSystem.show('Import Failed: Invalid JSON file', 'error'); 
                                }
                            }; 
                            reader.readAsText(e.target.files[0]);
                        }
                        e.target.value = ''; 
                    });
                }
            });

            // PapaParse Integrations (CSV)
            document.getElementById('csv-import-items').addEventListener('change', (e) => {
                if(e.target.files.length > 0) {
                    Papa.parse(e.target.files[0], { header: true, skipEmptyLines: true, complete: function(results) {
                        const newItems = results.data.map(row => { return {
                            sku: row['SKU'] || '', name: row['Item Name'] || '', vendor: row['Vendor'] || '', desc: row['Description'] || '', category: row['Category'] || '', location: row['Location'] || '',
                            unitCost: parseFloat((row['Unit Cost'] || '0').replace(/[^0-9.-]+/g,"")), reorderLevel: parseInt(row['Reorder Level'] || 0), targetQty: parseInt(row['Target Qty'] || 0)
                        };}).filter(i => i.sku !== '');
                        invData.items = newItems; safeSave();
                        NotificationSystem.show('Master Items Imported!', 'success'); renderInvView('reports');
                    }});
                }
            });

            document.getElementById('csv-import-trans').addEventListener('change', (e) => {
                if(e.target.files.length > 0) {
                    Papa.parse(e.target.files[0], { header: true, skipEmptyLines: true, complete: function(results) {
                        const newTrans = results.data.map(row => { return {
                            id: crypto.randomUUID(), date: row['Date'] ? new Date(row['Date']).toISOString() : new Date().toISOString(), sku: row['SKU'] || '', type: row['Type'] || 'Stock In',
                            quantity: parseFloat(row['Quantity'] || 0), actualUnitCost: parseFloat((row['Unit Cost (Actual)'] || '0').replace(/[^0-9.-]+/g,"")), notes: row['Notes'] || ''
                        };}).filter(t => t.sku !== '');
                        invData.transactions = newTrans; safeSave();
                        NotificationSystem.show('Transactions Imported!', 'success'); renderInvView('reports');
                    }});
                }
            });

            // --- Logic for Category Manager ---
            document.getElementById('add-master-cat').addEventListener('click', () => {
                const name = document.getElementById('new-master-cat').value.trim();
                if (name && !invData.categories.includes(name)) {
                    invData.categories.push(name);
                    safeSave();
                    NotificationSystem.show(`'${name}' added to master list.`, 'success');
                    renderInvView('reports');
                } else if (name) {
                    NotificationSystem.show(`Category '${name}' already exists.`, 'error');
                }
            });

            document.querySelectorAll('.delete-master-cat').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const index = parseInt(e.target.getAttribute('data-index'));
                    DialogSystem.confirm("Confirm Soft-Delete", `Are you sure you want to remove '${invData.categories[index]}' from the master list? Existing items will keep this category staticly, but it won't appear in the 'Add Item' dropdown.`)
                    .then(confirm => {
                        if (confirm) {
                            invData.categories.splice(index, 1);
                            safeSave();
                            renderInvView('reports');
                        }
                    });
                });
            });
        }
    }

    // --- Manual Item Modal and 'Smart Routing' in Audit ---
    const addModal = document.getElementById('inv-add-modal');
    document.getElementById('inv-add-item-btn').addEventListener('click', () => addModal.showModal());
    document.getElementById('close-inv-add').addEventListener('click', () => addModal.close());
    
    document.getElementById('inv-add-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const sku = document.getElementById('new-sku').value.toUpperCase();
        if(invData.items.find(i => i.sku === sku)) return NotificationSystem.show('SKU already exists!', 'error');
        
        invData.items.push({
            sku: sku, name: document.getElementById('new-name').value, category: document.getElementById('new-cat').value, location: document.getElementById('new-loc').value,
            reorderLevel: parseFloat(document.getElementById('new-reorder').value), targetQty: parseFloat(document.getElementById('new-target').value), unitCost: parseFloat(document.getElementById('new-cost').value)
        });
        
        safeSave(); 
        e.target.reset(); 
        addModal.close(); 
        NotificationSystem.show('Item Added to Master List', 'success');
        
        const activeTab = document.querySelector('.inv-tab.btn-primary').getAttribute('data-target');
        if (activeTab === 'audit') {
            pendingAuditSku = sku;
            renderInvView('audit'); 
        } else {
            renderInvView(activeTab); 
        }
    });

    // Boot
    renderInvView('dashboard');
}