import { useEffect, useState } from 'react'
import { type contenidosValues } from '../../../../shared/Interfaces'

export const CantidadClases = ({
  contenidos,
  claseId
}: {
  contenidos: contenidosValues[]
  claseId: string | undefined
}): JSX.Element => {
  const [posicionActual, setPosicionActual] = useState(0)
  const [encontrada, setEncontrada] = useState(false)

  // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
  const totalClases = contenidos.reduce((total, bloque) => total + bloque.contenido.length, 0)

  useEffect(() => {
    let posicionTemporal = 0
    let encontradaTemporal = false

    for (const bloque of contenidos) {
      if (encontradaTemporal) break

      for (let index = 0; index < bloque.contenido.length; index++) {
        if (bloque.codClases && bloque.codClases[index] === claseId) {
          encontradaTemporal = true
          setPosicionActual(posicionTemporal + 1) // Sumamos 1 porque los índices comienzan en 0
          break
        }
        posicionTemporal++
      }
    }

    setEncontrada(encontradaTemporal)
  }, [claseId, contenidos])

  return (
    <span className="text-secondary-10 text-3xl">
      {encontrada ? `Clase ${posicionActual} de ${totalClases}` : 'Clase no encontrada'}
    </span>
  )
}
