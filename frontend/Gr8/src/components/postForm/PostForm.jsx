import { useState, useEffect } from "react";
import PostServices from "../../services/PostServices";
// Page is not implemeted to backend yet, so this is just a mockup of the form.

//import { useNavigate } from "react-router-dom";
import {
  InputLabel,
  TextField,
  Box,
  OutlinedInput,
  MenuItem,
  ListItemText,
  Select,
  FormControl,
  Button
} from "@mui/material"
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  slotProps: {
    paper: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  },
};

const PostForm = () => {
  const [postData, setPostData] = useState({
    title: "",
    content: "",
    tags: [],
    categoryId: ""
  });
  const [error, setError] = useState("");

  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!postData.title.trim() ||
      !postData.content.trim() ||
      postData.tags.length < 1 ||
      !postData.categoryId) {
      setError("Alla fält måste vara ifyllda.");
      return;
    }

    if (postData.title.length < 1 || postData.title.length > 50) {
      setError("Titeln måste innehålla minst 1 och max 50 tecken.");
      return;
    }

    try {
      const result = await PostServices.create(postData);
      console.log("Post created successfully:", result);
    } catch (err) {
      setError(err.message || 'Inlägg skapades inte. Försök igen.');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tagResult = await PostServices.getTags();
        const catResult = await PostServices.getCategories();

        const allTags = tagResult.map((tag) => ({
          id: tag.id,
          name: tag.name
        }));

        const allCategories = catResult.map((category) => ({
          id: category.id,
          name: category.name
        }));

        setTags(allTags);
        setCategories(allCategories);
      } catch (error) {
        console.error("Error fetching tags or categories:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
            <TextField
              fullWidth
              value={postData.title}
              onChange={(e) => setPostData({ ...postData, title: e.target.value })}
              label="Titel"
            /></Box>
        </div>
        <div>
          <TextField
            fullWidth
            value={postData.content}
            onChange={(e) => setPostData({ ...postData, content: e.target.value })}
            label="Skriv ditt inlägg här..."
            multiline
            maxRows={6}
          />
        </div>
        <div>
          <FormControl sx={{ m: 3, width: 300 }}>
            <InputLabel id="demo-multiple-checkbox-label">Kategorier</InputLabel>
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
        </div>
        <div>
          <FormControl sx={{ m: 3, width: 300 }}>
            <InputLabel id="demo-multiple-checkbox-label">Trigger</InputLabel>
            <Select
              multiple
              value={postData.tags}
              onChange={(e) => setPostData({ ...postData, tags: e.target.value })}
              input={<OutlinedInput label="Taggar" />}
              renderValue={(selected) =>
                selected
                  .map(id => tags.find(t => t.id === id)?.name)
                  .join(", ")
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
        </div>
        <Button variant="contained"
          type="submit"
          id="submitPost"
          style={{ marginRight: 8 }}>
          Lägg upp inlägg</Button>
      </form >
    </>
  );
};

export default PostForm;