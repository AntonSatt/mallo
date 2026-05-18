import {useNavigate} from "react-router-dom";

// component to display a single conversation between the user and another user.
const ConversationItem = ({ conversation }) => {
    const navigate = useNavigate();

    return (
        <div onClick={() => navigate(`/message/${conversation.otherUserId}`)}>
            <strong>{conversation.otherUserId}</strong>
            <p>{conversation.lastMessage}</p>
        </div>
    );
};

export default ConversationItem;