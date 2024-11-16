const db = require('../config/db'); // Adjust if your DB configuration is different

class Member {
    // Find member by user ID
    static findMemberByUserId(userId) {
        return new Promise((resolve, reject) => {
            db.query(
                'SELECT * FROM members WHERE user_id = ?',
                [userId],
                (err, results) => {
                    if (err) {
                        console.error("Error finding member:", err);
                        return reject(err);
                    }
                    if (results.length > 0) {
                        resolve(results[0]); // Return the first matching member
                    } else {
                        resolve(null); // No member found
                    }
                }
            );
        });
    }

    static async updateMember(memberId, memberData) {
        return new Promise((resolve, reject) => {
            const { first_name, middle_name, last_name, address, dob, email, gender, id_number, contact_number } = memberData;
            db.query(
                'UPDATE members SET first_name = ?, middle_name = ?, last_name = ?, address = ?, dob = ?, email = ?, gender = ?, id_number = ?, contact_number = ? WHERE id = ?',
                [first_name, middle_name, last_name, address, dob, email, gender, id_number, contact_number, memberId],
                (err, result) => {
                    if (err) {
                        console.error("Error updating member:", err);
                        return reject(err);
                    }
                    resolve(result);
                }
            );
        });
    }
}

module.exports = Member;
