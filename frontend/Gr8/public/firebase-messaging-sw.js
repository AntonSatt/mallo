// Scripts required for the service worker
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyDH-IzGfcHRxjxtOztTJ7OOBqJXeXes5WE",
    authDomain: "mallo-c1351.firebaseapp.com",
    projectId: "mallo-c1351",
    storageBucket: "mallo-c1351.firebasestorage.app",
    messagingSenderId: "588406229037",
    appId: "1:588406229037:web:39006b077cce339d3d10a4",
});

const messaging = firebase.messaging();

// Handles notifications when the app is in the background/closed
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/vite.svg' // Path to your app icon
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});