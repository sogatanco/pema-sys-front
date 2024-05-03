import React, { useState } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const UploadFile = () => {
  const [modal, setModal] = useState(true);

  const toggle = () => {
    setModal(!modal);
  };

  return (
    <Modal isOpen={modal} toggle={toggle.bind(null)}>
      <ModalHeader toggle={toggle.bind(null)}>Modal title</ModalHeader>
      <ModalBody>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
        voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
        cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={toggle.bind(null)}>
          Do Something
        </Button>
        <Button color="secondary" onClick={toggle.bind(null)}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default UploadFile;
