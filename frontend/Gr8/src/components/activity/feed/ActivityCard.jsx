import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOnlineUsers } from "../../../contexts/OnlineUsersContext";
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
import BookmarkButton from "../../bookmarkButton/BookmarkButton.jsx";
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import LinkIcon from '@mui/icons-material/Link';
import useViewport from "../../../hooks/useViewport";


const ActivityCard = ({ activity, distance, currentUserId, onCardAction, onBookmarkToggle, onAddToCalendar, isHighlighted, markedDates, scrollingActivityId, clearScrollingActivityId }) => {
    const [expanded, setExpanded] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const { isDesktop } = useViewport();
    const { isUserOnline } = useOnlineUsers();

    const isOnline = isUserOnline(
        activity.creator?.id || activity.user?.id || activity.userId
    );

    const isOwner = currentUserId === activity.userId;
    const dateText = dayjs(activity.startAt).format('D MMMM');
    const timeText = dayjs(activity.startAt).format('[Kl.] HH:mm');

    const [addedToCalendar, setAddedToCalendar] = useState(
        markedDates?.some(m => m.activityId === activity.id) ?? false
    );

    useEffect(() => {
        if (scrollingActivityId && scrollingActivityId === activity.id) {
            setExpanded(true);

            //When card is expanded, scroll to it
            if (clearScrollingActivityId) {
                clearScrollingActivityId();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scrollingActivityId, activity.id]);

    const handleExpand = () => {
        setExpanded(!expanded);
    };

    // Open 3 dots menu
    const handleDialogOpen = (e) => {
        e.stopPropagation();
        setIsDialogOpen(true);
    };

    const handleDialogClose = (e) => {
        if (e) e.stopPropagation();
        setIsDialogOpen(false);
    };

    const handleEdit = async (e) => {
        handleDialogClose(e);
        setError("");
        onCardAction("edit", activity);
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

    const handleAddToCalendar = (e) => {
        e.stopPropagation();
        if (addedToCalendar) return;
        setAddedToCalendar(true);
        onAddToCalendar?.(activity);
    };

    useEffect(() => {
        if (isHighlighted) {
            setExpanded(true);
        }
    }, [isHighlighted]);

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
                <Box onClick={(e) => e.stopPropagation()} sx={{ paddingTop: 1, paddingRight: 1 }}>
                    <BookmarkButton
                        isBookmarked={activity.isBookmarked}
                        onToggle={async () => {
                            try {
                                const response = await ActivityServices.toggleBookmark(activity.id);
                                const newBookmarkStatus = response.data ? response.data.isBookmarked : response.isBookmarked;
                                onBookmarkToggle(activity.id, newBookmarkStatus);
                                return newBookmarkStatus;
                            } catch (err) {
                                console.error("Kunde inte toggla bokmärke", err);
                                return activity.isBookmarked;
                            }
                        }}
                        savedText="Du har sparat aktiviteten"
                    />
                </Box>
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
                <Box
                    sx={{
                        position: 'absolute',
                        top: "10px",
                        left: '15px',
                    }}
                >
                    <Box
                        sx={{
                            position: "relative",
                            width: "fit-content",
                            flexShrink: 0,
                        }}
                    >
                        <Avatar
                            className="post-avatar"
                            avatar={activity.authorInfo?.avatarId}
                        />
                        <Box
                            sx={{
                                position: "absolute",
                                top: isDesktop ? -5 : -2,
                                right: isDesktop ? -5 : -5,
                                width: isDesktop ? 14 : 12,
                                height: isDesktop ? 14 : 12,
                                borderRadius: "50%",
                                backgroundColor: isOnline ? "#22C55E" : "#D9D9D9",
                                border: "2px solid var(--color-bg-main)",
                            }}
                        />
                    </Box>
                </Box>

                {/* Info texts */}
                <Box sx={{ ml: 8, flex: 1 }}>
                    <Typography sx={{ fontWeight: 800, fontSize: '0.9rem' }}>{dateText}</Typography>
                    <Typography sx={{ fontSize: '0.75rem', opacity: 0.6 }}>{timeText}</Typography>
                </Box>

                <Box sx={{ textAlign: 'center', flex: 1, pr: 2 }}>
                    <Typography variant="body1" sx={{ color: "var(--color-ui-muted)" }}>
                        <span style={{ fontWeight: 600 }}>{activity.calendarCount ?? 0} </span>anmälda
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

                    {/* Description*/}
                    <Typography variant="body2" sx={{
                        mt: 1.5,
                        mb: 2,
                        px: 1,
                        lineHeight: 1.5,
                    }}>
                        {activity.description || "Ingen beskrivning tillgänglig för denna aktivitet."}
                    </Typography>

                    {/* Adress and URL */}
                    <Box sx={{ display: "flex", flexDirection: "row" }} >
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

                        {(activity.url || activity.Url) && (
                            <Typography
                                variant="caption"
                                component="a"
                                href={activity.url || activity.Url}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                    mt: 1, mb: 1,
                                    px: 0.5,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                    textDecoration: "none",
                                    color: "inherit",
                                    "&:hover": { textDecoration: "underline" }
                                }}
                            >
                                <LinkIcon sx={{ fontSize: "20px", mb: 0.2, ml: 2, color: "var(--color-primary)", rotate: '135deg' }} />
                                {(() => {
                                    try {
                                        const fullUrl = activity.url || activity.Url;
                                        const validUrl = fullUrl.startsWith('http') ? fullUrl : `https://${fullUrl}`;
                                        return new URL(validUrl).hostname; // Shorter URL text
                                    } catch {
                                        return "Gå till länk"; // Fallback
                                    }
                                })()}
                            </Typography>
                        )}
                    </Box>

                    {activity.imageUrl && (
                        <Box sx={{
                            width: '100%',
                            mt: 1.5,
                            mb: 1,
                            px: 0.5,
                            overflow: 'auto',
                            height: '90px',
                        }}>
                            <Box
                                component="img"
                                src={activity.imageUrl}
                                alt={activity.title || "Aktivitetsbild"}
                                sx={{
                                    width: '100%',
                                    maxHeight: '200px',
                                    objectFit: 'cover',
                                    borderRadius: '15px',
                                    border: '1px solid var(--color-border-light)',
                                    opacity: 0.95,
                                }}
                            />
                        </Box>
                    )}

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
                            onClick={(e) => {
                                e.stopPropagation();

                                navigate(`/message/${activity.userId}`);
                            }}
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
                            startIcon={
                                addedToCalendar
                                    ? <TaskAltIcon sx={{ color: "var(--color-primary)", fontSize: "25px !important" }} />
                                    : <TodayOutlinedIcon sx={{ color: "var(--color-primary)", fontSize: "25px !important" }} />
                            }
                            onClick={handleAddToCalendar}
                            sx={{ borderRadius: '20px', height: '40px', width: "180px", whiteSpace: 'nowrap', ml: "auto" }}
                        >
                            {addedToCalendar ? "Tillagd!" : "Lägg till aktivitet"}
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