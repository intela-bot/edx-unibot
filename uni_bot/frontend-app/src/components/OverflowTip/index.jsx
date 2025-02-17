import PropTypes from 'prop-types';
import { useRef, useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';


export default function OverflowTip({ value, content, isAlwaysDisplayed }) {
  const [hoverStatus, setHover] = useState(false);
  const textElementRef = useRef();

  const compareSize = () => {
    const compare = textElementRef.current.scrollWidth > textElementRef.current.clientWidth;
    setHover(compare);
  };

  useEffect(() => {
    compareSize();
    window.addEventListener('resize', compareSize);
    return () => {
      window.removeEventListener('resize', compareSize);
    };
  }, []);


  const CustomWidthTooltip = styled(({ className, ...props }) => (
    <Tooltip classes={{ popper: className }} {...props}>{props.children}</Tooltip>
  ))({
    [`& .${tooltipClasses.tooltip}`]: {
      maxWidth: 500,
      fontSize: '14px',
    },
  });

  return (
    <CustomWidthTooltip
      arrowf
      interactive
      title={value}
      disableHoverListener={!isAlwaysDisplayed && !hoverStatus}
    >
      <div
        ref={textElementRef}
        className="OverflowTipWrapper"
      >
        {content || value}
      </div>
    </CustomWidthTooltip>
  );
}

OverflowTip.defaultProps = {
  children: null,
  isAlwaysDisplayed: false,
};

OverflowTip.propTypes = {
  content: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  isAlwaysDisplayed: PropTypes.bool,
  children: PropTypes.node,
};
