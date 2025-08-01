const mongoose = require('mongoose');

const ModelSchema = new mongoose.Schema({
    name: String,
    filePath: String,
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Model3D', ModelSchema);
