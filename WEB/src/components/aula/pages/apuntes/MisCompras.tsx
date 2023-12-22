import useAuth from '../../../../hooks/useAuth'
import { NavBarLeft } from '../clases/navbar/NavBarLeft'
import { MenuPerfill } from '../clases/navbar/MenuPerfill'
import { Header } from '../../../public/estructura/Header'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Global } from '../../../../helper/Global'
import { type valuesTransaccion } from '../../../shared/Interfaces'
import { Link } from 'react-router-dom'

export const MisCompras = (): JSX.Element => {
  const { auth } = useAuth()
  const [open, setOpen] = useState(false)
  const tokenUser = localStorage.getItem('tokenUser')
  const [transacciones, setTransacciones] = useState<valuesTransaccion[]>([])

  const getValidacion = async (): Promise<void> => {
    const request = await axios.get(
      `${Global.url}/cursesToCompras2/${auth.id ?? ''}`,
      {
        headers: {
          Authorization: `Bearer ${
            tokenUser !== null && tokenUser !== '' ? `Bearer ${tokenUser}` : ''
          }`
        }
      }
    )
    setTransacciones(request.data)
  }

  useEffect(() => {
    if (auth.id) {
      getValidacion()
    }
  }, [auth.id])

  return (
    <>
      <NavBarLeft open={open} />
      <div className="md:hidden">
        <Header />
      </div>
      <MenuPerfill />
      <section className="bg-primary py-20  font_baloo lg:pl-[280px] min-h-screen">
        <div className="w-full max-w-[1450px] px-6 lg:px-20 mx-auto">
          <section className="flex flex-col gap-10 mb-20">
            <h1 className="text-white font-semibold text-5xl w-full text-center">
              MIS COMPRAS
            </h1>
          </section>
        </div>
        <section className="w-[80%] mx-auto ">
          <div className="bg-[#1e315b95] p-8 rounded-xl">
            <div className="hidden md:grid grid-cols-1 md:grid-cols-5 gap-4 mb-10 p-4 text-2xl">
              <h5 className="md:text-center">ID</h5>
              <h5 className="md:text-center">Cliente</h5>
              <h5 className="md:text-center">Id Transacción</h5>
              <h5 className="md:text-center">Estado</h5>
              <h5 className="md:text-center">Factura</h5>
            </div>
            {transacciones
              .filter((pro) => pro.estado == 1)
              .map((pro: valuesTransaccion) => (
                <div
                  className={`grid grid-cols-1 md:grid-cols-5 gap-4 items-center mb-4 ${
                    pro.status == 'approved' || pro.status == 'Por confirmar'
                      ? 'bg-[#283b665f]'
                      : 'bg-red-500'
                  } p-4 rounded-xl`}
                  key={pro.id}
                >
                  <div className="md:text-center">
                    <h5 className="md:hidden text-white font-bold mb-2">ID</h5>
                    <span>#{pro.id}</span>
                  </div>
                  <div className="md:text-center">
                    <h5 className="md:hidden text-white font-bold mb-2">
                      Cliente
                    </h5>
                    <span>
                      {pro.nombres} {pro.apellidos}
                    </span>
                  </div>

                  <div className="md:text-center">
                    <h5 className="md:hidden text-white font-bold mb-2">
                      Id Transacción
                    </h5>
                    <span className="line-clamp-1">{pro.id_transaccion}</span>
                  </div>
                  {pro.status == 'approved' || pro.status == 'Por confirmar'
                    ? (
                    <div className="md:text-center">
                      <h5 className="md:hidden text-white font-bold mb-2">
                        Estado
                      </h5>
                      {pro.estado == 0
                        ? (
                        <span className="bg-green-500 py-2 px-3 text-black  rounded-md">
                          PENDIENTE
                        </span>
                          )
                        : pro.estado == 3
                          ? (
                        <span className="bg-main py-2 px-3 text-white  rounded-md">
                          POR REVISAR
                        </span>
                            )
                          : pro.estado == 1
                            ? (
                        <span className="bg-red-500 py-2 px-3 text-white  rounded-md">
                          TERMINADO
                        </span>
                              )
                            : (
                                ''
                              )}
                    </div>
                      )
                    : (
                    <div className="md:text-center">
                      <h5 className="md:hidden text-white font-bold mb-2">
                        Estado
                      </h5>
                      <span className="bg-yellow-300 py-2 px-3 text-black  rounded-md">
                        RECHAZADO
                      </span>
                    </div>
                      )}
                  {pro.factura &&
                  <div className="md:text-center">
                    <h5 className="md:hidden text-white font-bold mb-2">
                      Factura
                    </h5>
                    <Link to={`${Global.urlImages}/facturas/${pro.factura}`} target='_blank' className="line-clamp-1 bg-green-600 text-white px-4 py-2 w-fit mx-auto rounded-xl">VER FACTURA</Link>
                  </div>
                  }
                </div>
              ))}
          </div>
        </section>
      </section>

      <button
        id=""
        className="fixed right-6 bottom-6 rounded-full bg-white w-16 h-16 z-20 md:hidden"
        onClick={() => {
          setOpen(!open)
        }}
      >
        <span className="fa fa-bars text-primary text-[2.4rem] "></span>
      </button>
    </>
  )
}
