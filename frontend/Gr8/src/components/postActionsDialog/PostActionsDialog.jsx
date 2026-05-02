import './PostActionsDialog.css';
import CloseIcon from "../../assets/icons/closeIcon.svg";
import EditIcon from "../../assets/icons/pencil.svg";
import DeleteIcon from "../../assets/icons/delete.svg";
import ReportIcon from "../../assets/icons/report.svg";

// this file is for the dialog that opens when you click the three dots on a post, 
// allowing you to report, edit or delete the post depending on if you are the owner of the post or not.

import {
    Dialog,
    DialogTitle,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText
} from "@mui/material";

const PostActionsDialog = ({
    open,
    onClose,
    onReport,
    onDelete,
    onEdit,
    isOwner,
}) => {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">

            <div className="actions-header">
                <DialogTitle className="actions-title">
                    Inlägg
                </DialogTitle>
                <IconButton onClick={onClose} className="actions-item">
                    <img src={CloseIcon} alt="" className="close-icon" />
                </IconButton>
            </div>

            <List className="actions-list">
                {/* Report is only shown if the user is the owner of the post */}
                {!isOwner && (
                    <ListItemButton onClick={onReport} className="actions-item">
                        <ListItemIcon className="actions-item">
                            <img src={ReportIcon} alt="" className="report-icon" />
                        </ListItemIcon>
                        <ListItemText primary="Anmäl inlägg" />
                    </ListItemButton>
                )}

                {/* Delete & Edit is only shown if the user is the owner of the post */}
                {isOwner && (
                    <>
                        <ListItemButton onClick={onDelete} className="actions-item">
                            <ListItemIcon className="actions-item">
                                <img src={DeleteIcon} alt="" className="delete-icon" />
                            </ListItemIcon>
                            <ListItemText primary="Radera inlägg" />
                        </ListItemButton>

                        <ListItemButton onClick={onEdit} className="actions-item">
                            <ListItemIcon className="actions-item">
                                <img src={EditIcon} alt="" className="edit-icon" />
                            </ListItemIcon>
                            <ListItemText primary="Redigera inlägg" />
                        </ListItemButton>
                    </>
                )}
            </List>
        </Dialog>
    )
}
export default PostActionsDialog;
