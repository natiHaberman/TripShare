import axios from "axios";

export const updateUser = async (accessToken, userID, updateProperty, updateData) => {
    try {
        const response = await axios.patch(
        `https://joy-ride.herokuapp.com/user/update`,
        { userID, updateProperty, updateData},
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