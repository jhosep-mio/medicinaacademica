import React, { useState, useEffect } from 'react'
import { useSpring, animated } from 'react-spring'
import styled from 'styled-components'

import { slide1, slide2 } from './images'
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs'
import { Link } from 'react-router-dom'

interface SlideProps {
  text: string
  offset: number
  backgroundImage: string
}

const SlideContainer = styled(animated.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;
  color: white;
  will-change: opacity, transform; /* Optimización para mejorar el rendimiento de animación */
  z-index: 1;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5); /* Puedes ajustar el color y la opacidad */
    z-index: 1; /* Asegura que ::before esté delante del contenido del contenedor */
  }
`

const SlideText = styled.p`
  font-size: 20px; /* Puedes ajustar el tamaño del texto según tus preferencias */
  margin-top: 20px; /* Puedes ajustar el margen superior según tus preferencias */
`

const SlideContent = styled.div`
  text-align: center;
  position: relative;
  z-index: 90;

  h1{
    font-size: 54px;
    font-weight: 800;
    font-family: 'Josefin Sans', sans-serif;
    color: #fff;
  }

`

const SlideShowContainer = styled.div`
  position: relative;
  width: 100%;
  height: 80vh;
  overflow: hidden;
`

const SlideButton = styled.button`
  background-color: #094173;
  color: white;
  border: none;
  padding: 20px;
  cursor: pointer;
  font-size: 34px;
  border-radius: 50%;
  position: absolute;
  height: 80px;
  top: 0;
  bottom: 0;
  z-index: 2;
  margin: auto 0;

  &:nth-child(1){
    left: 20px;
  }

  &:nth-child(2){
    right: 20px;
  }
`

const Slide: React.FC<SlideProps> = ({ text, offset, backgroundImage }) => {
  const isActive = offset === 0

  const mosaicProps = useSpring({
    opacity: isActive ? 1 : 0,
    transform: `perspective(800px) rotateY(${isActive ? 0 : offset * 20}deg) translate3d(0, 0, ${isActive ? 0 : offset * 10}px)`,
    config: { mass: 1, tension: 180, friction: 20 }
  })

  const containerStyle = {
    backgroundImage: `url(${backgroundImage})`
  }

  return (
    <SlideContainer style={{ ...mosaicProps, ...containerStyle }}>
      <animated.div>
        <SlideContent>
          <>
            <h1>{text}</h1>
            <SlideText>Amplía tus conocimientos, adquiere nuevas habilidades y avanza en tu carrera profesional. <br/>Con expertos en la materia, contenido actualizado.</SlideText>

            <div className="enlaces2">
              <Link to="/formacionacademica" >Ver oferta académica</Link>
              <Link to="/servicios">Solicitar un asesor</Link>

            </div>

          </>
        </SlideContent>
      </animated.div>
    </SlideContainer>
  )
}

const SlideShow: React.FC = () => {
  const slides = [
    { text: 'Una nueva era de la educación', backgroundImage: `${slide1}` },
    { text: 'Una nueva era de la educación', backgroundImage: `${slide2}` }
  ]

  const [currentSlide, setCurrentSlide] = useState(0)
  const goToPreviousSlide = (): void => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length)
  }

  const goToNextSlide = (): void => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length)
  }

  useEffect(() => {
    const autoplayInterval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length)
    }, 8000)

    return () => { clearInterval(autoplayInterval) }
  }, [])

  return (
    <SlideShowContainer>
        <SlideButton onClick={goToPreviousSlide}><BsChevronLeft/></SlideButton>
        <SlideButton onClick={goToNextSlide}><BsChevronRight/></SlideButton>
      {slides.map((slide, index) => (
        <Slide
          key={index}
          text={slide.text}
          offset={index - currentSlide}
          backgroundImage={slide.backgroundImage}
        />
      ))}
    </SlideShowContainer>
  )
}

export default SlideShow
