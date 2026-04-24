// js/notifications.js

const NotificationSystem = {
    containerId: 'toast-container',

    // Example usage: NotificationSystem.show('Saved successfully!', 'success');
    show: function(message, type = 'success') {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.warn("Toast container missing from DOM.");
            return;
        }

        // Create the toast element
        const toast = document.createElement('div');
        toast.className = `toast ${type}`; // 'toast' and 'toast error'
        toast.innerText = message;

        // Append to container
        container.appendChild(toast);

        // Clean up the DOM element after the CSS animation finishes (approx 3.1 seconds)
        setTimeout(() => {
            if (container.contains(toast)) {
                container.removeChild(toast);
            }
        }, 3200); 
    }
};