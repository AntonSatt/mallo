import ConversationItem from "../conversationItem/ConversationItem.jsx";

//components to display a list of conversations.
const ConversationList = ({ conversations, openConversation }) => {

    if (conversations.length === 0) {
        return <p>Inga konversationer ännu.</p>
    }

    return (
        <>
            {conversations.map((conversation) => (
            <ConversationItem
                key={conversation.otherUserId}
                conversation={conversation}
                openConversation={openConversation}
            />
            ))}
        </>
    );
};

export default ConversationList;