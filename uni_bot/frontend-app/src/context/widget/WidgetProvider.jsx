import PropTypes from 'prop-types';
import {
  createContext, useContext, useState, useMemo, useCallback,
} from 'react';
import { defaultParams } from './constants';


const WidgetContext = createContext(defaultParams);

export const useWidgetParams = () => useContext(WidgetContext);

export function WidgetProvider({ children }) {
  const [widgetParams, setWidgetParams] = useState(defaultParams);

  const updateWidgetParams = useCallback((key, value) => {
    setWidgetParams((prevParams) => {
      if (typeof key === 'string') {
        return { ...prevParams, [key]: value };
      }
      if (typeof key === 'object') {
        return { ...prevParams, ...key };
      }
      return prevParams;
    });
  }, []);

  const value = useMemo(() => ({
    widgetParams, updateWidgetParams,
  }), [widgetParams, updateWidgetParams]);

  return (
    <WidgetContext.Provider value={value}>
      {children}
    </WidgetContext.Provider>
  );
}

WidgetProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
