import { cloneElement, Children, isValidElement } from 'react';
import PropTypes from 'prop-types';
import { Table, TableBody, TableContainer } from '@mui/material';

import SortableTableHead from './SortableTableHead';
import { stableSort, getComparator } from './utils';
import { useSortTable } from './hooks';


export default function SortableTable({
  rows, headCells, markedRowKey, markedRowValue, handleRowClick, children,
}) {
  const { order, orderBy, handleRequestSort } = useSortTable();

  const markedRow = markedRowKey && markedRowValue
    ? rows.find(row => row[markedRowKey] === markedRowValue)
    : undefined;

  const ChildrenWithProps = (props) => Children.map(children, (child) => {
    if (isValidElement(child)) {
      return cloneElement(child, { ...props });
    }
    return child;
  });

  return (
    <TableContainer className="SortableTableWrapper">
      <Table
        size="medium"
        aria-label="enhanced table"
      >
        <SortableTableHead
          headCells={headCells}
          order={order}
          orderBy={orderBy}
          onRequestSort={handleRequestSort}
        />
        <TableBody>
          {stableSort(rows, getComparator(order, orderBy)).map((row) => (
            <ChildrenWithProps
              key={row.sectionId || row.modelName}
              row={row}
              markedRow={markedRow}
              handleRowClick={handleRowClick}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

SortableTable.defaultProps = {
  markedRowKey: undefined,
  markedRowValue: undefined,
  handleRowClick: undefined,
};

SortableTable.propTypes = {
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      sectionId: PropTypes.string,
      name: PropTypes.string,
      status: PropTypes.string,
    }).isRequired,
  ).isRequired,
  headCells: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      isSortable: PropTypes.bool.isRequired,
    }),
  ).isRequired,
  markedRowKey: PropTypes.string,
  markedRowValue: PropTypes.string,
  handleRowClick: PropTypes.func,
  children: PropTypes.node.isRequired,
};
