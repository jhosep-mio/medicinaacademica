import { useEffect, type Dispatch, type SetStateAction } from 'react'
import YouTube from 'react-youtube'
import { formatTime } from '../../../shared/funtions/functions'

interface values {
  videoId: string
  player: string | null
  setPlayer: Dispatch<SetStateAction<string | null>>
  onVideoProgress: (progress: number, formattedTime: string) => void
  actualizarProgresoClase: (
    cursoId: string | undefined,
    claseId: string | undefined
  ) => void
  cursoId: string | undefined
  claseId: string | undefined
}

export const YoutubeVideo = ({
  videoId,
  onVideoProgress,
  player,
  setPlayer,
  actualizarProgresoClase,
  cursoId,
  claseId
}: values): JSX.Element => {
  const onReady = (event: any): void => {
    // Acceso al reproductor en el objeto event
    setPlayer(event.target)
  }
  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 0,
      encryptedMedia: 0,
      modestbranding: 0, // Evita mostrar el logo de YouTube
      controls: 1, // No mostrar controles del reproductor
      showinfo: 0, // No mostrar información del video al inicio
      rel: 0, // No mostrar videos relacionados al finalizar
      fs: 0, // Deshabilitar el botón de pantalla completa
      iv_load_policy: 0, // No mostrar anotaciones en video
      disablekb: 0 // Desactivar controles del teclado
    }
  }

  const isValidYouTubeVideo = async (videoId: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}`
      )
      return response.ok
    } catch (error) {
      console.error('Error al verificar el video:', error)
      return false
    }
  }
  // Uso en useEffect
  useEffect(() => {
    const checkVideoValidity = async (): Promise<void> => {
      const isValidVideo = await isValidYouTubeVideo(videoId)
      if (!isValidVideo) {
        actualizarProgresoClase(cursoId, claseId)
      }
    }
    checkVideoValidity()
  }, [videoId])

  useEffect(() => {
    if (player) {
      const interval = setInterval(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const currentTime = player.getCurrentTime()
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const duration = player.getDuration()
        const percent = (currentTime / duration) * 100
        const formattedTime = formatTime(currentTime)
        onVideoProgress(percent, formattedTime)
      }, 1000)

      return () => {
        clearInterval(interval)
      }
    }
  }, [player, onVideoProgress])

  return (
    <YouTube
      videoId={videoId}
      opts={opts}
      onReady={onReady}
      className="w-full h-full"
    />
  )
}
