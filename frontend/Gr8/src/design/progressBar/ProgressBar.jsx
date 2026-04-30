import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

const steps = [1, 2, 3];
const inactiveColor = "var(--color-primary-soft)";
const activeColor = "var(--color-primary)";

export default function Progressbar({ activeStep, onStepClick }) {
    return (
        <Box sx={{ width: '100%', mb: 0 }}>
            <Stepper activeStep={activeStep}
                sx={{
                    //  Circle (default / not reached yet)
                    "& .MuiStepIcon-root": {
                        color: inactiveColor, // background
                    },

                    // Numbers (all steps)
                    "& .MuiStepIcon-text": {
                        fill: activeColor,
                        fontWeight: "bold",
                    },

                    // Active step
                    "& .MuiStepIcon-root.Mui-active": {
                        color: activeColor,
                    },

                    "& .MuiStepIcon-root.Mui-active .MuiStepIcon-text": {
                        fill: "#fff",
                    },

                    // Step completed (checkmark)
                    "& .MuiStepIcon-root.Mui-completed": {
                        color: activeColor,
                    },

                    // Checkmark (white)
                    "& .MuiStepIcon-root.Mui-completed .MuiStepIcon-text": {
                        fill: "#fff",
                    },

                    // Line between steps
                    "& .MuiStepConnector-line": {
                        borderColor: inactiveColor,
                        borderTopWidth: 5,

                    },

                    // Line active / done
                    "& .Mui-active .MuiStepConnector-line": {
                        borderColor: activeColor,
                    },
                    "& .Mui-completed .MuiStepConnector-line": {
                        borderColor: activeColor,
                    },
                }}
            >
                {steps.map((_, index) => (
                    <Step key={index}
                        sx={{ cursor: 'pointer' }}
                        onClick={() => onStepClick && onStepClick(index)}>
                        <StepLabel />
                    </Step>
                ))}
            </Stepper>
        </Box>
    );
}