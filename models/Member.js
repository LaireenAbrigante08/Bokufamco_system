// models/member.js
module.exports = (db) => {
    return {
        getMemberByUserId: (userId, callback) => {
            const query = 'SELECT * FROM members WHERE user_id = ?';
            db.query(query, [userId], (err, results) => {
                if (err) return callback(err);
                callback(null, results[0]); // Return the first result if found
            });
        },

        createMember: (data, callback) => {
            const query = `
                INSERT INTO members (user_id, first_name, middle_name, last_name, address, dob, email, gender, contact_number)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const values = [
                data.user_id, data.first_name, data.middle_name, data.last_name,
                data.address, data.dob, data.email, data.gender, data.contact_number
            ];
            db.query(query, values, callback);
        },

        updateMember: (userId, data, callback) => {
            const query = `
                UPDATE members
                SET first_name = ?, middle_name = ?, last_name = ?, address = ?, dob = ?, email = ?, gender = ?, contact_number = ?
                WHERE user_id = ?
            `;
            const values = [
                data.first_name, data.middle_name, data.last_name, data.address,
                data.dob, data.email, data.gender, data.contact_number, userId
            ];
            db.query(query, values, callback);
        }
    };
};
