import { Box, Stack, Typography, InputAdornment } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import 'dayjs/locale/sv';
import dayjs from 'dayjs';
import PrimaryButton from '../../design/buttons/PrimaryButton';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import InputField from '../../design/input/InputField.jsx';
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import "./SidebarCalendar.css"
import { useNavigate } from 'react-router-dom';

dayjs.locale('sv');

const CustomCalendarHeader = (props) => {
    const { currentMonth, onMonthChange } = props;

    const selectNextMonth = () => onMonthChange(currentMonth.add(1, 'month'));
    const selectPreviousMonth = () => onMonthChange(currentMonth.subtract(1, 'month'));

    return (
        <Box className="custom-calendar-header">
            <button className="nav-arrow" onClick={selectPreviousMonth}>
                <ArrowBackIosNewIcon sx={{ fontSize: 14 }} />
            </button>

            <Box className="date-selection-container">
                <div className="select-date">
                    {dayjs(currentMonth).format('MMMM')}
                    <span className="orange-corner"></span>
                </div>

                <div className="select-date">
                    {dayjs(currentMonth).format('YYYY')}
                    <span className="orange-corner"></span>
                </div>
            </Box>

            <button className="nav-arrow" onClick={selectNextMonth}>
                <ArrowForwardIosIcon sx={{ fontSize: 14 }} />
            </button>
        </Box>
    );
};

const MarkedDay = ({ markedDates = [], onMarkedDayClick, day, outsideCurrentMonth, ...other }) => {
    const match = !outsideCurrentMonth
        ? markedDates.find(m => dayjs(m.date).isSame(dayjs(day), 'day'))
        : null;

    return (
        <Box
            sx={{
                position: 'relative',
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Box
                component="button"
                onClick={match ? (e) => { e.stopPropagation(); onMarkedDayClick(match.activityId); } : other.onClick}
                sx={{
                    width: { xs: 30, sm: 36 },
                    height: { xs: 30, sm: 36 },
                    border: 'none',
                    borderRadius: '8px',
                    cursor: match ? 'pointer' : 'default',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    backgroundColor: match ? 'var(--color-primary)' : 'var(--color-text-inverse)',
                    color: match ? 'white' : 'inherit',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: outsideCurrentMonth ? 0.4 : 1,
                    '&:hover': { opacity: 0.85 },
                }}
            >
                {day.date()}
            </Box>

            {match && (
                <Box sx={{
                    position: 'absolute',
                    bottom: -4,
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-primary)',
                }} />
            )}
        </Box>
    );
};

const SidebarCalendar = ({ showCreate = false, onCreatePost, markedDates = [], onMarkedDayClick, transparentBackground = false }) => {

    const handleMarkedDayClick = (activityId) => {
        onMarkedDayClick?.(activityId);
    };

    return (
        <Box
            className="sidebar-calendar-container"
            sx={{
                backgroundColor: transparentBackground
                    ? "transparent"
                    : "var(--color-primary-soft)",
                boxShadow: transparentBackground
                    ? "none"
                    : undefined
            }}
        >
            <Stack spacing={2}>
                {showCreate === "true" &&
                    <Box className="profilebar-create">
                        <InputField className="create-post-input"
                            fullWidth
                            placeholder="Skapa inlägg..."
                            onClick={onCreatePost}
                            slotProps={{
                                input: {
                                    readOnly: true,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <ControlPointIcon className="profilebar-create-icon" />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />
                    </Box>
                }

                <Box className="activity-container">
                    <Typography className="activity-title">
                        Dina aktiviteter
                    </Typography>

                    <Box className="calendar-container">
                        <LocalizationProvider
                            dateAdapter={AdapterDayjs}
                            adapterLocale="sv"
                        >
                            <DateCalendar
                                className="calendar"
                                showDaysOutsideCurrentMonth
                                sx={{
                                    width: '100%',
                                    maxWidth: '100%',
                                    minWidth: 0,
                                }}
                                slots={{
                                    calendarHeader: CustomCalendarHeader,
                                    day: MarkedDay,
                                }}
                                slotProps={{
                                    day: {
                                        markedDates,
                                        onMarkedDayClick: handleMarkedDayClick,
                                        sx: {
                                            backgroundColor: "var(--color-text-inverse)",
                                            borderRadius: "8px",
                                            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                                            fontWeight: 600,
                                            "&.Mui-selected": {
                                                backgroundColor: "var(--color-primary) !important",
                                                color: "var(--color-text-inverse) !important",
                                            },
                                        }
                                    }
                                }}
                            />
                        </LocalizationProvider>
                    </Box>
                </Box>
            </Stack >
        </Box >
    );
};

export default SidebarCalendar;