// apps/first-aid/template.js

function renderFirstAidApp() {
    return `
    <div id="firstaid-wrapper" style="max-width: 1200px; margin: 0 auto;">
        
        <div class="app-toolbar" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="color: var(--accent-primary);">🩹 First Aid Procurement</h2>
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <button id="fa-toggle-settings-btn" class="btn-outline">⚙️ Edit Configuration</button>
                <button id="fa-print-btn" class="btn-primary" style="background-color: #34a853;">🖨️ Print Reorder List</button>
            </div>
        </div>

        <div id="fa-header-panel" class="app-card" style="display: flex; flex-wrap: wrap; gap: 20px; margin-bottom: 20px;"></div>

        <div id="fa-tabs-container" style="display: flex; gap: 5px; margin-bottom: -1px; overflow-x: auto;"></div>

        <div id="fa-active-content" class="app-card" style="border-top-left-radius: 0; min-height: 50vh;"></div>

        <dialog id="fa-print-modal">
            <div class="modal-header">
                <h3>Select Categories to Print</h3>
                <button id="close-fa-print-modal" class="icon-btn">❌</button>
            </div>
            <div class="modal-body">
                <div id="fa-print-category-list" style="margin-bottom: 20px;"></div>
                <div style="display: flex; gap: 10px; justify-content: flex-end;">
                    <button id="fa-execute-print-btn" class="btn-primary" style="background-color: #34a853; width: 100%;">Print to PDF / Paper</button>
                </div>
            </div>
        </dialog>

        <div id="fa-print-area" class="print-only" style="display: none;"></div>

    </div>
    `;
}