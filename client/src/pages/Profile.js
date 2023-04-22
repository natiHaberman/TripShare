import React, { useState, useRef } from "react";
import Stars from "../UIElements/Stars";
import {findUser} from "../api/findUser";
import "./Profile.css";

const Profile = () => {


  // useEffect(() => {
  //   (async () => {
  //     const user = await findUser();
  //     setUser(user);
  //   })();
  // }, []);

  const user = {
    name: "John Doe",
    email: "john@gmail.com",
    carModel: "Tesla Model 3",
    ridesGiven: 12,
    ridesTaken: 8,
    rating: 4.5,
    reviews: [
      "Great driver! Very friendly and punctual.",
      "The car was clean and comfortable. Highly recommended!",
      "John was very polite and a safe driver. I enjoyed my ride with him.",
    ],
  };

  const [editEmail, setEditEmail] = useState(false);
  const [editCarModel, setEditCarModel] = useState(false);
  const handleEditEmail = () => {
    setEditCarModel(false);
    setEditEmail((prevState) => !prevState);
    if (!editEmail) {
      setTimeout(() => {
        emailInputRef.current.focus();
      }, 0);
    }
  };
  const handleEditCarModel = () => {
    setEditEmail(false);
    setEditCarModel((prevState) => !prevState);
    if (!editCarModel) {
      setTimeout(() => {
        carModelInputRef.current.focus();
      }, 0);
    }
  };
  const carModelInputRef = useRef();
  const emailInputRef = useRef();
  const [currentEmail, setCurrentEmail] = useState(user.email);
  const [currentCarModel, setCurrentCarModel] = useState(user.carModel);

  return (
    <div className="user-profile">
      <div className="user-info">
        <h2>Name: {user.name}</h2>
        <div className="inline-field">
          <h3>Email:</h3>
          <div className="edit-field">
            <input value={currentEmail} className="input-field" ref={emailInputRef} onChange={(event) =>{setCurrentEmail(event.target.value)}}/>
            <button onClick={handleEditEmail} className="edit-button">
              {editEmail ? (
                <i
                  className="fa fa-pencil"
                  style={{ color: "var(--yellow)" }}
                ></i>
              ) : (
                <i className="fa fa-pencil"></i>
              )}
            </button>
          </div>
        </div>
        <div className="inline-field">
          <h3>Model:</h3>
          <div className="edit-field">
            <input
              value={currentCarModel}
              className="input-field"
              ref={carModelInputRef}
              onChange={(event) =>{setCurrentCarModel(event.target.value)}}
            />
            <button onClick={handleEditCarModel} className="edit-button">
              {editCarModel ? (
                <i
                  className="fa fa-pencil"
                  style={{ color: "var(--yellow)" }}
                ></i>
              ) : (
                <i className="fa fa-pencil"></i>
              )}
            </button>
          </div>
        </div>
        <h3>Rides Given: {user.ridesGiven}</h3>
        <h3>Rides Taken: {user.ridesTaken}</h3>
        <h3>
          Rating: <Stars rating={user.rating} />
        </h3>
        <h3>Reviews:</h3>
        <ul>
          {user.reviews.map((review, index) => (
            <li key={index}>{review}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Profile;
