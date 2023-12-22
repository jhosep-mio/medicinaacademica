import { Fragment, useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import image from './../../../../../assets/cursos/examen.svg'
import { type contenidosValues } from '../../../../shared/Interfaces'
import axios from 'axios'
import { Global } from '../../../../../helper/Global'
import { CantidadClases } from '../recurses/CantidadClases'
import Swal from 'sweetalert2'
import { ViewImage } from './ViewImage'
import useAuth from '../../../../../hooks/useAuth'
import { ViewRespuesta } from './ViewRespuesta'

interface valuesProps {
  contenido: contenidosValues[]
  claseId: string | undefined
  setProgresoClases: Dispatch<SetStateAction<Record<string, Record<string, boolean>>>>
  progresoClases: Record<string, Record<string, boolean>>
  cursoId: string | undefined
  getApuntes: () => Promise<void>
}
interface valuesExamen {
  titulo: string
  arraydatos: string
}

interface InterfaceImage {
  file: File | null
  preview: string | ArrayBuffer | null | undefined
}

interface valuesPreguntas {
  id: string
  pregunta: string
  respuestas: Array<{
    texto: string
    esCorrecta: boolean
    imagen: InterfaceImage | null
  }>
  imagen: InterfaceImage | null
}

interface valuesExamenes {
  id: string | undefined
  contenido: any
}

export const Examen = ({ contenido, claseId, setProgresoClases, cursoId, getApuntes }: valuesProps): JSX.Element => {
  const [estado, setEstado] = useState(false)
  const [examen, setExamen] = useState<valuesExamen | null>(null)
  const tokenUser = localStorage.getItem('tokenUser')
  const [loading, setLoading] = useState(true)
  const { auth } = useAuth()
  const [verImagen, setVerImagen] = useState<
  string | ArrayBuffer | null | undefined
  >('')
  const [open, setOpen] = useState(false)
  const [openRespuesta, setOpenRespuesta] = useState(false)
  const [respuestaCorecta, setRespuestaCorrecta] = useState<any | null>(null)
  const [examenes, setExamenes] = useState<valuesExamenes[]>([])
  const [, setAllExamenes] = useState<valuesExamenes[]>([])
  const [reiniciar, setReiniciar] = useState(false)

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<
  Record<number, string>
  >({})
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false)

  useEffect(() => {
    contenido.forEach((bloque) => {
      bloque.contenido.forEach((_conte: any, index: number) => {
        const indiceElemento =
          bloque.codClases && Array.isArray(bloque.codClases)
            ? bloque.codClases.indexOf(claseId)
            : -1

        if (indiceElemento === index && indiceElemento !== -1) {
          const linkClaseValue = bloque.linkClases?.[index]
          getExamen(linkClaseValue)
        }
      })
    })
  }, [contenido, claseId])

  const getExamen = async (id: string | undefined): Promise<void> => {
    const request = await axios.get(`${Global.url}/getDsE/${id ?? ''}`, {
      headers: {
        Authorization: `Bearer ${
          tokenUser !== null && tokenUser !== '' ? `Bearer ${tokenUser}` : ''
        }`
      }
    })
    setExamen(request.data)
    setLoading(false)
  }

  const getExamenes = async (id: string | undefined): Promise<void> => {
    const request = await axios.get(
      `${Global.url}/getExamenToEstudiante/${id ?? ''}`,
      {
        headers: {
          Authorization: `Bearer ${
            tokenUser !== null && tokenUser !== '' ? `Bearer ${tokenUser}` : ''
          }`
        }
      }
    )
    setAllExamenes(request.data[0].listaexamen ? JSON.parse(request.data[0].listaexamen) : [])
    const examenDeseado = request.data[0].listaexamen
      ? JSON.parse(request.data[0].listaexamen).find(
        (examen: any) => examen.id == claseId
      )
      : []
    setExamenes(examenDeseado)
  }

  const handleNextQuestion = (): void => {
    if (selectedAnswers[currentQuestion] !== undefined) {
      Swal.fire({
        title: '<strong><u>¿Desea continuar?</u></strong>',
        icon: 'info',
        html: `
        <b>No podra cambiar su respuesta</b>
  `,
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: `
              <i class="fa fa-thumbs-up"></i> SI!
            `,
        confirmButtonAriaLabel: 'No podra modificar su respuesta!',
        cancelButtonText: `
              <i class="fa fa-thumbs-down"></i> NO
            `,
        cancelButtonAriaLabel: 'Thumbs down'
      }).then((result) => {
        if (result.isConfirmed) {
          setCurrentQuestion((prev) => prev + 1)
        }
      })
    } else {
      Swal.fire('Por favor seleccione una respuesta', '', 'warning')
    }
  }
  const handleAnswerSelection = (answerIndex: number): void => {
    const updatedAnswers = {
      ...selectedAnswers,
      [currentQuestion]: String.fromCharCode(65 + answerIndex)
    }

    setSelectedAnswers(updatedAnswers)
    checkAllQuestionsAnswered(updatedAnswers)
  }

  const renderLetter = (index: number): string =>
    String.fromCharCode(65 + index)

  const mostrarResultados = (): void => {
    agregarApunte()
  }

  const checkAllQuestionsAnswered = (updatedAnswers: Record<number, string>): void => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const allAnswered = Object.keys(updatedAnswers).length === JSON.parse(examen?.arraydatos).length
    setAllQuestionsAnswered(allAnswered)
  }

  const agregarApunte = async (): Promise<void> => {
    setLoading(true)
    const nuevoResumen = {
      id: claseId,
      contenido: selectedAnswers
    }
    const { calificacion } = calcularCalificacion2(selectedAnswers)
    setAllExamenes((resumenesPrevios: valuesExamenes[] | undefined): valuesExamenes[] => {
      const prevResumenes = Array.isArray(resumenesPrevios) ? resumenesPrevios : []
      let examenReemplazado = false
      const nuevosResumenes = prevResumenes.map((exam) => {
        if (exam.id === claseId) {
          // If it exists, update the existing exam
          examenReemplazado = true
          return nuevoResumen
        }
        return exam
      })
      if (!examenReemplazado) {
        nuevosResumenes.push(nuevoResumen)
      }
      const enviarDatos = async (): Promise<void> => {
        const data = new FormData()
        data.append('listaexamen', JSON.stringify(nuevosResumenes))
        data.append('_method', 'PUT')
        if (calificacion >= 6.5) {
          actualizarProgresoClase()
        }
        try {
          const respuesta = await axios.post(
                `${Global.url}/saveExamen/${auth.id ?? ''}`,
                data,
                {
                  headers: {
                    Authorization: `Bearer ${tokenUser !== null && tokenUser !== '' ? tokenUser : ''}`
                  }
                }
          )

          if (respuesta.data.status === 'success') {
            Swal.fire('Examen enviado', '', 'success')
            window.location.reload()
          } else {
            Swal.fire('Error al guardar', '', 'error')
          }
        } catch (error: unknown) {
          console.log(error)
          Swal.fire('Error al guardar', '', 'error')
        }
      }
      enviarDatos()
      return nuevosResumenes
    })
    setLoading(false)
  }

  useEffect(() => {
    if (auth.id) {
      getExamenes(auth.id)
    }
  }, [auth.id, claseId])

  const calcularCalificacion = (): { aciertos: number, calificacion: number, totalPreguntas: number } => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    if (examenes?.id && !loading) {
      const totalPreguntas = JSON.parse(examen?.arraydatos ?? '').length
      let aciertos = 0
      JSON.parse(examen?.arraydatos ?? '').forEach((exa: valuesPreguntas, index: number) => {
        exa.respuestas.forEach((respuesta, respuestaIndex: number) => {
          if (
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            examenes?.contenido[index] == renderLetter(respuestaIndex) &&
              respuesta.esCorrecta
          ) {
            aciertos++
          }
        })
      })
      const calificacion = (aciertos / totalPreguntas) * 10 // Puedes ajustar la escala según tus necesidades
      return { aciertos, calificacion, totalPreguntas }
    }
    return { aciertos: 0, calificacion: 0, totalPreguntas: 0 }
  }

  const calcularCalificacion2 = (selectedAnswers: any): { calificacion: number } => {
    const totalPreguntas = JSON.parse(examen?.arraydatos ?? '').length
    let aciertos = 0
    JSON.parse(examen?.arraydatos ?? '').forEach((exa: valuesPreguntas, index: number) => {
      exa.respuestas.forEach((respuesta, respuestaIndex: number) => {
        if (respuesta.esCorrecta && (renderLetter(respuestaIndex) == selectedAnswers[index])) {
          aciertos++
        }
      })
    })
    const calificacion = (aciertos / totalPreguntas) * 10 // Puedes ajustar la escala según tus necesidades
    return { calificacion }
  }

  const actualizarProgresoClase = (): void => {
    setProgresoClases((prevProgreso) => {
      const nuevoProgreso = { ...prevProgreso }
      nuevoProgreso[(cursoId) ?? ''] = nuevoProgreso[(cursoId) ?? ''] || {}
      nuevoProgreso[(cursoId) ?? ''][claseId ?? ''] = true
      const actualizarProgreso = async (): Promise<void> => {
        const data = new FormData()
        data.append('progreso', JSON.stringify(nuevoProgreso))
        data.append('_method', 'PUT')
        try {
          const resultado = await axios.post(
            `${Global.url}/saveProgreso/${auth.id ?? ''}`,
            data,
            {
              headers: {
                Authorization: `Bearer ${
                  tokenUser !== null && tokenUser !== '' ? tokenUser : ''
                }`
              }
            }
          )
          if (resultado.data.status == 'success') {
            getApuntes()
          }
        } catch (error: unknown) {
          console.log(error)
        }
      }
      actualizarProgreso()
      return nuevoProgreso
    })
  }

  const reiniciarExamen = (): void => {
    // Lógica para reiniciar el examen
    setCurrentQuestion(0)
    setSelectedAnswers({})
    setAllQuestionsAnswered(false)
    // Restablecer otras variables de estado según sea necesario
  }

  const { aciertos, calificacion, totalPreguntas } = calcularCalificacion()
  return (
    <>
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-10 lg:items-center mt-10 mb-10 ">
        {!loading
          ? (
          <h1 className="text-[2.7rem] font-bold">{examen?.titulo}</h1>
            )
          : null}
        <CantidadClases contenidos={contenido} claseId={claseId} />
      </div>
      {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      examenes?.id && !loading && !reiniciar
        ? <div className="w-full justify-center flex-col my-20">
          <h2 className="uppercase text-5xl text-center">
            Resultados de tu exámen
          </h2>
          <div className="my-10 bg-secondary-100 w-fit flex p-6 rounded-xl mx-auto">
            <div className="flex gap-4 flex-col justify-between items-center px-10">
              <span className="font-bold text-7xl">{(calificacion).toFixed(1)} </span>
              <span className="text-3xl text-secondary-150">Calificación</span>
            </div>
            <div className="flex gap-4 flex-col justify-between items-center px-10">
              <span className="font-bold text-6xl">
                {aciertos} <span className="text-secondary-150">/{totalPreguntas}</span>
              </span>
              <span className="text-3xl text-secondary-150">Aciertos</span>
            </div>
          </div>
          {parseFloat(calificacion.toFixed(1)) < 6.5 &&
          <div className='py-6 w-full flex justify-center'>
            <button
            onClick={() => { reiniciarExamen(); setReiniciar(true) }}
            className='w-fit bg-secondary-50 py-4 px-6 rounded-lg text-3xl hover:bg-secondary-70/70 transition-all'>Reintentar</button>
          </div>
        }
          <section className="lg:bg-[#13203E] rounded-xl">
            <div className="w-full lg:w-[700px] lg:px-10 mx-auto py-10 ">
              {JSON.parse(examen?.arraydatos ?? '').map(
                (exa: valuesPreguntas, index: number) => (
                  <div
                    className="border-b py-10 border-secondary-10"
                    key={index}
                  >
                    <div className="flex items-center gap-4 mb-10">
                      <p className="w-full uppercase text-3xl lg:text-4xl text-left font-bold ">
                        {index + 1}. {exa.pregunta}
                      </p>
                    </div>
                    {/* {examenes?.contenido[index] == index && */}
                    <ol className="flex flex-col gap-10">
                      {exa.respuestas.map(
                        (respuesta, respuestaIndex: number) => (
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-expect-error
                          examenes?.contenido[index] == renderLetter(respuestaIndex) &&
                          <>
                            <li
                                key={respuestaIndex}
                                className={`border-gray-500 border-2 px-4 py-6 text-2xl lg:text-3xl rounded-xl flex items-center relative group transition-colors pr-40 ${
                                respuesta.esCorrecta
                                    ? 'border-green-600' // Cambia este estilo según lo que necesites para resaltar
                                    : 'border-red-600'
                                }`}
                            >
                                <span
                                className={`flex items-center px-4 bg-gray-500 ${
                                    respuesta.esCorrecta
                                    ? 'bg-green-600' // Cambia este estilo según lo que necesites para resaltar
                                    : 'bg-red-600'
                                }  absolute left-0 top-0 bottom-0 justify-center m-auto w-16 transition-colors`}
                                >
                                {renderLetter(respuestaIndex)}
                                </span>
                                <p className="pl-16">{respuesta.texto}</p>
                                <img
                                src={`${Global.urlImages}/examenes/${
                                    // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
                                    respuesta.imagen?.preview ?? ''
                                }`}
                                alt=""
                                className="h-full w-20 lg:w-40 absolute right-0 object-cover object-right cursor-pointer"
                                onClick={() => {
                                  setOpen(true)
                                  setVerImagen(
                                    // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
                                    respuesta.imagen?.preview ?? ''
                                  )
                                }}
                                />
                            </li>
                            {!respuesta.esCorrecta && parseFloat(calificacion.toFixed(1)) >= 6.5 &&
                                <span className='text-green-600 transition-colors cursor-pointer hover:text-green-700 text-2xl underline font-bold'
                                onClick={() => { setOpenRespuesta(true); setRespuestaCorrecta(exa.respuestas) }}
                                >Ver respuesta correcta</span>
                            }
                          </>
                        )
                      )}
                    </ol>

                  </div>
                )
              )}
            </div>
          </section>
        </div>
        : (
        <section className="w-full h-full ">
          {!estado
            ? <div className="w-full h-full flex items-center justify-center flex-col gap-10 pt-32">
              <img src={image} alt="" className="w-[500px] object-contain" />
              <button
                className="w-fit px-6 py-6 rounded-lg text-3xl bg-secondary-200 hover:bg-secondary-200/70 transition-colors text-black font-bold"
                onClick={() => {
                  setEstado(true)
                }}
              >
                Empezar examén
              </button>
            </div>
            : (
            <div className="w-full">
              <div className="w-full mt-32 max-w-[800px] mx-auto">
                {JSON.parse(examen?.arraydatos ?? '').map(
                  (exa: valuesPreguntas, index: number) =>
                    index == currentQuestion && (
                      <Fragment key={index}>
                        <div className="flex items-center gap-4">
                          <div className="flex-grow bg-gray-300 h-2 rounded-full relative">
                            {currentQuestion >= 0 && (
                              <span className="absolute -top-16 text-3xl text-gray-400 right-0">
                                Pregunta {currentQuestion + 1} de{' '}
                                {JSON.parse(examen?.arraydatos ?? '').length}
                              </span>
                            )}
                            <div
                              className="bg-secondary-200 h-2 rounded-full w-full max-w-full"
                              style={{
                                width: `${
                                  (index / exa.respuestas.length) * 100
                                }%`
                              }}
                            />
                          </div>
                        </div>
                        <p className="w-full uppercase text-4xl text-left font-bold my-16">
                          {index + 1}. {exa.pregunta}
                        </p>
                        {exa.imagen?.preview && (
                          <img
                            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-base-to-string
                            src={`${Global.urlImages}/examenes/${exa.imagen.preview}`}
                            className="w-full mx-auto max-h-[300px] object-contain mb-16 cursor-pointer"
                            onClick={() => {
                              setOpen(true)
                              setVerImagen(
                                // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
                                exa.imagen?.preview ?? ''
                              )
                            }}
                            alt=""
                          />
                        )}
                        <ol className="flex flex-col gap-10">
                          {exa.respuestas.map(
                            (respuesta, respuestaIndex: number) => (
                              <li
                                key={respuestaIndex}
                                onClick={() => {
                                  handleAnswerSelection(respuestaIndex)
                                }}
                                className={`${
                                  respuesta.imagen?.preview ? 'h-52' : ''
                                } ${
                                  selectedAnswers[currentQuestion] ==
                                  renderLetter(respuestaIndex)
                                    ? 'border-secondary-200'
                                    : ''
                                }
                            border-gray-500 hover:border-secondary-200 border-2 px-4 py-6 text-3xl rounded-xl flex items-center relative group transition-colors cursor-pointer pr-40 `}
                              >
                                <span
                                  className={`${
                                    selectedAnswers[currentQuestion] ==
                                    renderLetter(respuestaIndex)
                                      ? 'bg-secondary-200'
                                      : ''
                                  } flex items-center px-4 bg-gray-500 group-hover:bg-secondary-200 absolute left-0 top-0 bottom-0 justify-center m-auto w-16 transition-colors`}
                                >
                                  {renderLetter(respuestaIndex)}
                                </span>
                                <p className="pl-16">{respuesta.texto}</p>

                                <img
                                  src={`${Global.urlImages}/examenes/${
                                    // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
                                    respuesta.imagen?.preview ?? ''
                                  }`}
                                  alt=""
                                  className="h-full w-40 absolute right-0 object-cover object-right"
                                  onClick={() => {
                                    setOpen(true)
                                    setVerImagen(
                                      // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
                                      respuesta.imagen?.preview ?? ''
                                    )
                                  }}
                                />
                              </li>
                            )
                          )}
                        </ol>
                        <div className="w-full flex justify-end">
                          {currentQuestion < exa.respuestas.length && (
                            <button
                              onClick={handleNextQuestion}
                              className="bg-secondary-200 hover:bg-secondary-200/70 px-5 py-6 rounded-xl mt-16 text-2xl text-black font-bold transition-colors"
                            >
                              Siguiente
                            </button>
                          )}
                        </div>
                        <div className="w-full flex justify-end">
                          {currentQuestion == exa.respuestas.length && (
                            <button
                              onClick={() => {
                                mostrarResultados()
                              }}
                              disabled={!allQuestionsAnswered}
                              className={`${
                                !allQuestionsAnswered
                                  ? 'bg-secondary-200/70'
                                  : 'bg-secondary-200'
                              } transition-colors hover:bg-secondary-200/70 px-5 py-6 rounded-xl mt-16 text-2xl text-black font-bold`}
                            >
                              Terminar Examen
                            </button>
                          )}
                        </div>
                      </Fragment>
                    )
                )}
              </div>
            </div>
              )}
        </section>
          )}
        <ViewRespuesta open={openRespuesta} setOpen={setOpenRespuesta} respuesta={respuestaCorecta}/>
        <ViewImage open={open} setOpen={setOpen} imagen={verImagen} />
    </>
  )
}
