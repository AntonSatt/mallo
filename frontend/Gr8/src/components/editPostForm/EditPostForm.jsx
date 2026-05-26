import { useState, useEffect } from "react";
import PostServices from "../../services/PostServices";
import {
  InputLabel,
  Box,
  OutlinedInput,
  MenuItem,
  ListItemText,
  Select,
  FormControl,
  Dialog,
  Paper,
  Typography,
  Stack
} from "@mui/material";

import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import PrimaryButton from "../../design/buttons/PrimaryButton.jsx";

const EditPostForm = ({ post, open, onClose, onPostUpdated }) => {
  const [postData, setPostData] = useState({
    title: "",
    content: "",
    tags: [],
    categoryId: ""
  });

  const [error, setError] = useState("");
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (!post) return;

    setPostData({
      title: post.title || "",
      content: post.content || "",
      tags: post.tags?.map((t) => t.id) ?? [],
      categoryId: post.category?.id ?? ""
    });
  }, [post]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tagResult = await PostServices.getTags();
        const catResult = await PostServices.getCategories();

        setTags(tagResult.map((tag) => ({ id: tag.id, name: tag.name })));
        setCategories(catResult.map((cat) => ({ id: cat.id, name: cat.name })));
      } catch (error) {
        console.error("Error fetching tags or categories:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!postData.title.trim() || !postData.content.trim() || !postData.categoryId) {
      setError("Alla fält måste vara ifyllda.");
      return;
    }

    if (postData.title.length < 1 || postData.title.length > 50) {
      setError("Titeln måste innehålla minst 1 och max 50 tecken.");
      return;
    }

    try {
      const result = await PostServices.update(post.id, {
        id: post.id,
        title: postData.title,
        content: postData.content,
        tagIds: postData.tags,
        categoryId: postData.categoryId
      });

      onPostUpdated(result);
      onClose();
    } catch (err) {
      setError(err.message || "Inlägg uppdaterades inte. Försök igen.");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      sx={{
        "& .MuiDialog-paper": {
          backgroundColor: "var(--color-primary-bg) !important"
        },
        borderRadius: { xs: 0, md: "15px" },
        width: { md: "490px" },
        maxWidth: { md: "490px" },
        height: { md: "auto" },
        maxHeight: { md: "calc(100% - 80px)" },
        margin: { md: "auto" }
      }}
    >
      <Box sx={{ p: 2, mt: 6 }}>
        {error && (
          <Typography color="error" sx={{ mb: 2, textAlign: "center" }}>
            {error}
          </Typography>
        )}

        <Paper
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 5,
            textAlign: "center",
            border: "1px solid var(--color-border-light)"
          }}
        >
          <Typography variant="h6">
            Redigera{" "}
            <span style={{ color: "var(--color-primary)", fontWeight: 700 }}>
              Inlägg
            </span>
          </Typography>
        </Paper>

        <form onSubmit={handleSubmit}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 8,
              mb: 4,
              border: "1px solid var(--color-border-light)"
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1 }}>
              Titel
            </Typography>

            <input
              className="custom-input-simple"
              placeholder="Skriv titel..."
              value={postData.title}
              onChange={(e) =>
                setPostData({ ...postData, title: e.target.value })
              }
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                marginBottom: "20px",
                fontSize: "1rem"
              }}
            />

            <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1 }}>
              Inlägg
            </Typography>

            <textarea
              placeholder="Skriv ditt inlägg här..."
              rows={5}
              value={postData.content}
              onChange={(e) =>
                setPostData({ ...postData, content: e.target.value })
              }
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                resize: "none",
                fontSize: "1rem",
                marginBottom: "20px"
              }}
            />

            <Box
              sx={{
                mt: 2,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 2
              }}
            >
              <FormControl fullWidth>
                <InputLabel>Kategori</InputLabel>
                <Select
                  value={postData.categoryId}
                  onChange={(e) =>
                    setPostData({ ...postData, categoryId: e.target.value })
                  }
                  label="Kategori"
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Trigger</InputLabel>
                <Select
                  multiple
                  value={postData.tags}
                  onChange={(e) =>
                    setPostData({ ...postData, tags: e.target.value })
                  }
                  input={<OutlinedInput label="Trigger" />}
                  renderValue={(selected) =>
                    selected
                      .map((id) => tags.find((t) => t.id === id)?.name)
                      .join(", ")
                  }
                >
                  {tags.map((tag) => {
                    const selected = postData.tags.includes(tag.id);
                    const Icon = selected
                      ? CheckBoxIcon
                      : CheckBoxOutlineBlankIcon;

                    return (
                      <MenuItem key={tag.id} value={tag.id}>
                        <Icon fontSize="small" style={{ marginRight: 8 }} />
                        <ListItemText primary={tag.name} />
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>
          </Paper>

          <Stack direction="row" spacing={2}>
            <PrimaryButton
              fullWidth
              type="button"
              onClick={onClose}
              style={{
                backgroundColor: "white",
                color: "var(--color-text-main)"
              }}
            >
              Avsluta
            </PrimaryButton>

            <PrimaryButton fullWidth type="submit">
              Spara ändringar
            </PrimaryButton>
          </Stack>
        </form>
      </Box>
    </Dialog>
  );
};

export default EditPostForm;