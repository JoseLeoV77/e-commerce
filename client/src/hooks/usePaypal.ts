import { PayPalButtonsComponentProps } from "@paypal/react-paypal-js"
import { AuthContext } from "../context/userContext.tsx";
import { CartContext } from "../context/cartContext";
import { useContext } from "react";

interface OrderData {
  id: string;
  details?: Array <{
    issue: string,
    description: string
  }>;
  debug_id?: string;
}

interface CaptureData {
  jsonResponse: any;
  httpStatusCode: number;
}

export const usePaypal = () => {
    const { accessToken } = useContext(AuthContext)
    const { cart } = useContext(CartContext)

    const createOrder: PayPalButtonsComponentProps["createOrder"] = async () => {
    try {
      const res = await fetch("http://localhost:3000/create-paypal-order", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
         },
        body: JSON.stringify({ cart: {items: cart} })
      });

      const orderData: OrderData = await res.json();
      if (!orderData.id) {
        const errorDetail = orderData?.details?.[0];
        const errorMessage = errorDetail
          ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
          : "Unexpected error occurred, please try again.";

        throw new Error(errorMessage);
      }
      return orderData.id;
    } catch (err) {
      console.error(err);
      alert("An error occurred while creating the order. Please try again.");
      throw err;
    }
  }

  const onApprove: PayPalButtonsComponentProps["onApprove"] = async (data, actions) => {
    console.log(data.orderID)
    try {
      const response = await fetch(`http://localhost:3000/capture-paypal-order/${data.orderID}`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
      });
      const orderData = await response.json()

      const errorDetail = orderData?.details?.[0]

      if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
        return actions.restart()        
      }
      else if (errorDetail){
        throw new Error(`${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`);
      }
      else if (!orderData.purchase_units) {
        throw new Error(JSON.stringify(orderData));
      }
      else {
        const transaction =
        orderData?.purchase_units?.[0]?.payments?.captures?.[0] ||
        orderData?.purchase_units?.[0]?.payments?.authorizations?.[0];
        alert(
          `Transaction ${transaction.status}: ${transaction.id}<br><br>See console for all available details`,
        );
       console.log("Capture result",
        orderData,
        JSON.stringify(orderData, null, 2),
        );
      }
    } catch (err) {
      console.log("Capture error", err);
      alert("An error occurred while capturing the order. Please try again.");
      throw err;
    }
  }

  return { createOrder, onApprove }
}