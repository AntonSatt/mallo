import { Dialog, Box, Typography, IconButton, DialogContent } from "@mui/material";
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { LocalizationProvider, DateCalendar } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import dayjs from 'dayjs';
import "../calender/CalenderPicker.css";

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

const CalendarPicker = ({ open, onClose, value, onChange }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth={false}
            sx={{
                "& .MuiPaper-root": {
                    borderRadius: "40px",
                    padding: "40px",
                    width: "550px",
                    backgroundColor: "white !important",
                    backgroundImage: "none",
                }
            }}
        >
            <IconButton
                onClick={onClose}
                sx={{
                    position: 'absolute',
                    right: 20,
                    top: 20,
                    color: '#FFB37C',
                    zIndex: 1,
                }}
            >
                <CancelOutlinedIcon sx={{ fontSize: '30px' }} />
            </IconButton>

            <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h5" sx={{ mb: 4, fontWeight: 500 }}>
                    Välj <span style={{ color: "var(--color-primary)", fontWeight: 700 }}>startdatum</span>
                </Typography>

                <Box className="calendar-container">
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="sv">
                        <DateCalendar
                            value={value}
                            onChange={onChange}
                            showDaysOutsideCurrentMonth
                            slots={{
                                calendarHeader: CustomCalendarHeader,
                            }}
                            slotProps={{
                                calendarHeader: {
                                    sx: {
                                        '& .MuiPickersCalendarHeader-labelContainer': { display: 'none' },
                                        '& .MuiPickersArrowSwitcher-root': { display: 'none' },
                                    }
                                }
                            }}
                            sx={{
                                width: '100%',
                                backgroundColor: 'transparent',
                                '& .MuiDayCalendar-header': { justifyContent: 'space-between' },
                                '& .MuiDayCalendar-weekContainer': { justifyContent: 'space-between' },
                                '& .MuiPickersDay-root': {
                                    backgroundColor: "var(--color-text-inverse)",
                                    borderRadius: "8px",
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
                                    fontWeight: 600,
                                    margin: '3px',
                                    '&.Mui-selected': {
                                        backgroundColor: "var(--color-primary) !important",
                                        color: "var(--color-text-inverse) !important",
                                    },
                                }
                            }}
                        />
                    </LocalizationProvider>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default CalendarPicker;