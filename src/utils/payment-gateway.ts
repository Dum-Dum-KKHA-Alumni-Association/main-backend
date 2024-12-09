import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import axios from "axios";

export const initiatePay = async ({
  name,
  amount,
  mobile,
}: {
  name: string;
  amount: number;
  mobile: string;
}) => {
  const payEndPoint = "/pg/v1/pay";
  const merchantTransactionId = uuidv4();
  const merchantUserId = "MUID123343";

  const payload = {
    name,
    merchantId: process.env.PHONEPE_MERCHANT_ID,
    merchantTransactionId: merchantTransactionId,
    merchantUserId: merchantUserId,
    amount: amount * 100,
    redirectUrl: `https://localhost:8000/redirect-url/${merchantTransactionId}`,
    redirectMode: "POST",
    // callbackUrl: "https://webhook.site/callback-url",
    mobileNumber: mobile,
    paymentInstrument: {
      type: "PAY_PAGE",
    },
  };

  // SHA256(base64 encoded payload + “/pg/v1/pay” +salt key) + ### + salt index
  const payloadString = JSON.stringify(payload);
  const base64EncodedString = Buffer.from(payloadString).toString("base64");

  const hash = crypto
    .createHash("sha256")
    .update(base64EncodedString + payEndPoint + process.env.SALT_KEY)
    .digest("hex");

  const xVerify = hash + "###" + process.env.SALT_INDEX;

  try {
    const { data } = await axios.post(
      `${process.env.PHONEPE_API_URL!}`,
      {
        request: base64EncodedString,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": xVerify,
        },
      }
    );

    const pgDetails = {
      merchantId: data.data.merchantId,
      merchantTransactionId: data.data.merchantTransactionId,
      paymentPageUrl: data.data.instrumentResponse.redirectInfo.url,
    };

    console.log("pgDetails--->",pgDetails);

    return pgDetails;
  } catch (error) {
    console.log(error);
  }
};
