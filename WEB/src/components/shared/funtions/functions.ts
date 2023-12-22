export function formatearURL (nombre: string): string {
  // Eliminar espacios al principio y al final del nombre
  let url = nombre.trim()
  // Convertir a minúsculas
  url = url.toLowerCase()
  // Reemplazar espacios por guiones
  url = url.replace(/ /g, '-')
  // Reemplazar barras '/' por nada (eliminarlas)
  url = url.replace(/\//g, '')
  return url
}

export const formatearNombreArchivo = (nombreArchivoCompleto: string): string => {
  // Dividir el nombre del archivo en partes usando '_' como delimitador
  const partes = nombreArchivoCompleto.split('_')
  // Obtener la última parte, que es el nombre real del archivo
  const nombreRealArchivo = partes[partes.length - 1]
  return (nombreRealArchivo)
}

export function convertFormattedTimeToSeconds (formattedTime: string): number {
  const parts = formattedTime.split(':').map(part => parseInt(part, 10))
  return parts[0] * 3600 + parts[1] * 60 + parts[2]
}

export const formatTime = (seconds: number): string => {
  const pad = (num: number, size: number): string => num.toString().padStart(size, '0')
  const hours = pad(Math.floor(seconds / 3600), 2)
  const minutes = pad(Math.floor((seconds % 3600) / 60), 2)
  const sec = pad(Math.floor(seconds % 60), 2)
  return `${hours}:${minutes}:${sec}`
}

export function extraerNumeroDesdeURL (url: string | undefined): string | undefined {
  if (url != undefined) {
    const matches = url.match(/\d+/)
    return matches ? matches[0] : undefined
  }
  return undefined
}
