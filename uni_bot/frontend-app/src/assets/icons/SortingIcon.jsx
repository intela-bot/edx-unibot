import PropTypes from 'prop-types';

import { SORTING_TYPES } from '@routes/constants';


export default function SortingIcon({ variant = null, ...props }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" {...props}>
      <path
        d="M2.03641e-07 9.25L0.966667 8.375L3.33333 10.5938L3.33333 3L4.66667 3L4.66667 10.5938L7.03333 8.375L8 9.25L4 13L2.03641e-07 9.25Z"
        fill={variant === SORTING_TYPES.asc ? '#4040f2' : '#1c1c1c'}
        fillOpacity={variant === SORTING_TYPES.asc ? 1 : '0.2'}
      />
      <path
        d="M7 6.75L7.96667 7.625L10.3333 5.40625L10.3333 13L11.6667 13L11.6667 5.40625L14.0333 7.625L15 6.75L11 3L7 6.75Z"
        fill={variant === SORTING_TYPES.desc ? '#4040f2' : '#1c1c1c'}
        fillOpacity={variant === SORTING_TYPES.desc ? 1 : '0.2'}
      />
    </svg>
  );
}

SortingIcon.defaultProps = {
  variant: null,
};

SortingIcon.propTypes = {
  variant: PropTypes.string,
};
