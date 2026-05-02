import './PostActionsDialog.css';
import CloseIcon from "../../assets/icons/closeIcon.svg";
import EditIcon from "../../assets/icons/pencil.svg";
import DeleteIcon from "../../assets/icons/delete.svg";
import ReportIcon from "../../assets/icons/report.svg";

import {
    Dialog,
    Dialogtitle,
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

                <IconButton onclick={onClose} className="actions-item">
                    <img src={CloseIcon} alt="" className="close-icon" />
                </IconButton>
            </div>

            <List className="actions-list">

                <ListItemButton onClick={onReport} className="actions-item">
                    <ListItemIcon className="actions-item">
                        <img src={ReportIcon} alt="" className="report-icon" />
                    </ListItemIcon>
                    <ListItemText primary="Anmäl inlägg" />
                </ListItemButton>

                {isOwner && (
                    <>
                    <ListItemButton onClick={onDelete} className="actions-item">
                        <ListItemIcon className="actions-item">
                            <img src={DeleteIcon} alt="" className="delete-icon" />
                        </ListItemIcon>
                        <ListItemText primary="Radera inlägg" />
                    </ListItemButton>

                    <ListItenButton onClick={onEdit} className="actions-item">
                        <ListItemIcon className="actions-item">
                            <img src={EditIcon} alt="" className="edit-item" />
                        </ListItemIcon>
                        <ListItemText primary="Redigera inlägg" />
                    </ListItenButton>
                    </>
                )}
            </List>
        </Dialog>
)}
export default PostActionsDialog;
