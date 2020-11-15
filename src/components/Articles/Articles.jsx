import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { Container, Icon } from '@material-ui/core';

import { OPTIONS_LIMIT, DEFAULT_LIMIT } from '@/config/dataProperties';
import { scrollToTop } from '@/shared/index';

import axios from 'axios';
import { connect } from 'react-redux';

import { userType } from '@/types';

import MaterialTable from 'material-table';

import Header from '@/components/Header.jsx';
import NotFound from '@/components/NotFound/DataNotFound.jsx';
import Chip from '@/components/Chip.jsx';
import ArticleHeaderTableCell from './ArticleHeaderTableCell';
import CreateArticleDialog from './CreateArticleDialog';

import { TableWrapper } from './styles';

function Articles(props) {
  const {
    user,
  } = props;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [viewAll, setViewAll] = useState(false);
  const [articles, setArticles] = useState([]);
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(10);
  const [count] = useState(0);
  const [page, setPage] = useState(1);
  const [reload, setReload] = useState(true);
  const [createArticleDialog, setCreateArticleDialog] = useState(false);

  const history = useHistory();

  function getArticleState(article) {
    let state;
    let icon;
    let color;

    switch (article.estado) {
      case 'PUBLICADO': {
        state = 'Publicado';
        icon = 'public';
        color = 'primary';
        break;
      }
      case 'INATIVO': {
        state = 'Inativo';
        icon = 'public_off';
        color = 'default';
        break;
      }
      case 'IMPULSIONADO': {
        state = 'Impulsionado';
        icon = 'star_rate';
        color = 'primary';
        break;
      }
      case 'REMOVIDO': {
        state = 'Removido';
        icon = 'delete';
        color = 'secondary';
        break;
      }
      default: {
        state = 'Rascunho';
        icon = 'drafts';
        color = 'default';
      }
    }

    return { state, icon, color };
  }

  function getArticleListColumns() {
    const authorColumns = [
      {
        title: <ArticleHeaderTableCell icon="article" label="Artigo" />,
        field: 'titulo',
      },
      {
        title: <ArticleHeaderTableCell icon="label" label="Status" />,
        field: 'state',
        render: (rowData) => {
          const { state, color, icon } = getArticleState(rowData);
          return (<Chip className="cm-chip" text={state} icon={icon} color={color} size="small" sizeIcon="small" />);
        },
      },
      {
        title: <ArticleHeaderTableCell icon="bookmark" label="Tema" />,
        field: 'tema.nome',
      },
      {
        title: <ArticleHeaderTableCell icon="category" label="Categoria" />,
        field: 'categoria.nome',
      },
    ];

    const adminColumns = [
      {
        title: <ArticleHeaderTableCell icon="article" label="Artigo" />,
        field: 'titulo',
      },
      {
        title: <ArticleHeaderTableCell icon="person" label="Autor" />,
        field: 'autor.nome',
      },
      {
        title: <ArticleHeaderTableCell icon="label" label="Status" />,
        field: 'state',
        render: (rowData) => {
          const { state, color, icon } = getArticleState(rowData);
          return (<Chip className="cm-chip" text={state} icon={icon} color={color} size="small" sizeIcon="small" />);
        },
      },
      {
        title: <ArticleHeaderTableCell icon="bookmark" label="Tema" />,
        field: 'tema.nome',
      },
      {
        title: <ArticleHeaderTableCell icon="category" label="Categoria" />,
        field: 'categoria.nome',
      },
    ];

    return user.profileAccess === 'ADMIN' ? adminColumns : authorColumns;
  }

  function openCreateArticleDialog() {
    setCreateArticleDialog(true);
  }

  function closeArticleDialog(stack) {
    setCreateArticleDialog(false);
    if (stack && stack.reason === 'articleCreated') {
      history.push(`/articles/${stack.url}`);
    }
  }

  function changePage(futurePage) {
    setPage(futurePage + 1);
    setReload(true);
  }

  function changeLimit(futureLimit) {
    setLimit(futureLimit);
    setReload(true);
  }

  function getBySearch(q) {
    setQuery(q);
    setPage(1);
    setReload(true);
  }

  function openArticle(article) {
    history.push(`/articles/${article.url}`);
  }

  function toggleViewType() {
    setViewAll(!viewAll);
    setReload(true);
  }

  useEffect(() => {
    const source = axios.CancelToken.source();

    async function getArticles() {
      try {
        const url = `/artigos?termo=${query}&skip=${(page - 1) * limit}&take=${limit}&all=${viewAll}`;
        setLoading(true);

        await axios(url, { cancelToken: source.token })
          .then((res) => {
            setReload(false);

            setArticles(res.data);
          });

        setLoading(false);
      } catch (err) {
        if (!axios.isCancel(err)) {
          setLoading(false);
          setReload(false);
          setError(true);
        }
      }
    }

    if (reload) {
      scrollToTop();
      getArticles();
    }

    return () => source.cancel();
  }, [articles, loading, count, page, limit, reload, error, query, viewAll]);

  return (
    <Container id="component">
      <Header
        title="Artigos"
        description="Consulte, altere e crie novos artigos"
        icon="article"
      />
      <CreateArticleDialog open={createArticleDialog} onClose={closeArticleDialog} />
      <TableWrapper>
        <MaterialTable
          columns={getArticleListColumns()}
          data={articles}
          totalCount={count}
          isLoading={loading}
          page={page - 1}
          onChangeRowsPerPage={changeLimit}
          onChangePage={changePage}
          onSearchChange={getBySearch}
          showFirstLastPageButtons={false}
          icons={{
            ResetSearch: () => (query ? <Icon color="action">clear</Icon> : ''),
            FirstPage: () => <Icon color="action">first_page</Icon>,
            PreviousPage: () => <Icon color="action">chevron_left</Icon>,
            NextPage: () => <Icon color="action">chevron_right</Icon>,
            LastPage: () => <Icon color="action">last_page</Icon>,
          }}
          options={{
            showTitle: false,
            showTextRowsSelected: false,
            pageSize: DEFAULT_LIMIT,
            pageSizeOptions: OPTIONS_LIMIT,
            toolbarButtonAlignment: 'left',
            headerStyle: {
              zIndex: 1,
            },
            debounceInterval: 500,
            maxBodyHeight: 750,
            paginationType: 'normal',
          }}
          localization={{
            body: {
              emptyDataSourceMessage: (<NotFound msg="Ops! Nenhum artigo encontrado" disableboxshadow />),
            },
            toolbar: {
              searchPlaceholder: 'Titulo ou descrição',
            },
            pagination: {
              lastTooltip: 'Última página',
              firstTooltip: 'Primeira página',
              previousTooltip: 'Página anterior',
              nextTooltip: 'Próxima página',
              labelRowsSelect: 'Linhas',
              labelDisplayedRows: '{from}-{to} de {count}',
            },
          }}
          onRowClick={((evt, selectedRow) => openArticle(selectedRow))}
          actions={[
            {
              tooltip: 'Novo artigo',
              icon: 'add_circle',
              onClick: openCreateArticleDialog,
              position: 'toolbar',
            },
            {
              tooltip: viewAll ? 'Visualizar meus artigos' : 'Visualizar todos os artigos',
              icon: viewAll ? 'account_circle' : 'groups',
              onClick: toggleViewType,
              position: 'toolbar',
            },
          ]}
        />
      </TableWrapper>
    </Container>
  );
}

Articles.propTypes = {
  user: userType.isRequired,
};

const mapStateToProps = (state) => ({ user: state.user });

export default connect(mapStateToProps)(Articles);
