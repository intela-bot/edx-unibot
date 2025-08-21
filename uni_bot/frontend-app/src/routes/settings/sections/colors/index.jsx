import { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import { toast } from 'react-toastify';

import {
  DEFAULT_ACCENT_COLOR,
  DEFAULT_BACKGROUND_COLOR,
  DEFAULT_TEXT_COLOR,
  PICKERS,
  useWidgetParams,
} from '@context/widget';
import { useSaveWidgetSettingsMutation } from '@api/settingsSlice';
import { useDebouncedCallback } from '@hooks';
import { ColorPicker, ColorPickerPopover } from './components';
import { POPOVER_ID } from './constants';
import { getColor } from './utils';


export default function ColorsSection({ courseId }) {
  const { widgetParams, updateWidgetParams } = useWidgetParams();
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentPicker, setCurrentPicker] = useState(null);
  const [saveWidgetSettings] = useSaveWidgetSettingsMutation();

  const isOpen = Boolean(anchorEl);
  const popoverId = isOpen ? POPOVER_ID : undefined;

  const handleSaveWidgetColors = async (picker, color) => {
    try {
      await saveWidgetSettings({
        courseId,
        widget: { ...widgetParams.widget, [picker]: color },
        languages: widgetParams.languages.selected,
      }).unwrap();
      toast.success('Color successfully saved');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to save widget color:', {
        picker,
        color,
        error: error.message || error,
      });
      toast.success('Failed to save color');
    }
  };

  const debouncedSaveWidgetColors = useDebouncedCallback(handleSaveWidgetColors, 1000);

  const handleColorChange = async (color) => {
    updateWidgetParams({
      widget: { ...widgetParams.widget, [currentPicker]: `${color.replace('#', '')}` },
    });
    await debouncedSaveWidgetColors(currentPicker, color.replace('#', ''));
  };

  const handleColorBoxClick = (e, picker) => {
    setAnchorEl(e.currentTarget);
    setCurrentPicker(picker);
  };

  const handleKeyDown = (e, picker) => {
    if (e.key === 'Enter') {
      setAnchorEl(e.currentTarget);
      setCurrentPicker(picker);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    setCurrentPicker(null);
  };

  const handleHexInputChange = (picker) => (e) => {
    const { value } = e.target;
    updateWidgetParams({
      widget: { ...widgetParams.widget, [picker]: `${value}` },
    });
  };

  const handleHexInputBlur = (picker) => async () => {
    let value = widgetParams.widget[picker];
    // Check if the value is a valid hex color
    if (!/^[0-9A-F]{3}([0-9A-F]{3})?$/i.test(value)) {
      switch (picker) {
        case PICKERS.BACKGROUND:
          value = DEFAULT_BACKGROUND_COLOR;
          toast.error('Incorrect HEX value for background color');
          break;
        case PICKERS.ACCENT:
          value = DEFAULT_ACCENT_COLOR;
          toast.error('Incorrect HEX value for accent color');
          break;
        case PICKERS.TEXT:
          value = DEFAULT_TEXT_COLOR;
          toast.error('Incorrect HEX value for text color');
          break;
        default:
          value = DEFAULT_BACKGROUND_COLOR;
          toast.error('Incorrect HEX value');
          break;
      }
    }
    updateWidgetParams({
      widget: { ...widgetParams.widget, [picker]: `${value}` },
    });
    await debouncedSaveWidgetColors(picker, value);
  };

  return (
    <Box className="Colors">
      <Typography variant="caption" display="block" gutterBottom>
        Colors
      </Typography>
      <Box className="ColorPickers">
        <ColorPicker
          label="Background"
          color={widgetParams.widget[PICKERS.BACKGROUND]}
          onColorChange={handleHexInputChange(PICKERS.BACKGROUND)}
          onBlur={handleHexInputBlur(PICKERS.BACKGROUND)}
          onColorBoxClick={(e) => handleColorBoxClick(e, PICKERS.BACKGROUND)}
          onKeyDown={(e) => handleKeyDown(e, PICKERS.BACKGROUND)}
        />
        <ColorPicker
          label="Accent"
          color={widgetParams.widget[PICKERS.ACCENT]}
          onColorChange={handleHexInputChange(PICKERS.ACCENT)}
          onBlur={handleHexInputBlur(PICKERS.ACCENT)}
          onColorBoxClick={(e) => handleColorBoxClick(e, PICKERS.ACCENT)}
          onKeyDown={(e) => handleKeyDown(e, PICKERS.ACCENT)}
        />
        <ColorPicker
          label="Text"
          color={widgetParams.widget[PICKERS.TEXT]}
          onColorChange={handleHexInputChange(PICKERS.TEXT)}
          onBlur={handleHexInputBlur(PICKERS.TEXT)}
          onColorBoxClick={(e) => handleColorBoxClick(e, PICKERS.TEXT)}
          onKeyDown={(e) => handleKeyDown(e, PICKERS.TEXT)}
        />
      </Box>
      <ColorPickerPopover
        id={popoverId}
        open={isOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        color={getColor(currentPicker, widgetParams.widget)}
        onChange={handleColorChange}
      />
    </Box>
  );
}

ColorsSection.propTypes = {
  courseId: PropTypes.string.isRequired,
};
