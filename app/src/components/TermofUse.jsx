import React, { Component } from 'react';
import { Modal, Button, Form, Card } from 'react-bootstrap';
import { entryNotificationConfig } from '../config';
import styled from 'styled-components';
import { websiteColor } from '../config';

const TextWithIcon = styled(Card.Text)`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-weight: bold;

  svg {
    margin: 0 8px;
  }
`;

const FillFormButton = styled(Button)`
  background-color: ${websiteColor.mainColor};
  border-color: ${websiteColor.mainColor};

  &:hover,
  &:focus {
    background-color: ${websiteColor.mainDarkerColor};
    border-color: ${websiteColor.mainDarkerColor};
  }

  a {
    color: white;
    text-decoration: none;
  }
`;

class TermofUse extends Component {
  state = {
    show: false,
  };

  /**
   * 渲染列表
   * @param items {string[]} 列表項目
   * @returns {JSX.Element[]} 列表元素
   */
  renderList(items) {
    return items.map((item, index) => <li key={index}>{item}</li>);
  }

  /**
   * 關閉 Modal
   */
  handleClose = () => {
    this.setState({ show: false });
  };

  render() {
    return (
      <Modal show={this.state.show} onHide={this.handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <TextWithIcon>
              <Megaphone />
              使用條款 Terms of Use
            </TextWithIcon>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          testestestestsestsetsetsetset
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={this.handleClose}>
            關閉
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default TermofUse;
