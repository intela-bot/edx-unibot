import { useEffect, useCallback } from 'react';
import { Button, Alert } from '@mui/material';
import { Sync as SyncIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';

import {
  useFetchCourseContentQuery,
  useUpdateCourseContentMutation,
  useDynamicPingCourseContentMutation,
} from '@api/courseContentSlice';
import {
  EmptyBlock, ErrorBlock, PreloaderBlock, SortableTable, CompleteProgress,
} from '@components';
import { useAppData } from '@context/app';
import SortableTableRow from './components/SortableTableRow';


export default function ScanCourse() {
  const { appData: { courseId, isCourseDataPulling }, updateAppData } = useAppData();
  const {
    data: courseData, isLoading, isFetching, isError, status,
  } = useFetchCourseContentQuery(courseId);
  const [updateCourseContent, { isLoading: isLoadingUpdateRequested }] = useUpdateCourseContentMutation();
  const [dynamicUpdateCourseContent, { isLoading: isLoadingCourseUpdating }] = useDynamicPingCourseContentMutation();
  const isDisplayUpdatingAlert = isCourseDataPulling || isLoadingCourseUpdating;

  const headCells = [
    { id: 'name', label: 'Training name', isSortable: true },
    { id: 'status', label: 'Status', isSortable: true },
    { id: 'action', label: null, isSortable: false },
  ];

  const handleUpdateCourseData = useCallback(async (skipUpdateInit) => {
    try {
      if (!skipUpdateInit) {
        await updateCourseContent(courseId).unwrap();
        toast.success('Course scan started successfully');
      }
      await dynamicUpdateCourseContent({ courseId }).unwrap();
      toast.success('Course scanning completed successfully');
    } catch (error) {
      toast.error('Course scan failed');
    }
  }, [courseId, updateCourseContent, dynamicUpdateCourseContent]);

  useEffect(() => {
    const { progress = 0, contexts = [] } = courseData || {};
    const isProgressNotComplete = courseData && progress !== 1;
    const isNoContexts = courseData && !contexts.length;

    if (!isProgressNotComplete && isCourseDataPulling) {
      updateAppData({ isCourseDataPulling: false });
    }

    // Continue updating data if the page has been reloaded and the data is being processed
    if (!isCourseDataPulling && isProgressNotComplete && !isLoadingCourseUpdating && !isNoContexts) {
      updateAppData({ isCourseDataPulling: true });
      handleUpdateCourseData(true);
    }
  }, [courseData, isLoadingCourseUpdating, handleUpdateCourseData, isCourseDataPulling, updateAppData]);

  const getContent = () => {
    const isLoadingData = isLoading || isFetching || status === 'pending';
    switch (true) {
      case isLoadingData:
        return <PreloaderBlock />;
      case isError:
        return <ErrorBlock />;
      case !courseData?.contexts:
        return <EmptyBlock />;
      default:
        return (
          <SortableTable
            excludeOrder
            useCourseScanActions
            rows={courseData?.contexts}
            headCells={headCells}
          >
            <SortableTableRow row={{}} />
          </SortableTable>
        );
    }
  };

  return (
    <div className="ScanCourseContent">
      <div className="ScanCourseContent__top-bar">
        <Button
          variant="contained"
          size="large"
          onClick={() => handleUpdateCourseData(false)}
          disabled={isLoadingUpdateRequested}
        >
          Scan My Course
        </Button>
        <CompleteProgress progress={courseData?.progress || 0} />
      </div>
      {isDisplayUpdatingAlert && (
        <Alert
          severity="info"
          icon={<SyncIcon fontSize="inherit" />}
          sx={{ marginBottom: '20px' }}
        >
          Course data is scanning...
        </Alert>
      )}
      {getContent()}
    </div>
  );
}
