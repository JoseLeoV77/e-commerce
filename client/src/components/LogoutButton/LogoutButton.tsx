import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from '../../context/userContext.tsx'

export const LogoutButton = () => {
  const { logout } = useContext(AuthContext);

  return (
    <Link style={{ textDecoration: "none"}} to="/login">
      <span className="register-text" style={{color: "black"}} onClick={logout}>Logout</span>
    </Link>
  );
};
