import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  TextField, Box, FormControl, FormHelperText,
} from '@mui/material';
import { toast } from 'react-toastify';

import { useSaveWidgetSettingsMutation } from '@api/settingsSlice';
import { useWidgetParams } from '@context/widget';
import { useAppData } from '@context/app';
import { useDebouncedCallback } from '@hooks';
import { AvatarUpload } from './components';
import { NAME_MAX_CHARS, SLOGAN_MAX_CHARS } from './constants';


export default function InfoSection({ courseId }) {
  const [isError, setIsError] = useState({ name: false, description: false });
  const { widgetParams, updateWidgetParams } = useWidgetParams();
  const { appData, updateAppData } = useAppData();
  const [saveWidgetSettings] = useSaveWidgetSettingsMutation();

  const handleSaveWidgetSettings = async (field, value) => {
    try {
      await saveWidgetSettings({
        courseId,
        widget: { ...widgetParams.widget, [field]: value },
        languages: widgetParams.languages.selected,
      }).unwrap();
      toast.success(`Successfully saved ${field}`);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to save widget setting:', {
        field,
        value,
        error: error.message || error,
      });
      toast.error(`Failed to save ${field}`);
    }
  };

  const debouncedSave = useDebouncedCallback(async (field, value) => {
    await handleSaveWidgetSettings(field, value);
  }, 500);

  const handleInputChange = (field) => (e) => {
    const { value } = e.target;
    const hasError = value.trim() === '';
    setIsError((prev) => ({ ...prev, [field]: hasError }));
    updateWidgetParams({
      widget: { ...widgetParams.widget, [field]: value },
    });
    if (!hasError) {
      debouncedSave(field, value);
    }
  };

  const handleAvatarChange = async (newAvatar) => {
    updateAppData({ ...appData, avatar: newAvatar });
    try {
      await updateWidgetParams({ avatar: newAvatar });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to save avatar:', error);
    }
  };

  return (
    <Box className="InfoSection">
      <AvatarUpload
        courseId={courseId}
        avatar={appData.avatar}
        setAvatar={handleAvatarChange}
      />
      <Box className="InfoSection__InputWrapper">
        <FormControl className="InfoSection__Input" error={isError.name} variant="outlined">
          <TextField
            id="ta-name"
            label="TA name"
            variant="outlined"
            value={widgetParams.widget.name}
            onChange={handleInputChange('name')}
            inputProps={{ maxLength: NAME_MAX_CHARS }}
          />
          <FormHelperText>
            {isError.name ? 'This field is required.' : ' '}
          </FormHelperText>
        </FormControl>
        <FormControl className="InfoSection__Input" error={isError.description} variant="outlined">
          <TextField
            id="ta-description"
            label="TA slogan/description"
            variant="outlined"
            value={widgetParams.widget.description}
            onChange={handleInputChange('description')}
            inputProps={{ maxLength: SLOGAN_MAX_CHARS }}
          />
          <FormHelperText>
            {isError.description ? 'This field is required.' : ' '}
          </FormHelperText>
        </FormControl>
      </Box>
    </Box>
  );
}

InfoSection.propTypes = {
  courseId: PropTypes.string.isRequired,
};
