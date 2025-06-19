import { useParams } from 'react-router-dom'
import { useProduct } from '../../hooks/useProduct'
import { ProductImage } from '../ProductImage/ProductImage'
import { useContext } from 'react'
import { CartContext } from '../../context/cartContext'
import './productDetails.css'
import { stringify } from 'uuid'


export const ProductDetails = () => {
  const { addToCart } = useContext(CartContext)
  const { productDetails, loading } = useProduct()
  const { input } = useParams()
  const selectedProduct = productDetails.filter(product => product.product_name == input)
  const [ product ] = selectedProduct
  console.log(product)

  if(loading) {
    return <h3>loading</h3>
  }
  
  function handleCart() {
    addToCart({
      id: product?.product_id, 
      name: product.product_name, 
      description: product.product_description, 
      price: product.price, 
      image: product.image_url, 
    })

  }

  return (
    <section className='product-details-container'>
      <div className="p-card">
      {selectedProduct.length > 0 ? 
        (<ProductImage product={product} />
          )
          : ( <h3>No image provided!</h3>) 
        } 
      </div>
      <section className="product-info">
        <div className="p-title">
          {product.product_name}
        </div>
        <div className="p-description">
          {product.product_description}
        </div>
        <div className="p-price">
          {product.price}
        </div>
      </section>
      <div className="payment-card">
        <button>Buy now!</button>
        <button onClick={handleCart}>Add to cart</button>
      </div>
    </section>
  )
}