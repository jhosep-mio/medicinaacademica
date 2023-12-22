import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/grid'
import 'swiper/css/free-mode'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

import {
  FaHandHoldingMedical,
  FaUserDoctor,
  FaArrowUpFromBracket,
  FaGlobe,
  FaUserNurse
} from 'react-icons/fa6'
import {
  BsBook,
  BsChatText,
  BsNewspaper,
  BsPeople,
  BsPersonUp,
  BsPersonVideo3
} from 'react-icons/bs'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getData } from '../shared/FechData'
import Loading from '../shared/Loading'
import {
  type productosValues,
  type testimoniosValues
} from '../shared/Interfaces'
import { Global } from '../../helper/Global'
import { SwiperHome } from '../shared/home/SwiperHome'
import { CursoCard } from './cards/CursoCard'

const Home = (): JSX.Element => {
  const [loadingComponents, setLoadingComponents] = useState(false)
  const [productos, setProductos] = useState([])
  const [testimonios, setTestimonios] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    setLoadingComponents(true)
    window.scrollTo(0, 0)
    Promise.all([
      getData('allProductos', setProductos),
      getData('allTestimonios', setTestimonios)
    ]).then(() => {
      setLoadingComponents(false)
    })
    setLoadingComponents(false)
  }, [])

  return (
    <>
      {loadingComponents && <Loading />}
      <SwiperHome/>
      <section className="atributos">
        <div className="atributos__main">
          <div className="atributos__main__item py-8 px-6 lg:p-[50px]">
            <FaHandHoldingMedical className="svg1" />
            <h5 className="title1">Rigurosidad metodológica</h5>
            <span className="content2">
              <FaHandHoldingMedical className="svg2" />
              <h5 className="title2">Rigurosidad metodológica</h5>
            </span>
          </div>
          <div className="atributos__main__item py-8 px-6 lg:p-[50px]">
            <FaUserDoctor className="svg1" />
            <h5 className="title1">Expertos en el área</h5>
            <span className="content2">
              <FaUserDoctor className="svg2" />
              <h5 className="title2">Expertos en el área</h5>
            </span>
          </div>
          <div className="atributos__main__item py-8 px-6 lg:p-[50px]">
            <FaArrowUpFromBracket className="svg1" />
            <h5 className="title1">Actualización de por vida</h5>
            <span className="content2">
              <FaArrowUpFromBracket className="svg2" />
              <h5 className="title2">Actualización de por vida</h5>
            </span>
          </div>
          <div className="atributos__main__item py-8 px-6 lg:p-[50px]">
            <FaGlobe className="svg1" />
            <h5 className="title1">Acceso global</h5>
            <span className="content2">
              <FaGlobe className="svg2" />
              <h5 className="title2">Acceso global</h5>
            </span>
          </div>
          <div className="atributos__main__item py-8 px-6 lg:p-[50px]">
            <FaUserNurse className="svg1" />
            <h5 className="title1">Más de 500 estudiantes</h5>
            <span className="content2">
              <FaUserNurse className="svg2" />
              <h5 className="title2">Más de 500 estudiantes</h5>
            </span>
          </div>
        </div>
      </section>

      <section className="frase">
        <h2>Una plataforma hecha por y para profesionales de la salud</h2>
      </section>

      <section className="sect_bestseller bg-gray-100">
        <div className="title_bestseller">
          <h1 className='font-bold'>Oferta académica</h1>
          <Link to="/formacionacademica">Ver oferta académica</Link>
        </div>
      </section>

      <section className="sect_productos bg-gray-100">
        <div className="row">
          <div className="col-md-12">
            <Swiper
              className="list_products bg-transparent"
              slidesPerView={3}
              spaceBetween={30}
              breakpoints={{
                0: {
                  slidesPerView: 1,
                  spaceBetween: 20
                },
                640: {
                  slidesPerView: 1,
                  spaceBetween: 20
                },
                768: {
                  slidesPerView: 1
                },
                1024: {
                  slidesPerView: 2
                },

                1200: {
                  slidesPerView: 3
                }
              }}
            >
              { // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
              productos.filter((producto) => producto.semuestra == 0).map((producto: productosValues) => (
                <SwiperSlide
                  key={producto.id}
                  onClick={() => {
                    navigate(`/view/${producto.id}`)
                  }}
                >
                  <CursoCard producto={producto}/>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

       <section className="resenas pt-12 bg-gray-100">
        <div className="resenas__title">
          <h2 className='font-bold'>Algunas reseñas</h2>
        </div>
        <div className="resenas__main">
          <Swiper
            slidesPerView={4}
            loop={true}
            spaceBetween={30}
            className="swp_testimonios"
            draggable={false}
            breakpoints={{
              0: {
                slidesPerView: 1,
                spaceBetween: 20
              },
              640: {
                slidesPerView: 2,
                spaceBetween: 20
              },
              768: {
                slidesPerView: 3
              },
              1024: {
                slidesPerView: 4
              }
            }}
          >
            {testimonios.map((testimonio: testimoniosValues) =>
              testimonio.tipoComentario == 'Facebook'
                ? (
                <SwiperSlide key={testimonio.id} className=''>
                  <div
                    className="cardResenas2 bg-transparent"
                    dangerouslySetInnerHTML={{ __html: testimonio.comentario }}
                  ></div>
                </SwiperSlide>
                  )
                : (
                    testimonio.tipoComentario == 'Aula' && (
                  <SwiperSlide key={testimonio.id} className=''>
                    <div className="cardResenas bg-white">
                      <div className="cardResenas__img">
                        <img
                          src={`${Global.urlImages}/testimonios/${testimonio.imagen1}`}
                          alt=""
                        />
                        <h5>{testimonio.nombre}</h5>
                      </div>
                      <div className="cardResenas__content">
                        <div
                          className=""
                          dangerouslySetInnerHTML={{
                            __html: testimonio.caracteristicas
                          }}
                        ></div>
                      </div>

                      <span>
                        <BsChatText />
                      </span>
                    </div>
                  </SwiperSlide>
                    )
                  )
            )}
          </Swiper>
        </div>
      </section>

      <section className="ayuda px-4 lg:px-[80px] lg:py-[60px] overflow-hidden gap-y-10 g:gap-y-[70px]">
        <div className="ayuda__title py-20 lg:py-0 lg:pb-24">
          <h2 className='text-5xl lg:text-7xl'>¿De qué otras formas podemos ayudarte?</h2>
        </div>
        <div className="ayuda__main grid grid-cols-2 lg:grid-cols-5">
          <div className="ayuda__main__item">
            <Link to="/formacionacademica">
              <div className="ayuda__main__item__icon">
                <BsPersonVideo3 />
              </div>
              <div className="ayuda__main__item__info">
                <h5>
                  Cursos <br /> en vivo
                </h5>
              </div>
            </Link>
          </div>
          <div className="ayuda__main__item">
            <Link to="/servicios">
              <div className="ayuda__main__item__icon">
                <BsBook />
              </div>
              <div className="ayuda__main__item__info">
                <h5>
                  Asesoría <br /> de tesis
                </h5>
              </div>
            </Link>
          </div>
          <div className="ayuda__main__item">
            <a
              href="https://chat.whatsapp.com/FPHaOIaHBBfG4oSSugbRsR"
              target="_blank"
              rel="noreferrer"
            >
              <div className="ayuda__main__item__icon">
                <BsPeople />
              </div>
              <div className="ayuda__main__item__info">
                <h5>
                  Únete a nuestra <br /> comunidad
                </h5>
              </div>
            </a>
          </div>
          <div className="ayuda__main__item">
            <Link to="/servicios">
              <div className="ayuda__main__item__icon">
                <BsPersonUp />
              </div>
              <div className="ayuda__main__item__info">
                <h5>
                  Asesoría <br />
                  profesional
                </h5>
              </div>
            </Link>
          </div>
          <div className="ayuda__main__item col-span-2 lg:col-span-1">
            <a href="#news">
              <div className="ayuda__main__item__icon">
                <BsNewspaper />
              </div>
              <div className="ayuda__main__item__info">
                <h5>Newsletter</h5>
              </div>
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home
