import crypto from 'crypto';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export const initiatePay = async ({
	amount,
	mobile,
}: {
	amount: number;
	mobile: string;
}) => {
	const merchantTransactionId = 'MT-' + uuidv4().toString().slice(0, 30);
	const merchantUserId = 'MUID-' + uuidv4().toString().slice(0, 30);
	console.log('merchantTransactionId', merchantTransactionId);
	console.log('merchantUserId', merchantTransactionId);

	const payload = {
		merchantId: process.env.PHONEPE_MERCHANT_ID,
		merchantTransactionId: merchantTransactionId,
		merchantUserId: merchantUserId,
		amount: amount * 100,
		// redirectUrl: `${process.env.FRONTEND_ENDPOINT_URL}/donation/payment-processing/${merchantTransactionId}`,
		// redirectUrl: `${process.env.BACKEND_ENDPOINT_URL}/payment/status/${merchantTransactionId}`,
		redirectUrl: `${process.env.BACKEND_ENDPOINT_URL}/payment/status`,
		redirectMode: 'POST',
		// redirectMode: 'REDIRECT',
		callbackUrl: `${process.env.BACKEND_ENDPOINT_URL}/payment/phonepe-callback`,
		mobileNumber: mobile,
		paymentInstrument: {
			type: 'PAY_PAGE',
		},
	};

	// SHA256(base64 encoded payload + “/pg/v1/pay” +salt key) + ### + salt index
	const payloadString = JSON.stringify(payload);
	const payloadMain = Buffer.from(payloadString).toString('base64');

	const hash = crypto
		.createHash('sha256')
		.update(payloadMain + '/pg/v1/pay' + process.env.SALT_KEY)
		.digest('hex');

	const checksum = hash + '###' + process.env.SALT_INDEX;

	try {
		const { data } = await axios.post(
			`${process.env.PHONEPE_API_URL!}/pay`,
			{
				request: payloadMain,
			},
			{
				headers: {
					'Content-Type': 'application/json',
					'X-VERIFY': checksum,
				},
			}
		);

		const pgDetails = {
			merchantId: data.data.merchantId,
			merchantTransactionId: data.data.merchantTransactionId,
			paymentPageUrl: data.data.instrumentResponse.redirectInfo.url,
		};

		return pgDetails;
	} catch (error) {
		console.log(error);
	}
};

export const callCheckStatusApi = async ({
	merchantTransactionId,
}: {
	merchantTransactionId: string;
}) => {
	// SHA256(“/pg/v1/status/{merchantId}/{merchantTransactionId}” + saltKey) + “###” + saltIndex
	const hash = crypto
		.createHash('sha256')
		.update(
			`/pg/v1/status/${process.env.PHONEPE_MERCHANT_ID}/${merchantTransactionId}` +
				process.env.SALT_KEY
		)
		.digest('hex');

	const xVerify = hash + '###' + process.env.SALT_INDEX;

	try {
		const { data } = await axios.get(
			`${process.env.PHONEPE_API_URL!}/status/${process.env.PHONEPE_MERCHANT_ID}/${merchantTransactionId}`,
			{
				headers: {
					'Content-Type': 'application/json',
					'X-VERIFY': xVerify,
					'X-MERCHANT-ID': process.env.PHONEPE_MERCHANT_ID,
				},
			}
		);

		return data;
	} catch (error) {
		console.log(error);
		return null;
	}
};
