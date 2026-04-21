import { useState } from "react";
import CommentServices from "../../services/CommentServices";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const DeleteComment = ({ commentId, open, onClose, onCommentDeleted }) => {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCommentDelete = async (commentId) => {
        setError("");
        setLoading(true);
        try {
            await CommentServices.deleteComment(commentId);
            onCommentDeleted(commentId);
            onClose();
        } catch (error) {
            if (error.response?.status === 403) {
                setError("Du får inte ta bort denna kommentar.");
            }
            else if (error.response?.status === 404) {
                setError("Kommentaren hittades inte.");
            }
            else {
                setError("Kommentaren kunde inte tas bort. Försök igen.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>

            <DialogTitle>
                Radera kommentar

                <IconButton
                    onClick={onClose}
                    sx={{ position: "absolute", right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <Typography>
                    Är du säker på att du vill radera denna kommentar?
                </Typography>

                {error && (
                    <Typography color="error" sx={{ mt: 2 }}>
                        {error}
                    </Typography>
                )}
            </DialogContent>

            <DialogActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button onClick={onClose} disabled={loading}>
                    Avbryt
                </Button>

                <Button
                    onClick={() => handleCommentDelete(commentId)}
                    color="error"
                    variant="contained"
                    disabled={loading}
                >
                    {loading ? "Raderar..." : "Radera"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteComment;