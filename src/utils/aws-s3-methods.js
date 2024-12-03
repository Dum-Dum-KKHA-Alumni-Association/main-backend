const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { s3Client } = require('../config/aws-sdk-s3-config');

const getObjectUrl = async (key) => {
	const command = new GetObjectCommand({
		Bucket: process.env.S3_BUCKET_NAME,
		Key: key,
	});

	try {
		const url = await getSignedUrl(s3Client, command);
		return url;
	} catch (error) {
		return error.message;
	}
};

const generatePutObjectUrl = async (key, contentType) => {
console.log('url ---->', process.env.S3_BUCKET_NAME);
	const command = new PutObjectCommand({
		Bucket: process.env.S3_BUCKET_NAME,
		Key: key,
		ContentType: contentType,
	});

	const url = await getSignedUrl(s3Client, command, { expiresIn: 60*10 });
	return url;
};

module.exports = { getObjectUrl, generatePutObjectUrl };
