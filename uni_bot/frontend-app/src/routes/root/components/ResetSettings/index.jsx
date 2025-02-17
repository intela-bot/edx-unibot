import { useCallback } from 'react';
import { Button } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { toast } from 'react-toastify';

import { useAppData } from '@context/app';
import { useResetSettingsMutation } from '@api/settingsSlice';


function ResetSettings() {
  const { appData: { courseId } } = useAppData();
  const [resetSettings, { isLoading }] = useResetSettingsMutation();
  const onClickHandler = useCallback(async () => {
    try {
      await resetSettings(courseId).unwrap();
      toast.success('Settings reset successfully');
    } catch (error) {
      toast.error('Reset settings failed');
    }
  }, [courseId, resetSettings]);

  return (
    <Button
      variant="muted"
      size="medium"
      onClick={onClickHandler}
      className="ResetButton"
      startIcon={<Refresh />}
      disabled={isLoading}
    >
      Reset Settings
    </Button>
  );
}

export default ResetSettings;
