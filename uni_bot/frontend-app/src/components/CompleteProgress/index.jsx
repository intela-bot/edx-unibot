import PropTypes from 'prop-types';
import { Box, LinearProgress, linearProgressClasses } from '@mui/material';
import { styled } from '@mui/material/styles';


export default function CompleteProgress({ progress }) {
  const progressPercent = Math.floor(progress * 100);
  const BorderLinearProgress = styled(LinearProgress)(() => ({
    height: 10,
    borderRadius: 11,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: 'rgba(64, 64, 242, 0.05)',
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 11,
      backgroundColor: '#4040f2',
    },
  }));

  return (
    <Box className="CompleteProgress">
      <BorderLinearProgress variant="determinate" value={progressPercent} className="CompleteProgress__bar" />
      <span className="CompleteProgress__text">{progressPercent}% completed</span>
    </Box>
  );
}

CompleteProgress.propTypes = {
  progress: PropTypes.number.isRequired,
};
