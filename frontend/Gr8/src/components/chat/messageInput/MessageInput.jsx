//component for message input in chat window.

const MessageInput = ({ newMessage, setNewMessage, sendMessage }) => {
    return (
        <div style={{ marginTop: "1rem" }}>
            <input
                type="text"
                placeholder="Skriv ett meddelande"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)} />

            <button onClick={sendMessage}>Skicka</button>
        </div>
    )
}

export default MessageInput;