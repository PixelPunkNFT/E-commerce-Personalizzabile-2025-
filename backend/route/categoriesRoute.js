const express = require('express');
const router = express.Router();
const Category = require('../model/categoriesModel'); // Assumi che tu abbia un modello Mongoose

router.post('/categories/add', async (req, res) => {
  try {
    const { name } = req.body;
    const newCategory = new Category({ name });
    await newCategory.save();
    res.status(201).json({ message: 'Categoria aggiunta' });
  } catch (error) {
    res.status(500).json({ message: 'Errore nel salvare la categoria' });
  }
});

router.get('/categories', async (req, res) => {
    try {
      const categories = await Category.find({});
      res.json(categories);
    } catch (error) {
      res.status(500).send('Errore del server');
    }
  });





  router.delete('/categories/:id', async (req, res) => {
    try {
      const { id } = req.params;  // Usa 'id', non 'categoryId'
      await Category.findByIdAndDelete(id);
      res.json({ message: 'Categoria cancellata con successo' });
    } catch (error) {
      res.status(500).json({ message: 'Errore durante la cancellazione della categoria' });
    }
  });
  


router.put('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body; // Assumi che il nuovo nome sia nel corpo della richiesta
    const updatedCategory = await Category.findByIdAndUpdate(id, { name }, { new: true });

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Categoria non trovata' });
    }

    res.json({ message: 'Categoria aggiornata con successo', category: updatedCategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Errore durante l\'aggiornamento della categoria' });
  }
});


  

module.exports = router;
