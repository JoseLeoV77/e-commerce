/* eslint-disable react/react-in-jsx-scope */
import { Route } from 'react-router-dom'
import './App.css'
import { Main } from './components/Main/Main.tsx'
import { Navbar } from './components/Navbar/Navbar.tsx'
import { Results } from './components/Results/Results.tsx'
import { RoutesNotFound } from './components/RoutesNotFound/RoutesNotFound.tsx'
import { UserRegister } from './components/Register/Register.tsx'
import { useLocation } from 'react-router-dom'
import { ProductDetails } from './components/ProductDetails/ProductDetails.tsx'
import { Login } from './components/Login/Login.tsx'
import { ProfilePage } from './components/ProfilePage/ProfilePage.tsx'
import { About } from './components/About/About.tsx'
import { Sales } from './components/MySales/Sales.tsx'
import { CreateProduct } from './components/CreateProduct/CreateProduct.tsx'

function App() {
  const location = useLocation()
  const excludePaths = ['/register', '/login'] //pages with no navbar

  return (
    <div className='container'>
      <header>
          {!excludePaths.includes(location.pathname) && <Navbar/>}
      </header>
      <div className='routes-container'>
        <RoutesNotFound>
          <Route path='/About' element={<About />} />
          <Route path='/profile' element={<ProfilePage />}/>
          <Route path='/publish' element={<CreateProduct />} />
          <Route path='/sales' element={<Sales />}/>
          <Route path='/login' element={<Login />}/>
          <Route path='/register' element={<UserRegister />}/>
          <Route path='/search' element={<Results />}/>
          <Route path='/:input' element={<ProductDetails />} />
          <Route path='/' element={<Main />}/>
        </RoutesNotFound>
      </div>
    </div>
  )
}

export default App
