const MessageBox = ({name, time, message, owner = false}:
    {name: string, time: string, message: string, owner: boolean}) => {

    let alignstring = "";
    let messagestring = "recieved-message";
    if (owner) {
        alignstring = "align-right";
        messagestring = "sent-message"
    }

    return (<>
        <li className={owner ? "clearfix" : ""}>
            <div className={alignstring}>
                <span className={"message-data-name"}>{name}</span>
                <span className={"message-data-time"}>{time}</span>
            </div>
            <div className={"message " + messagestring}>{message}</div>
        </li>
    </>);
}

export default MessageBox