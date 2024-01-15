import { useEffect, useState } from 'react'
import { Global } from '../../../helper/Global'
import { type productosValues } from '../../shared/Interfaces'
import { AddProducto } from '../../shared/carrito/AddProducto'
import axios from 'axios'
import { Rating, Stack } from '@mui/material'

export const CursoCard = ({
  producto
}: {
  producto: productosValues
}): JSX.Element => {
  const [data, setData] = useState({
    dolar: ''
  })
  const getData2 = async (): Promise<void> => {
    try {
      const request = await axios.get(`${Global.url}/oneConfi/1`)
      setData(request.data)
    } catch (error) {}
  }

  useEffect(() => {
    getData2()
  }, [])

  return (
    <div className="cardProducto relative min-h-[505px] max-h-[505px]">
      <div className="cardProducto__img">
        <img
          src={`${Global.urlImages}/productos/${producto.imagen1}`}
          alt=""
          className="w-full max-h-[295px]"
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
            return (
          <Stack spacing={1} className="estrellas2">
            <Rating name="size-large" defaultValue={mediaClase} size="large" readOnly />
          </Stack>
            )
          }
          return null // or any other fallback you prefer
        })()}

        <div className="lg:hidden mt-2">
          <span className="text-[1.7rem] relative text-black/70">
            Precio en dolares{' '}
            <span className="font-bold">
              $USD {(producto.precio2 / Number(data.dolar)).toFixed(1)}
            </span>
          </span>
        </div>

        <div className="cardProducto__content__precio">
          <div className="cardProducto__content__precio__item">
            <span className="preciOferta">S/. {producto.precio2}</span>
            {producto.precio1 && producto.precio1 > 0 && (
              <span>S/. {producto.precio1}</span>
            )}
            {/* <span className="text-xl">($. {producto.precio2})</span> */}
          </div>
          <div className="cardProducto__content__precio__item ">
            <AddProducto
              producto={producto}
              contador={1}
              precioFinal={producto.precio2}
            />
          </div>
        </div>
        <div className="hidden lg:block">
          <span className="text-[1.7rem] relative text-black/70">
            Precio en dolares{' '}
            <span className="font-bold">
              $USD {(producto.precio2 / Number(data.dolar)).toFixed(1)}
            </span>
          </span>
        </div>
      </div>
    </div>
  )
}
