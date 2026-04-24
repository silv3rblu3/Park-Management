// js/stateManager.js

const StateManager = {
    defaultState: {
        activeThemeId: 'theme-winchester',
        themes: [
            {
                id: 'theme-winchester',
                name: 'Winchester Lake (Dark)',
                colors: { bgBase: '#121212', bgSurface: '#1e1e1e', textPrimary: '#e0e0e0', textSecondary: '#a0a0a0', accentPrimary: '#2d5a27', accentHover: '#1e3d1a', border: '#333333', danger: '#d9381e' }
            },
            {
                id: 'theme-light',
                name: 'Standard Park (Light)',
                colors: { bgBase: '#f4f4f9', bgSurface: '#ffffff', textPrimary: '#333333', textSecondary: '#666666', accentPrimary: '#2c3e50', accentHover: '#1a252f', border: '#dddddd', danger: '#e74c3c' }
            }
        ],
        apps: {
            fleet: {
                vehicles: [
                    { id: "R223", desc: "2014 Ford F-150", schedule: [ { id: "R223-1", task: "Engine Oil & Filter", interval: 7000, unit: "Miles", timeInterval: "12 Months", info: "Oil type" }, { id: "R223-2", task: "Tire Rotation", interval: 8000, unit: "Miles", timeInterval: "N/A", info: "how to rotate" }, { id: "R223-3", task: "Cabin Air Filter", interval: 20000, unit: "Miles", timeInterval: "N/A", info: "" }, { id: "R223-4", task: "Engine Air Filter", interval: 30000, unit: "Miles", timeInterval: "36 Months", info: "" }, { id: "R223-10", task: "Engine Coolant Flush", interval: 100000, unit: "Miles", timeInterval: "10 Years", info: "" } ] },
                    { id: "R558", desc: "2019 RAM 2500 (6.4L HEMI Gas)", schedule: [ { id: "R558-1", task: "Engine Oil & Filter", interval: 8000, unit: "Miles", timeInterval: "12 Months", info: "Oil type" }, { id: "R558-2", task: "Tire Rotation", interval: 8000, unit: "Miles", timeInterval: "N/A", info: "how to rotate" }, { id: "R558-4", task: "Engine Air Filter", interval: 30000, unit: "Miles", timeInterval: "36 Months", info: "" }, { id: "R558-5", task: "Transfer Case/Axle Fluid", interval: 50000, unit: "Miles", timeInterval: "N/A", info: "" } ] },
                    { id: "R406", desc: "2009 Jeep Liberty (3.7L Gas)", schedule: [ { id: "R406-1", task: "Engine Oil & Filter", interval: 8000, unit: "Miles", timeInterval: "12 Months", info: "Oil type" }, { id: "R406-2", task: "Tire Rotation", interval: 8000, unit: "Miles", timeInterval: "N/A", info: "how to rotate" }, { id: "R406-4", task: "Engine Air Filter", interval: 30000, unit: "Miles", timeInterval: "36 Months", info: "" } ] },
                    { id: "R282", desc: "2002 Ford F-450 Dump Truck (Gas)", schedule: [ { id: "R282-1", task: "Engine Oil & Filter", interval: 8000, unit: "Miles", timeInterval: "12 Months", info: "" }, { id: "R282-14", task: "Steering & Suspension Lube", interval: 5000, unit: "Miles", timeInterval: "", info: "Grease all unsealed joints" } ] },
                    { id: "R418", desc: "2012 Polaris GEM Cart (Electric)", schedule: [ { id: "R418-1", task: "Battery Fluid Check", interval: "", unit: "", timeInterval: "Monthly", info: "" }, { id: "R418-4", task: "Tire Rotation", interval: 50, unit: "Hours", timeInterval: "3 Months", info: "/ 5,000 Miles" } ] },
                    { id: "CAT", desc: "2005 Caterpillar 420E (Diesel)", schedule: [ { id: "CAT-1", task: "Lubricate Backhoe Bearings", interval: 10, unit: "Hours", timeInterval: "Daily", info: "" }, { id: "CAT-6", task: "Engine Oil & Filter", interval: 500, unit: "Hours", timeInterval: "3 Months", info: "" } ] },
                    { id: "07MULE", desc: "2007 Kawasaki Mule (Gas)", schedule: [ { id: "07MULE-1", task: "Engine Oil Change", interval: 100, unit: "Hours", timeInterval: "6 Months", info: "" }, { id: "07MULE-6", task: "Drive Belt Inspection", interval: 200, unit: "Hours", timeInterval: "2,500 Miles", info: "" } ] }
                ],
                inspections: [], services: [],
                settings: { checklistItems: [ "Oil", "Antifreeze", "Brakes/Lights", "Fan Belt(s)", "Battery & Connections", "Tire Cond. & Pressure", "Power Steering/Hyd. Oil Level", "Body Appearance", "Emergency Brake", "Fire Extinguisher", "First Aid Kit" ] }
            },
            inventory: { items: [], transactions: [] },
            winterization: { fall: {}, spring: {} },
            firstAid: { kits: [], logs: [] }
        }
    },

    loadGlobalState: function() {
        const stored = localStorage.getItem('omni_master_data');
        if (!stored) { this.saveGlobalState(this.defaultState); return this.defaultState; }
        try { return JSON.parse(stored); } catch (e) { return this.defaultState; }
    },

    saveGlobalState: function(stateObject) { localStorage.setItem('omni_master_data', JSON.stringify(stateObject)); },
    getAppData: function(appName) { return this.loadGlobalState().apps[appName] || {}; },
    setAppData: function(appName, appData) { let state = this.loadGlobalState(); state.apps[appName] = appData; this.saveGlobalState(state); },

    exportGlobalData: function() {
        const state = this.loadGlobalState();
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
        const anchor = document.createElement('a');
        anchor.setAttribute("href", dataStr); anchor.setAttribute("download", `OmniHub_Master_Backup_${new Date().toISOString().split('T')[0]}.json`);
        document.body.appendChild(anchor); anchor.click(); anchor.remove();
        NotificationSystem.show('Global Backup Exported Successfully', 'success');
    },

    importGlobalData: function(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                if (!importedData.apps) throw new Error("Invalid format.");
                this.saveGlobalState(importedData);
                NotificationSystem.show('Master Database Overwritten. Reloading...', 'success');
                setTimeout(() => location.reload(), 1500);
            } catch (err) { NotificationSystem.show('Import Failed: Invalid JSON file', 'error'); }
        }; reader.readAsText(file);
    }
};