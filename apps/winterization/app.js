// apps/winterization/app.js

function initWinterizationLogic() {
    // 1. Factory Defaults Helper
    const genSites = (start, end) => Array.from({length: end - start + 1}, (_, i) => ({ text: `Site ${i + start}`, media: [], inputs: [] }));
    const formatArea = (sections) => ({ tools: "", sections: sections });
    
    let wintData = StateManager.getAppData('winterization');
    let editorBackupData = null; // Used to restore state if the user cancels edits
    
    // Inject massive default blueprint if empty
    if (!wintData.fall || Object.keys(wintData.fall).length === 0) {
        wintData = {
            fall: {
                "A-Loop": formatArea([
                    { category: "Water Shut-Off", tasks: [{text: "A-Loop", media: [], inputs: []}] },
                    { category: "Main Drains", tasks: [{text: "Open Main Drain A", media: [], inputs: []}, {text: "Open Muskie Point (Fish Cleaning)", media: [], inputs: []}, {text: "Close Main Drain A", media: [], inputs: []}, {text: "Close Muskie Point (Fish Cleaning)", media: [], inputs: []}] },
                    { category: "Fish Station", tasks: [{text: "Tear it apart", media: [], inputs: []}, {text: "Tear it apart part 2", media: [], inputs: []}] },
                    { category: "Camp Spickets", columns: ["Open Spickets", "Open Spicket Drains", "Close Spicket Drains"], tasks: [{text: "Site 2", media: [], inputs: []}, {text: "Site 7", media: [], inputs: []}, {text: "Site 13", media: [], inputs: []}, {text: "Site 18", media: [], inputs: []}, {text: "Yurt", media: [], inputs: []}] },
                    { category: "Electrical", tasks: [{text: "A Loop OFF", media: [], inputs: []}] }
                ]),
                "B-Loop": formatArea([
                    { category: "Water Shut-Off", tasks: [{text: "B-C Loop", media: [], inputs: []}] },
                    { category: "Main Drains", tasks: [{text: "Open Main Drain B-C", media: [], inputs: []}, {text: "Open Site 28", media: [], inputs: []}, {text: "Open Cul-de-sac", media: [], inputs: []}, {text: "Open Trail Between B & C", media: [], inputs: []}, {text: "Close Main Drain B-C", media: [], inputs: []}, {text: "Close Site 28", media: [], inputs: []}, {text: "Close Cul-de-sac", media: [], inputs: []}, {text: "Close Trail Between B & C", media: [], inputs: []}] },
                    { category: "Camp Spickets", columns: ["Open Spickets", "Open Spicket Drains", "Close Spicket Drains"], tasks: genSites(23, 46) },
                    { category: "Electrical", tasks: [{text: "B Loop OFF", media: [], inputs: []}] }
                ]),
                "C-Loop": formatArea([
                    { category: "Water Shut-Off", tasks: [{text: "B-C Loop", media: [], inputs: []}] },
                    { category: "Main Drains", tasks: [{text: "Open Main Drains", media: [], inputs: []}, {text: "Open Site 61", media: [], inputs: []}, {text: "Close Main Drains", media: [], inputs: []}, {text: "Close Site 61", media: [], inputs: []}] },
                    { category: "Camp Spickets", columns: ["Open Spickets", "Open Spicket Drains", "Close Spicket Drains"], tasks: genSites(47, 68) },
                    { category: "Electrical", tasks: [{text: "C Loop OFF", media: [], inputs: []}] }
                ]),
                "Shower House": formatArea([
                    { category: "WARNING", warningText: "*** FLIP THE BREAKER OFF BEFORE YOU DRAIN THE WATER HEATER!!!! ***", isCritical: true },
                    { category: "Chase", tasks: [{text: "Water Heater Breaker Off", media: [], inputs: []}, {text: "Drained Water Heater", media: [], inputs: []}, {text: "Water Heater Valve Caps(3)", media: [], inputs: []}, {text: "Sloan Valves (6)", media: [], inputs: []}, {text: "Open 6 Chase Spickets", media: [], inputs: []}] },
                    { category: "Male Side", tasks: [{text: "Take Push Buttons Off Sinks", media: [], inputs: []}, {text: "Take Push Buttons Off Showers", media: [], inputs: []}, {text: "Take Shower Heads Off", media: [], inputs: []}, {text: "Open Spicket Under Sinks", media: [], inputs: []}, {text: "Flush Toilets W/ Anti-Freeze", media: [], inputs: []}] },
                    { category: "Female Side", tasks: [{text: "Take Push Buttons Off Sinks", media: [], inputs: []}, {text: "Take Push Buttons Off Showers", media: [], inputs: []}, {text: "Take Shower Heads Off", media: [], inputs: []}, {text: "Open Spicket Under Sinks", media: [], inputs: []}, {text: "Flush Toilets W/ Anti-Freeze", media: [], inputs: []}] },
                    { category: "ADA", tasks: [{text: "Take Push Buttons Off Sinks", media: [], inputs: []}, {text: "Take Push Buttons Off Showers", media: [], inputs: []}, {text: "Take Shower Head Off", media: [], inputs: []}, {text: "Flush Toilet W/ Anti-Freeze", media: [], inputs: []}] },
                    { category: "Outside", tasks: [{text: "Open Outside Spicket", media: [], inputs: []}, {text: "Shut-Off Water Main", media: [], inputs: []}] }
                ]),
                "P-Point": formatArea([
                    { category: "Water Shut-Off", tasks: [{text: "P-Point", media: [], inputs: []}] },
                    { category: "Main Drains", tasks: [{text: "Open P-Point Shelter Side", media: [], inputs: []}, {text: "Open P-Point Lake Side", media: [], inputs: []}, {text: "Close P-Point Shelter Side", media: [], inputs: []}, {text: "Close P-Point Lake Side", media: [], inputs: []}] },
                    { category: "Electrical", tasks: [{text: "Electrical OFF", media: [], inputs: []}] }
                ]),
                "Dump Station": formatArea([
                    { category: "Water Shut-Off", tasks: [{text: "Dump Station", media: [], inputs: []}] },
                    { category: "Main Drains", tasks: [{text: "Open Dump Station", media: [], inputs: []}, {text: "Close Dump Station", media: [], inputs: []}] },
                    { category: "Batteries", tasks: [{text: "Take Batteries Out", media: [], inputs: []}] },
                    { category: "Dump Tower", tasks: [{text: "Take Hose Off", media: [], inputs: []}, {text: "Take bottom flex pipe off", media: [], inputs: []}] }
                ]),
                "Fish Cleaning Station": formatArea([
                    { category: "Operations", tasks: [{text: "Turn power OFF", media: [], inputs: []}, {text: "Take spray hoses OFF", media: [], inputs: []}] }
                ])
            },
            spring: {
                "A-Loop": formatArea([
                    { category: "Water Open", tasks: [{text: "A-Loop", media: [], inputs: []}] },
                    { category: "Fish Station", tasks: [{text: "Put It Back Together", media: [], inputs: []}, {text: "Put It Together part 2", media: [], inputs: []}] },
                    { category: "Camp Spickets", columns: ["Close Spickets"], tasks: [{text: "Site 2", media: [], inputs: []}, {text: "Site 7", media: [], inputs: []}, {text: "Site 13", media: [], inputs: []}, {text: "Site 18", media: [], inputs: []}, {text: "Yurt", media: [], inputs: []}] },
                    { category: "Electrical", tasks: [{text: "A Loop ON", media: [], inputs: []}] }
                ]),
                "B-Loop": formatArea([
                    { category: "Water Open", tasks: [{text: "B-C Loop", media: [], inputs: []}] },
                    { category: "Camp Spickets", columns: ["Close Spickets"], tasks: genSites(23, 46) },
                    { category: "Electrical", tasks: [{text: "B Loop ON", media: [], inputs: []}] }
                ]),
                "C-Loop": formatArea([
                    { category: "Water Open", tasks: [{text: "B-C Loop", media: [], inputs: []}] },
                    { category: "Camp Spickets", columns: ["Close Spickets"], tasks: genSites(47, 68) },
                    { category: "Electrical", tasks: [{text: "C Loop ON", media: [], inputs: []}] }
                ]),
                "Shower House": formatArea([
                    { category: "WARNING", warningText: "*** Make sure that the Water Heater HAS WATER IN IT BEFORE YOU FLIP THE BREAKER ON!!! ***", isCritical: true },
                    { category: "Male Side", tasks: [{text: "Put Push Buttons On Sinks", media: [], inputs: []}, {text: "Put Push Buttons On Showers", media: [], inputs: []}, {text: "Put Shower Heads On", media: [], inputs: []}, {text: "Close Spicket Under Sinks", media: [], inputs: []}] },
                    { category: "Female Side", tasks: [{text: "Put Push Buttons On Sinks", media: [], inputs: []}, {text: "Put Push Buttons On Showers", media: [], inputs: []}, {text: "Put Shower Heads On", media: [], inputs: []}, {text: "Close Spicket Under Sinks", media: [], inputs: []}] },
                    { category: "ADA", tasks: [{text: "Put Push Buttons On Sinks", media: [], inputs: []}, {text: "Put Push Buttons On Showers", media: [], inputs: []}, {text: "Put Shower Heads On", media: [], inputs: []}] },
                    { category: "Chase", tasks: [{text: "Close 6 Chase Spickets", media: [], inputs: []}, {text: "Close Water Heater Drain", media: [], inputs: []}, {text: "Water Heater Valve Caps(3)", media: [], inputs: []}, {text: "Sloan Valves (6)", media: [], inputs: []}, {text: "Water Heater Breaker On***", media: [], inputs: []}] },
                    { category: "Outside", tasks: [{text: "Close Outside Spicket", media: [], inputs: []}, {text: "Open Water Main", media: [], inputs: []}] }
                ]),
                "P-Point": formatArea([
                    { category: "Water Open", tasks: [{text: "P-Point", media: [], inputs: []}] },
                    { category: "Electrical", tasks: [{text: "Electrical ON", media: [], inputs: []}] } 
                ]),
                "Dump Station": formatArea([
                    { category: "Water Open", tasks: [{text: "Dump Station", media: [], inputs: []}] },
                    { category: "Batteries", tasks: [{text: "Put batteries back in", media: [], inputs: []}] },
                    { category: "Dump Tower", tasks: [{text: "Put Hose On", media: [], inputs: []}, {text: "Put Bottom Flex Pipe On", media: [], inputs: []}] }
                ]),
                "Fish Cleaning Station": formatArea([
                    { category: "Operations", tasks: [{text: "Turn power ON", media: [], inputs: []}, {text: "Put spray hoses ON", media: [], inputs: []}] } 
                ])
            }
        };
        StateManager.setAppData('winterization', wintData);
    }

    // Migration Script: Convert existing arrays into objects with the new tools string.
    ['fall', 'spring'].forEach(s => {
        if (wintData[s]) {
            Object.keys(wintData[s]).forEach(a => {
                if (Array.isArray(wintData[s][a])) {
                    wintData[s][a] = { tools: "", sections: wintData[s][a] };
                }
            });
        }
    });

    const safeSave = () => { StateManager.setAppData('winterization', wintData); };

    let currentSeason = 'fall';
    let areas = Object.keys(wintData[currentSeason] || {});
    let currentArea = areas[0];

    // --- CORE RENDERING ---
    const areaTabsContainer = document.getElementById('wint-area-tabs');
    const taskContentContainer = document.getElementById('wint-task-content');

    function generateAreaDOM(season, area, forPrint = false, printBlank = false) {
        const container = document.createElement('div');
        let innerContent = "";
        let yearPrefix = '';
        
        if (forPrint) {
            const leaveYearBlank = document.getElementById('wint-print-blank-year') && document.getElementById('wint-print-blank-year').checked;
            yearPrefix = leaveYearBlank ? 'Year: _______________ ' : (document.getElementById('wint-print-year').value ? `${document.getElementById('wint-print-year').value} ` : '');
            container.className = 'print-area-block';
            innerContent += `<h2 style="margin-bottom: 10px; padding-bottom: 5px; border-bottom: 2px solid black;">${yearPrefix}${season.toUpperCase()} - ${area}</h2>`;
        }

        const seasonData = wintData[season][area] || { tools: "", sections: [] };
        const safeArea = area.replace(/'/g, "\\'");
        
        if (seasonData.tools) {
            innerContent += `
                <div style="background-color: rgba(0,0,0,0.03); padding: 15px; border-radius: var(--radius-md); border-left: 4px solid var(--accent-primary); margin-bottom: 20px;">
                    <h4 style="margin-bottom: 5px;">🛠️ Tools & Equipment Needed</h4>
                    <p style="white-space: pre-wrap; font-size: 0.95rem; margin: 0;">${seasonData.tools}</p>
                </div>
            `;
        }
        
        seasonData.sections.forEach((section, sectionIdx) => {
            if (section.category === "WARNING") {
                innerContent += `<div style="background-color: ${section.isCritical ? '#ffe6e6' : 'var(--warning-color)'}; color: ${section.isCritical ? '#cc0000' : '#000'}; padding: 15px; font-weight: bold; border-left: 5px solid ${section.isCritical ? '#cc0000' : '#000'}; margin-bottom: 20px; border-radius: 4px;">${section.warningText}</div>`;
                return; 
            }

            innerContent += `<div style="margin-bottom: 30px;"><h3 style="background-color: rgba(0,0,0,0.04); padding: 8px; border-radius: 4px; margin-bottom: 15px;">${section.category}</h3><div style="width: 100%; overflow-x: auto;">`;
            let columnsToRender = section.columns ? section.columns : ["Action"];
            let tableHtml = `<table class="wint-task-table" style="width: 100%; border-collapse: collapse;"><thead><tr><th style="padding:10px; border:1px solid var(--border-color); background:rgba(0,0,0,0.03);">Item</th>`;
            
            columnsToRender.forEach((col, colIdx) => { 
                tableHtml += `<th style="padding:10px; border:1px solid var(--border-color); background:rgba(0,0,0,0.03); width: 130px; text-align: center;">${col} (Date) ${!forPrint ? `<br><button class="btn-outline wint-fill-trigger" style="padding:2px; font-size:0.8rem; width:100%; margin-top:5px;" data-idx="${colIdx * 2}" data-type="Date">⬇️ Fill</button>` : ''}</th>
                              <th style="padding:10px; border:1px solid var(--border-color); background:rgba(0,0,0,0.03); width: 130px; text-align: center;">Initials ${!forPrint ? `<br><button class="btn-outline wint-fill-trigger" style="padding:2px; font-size:0.8rem; width:100%; margin-top:5px;" data-idx="${(colIdx * 2) + 1}" data-type="Initials">⬇️ Fill</button>` : ''}</th>`; 
            });
            tableHtml += `</tr></thead><tbody>`;

            section.tasks.forEach((task, taskIdx) => {
                if (!task.inputs) task.inputs = [];
                let mediaHtml = '';
                if (task.media && task.media.length > 0) {
                    task.media.forEach(m => {
                        if (m.url.trim() !== '') {
                            if (m.type === 'image') mediaHtml += `<img src="${m.url}" class="wint-task-media wint-lightbox-trigger" data-type="image" data-url="${m.url}" style="margin-left: 10px;">`;
                            if (m.type === 'video') mediaHtml += `<video src="${m.url}" class="wint-task-media wint-no-print wint-lightbox-trigger" data-type="video" data-url="${m.url}" style="margin-left: 10px;"></video><span class="video-print-text" style="display:none;">📹 Video Available</span>`;
                        }
                    });
                }

                tableHtml += `<tr><td style="padding:10px; border:1px solid var(--border-color);"><div style="display:flex; justify-content:space-between; align-items:center;"><strong>${task.text}</strong><div style="display:flex;">${mediaHtml}</div></div></td>`;
                    
                let inputIdx = 0;
                columnsToRender.forEach(() => {
                    if (forPrint) {
                        let dateVal = (!printBlank && task.inputs[inputIdx]) ? task.inputs[inputIdx] : '';
                        let initVal = (!printBlank && task.inputs[inputIdx+1]) ? task.inputs[inputIdx+1] : '';
                        tableHtml += `<td style="border:1px solid #000; text-align:center;"><div class="print-blank-line">${dateVal}</div></td><td style="border:1px solid #000; text-align:center;"><div class="print-blank-line">${initVal}</div></td>`;
                    } else {
                        let dateVal = task.inputs[inputIdx] || '';
                        let initVal = task.inputs[inputIdx+1] || '';
                        tableHtml += `<td style="padding:5px; border:1px solid var(--border-color);"><input type="date" class="app-input persistent-input" data-season="${season}" data-area="${safeArea}" data-sec="${sectionIdx}" data-task="${taskIdx}" data-idx="${inputIdx}" value="${dateVal}" style="margin:0;"></td>
                                      <td style="padding:5px; border:1px solid var(--border-color);"><input type="text" maxlength="3" class="app-input persistent-input" data-season="${season}" data-area="${safeArea}" data-sec="${sectionIdx}" data-task="${taskIdx}" data-idx="${inputIdx+1}" value="${initVal}" style="margin:0; text-align:center;"></td>`;
                    }
                    inputIdx += 2;
                });
                tableHtml += `</tr>`;
            });
            tableHtml += `</tbody></table></div></div>`;
            innerContent += tableHtml;
        });

        container.innerHTML += innerContent;
        return container;
    }

    function renderAreaTabs() {
        areaTabsContainer.innerHTML = ''; areas = Object.keys(wintData[currentSeason] || {});
        if (!areas.includes(currentArea) && areas.length > 0) currentArea = areas[0];
        areas.forEach(area => {
            const btn = document.createElement('button'); 
            btn.className = `btn-outline ${area === currentArea ? 'btn-primary' : ''}`; 
            if(area === currentArea) btn.classList.remove('btn-outline');
            btn.textContent = area;
            btn.onclick = () => { currentArea = area; renderAreaTabs(); renderTasks(); };
            areaTabsContainer.appendChild(btn);
        });
    }

    function renderTasks() {
        if (!currentArea || !wintData[currentSeason][currentArea]) { taskContentContainer.innerHTML = '<p>No data available.</p>'; return; }
        taskContentContainer.innerHTML = '';
        taskContentContainer.appendChild(generateAreaDOM(currentSeason, currentArea));
    }

    document.getElementById('wint-wrapper').addEventListener('input', (e) => {
        if (e.target.classList.contains('persistent-input')) {
            const s = e.target.getAttribute('data-season');
            const a = e.target.getAttribute('data-area');
            const sec = parseInt(e.target.getAttribute('data-sec'));
            const t = parseInt(e.target.getAttribute('data-task'));
            const idx = parseInt(e.target.getAttribute('data-idx'));
            
            if (!wintData[s][a].sections[sec].tasks[t].inputs) wintData[s][a].sections[sec].tasks[t].inputs = [];
            wintData[s][a].sections[sec].tasks[t].inputs[idx] = e.target.value;
            safeSave();
        }
    });

    document.querySelectorAll('.wint-season-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            document.querySelectorAll('.wint-season-tab').forEach(t => { t.classList.remove('btn-primary'); t.classList.add('btn-outline'); }); 
            e.target.classList.add('btn-primary'); e.target.classList.remove('btn-outline');
            currentSeason = e.target.getAttribute('data-season'); renderAreaTabs(); renderTasks();
        });
    });

    const fillModal = document.getElementById('wint-fill-modal');
    let activeFillBtn = null; let activeFillIndex = 0;
    
    document.getElementById('wint-wrapper').addEventListener('click', (e) => {
        let btn = e.target.closest('.wint-fill-trigger');
        if (btn) {
            activeFillBtn = btn; activeFillIndex = parseInt(btn.getAttribute('data-idx'));
            const type = btn.getAttribute('data-type');
            document.getElementById('wint-fill-container').innerHTML = type === 'Date' ? `<input type="date" id="wint-fill-val" class="app-input">` : `<input type="text" id="wint-fill-val" class="app-input" placeholder="Initials">`;
            fillModal.showModal();
        }

        btn = e.target.closest('.wint-lightbox-trigger');
        if (btn) {
            const url = btn.getAttribute('data-url'); const type = btn.getAttribute('data-type');
            const img = document.getElementById('wint-media-img'); const vid = document.getElementById('wint-media-vid');
            img.style.display = 'none'; vid.style.display = 'none';
            if(type === 'image') { img.src = url; img.style.display = 'block'; }
            if(type === 'video') { vid.src = url; vid.style.display = 'block'; vid.play(); }
            document.getElementById('wint-media-modal').showModal();
        }
    });

    document.getElementById('wint-cancel-fill').onclick = () => fillModal.close();
    document.getElementById('wint-confirm-fill').onclick = () => {
        const val = document.getElementById('wint-fill-val').value;
        if (val !== '') {
            const rows = activeFillBtn.closest('table').querySelectorAll('tbody tr');
            rows.forEach(row => { 
                const inputs = row.querySelectorAll('input.persistent-input'); 
                if (inputs[activeFillIndex]) {
                    inputs[activeFillIndex].value = val;
                    inputs[activeFillIndex].dispatchEvent(new Event('input', { bubbles: true })); 
                }
            });
        }
        fillModal.close();
    };

    document.getElementById('wint-close-media').onclick = () => {
        document.getElementById('wint-media-vid').pause();
        document.getElementById('wint-media-modal').close();
    };

    const printModal = document.getElementById('wint-print-modal');
    
    function populatePrintCheckboxes(season) {
        const container = document.getElementById('wint-print-checkboxes');
        container.innerHTML = '';
        Object.keys(wintData[season] || {}).forEach(area => {
            container.innerHTML += `<label style="cursor: pointer;"><input type="checkbox" class="wint-print-cb" value="${area}" checked> ${area}</label>`;
        });
    }

    document.getElementById('wint-open-print-btn').addEventListener('click', () => {
        const printSeasonSelect = document.getElementById('wint-print-season-select');
        printSeasonSelect.value = currentSeason;
        document.getElementById('wint-print-year').value = new Date().getFullYear();
        populatePrintCheckboxes(currentSeason);
        printModal.showModal();
    });

    document.getElementById('wint-print-season-select').addEventListener('change', (e) => {
        populatePrintCheckboxes(e.target.value);
    });

    document.getElementById('wint-close-print').onclick = () => printModal.close();
    
    document.getElementById('wint-select-all-print').onclick = (e) => {
        const cbs = document.querySelectorAll('.wint-print-cb');
        const allChecked = Array.from(cbs).every(cb => cb.checked);
        cbs.forEach(cb => cb.checked = !allChecked);
        e.target.innerText = allChecked ? "Select All" : "Deselect All";
    };

    document.getElementById('wint-execute-print').onclick = () => {
        const cbs = document.querySelectorAll('.wint-print-cb:checked');
        if (cbs.length === 0) return NotificationSystem.show("Select at least one area.", "error");
        
        const printContainer = document.getElementById('wint-print-container'); 
        printContainer.innerHTML = '';
        const printBlank = document.getElementById('wint-print-blank').checked;
        const selectedPrintSeason = document.getElementById('wint-print-season-select').value;
        
        Array.from(cbs).forEach(cb => { printContainer.appendChild(generateAreaDOM(selectedPrintSeason, cb.value, true, printBlank)); });
        printModal.close(); 
        setTimeout(() => window.print(), 200); 
    };

    // --- EDIT MODE ---
    const appToolbar = document.getElementById('wint-app-toolbar');
    const viewMode = document.getElementById('wint-view-mode'); 
    const editMode = document.getElementById('wint-edit-mode');
    const edSeason = document.getElementById('wint-editor-season');
    const edArea = document.getElementById('wint-editor-area');
    
    document.getElementById('wint-toggle-edit-btn').onclick = () => { 
        editorBackupData = JSON.stringify(wintData);
        appToolbar.style.display = 'none';
        viewMode.style.display = 'none'; 
        editMode.style.display = 'block'; 
        
        edSeason.value = currentSeason;
        populateEditorAreaSelect(); 
        
        if (Array.from(edArea.options).some(opt => opt.value === currentArea)) {
            edArea.value = currentArea;
        }
        
        renderDataEditor(); 
    };
    
    document.getElementById('wint-exit-edit-btn').onclick = () => { 
        saveCurrentEditorState(); 
        editorBackupData = null;
        editMode.style.display = 'none'; 
        viewMode.style.display = 'block'; 
        appToolbar.style.display = 'flex';
        renderAreaTabs(); renderTasks(); 
    };

    document.getElementById('wint-cancel-edit-btn').onclick = () => { 
        if (editorBackupData) {
            wintData = JSON.parse(editorBackupData);
            safeSave(); 
            editorBackupData = null;
        }
        editMode.style.display = 'none'; 
        viewMode.style.display = 'block'; 
        appToolbar.style.display = 'flex';
        renderAreaTabs(); renderTasks(); 
    };

    function populateEditorAreaSelect() { 
        edArea.innerHTML = ''; 
        Object.keys(wintData[edSeason.value] || {}).forEach(area => { edArea.innerHTML += `<option value="${area}">${area}</option>`; }); 
    }
    
    edSeason.addEventListener('change', () => { 
        saveCurrentEditorState();
        const previousArea = edArea.value; 
        populateEditorAreaSelect(); 
        
        if (Array.from(edArea.options).some(opt => opt.value === previousArea)) {
            edArea.value = previousArea;
        }
        renderDataEditor(); 
    }); 
    
    edArea.addEventListener('change', renderDataEditor);

    // Wired to use DialogSystem
    document.getElementById('wint-add-area-btn').onclick = async () => {
        const name = await DialogSystem.prompt("Add Area", "Enter new area name:");
        if(name && typeof name === 'string' && !wintData[edSeason.value][name]) { 
            wintData[edSeason.value][name] = { tools: "", sections: [] }; 
            populateEditorAreaSelect(); 
            edArea.value = name; 
            renderDataEditor(); 
            safeSave(); 
        }
    };

    document.getElementById('wint-rename-area-btn').onclick = async () => {
        const oldName = edArea.value; 
        if (!oldName) return;
        const newName = await DialogSystem.prompt("Rename Area", "Rename area to:", oldName);
        if(newName && typeof newName === 'string' && newName !== oldName && !wintData[edSeason.value][newName]) {
            wintData[edSeason.value][newName] = wintData[edSeason.value][oldName]; 
            delete wintData[edSeason.value][oldName];
            populateEditorAreaSelect(); 
            edArea.value = newName; 
            renderDataEditor(); 
            safeSave();
        }
    };

    document.getElementById('wint-delete-area-btn').onclick = async () => {
        if (!edArea.value) return;
        const confirmed = await DialogSystem.confirm("Delete Area", `Are you sure you want to permanently delete ${edArea.value}?`);
        if(confirmed) { 
            delete wintData[edSeason.value][edArea.value]; 
            populateEditorAreaSelect(); 
            renderDataEditor(); 
            safeSave(); 
        }
    };
    
    ['up', 'down'].forEach(dir => {
        document.getElementById(`wint-move-${dir}-btn`).onclick = () => {
            const s = edSeason.value; const a = edArea.value; if(!a) return;
            saveCurrentEditorState();
            const keys = Object.keys(wintData[s]); const idx = keys.indexOf(a);
            if ((dir === 'up' && idx > 0) || (dir === 'down' && idx < keys.length - 1)) {
                const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
                [keys[idx], keys[swapIdx]] = [keys[swapIdx], keys[idx]];
                const newData = {}; keys.forEach(k => newData[k] = wintData[s][k]);
                wintData[s] = newData; safeSave(); populateEditorAreaSelect(); edArea.value = a; renderDataEditor();
            }
        }
    });

    const catContainer = document.getElementById('wint-category-editor');
    
    function renderDataEditor() {
        const s = edSeason.value; const a = edArea.value; catContainer.innerHTML = ''; if (!wintData[s] || !wintData[s][a]) return;
        
        catContainer.innerHTML = `
            <div style="margin-bottom: 25px; background: rgba(0,0,0,0.02); border: 1px solid var(--border-color); padding: 15px; border-radius: var(--radius-md);">
                <label style="font-weight:bold; color: var(--accent-primary); display:block; margin-bottom: 10px;">🛠️ Tools Needed for this Area:</label>
                <textarea id="wint-editor-tools-input" class="app-input" rows="3" placeholder="List all wrenches, screwdrivers, or specific gear needed here...">${wintData[s][a].tools || ''}</textarea>
            </div>
        `;

        const warningBtn = document.getElementById('wint-add-warning-btn');
        if (wintData[s][a].sections.some(sec => sec.category === "WARNING")) {
            warningBtn.style.display = 'none';
        } else {
            warningBtn.style.display = 'inline-block';
        }

        wintData[s][a].sections.forEach((section, catIdx) => {
            const block = document.createElement('div'); block.style = "background: rgba(0,0,0,0.02); border: 1px solid var(--border-color); padding: 15px; margin-bottom: 15px; border-radius: var(--radius-md);";
            
            if (section.category === "WARNING") {
                block.innerHTML = `<div style="display:flex; justify-content:space-between; margin-bottom:10px;"><strong style="color:var(--danger-color);">WARNING BLOCK</strong><button class="btn-danger wint-del-cat" data-cat="${catIdx}">X</button></div>
                <textarea class="app-input wint-warn-inp" data-cat="${catIdx}" rows="2">${section.warningText}</textarea><label><input type="checkbox" class="wint-warn-crit" data-cat="${catIdx}" ${section.isCritical ? 'checked' : ''}> Critical Alert (Red)</label>`;
                catContainer.appendChild(block); return;
            }

            let html = `<div style="display:flex; justify-content:space-between; margin-bottom:10px;"><input type="text" value="${section.category}" class="app-input wint-cat-name" data-cat="${catIdx}" style="width: 50%; font-weight:bold;">
                <div><button class="btn-outline wint-move-cat" data-dir="up" data-cat="${catIdx}">↑</button> <button class="btn-outline wint-move-cat" data-dir="down" data-cat="${catIdx}">↓</button> <button class="btn-danger wint-del-cat" data-cat="${catIdx}">X</button></div></div><div>`;

            section.tasks.forEach((task, tIdx) => {
                html += `<div style="display:flex; gap:10px; margin-bottom:10px; padding:10px; background:var(--bg-surface); border:1px dashed var(--border-color);"><div style="flex:1;"><input type="text" value="${task.text}" class="app-input wint-task-txt" data-cat="${catIdx}" data-task="${tIdx}">
                <div style="display:flex; flex-direction:column; gap:5px;">`;
                task.media.forEach((m, mIdx) => {
                    html += `<div style="display:flex; gap:5px;"><select class="app-select wint-m-type" data-cat="${catIdx}" data-task="${tIdx}" data-media="${mIdx}"><option value="image" ${m.type==='image'?'selected':''}>Img</option><option value="video" ${m.type==='video'?'selected':''}>Vid</option></select><input type="text" value="${m.url}" class="app-input wint-m-url" data-cat="${catIdx}" data-task="${tIdx}" data-media="${mIdx}" placeholder="URL/Filename"><button class="btn-danger wint-del-m" data-cat="${catIdx}" data-task="${tIdx}" data-media="${mIdx}">X</button></div>`;
                });
                html += `</div><button class="btn-outline wint-add-m" data-cat="${catIdx}" data-task="${tIdx}" style="margin-top:5px; padding:4px 8px; font-size:0.8rem;">+ Media</button></div><button class="btn-danger wint-del-task" data-cat="${catIdx}" data-task="${tIdx}">Delete Task</button></div>`;
            });
            html += `</div><button class="btn-primary wint-add-task" data-cat="${catIdx}" style="margin-top:10px;">+ Task</button>`; block.innerHTML = html; catContainer.appendChild(block);
        });
    }

    document.getElementById('wint-wrapper').addEventListener('click', (e) => {
        let btn = e.target.closest('.wint-add-task'); if (btn) { saveCurrentEditorState(); wintData[edSeason.value][edArea.value].sections[btn.getAttribute('data-cat')].tasks.push({text: "New Task", media: [], inputs: []}); renderDataEditor(); }
        btn = e.target.closest('.wint-del-task'); if (btn) { saveCurrentEditorState(); wintData[edSeason.value][edArea.value].sections[btn.getAttribute('data-cat')].tasks.splice(btn.getAttribute('data-task'), 1); renderDataEditor(); }
        btn = e.target.closest('.wint-add-m'); if (btn) { saveCurrentEditorState(); wintData[edSeason.value][edArea.value].sections[btn.getAttribute('data-cat')].tasks[btn.getAttribute('data-task')].media.push({type: 'image', url: ''}); renderDataEditor(); }
        btn = e.target.closest('.wint-del-m'); if (btn) { saveCurrentEditorState(); wintData[edSeason.value][edArea.value].sections[btn.getAttribute('data-cat')].tasks[btn.getAttribute('data-task')].media.splice(btn.getAttribute('data-media'), 1); renderDataEditor(); }
        btn = e.target.closest('.wint-del-cat'); if (btn) { saveCurrentEditorState(); wintData[edSeason.value][edArea.value].sections.splice(btn.getAttribute('data-cat'), 1); renderDataEditor(); }
        btn = e.target.closest('.wint-move-cat'); if (btn) {
            saveCurrentEditorState(); const arr = wintData[edSeason.value][edArea.value].sections; const c = parseInt(btn.getAttribute('data-cat'));
            if(btn.getAttribute('data-dir') === 'up' && c > 0) { [arr[c-1], arr[c]] = [arr[c], arr[c-1]]; renderDataEditor(); }
            if(btn.getAttribute('data-dir') === 'down' && c < arr.length-1) { [arr[c], arr[c+1]] = [arr[c+1], arr[c]]; renderDataEditor(); }
        }
    });

    document.getElementById('wint-add-warning-btn').onclick = () => { saveCurrentEditorState(); wintData[edSeason.value][edArea.value].sections.unshift({ category: "WARNING", warningText: "NEW WARNING", isCritical: false }); renderDataEditor(); };
    document.getElementById('wint-add-cat-btn').onclick = () => { saveCurrentEditorState(); wintData[edSeason.value][edArea.value].sections.push({ category: "New Section", tasks: [] }); renderDataEditor(); };

    function saveCurrentEditorState() {
        const s = edSeason.value; const a = edArea.value; if (!wintData[s] || !wintData[s][a]) return;
        
        const toolsInput = document.getElementById('wint-editor-tools-input');
        if(toolsInput) wintData[s][a].tools = toolsInput.value;

        document.querySelectorAll('.wint-warn-inp').forEach(inp => { const c = inp.getAttribute('data-cat'); wintData[s][a].sections[c].warningText = inp.value; wintData[s][a].sections[c].isCritical = document.querySelector(`.wint-warn-crit[data-cat="${c}"]`).checked; });
        document.querySelectorAll('.wint-cat-name').forEach(inp => { wintData[s][a].sections[inp.getAttribute('data-cat')].category = inp.value; });
        document.querySelectorAll('.wint-task-txt').forEach(inp => { wintData[s][a].sections[inp.getAttribute('data-cat')].tasks[inp.getAttribute('data-task')].text = inp.value; });
        document.querySelectorAll('.wint-m-url').forEach(inp => {
            const c = inp.getAttribute('data-cat'); const t = inp.getAttribute('data-task'); const m = inp.getAttribute('data-media');
            wintData[s][a].sections[c].tasks[t].media[m] = { type: document.querySelector(`.wint-m-type[data-cat="${c}"][data-task="${t}"][data-media="${m}"]`).value, url: inp.value };
        });
        safeSave();
    }

    // --- EXCEL EXPORT (Requires exceljs and FileSaver.js in index.html) ---
    document.getElementById('wint-export-excel-btn').addEventListener('click', async () => {
        saveCurrentEditorState();
        if(typeof ExcelJS === 'undefined') return NotificationSystem.show("ExcelJS library not loaded.", "error");
        
        const workbook = new ExcelJS.Workbook(); workbook.creator = 'OmniHub Winter Ops';
        const year = new Date().getFullYear();

        ['fall', 'spring'].forEach(season => {
            Object.keys(wintData[season] || {}).forEach(area => {
                const ws = workbook.addWorksheet(`${season.substring(0,1).toUpperCase()} - ${area}`.substring(0, 31));
                ws.columns = [ { width: 45 }, { width: 15 }, { width: 15 }, { width: 15 }, { width: 15 } ];

                let rIdx = 1; ws.mergeCells(`A${rIdx}:C${rIdx}`);
                let tr = ws.getRow(rIdx); tr.getCell(1).value = `${year} ${season.toUpperCase()} - ${area}`; tr.getCell(1).font = { size: 16, bold: true }; rIdx += 2;

                if (wintData[season][area].tools) {
                    let toolsRow = ws.getRow(rIdx);
                    ws.mergeCells(`A${rIdx}:C${rIdx}`);
                    toolsRow.getCell(1).value = `Tools Needed: ${wintData[season][area].tools}`;
                    toolsRow.getCell(1).font = { italic: true };
                    rIdx += 2;
                }

                wintData[season][area].sections.forEach(sec => {
                    if (sec.category === "WARNING") { ws.mergeCells(`A${rIdx}:C${rIdx}`); ws.getRow(rIdx).getCell(1).value = `WARNING: ${sec.warningText}`; ws.getRow(rIdx).getCell(1).font = { color: { argb: 'FFFF0000' }, bold: true }; rIdx += 2; return; }
                    
                    let sr = ws.getRow(rIdx); sr.getCell(1).value = sec.category; sr.getCell(1).font = { size: 12, bold: true }; sr.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEEEEEE' } }; rIdx++;
                    
                    let cols = sec.columns || ["Action"]; let hr = ws.getRow(rIdx); hr.getCell(1).value = "Item"; hr.getCell(1).font = { bold: true }; hr.getCell(1).border = { bottom: { style: 'thin' } };
                    let cIdx = 2;
                    cols.forEach((col, i) => {
                        hr.getCell(cIdx).value = `${col} (Date)`; hr.getCell(cIdx).font = { bold: true }; hr.getCell(cIdx).border = { bottom: { style: 'thin' } }; cIdx++;
                        hr.getCell(cIdx).value = "Initials"; hr.getCell(cIdx).font = { bold: true }; hr.getCell(cIdx).border = { bottom: { style: 'thin' }, right: (i < cols.length-1 ? { style: 'thin' } : undefined) }; cIdx++;
                    }); rIdx++;

                    sec.tasks.forEach(task => {
                        let tr = ws.getRow(rIdx); let txt = task.text;
                        if (task.media && task.media.some(m => m.url.trim() !== '')) txt += " [Media attached on web tracker]";
                        tr.getCell(1).value = txt;
                        
                        let inpT = 0;
                        for(let i=2; i<cIdx; i++) {
                            tr.getCell(i).border = { bottom: { style: 'dotted' }, right: (i%2!==0 && i<cIdx-1 ? {style:'thin'} : undefined) };
                            if (task.inputs && task.inputs[inpT]) tr.getCell(i).value = task.inputs[inpT];
                            inpT++;
                        } rIdx++;
                    }); rIdx++; 
                });
            });
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        saveAs(blob, `${year}_WLSP_Checklists.xlsx`);
        NotificationSystem.show("Excel Download Complete", "success");
    });

    // Boot
    renderAreaTabs(); renderTasks();
}