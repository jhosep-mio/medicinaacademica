import '@szhsin/react-menu/dist/index.css'
import '@szhsin/react-menu/dist/transitions/slide.css'
import { PiCertificateFill } from 'react-icons/pi'
import { useNavigate } from 'react-router-dom'

interface Props {
  ticket: string | undefined
  totalTickets: string | undefined
  total: number
}

const CardDiplomas = (props: Props): JSX.Element => {
  const { ticket, total } = props
  const navigate = useNavigate()

  let status = ''
  let textColor = ''

  switch (ticket) {
    case 'pending':
      status = 'bg-white/70 text-[#2a405d]'
      textColor = 'text-gray-300'
      break
    case 'inProcess':
      status = 'bg-blue-500/10 text-blue-500'
      textColor = 'text-blue-500'
      break
    case 'close':
      status = 'bg-green-500/10 text-green-500'
      textColor = 'text-green-500'
      break
    case 'total':
      status = 'bg-pink-500/10 text-pink-500'
      textColor = 'text-pink-500'
      break
  }

  return (
    <div className="bg-[#2a405d] hover:bg-[#304560] transition-all cursor-pointer hover:scale-105 hover:rotate-1 p-12 rounded-xl min-h-[283px]"
    onClick={() => { navigate('/mis_constancias') }}
    >
      <div className="flex items-center justify-between mb-4 ">
        <div className="flex gap-6 items-center">
          <PiCertificateFill
            className={`text-4xl lg:text-5xl ${status} p-6 box-content rounded-full text-green-700`}
          />
          <h1 className="text-3xl lg:text-4xl text-white font-bold">Diplomas obtenidas</h1>
        </div>
      </div>
      {/* Number of tickets */}
      <div className="mt-10">
        <p className={`${textColor} text-4xl lg:text-5xl text-left  w-fit`}>
          {total} diplomas en total
        </p>
      </div>
      <hr className="border border-dashed border-green-700 mt-8 mb-14" />
      <div className="flex">
        <button type='button' className="w-fit px-6 block text-3xl bg-secondary-200 py-3 "

        >
          Ver diplomas
        </button>
      </div>
      <div className="w-full grid grid-cols-5 justify-center items-center"></div>
    </div>
  )
}

export default CardDiplomas
