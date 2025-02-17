import PropTypes from 'prop-types';
import classNames from 'classnames';
import { TableCell, TableRow } from '@mui/material';

import { useUpdateRestrictedQuestionItemMutation } from '@api/restrictedQuestionsSlice';
import { TableActions, OverflowTip } from '@components';
import { SCANNING_STATUSES } from '@routes/constants';
import { useAppData } from '@context/app';
import { toKebabCase } from '@/utils';
import HintTextField from './HintTextField';


export default function SortableTableRow({ row: block }) {
  const { appData: { courseId } } = useAppData();
  const [updateQuestionAvailability, { isLoading: isAvailabilityUpdating }] = useUpdateRestrictedQuestionItemMutation();

  const rowClassName = (row) => (
    classNames('SortableTableRow', {
      [`SortableTableRow_${toKebabCase(row.status)}`]: Object.getOwnPropertyDescriptor(row, 'status').value,
    })
  );

  const cellClassName = (key, value) => (
    key === 'status' ? `status_${toKebabCase(value)}` : null
  );

  const handleToggleAvailability = (questionId, status, hint) => (
    updateQuestionAvailability({
      hint,
      questionId,
      isActive: status === SCANNING_STATUSES.disabled,
      courseId,
    })
  );

  const transformedRowData = ({
    Id: id, content, hint, state, status,
  }) => ({
    id, content, hint, state, status,
  });

  const renderTableCell = (row, key, uuid) => {
    const getCellContent = () => {
      switch (key) {
        case 'hint':
          return (
            <HintTextField
              id={`field-${uuid}`}
              defaultValue={row[key]}
              sectionId={uuid}
              status={row.status !== SCANNING_STATUSES.disabled}
            />
          );
        case 'content':
          return <OverflowTip value={row[key]} content={row[key]} />;
        default:
          return <span className={cellClassName(key, row[key])}>{row[key]}</span>;
      }
    };

    return (
      <TableCell
        key={`field-${uuid}-${key}`}
        className={`SortableTableCell SortableTableCell_${key}`}
      >
        {getCellContent()}
      </TableCell>
    );
  };

  return (
    <>
      <TableRow className="SortableTableHeadingRow">
        <TableCell colSpan={6}>
          {block.context}
        </TableCell>
      </TableRow>
      {block.restrictedQuestions.map((row) => (
        <TableRow
          hover={!isAvailabilityUpdating}
          className={rowClassName(row)}
          key={row.context}
        >
          {Object.keys(transformedRowData(row))
            .map((key) => renderTableCell(transformedRowData(row), key, row.uuid))}
          <TableCell>
            <TableActions
              allowMultiActions={false}
              handleToggleAvailability={() => handleToggleAvailability(row.uuid, row.status, row.hint)}
              isDisabled={isAvailabilityUpdating}
              isAvailable={row.status === SCANNING_STATUSES.disabled}
            />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

SortableTableRow.propTypes = {
  row: PropTypes.shape({
    context: PropTypes.string.isRequired,
    restrictedQuestions: PropTypes.arrayOf(PropTypes.shape({
      uuid: PropTypes.string,
      content: PropTypes.string,
      hint: PropTypes.string,
      state: PropTypes.string,
      status: PropTypes.string,
    })).isRequired,
  }).isRequired,
};
