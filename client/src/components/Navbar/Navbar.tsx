import './navbar.css'
import { ShoppinCartIcon } from '../Icons/Icons.tsx'
import { Link } from 'react-router-dom'
import { SearchForm } from '../SearchForm/SearchForm.tsx'
import { useContext } from 'react'
import { AuthContext } from '../../context/userContext.tsx'
import { ProfileMenu } from '../ProfileMenu/ProfileMenu.tsx'
import { Cart } from '../Cart/Cart.tsx'

export const Navbar = () => {
  const { user, isAuthenticated } = useContext(AuthContext)
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
            <Link style={{textDecoration:'none'}} to='/register'>
              <span className='register-text'>Sign up! </span>
            </Link>
            <span style={{color: 'white'}}> | </span>
            <Link style={{textDecoration:'none'}} to='/login'>
              <span className='register-text'> Login </span>
            </Link>
          </div>  
        }
        <Cart />
      </section>
    </nav>
  )
}
