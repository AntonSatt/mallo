import { useState } from "react";
import ActivityServices from "../../../services/ActivityService.jsx";
import { Paper, Box, Typography, IconButton, Collapse, Dialog } from "@mui/material";
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import dayjs from 'dayjs';
import Avatar from "../../avatar/avatar.jsx";
import SecondaryButton from "../../../design/buttons/SecondaryButton.jsx";
import TodayOutlinedIcon from '@mui/icons-material/TodayOutlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ChatBubble from "../../../assets/icons/commentBubble.svg";
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ReportOutlinedIcon from '@mui/icons-material/ReportOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CloseIcon from "../../../assets/icons/closeIcon.svg";

const ActivityCard = ({ activity, distance, currentUserId, onCardAction }) => {
    const [expanded, setExpanded] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const isOwner = currentUserId === activity.userId;
    const dateText = dayjs(activity.startAt).format('D MMMM');
    const timeText = dayjs(activity.startAt).format('[Kl.] HH:mm');

    const handleExpand = () => {
        setExpanded(!expanded);
    };

    const handleBookmarkedClick = (e) => {
        e.stopPropagation(); // Stops the click from propagating to the card's onClick, so it won't toggle the expansion
        setIsBookmarked(!isBookmarked);
    };

    // Open 3 dots menu
    const handleDialogOpen = (e) => {
        e.stopPropagation();
        setIsDialogOpen(true);
    };

    // Close menu
    const handleDialogClose = (e) => {
        if (e) e.stopPropagation();
        setIsDialogOpen(false);
    };

    const handleEdit = async (e) => {
        handleDialogClose(e);
        setError("");
        setLoading(true);

        try {
            await ActivityServices.update(activity.id);
            onCardAction("Aktiviteten har redigerats!", "success", activity.id);

        } catch (error) {
            if (error.response?.status === 403) {
                setError("Du får inte ta redigera denna aktivitet.");
            }
            else if (error.response?.status === 404) {
                setError("Aktiviteten hittades inte.");
            }
            else {
                setError("Aktiviteten kunde inte redigeras. Försök igen.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (e) => {
        handleDialogClose(e);
        setError("");
        setLoading(true);

        try {
            await ActivityServices.delete(activity.id);
            onCardAction("Aktiviteten har raderats!", "success", activity.id);

        } catch (error) {
            if (error.response?.status === 403) {
                setError("Du får inte ta bort denna aktivitet.");
            }
            else if (error.response?.status === 404) {
                setError("Aktiviteten hittades inte.");
            }
            else {
                setError("Aktiviteten kunde inte tas bort. Försök igen.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleReport = (e) => {
        handleDialogClose(e);
        // TODO: report logic & add in ActivityServices
    };

    return (
        <Paper elevation={2}
            onClick={handleExpand}
            sx={{
                borderRadius: '25px',
                overflow: 'hidden',
                bgcolor: 'white',
                mb: 3,
                '&:active': { transform: 'scale(0.98)' }

            }}>
            {/* Header - beige */}
            <Box sx={{
                bgcolor: 'var(--color-primary-soft)',
                p: 0,
                pb: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
            }}>
                <Typography variant="h6" sx={{
                    fontWeight: 600,
                    paddingLeft: 2,
                    paddingTop: 1
                }}>
                    {activity.title}
                </Typography>
                <IconButton
                    size="small"
                    onClick={handleBookmarkedClick}
                    sx={{ color: 'var(--color-primary)', mr: 2, mt: 0.5 }}
                >
                    {isBookmarked ? (
                        <BookmarkIcon /> // Filled bookmark
                    ) : (
                        <BookmarkBorderOutlinedIcon />   // Outlined bookmark
                    )}
                </IconButton>
            </Box>

            {/* Bottom part - white info*/}
            <Box sx={{
                p: 2,
                pt: 2,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                {/* Avatar component*/}
                <Box sx={{
                    position: 'absolute',
                    top: "10px",
                    left: '15px',
                }}>
                    <Avatar
                        className="post-avatar"
                        avatar={activity.creator?.picture || activity.user?.picture}
                    />
                </Box>


                {/* Info texts */}
                <Box sx={{ ml: 8, flex: 1 }}>
                    <Typography sx={{ fontWeight: 800, fontSize: '0.9rem' }}>{dateText}</Typography>
                    <Typography sx={{ fontSize: '0.75rem', opacity: 0.6 }}>{timeText}</Typography>
                </Box>

                <Box sx={{ textAlign: 'center', flex: 1, pr: 2 }}>
                    <Typography variant="body1" sx={{ color: "var( --color-ui-muted)" }}>
                        <span style={{ fontWeight: 600 }}>27 </span>anmälda
                    </Typography>
                </Box>

                {/* Vertical line & distance*/}
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    borderLeft: '2px solid var( --color-ui-muted)',
                    pl: 2,
                    height: '30px'
                }}>
                    <Typography variant="h9" sx={{
                        fontWeight: 800,
                        color: 'var(--color-primary)',
                    }}>
                        {distance ? distance : "-- m"}
                    </Typography>
                </Box>
            </Box>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <Box sx={{ p: 2, pt: 0, borderBottomLeftRadius: '25px', borderBottomRightRadius: '25px' }}>

                    <Typography variant="body2" sx={{
                        mt: 1, mb: 1, px: 1,
                        fontWeight: 600
                    }}>
                        {activity.fullName || "Okänd"}
                    </Typography>

                    <Typography variant="caption" sx={{
                        mt: 1, mb: 1,
                        px: 0.5,
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5
                    }}>
                        <LocationOnOutlinedIcon sx={{ fontSize: "20px", mb: 0.5, color: "var(--color-primary)" }} />
                        {activity.adress || "Ingen plats angiven"}
                    </Typography>


                    {/* Description*/}
                    <Typography variant="body2" sx={{
                        mt: 1.5,
                        mb: 2,
                        px: 1,
                        lineHeight: 1.5,
                    }}>
                        {activity.description || "Ingen beskrivning tillgänglig för denna aktivitet."}
                    </Typography>

                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        width: '100%',
                        mt: 'auto',
                        pt: 2
                    }}>
                        <SecondaryButton
                            onClick={handleDialogOpen}
                            sx={{
                                borderRadius: "50%", height: "40px", width: "40px", minWidth: "unset",
                                p: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                                mr: 2, ml: 0.5
                            }}
                            startIcon={<MoreHorizIcon sx={{ color: "var(--color-primary)", marginLeft: 1.5, fontSize: "25px !important" }} />}
                        >
                        </SecondaryButton>

                        <SecondaryButton
                            sx={{
                                borderRadius: "50%", height: "40px", width: "40px", minWidth: "unset",
                                p: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0
                            }}

                        >
                            <img
                                src={ChatBubble}
                                alt="Chat"
                                style={{
                                    width: "23px",
                                    height: "23px",
                                    color: "var(--color-primary)",
                                }}
                            />
                        </SecondaryButton>

                        <SecondaryButton
                            startIcon={<TodayOutlinedIcon sx={{ color: "var(--color-primary)", fontSize: "25px !important" }} />}
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                            sx={{ borderRadius: '20px', height: '40px', width: "180px", whiteSpace: 'nowrap', ml: "auto" }}
                        >
                            Lägg till aktivitet
                        </SecondaryButton>
                    </Box>
                </Box>
            </Collapse>

            {/* Dialog for 3 dots menu */}
            <Dialog
                open={isDialogOpen}
                onClose={handleDialogClose}
                onClick={(e) => e.stopPropagation()}
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: '25px',
                            width: '100%',
                            maxWidth: '360px',
                            p: 0,
                            overflow: 'hidden',
                            backgroundColor: 'white'
                        }
                    }
                }}
            >
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3, pb: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        Aktivitet
                    </Typography>
                    <IconButton onClick={handleDialogClose} >
                        <img src={CloseIcon} alt="close" style={{ width: "25px", height: "25px" }} />
                    </IconButton>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column' }}>

                    <Box
                        onClick={(e) => {
                            e.stopPropagation();
                            handleReport(e);
                            handleDialogClose();
                        }}
                        sx={{
                            display: 'flex', alignItems: 'center', gap: 2, p: 2.5, px: 3,
                            cursor: 'pointer', borderTop: '1px solid var(--color-ui-muted)',
                            '&:hover': { bgcolor: "var(--color-bg-muted)" }
                        }}
                    >
                        {<ReportOutlinedIcon sx={{ color: "var(--color-primary)" }} />}
                        <Typography sx={{ fontSize: '1.1rem' }}>Anmäl aktivitet</Typography>
                    </Box>

                    {isOwner && (
                        <>
                            <Box
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(e);
                                    handleDialogClose();
                                }}
                                sx={{
                                    display: 'flex', alignItems: 'center', gap: 2, p: 2.5, px: 3,
                                    cursor: 'pointer', borderTop: '1px solid var(--color-ui-muted)',
                                    '&:hover': { bgcolor: "var(--color-bg-muted)" }
                                }}
                            >
                                {<CancelOutlinedIcon sx={{ color: "var(--color-primary)" }} />}
                                <Typography sx={{ fontSize: '1.1rem' }}>Radera aktivitet</Typography>
                            </Box>

                            <Box
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleEdit(e);
                                    handleDialogClose();
                                }}
                                sx={{
                                    display: 'flex', alignItems: 'center', gap: 2, p: 2.5, px: 3,
                                    cursor: 'pointer', borderTop: '1px solid var(--color-ui-muted)',
                                    '&:hover': { bgcolor: "var(--color-bg-muted)" }
                                }}
                            >
                                {<EditOutlinedIcon sx={{ color: "var(--color-primary)" }} />}
                                <Typography sx={{ fontSize: '1.1rem' }}>Redigera aktivitet</Typography>
                            </Box>
                        </>
                    )}
                </Box>
            </Dialog>
        </Paper>
    );
};

export default ActivityCard;