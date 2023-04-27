import React, { useState, useRef, useEffect, useContext } from "react";
import { findUser } from "../../../api/findUser";
import { updateUser } from "../../../api/updateUser";
import { AuthContext } from "../../../context/auth-context";
import { fetchReviews } from "../../../api/getReviews";
import Stars from "../../UIElements/Stars";
import LoadingSpinner from "../../UIElements/LoadingSpinner/LoadingSpinner";
import "./Profile.css";

// Page where a user can see and edit their profile
const Profile = () => {
  const carModelInputRef = useRef();
  const emailInputRef = useRef();
  const [currentEmail, setCurrentEmail] = useState("");
  const [currentCarModel, setCurrentCarModel] = useState("");
  const { userID, accessToken } = useContext(AuthContext);
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [reviews, setReviews] = useState([]);

  // Fetches user data and reviews on mount
  useEffect(() => {
    setIsLoading(true);
    (async () => {
      const user = await findUser(userID, accessToken);
      setUser(user);
      setCurrentEmail(user.email || "");
      setCurrentCarModel(user.model || "");
      const reviewsData = await fetchReviews(accessToken, userID, "subject");
      setReviews(reviewsData);
    })();
    setIsLoading(false);
  }, [user.email, user.carModel,  userID, accessToken]);
  

  // Updates user data
  const handleSaveChanges = async () => {
    setIsLoading(true);
    if (currentEmail !== user.email) {
      try {
        const updateProperty = "email";
        await updateUser(accessToken, userID, updateProperty, currentEmail);
        alert("Changes saved!");
      } catch (error) {
        setIsLoading(false);
        alert(error.message);
      }
    }
    if (currentCarModel !== user.model) {
      try {
        const updateProperty = "model";
        await updateUser(accessToken, userID, updateProperty, currentCarModel);
        alert("Changes saved!");
      } catch (error) {
        setIsLoading(false);
        alert(error.message);
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="user-profile">
      {isLoading && <LoadingSpinner asOverlay />}
      <div className="user-info">
        <h2>Username: {user.username}</h2>
        <div className="inline-field">
          <h3>Email:</h3>
          <div className="edit-field">
            <input
              value={currentEmail}
              className="input-field"
              ref={emailInputRef}
              onChange={(event) => {
                setCurrentEmail(event.target.value);
              }}
            />
          </div>
        </div>
        <div className="inline-field">
          <h3>Model:</h3>
          <div className="edit-field">
            <input
              value={currentCarModel}
              className="input-field"
              ref={carModelInputRef}
              onChange={(event) => {
                setCurrentCarModel(event.target.value);
              }}
            />
          </div>
        </div>
        <h3>Rides Given: {user.ridesGiven}</h3>
        <h3>Rides Taken: {user.ridesTaken}</h3>
        <h3>
           Rating: {user.rating && <Stars rating={user.rating} />}
        </h3>
        <h3>Reviews:</h3>
        <ul>
          {reviews.map((review, index) => (
            <li key={index}>{review.text} <Stars rating={review.rating}/></li>
          ))}
        </ul>
        {(user.email !== currentEmail || user.model !== currentCarModel) && (
          <div className="center">
            <button className="confirm-button" onClick={handleSaveChanges}>
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
