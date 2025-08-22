import PropTypes from 'prop-types';
import classNames from 'classnames';
import { TableCell, TableRow } from '@mui/material';

import { CheckboxIcon } from '@assets/icons';
import { OverflowTip } from '@components';
import { capitalize } from '@/utils';


export default function SortableTableRow({ row: block, markedRow, handleRowClick }) {
  const isMarkedBlock = markedRow?.modelName ? block.modelName === markedRow?.modelName : false;
  const isMarkedRow = (row) => (markedRow?.modelName
    ? markedRow?.models.some(obj => obj.name === row.name && obj.value === row.value)
    : undefined);
  const renderColumns = isMarkedBlock ? ['name', 'credentials'] : ['id', 'name', 'credentials'];

  return (
    <>
      <TableRow
        className={classNames(
          'SortableTableHeadingRow',
          { SortableTableHeadingRow_selected: isMarkedBlock },
        )}
      >
        <TableCell colSpan={3}>
          {isMarkedBlock ? 'Active' : capitalize(block.modelName || '')}
        </TableCell>
      </TableRow>
      {block.models.map((row) => (
        <TableRow
          hover={!isMarkedBlock}
          key={row.name}
          onClick={!isMarkedBlock ? () => handleRowClick({ ...row, model: block.modelName }) : null}
        >
          {Object.keys(row).map((key) => renderColumns.includes(key) && (
            <TableCell
              key={`field-${row.value}-${key}`}
              className={`SortableTableCell SortableTableCell_${key}`}
              colSpan={isMarkedBlock && key === 'name' ? 2 : 1}
            >
              {key === 'name' && (
                <div className="SortableTableCellInnerWrapper">
                  {isMarkedRow(row) && <CheckboxIcon />}
                  <OverflowTip value={row.description} content={row[key]} isAlwaysDisplayed />
                </div>
              )}
              {key === 'credentials' && (
                <span>
                  {capitalize((isMarkedRow(row) && row.configurationLevel) || row[key])}
                </span>
              )}
              {key !== 'name' && key !== 'credentials' && (
                <span>{row[key]}</span>
              )}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

SortableTableRow.defaultProps = {
  markedRow: {},
  handleRowClick: undefined,
};

SortableTableRow.propTypes = {
  handleRowClick: PropTypes.func,
  markedRow: PropTypes.shape({
    modelName: PropTypes.string,
    models: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      credentials: PropTypes.string,
      description: PropTypes.string,
    })),
  }),
  row: PropTypes.shape({
    modelName: PropTypes.string.isRequired,
    models: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      credentials: PropTypes.string,
      description: PropTypes.string,
    })).isRequired,
  }).isRequired,
};
