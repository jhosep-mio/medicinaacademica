export const formatearNombreArchivo = (nombreArchivoCompleto: string): string => {
  // Dividir el nombre del archivo en partes usando '_' como delimitador
  const partes = nombreArchivoCompleto.split('_')
  // Obtener la última parte, que es el nombre real del archivo
  const nombreRealArchivo = partes[partes.length - 1]
  return (nombreRealArchivo)
}
