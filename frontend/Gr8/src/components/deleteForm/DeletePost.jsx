import { useState, useEffect } from "react";
import PostServices from "../../services/PostServices";
import * as React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const DeletePost = ({ postId, open, onClose, onPostDeleted }) => {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handlePostDelete = async () => {
        setError("");
        setLoading(true);

        try {
            await PostServices.delete(postId);
            onPostDeleted(postId);
            onClose();
        } catch (error) {
            if (error.response?.status === 403) {
                setError("Du får inte ta bort detta inlägg.");
            }
            else if (error.response?.status === 404) {
                setError("Inlägget hittades inte.");
            }
            else {
                setError("Inlägget kunde inte tas bort. Försök igen.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>

            <DialogTitle>
                Radera inlägg

                <IconButton
                    onClick={onClose}
                    sx={{ position: "absolute", right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <Typography>
                    Är du säker på att du vill radera detta inlägg?
                </Typography>

                {error && (
                    <Typography color="error" sx={{ mt: 2 }}>
                        {error}
                    </Typography>
                )}
            </DialogContent>

            <DialogActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button onClick={onClose} disabled={loading}>
                    Avbryt
                </Button>

                <Button
                    onClick={handlePostDelete}
                    color="error"
                    variant="contained"
                    disabled={loading}
                >
                    {loading ? "Raderar..." : "Radera"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeletePost;
