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
import FilterListIcon from "@mui/icons-material/FilterList";

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
                spacing={1}
                alignItems="center"
                sx={{ mt: 2, mb: 2, flexWrap: "wrap" }}
            >
                <Chip
                    label="Alla"
                    onClick={() => onNavCategoryClick("Alla")}
                    color={activeNavCategory === "Alla" && checkedCategories.length === 0 ? "error" : "default"}
                    variant={activeNavCategory === "Alla" && checkedCategories.length === 0 ? "filled" : "outlined"}
                />
                {categories.slice(0, 3).map(cat => (
                    <Chip
                        key={cat.id}
                        label={cat.name}
                        onClick={() => onNavCategoryClick(cat.name)}
                        color={activeNavCategory === cat.name && checkedCategories.length === 0 ? "error" : "default"}
                        variant={activeNavCategory === cat.name && checkedCategories.length === 0 ? "filled" : "outlined"}
                    />
                ))}
                <Badge badgeContent={checkedCategories.length} color="error">
                    <IconButton onClick={onFilterIconClick} size="small">
                        <FilterListIcon />
                    </IconButton>
                </Badge>
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