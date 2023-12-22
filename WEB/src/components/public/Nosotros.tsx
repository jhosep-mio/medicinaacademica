import { Link } from 'react-router-dom'
import v1 from '../../assets/iconos/valor1.png'
import v2 from '../../assets/iconos/valor2.png'
import v3 from '../../assets/iconos/valor3.png'
import v4 from '../../assets/iconos/valor4.png'
import v5 from '../../assets/iconos/valor5.png'
import nosotros from '../../assets/cursos/medicos.png'
import { useEffect } from 'react'

const Nosotros = (): JSX.Element => {
  useEffect(() => {
    window.scrollTo(0, 0)
  })

  return (
    <>
      <section className="sect_Us paddtop">
        <div className="container">
          <div className="row rowflex">
            <div className="col-md-6">
              <div className="title_Us">
                <h1>Bienvenidos a Medicina Académica</h1>
              </div>
            </div>

            <div className="col-md-6 mt-10 lg:mt-0">
              <div className="descrip_Us">
                <p>
                  Somos Profesionales de la salud comprometidos con la medicina,
                  educación e investigación de calidad.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="our">
        <div className="row">
          <div className="col-md-12 back_us bg-secondary-100 ">
            <div className="row flex items-center justify-center flex-col-reverse lg:flex-row">
              <div className="col-md-6 ">
                <img src={nosotros} />
              </div>
              <div className="col-md-6 col-md-6 h-full py-10 lg:py-10">
                <h6 className='font-bold text-white text-6xl text-center lg:text-left'>Nuestro proposito </h6>
                <h1 className=''>
                  Ayudar a investigadores a desarrollar
                  investigaciones de alto impacto bajo los estándares éticos.
                </h1>
                <Link to="/contacto" className="btn_contact text-3xl">
                  Contáctanos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="valores py-10 px-8 lg:py-[50px] lg:px-[50px]">
        <div className="valores__title">
          <h2>Nuestros valores</h2>
        </div>
        <div className="valores__main">
          <div className="valores__main__item">
            <span>
              <img src={v1} alt="" />
            </span>
            <h5>Transparencia</h5>
          </div>
          <div className="valores__main__item">
            <span>
              <img src={v2} alt="" />
            </span>
            <h5>Calidad</h5>
          </div>
          <div className="valores__main__item">
            <span>
              <img src={v3} alt="" />
            </span>
            <h5>Rigurosidad</h5>
          </div>
          <div className="valores__main__item">
            <span>
              <img src={v4} alt="" />
            </span>
            <h5>Ética</h5>
          </div>
          <div className="valores__main__item">
            <span>
              <img src={v5} alt="" />
            </span>
            <h5>Compromiso</h5>
          </div>
        </div>
      </div>

      <section className="sect_values">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="box_value">
                <div className="icon-box">
                  <i className="fa fa-handshake-o" aria-hidden="true"></i>
                </div>
                <h3>Misión</h3>
                <p>
                  Proporcionar educación y asesoramiento de alta calidad en
                  investigación biomédica a través de programas de capacitación
                  y consultoría especializada, con el objetivo de mejorar la
                  eficacia de la investigación y el avance de la medicina.
                </p>
              </div>
            </div>

            <div className="col-md-6">
              <div className="box_value">
                <div className="icon-box">
                  <i className="fa fa-users" aria-hidden="true"></i>
                </div>
                <h3>Visión</h3>
                <p>
                  Nuestra visión es ser reconocidos como líderes en la educación
                  y asesoramiento en investigación biomédica, contribuyendo al
                  desarrollo y aplicación de nuevos conocimientos y avances en
                  la medicina para mejorar la salud de la población.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Nosotros
