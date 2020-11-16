import {
  styled,
  Container,
  Paper,
  Box,
  Icon,
} from '@material-ui/core';

import { devices } from '@/config/devices';

export const ErrorContainer = styled(Container)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

export const ErrorPaper = styled(Paper)({
  display: 'flex',
  justifyContent: 'center',
  flexWrap: 'wrap',
});

export const ErrorBox = styled(Box)({
  width: '350px',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
});

export const ErrorLogo = styled(Box)({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

export const ErrorMsg = styled(Box)({
  textAlign: 'justify',
  margin: '1rem 0rem',
});

export const ErrorFromDataContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '2rem',
  [devices.tablet]: {
    flexDirection: 'column',
  },
});

export const ErrorFromDataIcon = styled(Icon)({
  fontSize: '12rem',
});
