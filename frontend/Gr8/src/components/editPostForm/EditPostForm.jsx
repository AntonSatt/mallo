import { useState, useEffect } from "react";
import PostServices from "../../services/PostServices";
import {
  InputLabel,
  TextField,
  Box,
  OutlinedInput,
  MenuItem,
  ListItemText,
  Select,
  FormControl,
  Button,
  Dialog,
  DialogTitle,
  DialogActions
} from "@mui/material";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

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
      title: post.title,
      content: post.content,
      tags: post.tags?.map(t => t.id) ?? [],
      categoryId: post.category?.id ?? ""
    });
  }, [post]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tagResult = await PostServices.getTags();
        const catResult = await PostServices.getCategories();
        setTags(tagResult.map(tag => ({ id: tag.id, name: tag.name })));
        setCategories(catResult.map(cat => ({ id: cat.id, name: cat.name })));
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
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Redigera inlägg</DialogTitle>
      {error && <p style={{ color: 'red', paddingLeft: 24 }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <Box sx={{ px: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            value={postData.title}
            onChange={(e) => setPostData({ ...postData, title: e.target.value })}
            label="Titel"
          />
          <TextField
            fullWidth
            value={postData.content}
            onChange={(e) => setPostData({ ...postData, content: e.target.value })}
            label="Skriv ditt inlägg här..."
            multiline
            maxRows={6}
          />
          <FormControl>
            <InputLabel>Kategorier</InputLabel>
            <Select
              value={postData.categoryId}
              onChange={(e) => setPostData({ ...postData, categoryId: e.target.value })}
              label="Kategori"
            >
              {categories.map(category => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <InputLabel>Trigger</InputLabel>
            <Select
              multiple
              value={postData.tags}
              onChange={(e) => setPostData({ ...postData, tags: e.target.value })}
              input={<OutlinedInput label="Taggar" />}
              renderValue={(selected) =>
                selected.map(id => tags.find(t => t.id === id)?.name).join(", ")
              }
            >
              {tags.map(tag => {
                const selected = postData.tags.includes(tag.id);
                const Icon = selected ? CheckBoxIcon : CheckBoxOutlineBlankIcon;
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
        <DialogActions>
          <Button color="inherit" onClick={onClose}>Avbryt</Button>
          <Button variant="contained" type="submit">Spara ändringar</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditPostForm;