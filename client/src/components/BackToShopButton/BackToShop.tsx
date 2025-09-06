import { Link } from "react-router-dom"
import './back-to-shop.css'

export const BackToShopButton = () => {
  return (
    <div>
      <Link to="/">
        <button className="back-to-shop-btn btn">Back to Shop</button>
      </Link>
    </div>
  )
}