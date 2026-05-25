import './FilterPost.css';
import FilterIcon from "../../assets/icons/filter.svg";
import useViewport from "../../hooks/useViewport.js";

import {
    Stack,
    Chip,
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

    const { isDesktop } = useViewport();

    return (
        <>
            <Stack
                direction="row"
                spacing={1.5}
                sx={{
                    mt: 0, // controls the distance from the top edge of the screen to the filter bar.
                    mb: 1, // controls the distance from the bottom edge of the filter bar to the first post.
                    flexWrap: "nowrap",

                    width: {
                        xs: "100%", //mobile swipe
                        md: "fit-content" //desktop view
                    },

                    ml: {
                        xs: 0,
                        md: "110px", //controls the distance from the left edge of the screen to the filter bar in desktop view.
                    },

                    overflowX: { 
                        xs: "auto",
                        md: "visible",
                    },

                    scrollbarWidth: "none", 
                    "&::-webkit-scrollbar": { 
                        display: "none", 
                    }
                }}
            >
                <IconButton onClick={onFilterIconClick} size="small" className="filter-button" aria-label="Filtrera inlägg">
                    <img src={FilterIcon} alt="" className="filter-icon-img" />
                </IconButton>

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

                {/*isDEsktop is used to determine wheter to show all categories as chips or not.*/}
                {!isDesktop && categories.slice(0, 3).map(cat => (
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