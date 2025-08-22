import PropTypes from 'prop-types';
import { Box, Typography, TextField } from '@mui/material';


export default function ColorPicker({
  label, color, onColorChange, onColorBoxClick, onKeyDown, onBlur,
}) {
  return (
    <Box className="ColorPicker__ColorBox">
      <Typography
        className="ColorPicker__ColorBox__Label"
        variant="caption"
        display="block"
        gutterBottom
      >
        {label}:
      </Typography>
      <Box
        className="ColorPicker__ColorBox-ColorPreview"
        tabIndex={0}
        role="button"
        aria-label={`${label} color picker`}
        onClick={onColorBoxClick}
        onKeyDown={onKeyDown}
        sx={{ backgroundColor: `#${color}` }}
      />
      <TextField
        id={`${label.toLowerCase()}-color`}
        variant="outlined"
        value={color}
        onChange={onColorChange}
        onBlur={onBlur}
        sx={{ width: '103px' }}
      />
    </Box>
  );
}

ColorPicker.propTypes = {
  label: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  onColorChange: PropTypes.func.isRequired,
  onColorBoxClick: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
};
