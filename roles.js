const roles = {
    admin: ['dashboard-edit','read', 'write', 'delete'],
    moderator: ['read', 'write'],
    user: ['read']
};

module.exports = roles;
