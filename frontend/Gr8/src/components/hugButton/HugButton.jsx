import { useState } from "react";
import { IconButton, Snackbar, Alert } from "@mui/material";
import PostServices from "../../services/PostServices";
import CommentServices from "../../services/CommentServices";
import { useAuth } from "../../hooks/useAuth";
import FavoriteIcon from "@mui/icons-material/Favorite"
import FavoriteIconBorder from "@mui/icons-material/FavoriteBorder"


const HugButton = ({ type, id }) => {
    const { currentUser } = useAuth();
    const [hugged, setHugged] = useState(false);
    const [open, setOpen] = useState(false);

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

    return (
        <>
            <IconButton aria-label="hug" onClick={handleHug} color={hugged ? "primary" : "default"}>
                {hugged ? <FavoriteIcon /> : <FavoriteIconBorder />}
            </IconButton>

            <Snackbar open={open} autoHideDuration={2500} onClose={() => setOpen(false)}>

                <Alert severity="success" onClose={() => setOpen(false)}>
                    Du har gett en kram
                </Alert>
            </Snackbar>
        </>
)}
export default HugButton;


