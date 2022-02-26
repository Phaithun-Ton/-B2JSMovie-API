module.exports = (sequelize, DataTypes) => {
  const TagName = sequelize.define(
    "TagName",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      description: {
        type: DataTypes.STRING,
      },
    },
    {
      underscored: true,
    }
  );
  TagName.associate = (models) => [
    TagName.belongsTo(models.User, {
      foreignKey: {
        name: "userId",
        allowNull: false,
      },
    }),
    TagName.hasMany(models.PostTagName, {
      foreignKey: {
        name: "tagNameId",
        allowNull: false,
      },
    }),
  ];
  return TagName;
};
