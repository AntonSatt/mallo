import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";

const MutedButton = styled(Button)({
    borderRadius: "20px",
    backgroundColor: "var(--color-ui-muted)",
    color: "var(--color-text-main)",
    width: "100%",
});

export default MutedButton;