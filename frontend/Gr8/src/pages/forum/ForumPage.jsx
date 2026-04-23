import ReportForm from "../../components/reportForm/ReportForm";
import PostForm from "../../components/postForm/PostForm";
import CommentForm from "../../components/commentForm/CommentForm";
import DeletePost from "../../components/deleteForm/DeletePost.jsx";
import PostServices from "../../services/PostServices";
import EditPostForm from "../../components/editPostForm/EditPostForm.jsx";

import {
    Dialog,
    Card,
    CardHeader,
    CardContent,
    IconButton,
    Typography,
    Collapse,
    Button,
    DialogTitle,
    DialogActions,
    Menu,
    MenuItem,
} from "@mui/material";

import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import moment from "moment";

const ForumPage = () => {
    const [expanded, setExpanded] = useState(null);
    const [openPostModal, setPostModalOpen] = useState(false);
    const [posts, setPosts] = useState([]);
    const [openReportModal, setOpenReportModal] = useState(false);

    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [deletePostId, setDeletePostId] = useState(null);

    const [editPost, setEditPost] = useState(null);
    const handleOpenEditPost = (post) => setEditPost(post);
    const handleCloseEditPost = () => setEditPost(null);

    const handleOpenPostDelete = (postId) => {
        setDeletePostId(postId);
    };

    const handleClosePostDelete = () => {
        setDeletePostId(null);
    };

    const ExpandMore = styled(IconButton, {
        shouldForwardProp: (prop) => prop !== "expand",
    })(({ theme, expand }) => ({
        marginLeft: "auto",
        transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
        transition: theme.transitions.create("transform", {
            duration: theme.transitions.duration.shortest,
        }),
    }));

    const handleClickOpen = () => {
        setPostModalOpen(true);
    };

    const handleClose = async () => {
        setPostModalOpen(false);
    };

    const handleExpandClick = (postId) => {
        setExpanded(expanded === postId ? null : postId);
    };

    const handleMenuOpen = (event, postId) => {
        setMenuAnchorEl(event.currentTarget);
        setSelectedPostId(postId);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
        setSelectedPostId(null);
    };

    const handleReport = () => {
        setMenuAnchorEl(null);
        setOpenReportModal(true);
    };

    const handleReportClose = () => {
        setOpenReportModal(false);
        setSelectedPostId(null);
    };

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await PostServices.getAll();

                const allPosts = data.map((post) => ({
                    id: post.id,
                    title: post.title,
                    content: post.content ? post.content : "Innehåll saknas",
                    userName: post.userName,
                    createdAt: post.createdAt,
                    category: post.category ? post.category : "Ingen kategori",
                    tags: post.tags ? post.tags : []
                }));
                setPosts(allPosts);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };
        fetchPosts();
    }, []);

    const handlePostCreated = (newPost) => {
        console.log("New post created:", newPost);
        const formattedPost = {
            id: newPost.id,
            title: newPost.title,
            content: newPost.content,
            userName: newPost.userName,
            createdAt: newPost.createdAt,
            category: newPost.category,
            tags: newPost.tags,
        };
        setPosts((prevPosts) => [formattedPost, ...prevPosts]);
    };

    return (
        <>
            <DeletePost
                postId={deletePostId}
                open={!!deletePostId}
                onClose={handleClosePostDelete}
                onPostDeleted={(id) => {
                    setPosts(prev => prev.filter(p => p.id !== id));
                    handleClosePostDelete();
                }}
            />

            <EditPostForm
                post={editPost}
                open={!!editPost}
                onClose={handleCloseEditPost}
                onPostUpdated={(updatedPost) => {
                    setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
                    handleCloseEditPost();
                }}
            />

            <Button variant="outlined" color="error" onClick={handleClickOpen}>
                Skapa nytt inlägg...
            </Button>
            <Dialog
                open={openPostModal}
                onClose={handleClose}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Skapa nytt inlägg</DialogTitle>
                <PostForm
                    onPostCreated={handlePostCreated}
                    onClose={handleClose}
                />
                <DialogActions>
                    <Button variant="text" color="inherit" onClick={handleClose}>
                        Avbryt
                    </Button>
                </DialogActions>
            </Dialog>

            <ReportForm
                open={openReportModal}
                postId={selectedPostId}
                onClose={handleReportClose}
            />

            <Menu
                id="post-menu"
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <MenuItem onClick={handleReport}>Anmäl inlägg</MenuItem>
                <MenuItem onClick={() => {
                    handleOpenPostDelete(selectedPostId);
                }}>Radera inlägg</MenuItem>
                <MenuItem onClick={() => {
                    handleOpenEditPost(posts.find(p => p.id === selectedPostId));
                    handleMenuClose();
                }}>Redigera inlägg</MenuItem>
            </Menu>

            {posts.map((post) => (
                <Card key={post.id} sx={{ maxWidth: 500, marginBottom: 2 }}>
                    <CardHeader
                        title={post.title}
                        subheader={`${post.userName} • ${moment(post.createdAt).fromNow()}`}
                        action={
                            <>
                                <IconButton
                                    aria-label="more"
                                    id={"post-menu-button-" + post.id}
                                    aria-controls={menuAnchorEl ? "post-menu" : undefined}
                                    aria-expanded={menuAnchorEl ? "true" : undefined}
                                    aria-haspopup="true"
                                    onClick={(event) => handleMenuOpen(event, post.id)}
                                >
                                    <MoreHorizIcon />
                                </IconButton>
                            </>
                        }
                    />

                    <CardContent>
                        <Typography variant="body2" color="text.secondary">
                            {post.content}
                        </Typography>

                        {post.category && (
                            <Typography
                                variant="subtitle2"
                                color="text.secondary"
                                sx={{ mt: 1 }}
                            >
                                Kategori: {post.category.name || post.category}
                            </Typography>
                        )}

                        {post.tags && post.tags.length > 0 && (
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ mt: 1 }}
                            >
                                Trigger: {post.tags.map((tag) => tag.name || tag).join(", ")}
                            </Typography>
                        )}
                    </CardContent>

                    <IconButton aria-label="share">
                        <ShareIcon />
                    </IconButton>

                    <ExpandMore
                        expand={expanded === post.id}
                        onClick={() => handleExpandClick(post.id)}
                        aria-expanded={expanded === post.id}
                        aria-label="Visa kommentarerna"
                    >
                        <ExpandMoreIcon />
                    </ExpandMore>

                    <Collapse in={expanded === post.id} timeout="auto" unmountOnExit>
                        <CardContent
                            sx={{ bgcolor: "#f9f9f9", borderTop: "1px solid #eee" }}
                        >
                            <Typography variant="subtitle2" gutterBottom>
                                Kommentarer
                            </Typography>
                            <CommentForm postId={post.id} />
                        </CardContent>
                    </Collapse>
                </Card>
            ))}
        </>
    );
};

export default ForumPage;