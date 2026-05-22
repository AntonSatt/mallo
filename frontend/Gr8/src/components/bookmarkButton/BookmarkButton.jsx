import { useState } from "react";
import { IconButton, Snackbar, Alert } from "@mui/material";
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';

const BookmarkButton = ({ isBookmarked: initialBookmarked, onToggle, savedText = "Du har sparat!" }) => {
    const [bookmarked, setBookmarked] = useState(initialBookmarked ?? false);
    const [open, setOpen] = useState(false);

    const handleBookmark = async () => {
        try {
            const result = await onToggle();
            setBookmarked(result);
            if (result) setOpen(true);
        } catch (error) {
            console.error("Error with bookmark: ", error);
        }
    };

    return (
        <>
            <IconButton
                sx={{ color: "var(--color-primary)" }}
                aria-label="bookmark"
                onClick={handleBookmark}
            >
                {bookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
            </IconButton>

            <Snackbar open={open} autoHideDuration={2500} onClose={() => setOpen(false)}>
                <Alert
                    sx={{
                        backgroundColor: "white",
                        "& .MuiAlert-icon": { color: "var(--color-primary)" },
                        border: "1px solid var(--color-border-light)"
                    }}
                    severity="success"
                >
                    {savedText}
                </Alert>
            </Snackbar>
        </>
    );
};

export default BookmarkButton;