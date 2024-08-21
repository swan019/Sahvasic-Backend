const User = require('../models/user');
const Room = require('../models/room');

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Sever Error');
    }
}

exports.updateUserProfile = async (req, res) => {
    try {
        const { name, address, role, properties, location } = req.body;

        // Parse the JSON strings into arrays
        // const parsedRules = JSON.parse(rules);
        const parsedProperties = JSON.parse(properties);

        let user = await User.findById(req.user.id);
        if (user) {
            user.name = name || user.name;
            user.role = role || user.role;
            user.location = JSON.parse(location) || location;
            user.address = address || user.address;
            user.properties = parsedProperties || user.properties;

            await user.save();
            return res.json(user);
        }

        res.status(404).json({ msg: 'User not found' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Sever Error');
    }
}

exports.getMatchingRooms = async (req, res) => {
    try {
        const maxDistance = 15000; // 15km radius
        const userLocation = req.user.location?.coordinates;
        const userProperties = req.user.properties;

        if (!userLocation) {
            const rooms = await Room.find({});
            return res.status(200).json({ Rooms: rooms }); // Return to stop further execution
        }

        const rooms = await Room.find({
            location: {
                $near: {
                    $geometry: { type: 'Point', coordinates: userLocation },
                    $maxDistance: maxDistance,
                },
            },
        });

        const matchedRooms = rooms.filter(room => {
            const matchingProperties = room.properties.filter(p => userProperties.includes(p));
            const matchPercentage = (matchingProperties.length / userProperties.length) * 100;
            console.log(matchPercentage);
            
            return matchPercentage >= 50;
        });

        res.json(matchedRooms);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


