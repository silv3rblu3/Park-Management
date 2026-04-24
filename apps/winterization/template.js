// apps/winterization/template.js

function renderWinterizationApp() {
    return `
    <div id="winterization-wrapper" style="max-width: 1200px; margin: 0 auto;">
        
        <div class="app-toolbar" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="color: var(--accent-primary);">❄️ Winter Ops Tracker</h2>
            <div style="display: flex; gap: 10px;">
                <button id="open-print-modal-btn" class="btn-outline">🖨️ Print Checklists</button>
                <button id="toggle-edit-btn" class="btn-outline">⚙️ Edit Config</button>
            </div>
        </div>

        <div id="view-mode" class="app-card">
            <div class="season-tabs" style="display: flex; gap: 10px; border-bottom: 2px solid var(--accent-primary); padding-bottom: 10px;">
                <button class="season-tab btn-primary active" data-season="fall" style="flex: 1;">Fall Winterization</button>
                <button class="season-tab btn-outline" data-season="spring" style="flex: 1;">Spring De-Winterization</button>
            </div>
            <div class="area-tabs-container" id="area-tabs" style="margin-top: 15px; display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;"></div>
            <div class="task-content-container" id="task-content" style="margin-top: 20px;"></div>
        </div>

        <div id="edit-mode" class="app-card hidden">
            <div class="edit-mode-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid var(--border-color); padding-bottom: 10px;">
                <h3>System Configuration & Editor</h3>
                <button id="exit-edit-btn" class="btn-primary">Save & Return</button>
            </div>
            
            <div class="settings-tabs" style="display: flex; gap: 10px; margin-bottom: 20px;">
                <button class="settings-tab btn-primary active" data-target="data-editor">Edit Checklists</button>
            </div>

            <div id="data-editor" class="settings-pane active">
                <div class="editor-controls" style="display: flex; gap: 15px; margin-bottom: 20px; flex-wrap: wrap;">
                    <select id="editor-season-select" class="app-select" style="flex: 1;">
                        <option value="fall">Fall Winterization</option>
                        <option value="spring">Spring De-Winterization</option>
                    </select>
                    <div style="display: flex; gap: 5px; flex: 2;">
                        <select id="editor-area-select" class="app-select" style="flex: 1; margin-bottom: 0;"></select>
                        <button id="move-area-up-btn" class="btn-outline" title="Move Area Up">↑</button>
                        <button id="move-area-down-btn" class="btn-outline" title="Move Area Down">↓</button>
                        <button id="add-area-btn" class="btn-primary" title="Add New Area">+</button>
                        <button id="rename-area-btn" class="btn-outline" title="Rename Area">✏️</button>
                        <button id="delete-area-btn" class="btn-danger" title="Delete Area">🗑️</button>
                    </div>
                </div>
                <div class="editor-action-bar" style="margin-bottom: 20px;">
                    <button id="add-warning-btn" class="btn-outline" style="color: var(--warning-color); border-color: var(--warning-color); display: none;">⚠️ Add Warning</button>
                    <button id="add-category-btn" class="btn-primary">+ Add New Section</button>
                </div>
                <div id="category-editor-container"></div>
            </div>
        </div>

        <dialog id="print-modal">
            <div class="modal-header">
                <h2>Print Checklists</h2>
                <button id="close-print-modal-btn" class="icon-btn">❌</button>
            </div>
            <div class="modal-body">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; flex-wrap: wrap; gap: 10px; background: var(--bg-base); padding: 10px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                    <label style="font-weight:bold;">
                        Print Year: <input type="number" id="print-year-input" class="app-input" style="width: 100px; display: inline-block; margin-bottom: 0;">
                    </label>
                    <label style="cursor: pointer;"><input type="checkbox" id="print-blank-year-cb"> Leave Year Blank</label>
                    <label style="cursor: pointer; color: var(--accent-primary);"><input type="checkbox" id="print-blank-cb"> Print Blank Forms</label>
                </div>
                <p style="margin-bottom: 15px;">Select areas to print for <strong><span id="print-season-label"></span></strong>:</p>
                <div id="print-checkbox-container" style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 10px;"></div>
                <button type="button" id="select-all-print-btn" class="btn-outline" style="margin-bottom: 20px; width: 100%;">Select All</button>
                <div style="text-align: right;">
                    <button id="execute-print-btn" class="btn-primary" style="width: 100%;">🖨️ Print Selected</button>
                </div>
            </div>
        </dialog>

        <dialog id="fill-modal">
            <div class="modal-header">
                <h3 id="fill-modal-title">Fill Column</h3>
            </div>
            <div class="modal-body">
                <div id="fill-input-container"></div>
                <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
                    <button id="cancel-fill-btn" class="btn-outline">Cancel</button>
                    <button id="confirm-fill-btn" class="btn-primary">Fill All Rows</button>
                </div>
            </div>
        </dialog>

        <dialog id="area-input-modal">
            <div class="modal-header">
                <h3 id="area-input-title">Add New Area</h3>
            </div>
            <div class="modal-body">
                <p id="area-input-desc" style="margin-bottom: 10px; font-size: 0.95rem;"></p>
                <input type="text" id="area-input-field" class="app-input" style="margin-bottom: 20px;">
                <div style="display: flex; gap: 10px; justify-content: flex-end;">
                    <button id="cancel-area-input-btn" class="btn-outline">Cancel</button>
                    <button id="confirm-area-input-btn" class="btn-primary">Save Area</button>
                </div>
            </div>
        </dialog>

        <div id="print-container" style="display: none;"></div>

    </div>
    `;
}