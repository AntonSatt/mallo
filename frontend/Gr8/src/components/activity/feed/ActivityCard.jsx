import { useState } from "react";
import { Paper, Box, Typography, IconButton, Collapse } from "@mui/material";
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import dayjs from 'dayjs';
import Avatar from "../../avatar/avatar.jsx";
import SecondaryButton from "../../../design/buttons/SecondaryButton.jsx";
import TodayOutlinedIcon from '@mui/icons-material/TodayOutlined';

const ActivityCard = ({ activity, distance }) => {
    const [expanded, setExpanded] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    const dateText = dayjs(activity.startAt).format('D MMMM');
    const timeText = dayjs(activity.startAt).format('[Kl.] HH:mm');

    const handleExpand = () => {
        setExpanded(!expanded);
    };

    const handleFavoriteClick = (e) => {
        e.stopPropagation(); // Stops the click from propagating to the card's onClick, so it won't toggle the expansion
        setIsFavorite(!isFavorite);
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
                    onClick={handleFavoriteClick}
                    sx={{ color: 'var(--color-primary)', mr: 2, mt: 0.5 }}
                >
                    {isFavorite ? (
                        <FavoriteOutlinedIcon /> // Filled heart
                    ) : (
                        <FavoriteBorderOutlinedIcon />   // Outlined heart
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
                        mt: 1,
                        mb: 1,
                        px: 1,
                        fontWeight: 600
                    }}>
                        {activity.fullName || "Okänd"}
                    </Typography>

                    {/* Description*/}
                    <Typography variant="body2" sx={{
                        mt: 1,
                        mb: 2,
                        px: 1,
                        lineHeight: 1.5,
                    }}>
                        {activity.description || "Ingen beskrivning tillgänglig för denna aktivitet."}
                    </Typography>

                    <SecondaryButton
                        startIcon={<TodayOutlinedIcon sx={{ color: "var(--color-primary)" }} />}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                        sx={{ borderRadius: '20px', height: '40px', width: "150px", whiteSpace: 'nowrap', ml: 22 }}
                    >
                        Lägg till aktivitet
                    </SecondaryButton>
                </Box>
            </Collapse>
        </Paper>
    );
};

export default ActivityCard;