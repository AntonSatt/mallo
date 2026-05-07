import './PostActionsDialog.css';
import CloseIcon from "../../assets/icons/closeIcon.svg";
import EditIcon from "../../assets/icons/pencil.svg";
import DeleteIcon from "../../assets/icons/delete.svg";
import ReportIcon from "../../assets/icons/report.svg";
import useViewport from '../../hooks/useViewport';

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

    const {isDesktop} = useViewport();

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" sx={{
            "& .MuiDialog-paperWidthXs": { 
                maxWidth: isDesktop ? "260px" : undefined, //controls the width of the dialog in desktop view.
            },
            "& .MuiPaper-root": {
                borderRadius: isDesktop ?"24px" : undefined,
                overflow: "hidden",
            }
        }}>

            <div className="actions-header">
                <DialogTitle className="actions-title">
                    Inlägg
                </DialogTitle>
                <IconButton onClick={onClose} className="actions-item" sx={{
                    width: isDesktop ? "30px" : undefined, //controls the width of the close button in desktop view.
                    height: isDesktop ? "30px" : undefined,

                    "& img": {
                        width: isDesktop ? "20px" : undefined, 
                        height: isDesktop ? "20px" : undefined,
                    }
                }}>
                    <img src={CloseIcon} alt="" />
                </IconButton>
            </div>

            <List className="actions-list">
                {/* Report is only shown if the user is the owner of the post */}
                {!isOwner && (
                    <ListItemButton onClick={onReport} className="actions-item">
                        <ListItemIcon>
                            <img src={ReportIcon} alt="" />
                        </ListItemIcon>
                        <ListItemText primary="Anmäl inlägg" />
                    </ListItemButton>
                )}

                {/* Delete & Edit is only shown if the user is the owner of the post */}
                {isOwner && (
                    <>
                        <ListItemButton onClick={onDelete} className="actions-item">
                            <ListItemIcon>
                                <img src={DeleteIcon} alt="" />
                            </ListItemIcon>
                            <ListItemText primary="Radera inlägg" />
                        </ListItemButton>

                        <ListItemButton onClick={onEdit} className="actions-item">
                            <ListItemIcon>
                                <img src={EditIcon} alt="" />
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
