import { useProductBySlug } from '../../hooks/useProductBySlug'
import { ProductImage } from '../ProductImage/ProductImage'
import { useContext } from 'react'
import { CartContext } from '../../context/cartContext'
import { Link } from 'react-router-dom'
import './product-details.css'


export const ProductDetails = () => {
  const { addToCart } = useContext(CartContext)
  const { productDetails, loading } = useProductBySlug()
  console.log('productDetails', productDetails)

  if(loading) {
    return <h3>loading</h3>
  }
  
  function handleCart() {
    if(!productDetails) return
    addToCart({
      id: productDetails?.product_id, 
      name: productDetails.product_name, 
      description: productDetails.product_description, 
      price: productDetails.price, 
      image: productDetails.image_url[0],
    })

  }

  return (
    <section className='product-details-container'>
      <div className="product-card">
      {productDetails ? 
        (<ProductImage product={ productDetails } />
          )
          : ( <h3>No image provided!</h3>) 
        } 
      </div>
      <section className="product-info">
        <div className="product-title">
          {productDetails ? productDetails.product_name : ''}
        </div>
        <div className="product-description"> 
          {productDetails ? productDetails.product_description : ''}
        </div>
        <div className="product-price">   
          {productDetails ? productDetails.price : ''}
        </div>
        <div className="product-seller">
          <span>Seller: </span>
          {productDetails ? productDetails.user_name : ''}
        </div>
      </section>
      <div className="payment-card">
        <Link to={`/checkout`} onClick={handleCart}>Buy now!</Link>
        <button className='add-to-cart-button' onClick={handleCart}>Add to cart</button>
      </div>
    </section>
  )
}