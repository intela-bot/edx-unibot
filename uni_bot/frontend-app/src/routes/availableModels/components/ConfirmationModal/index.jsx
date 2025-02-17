import { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import {
  Button, Dialog, DialogTitle, DialogContent,
  DialogActions, Checkbox, FormControlLabel, Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import { useAppData } from '@context/app';
import { useUpdateSelectedModelMutation } from '@api/modelsSlice';
import ModelForm from '../ModelForm';


const BlurryDialog = styled(Dialog)(() => ({
  backdropFilter: 'blur(5px)',
  background: 'rgba(57, 101, 255, 0.1)',
}));

export default function ConfirmationModal({
  isOpen, onClose, name, id, model, availableCredentials,
}) {
  const defaultFormState = useMemo(() => ({
    formData: { use_personal: false }, formError: '', requiredFields: [],
  }), []);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formState, setFormState] = useState(defaultFormState);
  const { appData: { courseId } } = useAppData();
  const [updateSelectedModel, { isLoading: isLoadingModelUpdate }] = useUpdateSelectedModelMutation();

  const { formData, requiredFields } = formState;

  const getSubmitBtnText = () => {
    switch (true) {
      case isLoadingModelUpdate:
        return 'Saving...';
      case isFormOpen:
        return 'Save and activate';
      default:
        return 'Activate';
    }
  };

  const updateFormState = useCallback(
    (newData) => setFormState({ ...formState, ...newData }),
    [formState],
  );

  const isFormValid = () => {
    const filledData = formData[model] ?? {};
    const allFieldNotEmpty = Object.values(filledData).every(value => value.trim());
    const allFieldAreFilled = Object.values(filledData).length === Object.values(requiredFields).length;

    return !formData.use_personal || (allFieldNotEmpty && allFieldAreFilled);
  };

  const handleToggleForm = () => {
    setIsFormOpen((prevState) => !prevState);
    updateFormState({ formData: { use_personal: !isFormOpen } });
  };

  const resetFormState = () => {
    setFormState(defaultFormState);
    setIsFormOpen(false);
  };

  const handleModalSubmit = useCallback(async () => {
    try {
      updateFormState({ formError: '' });
      await updateSelectedModel({ courseId, id, body: formData }).unwrap();
      onClose();
      toast.success('Preset updating started successfully');
    } catch (error) {
      const defaultErrorMsg = 'Preset updating failed';
      let errorMsg = error?.data?.msg;
      const errorDescription = error?.data?.vendors[model]?.msg;
      if (errorDescription) {
        errorMsg = errorMsg.concat(`: ${errorDescription}`);
      }
      updateFormState({ formError: errorMsg || defaultErrorMsg });
      toast.error(errorMsg, error);
    }
  }, [courseId, formData, model, updateSelectedModel, id, onClose, updateFormState]);

  const requiredCustomCredentials = !availableCredentials && !isFormOpen;
  const isReadyForSubmit = isLoadingModelUpdate || !isFormValid() || requiredCustomCredentials;

  return (
    <BlurryDialog
      fullWidth
      onClose={onClose}
      open={isOpen}
      maxWidth="xs"
      className="ConfirmationModal"
      TransitionProps={{
        onExited: resetFormState,
      }}
    >
      <DialogTitle>
        <Typography variant="h4">
          Preset: {name}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <FormControlLabel
          control={(
            <Checkbox
              name="use_personal"
              checked={isFormOpen}
              onChange={handleToggleForm}
            />
          )}
          label="Use personal settings"
        />

        {isFormOpen && (
          <ModelForm
            modelId={id}
            modelName={model}
            formState={formState}
            updateFormState={updateFormState}
          />
        )}
      </DialogContent>
      <DialogActions className="ConfirmationModalActions">
        <Button
          variant="outlined"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleModalSubmit}
          disabled={isReadyForSubmit}
        >
          {getSubmitBtnText()}
        </Button>
      </DialogActions>
    </BlurryDialog>
  );
}

ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  model: PropTypes.string.isRequired,
  availableCredentials: PropTypes.bool.isRequired,
};
