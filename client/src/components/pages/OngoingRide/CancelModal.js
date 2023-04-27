import React from 'react';
import Modal from '../../UIElements/Modal/Modal';


function CancelModal({ show, onCancel, onConfirm }) {
  return (
    <Modal
      show={show}
      onCancel={onCancel}
      header="Cancel Ride"
      footer={
        <div className="modal-options">
          <button className="modal-confirm-button" onClick={onConfirm}>
            Continue
          </button>
          <button className="modal-cancel-button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      }
    >
      <p>Are you sure you want to cancel your ride?</p>
    </Modal>
  );
}

export default CancelModal;