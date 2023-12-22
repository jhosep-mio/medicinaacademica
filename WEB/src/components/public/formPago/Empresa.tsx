import { useFormik } from 'formik'
import { type Dispatch, type SetStateAction, useEffect, useState } from 'react'
import { SchemaCompra2 } from '../../shared/Schemas'
import { Errors } from '../../shared/Errors'
import useAuth from '../../../hooks/useAuth'
import { v4 as uuidv4 } from 'uuid'
import CryptoJS from 'crypto-js'
import axios from 'axios'
import { Global } from '../../../helper/Global'
import { motion } from 'framer-motion'
import { type carrito, type cursosCompradosValues, type datosValues } from '../../shared/Interfaces'
import Swal from 'sweetalert2'
const encryptionKey = 'qwerasd159'

interface valuesProps {
  setLoadingCorreo: Dispatch<SetStateAction<boolean>>
  setPreferenceId: Dispatch<SetStateAction<string>>
  preferenceId: string
  loadingcorreo: boolean
  setDatos: Dispatch<SetStateAction<datosValues | null>>
}

export const Empresa = ({
  setLoadingCorreo,
  setPreferenceId,
  preferenceId,
  loadingcorreo,
  setDatos
}: valuesProps): JSX.Element => {
  const { auth, cart } = useAuth()
  const [, setLoading] = useState(false)
  const [habilitarCel, setHabilitarCel] = useState(false)
  const tokenUser = localStorage.getItem('tokenUser')
  const [cursos, setCursos] = useState([])

  const validarCursosComprados = (cursosCarrito: carrito[]): string[] => {
    const cursosYaComprados = cursosCarrito
      .filter((cursoCarrito) => {
        return cursos.some((cursoComprado: cursosCompradosValues) => {
          const productosComprados = JSON.parse(cursoComprado.array_productos)
          // Convertir todos los IDs a cadenas para la comparación
          const cursosCompradosIds = productosComprados.map((producto: any) =>
            String(producto.id)
          )

          return cursosCompradosIds.includes(String(cursoCarrito.id))
        })
      })
      .map((curso) => curso.nombre)

    return cursosYaComprados
  }

  const validarCorreo = async (): Promise<void> => {
    const request = await axios.get(
      `${Global.url}/validarCorreo/${values.email}`,
      {
        headers: {
          Authorization: `Bearer ${tokenUser ?? ''}`
        }
      }
    )
    if (request.data.existe && !auth.id) {
      //   Swal.fire('Ya existe una cuenta con este correo por favor inicie sesion para continuar con su compra', '', 'warning')
      Swal.fire({
        title:
          'Ya existe una cuenta con este correo por favor inicie sesion para continuar con su compra',
        icon: 'warning',
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: `
          <a href='/login' className="">Iniciar Sesión</a> 
        `,
        confirmButtonAriaLabel: 'Thumbs up, great!',
        cancelButtonText: `
        <p >Cancelar</p> 
        `,
        cancelButtonAriaLabel: 'Thumbs down'
      })
    } else {
      const nombresCursosComprados = validarCursosComprados(cart)
      if (nombresCursosComprados.length > 0) {
        // Mostrar mensaje con los nombres de los cursos ya comprados
        const listaHtmlCursos = nombresCursosComprados
          .map(
            (nombreCurso) =>
              `<li style="margin-top: 10px; font-weight: 700;">- ${nombreCurso}</li>`
          )
          .join('')

        Swal.fire({
          title: 'Cursos ya adquiridos',
          html: `Ya has comprado los siguientes cursos:<ul style="margin-left: 20px;">${listaHtmlCursos}</ul>`,
          icon: 'info'
        })
      } else {
        handleClickPagar()
      }
    }
  }

  const handleClickPagar = async (): Promise<void> => {
    setLoadingCorreo(true)
    setDatos(values)
    const dataempresa = {
      nombre_empresa: values.nombre_empresa,
      ruc: values.ruc,
      direccion_fiscal: values.direccion_fiscal
    }
    const uniqueId = uuidv4()
    try {
      const preferenceData = {
        items: cart.map((producto) => ({
          id: producto.id,
          title: producto.nombre,
          unit_price:
            producto.precio !== null ? parseFloat(String(producto.precio)) : 0,
          quantity: producto.cantidad,
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          picture_url: `${Global.urlImages}/productos/${producto.imagen1}`
        })),
        payment_methods: {
          installments: 1,
          excluded_payment_types: [
            {
              id: 'ticket'
            },
            {
              id: 'atm'
            }
          ]
        },
        statement_descriptor: 'MEDICINA ACADÉMICA',
        payer: {
          name: values.nombres,
          surname: values.apellidos,
          email: values.email,
          phone: {
            area_code: JSON.stringify(dataempresa),
            number: values.celular
          },
          address: {
            street_name: values.email,
            street_number: 123,
            zip_code: '06233200'
          }
        },
        back_urls: {
          success: `http://localhost:5173/success/${String(uniqueId)}`,
          failure: 'http://localhost:5173/error-pago'
        },
        metadata: {
          comment: uniqueId
        },
        external_reference: auth.id ? auth.id : 'notiene',
        auto_return: 'approved',
        notification_url:
          'https://academica.logosperu.com.pe/public/api/webhook'
      }

      const response = await axios.post(
        'https://api.mercadopago.com/checkout/preferences',
        preferenceData,
        {
          headers: {
            Authorization:
              'Bearer APP_USR-8504267146898040-112212-f81bad1dd8eb16d7609c60c35c376f91-1561392704',
            'Content-Type': 'application/json'
          }
        }
      )

      const preferenceId: string = response.data.id
      setPreferenceId(preferenceId)
      const dataArray = []
      const dataObject = {
        id_unique: uniqueId
      }
      dataArray.push(dataObject)
      const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify(dataArray),
        encryptionKey
      ).toString()
      localStorage.setItem('data', encryptedData)
    } catch (error) {
      console.error('Error al generar la preferencia de pago:', error)
    }
    setLoadingCorreo(false)
  }

  const {
    handleSubmit,
    handleChange,
    setValues,
    errors,
    values,
    touched,
    handleBlur,
    isSubmitting
  } = useFormik({
    initialValues: {
      nombres: '',
      apellidos: '',
      dni: '',
      celular: '',
      email: '',
      nombre_empresa: '',
      ruc: '',
      direccion_fiscal: ''
    },
    validationSchema: SchemaCompra2,
    onSubmit: validarCorreo
  })

  const getcursos = async (): Promise<void> => {
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
    setCursos(request.data)
  }

  useEffect(() => {
    if (errors && isSubmitting) {
      const firstErrorKey = Object.keys(errors)[0]
      const firstErrorElement = document.getElementsByName(firstErrorKey)[0]
      if (firstErrorElement) {
        firstErrorElement.focus()
      }
    }
  }, [touched, errors, isSubmitting])

  useEffect(() => {
    getOneBrief()
    getcursos()
  }, [auth.id])

  const getOneBrief = async (): Promise<void> => {
    const tokenUser = localStorage.getItem('tokenUser')
    const request = await axios.get(`${Global.url}/perfilEstudiante`, {
      headers: {
        Authorization: `Bearer ${tokenUser ?? ''}`
      }
    })
    setValues({
      ...values,
      nombres: request.data.user.nombres,
      apellidos: request.data.user.apellidos,
      celular: request.data.user.celular,
      email: request.data.user.email
    })
    if (request.data.user.celular) {
      setHabilitarCel(true)
    }
    setLoading(false)
  }

  return (
    <motion.form
      action=""
      className="w-full h-fit"
      onSubmit={handleSubmit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex flex-col mb-4">
        <h6 className="text-2xl font-semibold mb-2">Nombres</h6>
        <div className="inputs_pago ">
          <input
            type="text"
            placeholder="Ingresa tus nombres"
            className={`${auth.onlyname ? 'bg-gray-200' : ''}`}
            disabled={!!auth.onlyname}
            name="nombres"
            value={values.nombres}
            autoComplete="off"
            onChange={auth.onlyname ? undefined : handleChange}
            onBlur={handleBlur}
          />
        </div>
        <Errors errors={errors.nombres} touched={touched.nombres} />
      </div>
      <div className="flex flex-col mb-4">
        <h6 className="text-2xl font-semibold mb-2">Apellidos</h6>
        <div className="inputs_pago ">
          <input
            type="text"
            placeholder="Ingresa tus apellidos"
            className={`${auth.lastname ? 'bg-gray-200' : ''}`}
            name="apellidos"
            disabled={!!auth.lastname}
            value={values.apellidos}
            autoComplete="off"
            onChange={auth.lastname ? undefined : handleChange}
            onBlur={handleBlur}
          />
        </div>
        <Errors errors={errors.apellidos} touched={touched.apellidos} />
      </div>
      <div className="flex flex-col mb-4 ">
        <h6 className="text-2xl font-semibold mb-2">DNI o RUC</h6>
        <div className="inputs_pago relative">
          <input
            type="dni"
            placeholder="DNI O RUC"
            className=""
            name="dni"
            value={values.dni}
            autoComplete="off"
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>
        <Errors errors={errors.dni} touched={touched.dni} />
      </div>
      <div className="flex flex-col mb-4 ">
        <h6 className="text-2xl font-semibold mb-2">E-mail</h6>
        <div className="inputs_pago relative">
          <input
            type="email"
            placeholder="Ingresa tu correo"
            className={`${auth.email ? 'bg-gray-200' : ''}`}
            name="email"
            disabled={!!auth.email}
            value={values.email}
            autoComplete="off"
            onChange={auth.email ? undefined : handleChange}
            onBlur={handleBlur}
          />
        </div>
        <Errors errors={errors.email} touched={touched.email} />
      </div>
      <div className="flex flex-col mb-4 ">
        <h6 className="text-2xl font-semibold mb-2">Celular</h6>

        <div className="inputs_pago relative">
          <input
            type="number"
            placeholder="Numero de celular/telefono"
            className={`${habilitarCel ? 'bg-gray-200' : ''}`}
            name="celular"
            disabled={!!habilitarCel}
            value={values.celular}
            autoComplete="off"
            onChange={habilitarCel ? undefined : handleChange}
            onBlur={handleBlur}
          />
        </div>
        <Errors errors={errors.celular} touched={touched.celular} />
      </div>
      <div className="flex flex-col mb-4">
        <h6 className="text-2xl font-semibold mb-2">Nombre de la empresa</h6>
        <div className="inputs_pago ">
          <input
            type="text"
            placeholder="Nombre de empresa"
            className=""
            name="nombre_empresa"
            value={values.nombre_empresa}
            autoComplete="off"
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>
        <Errors
          errors={errors.nombre_empresa}
          touched={touched.nombre_empresa}
        />
      </div>
      <div className="flex flex-col mb-4">
        <h6 className="text-2xl font-semibold mb-2">RUC</h6>

        <div className="inputs_pago ">
          <input
            type="text"
            placeholder="RUC"
            className=""
            name="ruc"
            value={values.ruc}
            autoComplete="off"
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>
        <Errors errors={errors.ruc} touched={touched.ruc} />
      </div>
      <div className="flex flex-col mb-4 ">
        <h6 className="text-2xl font-semibold mb-2">Dirección fiscal</h6>
        <div className="inputs_pago relative">
          <input
            type="text"
            placeholder="Dirección fiscal"
            className=""
            name="direccion_fiscal"
            value={values.direccion_fiscal}
            autoComplete="off"
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>
        <Errors
          errors={errors.direccion_fiscal}
          touched={touched.direccion_fiscal}
        />
      </div>
      {!loadingcorreo && cart.length > 0 && !preferenceId
        ? (
        <button type="submit" className="btn_pagar">
          Continuar compra
        </button>
          )
        : (
            cart.length > 0 &&
        !preferenceId && (
          <button
            type="button"
            className="bg-maindark text-xltransition-colors font-bold rounded-xl px-4 py-2 mt-3 text-white"
          >
            Validando
          </button>
            )
          )}
    </motion.form>
  )
}
