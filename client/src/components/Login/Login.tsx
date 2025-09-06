import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useContext, useState } from "react"
import { AuthContext } from "../../context/userContext"
import { BackToShopButton } from "../BackToShopButton/BackToShop"
import './login.css'


export const Login = () => {
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [user, setUser] = useState({
    user_name: '',
    password: '',
    email: '',
  });
  
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  function handleClick(e: React.MouseEvent<HTMLButtonElement>){
    e.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')
    
    if(user.user_name === '' || user.password === '' || user.email === ''){
      setErrorMessage("Please fill all fields")
      return
    }
    console.log(user.password)
   
    fetch('http://localhost:3000/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type':'application/json'
      },
      body: JSON.stringify(user)
    })
    .then(res => {
      if(!res.ok){
        throw new Error('Failed to fetch')
      } 
      return res.json()
    })
    .then(res => {
      login({userData:user.user_name, token: res.accessToken})
      setSuccessMessage("Login successful!")
      setTimeout(() => {
        navigate('/')
      }, 2000)

    })
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>){
    setUser({...user, [e.target.name]: e.target.value})
  }

  return (
    <div className="login-container">
      <section className="login-card">
        <form action="" className="login-form">
          <h3>Login</h3>

          <section className="input-section">
            <label htmlFor="login-username" className="login-lable">Username</label>
            <input onChange={handleChange} type="text" id="login-username" placeholder="Username" name="user_name" autoComplete="current-username" className="login-input"/>
          </section>

          <section className="input-section">
            <label htmlFor="login-password" className="login-lable">Password</label>
            <input onChange={handleChange} type="password" id="login-password" placeholder="Password" name="password" autoComplete="current-password" className="login-input"/>
          </section>

          <section className="input-section">
            <label htmlFor="login-email" className="login-lable">Email</label>
            <input onChange={handleChange} type="email" id="login-email" placeholder="@Email" name="email" autoComplete="current-email" className="login-input"/>
          </section>

          <button onClick={handleClick} className="login-btn">Log in</button>
        </form>
        {errorMessage && <p className="error">{errorMessage}</p>}
        {successMessage && <p className="success">{successMessage}</p>}

        {/* <Link to'>Olvidaste tu contraseña? </p> */}
        <section className="footer-section">
          <section className="signup-link">
            <p>Don't have an account? </p>
            <Link to="/register">Sign up!</Link>
          </section>
          <BackToShopButton />
        </section>
      </section>
    </div>
  )
}