const express = require('express');
const router = express.Router();
const Size = require('../model/sizeModel');
const { isAuthentictedUser: isAuthenticatedUser, authorizeRoles, checkSubscriptionStatus } = require("../middleWare/auth");

router.post('/admin/size/new', isAuthenticatedUser, authorizeRoles('admin'), checkSubscriptionStatus, async (req, res) => {
  try {
    const { name } = req.body;
    const newSize = new Size({ name: name.toUpperCase() });
    await newSize.save();
    res.status(201).json({ success: true, size: newSize });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Errore nel salvare la taglia' });
  }
});

router.get('/sizes', async (req, res) => {
  try {
    const sizes = await Size.find({});
    res.json({ success: true, sizes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Errore del server' });
  }
});

router.delete('/admin/size/:id', isAuthenticatedUser, authorizeRoles('admin'), checkSubscriptionStatus, async (req, res) => {
  try {
    const { id } = req.params;
    await Size.findByIdAndDelete(id);
    res.json({ success: true, message: 'Taglia eliminata con successo' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Errore durante l\'eliminazione della taglia' });
  }
});

router.put('/admin/size/:id', isAuthenticatedUser, authorizeRoles('admin'), checkSubscriptionStatus, async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updatedSize = await Size.findByIdAndUpdate(
      id, 
      { name: name.toUpperCase() }, 
      { new: true }
    );

    if (!updatedSize) {
      return res.status(404).json({ success: false, message: 'Taglia non trovata' });
    }

    res.json({ success: true, size: updatedSize });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Errore durante l\'aggiornamento della taglia' });
  }
});

module.exports = router;
