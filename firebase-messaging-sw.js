// Service worker de Firebase Cloud Messaging: permite que lleguen notificaciones push aunque
// la app esté cerrada o en segundo plano. Con un payload "notification" (como el que envía la
// Cloud Function notifyOnChangeRequest), el propio SDK de FCM muestra la notificación sin
// necesidad de más código aquí.
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBcBeAtCscf87l4TYDtX6Ea_5cHZFGlybI",
  authDomain: "teletrabajo-626b6.firebaseapp.com",
  projectId: "teletrabajo-626b6",
  storageBucket: "teletrabajo-626b6.firebasestorage.app",
  messagingSenderId: "195039880021",
  appId: "1:195039880021:web:59c628c3519b98969e45dc"
});

firebase.messaging();
