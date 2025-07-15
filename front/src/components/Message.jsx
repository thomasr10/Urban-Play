function Message ({ content, senderId, senderName, userId, sentAt}) {

    const isMe = userId === senderId;

    return (
        <div className={isMe ? 'my-message' : 'others-message'}>
            <div className="bubble">
                <p>{ content }</p>
            </div>
            <div className="infos">
                { !isMe && <span>{ senderName } - </span>}
                <span>{ sentAt }</span>
            </div>
        </div>
    )
}

export default Message;