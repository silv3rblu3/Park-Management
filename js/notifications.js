// js/notifications.js

const NotificationSystem = {
    containerId: 'toast-container',
    show: function(message, type = 'success') {
        const container = document.getElementById(this.containerId);
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerText = message;
        container.appendChild(toast);
        setTimeout(() => { if (container.contains(toast)) container.removeChild(toast); }, 3200); 
    }
};

const DialogSystem = {
    modal: null, title: null, message: null, input: null, btnCancel: null, btnConfirm: null, btnClose: null, resolvePromise: null,

    init: function() {
        this.modal = document.getElementById('custom-dialog-modal');
        this.title = document.getElementById('cd-title');
        this.message = document.getElementById('cd-message');
        this.input = document.getElementById('cd-input');
        this.btnCancel = document.getElementById('cd-cancel');
        this.btnConfirm = document.getElementById('cd-confirm');
        this.btnClose = document.getElementById('cd-close');

        const closeAction = () => { this.modal.close(); if(this.resolvePromise) this.resolvePromise(false); };
        this.btnCancel.onclick = closeAction;
        this.btnClose.onclick = closeAction;
        this.btnConfirm.onclick = () => {
            this.modal.close();
            if(this.resolvePromise) {
                // Check the inline display style to determine what to return
                this.resolvePromise(this.input.style.display === 'none' ? true : this.input.value);
            }
        };
    },

    confirm: function(title, msg) {
        return new Promise((resolve) => {
            if(!this.modal) this.init();
            this.title.innerText = title; this.message.innerText = msg;
            
            // Hard enforce display none
            this.input.style.display = 'none'; 
            this.input.value = '';
            
            this.btnCancel.style.display = 'block';
            this.btnConfirm.className = 'btn-danger'; this.btnConfirm.innerText = 'Confirm';
            this.resolvePromise = resolve;
            this.modal.showModal();
        });
    },

    prompt: function(title, msg, defaultVal = '') {
        return new Promise((resolve) => {
            if(!this.modal) this.init();
            this.title.innerText = title; this.message.innerText = msg;
            
            // Hard enforce display block
            this.input.style.display = 'block'; 
            this.input.value = defaultVal;
            
            this.btnCancel.style.display = 'block';
            this.btnConfirm.className = 'btn-primary'; this.btnConfirm.innerText = 'Submit';
            this.resolvePromise = resolve;
            this.modal.showModal();
            setTimeout(() => this.input.focus(), 100);
        });
    },

    alert: function(title, msg) {
        return new Promise((resolve) => {
            if(!this.modal) this.init();
            this.title.innerText = title; this.message.innerText = msg;
            
            // Hard enforce display none
            this.input.style.display = 'none'; 
            this.input.value = '';
            
            this.btnCancel.style.display = 'none';
            this.btnConfirm.className = 'btn-primary'; this.btnConfirm.innerText = 'OK';
            this.resolvePromise = resolve;
            this.modal.showModal();
        });
    }
};