// apps/inventory/template.js

function renderInventoryApp() {
    return `
    <div id="inventory-wrapper" style="max-width: 1200px; margin: 0 auto;">
        
        <div class="app-toolbar" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="color: var(--accent-primary);">📦 Inventory Manager</h2>
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <input type="file" id="file-import-items" accept=".csv" style="display: none;">
                <input type="file" id="file-import-trans" accept=".csv" style="display: none;">
                
                <button id="import-items-btn" class="btn-outline">📂 Import Master CSV</button>
                <button id="import-trans-btn" class="btn-outline">📂 Import Trans. CSV</button>
                <button id="inv-add-item-btn" class="btn-primary">+ Add Item</button>
                <button id="inv-log-trans-btn" class="btn-outline">Log Transaction</button>
                <button id="inv-audit-btn" class="btn-outline">📷 Scan / Audit</button>
            </div>
        </div>

        <div class="app-card" style="padding: 10px; margin-bottom: 20px; display: flex; gap: 10px; overflow-x: auto; white-space: nowrap;">
            <button class="inv-tab btn-primary" data-target="inv-view-dashboard">Master Dashboard</button>
            <button class="inv-tab btn-outline" data-target="inv-view-transactions">Recent Transactions</button>
            <button class="inv-tab btn-outline" data-target="inv-view-reports">Reorder Reports</button>
        </div>

        <div id="inv-main-stage" class="app-card" style="min-height: 50vh;">
            </div>

        <dialog id="inv-item-modal">
            <div class="modal-header">
                <h3>Add Master Item</h3>
                <button id="close-item-modal" class="icon-btn">❌</button>
            </div>
            <div class="modal-body">
                <form id="inv-item-form">
                    <label>SKU / Barcode</label>
                    <input type="text" id="item-sku" class="app-input" required>
                    
                    <label>Item Name</label>
                    <input type="text" id="item-name" class="app-input" required>

                    <label>Vendor</label>
                    <input type="text" id="item-vendor" class="app-input">

                    <label>Description</label>
                    <input type="text" id="item-desc" class="app-input">
                    
                    <div style="display: flex; gap: 10px;">
                        <div style="flex: 1;">
                            <label>Category</label>
                            <input type="text" id="item-category" class="app-input" required>
                        </div>
                        <div style="flex: 1;">
                            <label>Location (Aisle/Bin)</label>
                            <input type="text" id="item-location" class="app-input">
                        </div>
                    </div>

                    <div style="display: flex; gap: 10px;">
                        <div style="flex: 1;">
                            <label>Reorder Level</label>
                            <input type="number" id="item-reorder" class="app-input" value="5" required>
                        </div>
                        <div style="flex: 1;">
                            <label>Target Qty</label>
                            <input type="number" id="item-target" class="app-input" value="20" required>
                        </div>
                        <div style="flex: 1;">
                            <label>Unit Cost ($)</label>
                            <input type="number" step="0.01" id="item-cost" class="app-input" value="0.00">
                        </div>
                    </div>

                    <button type="submit" class="btn-primary" style="width: 100%; margin-top: 15px;">Save Item</button>
                </form>
            </div>
        </dialog>

        <dialog id="inv-trans-modal">
            <div class="modal-header">
                <h3>Log Stock Movement</h3>
                <button id="close-trans-modal" class="icon-btn">❌</button>
            </div>
            <div class="modal-body">
                <form id="inv-trans-form">
                    <label>Action</label>
                    <select id="trans-type" class="app-select" required>
                        <option value="Stock In">Stock In (+)</option>
                        <option value="Stock Out">Stock Out (-)</option>
                    </select>

                    <label>Item (SKU)</label>
                    <select id="trans-sku" class="app-select" required></select>

                    <label>Quantity</label>
                    <input type="number" id="trans-qty" class="app-input" required>

                    <label>Notes (Optional)</label>
                    <input type="text" id="trans-notes" class="app-input">

                    <button type="submit" class="btn-primary" style="width: 100%; margin-top: 15px;">Submit Transaction</button>
                </form>
            </div>
        </dialog>

        <dialog id="inv-audit-modal">
            <div class="modal-header">
                <h3>Inventory Audit</h3>
                <button id="close-audit-modal" class="icon-btn">❌</button>
            </div>
            <div class="modal-body" style="text-align: center;">
                <p style="margin-bottom: 15px; color: var(--text-secondary);">Enter SKU manually or use the camera.</p>
                
                <input type="text" id="audit-sku-input" class="app-input" placeholder="Scan or type SKU here..." style="font-size: 1.2rem; text-align: center;">
                
                <div id="reader" style="margin: 15px auto; width: 100%; max-width: 400px;"></div>
                <button id="start-scanner-btn" class="btn-outline" style="width: 100%; margin-bottom: 15px;">📷 Start Camera Scanner</button>

                <div id="audit-result-area" style="margin-top: 20px; display: none; background: rgba(0,0,0,0.03); padding: 15px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                    <h4 id="audit-item-title" style="color: var(--accent-primary); margin-bottom: 10px; font-size: 1.3rem;">Item Name</h4>
                    <p style="font-size: 1.1rem;">System Quantity: <strong id="audit-sys-qty">0</strong></p>
                    <label style="display: block; margin-top: 15px; font-weight: bold;">Actual Physical Count:</label>
                    <input type="number" id="audit-physical-qty" class="app-input" style="text-align: center; font-size: 1.5rem; width: 50%; margin: 10px auto;">
                    <button id="submit-audit-btn" class="btn-primary" style="width: 100%;">Apply Correction</button>
                </div>
            </div>
        </dialog>

    </div>
    `;
}