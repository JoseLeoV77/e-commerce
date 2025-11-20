import { Link } from 'react-router-dom'
import { SearchForm } from '../SearchForm/SearchForm.tsx'
import { useState, useContext } from 'react'
import { AuthContext } from '../../context/userContext.tsx'
import { ProfileMenu } from '../ProfileMenu/ProfileMenu.tsx'
import { CartIcon } from '../CartIcon/CartIcon.tsx'
import { CartMenu } from '../CartMenu/CartMenu.tsx'
import { useTranslation } from 'react-i18next'
import './navbar.css'
import { LanguageSwitcher } from '../LanguageSwitcher/LanguageSwticher.tsx'

export const Navbar = () => {
  const { t } = useTranslation()
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
        <LanguageSwitcher />
        <SearchForm />
        {isAuthenticated 
        ? <ProfileMenu/>
        : <div>
            <Link to='/register'>
              <span className='register-text'> {t("register_text_key")} </span>
            </Link>
            <span style={{color: 'white'}}> | </span>
            <Link to='/login'>
              <span className='register-text'>{t("login_text_key")} </span>
            </Link>
          </div>  
        }
        <CartIcon handleClick={handleClick} />
      </section>
      {openCartMenu &&  
      <section className='nav-cart-popup'>
        <CartMenu />
      </section>
      }
    </nav>
  )
}
