'use strict';

console.log('Started', self);
var lastReport;

self.addEventListener('install', function (event) {
    self.skipWaiting();
    console.log('Installed', event);
});

self.addEventListener('activate', function (event) {
    console.log('Activated', event);
});

self.addEventListener('push', function (event) {
    console.log('Push message', event);


    event.waitUntil(
        fetch('https://alertsystem-9f7a1.firebaseio.com/reports/.json?orderBy=%22$key%22&limitToLast=1')
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                lastReport = data[Object.keys(data)[0]];
                return self.registration.showNotification('Here and Now', {
                    'body': lastReport.description,
                    'icon': 'images/icon.png'
                })
            })
    );

});

self.addEventListener('notificationclick', function (event) {
    console.log('Notification click: tag', event.notification.tag);
    // Android doesn't close the notification when you click it
    // See http://crbug.com/463146
    event.notification.close();
    var url = 'https://alertsystem-9f7a1.firebaseapp.com';
    // Check if there's already a tab open with this URL.
    // If yes: focus on the tab.
    // If no: open a tab with the URL.
    event.waitUntil(
        clients.matchAll({
            type: 'window'
        })
            .then(function (windowClients) {
                console.log('WindowClients', windowClients);
                for (var i = 0; i < windowClients.length; i++) {
                    var client = windowClients[i];
                    console.log('WindowClient', client);
                    if (client.url.indexOf(url) !== -1 && 'focus' in client) {
                        return client.focus();
                    }
                }
                if (clients.openWindow) {
                    return clients.openWindow(url);
                }
            })
    );
});