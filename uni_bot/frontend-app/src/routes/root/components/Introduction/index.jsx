import { useState } from 'react';
import classNames from 'classnames';
import { Avatar } from '@mui/material';

import { useFetchBotStatusesQuery } from '@api/botStatusesSlice';
import { CloseIcon } from '@assets/icons';
import { useAppData } from '@context/app';
import { BOT_STATUSES } from '@routes/constants';


export default function Introduction() {
  const [isOpen, setIsOpen] = useState(true);

  const { appData: { avatar, courseId } } = useAppData();
  const { data: botStatuses, isError } = useFetchBotStatusesQuery(courseId);

  const botStatus = (
    isError || !botStatuses?.botStatus || !Object.values(BOT_STATUSES).includes(botStatuses?.botStatus)
      ? null
      : botStatuses.botStatus
  );

  const getActivationStatusMessage = () => {
    switch (botStatus) {
      case BOT_STATUSES.active:
        return <span>I&apos;m <strong>active</strong> and ready to help your students.</span>;
      case BOT_STATUSES.deactivated:
        return <span>I&apos;m <strong>not active</strong> now, please set up and activate me.</span>;
      case BOT_STATUSES.inTraining:
        return <span>Well done! I&apos;m <strong>ready for activation</strong>.</span>;
      default:
        return <span>My <strong>activation status in unknown</strong>.</span>;
    }
  };

  return (
    <div className={classNames('Introduction', { collapsed: !isOpen })}>
      <button
        type="button"
        aria-label="Toggle block"
        className="Introduction__avatar-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Avatar
          className="Introduction__img"
          alt="AI-powered Teaching Assistan"
          src={avatar}
          height={46}
          width={46}
        />
        <span
          className={
            classNames(
              'Introduction__status',
              {
                active: botStatus === BOT_STATUSES.active,
                deactivated: botStatus === BOT_STATUSES.deactivated,
                inTraining: botStatus === BOT_STATUSES.inTraining,
                unknown: botStatus === null,
              },
            )
          }
        />
      </button>
      {isOpen && (
        <>
          <p className="Introduction__text">
            Hello, I am an AI-powered Teaching Assistant (TA) for your course.&nbsp;
            {getActivationStatusMessage()}
          </p>
          <button
            className="Message__close-btn"
            onClick={() => setIsOpen(false)}
            type="button"
            aria-label="Collapse block"
          >
            <CloseIcon />
          </button>
        </>
      )}
    </div>
  );
}
