import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { Box, IconButton } from '@mui/material';
import 'swiper/css';
import 'swiper/css/navigation';
import './avatarSlider.css'
import CustomAvatar from './avatar.jsx';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';

export default function AvatarSlider({ formData, handleChange, mt = 2, mb = 2 }) {
    // 0 represents the "Select Icon" text placeholder, 1-9 are actual avatars
    const avatarIds = [1, 2, 3, 4, 0, 5, 6, 7, 8, 9];
    const middleIndex = avatarIds.indexOf(0);

    return (
        <Box sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            overflow: 'visible',
            mt: mt,
            mb: mb,
        }}>
            <Box sx={{ width: '100%', position: 'relative', marginTop: 2 }}>
                <Swiper
                    modules={[Navigation]}
                    navigation={{
                        prevEl: '.swiper-button-prev-custom',
                        nextEl: '.swiper-button-next-custom',
                    }}
                    style={{ width: '100%', height: '100%', overflow: 'visible' }}
                    slidesPerView={4.5}
                    centeredSlides={true}
                    slidesOffsetBefore={-25}
                    spaceBetween={20}

                    initialSlide={formData?.avatar !== undefined && formData?.avatar !== null
                        ? avatarIds.indexOf(formData.avatar)
                        : middleIndex}

                    onSlideChange={(swiper) => {
                        const selectedId = avatarIds[swiper.activeIndex];

                        // If user slides to the placeholder (0), set value to null to prevent selection
                        if (selectedId === 0) {
                            handleChange({
                                target: { name: 'avatar', value: null }
                            });
                        } else {
                            handleChange({
                                target: { name: 'avatar', value: selectedId }
                            });
                        }
                    }}
                >
                    {avatarIds.map((id) => (
                        <SwiperSlide key={id} className='swiper-slide'>
                            {({ isActive }) => (
                                <Box
                                    display="flex"
                                    justifycontent="center"
                                    alignitems="center"
                                    sx={{
                                        height: '100px',
                                        transition: 'all 0.3s ease',
                                        transform: isActive ? 'scale(1.5)' : 'scale(0.9)',
                                        opacity: 1,
                                        px: 1,
                                    }}
                                >
                                    <CustomAvatar
                                        avatar={id}
                                        size={isActive ? 80 : 60}
                                        style={{
                                            boxShadow: isActive
                                                ? 'inset 0px 4px 6px rgba(0, 0, 0, 0.2), inset 0px -2px 4px rgba(255, 255, 255, 0.1)'
                                                : 'inset 0px 2px 4px rgba(0, 0, 0, 0.1)',

                                            transition: 'all 0.3s ease',
                                            borderRadius: '50%',
                                            backgroundColor: 'var(--color-bg-muted)',
                                            border: 'none',
                                        }}
                                    />
                                </Box>
                            )}
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Box>
            {/* Custom Navigation Controls */}
            <Box sx={{ display: 'flex', gap: 0.5, marginLeft: 1, mt: 2, mb: 1 }}>
                <IconButton
                    className="swiper-button-prev-custom"
                    sx={{
                        color: 'var(--color-primary)',
                    }}
                >
                    <ArrowCircleLeftOutlinedIcon />
                </IconButton>

                <MoreHorizOutlinedIcon fontSize='large' sx={{ color: 'var(--color-ui-muted)', mt: 0.5 }} />

                <IconButton
                    className="swiper-button-next-custom"
                    sx={{
                        color: 'var(--color-primary)',
                    }}
                >
                    <ArrowCircleRightOutlinedIcon />
                </IconButton>
            </Box>
        </Box>
    );
}