import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getData } from '../shared/FechData'
import { type productosValues } from '../shared/Interfaces'
import { Global } from '../../helper/Global'
import { AddProducto } from '../shared/carrito/AddProducto'
import { Rating, Stack } from '@mui/material'

const Search = (): JSX.Element => {
  const { query } = useParams()
  const [searchResults, setSearchResults] = useState([])
  useEffect(() => {
    window.scrollTo(0, 0)
    Promise.all([getData(`buscarProducto/${query ?? ''}`, setSearchResults)]).then(
      () => {}
    )
  }, [])
  return (
    <>
      <section className="searchR min-h-[500px]">
        {searchResults.length > 1
          ? (
          <p>
            Se encontraron <span>{searchResults.length}</span> productos
          </p>
            )
          : (
          <p>
            Se encontró <span>{searchResults.length}</span> producto
          </p>
            )}
        <div className="searchR__main">
          {searchResults.map((producto: productosValues) => (
            <div className="searchR__main__item" key={producto.id}>
              <Link to={`/view/${producto.id}`}>
                <div className="cardProducto">
                  <div className="cardProducto__img">
                    <img
                      src={`${Global.urlImages}/productos/${producto.imagen1}`}
                      alt=""
                    />
                  </div>
                  <div className="cardProducto__content">
                    <h5>{producto.nombre}</h5>
                    <p>{producto.profesor}</p>
                    {(() => {
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-expect-error
                      if (JSON.parse(producto.comentariosfinales)) {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        const mediaClase = (JSON.parse(producto.comentariosfinales)).reduce((acumulador: number, comentario: any) => acumulador + Number(comentario.clase), 0) / JSON.parse(producto.comentariosfinales).length
                        console.log(mediaClase)
                        return (
                        <Stack spacing={1} className="estrellas2">
                            <Rating name="size-large" defaultValue={mediaClase} size="large" readOnly />
                        </Stack>
                        )
                      }
                      return null // or any other fallback you prefer
                    })()}
                    <div className="cardProducto__content__precio">
                      <div className="cardProducto__content__precio__item">
                        <span className="preciOferta">
                          S/. {producto.precio2}
                        </span>
                        <span>S/. {producto.precio1}</span>
                      </div>
                      <div className="cardProducto__content__precio__item">
                        <AddProducto
                          producto={producto}
                          contador={1}
                          precioFinal={producto.precio2}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

export default Search
