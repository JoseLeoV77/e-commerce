import { useContext } from "react"
import { AuthContext } from "../../context/userContext"
import { ProfileNav } from "../ProfileNav/ProfileNav"
import { NonAuthProfile } from "../NonAuthProfile/NonAuthProfile"
import { Link } from "react-router-dom"
import { ProductImage } from "../ProductImage/ProductImage"

export const Sales = () => {
  const {user, isAuthenticated, userProducts} = useContext(AuthContext)
console.log(userProducts.products)

  return (
    <div className="personal-page-container">
      {isAuthenticated ? 
      <div className="userPage">
        
        <section className="personal-page-orders">
          <h2>Mis productos</h2>
          <div>Crear producto:</div>
          <Link to="/publish">Crear nuevo producto</Link>

          <ProfileNav />
          <div>Mis productos: </div>
          {userProducts?.products?.length <= 0 
          ? <div>No tienes productos en venta.</div>
          :
            <div>Estos son tus productos en venta:
              <ProductImage product={userProducts?.products?.[0]} />
            </div>
            
          }
        </section>
      </div>
      : 
      <NonAuthProfile />
      }
    </div>
  )
}