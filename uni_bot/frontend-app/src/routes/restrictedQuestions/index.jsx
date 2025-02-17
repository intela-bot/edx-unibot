import { FormControlLabel, Checkbox, Button } from '@mui/material';

import {
  useFetchRestrictedQuestionsQuery,
  useRestrictQuestionsMutation,
} from '@api/restrictedQuestionsSlice';
import { PlusIcon } from '@assets/icons';
import {
  EmptyBlock, ErrorBlock, PreloaderBlock, SortableTable,
} from '@components';
import { useAppData } from '@context/app';
import { SortableTableRow } from './components';


export default function RestrictedQuestions() {
  const { appData: { courseId } } = useAppData();
  const {
    data: questionsData, isLoading, isFetching, isError, status,
  } = useFetchRestrictedQuestionsQuery(courseId);
  const [restrictQuestions, { isLoading: isLoadingRestrictQuestions }] = useRestrictQuestionsMutation();

  const handleRestrictQuestions = (restrictGraded, restrictNonGraded) => (
    restrictQuestions({
      restrictGraded,
      restrictNonGraded,
      courseId,
    })
  );

  const headCells = [
    { id: 'uuid', label: '№', isSortable: false },
    { id: 'context', label: 'Restricted question', isSortable: true },
    { id: 'hint', label: 'Link to hint', isSortable: false },
    { id: 'state', label: 'State', isSortable: false },
    { id: 'status', label: 'Status', isSortable: false },
    { id: 'action', label: null, isSortable: false },
  ];

  const getContent = () => {
    const isLoadingData = isLoading || isFetching || status === 'pending';
    switch (true) {
      case isLoadingData:
        return <PreloaderBlock />;
      case isError:
        return <ErrorBlock />;
      case !questionsData?.questions.length:
        return <EmptyBlock />;
      default:
        return (
          <SortableTable
            useCourseScanActions
            rows={questionsData?.questions || []}
            headCells={headCells}
          >
            <SortableTableRow row={{}} />
          </SortableTable>
        );
    }
  };

  return (
    <div className="RestrictedQuestionsContent">
      <div className="RestrictedQuestions__top-bar">
        <Button
          disabled
          variant="outlined"
          startIcon={<PlusIcon />}
          className="RestrictedQuestions__add-new-btn"
        >
          Add New
        </Button>
        <FormControlLabel
          checked={!!questionsData && questionsData.restrictGraded}
          disabled={isLoadingRestrictQuestions}
          onClick={() => handleRestrictQuestions(!questionsData?.restrictGraded, questionsData?.restrictNonGraded)}
          control={<Checkbox />}
          label="Restrict answers for graded questions"
        />
        <FormControlLabel
          checked={!!questionsData && questionsData.restrictNonGraded}
          disabled={isLoadingRestrictQuestions}
          onClick={() => handleRestrictQuestions(questionsData?.restrictGraded, !questionsData?.restrictNonGraded)}
          control={<Checkbox />}
          label="Restrict answers for non-graded questions"
        />
      </div>
      {getContent()}
    </div>
  );
}
