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
        const { lastname, firstname, middlename, dob, address, gender, contact_information, picture } = details;
        try {
            await db.query('UPDATE members SET lastname = ?, firstname = ?, middlename = ?, dob = ?, address = ?, gender = ?, contact_information = ?, picture = ? WHERE id = ?', 
            [lastname, firstname, middlename, dob, address, gender, contact_information, picture, id]);
        } catch (error) {
            throw error;
        }
    },

    // Add more member-related methods here if needed
};

module.exports = Member;
