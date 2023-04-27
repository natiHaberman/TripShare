import React, { useState } from 'react';
import Modal from '../../UIElements/Modal/Modal';
import Stars from '../../UIElements/Stars';

function ConfirmModal({ show, onCancel, onConfirm }) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const handleConfirm = () => {
    onConfirm(rating, review);
    setRating(0);
    setReview('');
  };

  return (
    <Modal
      show={show}
      onCancel={onCancel}
      header="Finish Ride"
      footer={
        <div className="modal-options">
          <button className="modal-confirm-button" onClick={handleConfirm}>
            Continue
          </button>
          <button className="modal-cancel-button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      }
    >
      <p>How was your ride?</p>
      <Stars
        rating={rating}
        interactive={true}
        onRatingChange={(newRating) => setRating(newRating)}
      />
      <p>Write a review:</p>
      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        rows="4"
        cols="50"
        placeholder="Share your experience..."
      />
    </Modal>
  );
}

export default ConfirmModal;