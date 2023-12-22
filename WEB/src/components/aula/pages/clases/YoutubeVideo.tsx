import { useEffect, type Dispatch, type SetStateAction } from 'react'
import YouTube from 'react-youtube'
import { formatTime } from '../../../shared/funtions/functions'

interface values {
  videoId: string
  player: string | null
  setPlayer: Dispatch<SetStateAction<string | null>>
  onVideoProgress: (progress: number, formattedTime: string) => void
}

export const YoutubeVideo = ({ videoId, onVideoProgress, player, setPlayer }: values): JSX.Element => {
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

  return <YouTube videoId={videoId} opts={opts} onReady={onReady} className='w-full h-full'/>
}
