// routes/tripRoutes.js
const express = require('express');
const router = express.Router();
const Trip = require('../model/trip');
const upload = require('../config/uploads');

// POST /trips - Create a new trip with image and PDF upload
router.post('/', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]), async (req, res) => {
    try {
        const { name, description } = req.body;
        
        // Ensure both image and PDF files are uploaded
        if (!req.files || !req.files.image || !req.files.pdf) {
            return res.status(400).json({ message: 'Image and PDF are required' });
        }

        const trip = new Trip({
            name,
            description,
            image: req.files.image[0].filename,
            pdf: req.files.pdf[0].filename,
        });

        await trip.save();
        res.status(201).json(trip);
    } catch (err) {
        res.status(500).json({ message: 'Error creating trip', error: err.message });
    }
});

module.exports = router;
