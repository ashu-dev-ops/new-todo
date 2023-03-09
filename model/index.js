const dbConfig = require("../db/config");

const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
//   operatorsAliases: false,

  //   pool: {
  //     max: dbConfig.pool.max,
  //     min: dbConfig.pool.min,
  //     acquire: dbConfig.pool.acquire,
  //     idle: dbConfig.pool.idle,
  //   },
});
sequelize
  .authenticate()
  .then(() => {
    console.log("connected..");
  })
  .catch((err) => {
    console.log("Error" + err);
  });
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.user = require("./userModel")(sequelize, DataTypes);
db.task = require("./taskModel")(sequelize, DataTypes);

db.sequelize.sync({ force: false }).then(() => {
  console.log("yes re-sync done!");
});
// 1 to Many Relation

db.user.hasMany(db.task, {//child
  foreignKey: "user_id", //this id id for task tabel beacuse tasks need to track of their user
  as: "task", //connect user/parent with  task/child
});

db.task.belongsTo(db.user, {//parent
  foreignKey: "user_id",//foreign key should be same as parent
  as: "user", //connect task/child with user/parent
});

module.exports = db;
