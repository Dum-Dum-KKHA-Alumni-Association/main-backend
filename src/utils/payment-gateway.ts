import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import axios from 'axios';

export const initiatePay = async ({
	amount,
	mobile,
	// donationId,
}: {
	amount: number;
	mobile: string;
	// donationId: string;
}) => {
	const payEndPoint = '/pg/v1/pay';
	const merchantTransactionId = uuidv4();
	const merchantUserId = 'MUID123343';

	const payload = {
		merchantId: process.env.PHONEPE_MERCHANT_ID,
		merchantTransactionId: merchantTransactionId,
		merchantUserId: merchantUserId,
		amount: amount * 100,
		redirectUrl: `${process.env.FRONTEND_ENDPOINT_URL}/donation`,
		// callbackUrl: `${process.env.BACKEND_ENDPOINT_URL}/payment/status/${donationId}/${merchantTransactionId}`,
		// redirectMode: 'POST',
		redirectMode: 'REDIRECT',
		callbackUrl: `${process.env.BACKEND_ENDPOINT_URL}/payment/phonepe-callback`,
		mobileNumber: mobile,
		paymentInstrument: {
			type: 'PAY_PAGE',
		},
	};

	// SHA256(base64 encoded payload + “/pg/v1/pay” +salt key) + ### + salt index
	const payloadString = JSON.stringify(payload);
	const base64EncodedString = Buffer.from(payloadString).toString('base64');

	const hash = crypto
		.createHash('sha256')
		.update(base64EncodedString + payEndPoint + process.env.SALT_KEY)
		.digest('hex');

	const xVerify = hash + '###' + process.env.SALT_INDEX;

	try {
		const { data } = await axios.post(
			`${process.env.PHONEPE_API_URL!}/pay`,
			{
				request: base64EncodedString,
			},
			{
				headers: {
					'Content-Type': 'application/json',
					'X-VERIFY': xVerify,
				},
			}
		);

		const pgDetails = {
			merchantId: data.data.merchantId,
			merchantTransactionId: data.data.merchantTransactionId,
			paymentPageUrl: data.data.instrumentResponse.redirectInfo.url,
		};

		// console.log("pgDetails--->",pgDetails);

		return pgDetails;
	} catch (error) {
		console.log(error);
	}
};
