import "dotenv/config";
import { UserModel } from "../model/mySql/users.js";
import { config } from "../config/database.js";
import mysql from "mysql2/promise";

const
  {
    PAYPAL_CLIENT_ID,
    PAYPAL_CLIENT_SECRET,
  } = process.env;
const base = "https://api-m.sandbox.paypal.com";

let cachedToken = null;
let tokenExpiration = 0;

const userModel = new UserModel(mysql.createPool(config));

const generateAccessToken = async () => {
  if (cachedToken && Date.now() < tokenExpiration) {
    console.log("Using cached Access Token");
    return cachedToken;
  }
  console.log("Generating Access Token...");

  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error("MISSING_API_CREDENTIALS");
    }
    const auth = Buffer.from(
      PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET,
    ).toString("base64");
    const response = await fetch(`${base}/v1/oauth2/token`,
      {
        method: "POST",
        body: "grant_type=client_credentials",
        headers:
        {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

    const data = await response.json();

    cachedToken = data.access_token;
    tokenExpiration = Date.now() + (data.expires_in - 120) * 1000; // Subtract 2 minutes for safety
    return cachedToken;
  }
  catch (error) {
    console.error("Failed to generate Access Token:", error);
    cachedToken = null;
    tokenExpiration = 0;
    throw new Error("Failed to generate Access Token");
  }
};

export const createOrder = async (cart, seller) => {
  // use the cart information passed from the front-end to calculate the purchase unit details
  if (!cart || !seller || !seller.user_id) {
    throw new Error("Missing cart information!");
  }
  console.log(
    "shopping cart information passed from the frontend createOrder() callback:",
    cart,
  );
  const sellerDetails = await userModel.findById({ userId: seller.user_id });
  if (!sellerDetails) {
    throw new Error(`Seller with ID ${seller.user_id} not found! or has no PayPal account.`);
  }
  const sellerPayPalEmail = sellerDetails.paypal_email;

  const totalValue = cart.items.reduce((sum, item) => (sum + (item.price * parseFloat(item.quantity))), 0).toFixed(2);

  if (totalValue <= 0) {
    throw new Error("Total value of the cart must be greater than zero.");
  }

  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders`;
  const payload = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount:
        {
          currency_code: "USD",
          value: totalValue,
        },
        payee: {
          email_address: sellerPayPalEmail, // Use the seller's PayPal email
        },
      },
    ],
  };

  const response = await fetch(url,
    {
      headers:
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        // Uncomment one of these to force an error for negative testing (in sandbox mode only). 
        // "PayPal-Mock-Response": '{"mock_application_codes": "MISSING_REQUIRED_PARAMETER"}'
        // "PayPal-Mock-Response": '{"mock_application_codes": "PERMISSION_DENIED"}'
        // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
      },
      method: "POST",
      body: JSON.stringify(payload),
    });

  return handleResponse(response);
}


export const captureOrder = async (orderID) => {
  const accessToken = await generateAccessToken();
  console.log("capture order aT", accessToken)
  const url = `${base}/v2/checkout/orders/${orderID}/capture`;

  const response = await fetch(url,
    {
      method: "POST",
      headers:
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        // Uncomment one of these to force an error for negative testing (in sandbox mode only).
        // "PayPal-Mock-Response": '{"mock_application_codes": "INSTRUMENT_DECLINED"}'
        // "PayPal-Mock-Response": '{"mock_application_codes": "TRANSACTION_REFUSED"}'
        // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
      },
    });
  console.log("response?", response)
  return handleResponse(response);
};

export async function handleResponse(response) {
  try {
    const jsonResponse = await response.json();
    return {
      jsonResponse,
      httpStatusCode: response.status,
    };
  }
  catch (err) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
}





