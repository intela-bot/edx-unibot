import classNames from 'classnames';
import { toast } from 'react-toastify';

import { useFetchBotStatusesQuery, useUpdateBotStatusesMutation } from '@api/botStatusesSlice';
import { useAppData } from '@context/app';
import { BOT_STATUSES } from '@routes/constants';


export default function ActivationSwitcher() {
  const { appData: { courseId } } = useAppData();
  const {
    data: botStatuses, isLoading, isFetching, status,
  } = useFetchBotStatusesQuery(courseId);
  const [updateBotStatuses, { isLoading: isUpdating }] = useUpdateBotStatusesMutation();

  const isDeactivated = (
    botStatuses
      ? botStatuses.botStatus === BOT_STATUSES.deactivated
      : true
  );
  const isLoadingData = isLoading || isFetching || status === 'pending';
  const canBeSwitched = !(isLoadingData || isUpdating || isDeactivated);
  const isOn = !(isLoadingData || botStatuses?.isDisabled || isDeactivated);

  const handleUpdateBotStatuses = async () => {
    try {
      const updatedStatuses = await updateBotStatuses({ courseId, isDisabled: isOn }).unwrap();
      const message = (
        updatedStatuses.isDisabled
          ? 'The bot is successfully deactivated.'
          : 'The bot is successfully activated.'
      );
      toast.success(message);
    } catch (error) {
      toast.error('The bot activation status change is failed.');
    }
  };

  return (
    <div className={classNames('ActivationSwitcher', { isOn, canBeSwitched })}>
      <input
        type="checkbox"
        id="activation-switcher"
        className="sr-only"
        onChange={handleUpdateBotStatuses}
        checked={isOn}
        disabled={!canBeSwitched}
      />
      <label
        htmlFor="activation-switcher"
        className="ActivationSwitcher__text"
      >
        <span className="ActivationSwitcher__indicator" />
        Activate TA
      </label>
    </div>
  );
}
