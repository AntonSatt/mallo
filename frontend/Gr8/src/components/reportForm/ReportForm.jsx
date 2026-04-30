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
import CommentServices from "../../services/CommentServices";

const ReportForm = ({ open, postId, commentId, onClose }) => {
  const [reportReason, setReportReason] = useState("");

  const isCommentReport = Boolean(commentId);

  const handleClose = () => {
    setReportReason("");
    onClose();
  };

  const handleSubmit = async () => {
    try {
      const reason = reportReason.trim();
      if (!reason) return;

      if (isCommentReport) {
        await CommentServices.report(commentId, { reason });
      } else if (postId) {
        await PostServices.report(postId, { reason });
      } else {
        console.error("No post or comment selected for report.");
        return;
      }

      handleClose();
    } catch (error) {
      console.error("Failed to report post:", error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {isCommentReport ? "Anmäl kommentar" : "Anmäl inlägg"}
      </DialogTitle>

      <CardContent>
        <Typography variant="body2" sx={{ mb: 2 }}>
          {isCommentReport
            ? "Beskriv varför du vill anmäla kommentaren:"
            : "Beskriv varför du vill anmäla inlägget:"}
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
