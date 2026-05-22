import "./PostCard.css";
import moment from "moment";
import { useState } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import HugButton from "../hugButton/HugButton";
import CommentForm from "../commentForm/CommentForm";
import CommentBubble from "../../assets/icons/commentBubble.svg";
import FilledCommentBubble from "../../assets/icons/filledCommentBubble.svg";
import {
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Collapse,
    Typography,
    Box,
    IconButton
} from "@mui/material";
import BookmarkButton from "../../components/bookmarkButton/BookmarkButton.jsx";
import Avatar from "../avatar/avatar.jsx";
import PostServices from "../../services/PostServices";

//this file contains the PostCard component, which is used to display a post in the feed. 
// It takes in the post data as props and displays the post's title, content, author, category, tags, 
// and actions (hug, save, comment). It also has a collapsible section for comments.
const PostCard = ({
    post,
    expanded,
    onExpand,
    onMenuOpen,
    userBookmarks,
    currentUser,
    setUserBookmarks,
    userPostHugs }) => {
    const categoryName = post.category?.name || post.category || "Ingen kategori";
    const [showFullContent, setShowFullContent] = useState(false);

    return (
        <>
            <Card className="post-card">
                <CardHeader avatar={
                    <Avatar className="post-avatar" avatar={post.authorInfo.avatarId} />
                }
                    title={
                        <Box className="post-user-row">
                            <Typography className="post-username">
                                {post.authorInfo.userName}
                            </Typography>

                            <Typography className="post-category">
                                {categoryName}
                            </Typography>
                        </Box>
                    }
                    subheader={moment(post.createdAt).fromNow()}
                    action={
                        <IconButton aria-label="more" onClick={onMenuOpen} className="post-action-icon">
                            <MoreHorizIcon />
                        </IconButton>
                    }
                    className="post-header"
                />

                <CardContent className="post-card-content">
                    <Typography className="post-title">
                        {post.title}
                    </Typography>

                    <Typography className={showFullContent ? "post-content-preview-expanded" : "post-content-preview"}>
                        {post.content}
                    </Typography>

                    {post.content?.length > 180 && (
                        <span size="small" className="post-read-more" onClick={() => setShowFullContent(prev => !prev)}>
                            {showFullContent ? "Visa mindre" : "läs mer"}
                        </span>
                    )}

                    {/*Check if there are tags and display them.*/}
                    {post.tags && post.tags.length > 0 && (
                        <Typography variant="caption" className="post-tags">
                            Trigger: {post.tags.map((tag) => tag.name || tag).join(", ")}
                        </Typography>
                    )}
                </CardContent>

                <CardActions className="post-actions">

                    <HugButton
                        type="post"
                        id={post.id}
                        userPostHugs={userPostHugs}
                    />

                    <BookmarkButton
                        isBookmarked={!!userBookmarks?.find(b => b.postId === post.id && b.userId === currentUser.sub)}
                        onToggle={async () => {
                            const result = await PostServices.bookmarkPost(post.id, currentUser.sub);
                            if (result.bookmarked) {
                                setUserBookmarks(prev => [...prev, { postId: post.id, userId: currentUser.sub }]);
                            } else {
                                setUserBookmarks(prev => prev.filter(b => !(b.postId === post.id && b.userId === currentUser.sub)));
                            }
                            return result.bookmarked;
                        }}
                        savedText="Du har sparat inlägget"
                    />

                    <IconButton onClick={onExpand}
                        aria-expanded={expanded}
                        aria-label="Visa kommentarerna"
                        className="post-comment-button">

                        {expanded ? <img src={FilledCommentBubble} alt="" /> : <img src={CommentBubble} alt="" />}
                        <Typography variant="caption" className="post-comment-count">
                            {post.countOfComments || 0}
                        </Typography>
                    </IconButton>
                </CardActions>

                {/*Collapsing comment section.*/}
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent className="post-comments">
                        <CommentForm postId={post.id} />
                    </CardContent>
                </Collapse>
            </Card>
        </>
    );
};
export default PostCard;