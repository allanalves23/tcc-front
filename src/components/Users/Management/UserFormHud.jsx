import React from 'react';
import PropTypes from 'prop-types';
import { userType } from '@/types';

import {
  Box,
  useMediaQuery,
} from '@material-ui/core';

import { devices } from '@/config/devices';
import CustomButton from '@/components/Buttons/Button.jsx';
import { FormHudButtons } from './styles';

function UserFormHud(props) {
  const {
    save,
    changePass,
    remove,
    isSaving,
    user,
  } = props;

  const matches = useMediaQuery(devices.tablet);

  return (
    <FormHudButtons>
      { !matches && (
      <Box>
        <CustomButton
          color="primary"
          size="small"
          iconSize="small"
          icon="save"
          onClick={save}
          disabled={isSaving}
        />
        { user.id
        && (
          <CustomButton
            color="secondary"
            size="small"
            iconSize="small"
            icon="delete"
            onClick={remove}
            disabled={isSaving || true}
          />
        )
        }
        { user.id
          && (
            <CustomButton
              color="default"
              size="small"
              iconSize="small"
              icon="lock"
              onClick={changePass}
              disabled={isSaving || true}
            />
          )
        }
      </Box>
      )}
    </FormHudButtons>
  );
}

UserFormHud.propTypes = {
  save: PropTypes.func.isRequired,
  changePass: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  isSaving: PropTypes.bool,
  user: userType.isRequired,
};

UserFormHud.defaultProps = {
  isSaving: false,
};

export default UserFormHud;
