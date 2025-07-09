import { TriangleAlert } from 'lucide-react';

function SignalButton () {

    function test () {
        alert('signal');
    }

    return (
        <button className='signal-btn' onClick={test}><TriangleAlert /> Signaler </button>
    )
}

export default SignalButton;