import Slider from "react-slick"
import React from "react"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import './main-slider.css'
import { Link } from "react-router-dom"

interface MainSliderProps {
  sliderRef: React.RefObject<Slider>
}

export const MainSlider = ({ sliderRef }: MainSliderProps) => {

  const settings = {
    infinite: true,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  }

  return (
    <div className="main-slider-container">
      <Slider ref={sliderRef} {...settings}>
        <div className="main-slider-img-container">
          <Link to={"/search?q=gaming"}>
            <img src="../../../src/assets/images/freegamingSlider.jpg" alt="slider img" />
          </Link>
        </div>
        <div className="main-slider-img-container">
          <img src="../../../src/assets/images/beautySlider.jpg" alt="Beauty Products" />
        </div>
        <div className="main-slider-img-container">
          <img src="../../../src/assets/images/freegamingSlider.jpg" alt="slider img 3 " />
        </div>
      </Slider>
    </div>
  )
}