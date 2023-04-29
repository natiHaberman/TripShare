require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const connectDB = require('./config/dbConn');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const HttpError = require('./models/http-error');
const PORT = process.env.PORT || 5000;

connectDB();
app.use(logger);

const allowedOrigins = [
  'http://localhost:3000',
  'https://joyride-72ed1.web.app',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use('/user/register', require('./routes/userRoutes/register'));
app.use('/user/auth', require('./routes/userRoutes/auth'));
app.use('/user/refresh', require('./routes/userRoutes/refresh'));
app.use('/user/logout', require('./routes/userRoutes/logout'));


// Verify JWT for all routes below
app.use(verifyJWT);
app.use('/user/update', require('./routes/userRoutes/update'));
app.use('/user/find', require('./routes/userRoutes/findUser'));
app.use('/rides/new', require('./routes/rideRoutes/newRide'));
app.use('/rides/all', require('./routes/rideRoutes/getRides'));
app.use('/rides/cancel', require('./routes/rideRoutes/cancelRide'));
app.use('/rides/complete', require('./routes/rideRoutes/completeRide'));
app.use('/requests/index', require('./routes/requestRoutes/getRequests'));
app.use('/requests/new', require('./routes/requestRoutes/sendRequest'));
app.use('/requests/cancel', require('./routes/requestRoutes/cancelRequest'));
app.use('/requests/accept', require('./routes/requestRoutes/acceptRequest'));
app.use('/reviews/new', require('./routes/reviewRoutes/createReview'));
app.use('/reviews/all', require('./routes/reviewRoutes/getReviews'));


app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404);
    throw error;
  });

app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
