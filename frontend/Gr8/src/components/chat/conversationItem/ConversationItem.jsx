// component to display a single conversation between the user and another user.

const ConversationItem = ({ conversation, openConversation}) => {
    return (
        <div onClick={() => openConversation(conversation)}>
            <strong>{conversation.otherUserId}</strong>
            <p>{conversation.lastMessage}</p>
        </div>
    );
};

export default ConversationItem;