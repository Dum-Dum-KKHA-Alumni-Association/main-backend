import * as dotenv from 'dotenv';
import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.routes';
// import donationRouter from './routes/donation.routes';
import paymentRouter from './routes/payment.routes';
import uploadRouter from './routes/upload.routes';
import eventsRouter from './routes/events.routes';
import bookingRouter from './routes/booking.routes';
import cors from 'cors';
import bodyParser from 'body-parser';
import passport from 'passport';
import { passportLocalStrategy } from './middleware/auth.middleware';
import session from 'express-session';

dotenv.config();

const app: Application = express();

const corsOptions = {
	origin: [
		process.env.FRONTEND_ENDPOINT_URL!,
		process.env.ADMIN_PANEL_ENDPOINT_URL!,
	],
	optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
	methods: 'GET,POST,PUT,DELETE,OPTIONS',
	credentials: true,
	allowedHeaders: ['Content-Type', 'Authorization'],
	// If cookies or credentials are used
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: '16kb' })); //accept JSON data
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));

///Passport for Authentication
app.use(
	session({
		secret: 'keyboard cat',
		resave: false,
		saveUninitialized: false,
		cookie: { secure: false, httpOnly: true, maxAge: 12000000 },
	})
);
passportLocalStrategy();
app.use(passport.initialize());
app.use(passport.session());
app.enable('trust proxy');

// Routes Declaration
app.use('/api/v1/user', userRouter);
app.use('/api/v1/events', eventsRouter);
app.use('/api/v1/booking', bookingRouter);
app.use('/api/v1/payment', paymentRouter);
app.use('/api/v1/upload', uploadRouter);

// app.use('/api/v1/donation', donationRouter);
// app.use('/api/v1/projects', projectRouter);
// app.use('/api/v1/enquiry', enquiryRouter);
// app.use('/api/v1/projectVisit', projectVisitRouter);

app.get('/', async (req, res) => {
	res.json({ message: 'Server is 100% up running' });
});

export default app;
