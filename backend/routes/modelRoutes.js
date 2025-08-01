// routes/modelRoutes.js
const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const Model3D = require('../models/Model');

const router = express.Router();

// Cloudinary storage config
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'glb-models',
        resource_type: 'raw',
        format: async () => 'glb',
        public_id: (req, file) => `${Date.now()}-${file.originalname}`
    },
});

const upload = multer({ storage });

// Upload model
router.post('/upload', upload.single('model'), async (req, res) => {
    try {
        const newModel = new Model3D({
            name: req.body.name,
            filePath: req.file.path
        });
        await newModel.save();
        res.status(200).json({ message: 'Upload successful', model: newModel });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Upload failed', error });
    }
});

// Get all models
router.get('/models', async (req, res) => {
    try {
        const models = await Model3D.find();
        res.json(models);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch models', error });
    }
});

module.exports = router;
