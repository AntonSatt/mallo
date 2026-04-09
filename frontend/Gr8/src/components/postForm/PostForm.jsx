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
const postForm = () => {
  const [postData, setPostData] = useState({
    postTitle: "",
    postContent: "",
    postTag: ""
  });

  const [selectedTags, setSelectedTags] = useState([]);

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

    if (postData.postContent.length < 1) {
      setError("Posten måste innehålla minst 1 tecken.");
      return;
    }

    if (postData.postTag.length < 1) {
      setError("Inlägget måste innehålla minst 1 tagg.");
      return;
    }

    try {
      await register(postData);
      navigate('/');
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

  return (
    <>
      <form>
        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
          <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
          <TextField
            fullWidth
            value={postForm.postTitle}
            onChange={(e) => setPostData({ ...postData, postTitle: e.target.value })}
          />
          <TextField
            fullWidth
            value={postForm.postContent}
            onChange={(e) => setPostData({ ...postData, postContent: e.target.value })}
            label="Skriv ditt inlägg här..."
            multiline
            maxRows={6}
          />
        </Box>
        <div>
          <FormControl sx={{ m: 3, width: 300 }}>
            <InputLabel id="demo-multiple-checkbox-label">Taggar</InputLabel>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              value={selectedTags}
              onChange={handleChange}
              input={<OutlinedInput label="Tag" />}
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
        <Button variant="contained" onClick={handleSubmit} id="submitPost">Lägg upp inlägg</Button>
      </form>
    </>
  );
};

export default PostForm;


