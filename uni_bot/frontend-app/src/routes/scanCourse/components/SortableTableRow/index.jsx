import PropTypes from 'prop-types';
import classNames from 'classnames';
import { TableCell, TableRow } from '@mui/material';

import { useUpdateCourseSectionMutation } from '@api/courseContentSlice';
import { TableActions } from '@components';
import { SCANNING_STATUSES } from '@routes/constants';
import { useAppData } from '@context/app';
import { toKebabCase } from '@/utils';


export default function SortableTableRow({ row }) {
  const [updateSectionAvailability, { isLoading: isAvailabilityUpdating }] = useUpdateCourseSectionMutation();
  const { appData: { courseId } } = useAppData();

  const rowClassName = classNames('SortableTableRow', {
    [`SortableTableRow_${toKebabCase(row.status)}`]: Object.getOwnPropertyDescriptor(row, 'status').value,
  });

  const cellClassName = (key, value) => (
    key === 'status' ? `status_${toKebabCase(value)}` : null
  );

  const handleToggleAvailability = () => (
    updateSectionAvailability({
      courseId,
      sectionId: row.sectionId,
      isActive: row.status === SCANNING_STATUSES.disabled,
    })
  );

  return (
    <TableRow hover className={rowClassName}>
      {Object.keys(row).map((key) => (
        (key === 'sectionId') ? null : (
          <TableCell
            key={key}
            className={`SortableTableCell SortableTableCell_${key}`}
            sx={{ width: key === 'status' ? '200px' : 'auto' }}
          >
            <span className={cellClassName(key, row[key])}>
              {row[key]}
            </span>
          </TableCell>
        )
      ))}
      <TableCell sx={{ width: '60px' }}>
        <TableActions
          allowMultiActions={false}
          isDisabled={isAvailabilityUpdating}
          handleToggleAvailability={handleToggleAvailability}
          isAvailable={row.status === SCANNING_STATUSES.disabled}
        />
      </TableCell>
    </TableRow>
  );
}

SortableTableRow.propTypes = {
  row: PropTypes.shape({
    sectionId: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
};
