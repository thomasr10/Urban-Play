import { TriangleAlert } from 'lucide-react';

function SignalButton () {

    function test () {
        alert('Activité signalée');
    }

    return (
        <button className='signal-btn' onClick={test}><TriangleAlert /> Signaler </button>
    )
}

export default SignalButton;