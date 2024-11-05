const db = require('../config/db');

const Member = {
    findById: async (id) => {
        try {
            const [member] = await db.query('SELECT * FROM members WHERE id = ?', [id]);
            return member[0]; // Return single member or undefined if not found
        } catch (error) {
            throw error;
        }
    },

    updateMember: async (id, details) => {
        const { name, email, phone, address, picture } = details;
        try {
            await db.query('UPDATE members SET name = ?, email = ?, phone = ?, address = ?, picture = ? WHERE id = ?', 
            [name, email, phone, address, picture, id]);
        } catch (error) {
            throw error;
        }
    },

    // Add more member-related methods here if needed
};

module.exports = Member;
