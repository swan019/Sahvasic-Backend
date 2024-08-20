const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    location: {
        type: {
            type: String, enum:['Points'], default: 'Point'
        },
        coordinates: {
            type: [Number], index: '2dsphere'
        }
    },
    images: [String],
    rules: [String],
    properties:[String],  // ['student, non-veg, veg, ...]
});

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;