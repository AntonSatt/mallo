import React, {useState} from "react";
import CommentServices from "../../services/CommentServices";
import{
    Box,
    TextField,
    Button
} from "@mui/material";

const CommentForm = ({postId}) =>{
    const [commentData, setCommentData] = useState({
        commentContent: "",
    });
    const [commentError, setCommentError] = useState("");
    
    const handleCommentChange = (e) => {
        setCommentData({...commentData, commentContent: e.target.value});
        if(commentError) setCommentError("");
    };

    const handleCommentSubmit = async (e) =>{
        e.preventDefault();
        setCommentError("")

        if(!commentData.commentContent.trim()){
            setCommentError("Kommentaren kan inte vara tom");
            return;
        };

        if(commentData.commentContent.length > 8000){
            setCommentError("Kommentaren får inte vara mer längre än 8000 tecken");
            return; 
        }

        try{
           await CommentServices.create(postId, commentData);
           setCommentData({commentContent: ""});
        }
        catch(error){
            console.error("Tekniskt felet: ", error)
            setCommentError("Kunde inte spara kommentar");
        }
    };

    return (
        <>
            <Box component="form" onSubmit={handleCommentSubmit} sx={{mt: 2}}>
                <TextField
                    fullWidth
                    label="Skriv en kommentar"
                    variant="outlined"
                    multiline
                    minRows={3}
                    value={commentData.commentContent}
                    onChange={handleCommentChange}
                    error={Boolean(commentError)}
                    helperText={commentError}
                    size="small"
                />
                <Button
                    type="submit"
                    disabled={!commentData.commentContent.trim()}
                    variant="contained"
                    sx={{mt: 1}}
                >
                    Posta kommentar
                </Button>
            </Box>
        </>
    )
};

export default CommentForm; 