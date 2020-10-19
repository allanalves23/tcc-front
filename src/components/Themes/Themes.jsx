import React, { useState, useEffect } from 'react';
import { userType, appTheme } from '@/types';

import {
  Container,
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
  TablePagination,
  Paper,
  Box,
  LinearProgress,
  Typography,
} from '@material-ui/core';

import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { scrollToTop } from '@/shared/index';

import CustomButton from '@/components/Buttons/Button.jsx';
import CustomIconButton from '@/components/Buttons/IconButton.jsx';
import Header from '@/components/Header.jsx';
import DataNotFound from '@/components/NotFound/DataNotFound.jsx';
import LoadingList from '@/components/LoadingList.jsx';

import {
  OPTIONS_LIMIT,
  DEFAULT_LIMIT,
  LIMIT_LABEL,
  DISPLAYED_ROWS,
} from '@/config/dataProperties';

import { callToast as toastEmitter } from '@/redux/toast/toastActions';

import RemoveConfirmation from './RemoveConfirmation';
import Form from './Form';

import {
  HudLink,
  HudSearchBar,
  HudButtons,
  TableIcon,
  TableWrapper,
} from './styles';

function Themes(props) {
  const {
    user,
    theme,
  } = props;

  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [error, setError] = useState(false);
  const [themeSelected, setThemeSelected] = useState({});
  const [reload, setReload] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [openRemoveConfirm, setOpenRemoveConfirm] = useState(false);

  function changeQueryValue(term) {
    setQuery(term);
    setPage(1);
    setReload(true);
  }

  async function changePage(event, p) {
    setPage(p + 1);
    setReload(true);
    scrollToTop();
  }

  function handleOpenForm(isOpen = false, succeeded = false) {
    if (loading) return;

    if (!isOpen) {
      setThemeSelected({});
      setReload(succeeded);
    }

    setOpenForm(isOpen);
  }

  function handleOpenRemoveConfirm(isOpen = false, stack = null) {
    if (loading) return;

    if (!isOpen) {
      setThemeSelected({});

      if (stack && stack.removed) {
        if (stack.newPage) {
          setPage(stack.newPage);
        }
        setReload(true);
      }
    }
    setOpenRemoveConfirm(isOpen);
  }

  function selectTheme(newTheme, reason) {
    return () => {
      switch (reason) {
        case 'remove': {
          handleOpenRemoveConfirm(true);
          break;
        }
        default: {
          handleOpenForm(true);
        }
      }
      setThemeSelected(newTheme);
    };
  }

  async function defineLimit(event) {
    const newLimit = parseInt(event.target.value, 10);

    setLimit(newLimit);
    setReload(true);
  }

  useEffect(() => {
    const source = axios.CancelToken.source();

    async function searchThemes() {
      try {
        setLoading(true);

        const url = `/temas?skip=${page}&termo=${query}&take=${limit}`;

        await axios(url, { cancelToken: source.token }).then((res) => {
          setReload(false);

          setThemes(res.data);
          setCount(res.data.count);
          setLimit(res.data.limit);
          setError(false);
        });

        setLoading(false);
      } catch (err) {
        if (!axios.isCancel(err)) {
          setError(true);
        }
      }
    }

    if (reload) {
      scrollToTop();
      searchThemes();
    }
    return () => source.cancel();
  }, [page, query, limit, loading, error, themes, reload]);

  return (
    <Container id="component">
      <Header title="Temas" description="Temas para artigos" icon="bookmark" />
      <Form
        open={openForm}
        onClose={(succeeded) => handleOpenForm(false, succeeded)}
        propTheme={themeSelected}
      />
      <RemoveConfirmation
        open={openRemoveConfirm}
        themesQuantity={themes.length}
        onClose={(stack) => handleOpenRemoveConfirm(false, stack)}
        propTheme={themeSelected}
        page={page}
      />
      <Box mb={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" width="100%">
          <HudButtons>
            { user.tagAdmin
              && (
              <CustomButton
                color="primary"
                icon="add_circle_outline"
                onClick={() => handleOpenForm(true)}
              />
              )
            }
            { user.tagAdmin
              && (
                <HudLink to="/management">
                  <CustomButton
                    color="default"
                    icon="settings"
                    fullWidth
                  />
                </HudLink>
              )
            }
          </HudButtons>
          <HudSearchBar
            id="search_field"
            fullWidth
            placeholder="Pesquisar"
            value={query}
            onChange={(q) => changeQueryValue(q)}
            onCancelSearch={() => changeQueryValue('')}
          />
        </Box>
      </Box>
      {loading && themes.length === 0 && <LoadingList />}
      {!loading && themes.length === 0 && (
        <DataNotFound msg="Nenhum tema encontrado" />
      )}
      <Paper>
        {loading && themes.length > 0 && <LinearProgress color="primary" />}
        {themes.length > 0 && (
        <TableWrapper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <TableIcon fontSize="small" color="action">
                      bookmark
                    </TableIcon>
                    <Typography component="span" variant="body1">
                      Tema
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <TableIcon fontSize="small" color="action">
                      bookmark_border
                    </TableIcon>
                    <Typography component="span" variant="body1">
                      Apelido
                    </Typography>
                  </Box>
                </TableCell>
                {user.tagAdmin && (
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <TableIcon fontSize="small" color="action">
                      build
                    </TableIcon>
                    <Typography component="span" variant="body1">
                      Ações
                    </Typography>
                  </Box>
                </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {themes.map((elem) => (
                <TableRow key={elem._id}>
                  <TableCell scope="name">{elem.name}</TableCell>
                  <TableCell scope="alias">{elem.alias}</TableCell>
                  {user.tagAdmin && (
                  <TableCell scope="_id">
                    <CustomIconButton
                      icon="edit"
                      color={theme === 'dark' ? 'inherit' : 'primary'}
                      tooltip={<Typography component="span" variant="body2">Editar</Typography>}
                      onClick={selectTheme(elem, 'edit')}
                    />
                    <CustomIconButton
                      icon="delete_forever"
                      tooltip={<Typography component="span" variant="body2">Remover</Typography>}
                      onClick={selectTheme(elem, 'remove')}
                    />
                  </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={OPTIONS_LIMIT}
                  colSpan={3}
                  count={count}
                  rowsPerPage={limit}
                  labelRowsPerPage={LIMIT_LABEL}
                  labelDisplayedRows={DISPLAYED_ROWS}
                  page={page - 1}
                  SelectProps={{
                    inputProps: { 'aria-label': 'Limite' },
                  }}
                  onChangePage={changePage}
                  onChangeRowsPerPage={defineLimit}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableWrapper>
        )}
      </Paper>
    </Container>
  );
}

Themes.propTypes = {
  user: userType.isRequired,
  theme: appTheme.isRequired,
};

const mapStateToProps = (state) => ({ user: state.user, toast: state.config, theme: state.theme });
const mapDispatchToProps = (dispatch) => bindActionCreators({ callToast: toastEmitter }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Themes);
