import './main.css'
import { images } from "../../utils/images"
import { Link } from "react-router-dom"

export const Main = () => {
  return (
    <main className='main-page'>
      {images.map((image, index)=>(
        <Link key={index} to={`/search?q=${image.alt}`}>
          <section className='main-card-wrapper'>
            <h4 className='main-image-desc'>{image.desc}</h4>
            <img className='main-card-image' src={image.src} alt={image.alt} /> 
          </section>
        </Link>
      ))}
    </main>
  )
} 