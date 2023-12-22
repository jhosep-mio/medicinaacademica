import React from 'react'
import { FaMinus } from 'react-icons/fa'
import useAuth from '../../../hooks/useAuth'
import { type carrito } from '../Interfaces'

interface ComponentProps {
  producto: carrito
}

export const DecrementProducto: React.FC<ComponentProps> = ({
  producto
}): JSX.Element => {
  const { cart, setCart } = useAuth()

  function decreaseItemQuantity (producto: carrito): void {
    const itemIndex = cart.findIndex(
      (item) => item.id === producto.id && item.nombre === producto.nombre
    )

    if (itemIndex !== -1) {
      const updatedItems = [...cart]
      const item = updatedItems[itemIndex]

      if (item.cantidad === 1) {
        // Si la cantidad es 1, eliminar el objeto del carrito
        updatedItems.splice(itemIndex, 1)
      } else {
        if (item.cantidad !== null) {
          item.cantidad -= 1
        }
      }

      setCart(updatedItems)
      localStorage.setItem('cart', JSON.stringify(updatedItems))
    }
  }
  return (
    <FaMinus
      onClick={() => {
        decreaseItemQuantity(producto)
      }}
    />
  )
}
