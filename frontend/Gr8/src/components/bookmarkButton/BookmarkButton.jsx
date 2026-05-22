import {useState} from "react";
import PostServices from "../../services/PostServices"
import {IconButton, Snackbar, Alert } from "@mui/material"
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';

const BookmarkButton = ({postId, userBookmarks, currentUser, setUserBookmarks}) => {
    const [bookmarked, setBookmarked] = useState(userBookmarks?.find(b => b.postId === postId && b.userId === currentUser.sub));
    const [open, setOpen] = useState(false);

    const handleBookmark = async () => {
       try{
            if(!currentUser?.sub) {
                console.log("User Id is missing")
                return; 
        }

        const result = await PostServices.bookmarkPost(postId, currentUser.sub)
        if (result.bookmarked) {
            setUserBookmarks(prev => [...prev, { postId: postId, userId: currentUser.sub }])
        }
        else {
            setUserBookmarks(prev => prev.filter(b => !(b.postId === postId && b.userId === currentUser.sub)));
        }

        setBookmarked(!bookmarked);

        if(!bookmarked){
            setOpen(true);
        }

    } 
        catch(error){
            console.error("Error with bookmark: ", error)
        }
    };

    return(
        <>
            <IconButton 
                sx={{color: "var(--color-primary)"}}
                aria-label="bookmark"
                onClick={handleBookmark}
                color={bookmarked ? "primary" : "default"}
                >
                {bookmarked ? <BookmarkIcon/> : <BookmarkBorderIcon/>}
            </IconButton>   

            <Snackbar
                open={open}
                autoHideDuration={2500}
                onClose={() => setOpen(false)}
                >
                <Alert 
                 sx={{
                    backgroundColor: "white",
                    "& .MuiAlert-icon":{color: "var(--color-primary)"},
                    border: "1px solid var(--color-border-light)"
                 }}
                    severity="success"
                    >
                        Du har sparat inlägget
                </Alert>
            </Snackbar>         
        </>
    )
};

export default BookmarkButton;