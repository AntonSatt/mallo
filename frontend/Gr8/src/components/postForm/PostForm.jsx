import React, { useState } from "react";
import PostServices from "../../services/PostServices";
// Page is not implemeted to backend yet, so this is just a mockup of the form.

//import { useNavigate } from "react-router-dom";
//import { Button, Dialog, DialogTitle, DialogAction, Box } from "@mui/material"
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
import { AccountCircle } from "@mui/icons-material"
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

  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    // if (
    //   !postData.postTitle.trim() ||
    //   !postData.postContent.trim() ||
    //   !postData.postTag.trim()
    // ) {
    //   setError("Alla fält måste vara ifyllda.");
    //   return;
    // }

    // if (postData.postTitle.length < 1 || postData.postTitle.length > 50) {
    //   setError("Titeln måste innehålla minst 1 och max 50 tecken.");
    //   return;
    // }

    // if (postData.postContent.length < 1) {
    //   setError("Posten måste innehålla minst 1 tecken.");
    //   return;
    // }

    // if (postData.postTag.length < 1) {
    //   setError("Inlägget måste innehålla minst 1 tagg.");
    //   return;
    // }

    // if (selectedCategory.length < 1) {
    //   setError("Inlägget måste innehålla minst 1 kategori.");
    //   return;
    // }

    try {
      const result = await PostServices.create(postData);
      console.log("Post created successfully:", result);
    } catch (err) {
      setError(err.message || 'Registrering misslyckades. Försök igen.');
    }
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedTags(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleChangeCategory = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedCategory(
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
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              value={selectedCategory}
              onChange={handleChangeCategory}
              input={<OutlinedInput label="Category" />}
              renderValue={(selected) => selected.join(', ')}
              MenuProps={MenuProps}
            >
              {categoryOptions.map((category) => {
                const selected = selectedCategory.includes(category);
                const SelectionIcon = selected ? CheckBoxIcon : CheckBoxOutlineBlankIcon;

                return (
                  <MenuItem key={category} value={category}>
                    <SelectionIcon
                      fontSize="small"
                      style={{ marginRight: 8, padding: 9, boxSizing: 'content-box' }}
                    />
                    <ListItemText primary={category} />
                  </MenuItem>
                );
              })}
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
              value={selectedTags}
              onChange={handleChange}
              input={<OutlinedInput label="Taggar" />}
              renderValue={(selected) => selected.join(', ')}
              MenuProps={MenuProps}
            >
              {tagOptions.map((tag) => {
                const selected = selectedTags.includes(tag);
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