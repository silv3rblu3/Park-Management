// apps/inventory/template.js

function renderInventoryApp() {
    return `
    <style>
        /* Local App Styles for Inventory */
        .inv-split-layout { display: grid; grid-template-columns: 1fr 2fr; gap: 20px; }
        @media (max-width: 768px) { .inv-split-layout { grid-template-columns: 1fr; } }
        .inv-row-danger { background-color: rgba(231, 76, 60, 0.1) !important; }
        .inv-row-warning { background-color: rgba(243, 156, 18, 0.1) !important; }
        @media print {
            #global-header, #bento-menu, .inv-no-print { display: none !important; }
            #app-container { height: auto !important; overflow: visible !important; padding: 0 !important; }
            .inv-print-only { display: block !important; }
        }
    </style>

    <div id="inv-wrapper" style="max-width: 1200px; margin: 0 auto;">
        
        <div class="app-toolbar inv-no-print" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="color: var(--accent-primary);">📦 Inventory Manager</h2>
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <button id="inv-add-item-btn" class="btn-primary">+ Add New Item</button>
            </div>
        </div>

        <div class="app-card inv-no-print" style="padding: 10px; margin-bottom: 20px; display: flex; gap: 10px; overflow-x: auto; white-space: nowrap;">
            <button class="inv-tab btn-primary" data-target="dashboard">Master Dashboard</button>
            <button class="inv-tab btn-outline" data-target="transactions">Transactions</button>
            <button class="inv-tab btn-outline" data-target="audit">Audit Scanner</button>
            <button class="inv-tab btn-outline" data-target="reports">Reports & Data</button>
        </div>

        <div id="inv-stage" style="min-height: 50vh;"></div>

        <dialog id="inv-add-modal">
            <div class="modal-header">
                <h3>Add Master Item</h3>
                <button id="close-inv-add" class="icon-btn">❌</button>
            </div>
            <div class="modal-body">
                <form id="inv-add-form">
                    <label>SKU / Barcode</label><input type="text" id="new-sku" class="app-input" required>
                    <label>Item Name</label><input type="text" id="new-name" class="app-input" required>
                    <div style="display: flex; gap: 10px;">
                        <div style="flex: 1;"><label>Category</label><input type="text" id="new-cat" class="app-input"></div>
                        <div style="flex: 1;"><label>Location</label><input type="text" id="new-loc" class="app-input"></div>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <div style="flex: 1;"><label>Reorder Level</label><input type="number" id="new-reorder" class="app-input" value="5"></div>
                        <div style="flex: 1;"><label>Target Qty</label><input type="number" id="new-target" class="app-input" value="20"></div>
                        <div style="flex: 1;"><label>Unit Cost ($)</label><input type="number" step="0.01" id="new-cost" class="app-input" value="0.00"></div>
                    </div>
                    <button type="submit" class="btn-primary" style="width: 100%; margin-top: 15px;">Save Item</button>
                </form>
            </div>
        </dialog>

    </div>
    `;
}