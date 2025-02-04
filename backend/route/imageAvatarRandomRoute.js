
const express = require('express');
const router = express.Router();

// Lista di URL delle immagini predefinite (sostituisci con i tuoi URL)
const images = [
  

  'https://picsum.photos/200',
  // ... altri URL ...
];

// Funzione per selezionare un'immagine casuale dall'array
function getRandomImageUrl() {
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
}

// Endpoint per ottenere un'immagine casuale
router.get('/random-image', (req, res) => {
  const imageUrl = getRandomImageUrl();
  res.json({ success: true, imageUrl });
});

module.exports = router;
