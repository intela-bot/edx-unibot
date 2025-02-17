import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { Box, Typography } from '@mui/material';
import { toast } from 'react-toastify';

import { useWidgetParams } from '@context/widget';
import { useSaveWidgetSettingsMutation } from '@api/settingsSlice';
import { CustomMultiValue, CustomOption } from './components';


export default function LanguagesSection({ courseId }) {
  const [languageOptions, setLanguageOptions] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const { widgetParams, updateWidgetParams } = useWidgetParams();
  const [saveWidgetSettings] = useSaveWidgetSettingsMutation();

  useEffect(() => {
    setLanguageOptions(widgetParams.languages.available.map(language => ({
      ...language, icon: language.value,
    })));
    setSelectedLanguages(widgetParams.languages.selected.map(language => ({
      ...language, icon: language.value,
    })));
  }, [widgetParams.languages.available, widgetParams.languages.selected]);

  const handleLanguageChange = (selected) => {
    setSelectedLanguages(selected);

    if (!selected.length) {
      return;
    }

    updateWidgetParams({
      ...widgetParams,
      languages: {
        available: widgetParams.languages.available,
        selected: selected.map(lang => ({ value: lang.value, label: lang.label })),
      },
    });

    try {
      saveWidgetSettings({
        courseId,
        widget: widgetParams.widget,
        languages: selected.map(lang => ({ value: lang.value, label: lang.label })),
      });
      toast.success('Language settings successfully saved');
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Error saving widget settings for languages:', e);
      toast.error('There was an error saving your language settings. Please try again later.');
    }
  };

  return (
    <Box className="LanguagesSection">
      <Typography variant="caption" display="block" gutterBottom>
        Languages
      </Typography>
      <Select
        className="LanguagesSection__select"
        classNamePrefix="LanguagesSection"
        isMulti
        options={languageOptions}
        components={{ MultiValue: CustomMultiValue, Option: CustomOption }}
        placeholder="Select languages"
        value={selectedLanguages}
        onChange={handleLanguageChange}
      />
      {!selectedLanguages.length && (
      <Typography className="LanguagesSection__select-error" variant="caption">
        This field is required.
      </Typography>
      )}
    </Box>
  );
}

LanguagesSection.propTypes = {
  courseId: PropTypes.string.isRequired,
};
