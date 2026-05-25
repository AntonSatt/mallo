import ConversationItem from "../conversationItem/ConversationItem.jsx";

//components to display a list of conversations.
const ConversationList = ({ conversations, deleteConversation }) => {

    if (conversations.length === 0) {
        return <p>Inga konversationer ännu.</p>
    }

    return (
        <>
            {conversations.map((conversation) => (
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