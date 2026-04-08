import React, { useState } from "react";
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
import { AccountCircle} from "@mui/icons-material"
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

const tagOptions = [
    "Självskada",
    "Ångest",
    "Depression",
    "Våld",
    "Sexuella övergrepp",
    "Missbruk",
    "Trauma",
    "Misshandel",
    "Psykisk ohälsa"
];


const PostForm = () => {
  const [selectedTags, setSelectedTags] = useState([]);

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
            id="outlined-multiline-flexible"
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
        <Button variant="contained" color="primary">
          Posta ditt inlägg
        </Button>
      </form>
    </>
  );
};

export default PostForm;


