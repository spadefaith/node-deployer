module.exports = function (sequelize, DataTypes) {
	const entity = sequelize.define(
		'accounts',
		{
			account_id: {
				autoIncrement: true,
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true
			},
			first_name: DataTypes.STRING(100),
			last_name: DataTypes.STRING(100),
			username: {
				type: DataTypes.STRING(100),
				unique: true
			},
			password: DataTypes.STRING(100),
			email: DataTypes.STRING(100),
			otp: DataTypes.STRING(100),
			role_id: {
				type: DataTypes.INTEGER,
				references: {
					model: 'roles',
					key: 'role_id'
				}
			},
			last_login_dt: DataTypes.DATE,
			provider: DataTypes.STRING,

			created_by: DataTypes.INTEGER,
			modified_by: DataTypes.INTEGER,
			is_active: {
				type: DataTypes.INTEGER,
				defaultValue: 1
			},
			modified_dt: {
				type: DataTypes.DATE,
				defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
			},
			created_dt: {
				type: DataTypes.DATE,
				defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
			}
		},
		{
			sequelize,
			timestamps: true,
			createdAt: 'created_dt',
			updatedAt: 'modified_dt',
			indexes: [
				{
					name: 'PRIMARY',
					unique: true,
					using: 'BTREE',
					fields: [{ name: 'account_id' }]
				},
				{
					name: 'first_name_last_name',
					unique: true,
					using: 'BTREE',
					fields: [{ name: 'first_name' }, { name: 'last_name' }]
				},
				{
					name: 'otp',
					unique: true,
					using: 'BTREE',
					fields: [{ name: 'otp' }]
				},
				{
					name: 'email',
					unique: true,
					using: 'BTREE',
					fields: [{ name: 'email' }]
				},
				{
					name: 'username',
					unique: true,
					using: 'BTREE',
					fields: [{ name: 'username' }]
				}
			]
		}
	);

	return entity;
};
