import { type ChangeEvent, useState } from 'react'
import { FaTimes, FaFilePdf } from 'react-icons/fa'
import { useEffect } from 'react'
import { Global } from '../../helper/Global'
interface PdfUpdateProps {
  onPdfChange: (pdf: File | null) => void
  initialPdfName: string
}

export function PdfUpdate (props: PdfUpdateProps): JSX.Element {
  const { onPdfChange, initialPdfName } = props
  const [pdfName, setPdfName] = useState<string>(initialPdfName)
  const [showPdf, setShowPdf] = useState<boolean>(initialPdfName !== '')

  const handlePdfChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const files = event.target.files

    if (files != null && files.length > 0) {
      const pdfFile = files[0]

      // Check if the selected file is a PDF
      if (pdfFile.type === 'application/pdf') {
        onPdfChange(pdfFile)
        setPdfName(pdfFile.name)
        setShowPdf(true)
      } else {
        alert('Por favor, seleccione un archivo PDF válido.')
      }
    }
  }

  useEffect(() => {
    console.log(pdfName)
  }, [])

  const deletePdf = (): void => {
    onPdfChange(null)
    setPdfName('')
    setShowPdf(false)
  }

  const openPdf = (): void => {
    if (pdfName) {
      // Reemplaza con tu método preferido para abrir un PDF en una nueva pestaña o ventana
      window.open(`${Global.urlImages}/facturas/${pdfName}`, '_blank')
    }
  }

  return (
    <div className="w-full">
      {showPdf
        ? (
        <p className="text-white whitespace-nowrap overflow-hidden overflow-ellipsis w-40">
          {pdfName === 'null'
            ? (
            <>
              <label
                htmlFor="pdfInput"
                className="bg-secondary-70 px-4 pointer py-3 rounded-xl flex items-center gap-2 text-white font-bold"
              >
                <FaFilePdf className="icon-prepdf text-2xl" />
                Subir factura
              </label>

              <input
                accept=".pdf, application/pdf"
                id="pdfInput"
                className="d-none"
                type="file"
                name="pdfInput"
                onChange={handlePdfChange}
              />
            </>
              )
            : (
            <>
              <span className="bg-secondary-70 px-4 pointer py-3 rounded-xl flex items-center gap-2 text-white font-bold">
                <button
                  className="btn btn-danger mb-0 flex items-center justify-center text-red-600"
                  onClick={deletePdf}
                  type="button"
                >
                  <FaTimes className="w-full" />
                </button>
                <button
                  className="text-white font-bold flex gap-2 items-center"
                  onClick={openPdf}
                  type="button"
                >
                  Ver factura
                </button>
              </span>
            </>
              )}
        </p>
          )
        : (
            <>
                <label
                htmlFor="pdfInput"
                className="bg-secondary-70 px-4 pointer py-3 rounded-xl flex items-center gap-2 text-white font-bold"
              >
                <FaFilePdf className="icon-prepdf" />
                Subir factura
              </label>

              <input
                accept=".pdf, application/pdf"
                id="pdfInput"
                className="d-none"
                type="file"
                name="pdfInput"
                onChange={handlePdfChange}
              />
            </>
          )}
    </div>
  )
}
