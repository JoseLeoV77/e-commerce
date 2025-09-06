import { useState } from "react";
import './register.css'
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { BackToShopButton } from "../BackToShopButton/BackToShop";

export const UserRegister = () => {
  const [user, setUser] = useState({
    user_name: '',
    password: '',
    re_password: '',
    email: '',
  });
  const [passMessage, setPassMessage] = useState("")
  const navigate  = useNavigate()

  function handleClick(e: React.MouseEvent<HTMLButtonElement>){
    e.preventDefault()
    console.log(user.password)
    
    if(user.password === user.re_password){
      setPassMessage("Passwords matched!")

      fetch('http://localhost:3000/register', {
        method: 'POST',
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
      .then(()=> navigate('/login'))
    } else {
      setPassMessage("Passwords not matched!")
    }

  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>){
    setUser({...user, [e.target.name]: e.target.value})
  }

  return (
    <div className="form-container">
      <form action="" method="post" className="register-form">
        <label htmlFor="register-username">Username</label>
        <input 
        onChange={handleInput} 
        type="text" 
        id="register-username" 
        placeholder="Username" 
        name="user_name"
        className="register-input"
        />
        
        <label htmlFor="register-email">Email</label>
        <input 
        onChange={handleInput} 
        type="email" 
        id="register-email" 
        placeholder="@Email" 
        name="email"
        className="register-input"
        />

        <label htmlFor="register-password">Password</label>
        <input 
        onChange={handleInput} 
        type="password" 
        id="register-password" 
        placeholder="Password" 
        name="password"
        className="register-input"
        />

        <label htmlFor="re-enter-password">Re-enter password</label>
        <input 
        onChange={handleInput} 
        type="password" 
        id="re-enter-password" 
        placeholder="Confirm Password" 
        name="re_password"
        className="register-input"
        />

        <div>{passMessage}</div>
        <br/>
        <button onClick={handleClick} className="register-btn btn">Register</button>
      </form>

      <section className="login-link-container">
        <p>Already have an account? </p>
        <Link to="/login">
          <span className="login-link">Login!</span>
        </Link>

        <BackToShopButton />
      </section>
    </div>
  )
}
