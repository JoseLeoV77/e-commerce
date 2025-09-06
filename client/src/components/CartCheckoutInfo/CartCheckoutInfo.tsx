import { useContext } from "react";
import { CartContext } from "../../context/cartContext.tsx";
import "./cart-checkout.css";

export const CartCheckoutInfo = () => {
  const { cart } = useContext(CartContext);

  return (
    <section className="cart-checkout-info">
      <hgroup>
        <h2>Checkout Information</h2>
        <p>Please review your cart items before proceeding to checkout.</p>
        <p>Ensure that all details are correct to avoid any issues with your order.</p>
      </hgroup>
      <ul>
        {
          cart.length === 0 
          ? <li>Your cart is empty.</li> 
          : cart.map(item => (
            <li key={item.id}>
              <img src={item.image} alt={item.name} />
              {item.name} - {item.quantity} x ${item.price}
            </li>
          ))}
      </ul>
    </section>
  );
}