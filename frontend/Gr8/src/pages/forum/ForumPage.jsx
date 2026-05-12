import './ForumPage.css';
import ReportForm from "../../components/reportForm/ReportForm";
import PostForm from "../../components/postForm/PostForm";
import DeletePost from "../../components/deleteForm/DeletePost.jsx";
import PostServices from "../../services/PostServices";
import EditPostForm from "../../components/editPostForm/EditPostForm.jsx";
import { useAuth } from "../../hooks/useAuth";
import useViewport from "../../hooks/useViewport";
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
} from "@mui/material";

import { useEffect, useState, useMemo, useRef } from "react";

const ForumPage = () => {
    const { currentUser } = useAuth();
    const { isDesktop } = useViewport();
    const scrollAreaRef = useRef(null);

    const [expanded, setExpanded] = useState(null);
    const [openPostModal, setPostModalOpen] = useState(false);
    const [posts, setPosts] = useState([]);
    const [openReportModal, setOpenReportModal] = useState(false);

    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [deletePostId, setDeletePostId] = useState(null);
    const [editPost, setEditPost] = useState(null);

    const [activeNavCategory, setActiveNavCategory] = useState("Alla");
    const [filterAnchorEl, setFilterAnchorEl] = useState(null);
    const [checkedCategories, setCheckedCategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [userBookmarks, setUserBookmarks] = useState([]);

    const handleOpenEditPost = (post) => setEditPost(post);
    const handleCloseEditPost = () => setEditPost(null);

    const handleOpenPostDelete = (postId) => {
        setDeletePostId(postId);
        handleMenuClose();
    };

    const handleClosePostDelete = () => {
        setDeletePostId(null);
    };

    // Opens the post creation modal
    const handleClickOpen = () => {
        setPostModalOpen(true);
    };

    // Closes the post creation modal
    const handleClose = async () => {
        setPostModalOpen(false);
    };

    // Toggles the expansion of the comment section for a post
    const handleExpandClick = (postId) => {
        setExpanded(expanded === postId ? null : postId);
    };

    // Handles opening the menu for a specific post, setting the anchor element and selected post ID
    const handleMenuOpen = (event, postId) => {
        setMenuAnchorEl(event.currentTarget);
        setSelectedPostId(postId);
    };

    // Handles closing the menu, resetting the anchor element and selected post ID
    const handleMenuClose = () => {
        setMenuAnchorEl(null);
        setSelectedPostId(null);
    };

    // Handles the report action for a post, opening the report modal
    const handleReport = () => {
        setMenuAnchorEl(null);
        setOpenReportModal(true);
    };

    // Handles closing the report modal, resetting the open state and selected post ID
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
        if (activeNavCategory !== "Alla" && activeNavCategory !== "Sparade" && activeNavCategory !== "Dina inlägg") {
            return posts.filter(p => {
                const cat = p.category?.name || p.category;
                return cat === activeNavCategory;
            });
        }
        if (activeNavCategory == "Sparade") {
            return posts.filter(p => {
                return userBookmarks.some(b => b.postId === p.id);
            });
        }
        if (activeNavCategory == "Dina inlägg") {
            return posts.filter(p => p.createdByUser === currentUser?.sub);
        }

        return posts;
    }, [posts, activeNavCategory, checkedCategories, userBookmarks]);

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
                    userName: post.userName,
                    createdAt: post.createdAt,
                    category: post.category ? post.category : "Ingen kategori",
                    createdByUser: post.createdByUser,
                    tags: post.tags ? post.tags : [],
                    countOfComments: post.countOfComments || 0,
                }));
                setPosts(allPosts);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };
        fetchPosts();
    }, []);

    useEffect(() => {
        const fetchBookmarks = async () => {
            try {
                const data = await PostServices.getBookmarks();

                if (!data) {
                    return;
                }

                setUserBookmarks(data);
            }
            catch (error) {
                console.error("Error fetching bookmarks:", error)
            }
        };
        fetchBookmarks();
    }, []);

    useEffect(() => {
        if (!isDesktop) {
            return;
        }

        const handleWheel = (event) => {
            const scrollArea = scrollAreaRef.current;
            if (!scrollArea || !event.deltaY) {
                return;
            }

            const inDialog = event.target instanceof Element && !!event.target.closest(".MuiDialog-root");
            if (inDialog) {
                return;
            }

            const targetInScrollArea = event.target instanceof Node && scrollArea.contains(event.target);
            if (targetInScrollArea) {
                return;
            }

            scrollArea.scrollTop += event.deltaY;
            event.preventDefault();
        };

        window.addEventListener("wheel", handleWheel, { passive: false });
        return () => window.removeEventListener("wheel", handleWheel);
    }, [isDesktop]);

    const handlePostCreated = (newPost) => {
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

                    {!isDesktop && <ProfileBar showCreate onCreatePost={handleClickOpen} />}

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

                    {/* This is the dialog that appears when you click the three dots on a post.*/}
                    <PostActionsDialog
                        open={Boolean(menuAnchorEl)}
                        onClose={handleMenuClose}
                        onReport={handleReport}
                        onDelete={() => handleOpenPostDelete(selectedPostId)}
                        onEdit={() => {
                            handleOpenEditPost(posts.find(p => p.id === selectedPostId));
                            handleMenuClose();
                        }}
                        isOwner={
                            currentUser?.sub === posts.find(p => p.id === selectedPostId)?.createdByUser
                        }
                    />

                    <Box className="scrollbar"
                        ref={scrollAreaRef}
                        sx={{
                            width: "100%",

                            height: { xs: "auto", md: "auto" },

                            overflowY: { xs: "visible", md: "auto" },
                            overflowX: "hidden",

                            '&::-webkit-scrollbar': { width: '6px', },

                            '&::-webkit-scrollbar-track': { background: 'transparent', },

                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: 'white',
                                borderRadius: '10px',
                            },
                        }}>

                        <Box sx={{ px: { md: 1 } }}> {/*adds padding for scrollbar.*/}
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
                                    userBookmarks={userBookmarks}
                                    currentUser={currentUser}
                                    setUserBookmarks={setUserBookmarks}
                                />
                            ))}
                        </Box>
                    </Box>
                </div>
            </div>
        </>
    );
};
export default ForumPage;