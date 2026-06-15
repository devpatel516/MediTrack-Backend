const User = require('../models/User');

const getAuthorizedTargetUser = async (req, userIdParam) => {
    const loggedInUser = req.user;
    const targetUserId = userIdParam || loggedInUser.id;

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
        return { errorStatus: 404, errorMessage: 'User not found' };
    }

    if (loggedInUser.id !== targetUserId) {
        if (loggedInUser.role === 'patient') {
            return { errorStatus: 403, errorMessage: 'Access denied. Patients can only access their own data.' };
        }

        if (loggedInUser.role === 'doctor' && targetUser.role !== 'patient') {
            return { errorStatus: 403, errorMessage: 'Access denied. Doctors can only access patient profiles.' };
        }
    }

    return { user: targetUser };
};

const getAllergies = async (req, res) => {
    try {
        const { user, errorStatus, errorMessage } = await getAuthorizedTargetUser(req, req.params.userId);
        if (errorStatus) {
            return res.status(errorStatus).json({ error: errorMessage });
        }

        res.status(200).json({ allergies: user.allergies });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateAllergies = async (req, res) => {
    try {
        const { allergies } = req.body;

        // Input validation: Must be an array of strings
        if (allergies === undefined || !Array.isArray(allergies)) {
            return res.status(400).json({ error: 'Invalid input. "allergies" must be an array of strings.' });
        }

        const allStrings = allergies.every(item => typeof item === 'string');
        if (!allStrings) {
            return res.status(400).json({ error: 'Invalid input. All elements in the allergies array must be strings.' });
        }

        const { user, errorStatus, errorMessage } = await getAuthorizedTargetUser(req, req.params.userId);
        if (errorStatus) {
            return res.status(errorStatus).json({ error: errorMessage });
        }

        const cleanedAllergies = allergies.map(allergy => allergy.trim());

        user.allergies = cleanedAllergies;
        await user.save();

        res.status(200).json({ message: 'Allergies updated successfully', allergies: user.allergies });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllergies,
    updateAllergies
};
