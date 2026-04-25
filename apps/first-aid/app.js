// apps/first-aid/app.js

function initFirstAidLogic() {
    let faData = StateManager.getAppData('firstAid');
    
    // 1. Initialize the massive default blueprint if it's the first time loading
    if (!faData.categories || faData.categories.length === 0) {
        faData = {
            activeCategoryId: 'cat_1',
            settingsMode: false,
            categories: [
                { id: 'cat_1', name: 'Park Vehicles', count: 1, calcMethod: 'direct' },
                { id: 'cat_2', name: 'Maintenance Shop', count: 5, calcMethod: 'per5' },
                { id: 'cat_3', name: 'Admin Office', count: 5, calcMethod: 'per5' }
            ],
            items: [
                // VEHICLES
                { id: 'v1', categoryId: 'cat_1', name: 'CAT Tourniquet Gen 7', base: 1, onHand: 0 },
                { id: 'v2', categoryId: 'cat_1', name: '4 in Israeli Bandage', base: 1, onHand: 0 },
                { id: 'v3', categoryId: 'cat_1', name: '6 in Israeli Bandage', base: 1, onHand: 0 },
                { id: 'v4', categoryId: 'cat_1', name: 'QuikClot or Celox Rapid Hemostatic Gauze', base: 1, onHand: 0 },
                { id: 'v5', categoryId: 'cat_1', name: 'HyFin Vent Chest Seal Twin Pack', base: 1, onHand: 0 },
                { id: 'v6', categoryId: 'cat_1', name: 'Trauma Shears', base: 1, onHand: 0 },
                { id: 'v7', categoryId: 'cat_1', name: 'Rolled Gauze / Kerlix', base: 5, onHand: 0 },
                { id: 'v8', categoryId: 'cat_1', name: '4 in x 4 in Sterile Gauze Pads', base: 10, onHand: 0 },
                { id: 'v9', categoryId: 'cat_1', name: '2 in x 2 in Sterile Gauze Pads', base: 10, onHand: 0 },
                { id: 'v10', categoryId: 'cat_1', name: 'Medical Tape Roll', base: 1, onHand: 0 },
                { id: 'v11', categoryId: 'cat_1', name: 'Assorted Fabric Bandages', base: 30, onHand: 0 },
                { id: 'v12', categoryId: 'cat_1', name: 'Mylar Emergency Blanket', base: 2, onHand: 0 },
                { id: 'v13', categoryId: 'cat_1', name: '36 in SAM Splint', base: 1, onHand: 0 },
                { id: 'v14', categoryId: 'cat_1', name: 'ACE Wrap', base: 1, onHand: 0 },
                { id: 'v15', categoryId: 'cat_1', name: 'Nitrile Gloves (Pairs)', base: 6, onHand: 0 },
                { id: 'v16', categoryId: 'cat_1', name: 'Headlamp with extra batteries', base: 1, onHand: 0 },
                { id: 'v17', categoryId: 'cat_1', name: 'Seatbelt Cutter / Window Punch', base: 1, onHand: 0 },
                // SHOP
                { id: 's1', categoryId: 'cat_2', name: 'CAT Tourniquet Gen 7', base: 1, onHand: 0 },
                { id: 's2', categoryId: 'cat_2', name: 'Steri-Strips / Butterfly Closures', base: 10, onHand: 0 },
                { id: 's3', categoryId: 'cat_2', name: 'Super Glue / CA Glue', base: 1, onHand: 0 },
                { id: 's4', categoryId: 'cat_2', name: 'Heavy Duty Fabric Knuckle and Fingertip Bandages', base: 30, onHand: 0 },
                { id: 's5', categoryId: 'cat_2', name: 'Hemostatic Dressing', base: 1, onHand: 0 },
                { id: 's6', categoryId: 'cat_2', name: 'Assorted Ziplock Bags', base: 5, onHand: 0 },
                { id: 's7', categoryId: 'cat_2', name: 'Instant Cold Pack', base: 2, onHand: 0 },
                { id: 's8', categoryId: 'cat_2', name: '16 oz Sterile Saline Eye Wash', base: 2, onHand: 0 },
                { id: 's9', categoryId: 'cat_2', name: 'Burn Gel / Hydrogel Dressing', base: 5, onHand: 0 },
                { id: 's10', categoryId: 'cat_2', name: 'Tegaderm / Transparent Dressing', base: 5, onHand: 0 },
                { id: 's11', categoryId: 'cat_2', name: 'Fine-tipped Stainless Steel Tweezers', base: 1, onHand: 0 },
                { id: 's12', categoryId: 'cat_2', name: 'Magnifying Glass / Loupe', base: 1, onHand: 0 },
                { id: 's13', categoryId: 'cat_2', name: 'Sterile Needles', base: 5, onHand: 0 },
                // OFFICE
                { id: 'o1', categoryId: 'cat_3', name: 'Adhesive Bandages', base: 16, onHand: 0 },
                { id: 'o2', categoryId: 'cat_3', name: 'Antibiotic Ointment Packets', base: 10, onHand: 0 },
                { id: 'o3', categoryId: 'cat_3', name: 'Antiseptic Wipes / BZK Towelettes', base: 10, onHand: 0 },
                { id: 'o4', categoryId: 'cat_3', name: 'Burn Treatment Gel Packets', base: 10, onHand: 0 },
                { id: 'o5', categoryId: 'cat_3', name: '4 in x 4 in Gel Soaked Burn Dressing', base: 1, onHand: 0 },
                { id: 'o6', categoryId: 'cat_3', name: 'CPR Face Shield', base: 1, onHand: 0 },
                { id: 'o7', categoryId: 'cat_3', name: 'Instant Chemical Cold Pack', base: 1, onHand: 0 },
                { id: 'o8', categoryId: 'cat_3', name: '1 oz Sterile Eye Wash', base: 1, onHand: 0 },
                { id: 'o9', categoryId: 'cat_3', name: 'Sterile Eye Pads', base: 2, onHand: 0 },
                { id: 'o10', categoryId: 'cat_3', name: 'Hand Sanitizer Packets', base: 6, onHand: 0 },
                { id: 'o11', categoryId: 'cat_3', name: 'Nitrile Gloves (Pairs)', base: 2, onHand: 0 },
                { id: 'o12', categoryId: 'cat_3', name: '2 in Roller Bandage', base: 1, onHand: 0 },
                { id: 'o13', categoryId: 'cat_3', name: 'Scissors', base: 1, onHand: 0 },
                { id: 'o14', categoryId: 'cat_3', name: '5 in x 9 in Trauma Pads', base: 2, onHand: 0 },
                { id: 'o15', categoryId: 'cat_3', name: '3 in x 3 in Sterile Gauze Pads', base: 4, onHand: 0 },
                { id: 'o16', categoryId: 'cat_3', name: 'Medical Tape Roll', base: 1, onHand: 0 },
                { id: 'o17', categoryId: 'cat_3', name: 'Triangular Bandage', base: 1, onHand: 0 },
                { id: 'o18', categoryId: 'cat_3', name: 'Ibuprofen Blister Pack Box', base: 1, onHand: 0 },
                { id: 'o19', categoryId: 'cat_3', name: 'Acetaminophen Blister Pack Box', base: 1, onHand: 0 },
                { id: 'o20', categoryId: 'cat_3', name: 'Diphenhydramine / Benadryl Box', base: 1, onHand: 0 },
                { id: 'o21', categoryId: 'cat_3', name: 'Hydrocortisone Cream Packets', base: 10, onHand: 0 }
            ]
        };
        StateManager.setAppData('firstAid', faData);
    }

    const safeSave = () => {
        StateManager.setAppData('firstAid', faData);
    };

    // Make sure we have an active category set
    if(!faData.activeCategoryId && faData.categories.length > 0) {
        faData.activeCategoryId = faData.categories[0].id;
    }

    // 2. MATH LOGIC
    const calculateTotal = (categoryId, baseQty) => {
        const category = faData.categories.find(c => c.id === categoryId);
        if (!category || category.count <= 0) return 0;
        return category.calcMethod === 'direct' 
            ? category.count * baseQty 
            : Math.ceil(category.count / 5) * baseQty;
    };

    // 3. CORE RENDERING ENGINE
    const renderApp = () => {
        renderHeaders();
        renderTabs();
        renderActiveCategory();

        const btn = document.getElementById('fa-toggle-settings-btn');
        if (faData.settingsMode) {
            btn.classList.add('btn-primary');
            btn.classList.remove('btn-outline');
            btn.innerText = "💾 Save Configuration";
        } else {
            btn.classList.add('btn-outline');
            btn.classList.remove('btn-primary');
            btn.innerText = "⚙️ Edit Configuration";
        }
    };

    const renderHeaders = () => {
        const container = document.getElementById('fa-header-panel');
        container.innerHTML = ''; 
        faData.categories.forEach(cat => {
            const div = document.createElement('div');
            div.style.flex = "1";
            div.style.minWidth = "150px";
            let labelText = cat.calcMethod === 'direct' ? `Total ${cat.name} (Units)` : `Total People in ${cat.name}`;
            div.innerHTML = `
                <label style="display:block; font-size: 14px; font-weight: bold; color: var(--text-secondary); margin-bottom: 5px;">${labelText}</label>
                <input type="number" min="0" value="${cat.count}" class="app-input persistent-header-input" data-id="${cat.id}" style="margin: 0;">
            `;
            container.appendChild(div);
        });

        // Bind events to the newly generated inputs
        document.querySelectorAll('.persistent-header-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const id = e.target.getAttribute('data-id');
                const cat = faData.categories.find(c => c.id === id);
                if (cat) cat.count = parseInt(e.target.value) || 0;
                safeSave();
                renderApp();
            });
        });
    };

    const renderTabs = () => {
        const container = document.getElementById('fa-tabs-container');
        container.innerHTML = ''; 
        faData.categories.forEach(cat => {
            const btn = document.createElement('button');
            const isActive = cat.id === faData.activeCategoryId;
            btn.className = `tab-btn ${isActive ? 'active' : ''}`;
            btn.style.padding = "10px 20px";
            btn.style.border = "1px solid var(--border-color)";
            btn.style.borderBottom = isActive ? "2px solid var(--bg-surface)" : "none";
            btn.style.borderRadius = "8px 8px 0 0";
            btn.style.backgroundColor = isActive ? "var(--bg-surface)" : "rgba(0,0,0,0.05)";
            btn.style.fontWeight = "bold";
            btn.style.color = isActive ? "var(--accent-primary)" : "var(--text-secondary)";
            btn.innerText = cat.name;
            
            btn.onclick = () => { 
                faData.activeCategoryId = cat.id; 
                safeSave(); 
                renderApp(); 
            };
            container.appendChild(btn);
        });

        if (faData.settingsMode) {
            const addBtn = document.createElement('button');
            addBtn.style.padding = "10px 20px";
            addBtn.style.border = "1px dashed var(--accent-primary)";
            addBtn.style.borderRadius = "8px 8px 0 0";
            addBtn.style.backgroundColor = "transparent";
            addBtn.style.color = "var(--accent-primary)";
            addBtn.innerText = '+ New Category';
            
            // USING ASYNC CUSTOM DIALOG
            addBtn.onclick = async () => {
                const newName = await DialogSystem.prompt("New Category", "Enter a name for the new first aid category:");
                if(newName && newName !== true) {
                    const newId = 'cat_' + Date.now();
                    faData.categories.push({ id: newId, name: newName, count: 1, calcMethod: 'direct' });
                    faData.activeCategoryId = newId; 
                    safeSave();
                    renderApp();
                }
            };
            container.appendChild(addBtn);
        }
    };

    const renderActiveCategory = () => {
        const container = document.getElementById('fa-active-content');
        const category = faData.categories.find(c => c.id === faData.activeCategoryId);
        
        if (!category) { container.innerHTML = '<p style="padding: 20px;">No category selected.</p>'; return; }

        const categoryItems = faData.items.filter(i => i.categoryId === category.id);
        let html = '<div style="padding: 20px;">';

        if (faData.settingsMode) {
            html += `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 2px solid var(--accent-primary); padding-bottom: 15px;">
                    <input type="text" value="${category.name}" id="edit-cat-name" class="app-input" style="font-size: 1.2rem; font-weight: bold; width: 50%; margin: 0; border-color: var(--accent-primary);">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <label style="font-weight: bold;">Scale By:</label>
                        <select id="edit-cat-calc" class="app-select" style="margin: 0;">
                            <option value="direct" ${category.calcMethod === 'direct' ? 'selected' : ''}>1:1 Ratio (Per Unit)</option>
                            <option value="per5" ${category.calcMethod === 'per5' ? 'selected' : ''}>Per 5 People</option>
                        </select>
                        <button id="delete-cat-btn" class="btn-danger">🗑️ Delete</button>
                    </div>
                </div>
            `;
        } else {
            html += `<h3 style="margin-top:0; margin-bottom: 20px; font-size: 1.5rem; color: var(--accent-primary); border-bottom: 2px solid var(--accent-primary); padding-bottom: 10px;">${category.name}</h3>`;
        }

        // Table Layout
        html += `
            <div style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 0.5fr; gap: 10px; font-weight: bold; color: var(--text-secondary); border-bottom: 2px solid var(--border-color); padding-bottom: 10px; margin-bottom: 10px; text-align: center;">
                <div style="text-align: left;">Supply Name</div>
                <div>${faData.settingsMode ? 'Base Qty' : 'Total Needed'}</div>
                <div>${faData.settingsMode ? '' : 'On Hand'}</div>
                <div>${faData.settingsMode ? '' : 'To Order'}</div>
                <div>${faData.settingsMode ? 'Del' : ''}</div>
            </div>
            <div id="fa-item-list"></div>
        </div>`;
        container.innerHTML = html;
        
        // Event listeners for category edit mode
        if (faData.settingsMode) {
            document.getElementById('edit-cat-name').addEventListener('change', (e) => {
                category.name = e.target.value.trim() || 'Unnamed';
                safeSave(); renderApp();
            });
            document.getElementById('edit-cat-calc').addEventListener('change', (e) => {
                category.calcMethod = e.target.value;
                safeSave(); renderApp();
            });
            
            // USING ASYNC CUSTOM DIALOG
            document.getElementById('delete-cat-btn').addEventListener('click', async () => {
                if (await DialogSystem.confirm("Delete Category", "Are you sure you want to permanently delete this entire category and all its items?")) {
                    faData.categories = faData.categories.filter(c => c.id !== category.id);
                    faData.items = faData.items.filter(i => i.categoryId !== category.id);
                    faData.activeCategoryId = faData.categories.length > 0 ? faData.categories[0].id : null;
                    safeSave(); renderApp();
                }
            });
        }

        const listContainer = document.getElementById('fa-item-list');
        categoryItems.forEach(item => {
            const totalNeeded = calculateTotal(category.id, item.base);
            const toOrder = Math.max(0, totalNeeded - (item.onHand || 0));
            
            const row = document.createElement('div');
            row.style.display = "grid";
            row.style.gridTemplateColumns = "2fr 1fr 1fr 1fr 0.5fr";
            row.style.gap = "10px";
            row.style.alignItems = "center";
            row.style.padding = "10px 0";
            row.style.borderBottom = "1px solid var(--border-color)";
            row.style.textAlign = "center";
            
            if (faData.settingsMode) {
                row.innerHTML = `
                    <div style="text-align: left; font-weight: 500;">${item.name}</div>
                    <div><input type="number" class="app-input fa-base-input" data-id="${item.id}" value="${item.base}" min="1" style="margin: 0; text-align: center;"></div>
                    <div></div><div></div>
                    <div><button class="btn-danger fa-delete-item-btn" data-id="${item.id}" style="padding: 5px;">X</button></div>
                `;
            } else {
                row.innerHTML = `
                    <div style="text-align: left; font-weight: 500;">${item.name}</div>
                    <div style="font-size: 1.1rem; font-weight: bold;">${totalNeeded}</div>
                    <div><input type="number" class="app-input fa-onhand-input" data-id="${item.id}" value="${item.onHand || 0}" min="0" style="margin: 0; text-align: center;"></div>
                    <div style="font-size: 1.1rem; font-weight: bold; color: ${toOrder > 0 ? 'var(--danger-color)' : 'var(--accent-primary)'};">${toOrder}</div>
                    <div></div>
                `;
            }
            listContainer.appendChild(row);
        });

        // Add Item Form (Only in settings mode)
        if (faData.settingsMode) {
            const addForm = document.createElement('div');
            addForm.style.display = "flex";
            addForm.style.gap = "10px";
            addForm.style.marginTop = "20px";
            addForm.style.paddingTop = "20px";
            addForm.innerHTML = `
                <input type="text" id="fa-new-item-name" class="app-input" placeholder="Enter new supply name..." style="flex: 1; margin: 0;">
                <input type="number" id="fa-new-item-base" class="app-input" placeholder="Base Qty" min="1" value="1" style="width: 100px; margin: 0; text-align: center;">
                <button id="fa-add-item-btn" class="btn-primary">Add Item</button>
            `;
            listContainer.appendChild(addForm);

            document.getElementById('fa-add-item-btn').addEventListener('click', () => {
                const nameVal = document.getElementById('fa-new-item-name').value.trim();
                const baseVal = parseInt(document.getElementById('fa-new-item-base').value) || 1;
                if (nameVal === '') return;
                
                faData.items.push({ 
                    id: 'item_' + Date.now(), 
                    categoryId: faData.activeCategoryId, 
                    name: nameVal, 
                    base: baseVal, 
                    onHand: 0 
                });
                safeSave(); renderActiveCategory();
            });

            // Bind inline item inputs (Settings Mode)
            document.querySelectorAll('.fa-base-input').forEach(input => {
                input.addEventListener('change', (e) => {
                    const item = faData.items.find(i => i.id === e.target.getAttribute('data-id'));
                    if (item) item.base = parseInt(e.target.value) || 1;
                    safeSave(); renderActiveCategory();
                });
            });
            
            // USING ASYNC CUSTOM DIALOG
            document.querySelectorAll('.fa-delete-item-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    if (await DialogSystem.confirm("Remove Supply", "Remove this supply item from the category?")) {
                        faData.items = faData.items.filter(i => i.id !== e.target.getAttribute('data-id'));
                        safeSave(); renderActiveCategory();
                    }
                });
            });
        } else {
            // Bind inline item inputs (Normal Mode)
            document.querySelectorAll('.fa-onhand-input').forEach(input => {
                input.addEventListener('change', (e) => {
                    const item = faData.items.find(i => i.id === e.target.getAttribute('data-id'));
                    if (item) item.onHand = parseInt(e.target.value) || 0;
                    safeSave(); renderActiveCategory();
                });
            });
        }
    };

    // 4. MAIN ACTION LISTENERS
    document.getElementById('fa-toggle-settings-btn').addEventListener('click', () => {
        faData.settingsMode = !faData.settingsMode;
        safeSave();
        renderApp();
    });

    // 5. PRINT LOGIC
    const printModal = document.getElementById('fa-print-modal');
    
    document.getElementById('fa-print-btn').addEventListener('click', () => {
        const list = document.getElementById('fa-print-category-list');
        list.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px; font-size: 16px;">
                <input type="checkbox" id="fa_print_all" checked>
                <label for="fa_print_all"><b>Select All Categories</b></label>
            </div>
            <hr style="border:0; border-top:1px solid var(--border-color); margin:10px 0;">
        `;
        
        faData.categories.forEach(cat => {
            list.innerHTML += `
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px; font-size: 16px;">
                    <input type="checkbox" class="fa-print-cat-checkbox" value="${cat.id}" checked>
                    <label>${cat.name}</label>
                </div>
            `;
        });

        // Handle Select All logic
        document.getElementById('fa_print_all').addEventListener('change', (e) => {
            document.querySelectorAll('.fa-print-cat-checkbox').forEach(cb => cb.checked = e.target.checked);
        });

        printModal.showModal();
    });

    document.getElementById('close-fa-print-modal').addEventListener('click', () => printModal.close());

    document.getElementById('fa-execute-print-btn').addEventListener('click', () => {
        const selectedIds = Array.from(document.querySelectorAll('.fa-print-cat-checkbox:checked')).map(cb => cb.value);
        if (selectedIds.length === 0) { 
            NotificationSystem.show("Select at least one category to print.", "error"); 
            return; 
        }

        const printArea = document.getElementById('fa-print-area');
        let printHtml = '<h2>Reorder Checklist</h2>';
        let grandTotalItems = 0;

        selectedIds.forEach(catId => {
            const cat = faData.categories.find(c => c.id === catId);
            const itemsToOrder = faData.items.filter(i => i.categoryId === catId).map(item => {
                const toOrder = Math.max(0, calculateTotal(cat.id, item.base) - (item.onHand || 0));
                return { name: item.name, toOrder: toOrder };
            }).filter(item => item.toOrder > 0);

            if (itemsToOrder.length > 0) {
                printHtml += `<h3>${cat.name}</h3><table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <thead><tr><th style="border: 1px solid #000; padding: 8px; text-align: left; background-color: #eee;">Supply Name</th><th style="width: 100px; text-align: center; border: 1px solid #000; padding: 8px; background-color: #eee;">Qty to Order</th></tr></thead><tbody>`;
                itemsToOrder.forEach(item => { 
                    printHtml += `<tr><td style="border: 1px solid #000; padding: 8px;">${item.name}</td><td style="text-align: center; font-weight: bold; border: 1px solid #000; padding: 8px;">${item.toOrder}</td></tr>`; 
                    grandTotalItems += item.toOrder; 
                });
                printHtml += `</tbody></table>`;
            }
        });

        if (grandTotalItems === 0) { 
            NotificationSystem.show("Nothing to order! Fully stocked.", "success"); 
            return; 
        }
        
        printArea.innerHTML = printHtml;
        printModal.close();
        
        // Let the DOM update then fire the native print dialog
        setTimeout(() => window.print(), 100);
    });

    // Fire the initial render
    renderApp();
}