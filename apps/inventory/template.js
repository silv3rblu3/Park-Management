// apps/inventory/template.js

function renderInventoryApp() {
    return `
    <style>
        /* App-Specific Styling */
        #inv-wrapper { max-width: 1200px; margin: 0 auto; }
        #inv-stage { margin-top: 20px; }
        .inv-split-layout { display: flex; flex-direction: column; gap: 20px; }
        
        /* Functional States - styled by downstream agent */
        .inv-row-danger { /* Highlight when stock <= 0 */ }
        .inv-row-warning { /* Highlight when stock <= reorderLevel */ }
        .inv-print-only { display: none !important; }
        .inv-no-print { display: block; }
        
        @media print {
            #global-header, #bento-menu, .inv-no-print, .inv-tab-container, #inv-add-item-btn { display: none !important; }
            #app-container { height: auto !important; overflow: visible !important; padding: 0 !important; }
            #inv-wrapper { width: 100%; margin: 0 !important; padding: 0 !important; border: none !important; }
            .inv-print-only { display: block !important; position: absolute; left: 0; top: 0; width: 100%; background: white; color: black; }
            table.app-table { border-collapse: collapse !important; width: 100% !important; margin-top: 20px; }
            table.app-table th, table.app-table td { border: 1px solid black !important; padding: 8px !important; color: black !important; font-size: 0.9rem !important; text-align: left; }
        }
    </style>

    <div id="inv-wrapper" class="inv-no-print">
        <div class="app-toolbar" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <div class="inv-tab-container" style="display: flex; gap: 10px;">
                <button class="inv-tab btn-primary" data-target="dashboard">📦 Dashboard</button>
                <button class="inv-tab btn-outline" data-target="transactions">📝 Transactions</button>
                <button class="inv-tab btn-outline" data-target="audit">🔍 Audit Scanner</button>
                <button class="inv-tab btn-outline" data-target="reports">📊 Reports & Data</button>
            </div>
            <button id="inv-add-item-btn" class="btn-primary">+ Add New Item</button>
        </div>

        <div id="inv-stage">
            </div>

        <dialog id="inv-add-modal">
            <div class="modal-header">
                <h3>Add New Master Item</h3>
                <button id="close-inv-add" class="icon-btn">❌</button>
            </div>
            <form id="inv-add-form" class="modal-body">
                <label>SKU (Barcode Value)</label><input type="text" id="new-sku" class="app-input" placeholder="e.g., 1002345" required>
                <label>Item Name</label><input type="text" id="new-name" class="app-input" placeholder="e.g., General Purpose Rope" required>
                
                <label>Category (Dropdown/Editable)</label>
                <input type="text" id="new-cat" class="app-input" list="inv-master-categories" placeholder="e.g., General Supplies">
                <datalist id="inv-master-categories">
                    </datalist>
                <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: -10px; margin-bottom: 10px;">To manage the master list, go to the 'Reports & Data' tab.</p>

                <label>Storage Location</label><input type="text" id="new-loc" class="app-input" placeholder="e.g., Shed A, Bin 3">
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                    <div><label>Target Quantity (Pars)</label><input type="number" id="new-target" class="app-input" placeholder="100" required></div>
                    <div><label>Reorder Level (Low Stock)</label><input type="number" id="new-reorder" class="app-input" placeholder="25" required></div>
                </div>
                
                <label>Estimated Unit Cost ($)</label><input type="number" id="new-cost" class="app-input" placeholder="4.50" step="0.01">
                
                <div style="text-align: right; margin-top: 20px;">
                    <button type="submit" class="btn-primary" style="width: 100%;">💾 Save to Master List</button>
                </div>
            </form>
        </dialog>
    </div>
    
    <div id="inv-print-stage" class="inv-print-only"></div>
    `;
}