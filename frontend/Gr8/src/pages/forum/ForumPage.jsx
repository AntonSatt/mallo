import './ForumPage.css';
import ReportForm from "../../components/reportForm/ReportForm";
import PostForm from "../../components/postForm/PostForm";
import DeletePost from "../../components/deleteForm/DeletePost.jsx";
import PostServices from "../../services/PostServices";
import EditPostForm from "../../components/editPostForm/EditPostForm.jsx";
import { useAuth } from "../../hooks/useAuth";
import FilterPost from "../../components/filterPost/FilterPost.jsx";
import PostCard from "../../components/postCard/PostCard.jsx";
import ProfileBar from "../../components/layout/ProfileBar.jsx";
import PostActionsDialog from "../../components/postActionsDialog/PostActionsDialog.jsx";

import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogActions,
    Menu,
    MenuItem
} from "@mui/material";

import { useEffect, useState, useMemo } from "react";

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
            <div className="forum-page">
                <div className="forum-container">
                    <ProfileBar showCreate onCreatePost={handleClickOpen} />

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
                        {/* This is the menu that opens when clicking the three dots on a post. It contains options to report, 
                        edit, or delete the post. The edit and delete options are only shown if the current user is 
                        the creator of the post. */}
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

                    {/* This is where the posts are rendered. It maps through the filteredPosts array and renders a PostCard for 
                    each post. The PostCard component is responsible for displaying the post content, as well as handling the 
                    expand/collapse of the comment section and the menu actions for reporting, editing, and deleting posts. */}
                    {filteredPosts.map((post) => (
                        <PostCard
                            key={post.id}
                            post={post}
                            expanded={expanded === post.id}
                            onExpand={() => handleExpandClick(post.id)}
                            onMenuOpen={(event) => handleMenuOpen(event, post.id)}
                        />
                    ))}
                </div>
            </div>
        </>
    );
};
export default ForumPage;