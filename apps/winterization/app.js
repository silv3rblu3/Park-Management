// apps/winterization/app.js

function initWinterizationLogic() {
    let winterData = StateManager.getAppData('winterization');
    
    // If it's a completely fresh load, inject the defaults
    if (Object.keys(winterData).length === 0) {
        winterData = {
            fall: {
                "A-Loop": [
                    { category: "Water Shut-Off", tasks: [{text: "A-Loop", media: [], inputs: []}] },
                    { category: "Electrical", tasks: [{text: "A Loop OFF", media: [], inputs: []}] }
                ]
            },
            spring: {
                "A-Loop": [
                    { category: "Water Open", tasks: [{text: "A-Loop", media: [], inputs: []}] },
                    { category: "Electrical", tasks: [{text: "A Loop ON", media: [], inputs: []}] }
                ]
            }
        };
        StateManager.setAppData('winterization', winterData);
    }

    let currentSeason = 'fall';
    let areas = Object.keys(winterData.fall || {});
    let currentArea = areas[0];

    // Helper to safely write back to the global state
    const safeSave = () => {
        StateManager.setAppData('winterization', winterData);
    };

    // --- Core Rendering UI Functions ---
    const renderAreaTabs = () => {
        const container = document.getElementById('area-tabs');
        if(!container) return;
        container.innerHTML = ''; 
        areas = Object.keys(winterData[currentSeason] || {});
        if (!areas.includes(currentArea) && areas.length > 0) currentArea = areas[0];
        
        areas.forEach(area => {
            const btn = document.createElement('button'); 
            btn.className = `btn-outline area-tab ${area === currentArea ? 'active' : ''}`; 
            if(area === currentArea) {
                btn.classList.remove('btn-outline');
                btn.classList.add('btn-primary');
            }
            btn.textContent = area;
            btn.onclick = () => { currentArea = area; renderAreaTabs(); renderTasks(); };
            container.appendChild(btn);
        });
    };

    const generateAreaDOM = (season, area, forPrint = false, printBlank = false) => {
        const container = document.createElement('div');
        let innerContent = "";
        const seasonData = winterData[season][area] || [];
        
        seasonData.forEach((section, sectionIdx) => {
            if (section.category === "WARNING") {
                innerContent += `<div style="background-color: var(--warning-color); padding: 10px; border-radius: var(--radius-md); font-weight: bold; margin-bottom: 15px; color: #000;">⚠️ ${section.warningText}</div>`;
                return; 
            }

            innerContent += `<div style="margin-bottom: 30px;">
                <h3 style="background-color: var(--accent-primary); color: white; padding: 10px; border-radius: var(--radius-md) var(--radius-md) 0 0; margin-bottom: 0;">${section.category}</h3>
                <div class="app-table-container" style="border-radius: 0 0 var(--radius-md) var(--radius-md); border-top: none;">
                    <table class="app-table">
                        <thead><tr><th>Item</th>`;
            
            let columnsToRender = section.columns ? section.columns : ["Action"];
            columnsToRender.forEach((col, colIdx) => { 
                if(!forPrint) {
                    innerContent += `<th>${col} <br><button class="btn-outline fill-trigger" style="padding: 2px 5px; font-size: 0.8rem; margin-top: 5px;" data-idx="${colIdx * 2}" data-type="Date">⬇️ Fill</button></th>
                                  <th>Initials <br><button class="btn-outline fill-trigger" style="padding: 2px 5px; font-size: 0.8rem; margin-top: 5px;" data-idx="${(colIdx * 2) + 1}" data-type="Initials">⬇️ Fill</button></th>`; 
                } else {
                    innerContent += `<th>${col}</th><th>Initials</th>`;
                }
            });
            innerContent += `</tr></thead><tbody>`;

            section.tasks.forEach((task, taskIdx) => {
                if (!task.inputs) task.inputs = [];
                innerContent += `<tr><td><strong>${task.text}</strong></td>`;
                
                let inputIdx = 0;
                columnsToRender.forEach(() => {
                    if (forPrint) {
                        let dateVal = (!printBlank && task.inputs[inputIdx]) ? task.inputs[inputIdx] : '';
                        let initVal = (!printBlank && task.inputs[inputIdx+1]) ? task.inputs[inputIdx+1] : '';
                        innerContent += `<td>${dateVal}</td><td>${initVal}</td>`;
                    } else {
                        let dateVal = task.inputs[inputIdx] || '';
                        let initVal = task.inputs[inputIdx+1] || '';
                        innerContent += `<td><input type="date" class="app-input persistent-input" data-season="${season}" data-area="${area}" data-sec="${sectionIdx}" data-task="${taskIdx}" data-idx="${inputIdx}" value="${dateVal}" style="margin: 0;"></td>
                                      <td><input type="text" maxlength="3" class="app-input persistent-input" data-season="${season}" data-area="${area}" data-sec="${sectionIdx}" data-task="${taskIdx}" data-idx="${inputIdx+1}" value="${initVal}" style="margin: 0; width: 60px;"></td>`;
                    }
                    inputIdx += 2;
                });
                innerContent += `</tr>`;
            });
            innerContent += `</tbody></table></div></div>`;
        });
        container.innerHTML = innerContent;
        return container;
    };

    const renderTasks = () => {
        const container = document.getElementById('task-content');
        if (!currentArea || !winterData[currentSeason][currentArea]) { container.innerHTML = '<p>No data available.</p>'; return; }
        container.innerHTML = '';
        container.appendChild(generateAreaDOM(currentSeason, currentArea));
    };

    // --- Event Listeners ---
    
    // Data Persistence (Auto-Save on type)
    document.getElementById('winterization-wrapper').addEventListener('input', (e) => {
        if (e.target.classList.contains('persistent-input')) {
            const s = e.target.getAttribute('data-season');
            const a = e.target.getAttribute('data-area');
            const sec = parseInt(e.target.getAttribute('data-sec'));
            const t = parseInt(e.target.getAttribute('data-task'));
            const idx = parseInt(e.target.getAttribute('data-idx'));
            
            if (!winterData[s][a][sec].tasks[t].inputs) winterData[s][a][sec].tasks[t].inputs = [];
            winterData[s][a][sec].tasks[t].inputs[idx] = e.target.value;
            safeSave();
        }
    });

    // Season Tabs
    document.querySelectorAll('.season-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            document.querySelectorAll('.season-tab').forEach(t => {
                t.classList.remove('btn-primary'); t.classList.add('btn-outline');
            });
            e.target.classList.remove('btn-outline'); e.target.classList.add('btn-primary');
            currentSeason = e.target.getAttribute('data-season'); 
            renderAreaTabs(); renderTasks();
        });
    });

    // Toggle Edit Mode
    const viewMode = document.getElementById('view-mode');
    const editMode = document.getElementById('edit-mode');
    
    document.getElementById('toggle-edit-btn').addEventListener('click', () => { 
        viewMode.classList.add('hidden'); 
        editMode.classList.remove('hidden');
        populateEditorAreaSelect();
    });

    document.getElementById('exit-edit-btn').addEventListener('click', () => { 
        editMode.classList.add('hidden'); 
        viewMode.classList.remove('hidden'); 
        renderAreaTabs(); 
        renderTasks();
        NotificationSystem.show('Configuration Saved', 'success');
    });

    const populateEditorAreaSelect = () => { 
        const sel = document.getElementById('editor-area-select');
        sel.innerHTML = ''; 
        Object.keys(winterData[document.getElementById('editor-season-select').value] || {}).forEach(area => { 
            sel.innerHTML += `<option value="${area}">${area}</option>`; 
        }); 
    };

    document.getElementById('editor-season-select').addEventListener('change', populateEditorAreaSelect);

    // Bootstrap Initial Load
    renderAreaTabs();
    renderTasks();
}