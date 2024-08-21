const Room = require('../models/room');

exports.addRoom = async (req, res) => {
    try {
        const { location, rules, properties, country, state, city, subarea } = req.body;

        // Parse the JSON strings into arrays
        const parsedRules = JSON.parse(rules);
        const parsedProperties = JSON.parse(properties);

        const images = req.files.map(file => file.path);
        console.log(req.file);
        

        const room = new Room({
            owner: req.user.id,
            location: JSON.parse(location),  // Parse location string to JSON
            rules: parsedRules,  // Store as an array of strings
            properties: parsedProperties,  // Store as an array of strings
            images: images,
            address: {
                country: country,
                state: state,
                city: city,
                subarea: subarea
            }
        });

        await room.save();
        res.status(200).json(room);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

exports.getRooms = async (req, res) => {
    try {
        const rooms = await Room.find({ owner: req.user.id });
        res.status(200).json(rooms);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
}