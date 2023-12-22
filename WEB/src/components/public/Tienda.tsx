import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getData } from '../shared/FechData'
import {
  type categoriasValues,
  type productosValues
} from '../shared/Interfaces'
import Loading from '../shared/Loading'
import { CursoCard } from './cards/CursoCard'

const Tienda = (): JSX.Element => {
  const [loadingComponents, setLoadingComponents] = useState(false)
  const [, setMarcas] = useState([])
  const [categorias, setCategorias] = useState([])
  const [productos, setProductos] = useState([])
  const [productosFiltrados, setProductosFiltrados] = useState([])
  const [, setBannerProductos] = useState([])
  const navigate = useNavigate()

  const [categoriaFiltro, setCategoriaFiltro] = useState<string | null>(null)
  const [nivelFiltro, setNivelFiltro] = useState<string | null>(null)
  const [enVivoFiltro, setEnVivoFiltro] = useState<string | null>(null)

  useEffect(() => {
    setLoadingComponents(true)
    window.scrollTo(0, 0)
    Promise.all([
      getData('getMarcas', setMarcas),
      getData('allCategorias', setCategorias),
      getData('allProductos', setProductos),
      getData('allProductos', setProductosFiltrados),
      getData('allBannerProductos', setBannerProductos)
    ]).then(() => {
      setLoadingComponents(false)
    })
  }, [])

  const filterProductos = (id: number): void => {
    setCategoriaFiltro(id.toString())
  }

  const filterProductosNiveles = (nivel: string): void => {
    if (nivel == 'totoslosniveles') {
      setNivelFiltro(null)
    } else {
      setNivelFiltro(nivel)
    }
  }

  const filterProductosEnvivo = (nivel: string): void => {
    if (nivel == 'todos') {
      setEnVivoFiltro(null)
    } else {
      setEnVivoFiltro(nivel)
    }
  }

  useEffect(() => {
    // Filtrar productos cuando cambian los filtros
    let productosFiltrados = [...productos]

    // Aplicar filtros según el estado de los filtros
    if (categoriaFiltro) {
      productosFiltrados = productosFiltrados.filter(
        (producto: productosValues) => producto.id_categoria === categoriaFiltro
      )
    }
    if (nivelFiltro) {
      productosFiltrados = productosFiltrados.filter(
        (producto: productosValues) => producto.nivel == nivelFiltro
      )
    }
    if (enVivoFiltro) {
      productosFiltrados = productosFiltrados.filter(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        (producto: productosValues) => producto.envivo == enVivoFiltro
      )
    }

    setProductosFiltrados(productosFiltrados)
  }, [categoriaFiltro, nivelFiltro, productos, enVivoFiltro])

  return (
    <>
      {loadingComponents && <Loading />}
      <section className="slide-tienda">
        <div className="row">
          <div className="col-lg-12">
            <div className="main-tienda">
              <div className="swiper-tienda flex items-center" >
                  <div className="content-slidet">
                    <div className="info-slidet">
                      <div className="title-slidet">
                        <h2 className=''>Oferta Académica</h2>
                      </div>
                      <div className="descripcion-slidet">
                        {/* <div className="" dangerouslySetInnerHTML={{ __html: banner.caracteristicas }} ></div> */}
                        <p>
                          “Desarrolla tus habilidades en medicina e
                          investigación”{' '}
                        </p>
                      </div>
                      <div className="btn-comprar">
                        <a href="#productos" className="button2">
                          Comprar ahora
                        </a>
                      </div>
                    </div>

                  </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section-tienda" id="productos">
        <div className="row">
          <div className="col-lg-3">
            <aside className="filtros">
              <div className="seccion" id="otros">
                <div className="title-seccion">
                  <h4>Otras categorías</h4>
                </div>
                <div className="content-seccion">
                  <ul>
                    <div className="radio-input-wrapper">
                    <label
                        className="label"
                        onClick={() => {
                          setCategoriaFiltro(null)
                        }}
                      >
                        <input
                          value="value-1"
                          name="categorias"
                          id="value-1"
                          className="radio-input"
                          type="radio"
                          checked={categoriaFiltro == null}
                        />
                        <div className="radio-design"></div>
                        <div className="label-text">Todos las categorias</div>
                      </label>
                      {categorias.map((categoria: categoriasValues) => (
                        <label
                          key={categoria.id}
                          className="label"
                          onClick={() => {
                            filterProductos(categoria.id)
                          }}
                        >
                          <input
                            value={`value-${categoria.id}`}
                            name="categorias"
                            id={`value-${categoria.id}`}
                            className="radio-input"
                            checked={categoria.id == Number(categoriaFiltro)}
                            type="radio"
                          />
                          <div className="radio-design"></div>
                          <p className="label-text">{categoria.nombre}</p>
                        </label>
                      ))}
                    </div>
                  </ul>
                </div>
              </div>

              <div className="seccion" id="otros">
                <div className="title-seccion">
                  <h4>Nivel</h4>
                </div>
                <div className="content-seccion">
                  <ul>
                    <div className="radio-input-wrapper">
                      <label
                        className="label"
                        onClick={() => {
                          filterProductosNiveles('totoslosniveles')
                        }}
                      >
                        <input
                          value="value-1"
                          name="niveles"
                          id="value-1"
                          className="radio-input"
                          type="radio"
                          checked={nivelFiltro == null}
                        />
                        <div className="radio-design"></div>
                        <div className="label-text">Todos los niveles</div>
                      </label>
                      <label
                        className="label"
                        onClick={() => {
                          filterProductosNiveles('Introductorio')
                        }}
                      >
                        <input
                          value="value-1"
                          name="niveles"
                          id="value-1"
                          className="radio-input"
                          type="radio"
                          checked={nivelFiltro == 'Introductorio'}
                        />
                        <div className="radio-design"></div>
                        <div className="label-text">Introductorio</div>
                      </label>
                      <label
                        className="label"
                        onClick={() => {
                          filterProductosNiveles('Moderado')
                        }}
                      >
                        <input
                          value="value-2"
                          name="niveles"
                          id="value-2"
                          className="radio-input"
                          checked={nivelFiltro == 'Moderado'}
                          type="radio"
                        />
                        <div className="radio-design"></div>
                        <div className="label-text">Moderado</div>
                      </label>
                      <label
                        className="label"
                        onClick={() => {
                          filterProductosNiveles('Avanzado')
                        }}
                      >
                        <input
                          value="value-3"
                          name="niveles"
                          id="value-3"
                          className="radio-input"
                          checked={nivelFiltro == 'Avanzado'}
                          type="radio"
                        />
                        <div className="radio-design"></div>
                        <div className="label-text">Avanzado</div>
                      </label>
                    </div>
                  </ul>
                </div>
              </div>

              <div className="seccion" id="otros">
                <div className="title-seccion">
                  <h4>En vivo</h4>
                </div>
                <div className="content-seccion">
                  <ul>
                    <div className="radio-input-wrapper">
                      <label
                        className="label"
                        onClick={() => {
                          filterProductosEnvivo('todos')
                        }}
                      >
                        <input
                          value="value-1"
                          name="vivo"
                          id="value-1"
                          className="radio-input"
                          type="radio"
                          checked={nivelFiltro == null}
                        />
                        <div className="radio-design"></div>
                        <div className="label-text">Todos</div>
                      </label>
                      <label
                        className="label"
                        onClick={() => {
                          filterProductosEnvivo('1')
                        }}
                      >
                        <input
                          value="value-1"
                          name="vivo"
                          id="value-1"
                          className="radio-input"
                          type="radio"
                          checked={enVivoFiltro == '1'}
                        />
                        <div className="radio-design"></div>
                        <div className="label-text">Si</div>
                      </label>
                      <label
                        className="label"
                        onClick={() => {
                          filterProductosEnvivo('0')
                        }}
                      >
                        <input
                          value="value-2"
                          name="vivo"
                          id="value-2"
                          className="radio-input"
                          checked={enVivoFiltro == '0'}
                          type="radio"
                        />
                        <div className="radio-design"></div>
                        <div className="label-text">No</div>
                      </label>
                    </div>
                  </ul>
                </div>
              </div>

            </aside>
          </div>

          <div className="col-lg-9">
            <div className="productos__tienda">
              {productosFiltrados.length > 0
                ? (
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    productosFiltrados.filter((producto) => producto.semuestra == 0).map((producto: productosValues) => (
                  <div className="producto-tienda" key={producto.id}>
                    <div
                      onClick={() => {
                        navigate(`/view/${producto.id}`)
                      }}
                    >
                     <CursoCard producto={producto}/>
                    </div>
                  </div>
                    ))
                  )
                : (
                <p className="text-center text-3xl font-semibold">
                  No se encontraron productos
                </p>
                  )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Tienda
