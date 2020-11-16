import React from 'react';
import PropTypes from 'prop-types';

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
    isSaving,
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
      </Box>
      )}
    </FormHudButtons>
  );
}

UserFormHud.propTypes = {
  save: PropTypes.func.isRequired,
  isSaving: PropTypes.bool,
};

UserFormHud.defaultProps = {
  isSaving: false,
};

export default UserFormHud;
