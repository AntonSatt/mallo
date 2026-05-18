import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ChatService from "../../services/ChatService";
import ChatSignalrServices from "../../services/ChatSignalrServices";
import ChatWindow from "../../components/chat/chatWindow/ChatWindow";
import MessageInput from "../../components/chat/messageInput/MessageInput";

const ConversationPage = () => {

    const { userId } = useParams();

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {

        const loadConversation = async () => {

            try {

                const history = await ChatService.getChatHistory(userId);

                setMessages(history ?? []);

            } catch (error) {

                console.error("Failed to load chat history", error);
                setError("Could not load messages.");
            }
        };

        loadConversation();

    }, [userId]);

    useEffect(() => {

        ChatSignalrServices.onReceiveMessage((message) => {

            const currentConversation =
                message.senderId === userId ||
                message.receiverId === userId;

            if (!currentConversation) {
                return;
            }

            setMessages((prevMessages) => {

                const alreadyExists = prevMessages.some(
                    (m) => m.id === message.id
                );

                if (alreadyExists) {
                    return prevMessages;
                }

                return [...prevMessages, message];
            });
        });

    }, [userId]);

    const sendMessage = async () => {

        if (!newMessage.trim()) {
            return;
        }

        try {

            await ChatSignalrServices.sendMessage({
                receiverId: userId,
                activityId: null,
                content: newMessage
            });

            setNewMessage("");

        } catch (error) {

            console.error("Failed to send message", error);
            setError("Could not send message.");
        }
    };

    return (
        <div>

            {error && <p>{error}</p>}

            <ChatWindow messages={messages} />

            <MessageInput
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                sendMessage={sendMessage}
            />

        </div>
    );
};

export default ConversationPage;