import { type editorValues } from './Interfaces'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const Editor = ({ content, setContent }: editorValues): JSX.Element => {
  return (
    <ReactQuill theme="snow" value={content} onChange={setContent} className='h-44'/>
  )
}

export default Editor
