import { createHashRouter } from 'react-router-dom';

import {
  AdditionalContent,
  AvailableModels,
  Dashboard,
  Introduction,
  NotFoundPage,
  RestrictedQuestions,
  Root,
  ScanCourse,
  Settings,
} from '@routes';
import { ROUTES } from './routes/constants';


const router = createHashRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: ROUTES.introduction,
        element: <Introduction />,
      },
      {
        path: ROUTES.settings,
        element: <Settings />,
      },
      {
        path: ROUTES.availableModels,
        element: <AvailableModels />,
      },
      {
        path: ROUTES.scanCourse,
        element: <ScanCourse />,
      },
      {
        path: ROUTES.restrictedQuestions,
        element: <RestrictedQuestions />,
      },
      {
        path: ROUTES.additionalContent,
        element: <AdditionalContent />,
      },
      {
        path: ROUTES.dashboard,
        element: <Dashboard />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export default router;
