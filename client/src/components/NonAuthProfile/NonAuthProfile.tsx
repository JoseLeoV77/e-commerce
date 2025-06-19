import { Link } from "react-router-dom";

export const NonAuthProfile = () => {

  return (
    <div className="login-message">
      <h2>Please
        <Link to="/login">Login</Link>
        or
        <Link to="/register"> register!</Link>
      </h2>
    </div>
  )
}