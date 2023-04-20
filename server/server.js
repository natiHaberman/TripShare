require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const HttpError = require('./models/http-error');

const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const credentials = require('./middleware/credentials');
const verifyJWT = require('./middleware/verifyJWT');

const PORT = 5000;
connectDB();

app.use(logger);
app.use(credentials);

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use(cookieParser());

app.use('/user/register', require('./routes/userRoutes/register'));
app.use('/user/auth', require('./routes/userRoutes/auth'));
app.use('/user/refresh', require('./routes/userRoutes/refresh'));
app.use('/user/logout', require('./routes/userRoutes/logout'));

//need to move after verification
app.use('/rides/new', require('./routes/rideRoutes/addRide'));
app.use('/rides/all', require('./routes/rideRoutes/getRides'));
app.use('/rides/join', require('./routes/rideRoutes/joinRide'));
app.use('/rides/delete', require('./routes/rideRoutes/deleteRide'));
app.use('/rides/complete', require('./routes/rideRoutes/completeRide'));

app.use('/requests/new', require('./routes/requestRoutes/sendRequest'));
app.use('/requests/index', require('./routes/requestRoutes/getRequests'));
app.use('/requests/delete', require('./routes/requestRoutes/deleteRequest'));

app.use(verifyJWT);

app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404);
    throw error;
  });

app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
