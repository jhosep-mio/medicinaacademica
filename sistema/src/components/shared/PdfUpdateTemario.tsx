import { type ChangeEvent, useState, useEffect } from 'react'
import { FaTimes, FaFilePdf } from 'react-icons/fa'

interface PdfUpdateProps {
  onPdfChange: (pdf: File | null) => void
  initialPdfName: string
}

export function PdfUpdateTemario (props: PdfUpdateProps): JSX.Element {
  const { onPdfChange, initialPdfName } = props
  const [pdfName, setPdfName] = useState<string>(initialPdfName)

  const handlePdfChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const files = event.target.files

    if (files != null && files.length > 0) {
      const pdfFile = files[0]

      // Check if the selected file is a PDF
      if (pdfFile.type === 'application/pdf') {
        onPdfChange(pdfFile)
        setPdfName(pdfFile.name)
      } else {
        alert('Por favor, seleccione un archivo PDF válido.')
      }
    }
  }

  useEffect(() => {
    if (initialPdfName) {
      setPdfName(initialPdfName)
    }
  }, [initialPdfName])

  const deletePdf = (): void => {
    onPdfChange(null)
    setPdfName('')
  }

  return (
    <div className="w-full border p-4">
      <label
        htmlFor="pdfInput"
        className="btn btn-primary col-md-12 btn-openPdf cursor-pointer text-white"
      >
        <FaFilePdf className="icon-prepdf" />
      </label>

        <span className="flex justify-center items-center text-white rounded-md mb-5 gap-2">
          {pdfName &&
          <button
            type='button'
            className="btn btn-danger mb-0 flex items-center justify-center text-red-600"
            onClick={deletePdf}
          >
            <FaTimes className="w-full" />
          </button>
          }
          <p className="text-white whitespace-nowrap overflow-hidden overflow-ellipsis w-40">
            {pdfName ?? ''}
          </p>
        </span>

      <input
        accept=".pdf, application/pdf"
        id="pdfInput"
        className="d-none"
        type="file"
        name="pdfInput"
        onChange={handlePdfChange}
      />
    </div>
  )
}
