// apps/fleet/template.js

function renderFleetApp() {
    return `
    <div id="fleet-wrapper" style="max-width: 1200px; margin: 0 auto;">
        
        <div class="app-card" style="padding: 10px; margin-bottom: 20px; display: flex; gap: 10px; overflow-x: auto; white-space: nowrap;">
            <button class="fleet-tab btn-primary" data-target="overview">Fleet Overview</button>
            <button class="fleet-tab btn-outline" data-target="inspections">Monthly Inspections</button>
            <button class="fleet-tab btn-outline" data-target="services">Services Done</button>
            <button class="fleet-tab btn-outline" data-target="vehicle-info">Vehicle Info</button>
            <button class="fleet-tab btn-outline" data-target="settings">Settings</button>
        </div>

        <div id="fleet-stage" class="app-card" style="min-height: 50vh;">
            </div>

        <dialog id="fleet-repair-modal">
            <div class="modal-header">
                <h3 id="fleet-repair-title">Failed Items</h3>
                <button id="close-repair-modal" class="icon-btn">❌</button>
            </div>
            <div class="modal-body">
                <p style="margin-bottom: 15px; font-size: 14px; color: var(--text-secondary);">Click a failed item to log a repair.</p>
                <div id="fleet-repair-list" style="display: flex; flex-direction: column; gap: 10px;"></div>
            </div>
        </dialog>

        <dialog id="fleet-print-modal">
            <div class="modal-header">
                <h3>Print Inspection Reports</h3>
                <button id="close-print-modal" class="icon-btn">❌</button>
            </div>
            <div class="modal-body">
                <label style="font-weight: bold;">Select Print Mode:</label>
                <select id="fleet-print-mode" class="app-select" style="margin-bottom: 15px;">
                    <option value="all">Latest For All Vehicles</option>
                    <option value="single">Single Vehicle</option>
                    <option value="custom">Custom Selection</option>
                </select>
                
                <div id="fleet-print-single-wrapper" class="hidden">
                    <label>Select Vehicle:</label>
                    <select id="fleet-print-single-select" class="app-select"></select>
                </div>
                
                <div id="fleet-print-custom-wrapper" class="hidden" style="max-height: 200px; overflow-y: auto; border: 1px solid var(--border-color); border-radius: 4px; padding: 10px; margin-bottom: 15px;"></div>
                
                <button id="fleet-execute-print" class="btn-primary" style="width: 100%;">Generate & Print</button>
            </div>
        </dialog>

        <div id="fleet-print-area" style="display: none;"></div>
    </div>
    `;
}