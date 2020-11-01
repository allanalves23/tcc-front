import {
  styled,
  Divider,
  Icon,
  Grid,
  TextField,
  Tooltip,
  FormGroup,
  withStyles,
  Container,
  Box,
} from '@material-ui/core';

import { Link } from 'react-router-dom';

import Avatar from 'react-avatar';
import { KeyboardDatePicker } from '@material-ui/pickers';

import { devices } from '@/config/devices';

export const FakeLink = styled(Link)({
  textDecoration: 'none',
});

export const CustomIcon = styled(Icon)({
  marginRight: '5px',
});

export const CustomDivider = styled(Divider)({
  margin: '15px 0',
});

export const IsolatedGrid = styled(Grid)({
  marginTop: '5rem',
});

export const FullTextField = styled(Box)({
  width: '85%',
  [devices.tablet]: {
    width: '100%',
  },
});

export const CustomTextField = styled(TextField)({
  margin: '1rem',
  [devices.tablet]: {
    width: '100%',
    margin: '1rem 0',
  },
});

export const CustomKeyboardDatePicker = styled(KeyboardDatePicker)({
  margin: '1rem',
  [devices.tablet]: {
    width: '100%',
    margin: '1rem 0',
  },
});

export const CustomFormGroup = styled(FormGroup)({
  margin: '1rem',
  [devices.tablet]: {
    width: '100%',
  },
});

export const CustomGrid = styled(Grid)({
  padding: '.5rem',
  [devices.laptop]: {
    marginBottom: '.5rem',
  },
});

export const CustomTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 320,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}))(Tooltip);

export const ImageButton = styled(Avatar)({
  cursor: (props) => (props.haveImg ? 'pointer' : 'auto'),
});

export const CustomContainer = styled(Container)({
  minHeight: '650px',
});
