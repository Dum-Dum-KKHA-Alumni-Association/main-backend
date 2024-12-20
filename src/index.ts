import serverless from 'serverless-http';
import app from './app';

const port = process.env.PORT || 8000;
app.listen(port, () => {
	console.log(`Server is Fire at http://localhost:${port}`);
});

export const handler = serverless(app);
