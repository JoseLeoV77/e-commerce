import { Link } from "react-router-dom"
import { useTranslation } from 'react-i18next';
import './back-to-shop.css'

export const BackToShopButton = () => {
  const { t } = useTranslation()
  return (
    <div>
      <Link to="/">
        <button className="back-to-shop-btn btn">{t("Back_to_shop")}</button>
      </Link>
    </div>
  )
}