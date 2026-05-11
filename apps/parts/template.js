// apps/parts/template.js

function renderPartsApp() {
    return `
    <style>
        .part-media-thumb { width: 50px; height: 50px; object-fit: cover; border-radius: 4px; border: 1px solid var(--border-color); cursor: pointer; }
        .critical-row { background-color: rgba(231, 76, 60, 0.1) !important; border-left: 4px solid var(--danger-color); }
        .low-stock-text { color: #f39c12; font-weight: bold; }
        .qty-btn { padding: 4px 10px; font-size: 1.1rem; font-weight: bold; border-radius: 4px; }
        
        /* Force the scanner modal to behave */
        #parts-scanner-modal { 
            overflow: hidden !important; 
            display: flex; 
            flex-direction: column; 
            background: var(--bg-base);
        }
        #parts-scanner-modal::backdrop { background: rgba(0,0,0,0.85); }
        
        /* Lock the header to the absolute top of the z-index stack */
        #parts-scanner-modal .modal-header { 
            z-index: 9999 !important; 
            position: relative; 
            background: var(--bg-surface);
            box-shadow: 0 2px 10px rgba(0,0,0,0.5);
        }
        
        /* Constrain the injected video feed */
        #qr-reader { flex: 1; overflow-y: auto; z-index: 1; border: none !important; }
        #qr-reader video { max-width: 100% !important; border-radius: 0 0 var(--radius-md) var(--radius-md); }
        #qr-reader__dashboard_section_csr span { color: var(--text-primary) !important; }
    </style>

    <div id="parts-wrapper" style="max-width: 1200px; margin: 0 auto;">
        
        <div class="app-toolbar" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="color: var(--accent-primary);">⚙️ Parts Database</h2>
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <button id="parts-scan-btn" class="btn-primary">📷 Quick Scan</button>
                <button id="parts-add-btn" class="btn-outline">+ Add Part</button>
                <button id="parts-manage-areas-btn" class="btn-outline">⚙️ Manage Areas</button>
            </div>
        </div>

        <div class="app-card">
            <div id="parts-area-tabs" style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid var(--accent-primary);">
                </div>
            
            <div id="parts-table-container" class="app-table-container">
                <table class="app-table">
                    <thead>
                        <tr>
                            <th style="width: 70px;">Img</th>
                            <th>Part Info</th>
                            <th>Location</th>
                            <th style="text-align: center;">Stock</th>
                            <th style="text-align: center;">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="parts-table-body">
                        </tbody>
                </table>
            </div>
        </div>

        <dialog id="parts-editor-modal" style="width: 95%; max-width: 600px;">
            <div class="modal-header">
                <h3 id="parts-editor-title">Add / Edit Part</h3>
                <button id="parts-close-editor" class="icon-btn">❌</button>
            </div>
            <div class="modal-body">
                <input type="hidden" id="part-edit-id">
                
                <label>Part Name</label>
                <input type="text" id="part-edit-name" class="app-input" placeholder="e.g., Sloan Valve Rebuild Kit">
                
                <div style="display: flex; gap: 10px;">
                    <div style="flex: 1;"><label>Vendor SKU</label><input type="text" id="part-edit-sku" class="app-input"></div>
                    <div style="flex: 1;"><label>Substitute Part ID</label><input type="text" id="part-edit-sub" class="app-input" placeholder="Leave blank if none"></div>
                </div>

                <div style="display: flex; gap: 10px;">
                    <div style="flex: 1;"><label>Current Qty</label><input type="number" id="part-edit-qty" class="app-input"></div>
                    <div style="flex: 1;"><label>Min Reorder Qty</label><input type="number" id="part-edit-min" class="app-input"></div>
                </div>

                <label>Shop Location (Shelf/Bin)</label>
                <input type="text" id="part-edit-loc" class="app-input" placeholder="e.g., Shelf 3, Bin B">
                
                <div style="display: flex; gap: 10px;">
                    <div style="flex: 2;"><label>Vendor URL</label><input type="text" id="part-edit-vendor-url" class="app-input" placeholder="https://..."></div>
                    <div style="flex: 1;"><label>Last Price ($)</label><input type="number" step="0.01" id="part-edit-vendor-price" class="app-input"></div>
                </div>

                <label>Image URL</label>
                <input type="text" id="part-edit-img" class="app-input" placeholder="Optional image link">

                <div style="margin: 15px 0; padding: 15px; background: rgba(0,0,0,0.03); border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                    <label style="font-weight: bold; color: var(--danger-color); display: flex; align-items: center; gap: 10px;">
                        <input type="checkbox" id="part-edit-critical" style="width: 20px; height: 20px;"> 
                        CRITICAL PART (Triggers dashboard warning at 0 qty)
                    </label>
                </div>

                <h4>Tag to Areas</h4>
                <div id="part-edit-area-tags" style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px; max-height: 150px; overflow-y: auto; padding: 10px; border: 1px solid var(--border-color); border-radius: 4px;">
                    </div>

                <div style="display: flex; gap: 10px; margin-top: 15px;">
                    <button id="part-save-btn" class="btn-primary" style="flex: 2;">💾 Save Part</button>
                    <button id="part-delete-btn" class="btn-danger" style="flex: 1;">🗑️ Delete</button>
                </div>
            </div>
        </dialog>

        <dialog id="parts-area-modal">
            <div class="modal-header">
                <h3>Manage Park Areas</h3>
                <button id="parts-close-area" class="icon-btn">❌</button>
            </div>
            <div class="modal-body">
                <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                    <input type="text" id="parts-new-area-name" class="app-input" placeholder="New Area Name (e.g., Shower House)" style="margin:0;">
                    <button id="parts-add-area-btn" class="btn-primary">+ Add</button>
                </div>
                <div id="parts-area-list" style="display: flex; flex-direction: column; gap: 10px;"></div>
            </div>
        </dialog>

        <dialog id="parts-scanner-modal" style="width: 95%; max-width: 500px; padding: 0; border: 1px solid var(--border-color);">
            <div class="modal-header" style="border-radius: 12px 12px 0 0; padding: 15px 20px;">
                <h3 style="margin: 0;">Scan Barcode</h3>
                <button id="parts-close-scanner" class="btn-danger" style="padding: 5px 12px; font-size: 1rem;">X</button>
            </div>
            <div id="qr-reader" style="width: 100%;"></div>
        </dialog>
    </div>
    `;
}