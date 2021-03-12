const User = require('../dataBase/models/User');
require('../dataBase/models/Cars');

module.exports = {
    findAllUsers: () => User.find(),

    findUserById: (userId) => User.findById(userId),

    createUser: (userObject) => User.create(userObject),

    updateUser: (userId, userObject) => User.updateOne(userObject),

    deleteUserById: (userId) => User.findByIdAndDelete(userId)
};
