import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken } from "firebase/messaging";
import NotificationService from "./services/NotificationService";

// web app's Firebase configuration
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
getAnalytics(app);

export const messaging = getMessaging(app);

// Requests notification permission and gets the FCM token
export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.log("Notification permission denied.");
      return null;
    }

    // Get the FCM token using the VAPID key
    const token = await getToken(messaging, {
      vapidKey: "BLSL_B5gBtPVE_8wVHjXlHU2wQSmy2FP2TY4BNqPh-O3CxCDwjOguKpW2w12JfUFs-xo3PZwdExPLuAqKy0tbOA"
    });

    if (!token) {
      return null;
    }

    // Save the token to the backend
    await NotificationService.saveFirebaseToken(token);

    return token;

  } catch (error) {
    console.error("Error getting notification permission:", error);
    return null;
  }
};