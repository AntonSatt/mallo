import ConversationItem from "../conversationItem/ConversationItem.jsx";

//components to display a list of conversations.
const ConversationList = ({ conversations, deleteConversation }) => {

    const safeConversations = Array.isArray(conversations) ? conversations : [];

    if (conversations.length === 0) {
        return <p>Inga konversationer ännu.</p>
    }

    return (
        <>
            {safeConversations.map((conversation) => (
            <ConversationItem
                key={conversation.otherUserId}
                conversation={conversation}
                deleteConversation={deleteConversation}
            />
            ))}
        </>
    );
};

export default ConversationList;