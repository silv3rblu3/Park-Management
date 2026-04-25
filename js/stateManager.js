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
                    { id: "R223", desc: "2014 Ford F-150", schedule: [
                        { task: "Engine Oil & Filter", interval: "7000", unit: "Miles", timeInterval: "12 Months", info: "Oil type" },
                        { task: "Tire Rotation", interval: "8000", unit: "Miles", timeInterval: "N/A", info: "how to rotate" },
                        { task: "Cabin Air Filter", interval: "20000", unit: "Miles", timeInterval: "N/A", info: "" },
                        { task: "Engine Air Filter", interval: "30000", unit: "Miles", timeInterval: "36 Months", info: "" },
                        { task: "Transfer Case/Axle Fluid", interval: "150000", unit: "Miles", timeInterval: "N/A", info: "" },
                        { task: "Automatic Transmission Fluid", interval: "150000", unit: "Miles", timeInterval: "N/A", info: "" },
                        { task: "Spark Plugs", interval: "100000", unit: "Miles", timeInterval: "N/A", info: "" },
                        { task: "Accessory Drive Belts Inspect", interval: "100000", unit: "Miles", timeInterval: "N/A", info: "" },
                        { task: "Accessory Drive Belts Replace", interval: "150000", unit: "Miles", timeInterval: "", info: "" },
                        { task: "Engine Coolant Flush", interval: "100000", unit: "Miles", timeInterval: "10 Years", info: "" },
                        { task: "Brake Fluid Replacement", interval: "N/A", unit: "Miles", timeInterval: "Every 3 Years", info: "" },
                        { task: "PCV Valve", interval: "100000", unit: "Miles", timeInterval: "10 Years", info: "" },
                        { task: "Antifreeze", interval: "", unit: "Miles", timeInterval: "", info: "Monthly Inspection Service" },
                        { task: "Brakes/Lights", interval: "", unit: "Miles", timeInterval: "", info: "Monthly Inspection Service" },
                        { task: "Safety Gear", interval: "", unit: "Miles", timeInterval: "", info: "Monthly Inspection Service" },
                        { task: "Jack & Spare", interval: "", unit: "Miles", timeInterval: "", info: "Monthly Inspection Service" },
                        { task: "Body Appearance", interval: "", unit: "Miles", timeInterval: "", info: "Monthly Inspection Service" }
                    ]},
                    { id: "R558", desc: "2019 RAM 2500 (6.4L HEMI Gas)", schedule: [
                        { task: "Engine Oil & Filter", interval: "8000", unit: "Miles", timeInterval: "12 Months", info: "Oil type" },
                        { task: "Tire Rotation", interval: "8000", unit: "Miles", timeInterval: "N/A", info: "how to rotate" },
                        { task: "Cabin Air Filter", interval: "15000", unit: "Miles", timeInterval: "N/A", info: "" },
                        { task: "Engine Air Filter", interval: "30000", unit: "Miles", timeInterval: "36 Months", info: "" },
                        { task: "Transfer Case/Axle Fluid", interval: "50000", unit: "Miles", timeInterval: "N/A", info: "" },
                        { task: "Automatic Transmission Fluid", interval: "50000", unit: "Miles", timeInterval: "N/A", info: "" },
                        { task: "Spark Plugs", interval: "100000", unit: "Miles", timeInterval: "N/A", info: "" },
                        { task: "Accessory Drive Belts Inspect", interval: "100000", unit: "Miles", timeInterval: "N/A", info: "" },
                        { task: "Accessory Drive Belts Replace", interval: "150000", unit: "Miles", timeInterval: "", info: "" },
                        { task: "Engine Coolant Flush", interval: "150000", unit: "Miles", timeInterval: "10 Years", info: "" },
                        { task: "Brake Fluid Replacement", interval: "N/A", unit: "Miles", timeInterval: "Every 3 Years", info: "" },
                        { task: "PCV Valve", interval: "100000", unit: "Miles", timeInterval: "10 Years", info: "" },
                        { task: "Antifreeze", interval: "", unit: "Miles", timeInterval: "", info: "Monthly Inspection Service" },
                        { task: "Brakes/Lights", interval: "", unit: "Miles", timeInterval: "", info: "Monthly Inspection Service" },
                        { task: "Safety Gear", interval: "", unit: "Miles", timeInterval: "", info: "Monthly Inspection Service" },
                        { task: "Jack & Spare", interval: "", unit: "Miles", timeInterval: "", info: "Monthly Inspection Service" },
                        { task: "Body Appearance", interval: "", unit: "Miles", timeInterval: "", info: "Monthly Inspection Service" }
                    ]},
                    { id: "R406", desc: "2009 Jeep Liberty (3.7L Gas)", schedule: [
                        { task: "Engine Oil & Filter", interval: "8000", unit: "Miles", timeInterval: "12 Months", info: "Oil type" },
                        { task: "Tire Rotation", interval: "8000", unit: "Miles", timeInterval: "N/A", info: "how to rotate" },
                        { task: "Cabin Air Filter", interval: "16000", unit: "Miles", timeInterval: "N/A", info: "" },
                        { task: "Engine Air Filter", interval: "30000", unit: "Miles", timeInterval: "36 Months", info: "" },
                        { task: "Transfer Case", interval: "50000", unit: "Miles", timeInterval: "N/A", info: "" },
                        { task: "Axle Fluid", interval: "20000", unit: "Miles", timeInterval: "", info: "" },
                        { task: "Automatic Transmission Fluid", interval: "50000", unit: "Miles", timeInterval: "N/A", info: "" },
                        { task: "Spark Plugs", interval: "100000", unit: "Miles", timeInterval: "N/A", info: "" },
                        { task: "Accessory Drive Belts Inspect", interval: "100000", unit: "Miles", timeInterval: "N/A", info: "" },
                        { task: "Accessory Drive Belts Replace", interval: "150000", unit: "Miles", timeInterval: "", info: "" },
                        { task: "Engine Coolant Flush", interval: "110000", unit: "Miles", timeInterval: "10 Years", info: "" },
                        { task: "Brake Fluid Replacement", interval: "N/A", unit: "Miles", timeInterval: "Every 3 Years", info: "" },
                        { task: "PCV Valve", interval: "100000", unit: "Miles", timeInterval: "10 Years", info: "" },
                        { task: "Antifreeze", interval: "", unit: "Miles", timeInterval: "", info: "Monthly Inspection Service" },
                        { task: "Brakes/Lights", interval: "", unit: "Miles", timeInterval: "", info: "Monthly Inspection Service" },
                        { task: "Safety Gear", interval: "", unit: "Miles", timeInterval: "", info: "Monthly Inspection Service" },
                        { task: "Jack & Spare", interval: "", unit: "Miles", timeInterval: "", info: "Monthly Inspection Service" },
                        { task: "Body Appearance", interval: "", unit: "Miles", timeInterval: "", info: "Monthly Inspection Service" }
                    ]},
                    { id: "R282", desc: "2002 Ford F-450 Dump Truck (Gas)", schedule: [
                        { task: "Engine Oil & Filter", interval: "8000", unit: "Miles", timeInterval: "12 Months", info: "" },
                        { task: "Tire Rotation", interval: "8000", unit: "Miles", timeInterval: "N/A", info: "" },
                        { task: "Cabin Air Filter", interval: "12000", unit: "Miles", timeInterval: "N/A", info: "" },
                        { task: "Engine Air Filter", interval: "30000", unit: "Miles", timeInterval: "36 Months", info: "" },
                        { task: "Transfer Case/Axle Fluid", interval: "110000", unit: "Miles", timeInterval: "N/A", info: "" },
                        { task: "Automatic Transmission Fluid", interval: "50000", unit: "Miles", timeInterval: "N/A", info: "" },
                        { task: "Spark Plugs", interval: "100000", unit: "Miles", timeInterval: "N/A", info: "" },
                        { task: "Accessory Drive Belts Inspect", interval: "100000", unit: "Miles", timeInterval: "N/A", info: "" },
                        { task: "Accessory Drive Belts Replace", interval: "150000", unit: "Miles", timeInterval: "", info: "" },
                        { task: "Engine Coolant Flush", interval: "150000", unit: "Miles", timeInterval: "10 Years", info: "" },
                        { task: "Brake Fluid Replacement", interval: "N/A", unit: "Miles", timeInterval: "Every 3 Years", info: "" },
                        { task: "PCV Valve", interval: "100000", unit: "Miles", timeInterval: "10 Years", info: "" },
                        { task: "Front Wheel Bearings", interval: "60000", unit: "Miles", timeInterval: "", info: "(Inspect/Repack), 30,000 for severe duty" },
                        { task: "Steering & Suspension Lube", interval: "5000", unit: "Miles", timeInterval: "", info: "Grease all unsealed joints" },
                        { task: "Disc Brake Caliper Rails", interval: "15000", unit: "Miles", timeInterval: "", info: "Lubricate slide rails" },
                        { task: "Driveshaft U-Joints Lube", interval: "5000", unit: "Miles", timeInterval: "", info: "Lube slip yoke if equipped" },
                        { task: "Antifreeze", interval: "", unit: "Miles", timeInterval: "", info: "Monthly Inspection Service" },
                        { task: "Brakes/Lights", interval: "", unit: "Miles", timeInterval: "", info: "Monthly Inspection Service" },
                        { task: "Safety Gear", interval: "", unit: "Miles", timeInterval: "", info: "Monthly Inspection Service" },
                        { task: "Jack & Spare", interval: "", unit: "Miles", timeInterval: "", info: "Monthly Inspection Service" },
                        { task: "Body Appearance", interval: "", unit: "Miles", timeInterval: "", info: "Monthly Inspection Service" }
                    ]},
                    { id: "R418", desc: "2012 Polaris GEM Cart (Electric)", schedule: [
                        { task: "Battery Fluid Check", interval: "N/A", unit: "Hours", timeInterval: "Monthly", info: "" },
                        { task: "Clean Battery Terminals", interval: "N/A", unit: "Hours", timeInterval: "Monthly", info: "" },
                        { task: "Torque Transaxle Shaft Nuts", interval: "25", unit: "Hours", timeInterval: "Monthly", info: "" },
                        { task: "Tire Rotation", interval: "50", unit: "Hours", timeInterval: "3 Months", info: "/ 5,000 Miles" },
                        { task: "General Lubrication", interval: "50", unit: "Hours", timeInterval: "3 Months", info: "" },
                        { task: "Steering/Suspension Lube", interval: "50", unit: "Hours", timeInterval: "6 Months", info: "" },
                        { task: "Gearbox (Transaxle) Oil", interval: "300", unit: "Hours", timeInterval: "Yearly", info: "" },
                        { task: "Brake Fluid Flush", interval: "200", unit: "Hours", timeInterval: "24 Months", info: "" },
                        { task: "Brakes/Lights", interval: "", unit: "Hours", timeInterval: "", info: "Monthly Inspection Service" },
                        { task: "Safety Gear", interval: "", unit: "Hours", timeInterval: "", info: "Monthly Inspection Service" },
                        { task: "Jack & Spare", interval: "", unit: "Hours", timeInterval: "", info: "Monthly Inspection Service" },
                        { task: "Body Appearance", interval: "", unit: "Hours", timeInterval: "", info: "Monthly Inspection Service" }
                    ]},
                    { id: "CAT", desc: "2005 Caterpillar 420E (Diesel)", schedule: [
                        { task: "Lubricate Backhoe Bearings", interval: "10", unit: "Hours", timeInterval: "Daily", info: "" },
                        { task: "Lubricate Loader Bearings", interval: "10", unit: "Hours", timeInterval: "Daily", info: "" },
                        { task: "Cab Air Filter Cleaning", interval: "50", unit: "Hours", timeInterval: "Weekly", info: "" },
                        { task: "Drain Fuel Tank Sediment", interval: "50", unit: "Hours", timeInterval: "Weekly", info: "" },
                        { task: "Axle Breather Cleaning", interval: "250", unit: "Hours", timeInterval: "Monthly", info: "" },
                        { task: "Engine Oil & Filter", interval: "500", unit: "Hours", timeInterval: "3 Months", info: "" },
                        { task: "Fuel & Hydraulic Filters", interval: "500", unit: "Hours", timeInterval: "3 Months", info: "" },
                        { task: "Axle & Final Drive Oil", interval: "1000", unit: "Hours", timeInterval: "6 Months", info: "" },
                        { task: "Engine Valve Lash Check", interval: "1000", unit: "Hours", timeInterval: "N/A", info: "" },
                        { task: "Hydraulic System Oil", interval: "2000", unit: "Hours", timeInterval: "1 Year", info: "(3k if HYDO Adv 10)" },
                        { task: "Antifreeze", interval: "", unit: "Hours", timeInterval: "", info: "Monthly Inspection Service" },
                        { task: "Brakes/Lights", interval: "", unit: "Hours", timeInterval: "", info: "Monthly Inspection Service" },
                        { task: "Safety Gear", interval: "", unit: "Hours", timeInterval: "", info: "Monthly Inspection Service" },
                        { task: "Body Appearance", interval: "", unit: "Hours", timeInterval: "", info: "Monthly Inspection Service" }
                    ]},
                    { id: "07MULE", desc: "2007 Kawasaki Mule (Gas)", schedule: [
                        { task: "Engine Oil Change", interval: "100", unit: "Hours", timeInterval: "6 Months", info: "" },
                        { task: "Engine Oil Filter", interval: "200", unit: "Hours", timeInterval: "Yearly", info: "" },
                        { task: "Air Filter Clean", interval: "100", unit: "Hours", timeInterval: "Yearly", info: "" },
                        { task: "Air Filter Replace", interval: "200", unit: "Hours", timeInterval: "Yearly", info: "" },
                        { task: "Spark Plug", interval: "100", unit: "Hours", timeInterval: "", info: "Clean/Gap 250 hrs" },
                        { task: "Drive Belt Inspection", interval: "200", unit: "Hours", timeInterval: "2,500 Miles", info: "" },
                        { task: "General Lubrication", interval: "200", unit: "Hours", timeInterval: "2,500 Miles", info: "" },
                        { task: "Valve Clearance Adjust", interval: "300", unit: "Hours", timeInterval: "500 Hours", info: "" },
                        { task: "Gear Case / Trans Oil", interval: "500", unit: "Hours", timeInterval: "Yearly", info: "" },
                        { task: "Coolant / Brake Fluid", interval: "N/A", unit: "Hours", timeInterval: "Every 2 Years", info: "" },
                        { task: "Antifreeze", interval: "", unit: "Hours", timeInterval: "", info: "Monthly Inspection Service" },
                        { task: "Brakes/Lights", interval: "", unit: "Hours", timeInterval: "", info: "Monthly Inspection Service" },
                        { task: "Safety Gear", interval: "", unit: "Hours", timeInterval: "", info: "Monthly Inspection Service" },
                        { task: "Body Appearance", interval: "", unit: "Hours", timeInterval: "", info: "Monthly Inspection Service" }
                    ]}
                ],
                inspections: [], services: [],
                settings: { 
                    checklistItems: [
                        "Oil", "Antifreeze", "Brakes/Lights", "Fan Belt(s)", "Battery & Connections", 
                        "Tire Cond. & Pressure – Lug Bolts", "Power Steering/Hyd. Oil Level", 
                        "Clutch Operation – Adjust.", "Body Appearance", "Engine", "Transmission", 
                        "Differential & Axels", "Radiator/Heater Hoses", "Hoist & Pump & Hoses", 
                        "Lights & Turn Signals – Flasher", "Brakes & Fluid Level", "Horn", 
                        "Wipers & Washers", "Emergency Brake", "Drain Air Tank (Brakes)", 
                        "Oil Pressure", "Ammeter", "Temperature", "Fuel", "Speed Or Hour Meter", 
                        "Flares", "Fire Extinguisher", "First Aid Kit", "Credit Card", "Registration", 
                        "Jack & Handle", "Lug Wrench", "Spare Tire", "Seat Belts", "Binders", "Chains", 
                        "Brackets (Flat Bed)", "License Plates", "Other State Paperwork"
                    ] 
                }
            },
            inventory: { items: [], transactions: [] },
            winterization: { fall: {}, spring: {} },
            firstAid: { categories: [], items: [], logs: [] }
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