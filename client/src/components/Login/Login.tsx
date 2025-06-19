import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useContext, useState } from "react"
import { AuthContext } from "../../context/userContext"
import { BackToShopButton } from "../BackToShopButton/BackToShop"


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
      <form action="">
        <label htmlFor="login-username">Username</label>
        <input onChange={handleChange} type="text" id="login-username" placeholder="Nombre de usuario" name="user_name" autoComplete="current-username"/>

        <label htmlFor="login-password">Contraseña</label>
        <input onChange={handleChange} type="password" id="login-password" placeholder="Contraseña" name="password" autoComplete="current-password"/>
        
        <label htmlFor="login-email">Email</label>
        <input onChange={handleChange} type="email" id="login-email" placeholder="Email" name="email" autoComplete="current-email"/>
        <button onClick={handleClick} className="btn">Log in</button>
      </form>
      {errorMessage && <p className="error">{errorMessage}</p>}
      {successMessage && <p className="success">{successMessage}</p>}

      {/* <Link to'>Olvidaste tu contraseña? </p> */}
      <p>Don't have an account? </p>
      <Link to="/register">Sign up!</Link>
      <BackToShopButton />
    </div>
  )
}