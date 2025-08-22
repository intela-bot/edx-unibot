import { Box, CircularProgress } from '@mui/material';
import PropTypes from 'prop-types';


const DEFAULT_HEIGHT = 300;

export default function PreloaderBlock({ height }) {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height={height}
    >
      <CircularProgress />
    </Box>
  );
}

PreloaderBlock.defaultProps = {
  height: DEFAULT_HEIGHT,
};

PreloaderBlock.propTypes = {
  height: PropTypes.number,
};
