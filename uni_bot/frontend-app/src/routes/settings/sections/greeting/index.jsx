import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  TextareaAutosize,
  FormControl,
  FormHelperText,
} from '@mui/material';
import { toast } from 'react-toastify';

import { useWidgetParams } from '@context/widget';
import { useSaveWidgetSettingsMutation } from '@api/settingsSlice';
import { useDebouncedCallback } from '@hooks';


export default function GreetingSection({ courseId }) {
  const { widgetParams, updateWidgetParams } = useWidgetParams();
  const [isError, setIsError] = useState(false);
  const [saveWidgetSettings] = useSaveWidgetSettingsMutation();

  const handleSaveGreetingMessage = async (greetingString) => {
    if (!greetingString.trim()) { return; }

    try {
      await saveWidgetSettings({
        courseId,
        widget: { ...widgetParams.widget, greetingString },
        languages: widgetParams.languages.selected,
      }).unwrap();
      toast.success('Greeting message successfully saved');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to save greeting message:', {
        greetingString,
        error: error.message || error,
      });
      toast.error('Failed to save the greeting message. Please try again.');
    }
  };

  const debouncedSaveGreetingMessage = useDebouncedCallback(async (greetingString) => {
    await handleSaveGreetingMessage(greetingString);
  }, 500);

  const handleGreetingChange = (e) => {
    const greetingString = e.target.value;
    updateWidgetParams({ widget: { ...widgetParams.widget, greetingString } });
    setIsError(greetingString.trim() === '');
    if (greetingString.trim() !== '') {
      debouncedSaveGreetingMessage(greetingString);
    }
  };

  return (
    <Box className="Greeting">
      <Typography variant="caption" display="block" gutterBottom>
        First greeting in English
      </Typography>
      <FormControl error={isError} className="Greeting__form-control">
        <TextareaAutosize
          className={`CustomTextarea ${isError ? 'CustomTextarea--error' : ''}`}
          minRows={3}
          aria-label="Enter greeting text here..."
          placeholder="Enter greeting text here..."
          value={widgetParams.widget.greetingString}
          onChange={handleGreetingChange}
        />
        <FormHelperText>{isError ? 'This field is required.' : ' '}</FormHelperText>
      </FormControl>
    </Box>
  );
}

GreetingSection.propTypes = {
  courseId: PropTypes.string.isRequired,
};
