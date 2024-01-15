import { useEffect, useRef } from 'react'
import useAuth from '../../../hooks/useAuth'
import { v4 as uuidv4 } from 'uuid'
import { type datosValues } from '../../shared/Interfaces'
import axios from 'axios'
import { Global } from '../../../helper/Global'
import { useNavigate } from 'react-router-dom'
export const Paypal = ({ data, datos }: { data: string, datos: datosValues | null }): JSX.Element => {
  const paypal = useRef()
  const { cart, auth } = useAuth()
  const navigate = useNavigate()

  function calculateTotal (): number {
    let total = 0
    for (let i = 0; i < cart.length; i++) {
      const item = cart[i]
      if (item.precio !== null && item.cantidad) {
        const subtotal = item.precio * item.cantidad
        total += subtotal
      }
    }
    return total // Redondeamos a dos decimales
  }

  useEffect(() => {
    if (data) {
      const uniqueId = uuidv4()
      let dataempresa: any = null
      if (datos?.nombre_empresa && datos?.ruc && datos?.direccion_fiscal) {
        dataempresa = {
          nombre_empresa: datos?.nombre_empresa,
          ruc: datos?.ruc,
          direccion_fiscal: datos?.direccion_fiscal
        }
      }
      const total = (calculateTotal() / Number(data)).toFixed(2)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      window.paypal
        .Buttons({
          createOrder: (_data: any, actions: any, _err: any) => {
            const orderItems = cart.map((producto) => ({
              name: producto.nombre,
              description: producto.nombre,
              sku: producto.id,
              unit_amount: {
                currency_code: 'USD',
                value: (producto.precio / Number(data)).toFixed(2)
              },
              quantity: '1'
            }))
            return actions.order.create({
              intent: 'CAPTURE',
              purchase_units: [
                {
                  reference_id: uniqueId,
                  description: 'MEDICINA ACADÉMICA',
                  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                  custom_id: `custon_${uniqueId}`,
                  soft_descriptor: 'MEDICINA ACADÉMICA',
                  amount: {
                    currency_code: 'USD',
                    value: total,
                    breakdown: {
                      item_total: {
                        currency_code: 'USD',
                        value: total
                      }
                    }
                  },
                  items: orderItems
                }
              ]
            })
          },
          onApprove: async (_data: any, actions: any) => {
            const order = await actions.order.capture()
            const txm = order.purchase_units[0].payments.captures[0].id
            const token = localStorage.getItem('token')
            const data = new FormData()
            const uniqueId = uuidv4()
            console.log(order.purchase_units[0].amount.value)
            data.append('id_transaccion', txm)
            data.append('status', order.status)
            data.append('tipo', 'PAYPAL')
            data.append('order_id', uniqueId)
            data.append('nombres', datos?.nombres ?? '')
            data.append('apellidos', datos?.apellidos ?? '')
            data.append('email', datos?.email ?? '')
            data.append('celular', datos?.celular ?? '')
            data.append('comentario', auth.id ? auth.id : 'notiene')
            data.append('delivery', uniqueId)
            data.append('total_pago', order.purchase_units[0].amount.value)
            data.append('array_productos', JSON.stringify(order.purchase_units[0].items))
            data.append('estado', '0')
            data.append('datos_empresa', dataempresa ? JSON.stringify(dataempresa) : '')
            try {
              const respuesta = await axios.post(
                `${Global.url}/handleSuccessTransaction`,
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
                localStorage.setItem('cart', '[]')
                navigate(`/success-pago/${String(uniqueId)}`)
              }
            } catch (error) {
              console.log(error)
            }
          },
          onError: (err: any) => {
            console.log(err)
          }
        })
        .render(paypal.current)
    }
  }, [cart])

  return (
    <>
      <div className="">
        <div
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          ref={paypal}
          className='h-[45px] absolute inset-0 w-full opacity-0'
        ></div>
      </div>
    </>
  )
}
