import InputField from "../../../design/input/InputField.jsx";
import SendIcon from "@mui/icons-material/Send";
import { Box, IconButton } from "@mui/material";

//component for message input in chat window.
const MessageInput = ({ newMessage, setNewMessage, sendMessage }) => {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                width: "100%",
            }}
        >
            <InputField
                fullWidth
                placeholder="Skriv ett meddelande"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
            />

            <IconButton
                onClick={sendMessage}
                sx={{
                    backgroundColor: "var(--color-primary)",
                    color: "white",
                    width: 50,
                    height: 50,
                    "&:hover": {
                        backgroundColor: "var(--color-primary)",
                    }
                }}
            >
                <SendIcon />
            </IconButton>
        </Box>
    );
};

export default MessageInput;