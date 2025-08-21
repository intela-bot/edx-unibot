import { useCallback, useState } from 'react';
import { Button } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { toast } from 'react-toastify';

import { useAppData } from '@context/app';
import { useResetSettingsMutation } from '@api/settingsSlice';
import ConfirmationModal from './ConfirmationModal';


function ResetSettings() {
  const { appData: { courseId } } = useAppData();
  const [resetSettings, { isLoading }] = useResetSettingsMutation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = () => setIsDialogOpen(true);

  const handleCloseDialog = () => setIsDialogOpen(false);

  const handleClickConfirm = useCallback(async () => {
    try {
      await resetSettings(courseId).unwrap();
      toast.success('Settings reset successfully');
    } catch (error) {
      toast.error('Reset settings failed');
    }
    handleCloseDialog();
  }, [courseId, resetSettings]);

  return (
    <>
      <Button
        variant="muted-danger"
        size="medium"
        onClick={handleOpenDialog}
        className="ResetButton"
        startIcon={<Refresh />}
        disabled={isLoading}
      >
        Reset Settings
      </Button>
      <ConfirmationModal
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleClickConfirm}
      />
    </>
  );
}

export default ResetSettings;
