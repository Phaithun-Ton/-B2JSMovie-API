module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    "Post",
    {
      title: DataTypes.TEXT,
      content: DataTypes.TEXT,
    },
    {
      underscored: true,
      paranoid: true,
    }
  );
  Post.associate = (models) => {
    Post.belongsTo(models.User, {
      foreignKey: {
        name: "userId",
        allowNull: false,
      },
    });
    Post.hasMany(models.PostTagName, {
      foreignKey: {
        name: "postId",
        allowNull: false,
      },
    });
    Post.hasMany(models.Comment, {
      foreignKey: {
        name: "postId",
        allowNull: false,
      },
    });
    Post.hasMany(models.Like, {
      foreignKey: {
        name: "postId",
        allowNull: false,
      },
    });
    Post.hasMany(models.PostImg, {
      foreignKey: {
        name: "postId",
        allowNull: false,
      },
    });
  };
  return Post;
};
