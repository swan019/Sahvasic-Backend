const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    number: {
        type: String,
        unique: true
    },
    password: String,
    avatar: String,
    role: {
        type: String,
        enum: ['roommate_seeker', 'room_seeker', 'pg_owner', 'admin'],
        default: 'roommate_seeker'
    },
    isActivated: {
        type: Boolean,
        default: false
    },
    address: String,    
    properties:[String], // ['student, non-veg, veg, ...]
    location: {
        type: {
            type: String, enum:['Point'], default: 'Point'
        },
        coordinates: {
            type: [Number], index: '2dsphere'
        }
    }

});

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;