import axios from "axios";

const URL = 'http://localhost:3000'

export const getUsers = async () => {

    const response = await axios.get(`${URL}/users`)
    return response.data

}

// get one 

export const getUser = async () => {
    const response = await axios.get(`${URL}/users/${id}`)
    return response.data
}

// create user

export const createUser = async (user) => {
    const response = await axios.post(`${URL}/users`, user)
    return response
}

// update user

export const updateUser = async (user, id) => {
  try {
    const response = await axios.put(`${URL}/users/${id}`, user);
    return response.data; // return only the data, not full axios object
  } catch (err) {
    console.error("Error updating user:", err);
    return null; // return null on error
  }
};


// delete user
export const deleteUser = async (id) => {
    try {
        const response = await axios.delete(`${URL}/users/${id}`);
        return response.data; // returns { message: "..."} or { error: "..." }
    } catch (err) {
        console.error("Error deleting user:", err);
        throw err; // let the component handle the error
    }
};