import PropTypes from 'prop-types';
import { TableCell, TableRow } from '@mui/material';

import { StarIcon, MarkIcon, MinusIcon } from '@assets/icons';


export default function SortableTableRow({ row }) {
  const getCellContent = (key, value) => {
    switch (key) {
      case 'rating':
        return (
          <div className="RatingItem">
            {new Array(5).fill(null).map((val, idx) => (
              <StarIcon
                key={idx} // eslint-disable-line react/no-array-index-key
                className="RatingItemIcon"
                style={{ color: value < idx + 1 ? 'rgba(28, 28, 28, 0.1)' : '#f49931' }}
              />
            ))}
          </div>
        );
      case 'feedbacks':
        return (
          <div className="FeedbacksItem">{value ? <MarkIcon /> : <MinusIcon />}</div>
        );
      default:
        return (
          <span>{row[key]}</span>
        );
    }
  };

  return (
    <TableRow hover className="SortableTableRow">
      {Object.keys(row).map((key) => (
        <TableCell
          key={key}
          className={`SortableTableCell SortableTableCell_${key}`}
        >
          {getCellContent(key, row[key])}
        </TableCell>
      ))}
    </TableRow>
  );
}

SortableTableRow.propTypes = {
  row: PropTypes.shape({
    startTime: PropTypes.string.isRequired,
    answers: PropTypes.number.isRequired,
    rating: PropTypes.number.isRequired,
    feedbacks: PropTypes.bool.isRequired,
    endTime: PropTypes.string.isRequired,
  }).isRequired,
};
