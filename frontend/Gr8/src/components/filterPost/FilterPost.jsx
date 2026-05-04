import './FilterPost.css';
import FilterIcon from "../../assets/icons/filter.svg";

import {
    Stack,
    Chip,
    Badge,
    IconButton,
    Menu,
    MenuItem,
    Typography,
    Divider,
    Checkbox,
    FormControlLabel,
} from "@mui/material";

const CategoryFilter = ({
    categories,
    activeNavCategory,
    checkedCategories,
    filterAnchorEl,
    onNavCategoryClick,
    onFilterIconClick,
    onFilterClose,
    onCheckboxChange,
    onClearFilters,
}) => {
    return (
        <>
            <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                // this is for scrolling the category chips on smaller screens without wrapping to a new line.
                sx={{ mt: 2, mb: 2, flexWrap: "nowrap", 
                    overflowX: "auto", scrollbarWidth: "none", 
                    "&::-webkit-scrollbar": {display: "none"}}}
            >
                <Badge badgeContent={checkedCategories.length} color="error">
                    <IconButton onClick={onFilterIconClick} size="small" className="filter-button">
                        <img src={FilterIcon} alt="" className="filter-icon-img" />
                    </IconButton>
                </Badge>

                <Chip
                    label="Alla"
                    onClick={() => onNavCategoryClick("Alla")}
                    className={activeNavCategory === "Alla" && checkedCategories.length === 0 ? "filter-chip active" : "filter-chip"}
                />

                <Chip label="Sparade"
                onClick={() => onNavCategoryClick("Sparade")}
                className={activeNavCategory === "Sparade" && checkedCategories.length === 0 ? "filter-chip active" : "filter-chip"} 
                />

                <Chip label="Dina inlägg"
                onClick={() => onNavCategoryClick("Dina inlägg")}
                className={activeNavCategory === "Dina inlägg" && checkedCategories.length === 0 ? "filter-chip active" : "filter-chip"} 
                />

                {categories.slice(0, 3).map(cat => (
                    <Chip
                        key={cat.id}
                        label={cat.name}
                        onClick={() => onNavCategoryClick(cat.name)}
                        className={activeNavCategory === cat.name && checkedCategories.length === 0 ? "filter-chip active" : "filter-chip"}
                    />
                ))}
                
            </Stack>

            <Menu
                anchorEl={filterAnchorEl}
                open={Boolean(filterAnchorEl)}
                onClose={onFilterClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
            >
                <Typography variant="subtitle2" sx={{ px: 2, py: 1, fontWeight: "bold" }}>
                    Filtrera på kategori
                </Typography>
                <Divider />
                {categories.map(cat => (
                    <MenuItem key={cat.id} dense disableRipple>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={checkedCategories.includes(cat.name)}
                                    onChange={() => onCheckboxChange(cat.name)}
                                    color="error"
                                    size="small"
                                />
                            }
                            label={cat.name}
                        />
                    </MenuItem>
                ))}
                <Divider />
                <MenuItem onClick={onClearFilters} dense>
                    <Typography variant="caption" color="error">
                        Rensa filter
                    </Typography>
                </MenuItem>
            </Menu>
        </>
    );
};

export default CategoryFilter;