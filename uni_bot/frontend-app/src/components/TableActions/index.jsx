import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import {
  Button, MenuItem, Popper, Grow, Paper,
  ClickAwayListener, MenuList,
} from '@mui/material';

import { useDropdown } from '@hooks';
import {
  DotsMenuIcon, DisabledIcon, TrashIcon, EyeIcon,
} from '@assets/icons';


export default function CourseScanActions({
  allowMultiActions, allowDisableAction, allowDeleteAction,
  handleToggleAvailability, handleDeleteSection, isDisabled, isAvailable,
}) {
  const {
    open,
    anchorRef,
    handleToggle,
    handleClose,
    handleListKeyDown,
  } = useDropdown();

  const handleUpdateSectionVisibility = async (event) => {
    handleClose(event);
    try {
      await handleToggleAvailability().unwrap();
      toast.success('Section update completed successfully');
    } catch (error) {
      toast.error('Section update failed');
    }
  };

  return allowMultiActions ? (
    // TODO: This functionality saved to speed up the future development which will support deleting rows.
    // Need to implement accepting multiple action types and handlers from the props, it's disabled by default.
    <div>
      <Button
        ref={anchorRef}
        variant="text"
        size="small"
        onClick={handleToggle}
        className="RowAction__btn"
        id="composition-button"
        aria-controls={open ? 'composition-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup={open}
        disabled={isDisabled}
      >
        <DotsMenuIcon />
      </Button>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        className="RowAction__menu"
        placement="left-start"
        transition
        disablePortal
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id="composition-menu"
                  aria-labelledby="composition-button"
                  onKeyDown={handleListKeyDown}
                  className="RowAction__menu-list"
                >
                  {allowDisableAction && (
                    <MenuItem onClick={handleUpdateSectionVisibility}>
                      {isAvailable ? <EyeIcon /> : <DisabledIcon />}
                    </MenuItem>
                  )}
                  {allowDeleteAction && (
                    <MenuItem>
                      <TrashIcon />
                    </MenuItem>
                  )}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  ) : (
    <>
      {allowDisableAction && (
        <Button
          variant="text"
          size="small"
          onClick={handleUpdateSectionVisibility}
          className="RowAction__btn"
          id="composition-button"
          disabled={isDisabled}
        >
          {isAvailable ? <EyeIcon /> : <DisabledIcon />}
        </Button>
      )}
      {allowDeleteAction && (
        <Button
          variant="text"
          size="small"
          onClick={handleDeleteSection}
          className="RowAction__btn"
          id="composition-button"
          disabled={isDisabled}
        >
          <TrashIcon />
        </Button>
      )}
    </>
  );
}

CourseScanActions.defaultProps = {
  allowMultiActions: false,
  allowDisableAction: true,
  allowDeleteAction: false,
  handleToggleAvailability: () => {},
  handleDeleteSection: () => {},
};

CourseScanActions.propTypes = {
  allowMultiActions: PropTypes.bool,
  allowDisableAction: PropTypes.bool,
  allowDeleteAction: PropTypes.bool,
  handleToggleAvailability: PropTypes.func,
  handleDeleteSection: PropTypes.func,
  isDisabled: PropTypes.bool.isRequired,
  isAvailable: PropTypes.bool.isRequired,
};
