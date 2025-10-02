const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("./config");

const Tweet = sequelize.define(
  "Tweet",
  {
    userid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    // Other model options go here
  }
);

console.log(Tweet === sequelize.models.User); // true

module.exports = Tweet;
