import { Link } from "react-router-dom"

export const ProfileNav = () => {

  return(
    <nav>
      <ul>
          <li>
            <Link to="/sales">My sales</Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
      </ul>
    </nav>
  )


}

