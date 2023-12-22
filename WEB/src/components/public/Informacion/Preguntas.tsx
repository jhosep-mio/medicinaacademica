import { styled } from '@mui/material/styles'
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp'
import MuiAccordion, { type AccordionProps } from '@mui/material/Accordion'
import MuiAccordionSummary, {
  type AccordionSummaryProps
} from '@mui/material/AccordionSummary'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

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

const Preguntas = (): JSX.Element => {
  const [expanded, setExpanded] = useState<string | false>('panel1')

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      event.preventDefault()
      setExpanded(newExpanded ? panel : false)
    }
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  return (
    <>
      <section className="politicas">
        <div className="politicas__title">
          <h2>Preguntas frecuentes</h2>
        </div>
        <div className="politicas__info">
          <Accordion
            expanded={expanded === 'panel1'}
            onChange={handleChange('panel1')}
          >
            <AccordionSummary
              aria-controls="panel1d-content"
              id="panel1d-header"
            >
              <Typography>1. ¿Cómo funciona Medicina Académica? </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <p>
                Bienvenido a MEDICINA ACADEMICA, tu comunidad educativa global
                dedicada a la formación de profesionales en el campo de la
                medicina. Nos enorgullece ser tu aliado en el viaje hacia el
                crecimiento profesional y personal a través de experiencias
                educativas significativas. Nuestros cursos, diseñados
                específicamente para el ámbito médico, están disponibles
                completamente en línea y en español. La flexibilidad es clave,
                ya que puedes acceder a ellos cuando mejor se adapte a tu
                agenda, permitiéndote repetir las clases tantas veces como
                desees. Para comenzar tu viaje educativo, solo necesitas seguir
                estos simples pasos:
              </p>
              <ol>
                <li>
                  1. Crea tu cuenta en{' '}
                  <Link to="/" className="text-blue-500 underline">
                    www.medicinaacademica.com
                  </Link>{' '}
                  utilizando tu correo electrónico.
                </li>
                <li>
                  2. Explora nuestro catálogo de cursos en{' '}
                  <Link
                    to="/formacionacademica"
                    className="text-blue-500 underline"
                  >
                    www.medicinaacademica.com/cursos
                  </Link>{' '}
                  y filtra por categoría o nivel.
                </li>
                <li>
                  3. Una vez hayas seleccionado tu curso y completado la compra,
                  tendrás acceso inmediato e ilimitado a través de tu panel
                  personal. Todas nuestras clases son pregrabadas y 100% en
                  línea, lo que te permite avanzar a tu propio ritmo. Estamos
                  emocionados de tenerte en nuestra aula virtual. ¡Tu
                  aprendizaje comienza ahora en MEDICINA ACADEMICA!
                </li>
              </ol>
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
                2. ¿Quiénes son los profesores de Medicina Académica?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <p>
                En MEDICINA ACADEMICA, nos enorgullece contar con un equipo
                docente compuesto por profesionales altamente reconocidos en sus
                respectivos campos de especialización. Nuestros educadores son
                líderes destacados en la industria médica, asegurando que
                recibas la mejor formación de la mano de expertos.
              </p>
              <p className="mt-10">
                En MEDICINA ACADEMICA, creemos en brindarte acceso a los mejores
                recursos educativos y expertos para que tu experiencia de
                aprendizaje sea integral y enriquecedora. ¡Descubre más sobre
                tus profesores y únete a nuestra comunidad de aprendizaje hoy
                mismo!
              </p>
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
                3. ¿Quién debería tomar clases en Medicina Académica?{' '}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <p>
                En MEDICINA ACADEMICA, nos dedicamos a ofrecer una experiencia
                educativa excepcional para todas aquellas personas interesadas
                en adquirir o perfeccionar habilidades vitales para su
                desarrollo profesional en el ámbito de la medicina y la salud.
              </p>
              <p className="mt-10">
                Nuestra plataforma ha sido diseñada para satisfacer las
                necesidades de estudiantes y profesionales de la medicina,
                proporcionando cursos especializados que abarcan una amplia gama
                de disciplinas, desde anatomía y farmacología hasta prácticas
                clínicas avanzadas.
              </p>
              <p className="mt-10">
                Ya seas médico, enfermero, estudiante de medicina, o simplemente
                alguien apasionado por el mundo de la salud, en MEDICINA
                ACADEMICA encontrarás un espacio dedicado a potenciar tu
                conocimiento y habilidades.
              </p>
              <p className="mt-10">
                Explora nuestro catálogo de cursos en línea diseñados
                específicamente para el sector médico:{' '}
                <Link
                  to="/formacionacademica"
                  className="text-blue-600 underline"
                >
                  Cursos de Medicina academica
                </Link>
              </p>
              <p className="mt-10">
                No importa en qué etapa de tu carrera te encuentres, en MEDICINA
                ACADEMICA estamos comprometidos a proporcionarte recursos de
                aprendizaje de alta calidad que se adapten a tus objetivos
                profesionales y personales. ¡Descubre todo lo que tenemos para
                ofrecer y da el siguiente paso en tu viaje educativo en
                medicina!.
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
              <p className='mt-10'>
              Recuerda que puedes descargar tus diplomas directamente desde tu panel personal en: <Link to='/mis_constancias' className='underline text-blue-500'>Mi panel</Link>.
              </p>
              <p className='mt-10'>¡Atrévete a potenciar tu carrera! Estoy emocionado/a de tenerte en nuestras clases.</p>
            </AccordionDetails>
          </Accordion>
        </div>

        <div className="politicas__info">
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
        </div>
      </section>
    </>
  )
}

export default Preguntas
