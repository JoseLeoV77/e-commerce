import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/userContext.tsx'
import { CartProvider } from './context/cartContext.tsx'
import { PayPalScriptProvider} from '@paypal/react-paypal-js'

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <CartProvider>
      <PayPalScriptProvider options={{ clientId: "AfUYY9hUTZYot6gcyEyfLbOP1TT3q830iGp4gfNuaJ5c3kud_WGqJ3i044WFAG8w-zyFm44u64PhkC5k"}}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PayPalScriptProvider>
    </CartProvider>
  </AuthProvider>
)
