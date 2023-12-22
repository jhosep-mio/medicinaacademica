import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import { Autoplay, Pagination } from 'swiper'
import { slide1, slide2 } from '../images'
import { Link } from 'react-router-dom'

export const SwiperHome = (): JSX.Element => {
  return (
    <section className="h-[500px] lg:h-[744.8px]">
      <Swiper
        pagination={{
          clickable: true
        }}
        modules={[Pagination, Autoplay]}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false
        }}
        loop
        className="h-full w-full swiper_home"
      >
        <SwiperSlide className="w-full h-full relative">
          <div className="w-full h-full relative before:absolute before:bg-black/60 before:inset-0 before:w-full before:h-full">
            <img src={slide1} alt="" className="w-full h-full object-cover " />
          </div>
          <div className="absolute inset-0 z-20 w-full h-full flex items-center justify-center flex-col gap-10 px-4 md:px-0">
            <h2 className="text-white font-extrabold text-5xl text-center lg:text-[5rem]">
              Una nueva era de la educación en salud
            </h2>
            <p className="text-2xl lg:text-[20px] text-gray-200 text-center lg:my-10">
              Amplía tus conocimientos, adquiere nuevas habilidades y avanza en
              tu carrera profesional. <br />
              Con expertos en la materia, contenido actualizado.
            </p>
            <div className="flex relative p-10 justify-center gap-10 z-0 flex-col md:flex-row">
              <Link to="/formacionacademica" className='text-white hover:text-gray-300 transition-colors bg-[#0f5fa6] text-2xl md:text-3xl text-center p-4 lg:p-6 rounded-xl'>Ver oferta académica</Link>
              <Link to="/viewservicio/17" className='text-white hover:text-gray-300 transition-colors bg-[#6f92bf] text-2xl md:text-3xl text-center p-4 lg:p-6 rounded-xl'>Solicitar un asesor</Link>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide className="w-full h-full relative">
          <div className="w-full h-full relative before:absolute before:bg-black/60 before:inset-0 before:w-full before:h-full">
            <img src={slide2} alt="" className="w-full h-full object-cover " />
          </div>
          <div className="absolute inset-0 z-20 w-full h-full flex items-center justify-center flex-col gap-10 px-4 md:px-0">
            <h2 className="text-white font-extrabold text-5xl text-center lg:text-[5rem]">
              Una nueva era de la educación en salud
            </h2>
            <p className="text-2xl lg:text-[20px] text-gray-200 text-center lg:my-10">
              Amplía tus conocimientos, adquiere nuevas habilidades y avanza en
              tu carrera profesional. <br />
              Con expertos en la materia, contenido actualizado.
            </p>
            <div className="flex relative p-10 justify-center gap-10 z-0 flex-col md:flex-row">
              <Link to="/formacionacademica" className='text-white hover:text-gray-300 transition-colors bg-[#0f5fa6] text-2xl md:text-3xl text-center p-4 lg:p-6 rounded-xl'>Ver oferta académica</Link>
              <Link to="/viewservicio/17" className='text-white hover:text-gray-300 transition-colors bg-[#6f92bf] text-2xl md:text-3xl text-center p-4 lg:p-6 rounded-xl'>Solicitar un asesor</Link>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide className="w-full h-full relative">
          <div className="w-full h-full relative before:absolute before:bg-black/60 before:inset-0 before:w-full before:h-full">
            <img src={slide1} alt="" className="w-full h-full object-cover " />
          </div>
          <div className="absolute inset-0 z-20 w-full h-full flex items-center justify-center flex-col gap-10 px-4 md:px-0">
            <h2 className="text-white font-extrabold text-5xl text-center lg:text-[5rem]">
              Una nueva era de la educación en salud
            </h2>
            <p className="text-2xl lg:text-[20px] text-gray-200 text-center lg:my-10">
              Amplía tus conocimientos, adquiere nuevas habilidades y avanza en
              tu carrera profesional. <br />
              Con expertos en la materia, contenido actualizado.
            </p>
            <div className="flex relative p-10 justify-center gap-10 z-0 flex-col md:flex-row">
              <Link to="/formacionacademica" className='text-white hover:text-gray-300 transition-colors bg-[#0f5fa6] text-2xl md:text-3xl text-center p-4 lg:p-6 rounded-xl'>Ver oferta académica</Link>
              <Link to="/viewservicio/17" className='text-white hover:text-gray-300 transition-colors bg-[#6f92bf] text-2xl md:text-3xl text-center p-4 lg:p-6 rounded-xl'>Solicitar un asesor</Link>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide className="w-full h-full relative">
          <div className="w-full h-full relative before:absolute before:bg-black/60 before:inset-0 before:w-full before:h-full">
            <img src={slide2} alt="" className="w-full h-full object-cover " />
          </div>
          <div className="absolute inset-0 z-20 w-full h-full flex items-center justify-center flex-col gap-10 px-4 md:px-0">
            <h2 className="text-white font-extrabold text-5xl text-center lg:text-[5rem]">
              Una nueva era de la educación en salud
            </h2>
            <p className="text-2xl lg:text-[20px] text-gray-200 text-center lg:my-10">
              Amplía tus conocimientos, adquiere nuevas habilidades y avanza en
              tu carrera profesional. <br />
              Con expertos en la materia, contenido actualizado.
            </p>
            <div className="flex relative p-10 justify-center gap-10 z-0 flex-col md:flex-row">
              <Link to="/formacionacademica" className='text-white hover:text-gray-300 transition-colors bg-[#0f5fa6] text-2xl md:text-3xl text-center p-4 lg:p-6 rounded-xl'>Ver oferta académica</Link>
              <Link to="/viewservicio/17" className='text-white hover:text-gray-300 transition-colors bg-[#6f92bf] text-2xl md:text-3xl text-center p-4 lg:p-6 rounded-xl'>Solicitar un asesor</Link>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </section>
  )
}
