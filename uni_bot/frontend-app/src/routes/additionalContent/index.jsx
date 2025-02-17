import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Alert, Button } from '@mui/material';
import { Sync as SyncIcon } from '@mui/icons-material';

import { getCsrfToken } from '@api/utils';
import { PlusIcon } from '@assets/icons';
import {
  CompleteProgress, ErrorBlock, PreloaderBlock, SortableTable,
} from '@components';
import { useAppData } from '@context/app';
import {
  useDynamicPingAdditionalContentMutation,
  useFetchAdditionalContentQuery,
} from '@api/additionalContentSlice';
import { DraggableContent, SortableTableRow } from './components';


const ACCEPTED_FILE_EXTENSIONS = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'text/html': ['.html'],
  'text/markdown': ['.md'],
  'text/plain': ['.txt'],
};

export default function AdditionalContent() {
  const { appData: { courseId, isAdditionalDataPulling }, updateAppData } = useAppData();
  const [isUploadDisabled, setUploadDisabled] = useState(false);
  const {
    data: contentData, isLoading, isFetching, isError, status,
  } = useFetchAdditionalContentQuery(courseId);
  const [
    dynamicUpdateAdditionalContent, { isLoading: isLoadingContentUpdating },
  ] = useDynamicPingAdditionalContentMutation();

  const isLoadingData = isLoading || isFetching || status === 'pending';
  const acceptString = Object.values(ACCEPTED_FILE_EXTENSIONS).flat().join(',');
  const headCells = [
    { id: 'name', label: 'Training name', isSortable: true },
    { id: 'status', label: 'Status', isSortable: true },
    { id: 'action', label: null, isSortable: false },
  ];
  const contentIsAvailable = !isLoadingData && !isError && !!contentData?.contexts.length;
  const isDisplayUpdatingAlert = isAdditionalDataPulling || isLoadingContentUpdating;

  const updateAdditionalContent = useCallback(async (files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('file', file);
    });

    await fetch(`/uni_bot/api/additional_content/${courseId}/`, {
      method: 'POST',
      body: formData,
      headers: { 'X-CSRFToken': getCsrfToken() },
    });
  }, [courseId]);

  const handleUpdateContentData = useCallback(async (skipUpdateInit, files) => {
    try {
      if (!skipUpdateInit) {
        setUploadDisabled(true);
        await updateAdditionalContent(files);
        setUploadDisabled(false);
        toast.success('Content uploading started successfully');
      }
      await dynamicUpdateAdditionalContent({ courseId }).unwrap();
      toast.success('Content uploading completed successfully');
    } catch (error) {
      toast.error('Content uploading failed');
    }
  }, [courseId, updateAdditionalContent, dynamicUpdateAdditionalContent]);

  const handleFileChange = (e) => {
    if ([...e.target.files].length) {
      handleUpdateContentData(false, [...e.target.files]);
    }
  };

  useEffect(() => {
    const { progress = 0, contexts = [] } = contentData || {};
    const isProgressNotComplete = contentData && progress !== 1;
    const isNoContexts = contentData && !contexts.length;

    if (!isProgressNotComplete && isAdditionalDataPulling) {
      updateAppData({ isAdditionalDataPulling: false });
    }

    // Continue updating data if the page has been reloaded and the data is being processed
    if (!isAdditionalDataPulling && isProgressNotComplete && !isLoadingContentUpdating && !isNoContexts) {
      updateAppData({ isAdditionalDataPulling: true });
      handleUpdateContentData(true);
    }
  }, [contentData, isLoadingContentUpdating, handleUpdateContentData, isAdditionalDataPulling, updateAppData]);

  const getContent = () => {
    switch (true) {
      case isLoadingData:
        return <PreloaderBlock />;
      case isError:
        return <ErrorBlock />;
      case !contentData?.contexts.length:
        return (
          <DraggableContent
            acceptedFiles={ACCEPTED_FILE_EXTENSIONS}
            handleUpdateContentData={handleUpdateContentData}
          />
        );
      default:
        return (
          <SortableTable
            excludeOrder
            rows={contentData?.contexts}
            headCells={headCells}
          >
            <SortableTableRow row={{}} />
          </SortableTable>
        );
    }
  };

  return (
    <div className="AdditionalContent">
      {contentIsAvailable && (
        <div className="AdditionalContent__top-bar">
          <input
            multiple
            accept={acceptString}
            style={{ display: 'none' }}
            id="upload-additional-files"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="upload-additional-files">
            <Button
              component="span"
              variant="outlined"
              size="large"
              startIcon={<PlusIcon />}
              disabled={isUploadDisabled}
            >
              Add Additional Content
            </Button>
          </label>
          <CompleteProgress progress={contentData?.progress || 0} />
        </div>
      )}
      {isDisplayUpdatingAlert && (
        <Alert
          severity="info"
          icon={<SyncIcon fontSize="inherit" />}
          sx={{ marginBottom: '20px' }}
        >
          Uploaded files is processing...
        </Alert>
      )}
      {getContent()}
    </div>
  );
}
