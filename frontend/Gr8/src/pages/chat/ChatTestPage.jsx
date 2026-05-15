import { useState } from "react";
import ChatSignalrServices from "../../services/ChatSignalrServices";

const ChatTestPage = () => {
    const [receiverId, setReceiverId] = useState("");
    const [content, setContent] = useState("");
    const [isConnected, setIsConnected] = useState(false);

    const connectToChat = async () => {
        try {
            await ChatSignalrServices.startConnection();

            ChatSignalrServices.onReceiveMessage((message) => {
                console.log("Received message:", message);
            });

            setIsConnected(true);
        } catch (error) {
            console.error("SignalR connection failed:", error);
        }
    };

 const sendMessage = async () => {
    try {
        await ChatSignalrServices.sendMessage({
            receiverId: receiverId,
            activityId: null,
            content: content
        });

        setContent("");
    } catch (error) {
        console.error("Failed to send message:", error);
    }
};
    

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Chat SignalR Test</h2>

            <button onClick={connectToChat}>
                Connect
            </button>

            <p>Status: {isConnected ? "Connected" : "Not connected"}</p>

            <div style={{ marginTop: "1rem" }}>
                <input
                    type="text"
                    placeholder="Receiver user id"
                    value={receiverId}
                    onChange={(e) => setReceiverId(e.target.value)}
                />
            </div>

            <div style={{ marginTop: "1rem" }}>
                <input
                    type="text"
                    placeholder="Message"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            </div>

            <button
                style={{ marginTop: "1rem" }}
                onClick={sendMessage}
                disabled={!isConnected}
            >
                Send Message
            </button>
        </div>
    );
}

export default ChatTestPage;