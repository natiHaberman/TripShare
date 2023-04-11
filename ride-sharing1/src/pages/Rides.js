import React from 'react';

import { NavLink } from 'react-router-dom';
import Stars from '../UIElements/Stars';
import './Rides.css';

const Rides = () => {
  const rides = [
    {
      name: 'John Doe',
      rating: 4.5,
      startPoint: 'New York, NY',
      endPoint: 'Boston, MA',
      departureTime: '09:00 AM',
      role: 'Driver',
    },
    {
      name: 'Jane Smith',
      rating: 2.7,
      startPoint: 'Los Angeles, CA',
      endPoint: 'San Francisco, CA',
      departureTime: '02:00 PM',
      role: 'Passenger',
    },
    {
      name: 'Michael Brown',
      rating: 3.3,
      startPoint: 'Chicago, IL',
      endPoint: 'Milwaukee, WI',
      departureTime: '06:30 AM',
      role: 'Driver',
    },    {
      name: 'Emma Johnson',
      rating: 4.2,
      startPoint: 'Seattle, WA',
      endPoint: 'Portland, OR',
      departureTime: '08:00 AM',
      role: 'Passenger',
    },
    {
      name: 'Sophia Williams',
      rating: 3.7,
      startPoint: 'Houston, TX',
      endPoint: 'Austin, TX',
      departureTime: '01:30 PM',
      role: 'Driver',
    },
    {
      name: 'Olivia Jones',
      rating: 5.0,
      startPoint: 'Miami, FL',
      endPoint: 'Orlando, FL',
      departureTime: '04:00 PM',
      role: 'Passenger',
    },
  ];


  return (
    <div className="find-rides-page">
      <ul className="rides-list">
        {rides.map((ride, index) => (
          <li key={index} className="ride-item">
            <div className="ride-info">
              <h3>{ride.name} ({ride.role})</h3>
              <p>Rating: <Stars rating={ride.rating}/></p>
              <p>Start: {ride.startPoint}</p>
              <p>End: {ride.endPoint}</p>
              <p>Departure Time: {ride.departureTime}</p>
            </div>
            <NavLink className="join-button" to="/new" state={ride}>Join</NavLink>          </li>
        ))}
      </ul>
    </div>
  );
};

export default Rides;