import { useContext, useEffect, useState } from "react"
import { CartContext } from "../../context/cartContext"
import { RemoveIcon } from "../Icons/Icons"
import "./CartMenu.css"

export const CartMenu = () => {
  const { cart, removeFromCart } = useContext(CartContext)
  const [ cartProducts, setCartItems ] = useState<any[]>([])

  useEffect(() => {
    setCartItems(cart)
  }, [cart])
  
  function handleRemove(item: string) {
    removeFromCart(item)
  }

  return(
    <section className="cart-menu" >
      <h5>Your cart: </h5>
      <ul>
        {
        cartProducts.length > 0
        ? cartProducts.map((item, index) => (
          <li key={index}>
            <img src={item.image} alt={item.name} width="50" height="50" />
            <div style={{color: 'white'}}>{item.name}</div>
            <div>{item.price}</div>
            <section>
              <button onClick={() => handleRemove(item.name)} style={{backgroundColor: 'transparent', border: 'none', width: '20px', height: '20px'}}>
                <RemoveIcon />
              </button>
              <div>{item.quantity}</div>
            </section>
          </li>
        ))
        : <div>Here you can see you products in added to cart!</div>
        }
      </ul>
    </section>
  )
}