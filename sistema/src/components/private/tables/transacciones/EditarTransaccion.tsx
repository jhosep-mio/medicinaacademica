import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import useAuth from '../../../../hooks/useAuth'
import axios from 'axios'
import { Global } from '../../../../helper/Global'
import Swal from 'sweetalert2'
import { Loading } from '../../../shared/Loading'
import { useFormik } from 'formik'
import { TitleBriefs } from '../../../shared/TitleBriefs'
// import { InputsBriefs } from '../../../shared/InputsBriefs'
import { Errors } from '../../../shared/Errors'
import { type valuesTransaccion } from '../../../shared/Interfaces'
import { SchemaTransacciones } from '../../../shared/Schemas'
import { InputsBriefsView } from '../../../shared/InputsBriefsView'
import { format } from 'date-fns'
import { PdfUpdate } from '../../../shared/PdfUpdate'
export const EditarTransaccion = (): JSX.Element => {
  const { id } = useParams()
  const token = localStorage.getItem('token')
  const navigate = useNavigate()
  const [imagen, setImagen] = useState('')
  const { setTitle, loadingComponents, setLoadingComponents } = useAuth()
  const [pdf, setPdf] = useState<File | null>(null)
  const handlePdfChange = (pdf: File | null): void => {
    // Puedes realizar cualquier lógica adicional aquí si es necesario
    setPdf(pdf)
  }
  useEffect(() => {
    setLoadingComponents(true)
    setTitle('Transsación')
    Promise.all([getTransacciones()]).then(() => {
      setLoadingComponents(false)
    })
  }, [])

  const updateTransaccion = async (
    values: valuesTransaccion
  ): Promise<void> => {
    setLoadingComponents(true)
    const token = localStorage.getItem('token')
    const data = new FormData()
    data.append('estado', String(values.estado))
    if (pdf != null) {
      data.append('factura', pdf)
    }
    data.append('_method', 'PUT')

    try {
      const respuesta = await axios.post(
        `${Global.url}/updateTransaccion/${id ?? ''}}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${
              token !== null && token !== '' ? token : ''
            }`
          }
        }
      )

      if (respuesta.data.status == 'success') {
        Swal.fire('Actualizado correctamente', '', 'success')
        navigate('/admin/transacciones')
      } else {
        Swal.fire('Error ', '', 'error')
      }
    } catch (error) {
      console.log(error)
      Swal.fire('Error', '', 'error')
    }
    setLoadingComponents(false)
  }

  const getTransacciones = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/oneTransa/${id ?? ''}`, {
      headers: {
        Authorization: `Bearer ${
          token !== null && token !== '' ? `Bearer ${token}` : ''
        }`
      }
    })
    setValues({
      ...values,
      id_transaccion: request.data.id_transaccion,
      nombres: request.data.nombres,
      apellidos: request.data.apellidos,
      status: request.data.status,
      tipo: request.data.tipo,
      order_id: request.data.order_id,
      email: request.data.email,
      celular: request.data.celular,
      comentario: request.data.comentario,
      delivery: request.data.delivery,
      total_pago: request.data.total_pago,
      array_productos: request.data.array_productos,
      estado: request.data.estado,
      envio: request.data.envio,
      created_at: format(
        new Date(request.data.created_at),
        'dd/MM/yyyy, HH:mm:ss'
      )
    })
    if (request.data.captura) {
      setImagen(request.data.captura)
    }
    setPdf(request.data.factura)
  }

  const {
    handleSubmit,
    handleChange,
    errors,
    values,
    touched,
    handleBlur,
    setValues
  } = useFormik({
    initialValues: {
      id: 0,
      id_transaccion: 0,
      nombres: '',
      apellidos: '',
      status: '',
      tipo: '',
      order_id: '',
      email: '',
      celular: '',
      comentario: '',
      delivery: '',
      total_pago: '',
      array_productos: '',
      estado: 0,
      envio: 0,
      created_at: ''
    },
    validationSchema: SchemaTransacciones,
    onSubmit: updateTransaccion
  })

  //   const subirFactuar = async (estate: string): Promise<void> => {
  //     setLoadingComponents(true)
  //     const data = new FormData()
  //     data.append('factura', factura)
  //     data.append('_method', 'PUT')
  //     try {
  //       const respuesta = await axios.post(
  //         `${Global.url}/updateEstado/${id ?? ''}`,
  //         data,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${
  //               token !== null && token !== '' ? token : ''
  //             }`
  //           }
  //         }
  //       )

  //       if (respuesta.data.status == 'success') {
  //         Swal.fire('Estado cambiado', '', 'success')
  //         getTransacciones()
  //       } else {
  //         Swal.fire('Error al cambiar', '', 'error')
  //       }
  //     } catch (error) {
  //       console.log(error)
  //       Swal.fire('Error al cambiar', '', 'error')
  //     }
  //     setLoadingComponents(false)
  //   }

  return (
    <>
      {loadingComponents
        ? <Loading />
        : (
        <form
          className="bg-secondary-100 p-8 rounded-xl relative"
          onSubmit={handleSubmit}
        >
          <h2 className="text-white text-2xl font-bold mb-10 text-center w-full">
            DATOS DEL CLIENTE
          </h2>
          <div className='absolute right-6 top-6'>
            {/* <button
              type="button"
              className=" bg-secondary-70 px-4 py-3 rounded-xl text-white font-bold"
            >
              {' '}
              Subir Factura
            </button> */}
            <PdfUpdate onPdfChange={handlePdfChange}
              initialPdfName={String(pdf)}/>
          </div>
          <div className="w-full lg:relative mb-5 flex flex-col lg:flex-row justify-between gap-3">
            <div className="w-full lg:w-1/3">
              <TitleBriefs titulo="Nombres" />
              <InputsBriefsView
                name="nombres"
                type="text"
                value={values.nombres}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors errors={errors.nombres} touched={touched.nombres} />
            </div>
            <div className="w-full lg:w-1/3">
              <TitleBriefs titulo="Apellidos" />
              <InputsBriefsView
                name="apellidos"
                type="text"
                value={values.apellidos}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors errors={errors.apellidos} touched={touched.apellidos} />
            </div>
            <div className="w-full lg:w-1/3">
              <TitleBriefs titulo="Email" />
              <InputsBriefsView
                name="email"
                type="text"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors errors={errors.email} touched={touched.email} />
            </div>
          </div>

          <div className="w-full lg:relative mb-5 flex flex-col lg:flex-row justify-between gap-2">
            <div className="w-full lg:w-1/3">
              <TitleBriefs titulo="Celular" />
              <InputsBriefsView
                name="celular"
                type="text"
                value={values.celular}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors errors={errors.celular} touched={touched.celular} />
            </div>
            {values.status == 'approved' || values.status == 'Por confirmar'
              ? (
              <div className="w-2/3">
                <TitleBriefs titulo="ESTADO DE ATENCION" />
                <select
                  className={`border border-black  placeholder-gray-400 outline-none focus:outline-none
                                                          focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900
                                                          rounded-md transition-all ${
                                                            values.estado == 0
                                                              ? 'text-green-400'
                                                              : values.estado ==
                                                                1
                                                              ? 'text-red-500'
                                                              : values.estado ==
                                                                3
                                                              ? 'text-main'
                                                              : ''
                                                          }`}
                  name="estado"
                  value={values.estado}
                  autoComplete="off"
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value="0" className="text-green-400">
                    PENDIENTE
                  </option>
                  <option value="1" className="text-red-500">
                    TERMINADO
                  </option>
                  <option value="3" className="text-main">
                    POR REVISAR
                  </option>
                </select>
                <Errors errors={errors.estado} touched={touched.estado} />
              </div>
                )
              : (
              <div className="w-full lg:w-2/3">
                <TitleBriefs titulo="ESTADO DE ATENCION" />
                <input
                  className="border border-red-500  placeholder-gray-400 outline-none focus:outline-none
                                                      focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-red-500
                                                      rounded-md transition-all"
                  type="text"
                  value="RECHAZADO"
                  autoComplete="off"
                  disabled
                />
              </div>
                )}
          </div>

          {/* <div className="w-full lg:relative mb-5 flex flex-row justify-between gap-2">
            <div className="w-full">
              <TitleBriefs titulo="Detalle" />
              <textarea
                className="border border-black  placeholder-gray-400 outline-none focus:outline-none
                                                      focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900
                                                      rounded-md transition-all"
                name="comentario"
                onChange={handleChange}
                onBlur={handleBlur}
                disabled
              >
                {values.comentario}
              </textarea>
              <Errors errors={errors.comentario} touched={touched.comentario} />
            </div>
          </div> */}

          <h2 className="text-white text-2xl font-bold my-10 text-center w-full">
            DATOS DE LA TRANSACCIÓN
          </h2>

          <div className="w-full lg:relative mb-5 flex flex-row justify-between gap-2">
            <div className="w-2/5">
              <TitleBriefs titulo="ID de la transaccion" />
              <InputsBriefsView
                name="id_transaccion"
                type="text"
                value={values.id_transaccion}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors
                errors={errors.id_transaccion}
                touched={touched.id_transaccion}
              />
            </div>
            <div className="w-1/5">
              <TitleBriefs titulo="Estado de compra" />
              <InputsBriefsView
                name="status"
                type="text"
                value={
                  values.status == 'Por confirmar' && values.estado == 1
                    ? 'approved'
                    : values.status
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors errors={errors.status} touched={touched.status} />
            </div>
            <div className="w-1/5">
              <TitleBriefs titulo="Medio de pago" />
              <input
                className="uppercase border border-black  placeholder-gray-400 outline-none focus:outline-none
                                                      focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900
                                                      rounded-md transition-all"
                name="tipo"
                type="text"
                value={values.tipo}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled
              />
              <Errors errors={errors.tipo} touched={touched.tipo} />
            </div>
            <div className="w-1/5">
              <TitleBriefs titulo="Fecha" />
              <input
                className="uppercase border border-black  placeholder-gray-400 outline-none focus:outline-none
                                                      focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900
                                                      rounded-md transition-all"
                name="created_at"
                type="text"
                value={values.created_at}
                disabled
              />
            </div>
          </div>

          {imagen &&
          <img src={`${Global.urlImages}/capturas/${imagen}`} alt="" className='mx-auto h-[300px] object-contain'/>
          }

          <h2 className="text-white text-2xl font-bold mt-10 text-center w-full">
            LISTADO DE COMRPAS
          </h2>

          {values.tipo != 'transferencia'
            ? (
            <div className="bg-secondary-100 py-4 md:p-8 rounded-xl">
              <div className="hidden md:grid grid-cols-1 md:grid-cols-5 gap-4 mb-2 p-4">
                <h5 className="md:text-center">ID producto</h5>
                <h5 className="md:text-center">Nombre</h5>
                <h5 className="md:text-center">Cantidad</h5>
                <h5 className="md:text-center">Precio U</h5>
                <h5 className="md:text-center">Subtotal</h5>
              </div>
              {values.array_productos &&
                JSON.parse(values.array_productos).map((pro: any) => (
                  <div
                    className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center mb-4 bg-secondary-900 p-4 rounded-xl"
                    key={pro.id}
                  >
                    <div className="md:text-center">
                      <h5 className="md:hidden text-white font-bold mb-2">
                        ID producto
                      </h5>
                      <span>{pro.id}</span>
                    </div>
                    <div className="md:text-center">
                      <h5 className="md:hidden text-white font-bold mb-2">
                        Nombre
                      </h5>
                      <span>{pro.title}</span>
                    </div>
                    <div className="md:text-center">
                      <h5 className="md:hidden text-white font-bold mb-2">
                        Cantidad
                      </h5>
                      <span>{pro.quantity}</span>
                    </div>
                    <div className="md:text-center">
                      <h5 className="md:hidden text-white font-bold mb-2">
                        Precio
                      </h5>
                      <span>S./ {pro.unit_price}</span>
                    </div>
                    <div className="md:text-center">
                      <h5 className="md:hidden text-white font-bold mb-2">
                        Subtotal
                      </h5>
                      <span>
                        S./{' '}
                        {(parseFloat(pro.unit_price) * pro.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
              )
            : (
            <div className="bg-secondary-100 py-4 md:p-8 rounded-xl">
              <div className="hidden md:grid grid-cols-1 md:grid-cols-5 gap-4 mb-2 p-4">
                <h5 className="md:text-center">ID producto</h5>
                <h5 className="md:text-center">Nombre</h5>
                <h5 className="md:text-center">Cantidad</h5>
                <h5 className="md:text-center">Precio U</h5>
                <h5 className="md:text-center">Subtotal</h5>
              </div>
              {values.array_productos &&
                JSON.parse(values.array_productos).map((pro: any) => (
                  <div
                    className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center mb-4 bg-secondary-900 p-4 rounded-xl"
                    key={pro.id}
                  >
                    <div className="md:text-center">
                      <h5 className="md:hidden text-white font-bold mb-2">
                        ID producto
                      </h5>
                      <span>{pro.id}</span>
                    </div>
                    <div className="md:text-center">
                      <h5 className="md:hidden text-white font-bold mb-2">
                        Nombre
                      </h5>
                      <span>{pro.nombre}</span>
                    </div>
                    <div className="md:text-center">
                      <h5 className="md:hidden text-white font-bold mb-2">
                        Cantidad
                      </h5>
                      <span>{pro.cantidad}</span>
                    </div>
                    <div className="md:text-center">
                      <h5 className="md:hidden text-white font-bold mb-2">
                        Precio
                      </h5>
                      <span>S./ {pro.precio}</span>
                    </div>
                    <div className="md:text-center">
                      <h5 className="md:hidden text-white font-bold mb-2">
                        Subtotal
                      </h5>
                      <span>
                        S./ {(parseFloat(pro.precio) * pro.cantidad).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
              )}
          <div className="w-full lg:relative mb-5 flex flex-col lg:flex-row justify-between gap-10 lg:gap-2 pl-10">
            <div className="flex flex-col w-full lg:w-1/2 gap-5">
              <div className="flex w-96">
                <strong className="w-1/2">Pago final :</strong>
                <p className="w-1/2">S./ {values.total_pago} </p>
              </div>
            </div>
            <div className="w-full lg:w-1/2 flex items-center justify-center">
              <strong>
                {values.tipo != 'transferencia'
                  ? 'Verificar el pago final con el monto abonado en mercado pago, puede indentificarlo con el ID de la transaccion'
                  : 'Verfique el comprobante de pago con la fecha y monto final'}
              </strong>
            </div>
          </div>

          <div className="flex gap-2 w-full justify-end">
            <input type="hidden" name="oculto" value="1" />
            <Link
              to="/admin/transacciones"
              className="bg-red-500 px-4 py-2 rounded-md text-white"
            >
              Cancelar
            </Link>
            <input
              type="submit"
              className="bg-green-500 text-black hover:bg-green-600 flex items-center gap-2 py-2 px-4 rounded-lg transition-colors cursor-pointer"
              value="GRABAR"
            />
          </div>
        </form>
          )}
    </>
  )
}
