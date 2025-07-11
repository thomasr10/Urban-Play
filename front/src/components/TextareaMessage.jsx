import { useRef, useState } from 'react';
import { Send } from 'lucide-react';

function TextareaMessage ({ onSend, handleKeyDown }) {

    const textareaRef = useRef(null);
    const [value, setValue] = useState('');

    function inputChanges (e) {
        const textarea = textareaRef.current;
        setValue(e.target.value);
        
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }

    function handleClick () {
        onSend(value);
        setValue('');
    }

    return (
        <>
        <textarea className='textarea-msg' ref={textareaRef} value={value} onChange={inputChanges} onKeyDown={handleKeyDown} placeholder='Écris un message' rows={1}></textarea>
        <button onClick={handleClick}><Send /></button>
        </>
    )
}

export default TextareaMessage;