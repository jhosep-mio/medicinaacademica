import React from 'react'

interface ComponentProps {
  precio: number | null
  contador: number | null
}

export const Subtotal: React.FC<ComponentProps> = ({ precio, contador }): JSX.Element => {
  const calculateItemSubtotal = (precio: number | null, cantidad: number | null): string | undefined => {
    if (precio !== null && cantidad !== null) {
      const subtotal = precio * cantidad
      return subtotal.toFixed(2)
    }
  }

  return (
    <p className='font-bold'>
      S/.
      <span>
        {calculateItemSubtotal(precio, contador)}
      </span>
    </p>
  )
}
