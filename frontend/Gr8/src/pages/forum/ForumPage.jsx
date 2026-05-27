import './ForumPage.css';
import ReportForm from "../../components/reportForm/ReportForm";
import PostForm from "../../components/postForm/PostForm";
import DeletePost from "../../components/deleteForm/DeletePost.jsx";
import PostServices from "../../services/PostServices";
import CommentServices from "../../services/CommentServices";
import EditPostForm from "../../components/editPostForm/EditPostForm.jsx";
import { useAuth } from "../../hooks/useAuth";
import useViewport from "../../hooks/useViewport";
import FilterPost from "../../components/filterPost/FilterPost.jsx";
import PostCard from "../../components/postCard/PostCard.jsx";
import PostActionsDialog from "../../components/postActionsDialog/PostActionsDialog.jsx";

import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogActions,
    Typography,
} from "@mui/material";

import { useEffect, useState, useMemo, useRef } from "react";

const ForumPage = ({ openModal, setOpenModal, searchQuery }) => {
    const { currentUser } = useAuth();
    const { isDesktop } = useViewport();
    const scrollAreaRef = useRef(null);

    const [expanded, setExpanded] = useState(null);
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
    const [userPostHugs, setUserPostHugs] = useState([]);
    const [commentsByPostId, setCommentsByPostId] = useState({});

    const handleOpenEditPost = (post) => setEditPost(post);
    const handleCloseEditPost = () => setEditPost(null);

    const handleOpenPostDelete = (postId) => {
        setDeletePostId(postId);
        handleMenuClose();
    };

    const handleClosePostDelete = () => {
        setDeletePostId(null);
    };

    // Closes the post creation modal
    const handleClose = async () => {
        setOpenModal(false);
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

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
        setSelectedPostId(null);
    };

    // Handles the report action for a post, opening the report modal
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
        let result = posts;

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter((p) => {
                const titleMatches = (p.title || "").toLowerCase().includes(query);
                const contentMatches = (p.content || "").toLowerCase().includes(query);
                const authorMatches = (p.authorInfo?.userName || "").toLowerCase().includes(query);
                const commentMatches = (commentsByPostId[p.id] || []).some((commentText) =>
                    (commentText || "").toLowerCase().includes(query)
                );

                return titleMatches || contentMatches || authorMatches || commentMatches;
            });
        }

        if (checkedCategories.length > 0) {
            return result.filter(p => {
                const cat = p.category?.name || p.category;
                return checkedCategories.includes(cat);
            });
        }

        if (activeNavCategory !== "Alla" && activeNavCategory !== "Sparade" && activeNavCategory !== "Dina inlägg") {
            return result.filter(p => {
                const cat = p.category?.name || p.category;
                return cat === activeNavCategory;
            });
        }

        if (activeNavCategory === "Sparade") {
            return result.filter(p => userBookmarks.some(b => b.postId === p.id));
        }

        if (activeNavCategory === "Dina inlägg") {
            return result.filter(p => p.authorInfo.id === currentUser?.sub);
        }

        return result;
    }, [posts, activeNavCategory, checkedCategories, userBookmarks, searchQuery, currentUser?.sub, commentsByPostId]);

    const emptyStateMessage = useMemo(() => {
        if (filteredPosts.length > 0) {
            return "";
        }

        if (searchQuery.trim()) {
            return "Inga inlägg matchade din sökning.";
        }

        if (activeNavCategory === "Sparade") {
            return "Du har inga sparade inlägg ännu.";
        }

        if (activeNavCategory === "Dina inlägg") {
            return "Du har inte skapat några inlägg ännu.";
        }

        if (checkedCategories.length > 0) {
            return "Det finns inga inlägg i de valda kategorierna just nu.";
        }

        if (activeNavCategory !== "Alla") {
            return `Det finns inga inlägg i kategorin ${activeNavCategory} ännu.`;
        }

        return "Det finns inga inlägg att visa just nu.";
    }, [filteredPosts.length, searchQuery, activeNavCategory, checkedCategories.length]);

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
                    createdAt: post.createdAt,
                    category: post.category ? post.category : "Ingen kategori",
                    tags: post.tags ? post.tags : [],
                    countOfComments: post.countOfComments || 0,
                    authorInfo: post.authorInfo || { avatarId: 1 },
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
        const fetchPostHugs = async () => {
            try {
                if (posts.length === 0) {
                    return;
                }

                const hugsResult = await Promise.all(
                    posts.map(post => PostServices.getPostHugs(post.id))
                );

                const allHugs = hugsResult.flat().filter(Boolean);

                setUserPostHugs(allHugs);
            }
            catch (error) {
                console.error("Error fetching post hugs:", error);
            }
        };

        fetchPostHugs();
    }, [posts]);

    useEffect(() => {
        let isCancelled = false;

        const buildCommentsIndex = async () => {
            if (posts.length === 0) {
                if (!isCancelled) {
                    setCommentsByPostId({});
                }
                return;
            }

            const commentResults = await Promise.allSettled(
                posts.map(async (post) => {
                    const comments = await CommentServices.getAll(post.id);
                    const searchableTexts = (comments || [])
                        .map((comment) => comment?.content ?? comment?.Content ?? "")
                        .filter(Boolean);

                    return { postId: post.id, searchableTexts };
                })
            );

            if (isCancelled) {
                return;
            }

            const nextCommentsByPostId = {};
            commentResults.forEach((result, index) => {
                const postId = posts[index]?.id;
                if (!postId) {
                    return;
                }

                if (result.status === "fulfilled") {
                    nextCommentsByPostId[postId] = result.value.searchableTexts;
                } else {
                    nextCommentsByPostId[postId] = [];
                    console.error(`Error fetching comments for post ${postId}:`, result.reason);
                }
            });

            setCommentsByPostId(nextCommentsByPostId);
        };

        buildCommentsIndex();

        return () => {
            isCancelled = true;
        };
    }, [posts]);

    useEffect(() => {
        if (!isDesktop) {
            return;
        }

        const handleWheel = (event) => {
            const scrollArea = scrollAreaRef.current;
            if (!scrollArea || !event.deltaY) {
                return;
            }

            const targetElement = event.target instanceof Element ? event.target : null;

            const inDialog = !!targetElement?.closest(".MuiDialog-root");
            if (inDialog) {
                return;
            }

            const inFloatingMenu = !!targetElement?.closest(
                ".MuiPopover-root, .MuiMenu-root, .MuiPopper-root, .MuiAutocomplete-popper"
            );
            if (inFloatingMenu) {
                return;
            }

            if (openModal) {
                event.preventDefault();
                return;
            }

            const inSidebar = !!targetElement?.closest(".sidebar-left, .sidebar-right");
            if (inSidebar) {
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
    }, [isDesktop, openModal]);

    const handlePostCreated = (newPost) => {
        const formattedPost = {
            id: newPost.id,
            title: newPost.title,
            content: newPost.content,
            createdAt: newPost.createdAt,
            category: newPost.category,
            tags: newPost.tags,
            authorInfo: newPost.authorInfo || { avatarId: 1 },
        };
        setPosts((prevPosts) => [formattedPost, ...prevPosts]);
    };

    return (
        <>
            <div className="forum-page page-container">

                <div className="forum-container">

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
                        open={openModal}
                        onClose={handleClose}
                        fullWidth
                        maxWidth="sm"
                        sx={{
                            "& .MuiDialog-paper": {
                                backgroundColor: "var(--color-primary-bg) !important"
                            },
                            borderRadius: { xs: 0, md: "15px" },
                            width: { md: "490px" },
                            maxWidth: { md: "490px" },
                            height: { md: "auto" },
                            maxHeight: { md: "calc(100% - 80px)" },
                            margin: { md: "auto" }
                        }}
                    >
                        <PostForm
                            onPostCreated={handlePostCreated}
                            onClose={handleClose}
                        />
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
                            currentUser?.sub === posts.find(p => p.id === selectedPostId)?.authorInfo.id
                        }
                    />

                    <Box className="scrollbar"
                        ref={scrollAreaRef}
                        sx={{
                            width: "100%",

                            height: { xs: "auto", md: "100%" },
                            maxHeight: { md: "100%" },

                            overflowY: { xs: "visible", md: "scroll" },
                            overflowX: "hidden",
                            scrollbarWidth: { md: "thin" },
                            scrollbarColor: { md: "white transparent" },

                            '&::-webkit-scrollbar': { width: '6px', },

                            '&::-webkit-scrollbar-track': { background: 'transparent', },

                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: 'white',
                                borderRadius: '10px',
                            },
                        }}>

                        <Box sx={{
                            px: { md: 1 },
                            pb: { xs: "80px", md: "20px" }
                        }}> {/*adds padding for scrollbar.*/}
                            {filteredPosts.length > 0 ? (
                                filteredPosts.map((post) => (
                                    <PostCard
                                        key={post.id}
                                        post={post}
                                        expanded={expanded === post.id}
                                        onExpand={() => handleExpandClick(post.id)}
                                        onMenuOpen={(event) => handleMenuOpen(event, post.id)}
                                        userBookmarks={userBookmarks}
                                        currentUser={currentUser}
                                        setUserBookmarks={setUserBookmarks}
                                        userPostHugs={userPostHugs}
                                        setUserPostHugs={setUserPostHugs}
                                    />
                                ))
                            ) : (
                                <Box className="forum-empty-state-panel">
                                    <Typography className="forum-empty-state">
                                        {emptyStateMessage}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </Box>
                </div>
            </div>
        </>
    );
};
export default ForumPage;