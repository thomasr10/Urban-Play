import { TriangleAlert } from 'lucide-react';

function SignalButton ({ onClick }) {

    return (
        <button className='signal-btn' onClick={onClick}><TriangleAlert /> Signaler </button>
    )
}

export default SignalButton;