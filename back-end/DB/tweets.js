const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("./config");

const Tweet = sequelize.define(
  "Tweet",
  {
    uid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
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
