import PropTypes from 'prop-types';
import {
  createContext, useContext, useState, useMemo, useCallback,
} from 'react';
import assistantAvatar from '@assets/images/assistant-avatar.png';


const AppContext = createContext({
  courseId: null,
  avatar: assistantAvatar,
  isCourseDataPulling: false,
  isAdditionalDataPulling: false,
});

export const useAppData = () => useContext(AppContext);

export function AppProvider({ children }) {
  const [appData, setAppData] = useState('');

  const updateAppData = useCallback((newParams) => {
    setAppData((prevParams) => ({
      ...prevParams,
      ...newParams,
    }));
  }, []);

  const value = useMemo(() => ({
    appData,
    updateAppData,
  }), [appData, updateAppData]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
