import { useContext, useEffect, useState } from "react"
import { CartContext } from "../../context/cartContext"
import { RemoveIcon } from "../Icons/Icons"
import { useTranslation } from "react-i18next";
import "./cart-menu.css"

export const CartMenu = () => {
  const { cart, removeFromCart, addToCart, reduceFromCart } = useContext(CartContext)
  const [ cartProducts, setCartItems ] = useState<any[]>([])
  const [ products ] = cartProducts
  const { t } = useTranslation()
  console.log(products)
  useEffect(() => {
    setCartItems(cart)
  }, [cart])

  function handleCart(e: React.MouseEvent<HTMLButtonElement>) {
    if(!products) return
    
    if(e.target.textContent === "+"){
      addToCart({
        id: products?.id, 
        name: products.name, 
        price: products.price, 
        image: products.image,
      })

    }

    if(e.target.textContent === "-"){
      reduceFromCart({
        id: products?.id, 
        name: products.name, 
        price: products.price, 
        image: products.image,
      })
    }
  }
  
  function handleRemove(item: string) {
    removeFromCart(item)
  }
  console.log('cartProducsts:',cartProducts)
  return(
    <section className="cart-menu" >
      <h5>{t("your_cart")}: </h5>
      <ul className="cart-menu-list">
        {
        cartProducts.length > 0
        ? cartProducts.map((item, index) => (
          <li key={index}>
            <img src={item.image} alt={item.name + " image"} width="50" height="50" />
            <div style={{color: 'black'}}>{item.name}</div>
            <div>{item.price}$</div>
            <section>
              <button onClick={() => handleRemove(item.name)} style={{backgroundColor: 'transparent', border: 'none', width: '20px', height: '20px'}}>
                <RemoveIcon />
              </button>
              <section>
                <div>{item.quantity}</div>
                <button className="qty-menu-btn" onClick={handleCart}>+</button>
                <button className="qty-menu-btn" onClick={handleCart}>-</button>
              </section>
            </section>
          </li>
        ))
        : <div>{t("add_some_products")}</div>
        }
      </ul>
    </section>
  )
}