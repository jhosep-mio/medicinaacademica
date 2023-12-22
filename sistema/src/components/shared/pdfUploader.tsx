import { type ChangeEvent, useState } from 'react'
import { FaTimes, FaFilePdf } from 'react-icons/fa'

interface PdfUploaderProps {
  setPdf: (pdf: File | null) => void
  clase: string
}

export function PdfUploader (props: PdfUploaderProps): JSX.Element {
  const { setPdf, clase } = props
  const [pdfName, setPdfName] = useState<string>('')
  const [showPdf, setShowPdf] = useState<boolean>(false)

  const handlePdfChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const files = event.target.files

    if (files != null && files.length > 0) {
      const pdfFile = files[0]

      // Check if the selected file is a PDF
      if (pdfFile.type === 'application/pdf') {
        setPdf(pdfFile)
        setPdfName(pdfFile.name)
        setShowPdf(true)
      } else {
        alert('Por favor, seleccione un archivo PDF válido.')
      }
    }
  }

  const deletePdf = (): void => {
    setPdf(null)
    setPdfName('')
    setShowPdf(false)
  }

  const openPdf = (): void => {
    if (pdfName) {
      // Reemplaza con tu método preferido para abrir un PDF en una nueva pestaña o ventana
      window.open(`/path/to/pdfs/${pdfName}`, '_blank')
    }
  }

  return (
      <div className="w-full border p-4">
        <label
          htmlFor={`pdf${clase}`}
          className="btn btn-primary col-md-12 btn-openPdf cursor-pointer text-white"
        >
          <FaFilePdf className="icon-prepdf text-4xl" />
        </label>
        {showPdf
          ? (
          <span className="flex justify-center items-center text-white rounded-md mb-5 gap-2">
            <button
              className="btn btn-danger mb-0 flex items-center justify-center text-red-600"
              onClick={deletePdf}
            >
              <FaTimes className="w-full" />
            </button>
            <p className="text-white">{pdfName}</p>
            <button
              type='button'
              className="btn btn-primary mb-0 flex items-center justify-center"
              onClick={openPdf}
            >
              Abrir PDF
            </button>
          </span>
            )
          : (
              ''
            )}
        <input
          accept=".pdf, application/pdf"
          id={`pdf${clase}`}
          className="d-none"
          type="file"
          name={`pdf${clase}`}
          onChange={handlePdfChange}
        />
      </div>
  )
}
