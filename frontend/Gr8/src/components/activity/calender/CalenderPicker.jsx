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

// import { Dialog, Box, Typography, IconButton, DialogContent } from "@mui/material";
// import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
// import { LocalizationProvider, DateCalendar } from '@mui/x-date-pickers';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
// import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
// import dayjs from 'dayjs';

// // Denna header kopieras från din SidebarCalendar
// const CustomCalendarHeader = (props) => {
//     const { currentMonth, onMonthChange } = props;

//     const selectNextMonth = () => onMonthChange(currentMonth.add(1, 'month'));
//     const selectPreviousMonth = () => onMonthChange(currentMonth.subtract(1, 'month'));

//     return (
//         <Box sx={{
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'space-between',
//             // width: '100%',
//             // mb: 2,
//             // px: 1
//         }}>
//             {/* Vänsterpil i vit cirkel */}
//             <IconButton
//                 onClick={selectPreviousMonth}
//                 sx={{
//                     bgcolor: 'white !important',
//                     boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//                     width: 30,
//                     height: 30,
//                     mr: 1
//                 }}
//             >
//                 <ArrowBackIosNewIcon sx={{ fontSize: 14, color: 'black' }} />
//             </IconButton>

//             {/* Månad och År som vita pills */}
//             <Box sx={{ display: 'flex', gap: 1 }}>
//                 <Box className="select-pill" sx={{
//                     bgcolor: 'white',
//                     px: 2, py: 0.5,
//                     borderRadius: '10px',
//                     fontWeight: 800,
//                     fontSize: '0.9rem',
//                     position: 'relative',
//                     boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//                     display: 'flex',
//                     alignItems: 'center'
//                 }}>
//                     {dayjs(currentMonth).format('MMMM')}
//                     <Box component="span" sx={{
//                         width: 0, height: 0,
//                         borderStyle: 'solid',
//                         borderWidth: '0 0 6px 6px',
//                         borderColor: 'transparent transparent var(--color-primary) transparent',
//                         position: 'absolute', bottom: 4, right: 4
//                     }} />
//                 </Box>

//                 <Box className="select-pill" sx={{
//                     bgcolor: 'white',
//                     px: 2, py: 0.5,
//                     borderRadius: '10px',
//                     fontWeight: 800,
//                     fontSize: '0.9rem',
//                     position: 'relative',
//                     boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//                     display: 'flex',
//                     alignItems: 'center'
//                 }}>
//                     {dayjs(currentMonth).format('YYYY')}
//                     <Box component="span" sx={{
//                         width: 0, height: 0,
//                         borderStyle: 'solid',
//                         borderWidth: '0 0 6px 6px',
//                         borderColor: 'transparent transparent var(--color-primary) transparent',
//                         position: 'absolute', bottom: 4, right: 4
//                     }} />
//                 </Box>
//             </Box>

//             {/* Högerpil i vit cirkel */}
//             <IconButton
//                 onClick={selectNextMonth}
//                 sx={{
//                     bgcolor: 'white !important',
//                     boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//                     width: 30,
//                     height: 30
//                 }}
//             >
//                 <ArrowForwardIosIcon sx={{ fontSize: 14, color: 'black' }} />
//             </IconButton>
//         </Box>
//     );
// };

// const CalendarPicker = ({ open, onClose, value, onChange }) => {
//     return (
//         <Dialog
//             open={open}
//             onClose={onClose}
//             maxWidth={false}
//             sx={{
//                 "& .MuiPaper-root": {
//                     borderRadius: "40px",
//                     overflow: "hidden",
//                     padding: "40px",
//                     width: "550px",
//                     backgroundColor: "white !important",
//                     backgroundImage: "none",
//                 }
//             }}
//         >
//             <IconButton
//                 onClick={onClose}
//                 sx={{
//                     position: 'absolute',
//                     right: 20,
//                     top: 20,
//                     color: '#FFB37C',
//                     zIndex: 1,
//                 }}
//             >
//                 <CancelOutlinedIcon sx={{ fontSize: '30px' }} />
//             </IconButton>

//             <DialogContent sx={{
//                 display: 'flex',
//                 flexDirection: 'column',
//                 alignItems: 'flex-start',
//                 p: 0,
//             }}>
//                 <Typography variant="h5" sx={{ mb: 4 }}>
//                     Välj <span style={{ color: "var(--color-primary)", fontWeight: 700 }}>startdatum</span>
//                 </Typography>

