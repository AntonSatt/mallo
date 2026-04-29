import ReportForm from "../../components/reportForm/ReportForm";
import PostForm from "../../components/postForm/PostForm";
import CommentForm from "../../components/commentForm/CommentForm";
import DeletePost from "../../components/deleteForm/DeletePost.jsx";
import PostServices from "../../services/PostServices";
import EditPostForm from "../../components/editPostForm/EditPostForm.jsx";
import { useAuth } from "../../hooks/useAuth";
import FilterPost from "../../components/postForm/FilterPost.jsx";
import Navbar from "../../components/layout/Navbar.jsx"

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
import { useEffect, useState, useMemo } from "react";
import moment from "moment";
import HugButton from "../../components/hugButton/HugButton.jsx";
import ProfileBar from "../../components/layout/ProfileBar.jsx";

const ForumPage = () => {
    const { currentUser } = useAuth();
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

    const [activeNavCategory, setActiveNavCategory] = useState("Alla");
    const [filterAnchorEl, setFilterAnchorEl] = useState(null);
    const [checkedCategories, setCheckedCategories] = useState([]);
    const [categories, setCategories] = useState([]);



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

    const handleNavCategoryClick = (cat) => {
        setActiveNavCategory(cat);
        setCheckedCategories([]);
    };

    const handleFilterIconClick = (event) => {
        setFilterAnchorEl(event.currentTarget);
    };

    const handleFilterClose = () => {
        setFilterAnchorEl(null);
    };

    const filteredPosts = useMemo(() => {
        if (checkedCategories.length > 0) {
            return posts.filter(p => {
                const cat = p.category?.name || p.category;
                return checkedCategories.includes(cat);
            });
        }
        if (activeNavCategory !== "Alla") {
            return posts.filter(p => {
                const cat = p.category?.name || p.category;
                return cat === activeNavCategory;
            });
        }
        return posts;
    }, [posts, activeNavCategory, checkedCategories]);

    const handleCheckboxChange = (categoryName) => {
        setCheckedCategories(prev =>
            prev.includes(categoryName)
                ? prev.filter(c => c !== categoryName)
                : [...prev, categoryName]
        );
        setActiveNavCategory("Alla");
    };

    const handleClearFilters = () => {
        setCheckedCategories([]);
        setActiveNavCategory("Alla");
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const catResult = await PostServices.getCategories();
                setCategories(catResult.map(c => ({ id: c.id, name: c.name })));
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await PostServices.getAll();

                if (!data) {
                    return;
                }

                const allPosts = data.map((post) => ({
                    id: post.id,
                    title: post.title,
                    content: post.content ? post.content : "Innehåll saknas",
                    userId: post.userId,
                    userName: post.userName,
                    createdAt: post.createdAt,
                    category: post.category ? post.category : "Ingen kategori",
                    createdByUser: post.createdByUser,
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
            createdByUser: newPost.createdByUser,
        };
        setPosts((prevPosts) => [formattedPost, ...prevPosts]);
    };

    return (
        <>
            <ProfileBar />

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

            <FilterPost
                categories={categories}
                activeNavCategory={activeNavCategory}
                checkedCategories={checkedCategories}
                filterAnchorEl={filterAnchorEl}
                onNavCategoryClick={handleNavCategoryClick}
                onFilterIconClick={handleFilterIconClick}
                onFilterClose={handleFilterClose}
                onCheckboxChange={handleCheckboxChange}
                onClearFilters={handleClearFilters}
            />

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
                {currentUser?.sub === posts.find(p => p.id === selectedPostId)?.createdByUser && (
                    <>
                        <MenuItem onClick={() => {
                            handleOpenPostDelete(selectedPostId);
                        }}>Radera inlägg</MenuItem>
                        <MenuItem onClick={() => {
                            handleOpenEditPost(posts.find(p => p.id === selectedPostId));
                            handleMenuClose();
                        }}>Redigera inlägg</MenuItem>
                    </>
                )}
            </Menu>

            {filteredPosts.map((post) => (
                <Card key={post.id} sx={{ maxWidth: 500, marginBottom: 2 }}>
                    <CardHeader
                        title={post.title}
                        subheader={`${post.userName} • ${moment(post.createdAt).fromNow()}`}
                        action={
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

                    <HugButton type="post" id={post.id} />

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