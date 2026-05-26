import './CommentForm.css';
import { useEffect, useState } from "react";
import CommentServices from "../../services/CommentServices";
import ReportForm from "../reportForm/ReportForm";
import DeleteComment from "../../components/deleteForm/DeleteComment.jsx";
import { useAuth } from "../../hooks/useAuth";
import HugButton from "../../components/hugButton/HugButton.jsx";

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
import Avatar from "../avatar/avatar.jsx";

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
    const [userCommentHugs, setUserCommentHugs] = useState([]);

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
            const data = await CommentServices.create(postId, commentData);
            setComments(prev => [...prev, data]);
            setCommentData({ commentContent: "" });
        } catch (error) {
            console.error("Tekniskt fel:", error);
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
            setComments(result || []);
        };

        if (postId) {
            loadComments();
        }
    }, [postId]);

    useEffect(() => {
        const fetchCommentHugs = async () => {
            try {
                if (comments.length === 0) {
                    return;
                }

                const hugsResult = await Promise.all(
                    comments.map(comment => CommentServices.getCommentHugs(comment.id))
                );

                const allHugs = hugsResult.flat().filter(Boolean);

                setUserCommentHugs(allHugs);
            }
            catch (error) {
                console.error("Error fetching comment hugs:", error);
            }
        };

        fetchCommentHugs();
    }, [comments]);

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
            <Box className="comment-panel">
                <Box className="comment-list-viewport">
                    {comments.length > 0 ? (
                        comments.map((c, index) => (
                            <Box key={c.id || index} className="comment-card">
                                <Box className="comment-card-main">
                                    <Avatar className="comment-avatar" avatar={c.authorInfo.avatarId} />

                                    <Box className="comment-content">
                                        <Box className="comment-card-header">
                                            <Typography className="comment-meta" display="block">
                                                {`${c.authorInfo.userName} \u2022 ${moment(c.createdAt).fromNow()}`}
                                            </Typography>
                                            {c.id && (
                                                <IconButton size="small" className="comment-menu-button" onClick={(event) => handleOpenMenu(event, c.id)}>
                                                    <MoreHorizIcon fontSize="small" />
                                                </IconButton>
                                            )}
                                        </Box>

                                        <Typography className="comment-text">
                                            {c.content || c.Content}
                                        </Typography>

                                        {c.id && (
                                            <div className="comment-hug-button">
                                                <HugButton type="comment" id={c.id} userCommentHugs={userCommentHugs} />
                                            </div>
                                        )}
                                    </Box>
                                </Box>

                                {editingCommentId === c.id && (
                                    <Box sx={{ mt: 1.5 }}>
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
                                        <Box sx={{ display: 'flex', gap: 1, mt: 1.25 }}>
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
                        <Typography className="comment-empty-state">
                            Inga kommentarer ännu. Bli den första att kommentera!
                        </Typography>
                    )}
                </Box>

                <Box component="form" onSubmit={handleCommentSubmit} className="comment-composer">
                    <TextField
                        fullWidth
                        placeholder="Skriv en kommentar..."
                        variant="outlined"
                        multiline
                        minRows={1}
                        maxRows={3}
                        value={commentData.commentContent}
                        onChange={handleCommentChange}
                        error={Boolean(commentError)}
                        helperText={commentError}
                        size="small"
                        className="comment-input"
                    />
                    <Button
                        type="submit"
                        disabled={!commentData.commentContent.trim()}
                        variant="contained"
                        className="comment-submit-button"
                    >
                        Skicka
                    </Button>
                </Box>
            </Box>

            <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleCloseMenu}>
                {(comments && (currentUser?.sub === comments.find(c => c.id === selectedCommentId)?.authorInfo.id)) ? (
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