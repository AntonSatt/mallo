import React, {useEffect, useState} from "react";
import CommentServices from "../../services/CommentServices";

import{
    Box,
    TextField,
    Button,
    Typography
} from "@mui/material";
import moment from "moment";

const CommentForm = ({postId}) =>{
    const [commentData, setCommentData] = useState({
        commentContent: "",
    });
    const [commentError, setCommentError] = useState("");
    const [comments, setComments] = useState([]);
    
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

    useEffect(() => {
        const loadComments = async () => {
            const result = await CommentServices.getAll(postId);
            setComments(result);
        };
        if(postId) loadComments();
    }, [postId]);

    return (
        <>
            <Box component="form" onSubmit={handleCommentSubmit} sx={{mt:2}}>
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

            <Box sx={{mt:2}}>{
                    comments.length > 0 ? (
                        comments.map((c, index) => (
                            <Box key={c.id || index} sx={{ mb: 2, p: 2, bgcolor: 'white', borderRadius: 1, boxShadow: 1 }}>
                                <Typography variant="caption" color="text.secondary" display="block">
                                    {`${c.userName} • ${moment(c.createdAt).fromNow()}`}
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 0.5 }}>
                                    {c.content || c.Content} 
                                </Typography>
                            </Box>
                        ))
                    ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                            Inga kommentarer ännu. Bli den första att kommentera!
                        </Typography>
                    )
                }
            </Box>
        </>
    )
};

export default CommentForm; 