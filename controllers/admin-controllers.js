const User = require("../userDetails");

const getAllUsers = async (req, res, next) => {
    try {
        // Find all users who are not admins
        const users = await User.find({ role: { $ne: 'admin' } });
        
        if (!users || users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }

        return res.status(200).json(users);
    } catch (err) {
        next(err); 
    }
};

const deleteUsers = async (req, res) => {
    try {
        const userId = req.params.id;
        
        // Find the user by ID and delete
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {getAllUsers,deleteUsers};
