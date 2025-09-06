import { Link } from 'react-router-dom'
import { SearchForm } from '../SearchForm/SearchForm.tsx'
import { useContext } from 'react'
import { AuthContext } from '../../context/userContext.tsx'
import { ProfileMenu } from '../ProfileMenu/ProfileMenu.tsx'
import { Cart } from '../Cart/Cart.tsx'
import { CartMenu } from '../CartMenu/CartMenu.tsx'
import { useState } from 'react'
import './navbar.css'

export const Navbar = () => {
  const { user, isAuthenticated } = useContext(AuthContext)

  const [ openCartMenu, setOpenCartMenu ] = useState(false)
  
  function handleClick () {
    setOpenCartMenu(!openCartMenu)
  }
  console.log(user, isAuthenticated)
  return (
    <nav className='nav'>
      <section className='upper-nav'>
        <Link style={{textDecoration:'none'}} to='/'>
          <span className='logo-placeholder'>LOGO</span>
        </Link>
        <SearchForm />
        {isAuthenticated 
        ? <ProfileMenu/>
        : <div>
            <Link to='/register'>
              <span className='register-text'>Sign up </span>
            </Link>
            <span style={{color: 'white'}}> | </span>
            <Link to='/login'>
              <span className='register-text'> Login </span>
            </Link>
          </div>  
        }
        <Cart handleClick={handleClick} />
      </section>
      {openCartMenu &&  
      <section className='nav-cart-popup'>
        <CartMenu />
      </section>
      }
    </nav>
  )
}
