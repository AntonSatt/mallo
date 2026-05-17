//components to display the chat window with messages.

const ChatWindow = ({ messages }) => {
    return (
        <div>
            <h3>Senaste meddelanden</h3>

            {messages.map((message, index) => (
                <div key={`${message.id}-${index}`}>
                    <strong>{message.senderId}</strong>: {message.content}
                </div>
            ))}
        </div>
    );
};

export default ChatWindow;