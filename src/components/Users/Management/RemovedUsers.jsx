import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { appTheme } from '@/types';
import { usePrevious } from '@/hooks';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Icon,
  TableBody,
  TableFooter,
  TablePagination,
  Box,
  Divider,
  Typography,
  CircularProgress,
  LinearProgress,
  IconButton,
} from '@material-ui/core';

import axios from 'axios';


import { scrollToTop } from '@/shared/index';
import { displayFullDate } from '@/config/masks';

import { connect } from 'react-redux';

import {
  OPTIONS_LIMIT,
  LIMIT_LABEL,
  DISPLAYED_ROWS,
  DEFAULT_LIMIT,
} from '@/config/dataProperties';

import CustomIconButton from '@/components/Buttons/IconButton.jsx';
import CustomChip from '@/components/Chip.jsx';
import NotFound from '@/components/NotFound/DataNotFound.jsx';
import ErrorFromData from '@/components/Errors/ErrorFromData.jsx';
import DialogConfirmRestore from './DialogConfirmRestoreUser';

import {
  TableIcon,
  HudSearchBar,
  TableWrapper,
  FakeTableOrder,
} from './styles';

function RemovedUsers(props) {
  const {
    open,
    closeDialog,
    theme,
  } = props;

  const prevOpen = usePrevious(open);

  const [users, setUsers] = useState([]);
  const [count, setCount] = useState(0);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState('desc');
  const [error, setError] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmRestoreDialog, setConfirmRestoreDialog] = useState(false);
  const [userSelected, setUserSelected] = useState({});
  const [reload, setReload] = useState(false);
  const [needsReload, setNeedsReload] = useState(false);


  function changePage(event, newPage) {
    const p = newPage + 1;
    setPage(p);
    setReload(true);
  }

  function defineLimit(event) {
    const { value } = event.target;
    setLimit(value);
    setReload(true);
  }

  function showConfirmRestoreDialog(userNotYetSelected) {
    if (loading) return;
    setUserSelected(userNotYetSelected);
    setConfirmRestoreDialog(true);
  }

  function hideConfirmRestoreDialog(event) {
    const { restored } = event;
    if (restored) {
      if (page > 1 && users.length === 1) {
        setPage(page - 1);
      }

      setNeedsReload(true);
      setReload(true);
    }
    setConfirmRestoreDialog(false);
  }

  function close() {
    closeDialog({ needsReload });
    setReload(false);
    setNeedsReload(false);
  }

  async function changeQueryValue(term) {
    const dialogContent = document.querySelector('#dialog-content');
    scrollToTop(dialogContent);

    setQuery(term);
    setPage(1);
    setReload(true);
  }

  function changeOrder() {
    const newOrder = order === 'asc' ? 'desc' : 'asc';
    setOrder(newOrder);
    scrollToTop();
    setReload(true);
  }

  useEffect(() => {
    async function searchUsers() {
      const url = `/users?page=${page}&query=${query}&limit=${limit}&order=${order}&deleted=yes`;
      setLoading(true);
      await axios(url).then((res) => {
        setUsers(res.data.users);
        setCount(res.data.count);
        setLimit(res.data.limit);
      }).catch(() => {
        setError(true);
      });

      setLoading(false);
    }

    if (!prevOpen && open) {
      setReload(true);
    }

    if (reload && open) {
      setError(false);
      setReload(false);
      searchUsers();
    }
  },
  [
    users,
    reload,
    error,
    count,
    limit,
    page,
    query,
    loading,
    open,
    prevOpen,
    order,
  ]);


  return (
    <Dialog
      open={open}
      onClose={close}
      fullWidth
      fullScreen
    >
      { users.length > 0 && loading
        && <LinearProgress color="primary" />
      }
      <DialogConfirmRestore
        open={confirmRestoreDialog}
        closeDialog={hideConfirmRestoreDialog}
        user={userSelected}
      />
      <DialogTitle>
        <Box display="flex" alignItems="center" mb={1}>
          <Box mr={1} display="flex" alignItems="center">
            <Icon>restore</Icon>
          </Box>
          <Box display="flex" alignItems="center">
            <Typography component="h1" variant="h6">
              Usuários removidos
            </Typography>
          </Box>
        </Box>
        <Box mb={2}>
          <Typography component="p" variant="body2">
            Recupere os usuários excluídos do painel.
          </Typography>
        </Box>
        <Divider />
        <Box mt={1} mb={1}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            width="100%"
          >
            <FakeTableOrder theme={theme}>
              <Box display="flex" alignItems="center">
                <Typography component="p" variant="body2">
                  Ordem:
                </Typography>
                <Box ml={1}>
                  <IconButton onClick={changeOrder} size="small">
                    <Icon color="action">
                      {order === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                    </Icon>
                  </IconButton>
                </Box>
              </Box>
            </FakeTableOrder>
            <HudSearchBar
              id="search_field_removed_users"
              fullWidth
              placeholder="Pesquisar"
              value={query}
              onChange={(q) => changeQueryValue(q)}
              onCancelSearch={() => changeQueryValue('')}
            />
          </Box>
        </Box>
        <Divider />
      </DialogTitle>
      <DialogContent id="dialog-content">
        { users.length === 0 && loading
          && (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              width="100%"
              height="350px"
            >
              <CircularProgress size={80} color="primary" />
            </Box>
          )
        }
        { users.length === 0 && !loading && !error
          && <NotFound msg="Ops, parece que não existem usuários removidos com este critério de busca" />
        }
        { error
          && (
            <ErrorFromData
              msg="Ops, ocorreu um erro ao obter os usuários removidos"
              reload={() => setReload(true)}
            />
          )
        }
        {users.length > 0 && !error
          && (
            <TableWrapper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <TableIcon fontSize="small" color="action">
                          person
                        </TableIcon>
                        <Typography component="span" variant="body1">
                          Nome
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <TableIcon fontSize="small" color="action">
                          alternate_email
                        </TableIcon>
                        <Typography component="span" variant="body1">
                          E-mail
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <TableIcon fontSize="small" color="action">
                          bookmarks
                        </TableIcon>
                        <Typography component="span" variant="body1">
                          Tipo
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <TableIcon fontSize="small" color="action">
                          access_time
                        </TableIcon>
                        <Typography component="span" variant="body1">
                          Removido em
                        </Typography>
                      </Box>
                    </TableCell>
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
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((elem) => (
                    <TableRow key={elem.id} hover>
                      <TableCell scope="name">
                        {elem.name}
                      </TableCell>
                      <TableCell scope="email">
                        {elem.email}
                      </TableCell>
                      <TableCell scope="tagAdmin">
                        <CustomChip
                          size="small"
                          color={elem.tagAdmin ? 'primary' : 'default'}
                          sizeIcon="small"
                          icon={elem.tagAdmin ? 'supervisor_account' : 'person'}
                          text={elem.tagAdmin ? 'Administrador' : 'Autor'}
                        />
                      </TableCell>
                      <TableCell scope="deletedAt">
                        {elem.deletedAt ? displayFullDate(elem.deletedAt) : elem.deletedAt}
                      </TableCell>
                      <TableCell>
                        <CustomIconButton
                          icon="restore_from_trash"
                          color={theme === 'dark' ? 'inherit' : 'primary'}
                          tooltip={
                          (
                            <Typography component="span" variant="body2">
                              Restaurar
                            </Typography>
                          )}
                          onClick={() => showConfirmRestoreDialog(elem)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={OPTIONS_LIMIT}
                      colSpan={5}
                      count={count}
                      rowsPerPage={limit}
                      labelRowsPerPage={LIMIT_LABEL}
                      labelDisplayedRows={DISPLAYED_ROWS}
                      page={page - 1}
                      onChangePage={changePage}
                      onChangeRowsPerPage={defineLimit}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </TableWrapper>
          )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={close}
          color="primary"
          variant={theme === 'dark' ? 'contained' : 'text'}
          size="small"
          autoFocus
        >
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

RemovedUsers.propTypes = {
  open: PropTypes.bool,
  closeDialog: PropTypes.func.isRequired,
  theme: appTheme.isRequired,
};

RemovedUsers.defaultProps = {
  open: false,
};

const mapStateToProps = (state) => ({ theme: state.theme });

export default connect(mapStateToProps)(RemovedUsers);
