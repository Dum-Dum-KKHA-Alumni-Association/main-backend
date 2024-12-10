import * as dotenv from 'dotenv';
import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.routes';
import donationRouter from './routes/donation.routes';
import paymentRouter from './routes/payment.routes';
import cors from 'cors';

dotenv.config();

const app: Application = express();

const corsOptions = {
	// origin: [process.env.FRONTEND_ENDPOINT_URL!,process.env.ADMIN_PANEL_ENDPOINT_URL!],
	optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
	methods: 'GET,POST,PUT,DELETE,OPTIONS',
	credentials: true, // If cookies or credentials are used
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '16kb' })); //accept JSON data
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());
// app.use(clerkMiddleware());

// Routes Declaration
app.use('/api/v1/user', userRouter);
app.use('/api/v1/donation', donationRouter);
app.use('/api/v1/donation', donationRouter);
app.use('/api/v1/payment', paymentRouter);
// app.use('/api/v1/projects', projectRouter);
// app.use('/api/v1/enquiry', enquiryRouter);
// app.use('/api/v1/projectVisit', projectVisitRouter);

app.get('/', async (req, res) => {
	res.json({ message: 'Server is 100% up running' });
});

export default app;
