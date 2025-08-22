import { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import {
  Button, Dialog, DialogTitle, DialogContent,
  DialogActions, Checkbox, FormControlLabel, Typography, Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Info as InfoIcon } from '@mui/icons-material';

import { useAppData } from '@context/app';
import { useUpdateSelectedModelMutation } from '@api/modelsSlice';
import ModelForm from '../ModelForm';


const BlurryDialog = styled(Dialog)(() => ({
  backdropFilter: 'blur(5px)',
  background: 'rgba(57, 101, 255, 0.1)',
}));

export default function ConfirmationModal({ isOpen, onClose, modalData }) {
  const defaultFormState = useMemo(() => ({
    formData: { use_personal: false }, formError: '', requiredFields: [],
  }), []);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formState, setFormState] = useState(defaultFormState);
  const [isLoadingModel, setIsLoadingModel] = useState(false);
  const { appData: { courseId } } = useAppData();
  const [updateSelectedModel, { isLoading: isLoadingModelUpdate }] = useUpdateSelectedModelMutation();

  const { formData, requiredFields } = formState;
  const {
    name, value: id, model, message, mutable,
  } = modalData ?? {};

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
    const filledData = formData.credentials ?? {};
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

  const isFormInvalid = mutable && (!isFormOpen || !isFormValid());
  const isSubmitDisabled = isLoadingModelUpdate || isLoadingModel || isFormInvalid;

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
        {message ? (
          <Alert
            severity="info"
            icon={<InfoIcon fontSize="inherit" />}
          >
            {message}
          </Alert>
        ) : (
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
        )}
        {isFormOpen && (
          <ModelForm
            modelId={id}
            modelName={model}
            formState={formState}
            updateFormState={updateFormState}
            setIsLoadingModel={setIsLoadingModel}
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
          disabled={isSubmitDisabled}
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
  modalData: PropTypes.shape({
    model: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    credentials: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    mutable: PropTypes.bool.isRequired,
  }).isRequired,
};
