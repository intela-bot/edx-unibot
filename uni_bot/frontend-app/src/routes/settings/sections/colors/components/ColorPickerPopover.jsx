import PropTypes from 'prop-types';
import { HexColorPicker } from 'react-colorful';
import { Box, Popover } from '@mui/material';


export default function ColorPickerPopover({
  id, open, anchorEl, onClose, color, onChange,
}) {
  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    >
      <Box p={2}>
        <HexColorPicker color={color} onChange={onChange} />
      </Box>
    </Popover>
  );
}

ColorPickerPopover.defaultProps = {
  id: undefined,
  anchorEl: null,
};

ColorPickerPopover.propTypes = {
  id: PropTypes.string,
  open: PropTypes.bool.isRequired,
  anchorEl: PropTypes.instanceOf(Element),
  onClose: PropTypes.func.isRequired,
  color: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
