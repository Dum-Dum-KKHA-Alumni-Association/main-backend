import {
	DeleteObjectCommand,
	GetObjectCommand,
	ListObjectsV2Command,
	PutObjectCommand,
	S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { aws_s3_config } from '../config/aws-sdk-s3-config';

const s3Client = new S3Client({
	region: aws_s3_config.region,
	credentials: {
		accessKeyId: aws_s3_config.access_key,
		secretAccessKey: aws_s3_config.secret_key,
	},
});

export const uploadToS3 = async () => {
	const newFileName = `pic_${Date.now().toString()}`;

	const command = new PutObjectCommand({
		Bucket: aws_s3_config.bucket,
		Key: `uploads/${newFileName}`,
		ContentType: 'image/jpg',
	});

	const uploadUrl = await getSignedUrl(s3Client, command, {
		expiresIn: 60 * 10,
	});

	return uploadUrl;
};

export const getObjectUrl = async ({ key }: { key: string }) => {
	const command = new GetObjectCommand({
		Bucket: aws_s3_config.bucket,
		Key: key,
	});

	console.log(command);

	const url = await getSignedUrl(s3Client, command);
	return url;
};

export const listObjects = async () => {
	const command = new ListObjectsV2Command({
		Bucket: aws_s3_config.bucket,
	});

	const result = await s3Client.send(command);

	return result;
};

export const deleteObject = async ({ key }: { key: string }) => {
	const command = new DeleteObjectCommand({
		Bucket: aws_s3_config.bucket,
		Key: key,
	});

	const result = await s3Client.send(command);

	return result;
};
