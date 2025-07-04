import Button from "./Button";

function MessageModal ({ title, message, btnMessage, to, onClose }) {
    
    return (
        <div className="modal-bg">
            <div className="modal-info">
                <div>
                    <h1>{ title }</h1>
                    <p>{ message }</p>
                </div>
                <div className="btn-container">
                    <Button to={to} onClick={!to ? onClose : undefined}>{ btnMessage }</Button>
                </div>
            </div>
        </div>
    )
}

export default MessageModal;