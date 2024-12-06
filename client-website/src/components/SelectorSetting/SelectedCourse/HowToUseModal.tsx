import { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import styled from 'styled-components';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

import { WEBSITE_COLOR, HOW_TO_USE_EXPORT_CODE } from '@/config';

const InfoButton = styled(Button)`
  background-color: ${WEBSITE_COLOR.mainColor};
  border-color: ${WEBSITE_COLOR.mainColor};

  &:hover,
  &:focus {
    background-color: ${WEBSITE_COLOR.mainDarkerColor};
    border-color: ${WEBSITE_COLOR.mainDarkerColor};
  }

  a {
    color: white;
    text-decoration: none;
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  position: relative;

  &:before {
    content: '';
    display: block;
    padding-top: 75%;
  }

  .image-content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

interface HowToUseModalProps {
  show: boolean;
  onHide: () => void;
}

interface HowToUseModalState {
  currentPage: number;
  totalPages: number;
}

class HowToUseModal extends Component<HowToUseModalProps, HowToUseModalState> {
  state = {
    currentPage: 1,
    totalPages: HOW_TO_USE_EXPORT_CODE.length,
  };

  /**
   * 前往下一個頁面
   */
  nextPage = () => {
    if (this.state.currentPage === this.state.totalPages) {
      this.props.onHide();
      return;
    }

    this.setState((prevState) => ({
      currentPage: Math.min(prevState.currentPage + 1, prevState.totalPages),
    }));
  };

  /**
   * 前往上一個頁面
   */
  prevPage = () => {
    this.setState((prevState) => ({
      currentPage: Math.max(prevState.currentPage - 1, 1),
    }));
  };

  render() {
    const { currentPage, totalPages } = this.state;
    const { show, onHide } = this.props;
    const currentImage = HOW_TO_USE_EXPORT_CODE[currentPage - 1].image;

    return (
      <Modal show={show} onHide={onHide} centered={true}>
        <Modal.Header closeButton>
          <Modal.Title className='fw-bolder'>如何使用</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ImageContainer className='mb-2'>
            <div className='image-content'>
              <LazyLoadImage
                alt={`使用教學圖${currentPage}`}
                src={currentImage}
                effect='blur'
                className='w-100 h-100'
              />
            </div>
          </ImageContainer>
          <p>{HOW_TO_USE_EXPORT_CODE[currentPage - 1].description}</p>
        </Modal.Body>
        <Modal.Footer>
          <span className='me-auto'>
            第 {currentPage} / {totalPages} 頁
          </span>
          <Button
            variant='secondary'
            onClick={this.prevPage}
            disabled={currentPage === 1}
          >
            上一頁
          </Button>
          <InfoButton variant='success' onClick={this.nextPage}>
            {currentPage === totalPages ? '完成' : '下一頁'}
          </InfoButton>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default HowToUseModal;
