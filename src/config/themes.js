import { createMuiTheme } from '@material-ui/core';

export function standard(theme) {
  return createMuiTheme({
    palette: {
      type: theme,
      primary: {
        main: '#d92f44',
      },
      secondary: {
        main: '#f44336',
      },
      action: {
        disabled: 'rgb(0,0,0)',
        disabledBackground: 'rgb(190,190,190)',
      },
    },
    typography: {
      fontFamily: [
        'Quicksand',
        'sans-serif',
      ].join(','),
    },
    overrides: {
      MuiFormLabel: {
        root: {
          '&$focused': {
            color: theme === 'dark' ? 'rgba(255,255,255, .7) !important' : 'auto',
          },
        },
      },
      MuiContainer: {
        root: {
          maxWidth: '100% !important',
        },
      },
    },
  });
}

export default { standard };
