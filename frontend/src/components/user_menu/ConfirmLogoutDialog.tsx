import React from "react";
import { ToastContainer, toast } from "react-toastify";
import { Modal, Button } from "react-bootstrap";

interface ConfirmLogoutDialogProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmLogoutDialog: React.FC<ConfirmLogoutDialogProps> = ({
  show,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Warning</Modal.Title>
      </Modal.Header>
      <Modal.Body>Do you want to logout?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          No
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          Yes
        </Button>
      </Modal.Footer>
      <ToastContainer />
    </Modal>
  );
};

export default ConfirmLogoutDialog;
