import React from 'react';
import PropTypes from 'prop-types';
import {
  Icon,
  CircularProgress,
} from '@material-ui/core';

import { CustomButtonBase } from './styles';

function AuthButton(props) {
  const {
    type,
    disabled,
    onClick,
    disabledIcon,
    loading,
    iconSize,
    icon,
    circularProgressSize,
    CircularProgressColor,
    text,
    fullWidth,
    severity,
  } = props;

  return (
    <CustomButtonBase
      severity={severity}
      fullwidth={fullWidth.toString()}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      { Boolean(!disabledIcon && !loading)
          && (
          <Icon
            fontSize={iconSize}
          >
            {icon}
          </Icon>
          )
      }
      { loading
          && (
          <CircularProgress
            size={circularProgressSize}
            color={CircularProgressColor}
          />
          )
      }
      {text}
    </CustomButtonBase>
  );
}

AuthButton.propTypes = {
  type: PropTypes.oneOf([
    'submit',
    'reset',
    'button',
  ]),
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  disabledIcon: PropTypes.bool,
  loading: PropTypes.bool,
  iconSize: PropTypes.oneOf([
    'default',
    'inherit',
    'large',
    'small',
  ]),
  icon: PropTypes.string,
  circularProgressSize: PropTypes.number,
  CircularProgressColor: PropTypes.oneOf([
    'inherit',
    'primary',
    'secondary',
  ]),
  text: PropTypes.string,
  fullWidth: PropTypes.bool,
  severity: PropTypes.string,
};

AuthButton.defaultProps = {
  type: 'button',
  disabled: false,
  disabledIcon: false,
  loading: false,
  iconSize: 'default',
  icon: '',
  circularProgressSize: 15,
  CircularProgressColor: 'inherit',
  text: '',
  fullWidth: false,
  severity: null,
  onClick: () => null,
};

export default AuthButton;
