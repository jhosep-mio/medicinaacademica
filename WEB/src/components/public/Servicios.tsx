
import { useEffect, useState } from 'react'
import { getData } from '../shared/FechData'
import Loading from '../shared/Loading'
import { type serviciosValues } from '../shared/Interfaces'
import { Global } from '../../helper/Global'
import { Link } from 'react-router-dom'

const Servicios = (): JSX.Element => {
  const [loadingComponents, setLoadingComponents] = useState(false)
  const [servicios, setServicios] = useState([])

  useEffect(() => {
    setLoadingComponents(true)
    window.scrollTo(0, 0)
    Promise.all([
      getData('allServicios', setServicios)
    ]).then(() => {
      setLoadingComponents(false)
    })
    setLoadingComponents(false)
  }, [])

  return (
    <>
        {loadingComponents && <Loading/>}
        {/* <section className="sect_bannerprin">
            <div className="bg_servicios">
                <img src={fondo} width="100%" />
                <div className="btn_b">
                    <h1>Nuestros servicios</h1>
                    <span>Comprometidos con la medicina, educación e investigación de calidad.</span>
                </div>
                <div className="btn_secciones">
                    <ul>
                        <li ><a><PiBookOpenTextLight/>Estudios observacionales</a></li>
                        <li ><a><PiBookOpenTextLight/>Ensayos clínicos</a></li>
                        <li ><a><PiBookOpenTextLight/>Revisiones sistemáticas</a></li>
                        <li ><a><PiBookOpenTextLight/>Análisis bioestadístico</a></li>
                        <li ><a><PiBookOpenTextLight/>Asesoría de tesis</a></li>

                    </ul>
                </div>
            </div>
        </section> */}

        <div className="main_servicios pt-16">
            {servicios.map((servicio: serviciosValues) => (
                <section className="sect_funcionamiento mb-20" key={servicio.id} id={`${servicio.id}`}>
                    <div className="sect_width">
                        <div className="container cont_func">
                            <div className="row flex serv_flex">
                                <div className="col-md-5 mt-7">
                                    <div className="funciona_img">
                                        <img src={`${Global.urlImages}/servicios/${servicio.imagen1}`} />
                                    </div>
                                </div>

                                <div className="col-md-7 mt-10">
                                    <div className="funciona_descrip">
                                        <div className="head_cont">
                                            <h2>{servicio.nombre}</h2>
                                            <ul className="boton_radius">
                                                <li><span className="btn1"></span></li>
                                                <li><span className="btn2"></span></li>
                                                <li><span className="btn3"></span></li>
                                            </ul>
                                        </div>

                                        <div className="body_cont">
                                            <div className="" dangerouslySetInnerHTML={{ __html: servicio.caracteristicas }} ></div>
                                            <Link to={`/viewservicio/${servicio.id}`} className='btn_servicio'>Ver más</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            ))}

        </div>

    </>
  )
}

export default Servicios
