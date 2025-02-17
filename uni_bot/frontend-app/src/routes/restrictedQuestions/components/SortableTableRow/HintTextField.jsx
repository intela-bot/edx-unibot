import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { TextField } from '@mui/material';

import { useUpdateRestrictedQuestionItemMutation } from '@api/restrictedQuestionsSlice';
import { useAppData } from '@context/app';


export default function HintTextField({
  id, defaultValue, sectionId, status,
}) {
  const [value, setValue] = useState(defaultValue);
  const { appData: { courseId } } = useAppData();
  const [updateQuestionAvailability, { isLoading }] = useUpdateRestrictedQuestionItemMutation();

  const handleInputChange = useCallback(({ target }) => setValue(target.value), []);

  const handleHintUpdate = useCallback(async (questionId, isActive) => {
    if (defaultValue === value) {
      return;
    }

    try {
      await updateQuestionAvailability({
        courseId,
        questionId,
        isActive,
        hint: value,
      }).unwrap();
      toast.success('Section update completed successfully');
    } catch (error) {
      toast.error('Section update failed');
    }
  }, [defaultValue, value, courseId, updateQuestionAvailability]);

  const handleHintKeyPress = useCallback(async (event, questionId, isActive) => {
    if (event.key === 'Enter') {
      await handleHintUpdate(questionId, isActive);
    }
  }, [handleHintUpdate]);

  return (
    <TextField
      id={id}
      variant="outlined"
      type="text"
      value={value}
      disabled={isLoading}
      onChange={handleInputChange}
      onBlur={() => handleHintUpdate(sectionId, status)}
      onKeyDown={(e) => handleHintKeyPress(e, sectionId, status)}
    />
  );
}

HintTextField.propTypes = {
  id: PropTypes.string.isRequired,
  defaultValue: PropTypes.string.isRequired,
  sectionId: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
};
