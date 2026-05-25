import { Box, Stack, Typography, InputAdornment } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers';
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

const SidebarCalendar = ({ showCreate = false, onCreatePost }) => {
    return (
        <Box className="sidebar-calendar-container">
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

                                slots={{
                                    calendarHeader: CustomCalendarHeader,
                                }}

                                slotProps={{
                                    day: {
                                        sx: {
                                            className: "calendar-day",
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
                    <Stack className="button-wrapper"
                        direction="row"
                        justifyContent="center"
                    >
                        <PrimaryButton className="button-choice">
                            <LocationOnOutlinedIcon
                                sx={{
                                    color: "var(--color-primary) !important"
                                }}
                            />
                            <Typography className="button-title">
                                Hitta
                            </Typography>
                        </PrimaryButton>

                        <PrimaryButton className="button-choice">
                            <BookmarkBorderIcon
                                sx={{
                                    color: "var(--color-primary) !important",
                                }}
                            />
                            <Typography className="button-title">
                                Favoriter
                            </Typography>
                        </PrimaryButton>
                    </Stack>
                </Box>
            </Stack>
        </Box>
    )
};

export default SidebarCalendar; 