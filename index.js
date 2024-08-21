const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');

//Load Routes 
const authRoutes = require('./routes/authRoutes');
const userRouters = require('./routes/userRoutes');
const roomsRouters = require('./routes/roomRoutes');
const adminRouters = require('./routes/adminRoutes');

//Load Env Variables
dotenv.config();

const app = express();

//Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json({limit: "100kb"}));
app.use(express.urlencoded({extended:true, limit: "16kb"}));

//Database connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error : ', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRouters);
app.use('/api/rooms', roomsRouters);
app.use('/api/admin', adminRouters);

//Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('SomeThing Broke!');
})

//Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

