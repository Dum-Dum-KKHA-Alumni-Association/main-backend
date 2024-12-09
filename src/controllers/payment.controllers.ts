import { Response } from "express";
import { AuthenticatedRequest } from "../types/apiRequest";
import asyncHandler from "../utils/asyncHandler";
import ApiResponse from "../utils/ApiResponse";
import ApiError from "../utils/ApiError";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";

export const initiatePay = asyncHandler(
  async (request: AuthenticatedRequest, response: Response): Promise<void> => {
    const { name, amount, mobile } = request.body;

    const payEndPoint = "/pg/v1/pay";
    const merchantTransactionId = uuidv4();
    const merchantUserId = "MUID123343";

    const payload = {
      name,
      merchantId: process.env.PHONEPE_MERCHANT_ID,
      merchantTransactionId: merchantTransactionId,
      merchantUserId: merchantUserId,
      amount: amount,
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
      const payResponse = await axios.post(
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
      console.log(payResponse.data);

      response
        .status(200)
        .json(new ApiResponse(200, payResponse.data, "Initiate Pay"));
    } catch (error) {
      response.status(400).json(new ApiError(400, "Error Happened", error));
    }
  }
);


export const checkPaymentStatus =asyncHandler(
  async (request: AuthenticatedRequest, response: Response): Promise<void> =>{


    try{

    }catch(error){
      
    }

  })