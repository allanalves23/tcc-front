import React, { useState, useEffect } from 'react';
import { articleType } from '@/types';
import PropTypes from 'prop-types';

import {
  Drawer,
  Box,
  IconButton,
  Icon,
  Divider,
  useMediaQuery,
  Typography,
} from '@material-ui/core';

import ScrollBars from 'react-custom-scrollbars';

import { devices } from '@/config/devices';

import ArticleInfo from './ArticleInfo';
import ArticleThemesAndCategories from './ArticleThemesAndCategories';
import ArticleMoreOptions from './ArticleMoreOptions';

import { ArticleSettingsContent } from './styles';

function ArticleSettings(props) {
  const {
    open,
    reason,
    removeReason,
    article,
    close,
    onSaveChanges,
    onChangeState,
  } = props;

  const [currentReason, setCurrentReason] = useState(null);
  const matches = useMediaQuery(devices.mobileExtraLarge);

  function addReason(newReason) {
    setCurrentReason(newReason);
  }

  function deleteReason() {
    setCurrentReason(null);
    removeReason();
  }

  function closeDrawer() {
    deleteReason();
    close();
  }

  useEffect(() => {
    if (reason && open && !currentReason) {
      setCurrentReason(reason);
    }
  }, [reason, currentReason, open]);

  return (
    <Drawer
      anchor="right"
      open={open}
      variant="persistent"
      PaperProps={{ style: { width: matches ? '100%' : '45%' } }}
    >
      <Box width="100%">
        <Box display="flex" justifyContent="space-between">
          <Box paddingY={1} paddingX={2}>
            <Typography component="h1" variant="body2">Configurações do artigo</Typography>
            <Typography component="h2" variant="caption">{article.title}</Typography>
          </Box>
          <Box display="flex" alignItems="center" paddingX={1}>
            <IconButton onClick={closeDrawer}>
              <Icon>
                clear
              </Icon>
            </IconButton>
          </Box>
        </Box>
        <Divider />
      </Box>
      { open && (
        <ArticleSettingsContent>
          <ScrollBars>
            <ArticleInfo
              article={article}
              open={addReason}
              close={deleteReason}
              expanded={currentReason === 'info'}
            />
            <ArticleThemesAndCategories
              article={article}
              open={addReason}
              close={deleteReason}
              onSaveChanges={onSaveChanges}
              expanded={currentReason === 'themes&categories'}
            />
            <ArticleMoreOptions
              article={article}
              open={addReason}
              close={deleteReason}
              onSaveChanges={onSaveChanges}
              onChangeState={onChangeState}
              expanded={currentReason === 'moreOptions'}
            />
          </ScrollBars>
        </ArticleSettingsContent>
      )}
    </Drawer>
  );
}

ArticleSettings.propTypes = {
  open: PropTypes.bool,
  article: articleType.isRequired,
  close: PropTypes.func.isRequired,
  onSaveChanges: PropTypes.func.isRequired,
  onChangeState: PropTypes.func.isRequired,
  reason: PropTypes.oneOf([
    'info',
    'images',
    'themes&categories',
    'moreOptions',
  ]),
  removeReason: PropTypes.func.isRequired,
};

ArticleSettings.defaultProps = {
  open: false,
  reason: null,
};

export default ArticleSettings;
