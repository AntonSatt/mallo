import {useState} from 'react';
import {useAuth} from '../../hooks/useAuth'
import Avatar from "../avatar/avatar"
import {Stack, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

const ProfileHeader = () => {
const {currentUser, logut} = useAuth();


    return (
        <>
            <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                sx={{cursor: "pointer", "&:hover": {opacity: 0.8 }}}    
            >
                <Avatar/>
                <Typography>Namn</Typography>
            </Stack>
        </>
    )
}
export default ProfileHeader;