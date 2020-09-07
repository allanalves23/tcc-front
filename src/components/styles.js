import {
  styled,
  Slide,
  Grid,
  Icon,
  Chip,
  DialogContent,
  FormGroup,
  InputLabel,
  Tooltip,
  withStyles,
} from '@material-ui/core';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

import { COLOR_APP, COLOR_APP_LIGHT } from '@/config/dataProperties';

export const CustomLink = styled(Link)({
  textDecoration: 'none',
});

export const CustomToast = styled(Slide)({
  marginTop: 50,
});

export const CustomHeader = styled(Grid)({
  display: 'flex',
  flexDirection: 'column',
  marginTop: (props) => (props.withoutmargin ? 10 : '1rem'),
  paddingLeft: (props) => (props.withoutmargin ? 0 : '1rem'),
  paddingRight: (props) => (props.withoutmargin ? 0 : '1rem'),
  marginBottom: 20,
});

export const CustomIcon = styled(Icon)({
  color: (props) => (props.theme === 'dark' ? '#FFF' : '#444'),
  marginRight: '5px',
});

export const CustomFaIcon = styled(FontAwesomeIcon)({
  color: '#444',
  marginRight: '5px',
});

export const CustomChip = styled(Chip)({
  '& .MuiIcon-root': {
    marginRight: '5px',
  },
});

export const CustomDialogContent = styled(DialogContent)({
  '& .cm-link': {
    color: (props) => (props.theme === 'dark' ? '#fff' : 'auto'),
  },
});

export const CustomFormGroup = styled(FormGroup)({
  width: '100%',
});

export const CustomInputLabel = styled(InputLabel)({
  marginBottom: '10px',
  color: (props) => (props.theme === 'dark' ? '#fff' : 'rgba(0,0,0,.54)'),
  fontSize: '0.75rem',
});

/**
 * @function
 * @description The styles of `react-select` component, @see https://react-select.com/styles#style-object
 * @param {Object} props Parent props
 * @returns The styles
 */
export const searchThemeStyle = (props) => ({
  control: (provided, state) => ({
    ...provided,
    backgroundColor: props.theme === 'dark' ? '#424242' : '#fff', // #424242 equal to `dark theme`
    borderColor: state.isFocused ? '#d92f44' : `${props.theme === 'dark' ? '#fff' : 'rgba(0,0,0,.42)'}`, // rgba(0,0,0,.42) equal to default `TextField` border color
    boxShadow: state.isFocused ? `0 0 0 1px ${COLOR_APP}` : 'none',
    '&:hover': {
      borderColor: state.isFocused ? COLOR_APP : `${props.theme === 'dark' ? '#fff' : 'rgba(0,0,0,.42)'}`,
    },
  }),
  input: (provided) => ({
    ...provided,
    color: props.theme === 'dark' ? '#fff' : 'currentColor',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: props.theme === 'dark' ? '#fff' : 'currentColor',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: props.theme === 'dark' ? '#fff' : 'currentColor',
  }),
  option: (provided, state) => ({
    ...provided,
    color: '#000',
    backgroundColor: state.isFocused ? COLOR_APP_LIGHT : '#fff',
    '&:hover': {
      backgroundColor: COLOR_APP_LIGHT,
    },
  }),
});

/**
 * @function
 * @description The styles of Tooltip customized
 * @param {Object} theme Parent props
 * @returns The styled component
 */
export const CustomTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 320,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}))(Tooltip);
