import { type editorValues } from './Interfaces'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const Editor2 = ({ content, setContent }: editorValues): JSX.Element => {
  return (
    <ReactQuill theme="snow" value={content} onChange={setContent} className='h-full w-full bg-white'/>
  )
}

export default Editor2
