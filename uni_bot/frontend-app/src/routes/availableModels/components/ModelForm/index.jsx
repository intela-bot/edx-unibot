import { useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { TextField, CircularProgress } from '@mui/material';

import { useFetchModelQuery } from '@api/modelsSlice';
import { useAppData } from '@context/app';


export default function ModelForm({
  modelId, modelName, formState, updateFormState,
}) {
  const { appData: { courseId } } = useAppData();
  const { data: modelData, isLoading } = useFetchModelQuery({ courseId, modelId });
  const { formError, formData, requiredFields: savedRequiredFields } = formState;

  const requiredFields = useMemo(() => modelData?.fields[modelName]?.requiredFields || [], [modelData, modelName]);

  const handleInputChange = useCallback((event) => {
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;

    updateFormState({ formData: { ...formData, [modelName]: { ...formData[modelName], [name]: value } } });
  }, [formData, modelName, updateFormState]);

  useEffect(() => {
    if (requiredFields.length && savedRequiredFields.length !== requiredFields.length) {
      updateFormState({ requiredFields });
    }
  }, [requiredFields, updateFormState, savedRequiredFields.length]);

  if (isLoading) {
    return (
      <div className="ConfirmationModalForm loading">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="ConfirmationModalForm">
      {formError && (
        <div className="ConfirmationModalFormError">{formError}</div>
      )}
      {requiredFields && requiredFields.map((field) => (
        <TextField
          required
          key={field.value}
          id={field.value}
          name={field.value}
          label={field.label}
          className="ConfirmationModalFormField"
          onChange={handleInputChange}
        />
      ))}
    </div>
  );
}

ModelForm.propTypes = {
  modelId: PropTypes.string.isRequired,
  modelName: PropTypes.string.isRequired,
  formState: PropTypes.shape({
    formError: PropTypes.string,
    formData: PropTypes.shape({
      use_personal: PropTypes.bool.isRequired,
      ...PropTypes.objectOf(PropTypes.string).isRequired,
    }).isRequired,
    requiredFields: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.string,
      name: PropTypes.string,
    })),
  }).isRequired,
  updateFormState: PropTypes.func.isRequired,
};
