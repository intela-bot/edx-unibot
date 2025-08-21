import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Box } from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';

import { ROUTER_ORDER } from '@routes/constants';


export default function NavigationControls() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname.split('/').pop();
  const currentIndex = ROUTER_ORDER.indexOf(currentPath);

  const handleBackClick = () => {
    const currentIdx = ROUTER_ORDER.indexOf(currentPath);
    if (currentIdx > 0) {
      navigate(`/${ROUTER_ORDER[currentIdx - 1]}`);
    }
  };

  const handleNextClick = () => {
    const currentIdx = ROUTER_ORDER.indexOf(currentPath);
    if (currentIdx < ROUTER_ORDER.length - 1) {
      navigate(`/${ROUTER_ORDER[currentIdx + 1]}`);
    }
  };

  return (
    <Box className="Footer">
      <Button
        onClick={handleBackClick}
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        className="FooterButton"
        style={{ visibility: currentIndex > 0 ? 'visible' : 'hidden' }}
      >
        Back
      </Button>
      <Button
        onClick={handleNextClick}
        variant="contained"
        endIcon={<ArrowForwardIcon />}
        className="FooterButton"
        style={{ visibility: currentIndex < ROUTER_ORDER.length - 1 ? 'visible' : 'hidden' }}
      >
        Next
      </Button>
    </Box>
  );
}
