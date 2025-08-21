import classNames from 'classnames';
import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Alert, AlertTitle, Box, CircularProgress,
} from '@mui/material';

import { useFetchWidgetSettingsQuery } from '@api/settingsSlice';
import { useFetchBotStatusesQuery } from '@api/botStatusesSlice';
import { useWidgetParams } from '@context/widget';
import { useAppData } from '@context/app';
import { ROUTES } from '../constants';
import { getCourseIdFromPathname } from './utils';
import {
  ActivationSwitcher, Introduction, NavigationTabs, NavigationControls,
  ResetSettings, Widget,
} from './components';


export default function Root() {
  const courseId = getCourseIdFromPathname(window.location.pathname);
  const { data: botStatuses } = useFetchBotStatusesQuery(courseId);
  const location = useLocation();
  const navigate = useNavigate();
  const { updateAppData } = useAppData();
  const { updateWidgetParams } = useWidgetParams();
  const { aiAssistantStatus, aiAssistantMessage } = botStatuses ?? {};
  const isDisplayWidgetPreview = location.pathname !== `/${ROUTES.dashboard}`;

  useEffect(() => {
    if (courseId) {
      updateAppData({ courseId, avatar: `/uni_bot/api/ta_settings/${courseId}/avatar/` });
    }
  }, [courseId, updateAppData]);

  useEffect(() => {
    if (location.pathname === '/') {
      navigate(ROUTES.introduction);
    }
  }, [location.pathname, navigate]);

  const {
    data: widgetSettingsData,
    isSuccess: isSuccessWidgetSettings,
    isLoading: isLoadingWidgetSettings,
    isError: isErrorWidgetSettings,
    error: errorWidgetSettings,
  } = useFetchWidgetSettingsQuery(courseId);

  useEffect(() => {
    if (widgetSettingsData && isSuccessWidgetSettings) {
      updateWidgetParams(widgetSettingsData);
    }
  }, [isSuccessWidgetSettings, updateWidgetParams, widgetSettingsData]);

  if (isLoadingWidgetSettings) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (isErrorWidgetSettings) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Alert severity="error">
          <AlertTitle>{errorWidgetSettings.status}: {errorWidgetSettings.error}</AlertTitle>
          {errorWidgetSettings.data}
        </Alert>
      </Box>
    );
  }

  if (!aiAssistantStatus && aiAssistantMessage) {
    return (
      <Alert severity="warning">
        <AlertTitle>{aiAssistantMessage}</AlertTitle>
      </Alert>
    );
  }

  return (
    <div className="TabWrapper">
      <div className={classNames('TabContentWrapper', { expanded: !isDisplayWidgetPreview })}>
        <div className="HeaderTopWrapper">
          <Introduction />
          <ActivationSwitcher />
          <ResetSettings />
        </div>
        {/* Note: temporarily disabled scanning status indicator */}
        {/* <ScanningStatus /> */}
        <NavigationTabs />
        <Outlet />
        <NavigationControls />
      </div>
      {isDisplayWidgetPreview && <Widget />}
    </div>
  );
}
