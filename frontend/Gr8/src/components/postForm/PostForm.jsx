import { useState } from "react";
import PostServices from "../../services/PostServices";
// Page is not implemeted to backend yet, so this is just a mockup of the form.

//import { useNavigate } from "react-router-dom";
import {
  Input,
  InputLabel,
  InputAdornment,
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
const tagOptions = ["Fråga", "Svar", "Diskussion", "Nyheter", "Tips"];
const categoryOptions = ["Allmänt", "Teknik", "Hälsa", "Resor", "Mat"];

const PostForm = () => {
  const [postData, setPostData] = useState({
    postTitle: "",
    postContent: "",
    postTag: ""
  });
  const [error, setError] = useState("");

  const [tagIds, setTagIds] = useState([]);
  const [categoryId, setCategoryId] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (
      !postData.postTitle.trim() ||
      !postData.postContent.trim() ||
      !postData.postTag.trim()
    ) {
      setError("Alla fält måste vara ifyllda.");
      return;
    }

    if (postData.postTitle.length < 1 || postData.postTitle.length > 50) {
      setError("Titeln måste innehålla minst 1 och max 50 tecken.");
      return;
    }

    if (postData.postContent.length < 1) {
      setError("Posten måste innehålla minst 1 tecken.");
      return;
    }

    if (postData.postTag.length < 1) {
      setError("Inlägget måste innehålla minst 1 tagg.");
      return;
    }

    if (categoryId.length < 1) {
      setError("Inlägget måste innehålla minst 1 kategori.");
      return;
    }

    try {
      const result = await PostServices.create(postData);
      console.log("Post created successfully:", result);
    } catch (err) {
      setError(err.message || 'Inlägg skapades inte. Försök igen.');
    }

    const payload = {
      postTitle: postData.postTitle,
      postContent: postData.postContent,
      tagsIds: tagIds,
      categoryId: categoryId
    };
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setTagIds(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };



  return (
    <>
      {error && <p>{error}</p>}
      <form>
        <div>
          <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
            <TextField
              fullWidth
              value={postData.postTitle}
              onChange={(e) => setPostData({ ...postData, postTitle: e.target.value })}
              label="Titel"
            /></Box>
        </div>
        <div>
          <TextField
            fullWidth
            value={postData.postContent}
            onChange={(e) => setPostData({ ...postData, postContent: e.target.value })}
            label="Skriv ditt inlägg här..."
            multiline
            maxRows={6}
          />
        </div>
        <div>
          <FormControl sx={{ m: 3, width: 300 }}>
            <InputLabel id="demo-multiple-checkbox-label">Kategorier</InputLabel>
            <Select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              label="Kategori"
            >
              {categoryOptions.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div>
          <FormControl sx={{ m: 3, width: 300 }}>
            <InputLabel id="demo-multiple-checkbox-label">Taggar</InputLabel>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              value={tagIds}
              onChange={handleChange}
              input={<OutlinedInput label="Taggar" />}
              renderValue={(selected) => selected.join(', ')}
              MenuProps={MenuProps}
            >
              {tagOptions.map((tag) => {
                const selected = tagIds.includes(tag);
                const SelectionIcon = selected ? CheckBoxIcon : CheckBoxOutlineBlankIcon;

                return (
                  <MenuItem key={tag} value={tag}>
                    <SelectionIcon
                      fontSize="small"
                      style={{ marginRight: 8, padding: 9, boxSizing: 'content-box' }}
                    />
                    <ListItemText primary={tag} />
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>
        <Button variant="contained"
          onClick={handleSubmit}
          id="submitPost"
          style={{ marginRight: 8 }}>
          Lägg upp inlägg</Button>
      </form >
    </>
  );
};

export default PostForm;