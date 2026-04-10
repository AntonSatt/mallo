import PostForm from "../../components/postForm/PostForm";
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
    DialogActions
} from "@mui/material";

import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import PostServices from "../../services/PostServices";

const ForumPage = () => {
    const [expanded, setExpanded] = useState(false);
    const [open, setOpen] = useState(false);
    const [posts, setPosts] = useState([]);

    const ExpandMore = styled((props) => {
        const { ...other } = props;
        return <IconButton {...other} />;
    })(({ theme, expand }) => ({
        marginLeft: "auto",
        transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
        transition: theme.transitions.create("transform", {
            duration: theme.transitions.duration.shortest,
        }),
    }));

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = async (event) => {
        setOpen(false);
        console.log(event.target.id);
    };

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await PostServices.getAll();

                const allPosts = data.map((post) => ({
                    id: post.id,
                    title: post.title,
                    content: posts.length > 0 ? posts[0].content : "Innehåll saknas",
                }));

                setPosts([...allPosts, ...posts]);
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                // setLoading(false);
            }
        };

        fetchPosts();
    }, [posts]);

    return (
        <>
            <Button variant="outlined" color="error" onClick={handleClickOpen}>
                Skapa nytt inlägg...
            </Button>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" >
                <DialogTitle>Skapa nytt inlägg</DialogTitle>
                <PostForm />
                <DialogActions>
                    <Button variant="text " color="inherit" onClick={handleClose}>Avbryt</Button>
                </DialogActions>
            </Dialog>

            {posts.map((post) => (
                <Card key={post.id} sx={{ maxWidth: 500, marginBottom: 2 }}>
                    <CardHeader title={post.title}
                        subheader={`${post.userName} • ${post.date}`}
                        action={
                            <IconButton aria-label="settings">
                                <MoreVertIcon />
                            </IconButton>
                        } />

                    <CardContent>
                        <Typography variant="body2" color="text.secondary">
                            {post.content}
                        </Typography>
                    </CardContent>

                    <IconButton aria-label="share">
                        <ShareIcon />
                    </IconButton>

                    <ExpandMore
                        expand={expanded}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="show more"
                    >
                        <ExpandMoreIcon />
                    </ExpandMore>

                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <CardContent>
                            <Typography>Extra content här…</Typography>
                        </CardContent>
                    </Collapse>
                </Card>
            ))}
        </>
    );
}
export default ForumPage;
