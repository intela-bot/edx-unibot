import { useState } from 'react';
import { useFetchModelsQuery } from '@api/modelsSlice';
import { useAppData } from '@context/app';
import {
  EmptyBlock, ErrorBlock, PreloaderBlock, SortableTable,
} from '@components';
import { ConfirmationModal, SortableTableRow } from './components';
import { CREDENTIAL_TYPES } from './constants';


export default function AvailableModels() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  const { appData: { courseId } } = useAppData();
  const {
    data: modelsData, isLoading, isFetching, isError, status,
  } = useFetchModelsQuery(courseId);

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleRowClick = (row) => {
    setModalOpen(true);
    setModalData(row);
  };

  const headCells = [
    { id: 'id', label: '№', isSortable: false },
    { id: 'models', label: 'Presets', isSortable: false },
    { id: 'credentials', label: 'Credentials', isSortable: false },
  ];

  const getContent = () => {
    const isLoadingData = isLoading || isFetching || status === 'pending';
    switch (true) {
      case isLoadingData:
        return <PreloaderBlock />;
      case isError:
        return <ErrorBlock />;
      case !modelsData.length:
        return <EmptyBlock />;
      default:
        return (
          <>
            <SortableTable
              rows={modelsData}
              headCells={headCells}
              markedRowKey="modelName"
              markedRowValue="selected"
              handleRowClick={handleRowClick}
            >
              <SortableTableRow row={{}} />
            </SortableTable>
            <ConfirmationModal
              isOpen={isModalOpen}
              onClose={handleModalClose}
              model={modalData.model}
              id={modalData.value}
              name={modalData.name}
              availableCredentials={modalData.credentials !== CREDENTIAL_TYPES.notSet}
            />
          </>
        );
    }
  };

  return (
    <div className="AvailableModelsContent">
      {getContent()}
    </div>
  );
}
