import { useContext } from "react"
import { AuthContext } from "../../context/userContext"
import { Link } from "react-router-dom"
import { ProfileNav } from "../ProfileNav/ProfileNav"

export const ProfilePage = () => {
  const {user, isAuthenticated} = useContext(AuthContext) 
  console.log('personal, page', user)

  return (
    <div className="personal-page-container">
      {isAuthenticated ? 
      <div className="userPage">
        <h1>Mi cuenta</h1>
        <section className="personal-page-info">
          <h2>Información personal</h2>
          <span>Username: {user}</span>
          <p>Name:</p>
          <p>Last Name: </p>
        </section>
        <section className="personal-page-orders">
          <h2>Mis pedidos</h2>
          <ProfileNav />
          {/* Aquí se pueden mostrar los pedidos del usuario */}
        </section>
      </div>
      : 
      <div className="login-message">
        <h2>Please
          <Link to="/login">Login</Link>
          or
          <Link to="/register"> register!</Link>
        </h2>
      </div>
      }
    </div>
  )
}