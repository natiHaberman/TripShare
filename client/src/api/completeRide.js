import axios from 'axios';
export const completeRide = async (rideID, userID, accessToken) => {
    try {
        const response = await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/rides/complete`,
        { rideID, userID },
        {
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            },
            withCredentials: true,
        }
        );
        return response;
    } catch (error) {
        throw new Error(error.response.data);
    }
}