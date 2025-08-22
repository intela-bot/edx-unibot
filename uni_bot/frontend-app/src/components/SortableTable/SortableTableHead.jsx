import PropTypes from 'prop-types';
import {
  TableCell, TableHead, TableRow, TableSortLabel,
} from '@mui/material';

import { SORTING_TYPES } from '@routes/constants';

import { SortingIcon } from '@assets/icons';


export default function SortableTableHead({
  order, orderBy, onRequestSort, headCells,
}) {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.isSortable ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : SORTING_TYPES.asc}
                onClick={createSortHandler(headCell.id)}
                className="SortableTableSortCell"
                // eslint-disable-next-line react/no-unstable-nested-components
                IconComponent={() => <SortingIcon variant={orderBy === headCell.id ? order : null} />}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <span className="sr-only">
                    {order === SORTING_TYPES.desc ? 'sorted descending' : 'sorted ascending'}
                  </span>
                ) : null}
              </TableSortLabel>
            ) : (
              <span>{headCell.label}</span>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

SortableTableHead.defaultProps = {
  order: null,
  orderBy: null,
};

SortableTableHead.propTypes = {
  order: PropTypes.string,
  orderBy: PropTypes.string,
  onRequestSort: PropTypes.func.isRequired,
  headCells: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      isSortable: PropTypes.bool.isRequired,
    }),
  ).isRequired,
};
