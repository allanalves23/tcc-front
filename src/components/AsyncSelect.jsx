import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { appTheme, asyncSelectValueType } from '@/types';

import { Typography } from '@material-ui/core';

import AsyncSelect from 'react-select/async';
import { connect } from 'react-redux';

import { CustomInputLabel, CustomFormGroup, searchThemeStyle } from './styles';

function CustomAsyncSelect(props) {
  const {
    label,
    value,
    placeholder,
    helperText,
    loadingMessage,
    onChange,
    loadOptions,
    theme,
    disabled,
    searchMinLength,
  } = props;

  const [mounted, setMounted] = useState(false);
  const [currentValue, setCurrentValue] = useState({});

  function changeValue(valueChanged) {
    setCurrentValue(valueChanged);
    onChange(valueChanged);
  }

  function termLengthCriteria(term) {
    return term && term.length >= searchMinLength;
  }

  function loadLocalOptions(term) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(termLengthCriteria(term) ? loadOptions(term) : []);
      });
    }, 1000);
  }

  function displayLoadingMessage(evt) {
    const { inputValue } = evt;
    return termLengthCriteria(inputValue) ? loadingMessage : null;
  }

  useEffect(() => {
    if (!mounted) {
      setMounted(true);
      setCurrentValue(value);
    }
  }, [currentValue, value, mounted]);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  return (
    <CustomFormGroup>
      {label && (
        <CustomInputLabel theme={theme}>
          {label}
        </CustomInputLabel>
      )}
      <AsyncSelect
        styles={searchThemeStyle({ theme })}
        cacheOptions
        value={currentValue}
        isClearable
        isDisabled={disabled}
        loadOptions={loadLocalOptions}
        onChange={changeValue}
        noOptionsMessage={() => 'Nenhum resultado encontrado'}
        loadingMessage={displayLoadingMessage}
        placeholder={placeholder}
      />
      { helperText && (
        <Typography variant="caption" component="span">
          {helperText}
        </Typography>
      )}
    </CustomFormGroup>
  );
}

CustomAsyncSelect.propTypes = {
  theme: appTheme.isRequired,
  value: asyncSelectValueType,
  loadingMessage: PropTypes.string,
  placeholder: PropTypes.string,
  loadOptions: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  helperText: PropTypes.node,
  disabled: PropTypes.bool,
  searchMinLength: PropTypes.number,
};

CustomAsyncSelect.defaultProps = {
  value: null,
  loadingMessage: 'Carregando...',
  placeholder: '',
  label: null,
  helperText: null,
  disabled: false,
  searchMinLength: 3,
};

const mapStateToProps = (state) => ({ theme: state.theme });

export default connect(mapStateToProps)(CustomAsyncSelect);
