import { useContext, useState } from "react"
import { AuthContext } from "../../context/userContext.tsx";
import { LogoutButton } from "../LogoutButton/LogoutButton.tsx";
import './profileMenu.css'
import { Link } from "react-router-dom";

export const ProfileMenu = () => {
  const { user, isAuthenticated, logout } =  useContext(AuthContext)
  const [isOpen, setIsOpen] = useState(false)


  return (

    <section className="profile-menu-container">
      {isAuthenticated && 
      <button className="profile-menu-button" onClick={() => setIsOpen(!isOpen)}>
        <img className='profile-img' src={`https://dummyjson.com/image/40x40/008080/ffffff?text=${user}`} alt="profile picture"/>
      </button>}
      {isOpen && 
        <div style={{position:'absolute'}} className="profile-menu-dropdown">
          <p style={{color: "white"}}>{user}</p>
          <Link to={"/profile"}>
            <p>profile</p>
          </Link>
          <LogoutButton />
        </div>
        }
    </section>
  )
}