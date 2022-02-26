module.exports = (sequelize, DataTypes) => {
  const PostTagName = sequelize.define(
    "PostTagName",
    {},
    {
      underscored: true,
    }
  );
  PostTagName.associate = (models) => {
    PostTagName.belongsTo(models.Post, {
      foreignKey: {
        name: "postId",
        allowNull: false,
      },
    });
    PostTagName.belongsTo(models.TagName, {
      foreignKey: {
        name: "tagNameId",
        allowNull: false,
      },
    });
  };
  return PostTagName;
};
