const Profile = require('../models/Profile.model.js');

// --- Get User Profile Logic ---
const getProfile = async (req, res) => {
    try {
        // req.user.id is available because our authMiddleware added it.
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'email']);

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found for this user' });
        }
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// --- Create or Update User Profile Logic ---
const updateProfile = async (req, res) => {
    // We get all the profile data from the request body
    const profileData = req.body;

    try {
        // Find a profile by the user's ID (which we get from the token via middleware)
        let profile = await Profile.findOne({ user: req.user.id });

        if (profile) {
            // If profile exists, update it
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileData },
                { new: true } // This option returns the document after it's been updated
            );
            return res.json(profile);
        }

        // If no profile exists, create a new one
        profile = new Profile({
            user: req.user.id,
            ...profileData
        });

        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


module.exports = { getProfile, updateProfile };