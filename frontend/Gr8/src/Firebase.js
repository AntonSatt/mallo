// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDH-IzGfcHRxjxtOztTJ7OOBqJXeXes5WE",
  authDomain: "mallo-c1351.firebaseapp.com",
  projectId: "mallo-c1351",
  storageBucket: "mallo-c1351.firebasestorage.app",
  messagingSenderId: "588406229037",
  appId: "1:588406229037:web:39006b077cce339d3d10a4",
  measurementId: "G-7QKVCGGL4Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const messaging = getMessaging(app);

// Function to request permission and get the FCM Device Token
export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      // Get the token using your VAPID key from the Cloud Messaging tab
      const token = await getToken(messaging, { 
        vapidKey: "YOUR_PUBLIC_VAPID_KEY" 
      });
      return token;
    } else {
      console.log("Notification permission denied.");
      return null;
    }
  } catch (error) {
    console.error("Error getting notification permission:", error);
  }
};