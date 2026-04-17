import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  CardContent,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import PostServices from "../../services/PostServices";

const ReportForm = ({ open, postId, onClose }) => {
  const [reportReason, setReportReason] = useState("");

  const handleClose = () => {
    setReportReason("");
    onClose();
  };

  const handleSubmit = async () => {
    try {
      if (!postId) {
        console.error("No post selected for report.");
        return;
      }

      await PostServices.report(postId, {
        reason: reportReason.trim(),
      });

      handleClose();
    } catch (error) {
      console.error("Failed to report post:", error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Anmäl inlägg</DialogTitle>

      <CardContent>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Beskriv varför du vill anmäla inlägget:
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Anmälan"
          placeholder="Ange anmälan..."
          value={reportReason}
          onChange={(e) => setReportReason(e.target.value)}
        />
      </CardContent>

      <DialogActions>
        <Button color="inherit" onClick={handleClose}>
          Avbryt
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleSubmit}
          disabled={!reportReason.trim()}
        >
          Skicka anmälan
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReportForm;