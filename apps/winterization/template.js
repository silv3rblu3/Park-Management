// apps/winterization/template.js

function renderWinterizationApp() {
    return `
    <style>
        /* App-Specific Print Overrides */
        @media print {
            #global-header, #bento-menu, .wint-no-print { display: none !important; }
            #app-container { height: auto !important; overflow: visible !important; padding: 0 !important; }
            #wint-print-container { display: block !important; position: absolute; left: 0; top: 0; width: 100%; background: white; color: black; }
            .print-area-block { page-break-after: always; padding: 0 !important; margin: 0 !important; }
            .wint-task-table { border-collapse: collapse !important; width: 100% !important; margin-bottom: 10px !important; border: 2px solid black !important; background: white !important; }
            .wint-task-table th, .wint-task-table td { border: 1px solid black !important; padding: 4px !important; font-size: 0.9rem !important; }
            .print-blank-line { width: 90%; min-height: 20px; margin: auto; border-bottom: 1px solid black; }
            .video-print-text { display: inline-block !important; font-size: 0.8rem; font-style: italic; border: 1px dashed #000; padding: 4px; border-radius: 4px; margin-top: 2px; }
        }
        /* App-Specific UI tweaks */
        .wint-task-media { max-width: 250px; max-height: 180px; border-radius: 6px; border: 1px solid var(--border-color); object-fit: cover; cursor: zoom-in; }
    </style>

    <div id="wint-wrapper" style="max-width: 1200px; margin: 0 auto;">
        
        <div class="app-toolbar wint-no-print" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="color: var(--accent-primary);">❄️ Winter Ops Tracker</h2>
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <button id="wint-export-excel-btn" class="btn-outline">📊 Export Excel</button>
                <button id="wint-toggle-edit-btn" class="btn-outline">⚙️ Edit Config</button>
                <button id="wint-open-print-btn" class="btn-primary">🖨️ Print Checklists</button>
            </div>
        </div>

        <div id="wint-view-mode" class="app-card wint-no-print">
            <div style="display: flex; gap: 10px; border-bottom: 2px solid var(--accent-primary); padding-bottom: 10px;">
                <button class="wint-season-tab btn-primary" data-season="fall" style="flex: 1;">Fall Winterization</button>
                <button class="wint-season-tab btn-outline" data-season="spring" style="flex: 1;">Spring De-Winterization</button>
            </div>
            <div id="wint-area-tabs" style="margin-top: 15px; display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;"></div>
            <div id="wint-task-content" style="margin-top: 20px;"></div>
        </div>

        <div id="wint-edit-mode" class="app-card hidden wint-no-print">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid var(--border-color); padding-bottom: 10px;">
                <h3>System Configuration & Editor</h3>
                <button id="wint-exit-edit-btn" class="btn-primary">Save & Return</button>
            </div>
            
            <div style="display: flex; gap: 15px; margin-bottom: 20px; flex-wrap: wrap;">
                <select id="wint-editor-season" class="app-select" style="flex: 1; margin-bottom: 0;">
                    <option value="fall">Fall Winterization</option>
                    <option value="spring">Spring De-Winterization</option>
                </select>
                <div style="display: flex; gap: 5px; flex: 2;">
                    <select id="wint-editor-area" class="app-select" style="flex: 1; margin-bottom: 0;"></select>
                    <button id="wint-move-up-btn" class="btn-outline" title="Move Up">↑</button>
                    <button id="wint-move-down-btn" class="btn-outline" title="Move Down">↓</button>
                    <button id="wint-add-area-btn" class="btn-primary" title="Add Area">+</button>
                    <button id="wint-rename-area-btn" class="btn-outline" title="Rename Area">✏️</button>
                    <button id="wint-delete-area-btn" class="btn-danger" title="Delete Area">🗑️</button>
                </div>
            </div>
            <div style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid var(--border-color);">
                <button id="wint-add-warning-btn" class="btn-outline" style="color: var(--danger-color); border-color: var(--danger-color);">⚠️ Add Area Warning</button>
                <button id="wint-add-cat-btn" class="btn-primary">+ Add New Section</button>
            </div>
            <div id="wint-category-editor"></div>
        </div>

        <dialog id="wint-print-modal">
            <div class="modal-header">
                <h2>Print Checklists</h2>
                <button id="wint-close-print" class="icon-btn">❌</button>
            </div>
            <div class="modal-body">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; flex-wrap: wrap; gap: 10px; background: rgba(0,0,0,0.03); padding: 10px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                    <label style="font-weight:bold;">Print Year: <input type="number" id="wint-print-year" class="app-input" style="width: 100px; display: inline-block; margin-bottom: 0;"></label>
                    <label style="cursor: pointer;"><input type="checkbox" id="wint-print-blank-year"> Leave Year Blank</label>
                    <label style="cursor: pointer; color: var(--accent-primary);"><input type="checkbox" id="wint-print-blank"> Print Blank Forms</label>
                </div>
                <p style="margin-bottom: 15px;">Select areas to print for <strong id="wint-print-season-label" style="text-transform: uppercase;"></strong>:</p>
                <div id="wint-print-checkboxes" style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 10px;"></div>
                <button type="button" id="wint-select-all-print" class="btn-outline" style="margin-bottom: 20px; width: 100%;">Select All</button>
                <div style="text-align: right;">
                    <button id="wint-execute-print" class="btn-primary" style="width: 100%;">🖨️ Print Selected</button>
                </div>
            </div>
        </dialog>

        <dialog id="wint-fill-modal">
            <div class="modal-header"><h3 id="wint-fill-title">Fill Column</h3></div>
            <div class="modal-body">
                <div id="wint-fill-container"></div>
                <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
                    <button id="wint-cancel-fill" class="btn-outline">Cancel</button>
                    <button id="wint-confirm-fill" class="btn-primary">Fill All Rows</button>
                </div>
            </div>
        </dialog>

        <dialog id="wint-media-modal" style="background: transparent; border: none; max-width: 90vw; max-height: 90vh;">
            <div style="text-align: right; margin-bottom: 10px;">
                <button id="wint-close-media" class="btn-danger" style="font-size: 1.5rem; padding: 5px 15px;">X</button>
            </div>
            <img id="wint-media-img" style="max-width: 100%; max-height: 80vh; border-radius: var(--radius-md); box-shadow: 0 10px 30px rgba(0,0,0,0.5); display: none;">
            <video id="wint-media-vid" style="max-width: 100%; max-height: 80vh; border-radius: var(--radius-md); box-shadow: 0 10px 30px rgba(0,0,0,0.5); display: none;" controls></video>
        </dialog>

        <div id="wint-print-container" style="display: none;"></div>
    </div>
    `;
}