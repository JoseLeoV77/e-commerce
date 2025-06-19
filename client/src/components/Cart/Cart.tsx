import { ShoppinCartIcon } from "../Icons/Icons"
import { useState } from "react"
import { CartMenu } from '../CartMenu/CartMenu.tsx'

export const Cart = () => {
  const [ openCartMenu, setOpenCartMenu ] = useState(false)

  function handleClick () {
    setOpenCartMenu(!openCartMenu)
  }

  return (
    <div className='cart-menu-container'>
      <button style={{width: '27px', height: '27px', backgroundColor: 'transparent', border: 'none'}}
      onClick={handleClick}>
        <ShoppinCartIcon />
      </button>
      {openCartMenu && <CartMenu />}
    </div>
  )
}