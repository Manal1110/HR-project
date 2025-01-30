const User= require('../models/User')

const asyncHandler= require('express-async-handler')
const bcrypt= require('bcrypt')


// @desc Get all users
// @route Get /users
// @access Private

const getAllUsers= asyncHandler(async(req, res)=>{
    const users= await User.find().select('-password').lean()
    if (!users?.length){
        return res.status(400).json({message: 'No users found'})
    }
    res.json(users)
})

// @desc create new users
// @route Post /users
// @access Private

const createNewUser= asyncHandler(async(req, res)=>{
    const {username, password, roles}=req.body

    if(!username||!password || !Array.isArray(roles)||!roles.length){
        return res.status(400).json({message:'All fields are required'})
    }

    // check for duplicate
    const duplicate=await User.findOne({username}).lean().exec()

    if(duplicate){
        return res.status(409).json({message: 'Duplicate username'})
    }

    // hash password
    const hashedPwd= await bcrypt.hash(password, 10)// salt rounds

    const userObject={username, "password":hashedPwd, roles}

    // create and store new user
    const user=await User.create(userObject)

    if(user){
        //created
        res.status(201).json({message:`New user ${username} created `})

    } else{
        res.status(400).json({message: 'Invalid user data received'})
    }
})

// @desc Update user
// @route PATCH /users
// @access Private

// usersController.js

const updateUser = asyncHandler(async (req, res) => {
    const { id, username, roles, active } = req.body;

    // Validate required fields
    if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const user = await User.findById(id).exec();

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Check for duplicate username
        const duplicate = await User.findOne({ username }).lean().exec();
        if (duplicate && duplicate._id.toString() !== id) {
            return res.status(409).json({ message: 'Duplicate username' });
        }

        // Update user properties
        user.username = username;
        user.roles = roles;
        user.active = active;

        const updatedUser = await user.save();

        res.json({ message: `${updatedUser.username} updated` });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});



// @desc Delete a user
// @route DELETE /users
// @access Private

const deleteUser= asyncHandler(async(req, res)=>{
    const{id}= req.body

    if(!id){
        return res.status(400).json({message:'User id required'})

    }

    const user=await User.findById(id).exec()

    if (!user){
        return res.status(400).json({message:'User not found'})

    }

    const result=await user.deleteOne()

    const reply= `Username ${result.username} with ID ${result._id} deleted`

    res.json(reply)
})

// @desc Get the single user
// @route GET /users/single
// @access Private


module.exports={
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser,
    
}