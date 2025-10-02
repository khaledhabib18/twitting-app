const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("./config");

const User = sequelize.define(
  "User",
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    // Other model options go here
  }
);

console.log(User === sequelize.models.User); // true

module.exports = User;
