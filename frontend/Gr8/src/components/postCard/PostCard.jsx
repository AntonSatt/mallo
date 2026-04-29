import "./PostCard.css";
import moment from "moment";

import {
    Avatar,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Collapse,
    Typography,
    Box,
    IconButton
} from "@mui/material";

import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import HugButton from "../hugButton/HugButton";
import CommentForm from "../commentForm/CommentForm";

const PostCard = ({ post, expanded, onExpand, onMenuOpen }) => {
    const categoryName = post.category?.name || post.category || "Ingen kategori";

    return (
        <>
            <Card className="post-card">
                <CardHeader avatar={
                    <Avatar className="post-avatar">
                        {post.userName?.charAt(0)?.toUpperCase()} 
                    </Avatar>

                }
                    title={
                        <Box className="post-user-row">
                            <Typography className="post-user-name">
                                {post.userName}
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

                        <Typography variant="body2" className="post-content-preview">
                            {post.content}
                        </Typography>

                {/*Check if there are tags and display them.*/}
                        {post.tags && post.tags.length > 0 && (
                            <Typography variant="caption" className="post-tags">
                                Trigger: {post.tags.map((tag) => tag.name || tag).join(", ")}
                            </Typography>
                        )}
                    </CardContent>

                    <CardActions className="post-actions">

                        <HugButton type="post" id={post.id} />

                        <IconButton aria-label="save" className="post-action-icon">
                            <BookmarkBorderIcon />
                        </IconButton>

                        <IconButton onClick={onExpand}
                            aria-expanded={expanded}
                            aria-label="Visa kommentarerna"
                            className="post-comment-button">

                            <ChatBubbleOutlineOutlinedIcon />
                        </IconButton>
                    </CardActions>

            {/*Collapsing comment section.*/}
                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <CardContent className="post-comments">
                            <Typography variant="subtitle2" gutterBottom>
                                Kommentarer
                            </Typography>

                            <CommentForm postId={post.id} />

                        </CardContent>
                    </Collapse>
            </Card>
        </>
    );
};
export default PostCard;