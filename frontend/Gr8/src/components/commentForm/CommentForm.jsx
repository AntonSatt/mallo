import './CommentForm.css';
import { useEffect, useState } from "react";
import CommentServices from "../../services/CommentServices";
import ReportForm from "../reportForm/ReportForm";
import DeleteComment from "../../components/deleteForm/DeleteComment.jsx";
import { useAuth } from "../../hooks/useAuth";
import HugButton from "../../components/hugButton/HugButton.jsx"

import {
    Box,
    TextField,
    Button,
    Typography,
    IconButton,
    Menu,
    MenuItem
} from "@mui/material";
import moment from "moment";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

const CommentForm = ({ postId }) => {
    const { currentUser } = useAuth();
    const [commentData, setCommentData] = useState({
        commentContent: "",
    });
    const [commentError, setCommentError] = useState("");
    const [comments, setComments] = useState([]);
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [selectedCommentId, setSelectedCommentId] = useState(null);
    const [reportOpen, setReportOpen] = useState(false);
    const [deleteCommentId, setDeleteCommentId] = useState(null);

    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editContent, setEditContent] = useState("");

    const handleOpenDeleteComment = (commentId) => setDeleteCommentId(commentId);
    const handleCloseDeleteComment = () => setDeleteCommentId(null);

    const handleCommentChange = (e) => {
        setCommentData({ ...commentData, commentContent: e.target.value });
        if (commentError) setCommentError("");
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        setCommentError("");

        if (!commentData.commentContent.trim()) {
            setCommentError("Kommentaren kan inte vara tom");
            return;
        }

        if (commentData.commentContent.length > 8000) {
            setCommentError("Kommentaren får inte vara längre än 8000 tecken");
            return;
        }

        try {
            var data = await CommentServices.create(postId, commentData);
            setComments(prev => [...prev, data]);
            setCommentData({ commentContent: "" });
        } catch (error) {
            console.error("Tekniskt felet: ", error);
            setCommentError("Kunde inte spara kommentar");
        }
    };

    const handleEditSubmit = async (commentId) => {
        if (!editContent.trim()) return;

        try {
            const result = await CommentServices.update(postId, commentId, {
                id: commentId,
                content: editContent
            });
            setComments(prev => prev.map(c => c.id === commentId ? { ...c, content: result.content } : c));
            setEditingCommentId(null);
            setEditContent("");
        } catch (err) {
            console.error("Kunde inte uppdatera kommentar:", err);
        }
    };

    useEffect(() => {
        const loadComments = async () => {
            const result = await CommentServices.getAll(postId);
            setComments(result);
        };
        if (postId) loadComments();
    }, [postId]);

    const handleOpenMenu = (event, commentId) => {
        setMenuAnchor(event.currentTarget);
        setSelectedCommentId(commentId);
    };

    const handleCloseMenu = () => {
        setMenuAnchor(null);
    };

    const handleOpenReport = () => {
        setMenuAnchor(null);
        setReportOpen(true);
    };

    const handleCloseReport = () => {
        setReportOpen(false);
        setSelectedCommentId(null);
        setMenuAnchor(null);
    };

    return (
        <>
            <Box component="form" onSubmit={handleCommentSubmit} sx={{ mt: 2 }}>
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
                    sx={{ mt: 1 }}
                >
                    Skicka kommentar
                </Button>
            </Box>

            <Box sx={{ mt: 2 }}>
                {comments.length > 0 ? (
                    comments.map((c, index) => (
                        <Box key={c.id || index} sx={{ mb: 2, p: 2, bgcolor: 'white', borderRadius: 1, boxShadow: 1 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <Typography variant="caption" color="text.secondary" display="block">
                                    {`${c.userName} • ${moment(c.createdAt).fromNow()}`}
                                </Typography>
                                {c.id && (
                                    <IconButton size="small" onClick={(event) => handleOpenMenu(event, c.id)}>
                                        <MoreHorizIcon fontSize="small" />
                                    </IconButton>
                                )}
                            </Box>

                            <Typography variant="body2" sx={{ mt: 0.5 }}>
                                {c.content || c.Content}
                            </Typography>

                            {c.id && (
                                <div className="comment-hug-button">
                                    <HugButton type="comment" id={c.id}/>
                                </div>
                            )}
                            {editingCommentId === c.id && (
                                <Box sx={{ mt: 2 }}>
                                    <TextField
                                        fullWidth
                                        label="Redigera kommentar"
                                        variant="outlined"
                                        multiline
                                        minRows={3}
                                        size="small"
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                    />
                                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            disabled={!editContent.trim()}
                                            onClick={() => handleEditSubmit(c.id)}
                                        >
                                            Spara
                                        </Button>
                                        <Button
                                            variant="text"
                                            size="small"
                                            color="inherit"
                                            onClick={() => {
                                                setEditingCommentId(null);
                                                setEditContent("");
                                            }}
                                        >
                                            Avbryt
                                        </Button>
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    ))
                ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        Inga kommentarer ännu. Bli den första att kommentera!
                    </Typography>
                )}
            </Box>

            <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleCloseMenu}>
                {(comments && (currentUser?.sub === comments.find(c => c.id === selectedCommentId)?.createdByUser)) ? (
                    <>
                        <MenuItem onClick={() => {
                            handleCloseMenu();
                            handleOpenDeleteComment(selectedCommentId);
                        }}>Radera kommentar</MenuItem>
                        <MenuItem onClick={() => {
                            handleCloseMenu();
                            setEditingCommentId(selectedCommentId);
                            setEditContent(comments.find(c => c.id === selectedCommentId)?.content || "");
                        }}>Redigera kommentar</MenuItem>
                    </>
                ) : (
                    <MenuItem onClick={handleOpenReport}>Anmäl kommentar</MenuItem>
                )}
            </Menu>

            <ReportForm
                open={reportOpen}
                commentId={selectedCommentId}
                onClose={handleCloseReport}
            />

            <DeleteComment
                open={Boolean(deleteCommentId)}
                commentId={deleteCommentId}
                onClose={handleCloseDeleteComment}
                onCommentDeleted={(deletedCommentId) => {
                    setComments((prev) => prev.filter(c => c.id !== deletedCommentId));
                    handleCloseDeleteComment();
                }}
            />
        </>
    );
};

export default CommentForm;