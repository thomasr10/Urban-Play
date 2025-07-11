import { Users } from 'lucide-react';

function GroupChat ({ activityName, messageSender, messageContent, onClick}) {

    return (
        <div onClick={onClick} className="group-chat">
            <div className="group-chat-content">
                <div className="group-chat-pp">
                    <div className="background">
                        <Users className='icon'/>
                    </div>
                </div>
                <div className="message-container">
                    <span className="activity-name">{ activityName }</span>
                    <p className="message-content">
                        <span>{ messageSender }</span>
                        { messageContent }
                    </p>
                </div>
            </div>
        </div>
    )
}

export default GroupChat;