function Message ({ content, senderId, senderName, userId}) {

    return (
        <div className={userId === senderId ? 'my-message' : 'others-message'}>
            <span>{ senderName }</span>
            <p>{ content }</p>
        </div>
    )
}

export default Message;