import PropTypes from 'prop-types';
import {
  TextField, Box, Typography, Slider,
} from '@mui/material';
import { toast } from 'react-toastify';

import { useWidgetParams } from '@context/widget';
import { useDebouncedCallback } from '@hooks';
import { useSaveWidgetSettingsMutation } from '@api/settingsSlice';
import {
  DIMENSIONS,
  MIN_WIDTH_VALUE,
  MIN_HEIGHT_VALUE,
  MAX_WIDTH_VALUE,
  MAX_HEIGHT_VALUE,
} from './constants';


export default function DimensionsSection({ courseId }) {
  const { widgetParams, updateWidgetParams } = useWidgetParams();
  const [saveWidgetSettings] = useSaveWidgetSettingsMutation();

  const handleSaveWidgetDimension = async (value, dimension) => {
    try {
      await saveWidgetSettings({
        courseId,
        ...widgetParams.languages.selected,
        widget: { ...widgetParams.widget, [dimension]: value },
        languages: widgetParams.languages.selected,
      }).unwrap();
      toast.success(`Successfully saved ${dimension}`);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to save widget dimension:', {
        dimension,
        value,
        error: error.message || error,
      });
      toast.error(`Failed to save ${dimension}. Please try again.`);
    }
  };

  const debouncedSaveWidgetDimension = useDebouncedCallback(handleSaveWidgetDimension, 1000);

  const handleChange = (e, dimension) => {
    const newValue = e.target.value;
    if (dimension === DIMENSIONS.WIDTH) {
      updateWidgetParams({
        widget: { ...widgetParams.widget, [dimension]: newValue },
      });
    } else if (dimension === DIMENSIONS.HEIGHT) {
      updateWidgetParams({
        widget: { ...widgetParams.widget, [dimension]: newValue },
      });
    }
  };

  const handleBlur = (dimension) => {
    const value = widgetParams.widget[dimension];
    const minDimensionValue = dimension === DIMENSIONS.WIDTH ? MIN_WIDTH_VALUE : MIN_HEIGHT_VALUE;
    const maxDimensionValue = dimension === DIMENSIONS.WIDTH ? MAX_WIDTH_VALUE : MAX_HEIGHT_VALUE;

    const clampedValue = Math.max(minDimensionValue, Math.min(maxDimensionValue, value));

    if (clampedValue !== value || value === '') {
      updateWidgetParams({
        widget: { ...widgetParams.widget, [dimension]: clampedValue },
      });
    }

    debouncedSaveWidgetDimension(clampedValue, dimension);
  };


  const handleSliderChange = (e, newValue, dimension) => {
    if (dimension === DIMENSIONS.WIDTH) {
      updateWidgetParams({
        widget: { ...widgetParams.widget, [dimension]: newValue },
      });
      debouncedSaveWidgetDimension(newValue, dimension);
    } else if (dimension === DIMENSIONS.HEIGHT) {
      updateWidgetParams({
        widget: { ...widgetParams.widget, [dimension]: newValue },
      });
      debouncedSaveWidgetDimension(newValue, dimension);
    }
  };

  return (
    <Box className="Dimensions">
      <Typography variant="caption" display="block" gutterBottom>
        Window dimensions
      </Typography>
      <Box className="DimensionsWrapper">
        <Box className="DimensionsItem">
          <Typography className="DimensionsItem__Label" variant="caption" display="block" gutterBottom>
            Width (px):
          </Typography>
          <TextField
            id="width-input"
            className="DimensionsItem__Input"
            type="number"
            value={widgetParams.widget.width}
            onChange={(e) => handleChange(e, DIMENSIONS.WIDTH)}
            onBlur={() => handleBlur(DIMENSIONS.WIDTH)}
            variant="outlined"
            inputProps={{ min: MIN_WIDTH_VALUE, max: MAX_WIDTH_VALUE }}
          />
          <Slider
            value={widgetParams.widget.width ? Number(widgetParams.widget.width) : MIN_WIDTH_VALUE}
            onChange={(e, newValue) => handleSliderChange(e, newValue, DIMENSIONS.WIDTH)}
            aria-labelledby="width-slider"
            valueLabelDisplay="auto"
            min={MIN_WIDTH_VALUE}
            max={MAX_WIDTH_VALUE}
          />
        </Box>
        <Box className="DimensionsItem">
          <Typography className="DimensionsItem__Label" variant="caption" display="block" gutterBottom>
            Height (px):
          </Typography>
          <TextField
            id="height-input"
            className="DimensionsItem__Input"
            type="number"
            value={widgetParams.widget.height}
            onChange={(e) => handleChange(e, DIMENSIONS.HEIGHT)}
            onBlur={() => handleBlur(DIMENSIONS.HEIGHT)}
            variant="outlined"
            inputProps={{ min: MIN_HEIGHT_VALUE, max: MAX_HEIGHT_VALUE }}
          />
          <Slider
            value={widgetParams.widget.height ? Number(widgetParams.widget.height) : MIN_HEIGHT_VALUE}
            onChange={(e, newValue) => handleSliderChange(e, newValue, DIMENSIONS.HEIGHT)}
            aria-labelledby="height-slider"
            valueLabelDisplay="auto"
            min={MIN_HEIGHT_VALUE}
            max={MAX_HEIGHT_VALUE}
          />
        </Box>
      </Box>
    </Box>
  );
}

DimensionsSection.propTypes = {
  courseId: PropTypes.string.isRequired,
};
