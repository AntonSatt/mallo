import { Box, Stack, Typography, InputAdornment } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import 'dayjs/locale/sv';
import dayjs from 'dayjs';
import PrimaryButton from '../../design/buttons/PrimaryButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
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
                <div className="select-pill">
                    {dayjs(currentMonth).format('MMMM')}
                    <span className="orange-corner"></span>
                </div>

                <div className="select-pill">
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
                        <InputField className="sidebar-search-input"
                            fullWidth
                            placeholder="Skapa..."
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

                                sx={{
                                    width: '100% !important',
                                    minWidth: '0px !important',
                                    maxWidth: '100% !important',
                                    height: 'auto !important',
                                    overflow: 'hidden',

                                    '& .MuiDateCalendar-viewTransitionContainer': {
                                        width: '100% !important',
                                        minWidth: '0px !important',
                                    },

                                    '& .MuiPickersDay-root': {
                                        width: '30px !important',
                                        height: '30px !important',
                                        fontSize: '0.8rem !important',
                                        margin: '0px !important',
                                    },

                                    '& .MuiDayCalendar-weekDayLabel': {
                                        width: '30px !important',
                                        margin: '0px !important',
                                    },

                                    '& .MuiDayCalendar-weekContainer': {
                                        width: '100% !important',
                                        justifyContent: 'center !important',
                                        margin: '2px 0 !important',
                                    },

                                    '& .MuiPickersCalendarHeader-root': {
                                        paddingLeft: '4px !important',
                                        paddingRight: '4px !important',
                                        width: '100% !important',
                                        boxSizing: 'border-box',
                                    }
                                }}

                                slotProps={{
                                    day: {
                                        sx: {
                                            className: "calendar-day",
                                            borderRadius: "8px",
                                            backgroundColor: "var(--color-text-inverse)",
                                            boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
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
                <Stack
                    direction="row"
                    spacing={2}
                    justifyContent="center"
                >
                    <PrimaryButton
                        sx={{
                            gap: '8px', 
                        }}
                    >
                        <LocationOnOutlinedIcon /> Hitta
                    </PrimaryButton>

                    <PrimaryButton
                          sx={{
                            gap: '8px', 
                        }}
                    >
                        <FavoriteIcon /> Favoriter
                    </PrimaryButton>
                </Stack>
            </Stack>
        </Box>
    )
};

export default SidebarCalendar; 