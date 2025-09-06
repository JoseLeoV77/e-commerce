import { PayPalButtons } from "@paypal/react-paypal-js"
import { usePaypal } from "../../hooks/usePaypal.ts";
import "./checkout.css"
import { CartCheckoutInfo } from "../CartCheckoutInfo/CartCheckoutInfo.tsx";



export const Checkout = () => {
  const { createOrder, onApprove } = usePaypal()

  return (
    <section className="checkout-container">
      <CartCheckoutInfo />
      <PayPalButtons
        style={{ shape: "pill" }}
        createOrder={createOrder}
        onApprove={onApprove}
      />
    </section>
  )
}