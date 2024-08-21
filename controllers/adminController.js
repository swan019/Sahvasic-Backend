const User = require('../models/user');
const Room = require('../models/room');

exports.removeUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        await user.deleteOne({ _id: req.params.id });
        res.status(200).json({ msg: 'User removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.removeRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        console.log(room);
        
        if (!room) {
            return res.status(404).json({ msg: 'Room not found' });
        }

        await Room.deleteOne({ _id: req.params.id });
        res.status(200).json({ msg: 'Room removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

