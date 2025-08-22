import PropTypes from 'prop-types';
import { Button } from '@mui/material';

import {
  EmptyBlock, ErrorBlock, PreloaderBlock, SortableTable,
} from '@components';
import tableContent from '../../mock/feedbackTableContent.json';
import SortableTableRow from './SortableTableRow';


export default function Feedbacks({ onToggleShowFeedbacks }) {
  // TODO: replace it with dynamic data from the API
  const {
    data: feedbackData, isLoading, isFetching, isError, status, // eslint-disable-line no-unused-vars
  } = {};

  const headCells = [
    { id: 'startTime', label: 'Start tine', isSortable: true },
    { id: 'answers', label: 'Answers', isSortable: true },
    { id: 'rating', label: 'Rating', isSortable: true },
    { id: 'feedbacks', label: 'Feedbacks', isSortable: true },
    { id: 'endTime', label: null, isSortable: false },
  ];

  const getContent = () => {
    const isLoadingData = isLoading || isFetching || status === 'pending';
    switch (true) {
      case isLoadingData:
        return <PreloaderBlock />;
      case isError:
        return <ErrorBlock />;
      case !tableContent.length:
        return <EmptyBlock />;
      default:
        return (
          <SortableTable
            excludeOrder
            useCourseScanActions
            rows={tableContent}
            headCells={headCells}
          >
            <SortableTableRow row={{}} />
          </SortableTable>
        );
    }
  };

  return (
    <div className="Feedbacks">
      {getContent()}
      <Button
        variant="contained"
        className="Feedbacks__back-btn"
        onClick={() => onToggleShowFeedbacks(false)}
      >
        Back to Dashboard
      </Button>
    </div>
  );
}

Feedbacks.propTypes = {
  onToggleShowFeedbacks: PropTypes.func.isRequired,
};
