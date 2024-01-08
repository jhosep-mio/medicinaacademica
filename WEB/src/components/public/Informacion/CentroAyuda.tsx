import { styled } from '@mui/material/styles'
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp'
import MuiAccordion, { type AccordionProps } from '@mui/material/Accordion'
import MuiAccordionSummary, {
  type AccordionSummaryProps
} from '@mui/material/AccordionSummary'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Header } from '../estructura/Header'
import { FooterTwo } from '../estructura/FooterTwo'
import useAuth from '../../../hooks/useAuth'

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0
  },
  '&:before': {
    display: 'none'
  }
}))

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)'
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1)
  }
}))

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)'
}))

export const CentroAyuda = (): JSX.Element => {
  const [expanded, setExpanded] = useState<string | false>('panel1')
  const { auth, loading } = useAuth()
  const navigate = useNavigate()
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      event.preventDefault()
      setExpanded(newExpanded ? panel : false)
    }
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (!loading && !auth.id) {
      navigate('/login')
    }
  }, [auth.id, loading])

  return (
    <>
      <Header />
      <section className="politicas">
        <div className="politicas__title">
          <h2>Centro de ayuda</h2>
        </div>
        <div className="politicas__info">
        <h2 className="text-5xl mb-6 pl-3 text-primary font-bold mt-10">
            Generales
          </h2>
          <Accordion
            expanded={expanded === 'panel1'}
            onChange={handleChange('panel1')}
          >
            <AccordionSummary
              aria-controls="panel1d-content"
              id="panel1d-header"
            >
              <Typography>1. ¿Quién calificará mis proyectos? </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <p>
                En los cursos de MEDICINA ACADEMICA, realizarás proyectos que
                tendrás que completar para obtener tu diploma. Estos proyectos
                se completan en la misma aula virtual.
              </p>
              <p className="mt-10">
                Cuando envíes tus proyectos recibirás valiosas
                retroalimentaciones por parte de un mentor especializado y/o
                nuestro equipo en MEDICINA ACADEMICA.
              </p>
              <p className="mt-10">
                Es importante destacar que el profesor solo podrá proporcionarte
                feedback cuando hayas completado las indicaciones brindadas.
              </p>
              <p className="mt-10">
                El plazo estimado para recibir feedback sobre tu proyecto es de
                48 horas. En caso de que este tiempo se exceda, por favor
                contáctanos escribiendo a{' '}
                <a
                  href="mailto:hola@medicinaacademica.com"
                  className="text-blue-500 underline"
                >
                  hola@medicinaacademica.com
                </a>{' '}
                y proporcionando la siguiente información:
              </p>
              <ol>
                <li>1. Correo electrónico registrado en MEDICINA ACADEMICA.</li>
                <li>2. Enlace de tu proyecto final.</li>
              </ol>
              <p className="mt-10">
                Estamos comprometidos a brindarte el mejor servicio, y tu
                retroalimentación es fundamental para garantizar una experiencia
                educativa excepcional. ¡No dudes en comunicarte con nosotros!
              </p>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === 'panel2'}
            onChange={handleChange('panel2')}
          >
            <AccordionSummary
              aria-controls="panel2d-content"
              id="panel2d-header"
            >
              <Typography>
                2. ¿Cómo completo un curso en su totalidad para obtener mi
                certificado?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <p>
                Para completar un curso en MEDICINA ACADEMICA, es esencial que
                visualices todas las clases en un 100% y realices todos los
                proyectos y exámenes en el aula virtual. Una vez logrado este
                hito, podrás cargar tus avances y entregables. Obtén más
                detalles sobre este proceso aquí: ¿Cómo subo mi proyecto?{' '}
                <Link to="/mis_cursos" className="underline text-blue-500">
                  Aula virtual
                </Link>
              </p>
              <p className="mt-10">
                En el caso de que hayas concluido el curso pero no observes un
                avance del 100%, no dudes en contactarnos enviándonos un mensaje
                que incluya la siguiente información:
              </p>
              <ol>
                <li>1. Correo electrónico registrado en MEDICINA ACADEMICA.</li>
                <li>2. Nombre del curso cuyo progreso no muestra el 100%.</li>
                <li>3. Captura de pantalla que refleje tu situación.</li>
              </ol>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === 'panel3'}
            onChange={handleChange('panel3')}
          >
            <AccordionSummary
              aria-controls="panel3d-content"
              id="panel3d-header"
            >
              <Typography>
                3. ¿Puedo ver mi curso cuantas veces quiera?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <p>
                En MEDICINA ACADEMICA, todo nuestro contenido está disponible al
                100% en línea, conformado por clases pregrabadas a las cuales
                tendrás acceso exclusivo al ser parte de nuestra comunidad. Al
                inscribirte en cualquiera de nuestros cursos, se te otorga
                acceso ilimitado, lo que significa que puedes disfrutar de las
                clases donde, cuando y cuantas veces desees.
              </p>
              <p className="mt-10">
                Una vez que activas los cursos en tu perfil, permanecen
                disponibles para que los explores y revises a tu propio ritmo.
              </p>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === 'panel4'}
            onChange={handleChange('panel4')}
          >
            <AccordionSummary
              aria-controls="panel4d-content"
              id="panel4d-header"
            >
              <Typography>
                4. ¿Cuál es la modalidad de estudios en Medicina Académica?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <p>¡En MEDICINA ACADEMICA, aprendes a tu propio ritmo!</p>
              <p className="mt-10">
                Todo nuestro contenido se encuentra disponible al 100% en
                nuestra exclusiva aula virtual a la que puedes acceder desde
                cualquier parte del mundo mediante tu celular o computadora. Al
                inscribirte en cualquiera de nuestros cursos, obtienes acceso
                ilimitado. Esto significa que puedes disfrutar de las clases
                donde, cuando y cuantas veces lo desees. Una vez activados en tu
                perfil, los cursos permanecerán ahí para siempre, permitiéndote
                revisar el contenido cuando te sea más conveniente. ¡Inicia y
                desarrolla tu aprendizaje a tu propio ritmo con MEDICINA
                ACADEMICA!
              </p>
              <p className="mt-10">
                *Condiciones aplicables, revisa los detalles en nuestra
                plataforma.
              </p>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === 'panel5'}
            onChange={handleChange('panel5')}
          >
            <AccordionSummary
              aria-controls="panel5d-content"
              id="panel5d-header"
            >
              <Typography>
                5. ¿Qué validez tienen los diplomas en Medicina Académica?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <p>
                Al finalizar cada uno de los cursos recibirás el certificado que
                respalda tu participación y dominio de los conocimientos
                adquiridos.
              </p>
              <p className="mt-10">
                El diploma que te otorgamos es oficial y lleva el respaldo por
                la CONSULTORÍA MEDICINA ACADEMICA, institución privada
                especializada en investigación biomédica registrada en Lima,
                Perú.
              </p>
              <p className="mt-10">
                Este certificado lo podrás incorporar a tu currículum y cuenta
                con un código de identificación único que puedes verificar en
                nuestra página web. No importa en qué rincón del mundo te
                encuentres; al destacar tus habilidades a través de tus logros,
                estarás fortaleciendo tu perfil profesional.
              </p>
              <p className="mt-10">
                Recuerda que puedes descargar tus diplomas directamente desde tu
                panel personal en:{' '}
                <Link to="/mis_constancias" className="underline text-blue-500">
                  Mi panel
                </Link>
                .
              </p>
              <p className="mt-10">
                ¡Atrévete a potenciar tu carrera! Estoy emocionado/a de tenerte
                en nuestras clases.
              </p>
            </AccordionDetails>
          </Accordion>
        </div>

        <div className="politicas__info">
          <h2 className="text-5xl mb-6 pl-3 text-primary font-bold mt-10">
            Pagos
          </h2>
          <Accordion
            expanded={expanded === 'panel10'}
            onChange={handleChange('panel10')}
          >
            <AccordionSummary
              aria-controls="panel10d-content"
              id="panel10d-header"
            >
              <Typography>1. ¿Cuáles son los métodos de pago?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <p>
                Puedes adquirir un curso o formación desde cualquier parte del
                mundo mediante tarjeta de crédito/débito Visa o Mastercard.
              </p>
              <p className="mt-10">
                Además, si vives en Perú. Puedes realizar el pago mediante
                transferencia bancaria a nuestras cuentas BBVA y BCP.
              </p>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === 'panel12'}
            onChange={handleChange('panel12')}
          >
            <AccordionSummary
              aria-controls="panel12d-content"
              id="panel12d-header"
            >
              <Typography>2. ¿Emiten factura?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <p>
                Sí, emitimos boletas electrónicas siempre que se adquiere un
                curso que podrás visualizar en el aula virtual en la sección de{' '}
                <Link to="/mis_compras" className="underline text-blue-500">
                  Mis compras
                </Link>
                . Si deseas factura electrónica por favor compra el curso como
                si fueras una empresa y rellena los datos de RUC y Razón social.
              </p>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === 'panel13'}
            onChange={handleChange('panel13')}
          >
            <AccordionSummary
              aria-controls="panel13d-content"
              id="panel13d-header"
            >
              <Typography>3. ¿En qué moneda se realiza el pago?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <p>
                En Medicina Académica aceptamos pagos de cualquier parte del
                mundo. Mediante Mercado manejamos una sola moneda para todos
                nuestros estudiantes de habla hispana, y es el dólar (US$). Esto
                para que no tengan ningún inconveniente al momento de realizar
                el pago.
              </p>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === 'panel14'}
            onChange={handleChange('panel14')}
          >
            <AccordionSummary
              aria-controls="panel14d-content"
              id="panel14d-header"
            >
              <Typography>4. Mi tarjeta fue rechazada</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <p className="font-bold">
                Problemas con tu pago en MEDICINA ACADEMICA: Guía y soluciones
              </p>
              <p className="mt-6">
                Nos preocupamos por brindarte la mejor experiencia en nuestra
                plataforma, y entendemos que a veces pueden surgir
                inconvenientes al realizar pagos. Aquí te ofrecemos información
                detallada sobre posibles problemas y soluciones
              </p>
              <ul className="mt-10">
                <li className="font-bold">
                  A. Insuficiencia de saldo en tu tarjeta
                </li>
                <ul className="pt-0 pl-10">
                  <li>
                    1. Verifica que tu tarjeta cuente con saldo suficiente.
                  </li>
                  <li>
                    2. Recuerda que manejamos exclusivamente la moneda
                    estadounidense (US$) para todos nuestros estudiantes de
                    habla hispana.
                  </li>
                </ul>
                <li className="font-bold">B. ¿En qué moneda?</li>
                <ul className="pt-0 pl-10">
                  <li>
                    El precio en tu moneda local es aproximado y puede variar
                    debido al tipo de cambio, tu banco y la cotización del día.
                  </li>
                </ul>
                <li className="font-bold">
                  C. Limitaciones para transacciones internacionales
                </li>
                <ul className="pt-0 pl-10">
                  <li>
                    Confirma con tu banco si tu tarjeta está habilitada para
                    transacciones internacionales y en dólares.
                  </li>
                </ul>
                <li className="font-bold">
                  D. Declinación directa por tu Banco
                </li>
                <ul className="pt-0 pl-10">
                  <li>
                    Si recibes el mensaje{' '}
                    {'"No se pudo procesar tu pago. Comunícate con tu banco"'},
                    tu tarjeta podría no permitir ese tipo de transacciones.
                    Verifica con tu banco y asegúrate de que todo esté en orden.
                  </li>
                </ul>
                <li className="font-bold">
                  E. ¿Qué hacer si todo está bien, pero el problema persiste?
                </li>
                <ul className="pt-0 pl-10">
                  <li>Intenta nuevamente realizar el pago.</li>
                  <li>
                    Si persiste el inconveniente, ofrecemos la opción de generar
                    un ticket de Paypal para el pago. Este ticket se envía a tu
                    correo y no requiere una cuenta de Paypal. Es esencial
                    enviarnos tu comprobante de pago para activar tu orden
                    manualmente.
                  </li>
                </ul>
              </ul>
            </AccordionDetails>
          </Accordion>
        </div>

        {/* <div className="politicas__info">
          <h2 className="text-5xl mb-6 pl-3 text-primary font-bold mt-10">
            Generales
          </h2>
          <Accordion
            expanded={expanded === 'panel110'}
            onChange={handleChange('panel110')}
          >
            <AccordionSummary
              aria-controls="panel110d-content"
              id="panel110d-header"
            >
              <Typography>1. ¿Quiénes somos?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <p>
                Somos una distinguida red privada de profesionales de la salud
                con una sólida trayectoria en investigación y producción
                científica, la cual ha sido publicada en revistas de renombre.
                Nos enorgullece contar con expertos que han contribuido
                significativamente al avance del conocimiento médico. Estamos
                comprometidos con la excelencia académica y nos esforzamos por
                compartir nuestro profundo conocimiento a través de programas
                educativos de alta calidad en el ámbito de la medicina.
              </p>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === 'panel112'}
            onChange={handleChange('panel112')}
          >
            <AccordionSummary
              aria-controls="panel112d-content"
              id="panel112d-header"
            >
              <Typography>
                1. ¿El acceso a los cursos es para siempre?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <p>
                Absolutamente, el acceso a nuestros cursos es de duración
                ilimitada. Creemos en brindar a nuestros estudiantes la
                flexibilidad necesaria para que puedan revisar y consolidar sus
                conocimientos en medicina a su propio ritmo, garantizando un
                aprendizaje duradero y efectivo a lo largo del tiempo.
              </p>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === 'panel113'}
            onChange={handleChange('panel113')}
          >
            <AccordionSummary
              aria-controls="panel113d-content"
              id="panel113d-header"
            >
              <Typography>3. ¿Tienen política de reembolso?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <p>
                Valoramos la satisfacción de nuestros estudiantes. Si en algún
                momento no estás completamente satisfecho con un curso, por
                favor, contáctanos dentro de los 7 días posteriores a la
                adquisición, proporcionando tus razones. Estaremos encantados de
                procesar tu reembolso y trabajar contigo para garantizar una
                experiencia educativa que cumpla con tus expectativas.
              </p>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === 'panel114'}
            onChange={handleChange('panel114')}
          >
            <AccordionSummary
              aria-controls="panel114d-content"
              id="panel114d-header"
            >
              <Typography>
                4. ¿Cómo se genera el certificado y a nombre de quién es el
                certificado?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <p className="">
                El certificado será generado automáticamente una vez que hayas
                completado todas las lecciones y tareas dentro de cada curso.
                Este documento respalda tu dedicación y éxito en la adquisición
                de conocimientos médicos especializados, proporcionándote un
                reconocimiento formal de tus logros en nuestra plataforma
                educativa en medicina.
              </p>
              <p className="mt-6">
                Si no entro a mi clase en vivo, ¿puedo verlo grabado? Sí, todas
                las clases en vivo de nuestros cursos son grabadas y se
                encuentran disponibles para su revisión dentro de la sección
                dedicada de cada curso. Esto brinda a nuestros estudiantes la
                flexibilidad de acceder a los contenidos en cualquier momento
                que les resulte conveniente, garantizando así una experiencia de
                aprendizaje adaptada a sus necesidades individuales
              </p>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === 'panel15'}
            onChange={handleChange('panel15')}
          >
            <AccordionSummary
              aria-controls="panel15d-content"
              id="panel15d-header"
            >
              <Typography>
                5. ¿Cuál es la diferencia entre un curso asincrónico y
                sincrónico?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <p>
                Nuestros cursos sincrónicos, con una duración de 4 a 6 semanas,
                ofrecen una experiencia de aprendizaje en tiempo real. Estos
                cursos incluyen talleres en vivo en grupos reducidos, donde
                nuestros expertos facilitan ejercicios prácticos y proporcionan
                asesorías personalizadas para una interacción más enriquecedora.
                Por otro lado, los cursos asíncronos te permiten avanzar a tu
                propio ritmo, accediendo y completando las lecciones de manera
                flexible directamente en nuestra plataforma web.
              </p>
            </AccordionDetails>
          </Accordion>
        </div> */}
      </section>

      <FooterTwo />
    </>
  )
}
