

// Initialisation de la carte OpenStreetMap
const map = L.map('map').setView([15.4542, 18.7322], 6); // Coordonnées du Tchad

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Configuration Firebase

const firebaseConfig = {
    apiKey: "AIzaSyDKPc2kfeUB8M5nlNdIzX5ZbnmZlt1mcxg",
    authDomain: "signalemente-de-panne.firebaseapp.com",
    projectId: "signalemente-de-panne",
    storageBucket: "signalemente-de-panne.appspot.com",
    messagingSenderId: "112962020036",
    appId: "1:112962020036:web:fd7796afe72ac54ae75f91",
    measurementId: "G-CNNNT54HVL"
  };

// Initialiser Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Géolocalisation et signalement
const reportBtn = document.getElementById('reportBtn');
const statusText = document.getElementById('status');

function sendReport(lat, lon) {
    const timestamp = new Date();
    
    // Enregistrer le signalement dans Firestore
    db.collection('signalements').add({
        latitude: lat,
        longitude: lon,
        date: timestamp
    })
    .then(() => {
        statusText.textContent = 'Panne signalée avec succès et enregistrée !';
    })
    .catch((error) => {
        console.error('Erreur lors de l\'enregistrement du signalement : ', error);
        statusText.textContent = 'Erreur lors du signalement.';
    });
}

reportBtn.addEventListener('click', () => {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            L.marker([latitude, longitude]).addTo(map)
                .bindPopup('Panne signalée ici')
                .openPopup();
            map.setView([latitude, longitude], 13);
            sendReport(latitude, longitude);
        }, error => {
            statusText.textContent = 'Impossible de récupérer votre localisation. Vérifiez les paramètres de votre navigateur.';
        });
    } else {
        statusText.textContent = 'La géolocalisation n\'est pas supportée par votre navigateur.';
    }
});

// Accès hors ligne avec Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(() => {
            console.log('Service Worker enregistré avec succès.');
        }).catch(err => {
            console.log('Échec de l\'enregistrement du Service Worker :', err);
        });
    });
}
