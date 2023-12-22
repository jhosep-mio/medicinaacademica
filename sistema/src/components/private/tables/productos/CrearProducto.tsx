import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../../../../hooks/useAuth'
import axios from 'axios'
import { Global } from '../../../../helper/Global'
import Swal from 'sweetalert2'
import { Loading } from '../../../shared/Loading'
import { useFormik } from 'formik'
import { TitleBriefs } from '../../../shared/TitleBriefs'
import { InputsBriefs } from '../../../shared/InputsBriefs'
import { Errors } from '../../../shared/Errors'
import { ImageUploader } from '../../../shared/ImageUploader'
import {
  type productosValuesModificate,
  type ImagenState,
  type categoriasValues
} from '../../../shared/Interfaces'
import { ScheamaProductos } from '../../../shared/Schemas'
import Editor from '../../../shared/Editar'

import { BsXLg } from 'react-icons/bs'
import { PdfUploader } from '../../../shared/pdfUploader'

export const CrearProducto = (): JSX.Element => {
  const token = localStorage.getItem('token')
  const [pdf, setPdf] = useState<File | null>(null)
  const handleSetPdf = (pdfFile: File | null): void => {
    // Esta función se pasará como prop al componente PdfUploader
    setPdf(pdfFile)
  }
  const [materiales, setMateriales] = useState<string[]>([])
  const [materialValue, setMaterialValue] = useState<string>('')

  const handleMaterialChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setMaterialValue(event.target.value)
  }

  const agregarElemento = (): void => {
    if (materialValue.trim() !== '') {
      setMateriales([...materiales, materialValue])
      setMaterialValue('') // Limpiamos el input después de agregar un elemento
    }
  }

  const eliminarElemento = (index: number): void => {
    const nuevosMaterial = [...materiales]
    nuevosMaterial.splice(index, 1)
    setMateriales(nuevosMaterial)
  }

  const eliminarTodo = (): void => {
    setMateriales([])
  }

  const [requisitos, setRequisitos] = useState<string[]>([])
  const [requisitoValue, setRequisitoValue] = useState<string>('')

  const handleRequisitoChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setRequisitoValue(event.target.value)
  }

  const agregarRequisito = (): void => {
    if (requisitoValue.trim() !== '') {
      setRequisitos([...requisitos, requisitoValue])
      setRequisitoValue('') // Limpiamos el input después de agregar un elemento
    }
  }

  const eliminarRequisito = (index: number): void => {
    const nuevosMaterial = [...requisitos]
    nuevosMaterial.splice(index, 1)
    setRequisitos(nuevosMaterial)
  }

  const eliminarRequisitos = (): void => {
    setRequisitos([])
  }

  const [publico, setPublico] = useState<string[]>([])
  const [publicoValue, setPublicoValue] = useState<string>('')

  const handlePublicoChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setPublicoValue(event.target.value)
  }

  const agregarPublico = (): void => {
    if (publicoValue.trim() !== '') {
      setPublico([...publico, publicoValue])
      setPublicoValue('') // Limpiamos el input después de agregar un elemento
    }
  }

  const eliminarPublico = (index: number): void => {
    const nuevosMaterial = [...publico]
    nuevosMaterial.splice(index, 1)
    setPublico(nuevosMaterial)
  }

  const eliminarPublicos = (): void => {
    setPublico([])
  }

  const [aprenderas, setAprenderas] = useState<string[]>([])
  const [aprenderasValue, setAprenderasValue] = useState<string>('')

  const handleAprenderasChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setAprenderasValue(event.target.value)
  }

  const agregarAprenderas = (): void => {
    if (aprenderasValue.trim() !== '') {
      setAprenderas([...aprenderas, aprenderasValue])
      setAprenderasValue('') // Limpiamos el input después de agregar un elemento
    }
  }

  const eliminarAprendera = (index: number): void => {
    const nuevosMaterial = [...aprenderas]
    nuevosMaterial.splice(index, 1)
    setAprenderas(nuevosMaterial)
  }

  const eliminarAprenderas = (): void => {
    setAprenderas([])
  }

  const navigate = useNavigate()
  const [categorias, setCategorias] = useState([])
  const [profesores, setProfesores] = useState([])

  const [content, setContent] = useState('')
  const [resumen, setResumen] = useState('')

  const { setTitle, loadingComponents, setLoadingComponents } = useAuth()

  const [imagen1, setImagen1] = useState<ImagenState>({
    archivo: null,
    archivoName: ''
  })
  const [boton1, setBoton1] = useState(false)
  const [url1, setUrl1] = useState('')

  useEffect(() => {
    setTitle('Registrar Producto')
    getCategorias()
    getProfesores()
  }, [])

  const saveCategoria = async (
    values: productosValuesModificate
  ): Promise<void> => {
    setLoadingComponents(true)
    const token = localStorage.getItem('token')
    const data = new FormData()
    data.append('id_categoria', values.idCategoria)
    data.append('id_profesor', values.id_profesor)
    data.append('nombre', values.nombre)
    data.append('nivel', values.nivel)
    data.append('inscritos', values.inscritos)
    data.append('duracion', values.duracion)
    data.append('enlaceVideo', values.enlaceVideo)
    data.append('certificado', values.certificado)
    data.append('duracionFiltro', values.duracionFiltro)
    data.append('aprenderas', JSON.stringify(aprenderas))
    data.append('materiales', JSON.stringify(materiales))
    data.append('requisitos', JSON.stringify(requisitos))
    data.append('publico', JSON.stringify(publico))
    data.append('contenido', '')

    if (imagen1.archivo != null) {
      data.append('imagen1', imagen1.archivo)
    }

    data.append('caracteristicas', content)
    data.append('resumen', resumen)
    data.append('precio1', values.precio1)
    data.append('precio2', values.precio2)
    if (pdf != null) {
      data.append('temario', pdf)
    }
    try {
      const respuesta = await axios.post(`${Global.url}/saveProducto`, data, {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? token : ''
          }`
        }
      })

      if (respuesta.data.status == 'success') {
        Swal.fire('Agregado correctamente', '', 'success')
        navigate('/admin/productos')
      } else {
        Swal.fire('Error ', '', 'error')
      }
    } catch (error) {
      console.log(error)
      Swal.fire('Error', '', 'error')
    }
    setLoadingComponents(false)
  }

  const getCategorias = async (): Promise<void> => {
    setLoadingComponents(true)
    const request = await axios.get(`${Global.url}/allCategorias`, {
      headers: {
        Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
      }
    })
    setCategorias(request.data)
    setLoadingComponents(false)
  }

  const getProfesores = async (): Promise<void> => {
    setLoadingComponents(true)
    const request = await axios.get(`${Global.url}/allProfesores`, {
      headers: {
        Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
      }
    })
    setProfesores(request.data)
    setLoadingComponents(false)
  }

  const {
    handleSubmit,
    handleChange,
    errors,
    values,
    touched,
    handleBlur,
    isSubmitting
  } = useFormik({
    initialValues: {
      nombre: '',
      idCategoria: '',
      id_profesor: '',
      precio1: '',
      precio2: '',
      nivel: '',
      nombreintroduccion: '',
      tiempointroduccion: '',
      videointroduccion: '',
      contenido: '',
      inscritos: '',
      duracion: '',
      certificado: '',
      enlaceVideo: '',
      duracionFiltro: ''
    },
    validationSchema: ScheamaProductos,
    onSubmit: saveCategoria
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
            <div className="w-full lg:w-2/3">
              <TitleBriefs titulo="Título del curso" />
              <InputsBriefs
                name="nombre"
                type="text"
                value={values.nombre}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors errors={errors.nombre} touched={touched.nombre} />
            </div>
            <div className="w-full md:w-1/3">
              <TitleBriefs titulo="Asignar profesor" />
              <select
                className="border border-black  placeholder-gray-400 outline-none focus:outline-none
                                                      focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900
                                                      rounded-md transition-all"
                name="id_profesor"
                value={values.id_profesor}
                autoComplete="off"
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value="">Seleccionar</option>
                {profesores.map((profesor: categoriasValues) => (
                  <option value={profesor.id} key={profesor.id}>
                    {profesor.nombre}
                  </option>
                ))}
              </select>
              <Errors
                errors={errors.id_profesor}
                touched={touched.id_profesor}
              />
            </div>
          </div>
          <div className="w-full lg:relative mb-5 flex flex-col lg:flex-row justify-between gap-2">
            <div className="w-full lg:w-1/4">
              <TitleBriefs titulo="Precio" />
              <InputsBriefs
                name="precio1"
                type="number"
                value={values.precio1}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors errors={errors.precio1} touched={touched.precio1} />
            </div>
            <div className="w-full lg:w-1/4">
              <TitleBriefs titulo="Precio con oferta" />
              <InputsBriefs
                name="precio2"
                type="number"
                value={values.precio2}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors errors={errors.precio2} touched={touched.precio2} />
            </div>
            <div className="w-full md:w-1/4">
              <TitleBriefs titulo="Asignar categoria" />
              <select
                className="border border-black  placeholder-gray-400 outline-none focus:outline-none
                                                      focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900
                                                      rounded-md transition-all"
                name="idCategoria"
                value={values.idCategoria}
                autoComplete="off"
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value="">Seleccionar</option>
                {categorias.map((categoria: categoriasValues) => (
                  <option value={categoria.id} key={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
              <Errors
                errors={errors.idCategoria}
                touched={touched.idCategoria}
              />
            </div>

            <div className="w-full lg:w-1/4">
              <TitleBriefs titulo="Duración Filtro(horas)" />
              <InputsBriefs
                name="duracionFiltro"
                type="number"
                value={values.duracionFiltro}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors
                errors={errors.duracionFiltro}
                touched={touched.duracionFiltro}
              />
            </div>
          </div>

          <div className="w-full lg:relative mb-16 flex flex-col lg:flex-row justify-between gap-2">
            <div className="w-full lg:w-1/4">
              <TitleBriefs titulo="Nivel" />

              <select
                className="border border-black  placeholder-gray-400 outline-none focus:outline-none
                                                          focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900
                                                          rounded-md transition-all"
                name="nivel"
                value={values.nivel}
                autoComplete="off"
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value="">Seleccionar</option>
                <option value="Introductorio">Introductorio</option>
                <option value="Moderado">Moderado</option>
                <option value="Avanzado">Avanzado</option>
              </select>
              <Errors errors={errors.nivel} touched={touched.nivel} />
            </div>
            <div className="w-full lg:w-1/4">
              <TitleBriefs titulo="Total inscritos" />
              <InputsBriefs
                name="inscritos"
                type="text"
                value={values.inscritos}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors errors={errors.inscritos} touched={touched.inscritos} />
            </div>
            <div className="w-full lg:w-1/4">
              <TitleBriefs titulo="Duración" />
              <InputsBriefs
                name="duracion"
                type="text"
                value={values.duracion}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors errors={errors.duracion} touched={touched.duracion} />
            </div>
            <div className="w-full lg:w-1/4">
              <TitleBriefs titulo="Certificado" />
              <InputsBriefs
                name="certificado"
                type="text"
                value={values.certificado}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors
                errors={errors.certificado}
                touched={touched.certificado}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-y-2 mb-24 relative ">
            <p className="bg-transparent pt-0 pb-0 lg:pl-2  mr-0 mb-0 font-medium text-white text-md lg:absolute py-2 rounded-md top-[-25px]">
              Resumen del curso
            </p>
            <div className="flex-1 w-full md:w-3/4">
              <Editor content={resumen} setContent={setResumen} />
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-y-2 mb-10 relative mt-10">
            <p className="bg-transparent pt-0 pb-0 lg:pl-2  mr-0 mb-0 font-medium text-white text-md lg:absolute py-2 rounded-md top-[-25px]">
              Temario
            </p>
            <PdfUploader setPdf={handleSetPdf} clase="pdf" />
         </div>

         <div className="flex flex-col md:flex-row md:items-center gap-y-2 mb-10 relative">
            <p className="bg-secondary-100 pt-0 pb-0 lg:pl-2  mr-0 mb-0 font-medium text-white text-md lg:absolute py-2 rounded-md top-[-10px]">
              Imagen del curso<span className="text-red-500">*</span>
            </p>
            <div className="flex-1 flex flex-col lg:flex-row  items-center gap-4">
              <ImageUploader
                url={url1}
                setUrl={setUrl1}
                boton={boton1}
                setBoton={setBoton1}
                setImagen={setImagen1}
                clase="1"
              />
            </div>
          </div>

          <div className="w-full lg:w-full mb-10">
            <TitleBriefs titulo="Enlace de Youtube" />
            <InputsBriefs
              name="enlaceVideo"
              type="text"
              value={values.enlaceVideo}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Errors errors={errors.enlaceVideo} touched={touched.enlaceVideo} />
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-y-2 mb-24 relative pt-14">
            <p className="bg-transparent pt-0 pb-0 lg:pl-2  mr-0 mb-0 font-medium text-white text-md lg:absolute py-2 rounded-md top-[20px]">
              Descripción del curso
            </p>
            <div className="flex-1 w-full md:w-3/4">
              <Editor content={content} setContent={setContent} />
            </div>
          </div>

          <div className="w-full lg:relative mb-5 flex flex-col justify-between gap-2">
            <div className="w-full flex gap-6 items-center">
              <h2 className="font-medium text-white w-1/5">
                Lo que aprenderás
              </h2>
              <input
                className="border border-black w-3/5  placeholder-gray-400 outline-none focus:outline-none focus:border-black pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900 rounded-md transition-all"
                type="text"
                id="textInput"
                value={aprenderasValue}
                onChange={handleAprenderasChange}
              />
              <button
                type="button"
                onClick={agregarAprenderas}
                className="w-0.5/5 bg-green-500 text-black hover:bg-green-600 flex items-center gap-2 py-2 px-4 rounded-lg transition-colors cursor-pointer"
              >
                Agregar
              </button>
              {aprenderas.length > 0 && (
                <button
                  type="button"
                  className="w-0.5/5 bg-red-500 px-4 py-2 rounded-md text-white"
                  onClick={eliminarAprenderas}
                >
                  Eliminar
                </button>
              )}
            </div>

            <div>
              <div className="min-h-[60px] border border-black  placeholder-gray-400 outline-none focus:outline-none focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900 rounded-md transition-all">
                <ul>
                  {aprenderas.map((elemento, index) => (
                    <li
                      key={index}
                      className="flex items-center space-between w-full gap-4 mb-2"
                    >
                      {elemento}
                      <button
                        type="button"
                        onClick={() => { eliminarAprendera(index) }}
                      >
                        <BsXLg className="delete_icon" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="w-full lg:relative mb-5 flex flex-col justify-between gap-2">
            <div className="w-full flex gap-6 items-center">
              <h2 className="font-medium text-white w-1/5">
                Materiales incluidos
              </h2>
              <input
                className="border border-black w-3/5  placeholder-gray-400 outline-none focus:outline-none focus:border-black pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900 rounded-md transition-all"
                type="text"
                id="textInput"
                value={materialValue}
                onChange={handleMaterialChange}
              />
              <button
                type="button"
                onClick={agregarElemento}
                className="w-0.5/5 bg-green-500 text-black hover:bg-green-600 flex items-center gap-2 py-2 px-4 rounded-lg transition-colors cursor-pointer"
              >
                Agregar
              </button>
              {materiales.length > 0 && (
                <button
                  type="button"
                  className="w-0.5/5 bg-red-500 px-4 py-2 rounded-md text-white"
                  onClick={eliminarTodo}
                >
                  Eliminar
                </button>
              )}
            </div>

            <div>
              <div className="min-h-[60px] border border-black  placeholder-gray-400 outline-none focus:outline-none focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900 rounded-md transition-all">
                <ul>
                  {materiales.map((elemento, index) => (
                    <li
                      key={index}
                      className="flex items-center space-between w-full gap-4 mb-2"
                    >
                      {elemento}
                      <button
                        type="button"
                        onClick={() => { eliminarElemento(index) }}
                      >
                        <BsXLg className="delete_icon" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="w-full lg:relative mb-5 flex flex-col justify-between gap-2">
            <div className="w-full flex gap-6 items-center">
              <h2 className="font-medium text-white w-1/5">Requisitos</h2>
              <input
                className="border border-black w-3/5  placeholder-gray-400 outline-none focus:outline-none focus:border-black pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900 rounded-md transition-all"
                type="text"
                id="textI"
                value={requisitoValue}
                onChange={handleRequisitoChange}
              />
              <button
                type="button"
                onClick={agregarRequisito}
                className="w-0.5/5 bg-green-500 text-black hover:bg-green-600 flex items-center gap-2 py-2 px-4 rounded-lg transition-colors cursor-pointer"
              >
                Agregar
              </button>
              {requisitos.length > 0 && (
                <button
                  type="button"
                  className="w-0.5/5 bg-red-500 px-4 py-2 rounded-md text-white"
                  onClick={eliminarRequisitos}
                >
                  Eliminar
                </button>
              )}
            </div>

            <div>
              <div className="min-h-[60px] border border-black  placeholder-gray-400 outline-none focus:outline-none focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900 rounded-md transition-all">
                <ul>
                  {requisitos.map((elemento, index) => (
                    <li
                      key={index}
                      className="flex items-center space-between w-full gap-4 mb-2"
                    >
                      {elemento}
                      <button
                        type="button"
                        onClick={() => { eliminarRequisito(index) }}
                      >
                        <BsXLg className="delete_icon" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="w-full lg:relative mb-5 flex flex-col justify-between gap-2">
            <div className="w-full flex gap-6 items-center">
              <h2 className="font-medium text-white w-1/5">Público Objetivo</h2>
              <input
                className="border border-black w-3/5  placeholder-gray-400 outline-none focus:outline-none focus:border-black pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900 rounded-md transition-all"
                type="text"
                id="textI"
                value={publicoValue}
                onChange={handlePublicoChange}
              />
              <button
                type="button"
                onClick={agregarPublico}
                className="w-0.5/5 bg-green-500 text-black hover:bg-green-600 flex items-center gap-2 py-2 px-4 rounded-lg transition-colors cursor-pointer"
              >
                Agregar
              </button>
              {publico.length > 0 && (
                <button
                  type="button"
                  className="w-0.5/5 bg-red-500 px-4 py-2 rounded-md text-white"
                  onClick={eliminarPublicos}
                >
                  Eliminar
                </button>
              )}
            </div>

            <div>
              <div className="min-h-[60px] border border-black  placeholder-gray-400 outline-none focus:outline-none focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900 rounded-md transition-all">
                <ul>
                  {publico.map((elemento, index) => (
                    <li
                      key={index}
                      className="flex items-center space-between w-full gap-4 mb-2"
                    >
                      {elemento}
                      <button
                        type="button"
                        onClick={() => { eliminarPublico(index) }}
                      >
                        <BsXLg className="delete_icon" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="flex gap-2 w-full justify-end pt-6">
            <input type="hidden" name="oculto" value="1" />
            <Link
              to="/admin/productos"
              className="bg-red-500 px-4 py-2 rounded-md text-white"
            >
              Cancelar
            </Link>
            <input
              type="submit"
              className="bg-green-500 text-black hover:bg-green-600 flex items-center gap-2 py-2 px-4 rounded-lg transition-colors cursor-pointer"
              value="Registrar"
            />
          </div>
        </form>
          )}
    </>
  )
}
