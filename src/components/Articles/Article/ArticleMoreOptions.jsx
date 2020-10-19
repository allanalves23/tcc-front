import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { articleType } from '@/types';

import { Redirect } from 'react-router-dom';

import {
  Accordion,
  AccordionDetails,
  Icon,
  Typography,
  TextField,
  InputAdornment,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Box,
  Button,
  Divider,
} from '@material-ui/core';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { CODER_MIND_URL } from '@/config/dataProperties';
import { formatCustomURL } from '@/config/masks';
import { isValidLink } from '@/shared';
import { callToast as toastEmitter } from '@/redux/toast/toastActions';
import { error } from '@/config/toasts';

import {
  FaYoutube,
  FaVideo,
  FaGitlab,
  FaGithub,
  FaStore,
} from 'react-icons/fa';

import { CustomTooltip } from '@/components/styles';

import RemoveArticleDialog from '@/components/Articles/RemoveArticleDialog.jsx';
import SectionDescription from './SectionDescription';

import { CustomAccordionSummary, BoxSocialMedia } from './styles';

function ArticleMoreOptions(props) {
  const {
    article,
    open,
    close,
    expanded,
    onSaveChanges,
    onChangeState,
    callToast,
  } = props;

  const [mounted, setMounted] = useState(false);
  const [openTooltip, setOpenTooltip] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [removeDialogIsOpened, setRemoveDialogIsOpened] = useState(false);
  const [redirect, setRedirect] = useState('');

  const [socialRepository, setSocialRepository] = useState('');
  const [socialRepositoryType, setSocialRepositoryType] = useState('github');
  const [socialVideo, setSocialVideo] = useState('');
  const [socialVideoType, setSocialVideoType] = useState('youtube');
  const [customUri, setCustomUri] = useState('');

  function toogleDetails() {
    if (!expanded) {
      open('moreOptions');
    } else {
      close();
    }
  }

  function getRepoTypeIcon() {
    switch (socialRepositoryType) {
      case 'github': return (<FaGithub />);
      case 'gitlab': return (<FaGitlab />);
      default: return (<FaStore />);
    }
  }

  function getVideoTypeIcon() {
    return (socialVideoType === 'youtube' ? <FaYoutube /> : <FaVideo />);
  }

  function changeSocialRepositoryType(evt) {
    const { value } = evt.target;
    setSocialRepository('');
    setSocialRepositoryType(value);
  }

  function changeSocialVideoType(evt) {
    const { value } = evt.target;
    setSocialVideo('');
    setSocialVideoType(value);
  }

  function changeCustomUri(evt) {
    const { value } = evt.target;
    setCustomUri(value);
    setOpenTooltip(true);
  }

  function hideCustomUriTooltip() {
    setOpenTooltip(false);
  }

  function validateChanges() {
    if (socialVideo && !isValidLink(socialVideo)) {
      throw new Error('Vídeo possui um link inválido');
    }

    if (socialRepository && !isValidLink(socialRepository)) {
      throw new Error('Repositório possui um link inválido');
    }
  }

  function saveChanges() {
    try {
      validateChanges();

      const articleChanges = {
        id: article.id,
        socialRepository,
        socialRepositoryType,
        socialVideo,
        socialVideoType,
        customUri,
      };
      onSaveChanges(articleChanges);
      setIsSaved(true);
    } catch (err) {
      callToast(error(err.message));
    }
  }

  function closeRemoveDialog(evt) {
    setRemoveDialogIsOpened(false);

    const { reason } = evt;
    if (reason && reason === 'removed') {
      setRedirect('/articles');
    }
  }

  function isDraft() {
    return article.state === 'draft';
  }

  function isInactivated() {
    return article.state === 'inactivated';
  }

  function isBoosted() {
    return article.state === 'boosted';
  }

  useEffect(() => {
    let handler;
    if (isSaved) {
      handler = setTimeout(() => {
        setIsSaved(false);
      }, 2000);
    }

    return () => clearTimeout(handler);
  }, [isSaved]);

  useEffect(() => {
    if (article.id && !mounted) {
      setMounted(true);
      setSocialRepository(article.socialRepository);
      setSocialRepositoryType(article.socialRepositoryType);
      setSocialVideo(article.socialVideo);
      setSocialVideoType(article.socialVideoType);
      setCustomUri(article.customUri);
    }
  }, [article, socialRepository, socialRepositoryType, socialVideo, socialVideoType, mounted]);

  return (
    <Accordion expanded={expanded}>
      <CustomAccordionSummary
        onClick={toogleDetails}
        expandIcon={<Icon>expand_more</Icon>}
      >
        <Typography variant="h6" component="h2">Mais opções</Typography>
      </CustomAccordionSummary>
      {redirect && <Redirect to={redirect} />}
      <AccordionDetails>
        <Box width="100%">
          <BoxSocialMedia>
            <CustomTooltip
              placement="top-start"
              arrow
              open={openTooltip}
              title={(
                <Typography component="span" variant="caption">
                  A url do artigo ficará:
                  {' '}
                  {CODER_MIND_URL}
                  /artigos/
                  <strong>{customUri ? formatCustomURL(customUri) : ''}</strong>
                </Typography>
            )}
            >
              <TextField
                label="Url Personalizada"
                margin="dense"
                fullWidth
                value={customUri}
                onChange={changeCustomUri}
                onBlur={hideCustomUriTooltip}
              />
            </CustomTooltip>
          </BoxSocialMedia>
          <BoxSocialMedia>
            <FormControl className="social-media-type">
              <InputLabel>Tipo</InputLabel>
              <Select
                value={socialRepositoryType || 'github'}
                onChange={changeSocialRepositoryType}
              >
                <MenuItem value="github">GitHub</MenuItem>
                <MenuItem value="gitlab">GitLab</MenuItem>
                <MenuItem value="other">Outro</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Repositório"
              margin="dense"
              fullWidth
              error={false}
              helperText={(
                <Typography component="span" variant="caption">
                  <strong>Informe o link completo do repositório</strong>
                </Typography>
            )}
              value={socialRepository || ''}
              onChange={(evt) => setSocialRepository(evt.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {getRepoTypeIcon()}
                  </InputAdornment>
                ),
              }}
            />
          </BoxSocialMedia>
          <BoxSocialMedia>
            <FormControl className="social-media-type">
              <InputLabel>Tipo</InputLabel>
              <Select
                value={socialVideoType || 'youtube'}
                onChange={changeSocialVideoType}
              >
                <MenuItem value="youtube">Youtube</MenuItem>
                <MenuItem value="other">Outro</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Video"
              margin="dense"
              fullWidth
              error={false}
              helperText={(
                <Typography component="span" variant="caption">
                  <strong>Informe o link completo do video</strong>
                </Typography>
            )}
              value={socialVideo || ''}
              onChange={(evt) => setSocialVideo(evt.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {getVideoTypeIcon()}
                  </InputAdornment>
                ),
              }}
            />
          </BoxSocialMedia>
          <Box
            width="100%"
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            marginY={2}
          >
            {!isSaved && (
              <Button
                size="small"
                color="primary"
                variant="contained"
                onClick={saveChanges}
              >
                Salvar

              </Button>
            )}
          </Box>
          <Divider />
          { isDraft() && (
            <Box marginY={2}>
              <RemoveArticleDialog
                open={removeDialogIsOpened}
                onClose={closeRemoveDialog}
                article={article}
              />
              <SectionDescription
                title="Excluir artigo"
                description="Ao remover, não será possível recuperar o artigo novamente. Por segurança, somente artigos que nunca foram publicados podem ser excluídos."
              />
              <Box marginTop={2} marginX={2}>
                <Button
                  color="secondary"
                  variant="contained"
                  size="small"
                  onClick={() => setRemoveDialogIsOpened(true)}
                >
                  Excluir artigo
                </Button>
              </Box>
            </Box>
          )}
          { isBoosted() && (
            <Box marginY={2}>
              <SectionDescription
                title="Retirar impulsionamento"
                description="Ao ativar seu artigo voltará a ser somente publicado."
              />
              <Box marginTop={2} marginX={2} marginBottom={2}>
                <Button
                  color="primary"
                  variant="contained"
                  size="small"
                  onClick={() => onChangeState('published')}
                >
                  Retirar
                </Button>
              </Box>
              <Divider />
            </Box>
          )}
          { !isDraft() && !isInactivated() && (
            <Box marginY={2}>
              <SectionDescription
                title="Inativar artigo"
                description="Ao inativar, não será possível visualizar o artigo em nosso blog. Fique tranquilo, é possível publicá-lo novamente."
              />
              <Box marginTop={2} marginX={2}>
                <Button
                  color="default"
                  variant="contained"
                  size="small"
                  onClick={() => onChangeState('inactivated')}
                >
                  Inativar artigo
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}

ArticleMoreOptions.propTypes = {
  article: articleType.isRequired,
  open: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  onSaveChanges: PropTypes.func.isRequired,
  onChangeState: PropTypes.func.isRequired,
  callToast: PropTypes.func.isRequired,
  expanded: PropTypes.bool,
};

ArticleMoreOptions.defaultProps = {
  expanded: false,
};

const mapStateToProps = (state) => ({ toast: state.config });

const mapDispatchToProps = (dispatch) => bindActionCreators({ callToast: toastEmitter }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ArticleMoreOptions);
