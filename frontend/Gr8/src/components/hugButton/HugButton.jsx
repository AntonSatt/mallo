import './HugButton.css';
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import PostServices from "../../services/PostServices";
import CommentServices from "../../services/CommentServices";
import Hug from "../../assets/icons/hug.svg";
import Hugged from "../../assets/icons/hugged.svg";
import HugPopup from "../../assets/icons/hugPopup.svg";
import useViewport from '../../hooks/useViewport';

import {
    IconButton,
    Dialog,
    Box,
    Typography
} from "@mui/material";

//this component is used for both posts and comments, it takes in the type and id of the post/comment to know which one to hug.
const HugButton = ({
    type,
    id,
    userPostHugs,
    userCommentHugs }) => {
    const { currentUser } = useAuth();
    const { isDesktop } = useViewport();
    const [hugged, setHugged] = useState(false);
    const [open, setOpen] = useState(false);

    //this function is called when the user clicks the hug button, it sends a request to the backend to 
    // hug the post/comment and updates the state accordingly.
    const alreadyHugged =
        type === "post"
            ? Array.isArray(userPostHugs) && userPostHugs.some(hug => hug.postId === id)
            : Array.isArray(userCommentHugs) && userCommentHugs.some(hug => hug.commentId === id);

    const isHugged = hugged || alreadyHugged;

    const handleHug = async () => {
        try {
            if (!currentUser?.sub) {
                console.error("User id is missing.");
                return;
            }
            let result;

            if (type === "post") {
                result = await PostServices.hugPost(id, currentUser.sub)
            }

            if (type === "comment") {
                result = await CommentServices.hugComment(id, currentUser.sub)
            }

            console.log("Hug response:", result);

            setHugged(result.hugged);

            if (result.hugged) {
                setOpen(true);
            }
        } catch (error) {
            console.error("Error with hug:", error)
        }
    };

    // timeout to close the hug popup after 1.8 seconds.
    useEffect(() => {
        if (open) {
            setTimeout(() => setOpen(false), 1800);
        }
    }, [open]);

    return (
        <>
            <IconButton aria-label="hug" onClick={handleHug} className="hug-button">
                <img src={isHugged ? Hugged : Hug} alt="" className="hug-icon" />
            </IconButton>

            <Dialog open={open} onClose={() => setOpen(false)} className="hug-dialog"
                sx={{
                    "& .MuiPaper-root": {
                        borderRadius: isDesktop ? "24px" : undefined,
                        maxWidth: isDesktop ? "260px" : undefined
                    }
                }}
            >
                <Box className="hug-popup"
                    sx={{
                        ...(isDesktop && {
                            width: "260px",
                            padding: "20px",
                            boxSizing: "border-box",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                        }),
                    }}
                >
                    <Typography className="hug-popup-title">
                        Du har gett en kram
                    </Typography>
                    <img src={HugPopup} alt="" className="hug-popup-icon" />
                </Box>
            </Dialog>
        </>
    )
}
export default HugButton;


