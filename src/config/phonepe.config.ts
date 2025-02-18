import { v4 as uuidv4 } from 'uuid';

const phonePePayloadConfig = ({
	amount,
	redirectUrlPath,
	mobile,
}: {
	amount: number;
	redirectUrlPath: string;
	mobile: string;
}) => {
	const merchantTransactionId = uuidv4();
	const merchantUserId = 'MUID123343';
	return {
		merchantId: process.env.PHONEPE_MERCHANT_ID,
		merchantTransactionId: merchantTransactionId,
		merchantUserId: merchantUserId,
		amount: amount * 100,
		redirectUrl: `${process.env.FRONTEND_ENDPOINT_URL}/${redirectUrlPath}`,
		// callbackUrl: `${process.env.BACKEND_ENDPOINT_URL}/payment/status/${donationId}/${merchantTransactionId}`,
		// redirectMode: 'POST',
		redirectMode: 'REDIRECT',
		callbackUrl: `${process.env.BACKEND_ENDPOINT_URL}/payment/phonepe-callback`,
		mobileNumber: mobile,
		paymentInstrument: {
			type: 'PAY_PAGE',
		},
	};
};

export default phonePePayloadConfig;
