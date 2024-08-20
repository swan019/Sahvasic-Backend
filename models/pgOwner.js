const mongoose = require('mongoose');

const pgOwnerSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }],
    rules: [String],
    properties: [String] // e.g., ['no alcohol', 'no pets']
});

const PgOwner = mongoose.model('PgOwner', pgOwnerSchema);
module.exports = PgOwner;

