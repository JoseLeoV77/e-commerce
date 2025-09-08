import { ShoppinCartIcon } from "../Icons/Icons"

interface CartIconProps {
  handleClick: () => void
}

export const CartIcon = ({ handleClick }: CartIconProps) => {

  return (
    <div className='cart-menu-container'>
      <button style={{width: '27px', height: '27px', backgroundColor: 'transparent', border: 'none'}}
      onClick={handleClick}>
        <ShoppinCartIcon />
      </button>
    </div>
  )
}