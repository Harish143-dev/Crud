import React from 'react'
import { getUsers, createUser, deleteUser, updateUser } from '../api'
import { useState } from 'react'
import { useEffect } from 'react'

const Customers = () => {

    const [users, setUsers] = useState([])
    const [isFormOpen, setFormOpen] = useState(false)
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [filterUsers, setFilterUsers] = useState([])

    const [usersData, setUsersData] = useState({
        name: "",
        email: "",
        age: '',
        city: "",
    })

    // get all users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getUsers();
                if (data) {
                    setUsers(data);
                    setFilterUsers(data);
                } else {
                    console.error("users data fetching failed");
                }
            } catch (err) {
                console.error("Error fetching users:", err);
            }
        };

        fetchUsers();
    }, []);

    // create a user
    const handleChange = (e) => {
        e.preventDefault()
        setUsersData({ ...usersData, [e.target.name]: e.target.value })
    }

    // const handleAdd = async (e) => {

    //     try {
    //         const response = await createUser(usersData);

    //         if (!response) {
    //             alert("User could not be created");
    //             return;
    //         }

    //         // // Update users state without reloading
    //         // setUsers((prev) => [...prev, response]); // assuming backend returns new user

    //         // Reset form
    //         setUsersData({ name: "", email: "", age: "", city: "" });
    //         setFormOpen(false);
    //     } catch (err) {
    //         console.error("Error creating user:", err);
    //     }
    // };


    // delete user 

    const handleDelete = async (id) => {
        try {
            const response = await deleteUser(id);
            if (response?.message) {
                setFilterUsers((prev) => prev.filter((user) => user._id !== id));
            }
        } catch (err) {
            console.error("User could not be deleted:", err);
        }
    };

    // handle update
    const handleEditClick = (user) => {
        setIsEditing(true);
        setEditId(user._id);
        setUsersData({
            name: user.name,
            email: user.email,
            age: user.age,
            city: user.city,
        });
        setFormOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (isEditing) {
                // Update user
                const response = await updateUser(usersData, editId);
                setFilterUsers((prev) =>
                    prev.map((u) =>
                        u._id === editId ? { ...u, ...usersData } : u
                    )
                );

            } else {
                // Add new user
                const response = await createUser(usersData);
                setFilterUsers((prev) => [...prev, usersData]);
            }
        } catch (err) {
            console.error("Operation failed", err);
        }

        // reset form
        setFormOpen(false);
        setIsEditing(false);
        setEditId(null);
        setUsersData({ name: "", email: "", age: "", city: "" });
    };

    // handle search 

    const handleSearch = async (e) => {
        const searchText = e.target.value.toLowerCase();
        const filteredusers = users.filter((u) => u.name.toLowerCase().includes(searchText) || u.city.toLowerCase().includes(searchText) || u.email.toLowerCase().includes(searchText))

        setFilterUsers(filteredusers)
    }

    return (
        <div className="bg-gray-100 px-10 pt-10 min-h-screen">
            <div>
                <h1 className="text-2xl font-bold mb-6 text-center">User Management</h1>

                <div className="mb-4 flex max-sm:flex-col gap-2 items-center justify-between">
                    <input
                        type="search"
                        placeholder='Search Here'
                        onChange={handleSearch}
                        className='border-1 border-gray-400 px-2 py-1 outline-0 rounded-sm md:w-60' />
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-sm font-semibold shadow hover:bg-blue-600 transition-all"
                        onClick={() => { setFormOpen(!isFormOpen) }}
                    >
                        + Add User
                    </button>
                </div>

                {/* Header */}
                <div className="max-md:hidden grid grid-cols-5 font-semibold text-gray-700 px-4 py-2">
                    <div>Name</div>
                    <div>Email</div>
                    <div className='text-center'>Age</div>
                    <div>City</div>
                    <div className="text-center">Actions</div>
                </div>

                {/* Users List */}
                <div className="space-y-3">
                    {filterUsers && filterUsers.map((user) => (
                        <div
                            key={user._id}
                            className="md:grid grid-cols-5 items-center bg-white px-4 py-3 rounded-sm shadow-sm hover:shadow-md transition-all"
                        >
                            <div>{user.name}</div>
                            <div>{user.email}</div>
                            <div className='md:text-center'>{user.age}</div>
                            <div>{user.city}</div>
                            <div className="flex justify-center space-x-2">
                                <button
                                    className="bg-green-500 text-white px-3 py-1 rounded-sm hover:bg-green-600 transition"
                                    onClick={() => handleEditClick(user)}
                                >
                                    Edit
                                </button>

                                <button
                                    className="bg-red-500 text-white px-3 py-1 rounded-sm hover:bg-red-600 transition"
                                    onClick={() => handleDelete(user._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* form for Creating and updating users*/}
            {
                isFormOpen && (
                    <div className='flex fixed z-50 left-0 top-0 w-full h-full overflow-auto backdrop-brightness-50 justify-center items-center'>

                        <form onSubmit={handleSubmit} className='relative w-[70%] bg-white p-10 shadow-2xl rounded-sm flex flex-col justify-center gap-5'>
                            <div>
                                <h1 className='font-semibold text-3xl '>Add User</h1>
                            </div>
                            <span className=' absolute top-1 right-5 cursor-pointer' onClick={() => setFormOpen(false)}>x</span>
                            <div className='flex items-center justify-between'>
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    name='name'
                                    value={usersData.name}
                                    onChange={handleChange}
                                    id='name'
                                    className='border-1 border-gray-400 px-2 py-1 w-[90%] outline-0 rounded-sm'
                                />
                            </div>
                            <div className='flex items-center justify-between'>
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    name='email'
                                    value={usersData.email}
                                    onChange={handleChange}
                                    id='email'
                                    className='border-1 border-gray-400 px-2 py-1 w-[90%] outline-0 rounded-sm'
                                />
                            </div>
                            <div className='flex items-center justify-between'>
                                <label htmlFor="age">Age</label>
                                <input
                                    type="age"
                                    name='age'
                                    value={usersData.age}
                                    onChange={handleChange}
                                    id='age'
                                    className='border-1 border-gray-400 px-2 py-1 w-[90%] outline-0 rounded-sm'
                                />
                            </div>
                            <div className='flex items-center justify-between'>
                                <label htmlFor="city">City</label>
                                <input
                                    type="city"
                                    name='city'
                                    value={usersData.city}
                                    onChange={handleChange}
                                    id='city'
                                    className='border-1 border-gray-400 px-2 py-1 w-[90%] outline-0 rounded-sm'
                                />
                            </div>
                            <div className='text-end'>
                                <button
                                    className="bg-green-500 px-5 py-2 rounded-sm text-sm font-semibold text-white hover:bg-green-700 transition-all"
                                    type="submit"
                                >
                                    {isEditing ? "Update User" : "Add User"}
                                </button>

                            </div>
                        </form>
                    </div>
                )
            }
        </div>



    )
}

export default Customers