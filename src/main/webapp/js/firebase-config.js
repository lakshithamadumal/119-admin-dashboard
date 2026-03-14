// assets/js/firebase-config.js

const firebaseConfig = {
    apiKey: "AIzaSyCaFn7isIDf7Wb6qbrXRp2gnQUiiHZL8yA",
    authDomain: "emergency-119-app.firebaseapp.com",
    projectId: "emergency-119-app",
    storageBucket: "emergency-119-app.firebasestorage.app",
    messagingSenderId: "266163440310",
    appId: "1:266163440310:web:06a191941e99cb625e7417",
    measurementId: "G-J14RS428BX"
};

// Initialize Firebase (Compat mode එකෙන් පාවිච්චි කරමු)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

console.log("Firebase Connected Successfully to:", firebaseConfig.projectId);