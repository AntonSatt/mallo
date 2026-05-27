import { Dialog, Box, Typography, IconButton, DialogContent } from "@mui/material";
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { LocalizationProvider, DateCalendar } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import dayjs from 'dayjs';
import "./CalenderPicker.css";

const CustomDay = (props) => {
    const { day, outsideCurrentMonth, onDaySelect, selected, disabled } = props;

    const handleSelect = (event) => {
        if (!disabled && onDaySelect) {
            onDaySelect(day, 'finish', event);
        }
    };

    return (
        <Box sx={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            <Box
                component="button"
                type="button"
                onClick={handleSelect}
                disabled={disabled}
                sx={{
                    width: { xs: '32px', sm: '36px' },
                    height: { xs: '32px', sm: '36px' },
                    border: 'none',
                    borderRadius: '8px',
                    cursor: disabled ? 'default' : 'pointer',
                    fontWeight: 600,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    backgroundColor: selected
                        ? 'var(--color-primary)'
                        : 'var(--color-text-inverse)',
                    color: selected ? 'white' : 'inherit',
                    // boxShadow: outsideCurrentMonth ? 'none' : '0 2px 4px rgba(0,0,0,0.15)',
                    boxShadow: disabled || outsideCurrentMonth ? 'none' : '0 2px 4px rgba(0,0,0,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    // opacity: outsideCurrentMonth ? 0.4 : 1,
                    // '&:hover': { opacity: disabled ? 1 : 0.85 },
                    opacity: disabled || outsideCurrentMonth ? 0.3 : 1,
                    '&:hover': { opacity: disabled ? 0.3 : 0.85 },
                }}
            >
                {day.date()}
            </Box>
        </Box>
    );
};

const CustomCalendarHeader = (props) => {
    const { currentMonth, onMonthChange } = props;

    const selectNextMonth = () => onMonthChange(currentMonth.add(1, 'month'));
    const selectPreviousMonth = () => onMonthChange(currentMonth.subtract(1, 'month'));

    return (
        <Box className="custom-calendar-header">
            <button className="nav-arrow" onClick={selectPreviousMonth}>
                <ArrowBackIosNewIcon sx={{ fontSize: { xs: 12, sm: 14 } }} />
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
                <ArrowForwardIosIcon sx={{ fontSize: { xs: 12, sm: 14 } }} />
            </button>
        </Box>
    );
};

const CalendarPicker = ({ open, onClose, value, onChange, mode }) => {
    const minAllowedDate = mode === 'end' ? dayjs(value) : dayjs();
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth={false}
            sx={{
                "& .MuiPaper-root": {
                    borderRadius: { xs: "24px", sm: "40px" },
                    padding: { xs: "24px 16px", sm: "40px" },
                    width: "100%",
                    maxWidth: "500px",
                    margin: "16px",
                    backgroundColor: "white !important",
                    backgroundImage: "none",
                }
            }}
        >
            <IconButton
                onClick={onClose}
                sx={{
                    position: 'absolute',
                    right: { xs: 12, sm: 20 },
                    top: { xs: 12, sm: 20 },
                    color: '#FFB37C',
                    zIndex: 1,
                }}
            >
                <CancelOutlinedIcon sx={{ fontSize: { xs: '24px', sm: '30px' } }} />
            </IconButton>

            <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', overflow: 'visible' }}>
                <Typography variant="h5" sx={{ mb: { xs: 2, sm: 4 }, fontWeight: 500, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                    Välj {mode === 'end' ? (
                        <span style={{ color: "var(--color-primary)", fontWeight: 700 }}>slutdatum</span>
                    ) : (
                        <span style={{ color: "var(--color-primary)", fontWeight: 700 }}>startdatum</span>
                    )}
                </Typography>

                <Box className="calendar-container">
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="sv">
                        <DateCalendar
                            value={value}
                            onChange={onChange}
                            showDaysOutsideCurrentMonth
                            // disablePast
                            minDate={minAllowedDate}
                            slots={{
                                calendarHeader: CustomCalendarHeader,
                                day: CustomDay,
                            }}
                            slotProps={{
                                day: (ownerState) => ({
                                    disabled: ownerState.disabled,
                                }),
                                calendarHeader: {
                                    sx: {
                                        '& .MuiPickersCalendarHeader-labelContainer': { display: 'none' },
                                        '& .MuiPickersArrowSwitcher-root': { display: 'none' },
                                    }
                                }
                            }}
                            sx={{
                                width: '100%',
                                height: 'auto',
                                backgroundColor: 'transparent',
                                '& .MuiDayCalendar-header': {
                                    justifyContent: 'space-between',
                                    '& .MuiTypography-root': {
                                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                        width: { xs: '32px', sm: '36px' }
                                    }
                                },
                                '& .MuiDayCalendar-weekContainer': {
                                    justifyContent: 'space-between',
                                    margin: { xs: '4px 0', sm: '8px 0' }
                                },
                                '& .MuiPickersDay-root': { display: 'none !important' }
                            }}
                        />
                    </LocalizationProvider>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default CalendarPicker;