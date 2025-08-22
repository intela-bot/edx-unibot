import classNames from 'classnames';
import { Link, useLocation } from 'react-router-dom';

import { ROUTES } from '@/routes/constants';

import {
  CommentIcon, SettingsIcon, BuildCircleIcon,
  ContactSupportIcon, LanguageIcon, BallotIcon, SettingsApplicationsIcon,
} from '@assets/icons';


export default function NavigationTabs() {
  const location = useLocation();
  const isActiveLink = (route) => location.pathname.includes(route);

  const NavigationList = [
    {
      route: ROUTES.introduction,
      icon: <CommentIcon />,
      label: 'Introduction',
    },
    {
      route: ROUTES.settings,
      icon: <SettingsIcon />,
      label: 'Settings',
    },
    {
      route: ROUTES.availableModels,
      icon: <SettingsApplicationsIcon />,
      label: 'Available Models',
    },
    {
      route: ROUTES.scanCourse,
      icon: <BuildCircleIcon />,
      label: 'Scan My Course',
    },
    {
      route: ROUTES.restrictedQuestions,
      icon: <ContactSupportIcon />,
      label: 'Restricted Questions',
    },
    {
      route: ROUTES.additionalContent,
      icon: <LanguageIcon />,
      label: 'Additional Content',
    },
    {
      route: ROUTES.dashboard,
      icon: <BallotIcon />,
      label: 'TA Dashboard',
    },
  ];

  return (
    <nav className="Navigation">
      {NavigationList.map((link) => (
        <Link
          key={link.route}
          to={link.route}
          className={classNames('Navigation__link', { active: isActiveLink(link.route) })}
        >
          {link.icon}
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
