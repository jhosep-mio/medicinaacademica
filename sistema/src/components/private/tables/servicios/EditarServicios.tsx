import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import useAuth from '../../../../hooks/useAuth'
import axios from 'axios'
import { Global } from '../../../../helper/Global'
import Swal from 'sweetalert2'
import { Loading } from '../../../shared/Loading'
import { useFormik } from 'formik'
import { TitleBriefs } from '../../../shared/TitleBriefs'
import { InputsBriefs } from '../../../shared/InputsBriefs'
import { Errors } from '../../../shared/Errors'
import {
  type ImagenState,
  serviciosValuesModificate,
} from '../../../shared/Interfaces'
import { SchemaServicios } from '../../../shared/Schemas'
import Editor from '../../../shared/Editar'
import { ImageUpdate } from '../../../shared/ImageUpdate'

export const EditarServicios = (): JSX.Element => {
  const { id } = useParams()
  const token = localStorage.getItem('token')

  const navigate = useNavigate()
  const [content, setContent] = useState('')
  const [seccion1, setSeccion1] = useState('')
  const [seccion2, setSeccion2] = useState('')
  const [seccion3, setSeccion3] = useState('')
  const [seccion4, setSeccion4] = useState('')

  const { setTitle, loadingComponents, setLoadingComponents } = useAuth()

  const [imagen1, setImagen1] = useState('')
  const [imagenNueva1, setImagenNueva1] = useState<ImagenState>({
    archivo: null,
    archivoName: ''
  })

  const [boton1, setBoton1] = useState(false)
  const [url1, setUrl1] = useState('')


  const [imagen2, setImagen2] = useState('')
  const [imagenNueva2, setImagenNueva2] = useState<ImagenState>({
    archivo: null,
    archivoName: ''
  })

  const [boton2, setBoton2] = useState(false)
  const [url2, setUrl2] = useState('')



  useEffect(() => {
    setLoadingComponents(true)
    setTitle('Editar servicio')
    Promise.all([getProducto()]).then(() => {
      setLoadingComponents(false)
    })
  }, [])

  const updateProducto = async (
    values: serviciosValuesModificate
  ): Promise<void> => {
    setLoadingComponents(true)
    const token = localStorage.getItem('token')
    const data = new FormData()
    data.append('nombre', values.nombre)
    data.append('caracteristicas', content)
    data.append('titulo1', values.titulo1)
    data.append('seccion1', seccion1)
    data.append('seccion2', seccion2)
    data.append('seccion3', seccion3)
    data.append('seccion4', seccion4)

    if (imagenNueva1.archivo != null) {
      data.append('imagen1', imagenNueva1.archivo)
    }
    if (imagenNueva2.archivo != null) {
      data.append('imagen2', imagenNueva2.archivo)
    }

   
    data.append('_method', 'PUT')

    try {
      const respuesta = await axios.post(
        `${Global.url}/updateServicio/${id ?? ''}}`,
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
        navigate('/admin/servicios')
      } else {
        Swal.fire('Error ', '', 'error')
      }
    } catch (error) {
      console.log(error)
      Swal.fire('Error', '', 'error')
    }
    setLoadingComponents(false)
  }

  const getProducto = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/oneServicio/${id ?? ''}`, {
      headers: {
        Authorization: `Bearer ${
          token !== null && token !== '' ? `Bearer ${token}` : ''
        }`
      }
    })
    setValues({
      ...values,
      nombre: request.data[0].nombre,
      titulo1: request.data[0].titulo1
    })
    setImagen1(request.data[0].imagen1)
    setImagen2(request.data[0].imagen2)
    setContent(request.data[0].caracteristicas)
    setSeccion1(request.data[0].seccion1)
    setSeccion2(request.data[0].seccion2)
    setSeccion3(request.data[0].seccion3)
    setSeccion4(request.data[0].seccion4)


  }

  const {
    handleSubmit,
    handleChange,
    errors,
    values,
    isSubmitting,
    touched,
    handleBlur,
    setValues
  } = useFormik({
    initialValues: {
      nombre: '',
      titulo1: ''
    },
    validationSchema: SchemaServicios,
    onSubmit: updateProducto
  })

  useEffect(() => {
    if (errors && isSubmitting) {
      const firstErrorKey = Object.keys(errors)[0]
      const firstErrorElement = document.getElementsByName(firstErrorKey)[0]
      if (firstErrorElement) {
        firstErrorElement.focus()
      }
    }
  }, [touched, errors, isSubmitting])

  return (
    <>
      {loadingComponents
        ? (
        <Loading />
          )
        : (
        <form
          className="bg-secondary-100 p-8 rounded-xl"
          onSubmit={handleSubmit}
        >
          <div className="w-full lg:relative mb-5 flex flex-col lg:flex-row justify-between gap-5">
            <div className="w-full lg:w-full">
              <TitleBriefs titulo="Nombre del servicio" />
              <InputsBriefs
                name="nombre"
                type="text"
                value={values.nombre}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors errors={errors.nombre} touched={touched.nombre} />
            </div>
           
          </div>
       
          <div className="flex flex-col md:flex-row md:items-center gap-y-2 mb-10 relative">
            <p className="bg-secondary-100 pt-0 pb-0 lg:pl-2  mr-0 mb-0 font-medium text-white text-md lg:absolute py-2 rounded-md top-[-10px]">
              Imagen del servicio<span className="text-red-500">*</span>
            </p>
            <div className="flex-1 flex flex-col lg:flex-row items-center gap-4">
              <ImageUpdate
                globalUrl="servicios"
                url={url1}
                setUrl={setUrl1}
                boton={boton1}
                setBoton={setBoton1}
                imagen={imagen1}
                setImagen={setImagenNueva1}
                clase="1"
              />
              <ImageUpdate
                globalUrl="servicios"
                url={url2}
                setUrl={setUrl2}
                boton={boton2}
                setBoton={setBoton2}
                imagen={imagen2}
                setImagen={setImagenNueva2}
                clase="2"
              />
        
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-y-2 mb-20 relative">
            <p className="bg-transparent pt-0 pb-0 lg:pl-2  mr-0 mb-0 font-medium text-white text-md lg:absolute py-2 rounded-md top-[-25px]">
              Detalle del servicio
            </p>
            <div className="flex-1 w-full md:w-3/4">
              <Editor content={content} setContent={setContent} />
            </div>
          </div>

          <div className="w-full lg:w-full mb-12">
              <TitleBriefs titulo="Título de la sección 1" />
              <InputsBriefs
                name="titulo1"
                type="text"
                value={values.titulo1}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors errors={errors.titulo1} touched={touched.titulo1} />
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-y-2 mb-20 relative">
            <p className="bg-transparent pt-0 pb-0 lg:pl-2  mr-0 mb-0 font-medium text-white text-md lg:absolute py-2 rounded-md top-[-25px]">
              Seccion 1
            </p>
            <div className="flex-1 w-full md:w-3/4">
              <Editor content={seccion1} setContent={setSeccion1} />
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-y-2 mb-20 relative">
            <p className="bg-transparent pt-0 pb-0 lg:pl-2  mr-0 mb-0 font-medium text-white text-md lg:absolute py-2 rounded-md top-[-25px]">
              Seccion 2
            </p>
            <div className="flex-1 w-full md:w-3/4">
              <Editor content={seccion2} setContent={setSeccion2} />
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-y-2 mb-20 relative">
            <p className="bg-transparent pt-0 pb-0 lg:pl-2  mr-0 mb-0 font-medium text-white text-md lg:absolute py-2 rounded-md top-[-25px]">
              Seccion 3
            </p>
            <div className="flex-1 w-full md:w-3/4">
              <Editor content={seccion3} setContent={setSeccion3} />
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-y-2 mb-20 relative">
            <p className="bg-transparent pt-0 pb-0 lg:pl-2  mr-0 mb-0 font-medium text-white text-md lg:absolute py-2 rounded-md top-[-25px]">
              Seccion 4
            </p>
            <div className="flex-1 w-full md:w-3/4">
              <Editor content={seccion4} setContent={setSeccion4} />
            </div>
          </div>

          <div className="flex gap-2 w-full justify-end">
            <input type="hidden" name="oculto" value="1" />
            <Link
              to="/admin/servicios"
              className="bg-red-500 px-4 py-2 rounded-md text-white"
            >
              Cancelar
            </Link>
            <input
              type="submit"
              className="bg-green-500 text-black hover:bg-green-600 flex items-center gap-2 py-2 px-4 rounded-lg transition-colors cursor-pointer"
              value="Editar"
            />
          </div>
        </form>
          )}
    </>
  )
}
