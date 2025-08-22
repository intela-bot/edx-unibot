import { useRef } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Avatar } from '@mui/material';
import { toast } from 'react-toastify';

import { PenIcon } from '@assets/icons';
import { getCsrfToken } from '@api/utils';
import { useUploadAvatarMutation } from '@api/settingsSlice';


export default function AvatarUpload({
  courseId, avatar, setAvatar,
}) {
  const fileInputRef = useRef(null);
  const [uploadAvatar] = useUploadAvatarMutation();

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => setAvatar(reader.result);
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append('avatar', file);

      const csrfToken = getCsrfToken();
      await uploadAvatar({ formData, csrfToken, courseId }).unwrap();
    } else {
      toast.error('Please select a valid image file for the avatar.');
    }
  };

  return (
    <Box className="AvatarUpload">
      <Typography variant="caption" display="block" gutterBottom>
        TA avatar
      </Typography>
      <Box
        className="StyledAvatarUpload"
        onClick={handleAvatarClick}
        tabIndex={0}
        aria-label="Upload avatar"
      >
        <Box className="AvatarWrapper">
          <Avatar className="Introduction__img" alt="Remy Sharp" src={avatar} />
          <Box className="BorderWrapper" />
          <Box className="PenIconWrapper">
            <PenIcon />
          </Box>
        </Box>
      </Box>
      <input
        type="file"
        className="sr-only"
        accept="image/*"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />
    </Box>
  );
}

AvatarUpload.propTypes = {
  courseId: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  setAvatar: PropTypes.func.isRequired,
};
