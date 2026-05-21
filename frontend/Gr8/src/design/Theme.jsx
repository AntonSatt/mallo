import { createTheme } from "@mui/material/styles";

const Theme = createTheme({
    palette: {
        primary: {
            main: "#FFB57C",
        },
        secondary: {
            main: "#FFF0D4",
        },
        text: {
            primary: "#374957",
        },
    },

    typography: {
        fontFamily: "Source Sans Pro, sans-serif",
    },

    breakpoints: {
        values: {
            xs: 0,
            sm: 768,
            md: 1024,
            lg: 1200,
            xl: 1536,
        },
    },

    components: {
        MuiButton: {
            defaultProps: {
                variant: "contained",
            },

            styleOverrides: {
                root: {
                    textTransform: "none",
                },
            },
        },
    },
});

export default Theme;