import { images } from "../../utils/images"
import { Link } from "react-router-dom"
import { MainSlider } from "../MainSlider/MainSlider"
import { CustomNextArrow, CustomPrevArrow } from "../CustomArrows/CustomArrows"
import { useRef } from "react"
import Slider from "react-slick"
import Footer from "../Footer/Footer"
import './main.css'

export const Main = () => {

  const sliderRef = useRef<Slider>(null)

  const handleNextSlide = () => {
    if(sliderRef.current){
      sliderRef.current.slickNext()
    }
  }

  const handlePrevSlide = () => {
    if(sliderRef.current){
      sliderRef.current.slickPrev()
    }
  }

  return (
    <main className='main-page'>
      <section aria-labelledby="main-slider" className='main-slider-section'>
        <MainSlider sliderRef={sliderRef}/>
        <CustomNextArrow onClick={handleNextSlide}/>
        <CustomPrevArrow onClick={handlePrevSlide} />
      </section>
      <section 
      aria-labelledby="product-grid-section" className="main-card-section"
      >
        <ul className="main-card-list">
          {images.map((image, index)=>(
            <li key={index} className='main-card-list-item'>
              <Link to={`/search?q=${image.alt}`} className="main-card-link">
                <article className='main-card-container'>
                  <h4 className='main-image-desc'>{image.desc}</h4>
                  <img className='main-card-image' src={image.src} alt={image.alt} /> 
                </article>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <Footer companyName="EShop" year={2025}/>
      </section>
    </main>
  )
} 