//                 {/* Grey calender box */}
//                 <Box sx={{
//                     bgcolor: "#F5F5F7",
//                     borderRadius: "30px",
//                     p: 3,
//                     width: "100%",
//                     maxWidth: "450px",
//                     margin: "0 auto",
//                 }}>
//                     <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="sv">
//                         <DateCalendar
//                             value={value}
//                             onChange={onChange}
//                             showDaysOutsideCurrentMonth
//                             // Här lägger vi in din custom header
//                             slots={{
//                                 calendarHeader: CustomCalendarHeader,
//                             }}
//                             sx={{
//                                 backgroundColor: 'transparent',
//                                 width: '100%',
//                                 // Styling för veckodagarna (Må, Ti, On...)
//                                 '& .MuiDayCalendar-header': {
//                                     justifyContent: 'space-between',
//                                 },
//                                 '& .MuiDayCalendar-weekContainer': {
//                                     justifyContent: 'space-between',
//                                 },
//                                 // Styling för varje dag-ruta
//                                 '& .MuiPickersDay-root': {
//                                     backgroundColor: '#FFFFFF',
//                                     borderRadius: '10px',
//                                     margin: '3px',
//                                     fontWeight: 600,
//                                     boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
//                                     width: '40px',
//                                     height: '40px',
//                                     '&:hover': {
//                                         backgroundColor: '#f0f0f0',
//                                     }
//                                 },
//                                 // Styling för vald dag
//                                 '& .MuiPickersDay-root.Mui-selected': {
//                                     backgroundColor: "var(--color-primary) !important",
//                                     color: "white !important",
//                                 },
//                                 // Ta bort standard-headern som MUI annars visar bakom din custom header
//                                 '& .MuiPickersCalendarHeader-root': {
//                                     paddingLeft: 0,
//                                     paddingRight: 0,
//                                     maxWidth: 'none',
//                                 }
//                             }}
//                         />
//                     </LocalizationProvider>
//                 </Box>
//             </DialogContent>
//         </Dialog>
//     );
// };

// export default CalendarPicker;


// import { Dialog, Box, Typography, IconButton, DialogContent } from "@mui/material";
// import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
// import { LocalizationProvider, DateCalendar } from '@mui/x-date-pickers';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// const CalendarPicker = ({ open, onClose, value, onChange }) => {
//     return (
//         <Dialog
//             open={open}
//             onClose={onClose}
//             maxWidth={false}
//             sx={{
//                 "& .MuiPaper-root": {
//                     borderRadius: "40px",
//                     overflow: "hidden",
//                     padding: "40px",
//                     width: "550px",
//                     height: "auto",
//                     backgroundColor: "white !important",
//                     backgroundImage: "none",
//                 }
//             }}
//         >
//             <IconButton
//                 onClick={onClose}
//                 sx={{
//                     position: 'absolute',
//                     right: 20,
//                     top: 20,
//                     color: '#FFB37C',
//                     zIndex: 1,
//                 }}
//             >
//                 <CancelOutlinedIcon sx={{ fontSize: '30px' }} />
//             </IconButton>

//             <DialogContent sx={{
//                 display: 'flex',
//                 flexDirection: 'column',
//                 alignItems: 'flex-start',
//                 p: 0,
//             }}>
//                 <Typography variant="h5" sx={{ mb: 4 }}>
//                     Välj <span style={{ color: "var(--color-primary)", fontWeight: 700 }}>startdatum</span>
//                 </Typography>

//                 {/* Grey calender box */}
//                 <Box sx={{
//                     bgcolor: "#F5F5F7",
//                     borderRadius: "30px",
//                     p: 2,
//                     width: "100%",
//                     maxWidth: "400px",
//                     margin: "0 auto",
//                     display: 'flex',
//                     justifyContent: 'center'
//                 }}>
//                     <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="sv">
//                         <DateCalendar
//                             value={value}
//                             onChange={onChange}
//                             sx={{
//                                 backgroundColor: 'transparent',
//                                 '& .MuiPickersDay-root': {
//                                     backgroundColor: '#FFFFFF',
//                                     borderRadius: '10px',
//                                     margin: '3px',
//                                     fontWeight: 'bold'
//                                 },
//                                 '& .MuiPickersDay-root.Mui-selected': {
//                                     //backgroundColor: "#FFB37C !important",
//                                     color: "white"
//                                 }
//                             }}
//                         />
//                     </LocalizationProvider>
//                 </Box>

//                 {/* Spacing towards the bottom */}
//                 <Box sx={{ height: 20 }} />
//             </DialogContent>
//         </Dialog>
//     );
// };

// export default CalendarPicker;