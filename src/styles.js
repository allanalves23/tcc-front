import { styled, Box, Grid } from '@material-ui/core';

import { devices } from './config/devices';

export const AppContent = styled(Box)({
  paddingTop: (props) => (props.user.userID || props.isvalidating ? 80 : 0),
  paddingLeft: (props) => (props.user.userID || props.isvalidating ? 80 : 0),
  paddingBottom: (props) => (props.user.userID || props.isvalidating ? 20 : 0),
  [devices.mobileLarge]: {
    paddingLeft: '0 !important',
    paddingBottom: (props) => (props.user.userID || props.isvalidating ? '80px !important' : 0),
  },
});

export const AppContainer = styled(Grid)({
  minHeight: '100vh',
  backgroundColor: (props) => (props.theme === 'dark' ? 'rgba(40, 40, 40, .8)' : 'rgba(245, 245, 245, .8)'),
  color: (props) => (props.theme === 'dark' ? 'white' : 'auto'),
});

export default { AppContent };
