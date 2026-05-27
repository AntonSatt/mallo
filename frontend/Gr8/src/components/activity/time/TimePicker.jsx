import { Dialog, Box, Typography, DialogContent, Switch, Stack, Divider, IconButton } from "@mui/material";
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import PrimaryButton from "../../../design/buttons/PrimaryButton.jsx";
import { useState } from "react";

const TimePicker = ({ open, onClose, formData, onOpenCalendar, setFormData }) => {

    // Switches the view back to the calendar to edit the specific date
    const handleChangeDate = (mode) => {
        onOpenCalendar(mode); // mode = "start" or "end"
    };

    // Local states for input fields to allow free typing and editing on time
    const [hStart, setHStart] = useState(formData.startAt.format('HH'));
    const [mStart, setMStart] = useState(formData.startAt.format('mm'));
    const [hEnd, setHEnd] = useState(formData.endAt.format('HH'));
    const [mEnd, setMEnd] = useState(formData.endAt.format('mm'));

    // Handles real-time updates for both local UI and the global form state
    const handleUpdate = (type, unit, val) => {
        // Sanitize input - only allow number and 2 characters
        const cleanVal = val.replace(/[^0-9]/g, '').slice(0, 2);

        if (type === 'startAt') {
            if (unit === 'hour') setHStart(cleanVal);
            else setMStart(cleanVal);
        } else {
            if (unit === 'hour') setHEnd(cleanVal);
            else setMEnd(cleanVal);
        }

        // Sync with global formData using Day.js if the input is a valid number
        if (cleanVal !== "") {
            const num = parseInt(cleanVal, 10);
            if (!isNaN(num)) {
                setFormData(prev => ({
                    ...prev,
                    [type]: prev[type][unit](num) // Updates only the specific hour or minute
                }));
            }
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth={false}
            sx={{
                "& .MuiDialog-paper": {
                    backgroundColor: "var(--color-primary-bg) !important",
                    backgroundImage: "none !important",
                    borderRadius: "30px",
                    width: "450px",
                    height: { xs: "auto", md: "410px" },
                    boxShadow: "0px 10px 30px rgba(0,0,0,0.05)",
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden"
                }
            }}
        >
            {/* Close button */}
            <IconButton
                onClick={onClose}
                sx={{
                    position: 'absolute',
                    right: { xs: 10, md: 12 },
                    top: { xs: 10, md: 20 },
                    color: 'var(--color-primary)',
                    p: 0.5,
                    zIndex: 10,
                }}
            >
                <CancelOutlinedIcon sx={{ fontSize: { xs: '30px', md: '35px' } }} />
            </IconButton>

            <DialogContent sx={{ p: 0, pt: 0, bgcolor: "transparent", display: "flex", flexDirection: "column", height: "100%" }}>

                {/* Top section*/}
                <Box
                    sx={{
                        p: 3,
                        display: 'flex',
                        justifyContent: "flex-start",
                        alignItems: 'center',
                        gap: { xs: 0, md: 3 },
                        mt: { xs: 1, md: 5 }
                    }}
                >
                    <Box sx={{
                        bgcolor: "var(--color-primary)",
                        color: "white",
                        px: 3,
                        py: 0.5,
                        borderRadius: "20px",
                        boxShadow: "2px 3px 2px rgba(0,0,0,0.12)",
                        mt: { xs: 1, md: 0 }
                    }}>
                        {formData.startAt ? formData.startAt.format('D MMMM') : "Välj datum"}
                    </Box>
                </Box>

                <Divider sx={{ borderColor: "var(--color-bg-muted)", mx: 2, borderBottomWidth: 3 }} />

                {/* Start date */}
                <Box sx={{ px: 3, py: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography sx={{ fontWeight: 800, minWidth: '75px' }}>
                        Startar
                    </Typography>

                    <Box
                        onClick={() => {
                            onOpenCalendar();
                            handleChangeDate("start")
                            onClose();
                        }}
                        sx=
                        {{
                            cursor: 'pointer',
                            bgcolor: 'white',
                            py: 0.8, px: 1,
                            borderRadius: '20px',
                            flex: 2,
                            textAlign: 'center',
                            boxShadow: "2px 3px 2px rgba(0,0,0,0.12)",
                            whiteSpace: 'nowrap'
                        }}
                    >
                        <Typography sx={{ fontSize: '0.9rem' }}>
                            {formData.startAt.format('D MMMM YYYY')}
                        </Typography>
                    </Box>

                    {/* Time input start */}
                    <Box sx={{
                        bgcolor: 'white',
                        px: 1, py: 0.5,
                        borderRadius: '15px',
                        width: '90px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: "2px 3px 2px rgba(0,0,0,0.12)"
                    }}
                    >
                        <input
                            type="text"
                            maxLength={2}
                            value={hStart}
                            style={{ width: '25px', border: 'none', outline: 'none', textAlign: 'right', fontSize: '1rem', backgroundColor: 'transparent' }}
                            onChange={(e) => handleUpdate('startAt', 'hour', e.target.value)}
                            onBlur={() => setHStart(hStart.padStart(2, '0'))}
                        />
                        <Typography sx={{ fontWeight: 'bold', px: 0.5 }}>:</Typography>
                        <input
                            type="text"
                            maxLength={2}
                            value={mStart}
                            style={{ width: '25px', border: 'none', outline: 'none', textAlign: 'left', fontSize: '1rem', backgroundColor: 'transparent' }}
                            onChange={(e) => handleUpdate('startAt', 'minute', e.target.value)}
                            onBlur={() => setMStart(mStart.padStart(2, '0'))}
                        />
                    </Box>
                </Box>

                <Divider sx={{ borderColor: "var(--color-bg-muted)", mx: 2, borderBottomWidth: 3 }} />

                {/* End date */}
                <Box sx={{ px: 3, py: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography sx={{ fontWeight: 800, color: 'var(--color-text-main)', minWidth: '75px' }}>
                        Slutar
                    </Typography>

                    <Box
                        onClick={() => {
                            onOpenCalendar();
                            handleChangeDate("end")
                            onClose();
                        }}
                        sx={{
                            cursor: 'pointer',
                            bgcolor: 'white',
                            px: 1, py: 0.8,
                            borderRadius: '20px',
                            flex: 2,
                            textAlign: 'center',
                            boxShadow: "2px 3px 2px rgba(0,0,0,0.12)",
                            whiteSpace: 'nowrap'
                        }}
                    >
                        <Typography sx={{ fontSize: '0.9rem' }}>
                            {formData.endAt.format('D MMMM YYYY')}
                        </Typography>
                    </Box>

                    <Box sx={{
                        bgcolor: 'white',
                        px: 1, py: 0.5,
                        borderRadius: '15px',
                        width: '90px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: "2px 3px 2px rgba(0,0,0,0.12)"
                    }}
                    >
                        {/* End time input */}
                        <input
                            type="text"
                            maxLength={2}
                            value={hEnd}
                            style={{ width: '25px', border: 'none', outline: 'none', textAlign: 'right', fontSize: '1rem', backgroundColor: 'transparent' }}
                            onChange={(e) => handleUpdate('endAt', 'hour', e.target.value)}
                            onBlur={() => setHEnd(hEnd.padStart(2, '0'))}
                        />
                        <Typography sx={{ fontWeight: 'bold', px: 0.5 }}>:</Typography>
                        <input
                            type="text"
                            maxLength={2}
                            value={mEnd}
                            style={{ width: '25px', border: 'none', outline: 'none', textAlign: 'left', fontSize: '1rem', backgroundColor: 'transparent' }}
                            onChange={(e) => handleUpdate('endAt', 'minute', e.target.value)}
                            onBlur={() => setMEnd(mEnd.padStart(2, '0'))}
                        />
                    </Box>
                </Box>

                <Divider sx={{ borderColor: "var(--color-bg-muted)", mx: 2, borderBottomWidth: 3 }} />

                {/* Button box */}
                <Box
                    sx={{
                        p: { xs: 4, md: 2 },
                        mt: { xs: "auto", md: 2 },
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                        boxSizing: "border-box"
                    }}
                >
                    <PrimaryButton
                        fullWidth
                        onClick={onClose}
                        style={{
                            borderRadius: "25px",
                            textTransform: 'none',
                            padding: window.innerWidth >= 1024 ? "8px 24px" : "12px",
                            fontSize: window.innerWidth >= 1024 ? "0.9rem" : "1rem",
                            maxWidth: window.innerWidth >= 1024 ? "220px" : "200px"
                        }}
                    >
                        Bekräfta
                    </PrimaryButton>
                </Box>
            </DialogContent>
        </Dialog>

        // <Dialog
        //     open={open}
        //     onClose={onClose}
        //     maxWidth={false}
        //     sx={{
        //         "& .MuiDialog-paper": {
        //             backgroundColor: "var(--color-primary-bg) !important",
        //             backgroundImage: "none !important",
        //             borderRadius: "30px",
        //             width: "450px",
        //             boxShadow: "0px 10px 30px rgba(0,0,0,0.05)",
        //             position: "relative"
        //         }
        //     }}
        // >
        //     {/* Close button */}
        //     <IconButton
        //         onClick={onClose}
        //         sx={{
        //             position: 'absolute',
        //             right: 6,
        //             top: 2,
        //             color: 'var(--color-primary)',
        //             p: 0.5,
        //             zIndex: 10,
        //         }}
        //     >
        //         <CancelOutlinedIcon sx={{ fontSize: '30px' }} />
        //     </IconButton>

        //     <DialogContent sx={{ p: 0, bgcolor: "transparent" }}>

        //         {/* Top section*/}
        //         <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
        //             <Box sx={{
        //                 bgcolor: "var(--color-primary)",
        //                 color: "white",
        //                 px: 3,
        //                 py: 0.5,
        //                 borderRadius: "20px",
        //                 boxShadow: "2px 3px 2px rgba(0,0,0,0.12)"
        //             }}>
        //                 {formData.startAt ? formData.startAt.format('D MMMM') : "Välj datum"}
        //             </Box>

        //             <Stack direction="row" spacing={1} alignItems="center"
        //                 sx={{
        //                     bgcolor: 'white',
        //                     borderRadius: '30px',
        //                     px: 2, py: 0.5,
        //                     boxShadow: "2px 3px 2px rgba(0,0,0,0.12)",
        //                     paddingLeft: 1
        //                 }}>
        //                 <Typography variant="body2">
        //                     Återkommande
        //                 </Typography>
        //                 <Switch bgcolor="var(--color-primary)" size="small" />
        //             </Stack>
        //         </Box>

        //         <Divider sx={{ borderColor: "var(--color-bg-muted)", mx: 2, borderBottomWidth: 3 }} />

        //         {/* Start date */}
        //         <Box sx={{ px: 3, py: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
        //             <Typography sx={{ fontWeight: 800, minWidth: '75px' }}>
        //                 Startar
        //             </Typography>

        //             <Box
        //                 onClick={() => {
        //                     onOpenCalendar();
        //                     handleChangeDate("start")
        //                     onClose();
        //                 }}
        //                 sx=
        //                 {{
        //                     bgcolor: 'white',
        //                     py: 0.8, px: 1,
        //                     borderRadius: '20px',
        //                     flex: 2,
        //                     textAlign: 'center',
        //                     boxShadow: "2px 3px 2px rgba(0,0,0,0.12)",
        //                     whiteSpace: 'nowrap'
        //                 }}
        //             >
        //                 <Typography sx={{ fontSize: '0.9rem' }}>
        //                     {formData.startAt.format('D MMMM YYYY')}
        //                 </Typography>
        //             </Box>

        //             {/* Time input start */}
        //             <Box sx={{
        //                 bgcolor: 'white',
        //                 px: 1, py: 0.5,
        //                 borderRadius: '15px',
        //                 width: '90px',
        //                 display: 'flex',
        //                 alignItems: 'center',
        //                 justifyContent: 'center',
        //                 boxShadow: "2px 3px 2px rgba(0,0,0,0.12)"
        //             }}
        //             >
        //                 <input
        //                     type="text"
        //                     maxLength={2}
        //                     value={hStart}
        //                     style={{ width: '25px', border: 'none', outline: 'none', textAlign: 'right', fontSize: '1rem', backgroundColor: 'transparent' }}
        //                     onChange={(e) => handleUpdate('startAt', 'hour', e.target.value)}
        //                     onBlur={() => setHStart(hStart.padStart(2, '0'))}
        //                 />
        //                 <Typography sx={{ fontWeight: 'bold', px: 0.5 }}>:</Typography>
        //                 <input
        //                     type="text"
        //                     maxLength={2}
        //                     value={mStart}
        //                     style={{ width: '25px', border: 'none', outline: 'none', textAlign: 'left', fontSize: '1rem', backgroundColor: 'transparent' }}
        //                     onChange={(e) => handleUpdate('startAt', 'minute', e.target.value)}
        //                     onBlur={() => setMStart(mStart.padStart(2, '0'))}
        //                 />
        //             </Box>
        //         </Box>

        //         <Divider sx={{ borderColor: "var(--color-bg-muted)", mx: 2, borderBottomWidth: 3 }} />

        //         {/* End date */}
        //         <Box sx={{ px: 3, py: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
        //             <Typography sx={{ fontWeight: 800, color: 'var(--color-text-main)', minWidth: '75px' }}>
        //                 Slutar
        //             </Typography>

        //             <Box
        //                 onClick={() => {
        //                     onOpenCalendar();
        //                     handleChangeDate("end")
        //                     onClose();
        //                 }}
        //                 sx={{
        //                     bgcolor: 'white',
        //                     px: 1, py: 0.8,
        //                     borderRadius: '20px',
        //                     flex: 2,
        //                     textAlign: 'center',
        //                     boxShadow: "2px 3px 2px rgba(0,0,0,0.12)",
        //                     whiteSpace: 'nowrap'
        //                 }}
        //             >
        //                 <Typography sx={{ fontSize: '0.9rem' }}>
        //                     {formData.endAt.format('D MMMM YYYY')}
        //                 </Typography>
        //             </Box>

        //             <Box sx={{
        //                 bgcolor: 'white',
        //                 px: 1, py: 0.5,
        //                 borderRadius: '15px',
        //                 width: '90px',
        //                 display: 'flex',
        //                 alignItems: 'center',
        //                 justifyContent: 'center',
        //                 boxShadow: "2px 3px 2px rgba(0,0,0,0.12)"
        //             }}
        //             >
        //                 {/* End time input */}
        //                 <input
        //                     type="text"
        //                     maxLength={2}
        //                     value={hEnd}
        //                     style={{ width: '25px', border: 'none', outline: 'none', textAlign: 'right', fontSize: '1rem', backgroundColor: 'transparent' }}
        //                     onChange={(e) => handleUpdate('endAt', 'hour', e.target.value)}
        //                     onBlur={() => setHEnd(hEnd.padStart(2, '0'))}
        //                 />
        //                 <Typography sx={{ fontWeight: 'bold', px: 0.5 }}>:</Typography>
        //                 <input
        //                     type="text"
        //                     maxLength={2}
        //                     value={mEnd}
        //                     style={{ width: '25px', border: 'none', outline: 'none', textAlign: 'left', fontSize: '1rem', backgroundColor: 'transparent' }}
        //                     onChange={(e) => handleUpdate('endAt', 'minute', e.target.value)}
        //                     onBlur={() => setMEnd(mEnd.padStart(2, '0'))}
        //                 />
        //             </Box>
        //         </Box>

        //         <Divider sx={{ borderColor: "var(--color-bg-muted)", mx: 2, borderBottomWidth: 3 }} />

        //         <Box sx={{ p: 4, width: { md: "350px" } }}>
        //             <PrimaryButton
        //                 fullWidth
        //                 onClick={onClose}
        //                 style={{ borderRadius: "25px", padding: "12px", textTransform: 'none' }}
        //             >
        //                 Bekräfta
        //             </PrimaryButton>
        //         </Box>
        //     </DialogContent>
        // </Dialog>
    );
};

export default TimePicker;