module.exports = (sequelize, DataTypes) => {
  const PostImg = sequelize.define(
    "PostImg",
    {
      imgUrl: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
    },
    {
      underscored: true,
    }
  );
  PostImg.associate = (models) => {
    PostImg.belongsTo(models.Post, {
      foreignKey: {
        name: "postId",
        allowNull: false,
      },
    });
  };
  return PostImg;
};
