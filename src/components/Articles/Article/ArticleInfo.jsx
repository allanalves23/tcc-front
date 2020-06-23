import React from 'react';
import PropTypes from 'prop-types';
import { articleType } from '@/types';

import { displayFullDate } from '@/config/masks';
import {
  ExpansionPanel,
  ExpansionPanelDetails,
  Icon,
  Typography,
  Box,
} from '@material-ui/core';

import CustomChip from '@/components/Chip.jsx';

import { CustomExpansionPanelSummary } from './styles';

function ArticleInfo(props) {
  const {
    article,
    open,
    close,
    expanded,
  } = props;

  function toogleDetails() {
    if (!expanded) {
      open('info');
    } else {
      close();
    }
  }

  function getArticleState() {
    let state;
    let color;

    switch (article.state) {
      case 'published': {
        state = 'Publicado';
        color = 'primary';
        break;
      }
      case 'inactivated': {
        state = 'Inativo';
        color = 'default';
        break;
      }
      case 'boosted': {
        state = 'Impulsionado';
        color = 'primary';
        break;
      }
      case 'Removed': {
        state = 'Removido';
        color = 'secondary';
        break;
      }
      default: {
        state = 'Rascunho';
        color = 'default';
      }
    }

    return { state, color };
  }

  function getFormatContent() {
    return article.contentType === 'md' ? 'Markdown' : 'Padrão';
  }

  return (
    <ExpansionPanel expanded={expanded}>
      <CustomExpansionPanelSummary
        onClick={toogleDetails}
        expandIcon={<Icon>expand_more</Icon>}
      >
        <Typography variant="h6" component="h2">Informações</Typography>
      </CustomExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Box>
          <Box display="flex" alignItems="center" mb={1}>
            <Typography variant="body2" component="span">
              Artigo:
              {' '}
              {article && article.title}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" mb={1}>
            <Typography variant="body2" component="span">
              Autor:
              {' '}
              {article && article.author && article.author.name}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" mb={1}>
            <Typography variant="body2" component="span">
              Status:
              {' '}
              <CustomChip text={getArticleState().state} color={getArticleState().color} size="small" />
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" mb={1}>
            <Typography variant="body2" component="span">
              Criado em:
              {' '}
              {article && article.createdAt && displayFullDate(article.createdAt)}
            </Typography>
          </Box>
          {article && article.publishedAt && (
            <Box display="flex" alignItems="center" mb={1}>
              <Typography variant="body2" component="span">
                Primeira publicação:
                {' '}
                {displayFullDate(article.publishedAt)}
              </Typography>
            </Box>
          )}
          <Box display="flex" alignItems="center" mb={1}>
            <Typography variant="body2" component="span">
              Formato do artigo:
              {' '}
              {getFormatContent()}
            </Typography>
          </Box>
        </Box>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}

ArticleInfo.propTypes = {
  article: articleType.isRequired,
  open: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  expanded: PropTypes.bool,
};

ArticleInfo.defaultProps = {
  expanded: false,
};

export default ArticleInfo;
