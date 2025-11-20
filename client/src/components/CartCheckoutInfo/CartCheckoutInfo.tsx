import { useContext } from "react";
import { CartContext } from "../../context/cartContext.tsx";
import { useTranslation } from "react-i18next";
import "./cart-checkout.css";

export const CartCheckoutInfo = () => {
  const { cart } = useContext(CartContext);
  const { t } = useTranslation()
  return (
    <section className="cart-checkout-info">
      <hgroup>
        <h2>{t("checkout_info")}.</h2>
        <p>{t("checkout_review_cart")}.</p>
        <p>{t("checkout_avoid_order_issues")}.</p>
      </hgroup>
      <ul>
        {
          cart.length === 0 
          ? <li>{t("checkout_cart_is_empty")}.</li> 
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