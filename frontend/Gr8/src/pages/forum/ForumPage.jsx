import PostForm from "../../components/postForm/PostForm";
import {
    Dialog,
    Card,
    CardHeader,
    CardContent,
    IconButton,
    Typography,
    Collapse
} from "@mui/material";

import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { styled } from "@mui/material/styles";
import { useState } from "react";

const posts = [
    {
        id: 1,
        userName: "Big Mac",
        title: "Första inlägget",
        content: "Detta är innehållet i det första inlägget.",
        date: "2023-10-01"
    }
];

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    marginLeft: "auto",
    transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
    transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest,
    }),
}));

export default function ForumPage() {
    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <>
            <Dialog open={false} fullWidth maxWidth="sm" PaperProps={{ style: { borderRadius: 20 } }}>
                <PostForm />
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
