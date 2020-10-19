import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { articleType } from '@/types';

import {
  Accordion,
  AccordionDetails,
  Icon,
  Typography,
  Box,
  Divider,
} from '@material-ui/core';

import DefaultLogoImg from '@/assets/img_not_found_512x512.png';
import DefaultSecondaryImg from '@/assets/img_not_found_768.png';
import DefaultHeaderImg from '@/assets/img_not_found_1080.png';

import axios from 'axios';
import { defineErrorMsg } from '@/config/backend';
import { success, error } from '@/config/toasts';
import { callToast as toastEmitter } from '@/redux/toast/toastActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ArticleImage from './ArticleImage';

import {
  CustomAccordionSummary,
  ArticleLogoArea,
  ArticleSecondaryImageArea,
  ArticleHeaderImageArea,
} from './styles';
import RemoveArticleImgDialog from './RemoveArticleImgDialog';

function ArticleImages(props) {
  const {
    article,
    open,
    close,
    expanded,
    callToast,
    onSaveChanges,
  } = props;

  const [mounted, setMounted] = useState(false);
  const [isSavingLogo, setIsSavingLogo] = useState(false);
  const [isSavingSecondary, setIsSavingSecondary] = useState(false);
  const [isSavingHeader, setIsSavingHeader] = useState(false);
  const [isOpenedRemoveDialog, setIsOpenedRemoveDialog] = useState(false);

  const [logoImg, setLogoImg] = useState(null);
  const [secondaryImg, setSecondaryImg] = useState(null);
  const [headerImg, setHeaderImg] = useState(null);
  const [removeImgType, setRemoveImgType] = useState(null);

  function toogleDetails() {
    if (!expanded) {
      open('images');
    } else {
      close();
    }
  }

  function logoUrl() {
    return logoImg || DefaultLogoImg;
  }

  function secondaryImgUrl() {
    return secondaryImg || DefaultSecondaryImg;
  }

  function headerImgUrl() {
    return headerImg || DefaultHeaderImg;
  }

  function getButtonLabel(img, isLoading) {
    if (!img && isLoading) return 'Salvando...';
    if (img && isLoading) return 'Alterando...';
    if (img && !isLoading) return 'Alterar imagem';

    return 'Adicionar imagem';
  }

  function setSavingImg(reason, isSaving = true) {
    if (reason === 'logo') {
      setIsSavingLogo(isSaving);
    }

    if (reason === 'secondary') {
      setIsSavingSecondary(isSaving);
    }

    if (reason === 'header') {
      setIsSavingHeader(isSaving);
    }
  }

  async function changeImage(image, reason) {
    const img = image.target.files[0];
    if (!img) return;

    setSavingImg(reason);
    const id = article.id;

    const formData = new FormData();
    formData.append('image', img);

    // Overriding content-type https header for uploading images
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };

    const url = `/artigos/images/${id}?type=${reason}`;

    await axios.post(url, formData, config).then(async (res) => {
      callToast(success('Operação realizada com sucesso'));
      if (reason === 'logo') {
        setLogoImg(res.data.logoImg);
        onSaveChanges({ logoImg: res.data.logoImg });
      }

      if (reason === 'secondary') setSecondaryImg(res.data.secondaryImg);
      if (reason === 'header') setHeaderImg(res.data.headerImg);
    }).catch((err) => {
      const msg = defineErrorMsg(err);
      callToast(error(msg));
    });

    setSavingImg(reason, false);
  }

  function removeImage(stack) {
    setIsOpenedRemoveDialog(false);

    const { reason } = stack;

    if (reason === 'removed') {
      if (removeImgType === 'logo') {
        onSaveChanges({ logoImg: null });
        setLogoImg(null);
      }

      if (removeImgType === 'secondary') {
        setSecondaryImg(null);
      }

      if (removeImgType === 'header') {
        setHeaderImg(null);
      }
    }
  }

  function openRemoveDialog(imgType) {
    setIsOpenedRemoveDialog(true);
    setRemoveImgType(imgType);
  }

  useEffect(() => {
    if (!mounted) {
      setMounted(true);
      setLogoImg(article.logoImg);
      setSecondaryImg(article.secondaryImg);
      setHeaderImg(article.headerImg);
    }
  }, [
    mounted,
    article.logoImg,
    article.secondaryImg,
    article.headerImg,
  ]);

  return (
    <Accordion expanded={expanded}>
      <CustomAccordionSummary
        onClick={toogleDetails}
        expandIcon={<Icon>expand_more</Icon>}
      >
        <Typography variant="h6" component="h2">Imagens</Typography>
      </CustomAccordionSummary>
      <AccordionDetails>
        <RemoveArticleImgDialog
          open={isOpenedRemoveDialog}
          onClose={removeImage}
          imageType={removeImgType}
          article={article}
        />
        <Box width="100%">
          <ArticleLogoArea>
            <Box display="flex" justifyContent="space-between" flexWrap="wrap" mb={2}>
              <Box display="flex" flexDirection="column">
                <Box display="flex" flexDirection="column">
                  <Box display="flex">
                    <Icon color="action" fontSize="small">keyboard_arrow_right</Icon>
                    <Typography component="span" variant="body2">Logo do artigo</Typography>
                  </Box>
                  <Box ml={2}>
                    <Typography component="span" variant="caption">Esta imagem será para identificar o artigo, utilize uma imagem auto-descritiva para seu artigo.</Typography>
                  </Box>
                </Box>
              </Box>
              <ArticleImage
                imgSrc={logoUrl()}
                imgAlt={article && article.title}
                onRemove={() => openRemoveDialog('logo')}
                onChange={(image) => changeImage(image, 'logo')}
                showRemoveButton={Boolean(logoImg)}
                buttonLabel={getButtonLabel(logoImg, isSavingLogo)}
                buttonDisabled={isSavingLogo}
                imageType="article-logo-img"
              />
            </Box>
            <Divider />
          </ArticleLogoArea>
          <ArticleSecondaryImageArea>
            <Box display="flex" justifyContent="space-between" flexWrap="wrap" mb={2}>
              <Box display="flex" flexDirection="column">
                <Box display="flex" flexDirection="column">
                  <Box display="flex">
                    <Icon color="action" fontSize="small">keyboard_arrow_right</Icon>
                    <Typography component="span" variant="body2">Imagem de recomendação</Typography>
                  </Box>
                  <Box ml={2}>
                    <Typography component="span" variant="caption">Esta imagem será utilizada para recomendação em outros artigos, utilize uma imagem auto-descritiva.</Typography>
                  </Box>
                </Box>
              </Box>
              <ArticleImage
                imgSrc={secondaryImgUrl()}
                imgAlt={article && article.title}
                onRemove={() => openRemoveDialog('secondary')}
                onChange={(image) => changeImage(image, 'secondary')}
                showRemoveButton={Boolean(secondaryImg)}
                buttonLabel={getButtonLabel(secondaryImg, isSavingSecondary)}
                buttonDisabled={isSavingSecondary}
                imageType="article-secondary-img"
              />
            </Box>
            <Divider />
          </ArticleSecondaryImageArea>
          <ArticleHeaderImageArea>
            <Box display="flex" justifyContent="space-between" flexWrap="wrap">
              <Box display="flex" flexDirection="column">
                <Box display="flex" flexDirection="column">
                  <Box display="flex">
                    <Icon color="action" fontSize="small">keyboard_arrow_right</Icon>
                    <Typography component="span" variant="body2">Imagem de cabeçalho</Typography>
                  </Box>
                  <Box ml={2}>
                    <Typography component="span" variant="caption">Esta imagem será utilizada no cabeçalho de apresentação do artigo.</Typography>
                  </Box>
                </Box>
              </Box>
              <ArticleImage
                imgSrc={headerImgUrl()}
                imgAlt={article && article.title}
                onRemove={() => openRemoveDialog('header')}
                onChange={(image) => changeImage(image, 'header')}
                showRemoveButton={Boolean(headerImg)}
                buttonLabel={getButtonLabel(headerImg, isSavingHeader)}
                buttonDisabled={isSavingHeader}
                imageType="article-header-img"
              />
            </Box>
          </ArticleHeaderImageArea>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}

ArticleImages.propTypes = {
  article: articleType.isRequired,
  open: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  onSaveChanges: PropTypes.func.isRequired,
  callToast: PropTypes.func.isRequired,
  expanded: PropTypes.bool,
};

ArticleImages.defaultProps = {
  expanded: false,
};

const mapStateToProps = (state) => ({ toast: state.config });
const mapDispatchToProps = (dispatch) => bindActionCreators({ callToast: toastEmitter }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ArticleImages);
