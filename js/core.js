// js/core.js

document.addEventListener('DOMContentLoaded', () => { CoreSystem.init(); });

const CoreSystem = {
    init: function() {
        this.bindGlobalEvents();
        this.applySavedTheme();
        this.routeToApp('home');
    },

    bindGlobalEvents: function() {
        const bentoTrigger = document.getElementById('bento-trigger');
        const bentoMenu = document.getElementById('bento-menu');
        
        bentoTrigger.addEventListener('click', (e) => { e.stopPropagation(); bentoMenu.classList.toggle('hidden'); });
        document.addEventListener('click', (e) => {
            if (!bentoMenu.classList.contains('hidden') && !bentoTrigger.contains(e.target) && !bentoMenu.contains(e.target)) bentoMenu.classList.add('hidden');
        });

        document.querySelectorAll('.bento-item').forEach(item => {
            item.addEventListener('click', () => {
                this.routeToApp(item.getAttribute('data-app'));
                bentoMenu.classList.add('hidden');
            });
        });

        // Settings Modal & Theme Editor
        const settingsModal = document.getElementById('settings-modal');
        document.getElementById('global-settings-trigger').addEventListener('click', () => { this.populateThemeEditor(); settingsModal.showModal(); });
        document.getElementById('close-settings-btn').addEventListener('click', () => settingsModal.close());

        document.getElementById('global-theme-select').addEventListener('change', (e) => this.loadThemeIntoEditor(e.target.value));
        
        document.getElementById('new-theme-btn').addEventListener('click', () => {
            document.getElementById('theme-edit-id').value = 'theme_' + Date.now();
            document.getElementById('theme-edit-name').value = '';
            // Reset to defaults
            ['bg', 'surface', 'text-main', 'text-muted', 'accent', 'accent-hover', 'border', 'danger'].forEach(id => document.getElementById(`theme-edit-${id}`).value = '#000000');
        });

        document.getElementById('save-theme-btn').addEventListener('click', () => {
            const name = document.getElementById('theme-edit-name').value.trim();
            if(!name) return NotificationSystem.show("Theme requires a name", "error");
            
            const newTheme = {
                id: document.getElementById('theme-edit-id').value || 'theme_' + Date.now(),
                name: name,
                colors: {
                    bgBase: document.getElementById('theme-edit-bg').value,
                    bgSurface: document.getElementById('theme-edit-surface').value,
                    textPrimary: document.getElementById('theme-edit-text-main').value,
                    textSecondary: document.getElementById('theme-edit-text-muted').value,
                    accentPrimary: document.getElementById('theme-edit-accent').value,
                    accentHover: document.getElementById('theme-edit-accent-hover').value,
                    border: document.getElementById('theme-edit-border').value,
                    danger: document.getElementById('theme-edit-danger').value
                }
            };

            let state = StateManager.loadGlobalState();
            const idx = state.themes.findIndex(t => t.id === newTheme.id);
            if (idx > -1) state.themes[idx] = newTheme;
            else state.themes.push(newTheme);
            
            StateManager.saveGlobalState(state);
            this.populateThemeEditor(newTheme.id);
            NotificationSystem.show("Theme Saved", "success");
        });

        document.getElementById('apply-theme-btn').addEventListener('click', () => {
            const id = document.getElementById('global-theme-select').value;
            let state = StateManager.loadGlobalState();
            state.activeThemeId = id;
            StateManager.saveGlobalState(state);
            this.applySavedTheme();
            NotificationSystem.show("Theme Applied", "success");
        });

        document.getElementById('delete-theme-btn').addEventListener('click', () => {
            const id = document.getElementById('theme-edit-id').value;
            let state = StateManager.loadGlobalState();
            if (state.themes.length <= 1) return NotificationSystem.show("Cannot delete last theme", "error");
            if (state.activeThemeId === id) return NotificationSystem.show("Cannot delete active theme. Switch first.", "error");
            
            state.themes = state.themes.filter(t => t.id !== id);
            StateManager.saveGlobalState(state);
            this.populateThemeEditor(state.themes[0].id);
            NotificationSystem.show("Theme Deleted", "success");
        });

        // Global Data Export/Import
        document.getElementById('global-export-btn').addEventListener('click', () => StateManager.exportGlobalData());
        const importInput = document.getElementById('global-import-file');
        document.getElementById('global-import-btn').addEventListener('click', () => importInput.click());
        importInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                if(confirm("WARNING: Wiping ALL data. Continue?")) StateManager.importGlobalData(e.target.files[0]);
                e.target.value = '';
            }
        });
    },

    populateThemeEditor: function(selectId = null) {
        const state = StateManager.loadGlobalState();
        const select = document.getElementById('global-theme-select');
        select.innerHTML = '';
        state.themes.forEach(t => { select.innerHTML += `<option value="${t.id}">${t.name}</option>`; });
        
        const idToLoad = selectId || state.activeThemeId;
        select.value = idToLoad;
        this.loadThemeIntoEditor(idToLoad);
    },

    loadThemeIntoEditor: function(themeId) {
        const theme = StateManager.loadGlobalState().themes.find(t => t.id === themeId);
        if(!theme) return;
        document.getElementById('theme-edit-id').value = theme.id;
        document.getElementById('theme-edit-name').value = theme.name;
        document.getElementById('theme-edit-bg').value = theme.colors.bgBase;
        document.getElementById('theme-edit-surface').value = theme.colors.bgSurface;
        document.getElementById('theme-edit-text-main').value = theme.colors.textPrimary;
        document.getElementById('theme-edit-text-muted').value = theme.colors.textSecondary;
        document.getElementById('theme-edit-accent').value = theme.colors.accentPrimary;
        document.getElementById('theme-edit-accent-hover').value = theme.colors.accentHover;
        document.getElementById('theme-edit-border').value = theme.colors.border;
        document.getElementById('theme-edit-danger').value = theme.colors.danger;
    },

    applySavedTheme: function() {
        const state = StateManager.loadGlobalState();
        const theme = state.themes.find(t => t.id === state.activeThemeId) || state.themes[0];
        const root = document.documentElement;
        
        root.style.setProperty('--bg-base', theme.colors.bgBase);
        root.style.setProperty('--bg-surface', theme.colors.bgSurface);
        root.style.setProperty('--text-primary', theme.colors.textPrimary);
        root.style.setProperty('--text-secondary', theme.colors.textSecondary);
        root.style.setProperty('--accent-primary', theme.colors.accentPrimary);
        root.style.setProperty('--accent-hover', theme.colors.accentHover);
        root.style.setProperty('--border-color', theme.colors.border);
        root.style.setProperty('--danger-color', theme.colors.danger);
    },

    routeToApp: function(appName) {
        const container = document.getElementById('app-container');
        const titleLabel = document.getElementById('app-title');
        container.innerHTML = '';

        switch(appName) {
            case 'home': titleLabel.innerText = "Home Dashboard"; container.innerHTML = `<div class="home-wrapper" style="padding: 2rem; text-align: center;"><h1>Welcome to the Hub</h1><p style="color: var(--text-secondary); margin-top: 10px;">Select an app from the grid menu to begin.</p></div>`; break;
            case 'fleet': titleLabel.innerText = "Fleet Management"; if (typeof renderFleetApp === 'function') { container.innerHTML = renderFleetApp(); if (typeof initFleetLogic === 'function') initFleetLogic(); } else { container.innerHTML = `<p>Error: Fleet modules not loaded.</p>`; } break;
            // Add Inventory, Winterization, First Aid back here
        }
    }
};