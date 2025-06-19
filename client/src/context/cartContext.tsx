import {  useState, useEffect, createContext } from "react";

interface GlobalProps {
  children: React.ReactNode
}

interface CartContextType {
  cart: any[],
  cartId: string | null,
  addToCart: (product: any) => void;
  removeFromCart: (product: any) => void;
}



export const CartContext = createContext<CartContextType>({
  cart: [],
  cartId: "",
  addToCart: () => {},
  removeFromCart: () => {}
})

export const CartProvider = ({ children }: GlobalProps) => {
    const [ cart, setCart ] = useState<any[]>([])
    const [ cartId, setCartId ] = useState<string | null>("")

    useEffect(() => {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        setCart(JSON.parse(storedCart)); // Load stored cart data
      }
    }, []);

    useEffect(() => {
      window.localStorage.setItem("cart", JSON.stringify(cart))
    }, [cart])

    const addToCart = (product: any) => {
      setCart(prevCart => {
      const existingProductIndex = prevCart.findIndex(item => item.id === product.id);
      let updatedCart = [...prevCart]; // Copy current cart

      if (existingProductIndex !== -1) {
        updatedCart[existingProductIndex].quantity += 1;
      } else {
        updatedCart.push({ ...product, quantity: 1 });
      }

      return updatedCart;
    });

    setCartId(product.id);
  }

  const removeFromCart = (product: any) => {
    setCart(cart.filter((item) => item.product_name !== product.product_name))
    window.localStorage.removeItem("cart")
  }

  return (
    <CartContext.Provider value={{ cart, cartId, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  )
}
