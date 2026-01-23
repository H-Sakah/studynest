const express = require('express');
const axios = require('axios');
const cors = require('cors');
const cookieParser = require('cookie-parser'); 
const { log } = require('console');
const { db } = require('./firebase');
const admin = require('firebase-admin');
const app = express();
const PORT = 4000;


const api_url = 'https://opengraph.io/api/1.1/site/';
const api_key = 'b935a072-21f7-4594-8f6f-bd5a7d80a858';

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials:true,
    methods: ['GET', 'POST'], 
  })
);
app.use(express.json());
app.use(cookieParser()); 
app.get('/api/getUser', async (req, res) => {
  const token = req.cookies.session_id;

  if (!token) {
    return res.status(401).json({ error: 'Kein Token bereitgestellt' });
  }

  try {
    // Token verifizieren
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;

    // Benutzerinformationen abrufen
    const userDoc = await db.collection('users').doc(uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'Benutzer nicht gefunden' });
    }

    res.status(200).json({ user: userDoc.data() });
  } catch (error) {
    console.error('Fehler beim Abrufen der Benutzerdaten:', error.message);
    res.status(500).json({ error: 'Fehler beim Abrufen der Daten' });
  }
});
app.post('/api/session-login', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Token ist erforderlich' });
  }

  try {
    // Token verifizieren
    const decodedToken = await admin.auth().verifyIdToken(token);

    // Session-Cookie setzen
    res.cookie('session_id', token, {
      httpOnly: true,
      secure: false, 
      sameSite: 'Lax', 
      maxAge: 24 * 60 * 60 * 1000, // 24 Stunden den Cookie gültig
    });

    res.status(200).json({ message: 'Session erfolgreich gestartet' });
  } catch (error) {
    console.error('Fehler beim Erstellen der Session:', error.message);
    res.status(401).json({ error: 'Ungültiges Token' });
  }
});
app.post('/api/logout', (req, res) => {
  res.clearCookie('session_id');
  res.status(200).json({ message: 'Logout erfolgreich' });
});

app.post('/api/saveUser', async (req, res) => {
  const { firstName, lastName, email } = req.body;
  const token = req.headers.authorization?.split(' ')[1]; // Token aus dem Header extrahieren

  if (!firstName || !lastName || !email) {
    return res.status(400).json({ error: 'Alle Felder sind erforderlich' });
  }

  if (!token) {
    return res.status(401).json({ error: 'Kein Token bereitgestellt' });
  }

  try {
    // Token verifizieren
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid; // Benutzer-ID aus dem Token

    // Benutzerdaten in Firestore speichern
    const docRef = await db.collection('users').doc(uid).set({
      firstName,
      lastName,
      email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log('Benutzer gespeichert mit UID:', uid);

    res.status(200).json({ message: 'Benutzer erfolgreich gespeichert' });
  } catch (error) {
    console.error(
      'Fehler beim Verifizieren des Tokens oder Speichern der Daten:',
      error.message
    );
    res.status(500).json({ error: 'Fehler beim Speichern der Benutzerdaten' });
  }
});

app.post('/check_url', async (req, res) => {
  const { url } = req.body; 
  if (!url) {
    return res.status(400).json({ error: 'URL fehlt' });
  }

  try {
    console.log('Checking URL:', url);
    const response = await axios.get(url);

    console.log(response.status);
    if (response.status >= 200 && response.status < 400) {
      return res.status(200).json({ valid: true });
    } else {
      return res.status(400).json({ valid: false });
    }
  } catch (error) {
    console.error('Fehler beim Überprüfen der URL:', error.message);
    return res.status(400).json({ valid: false });
  }

});
// Route zum Extrahieren von Bildern (mit OpenGraph)
app.post('/api/extract-images', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  const transformedUrl = transformURLToDocId(url); // URL transformieren
  const linksCollection = db.collection('links');

  try {
    // Prüfen, ob das Bild bereits in der DB existiert
    const linkDoc = await linksCollection.doc(transformedUrl).get();

    if (linkDoc.exists) {
      // Bild existiert bereits, zurückgeben
      return res.status(200).json({ image: linkDoc.data().src });
    }

    // Bild von OpenGraph-API abrufen
    const url_encoded = encodeURIComponent(url);
    const response = await axios.get(
      `${api_url}${url_encoded}?accept_lang=auto&app_id=${api_key}`
    );
    const data = response.data;
    const ogImage = data?.hybridGraph?.image || null;

    if (ogImage) {
      // Bild in Firebase speichern
      await linksCollection.doc(transformedUrl).set({ src: ogImage });
      return res.status(200).json({ image: ogImage });
    } else {
      return res.status(404).json({ error: 'No OpenGraph image found' });
    }
  } catch (error) {
    console.error('Error fetching OpenGraph data:', error.message);
    res.status(500).json({ error: 'Failed to fetch OpenGraph data' });
  }
});

// Hile-Funktion
const transformURLToDocId = (url) =>
  url.replace(/\/|\?|\./g, '_'); 


app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});