import User from '../Models/userModel.js';


// Signup Controller
export const signup = async (req, res) => {
    const { first_name, last_name, email, password } = req.body;

    try {
        // Create a new user document
        const newUser = new User({
            first_name,
            last_name,
            email,
            password
        });

        // Save the user to the database
        const savedUser = await newUser.save();
        
        // Send the userId as a response
        res.status(201).json({ message: 'User created successfully', userId: savedUser._id });
    } catch (err) {
        console.log(err);
        res.status(500).send('Error creating user');
    }
};


// Login Controller
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email, password });
        if (user) {
            res.status(200).json({ message: 'Login successful', userId: user._id });
        } else {
            res.status(401).send('Invalid email or password');
        }
    } catch (err) {
        res.status(500).send('Error logging in');
    }
};