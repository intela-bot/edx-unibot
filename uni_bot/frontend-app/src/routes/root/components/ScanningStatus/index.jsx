import { useState } from 'react';
import { Link } from 'react-router-dom';

import { ROUTES } from '@/routes/constants';
import { useFetchBotStatusesQuery } from '@api/botStatusesSlice';
import { CloseIcon } from '@assets/icons';
import { useAppData } from '@context/app';


export default function ScanningStatus() {
  const [isOpen, setIsOpen] = useState(true);

  const { appData: { courseId } } = useAppData();
  const { data: botStatuses } = useFetchBotStatusesQuery(courseId);

  if (isOpen && botStatuses?.isOutdated) {
    return (
      <div className="ScanningStatus">
        <div>
          <span>Your course content has been updated. Please </span>
          <Link
            className="ScanningStatus__link"
            key={ROUTES.scanCourse}
            to={ROUTES.scanCourse}
          >
            rescan your course
          </Link>
          .
        </div>
        <button
          className="Message__close-btn"
          onClick={() => setIsOpen(false)}
          type="button"
          aria-label="Collapse block"
        >
          <CloseIcon />
        </button>
      </div>
    );
  }

  return null;
}
