const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    location: {
        type: {
            type: String,
            enum: ['Point'], // Correctly define 'Point' as an enum value
        },
        coordinates: {
            type: [Number]
        }
    },
    address: {
        country: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        subarea: {
            type: String,
            required: true
        }
    },
    images: [String],
    rules: [String],
    properties:[String],  // ['student, non-veg, veg, ...]
});

roomSchema.index({ location: '2dsphere' }); // Create the geospatial index

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;