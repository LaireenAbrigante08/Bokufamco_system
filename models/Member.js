const db = require('../config/db');

class Member {
    static async createMember(userId, firstName, middleName, lastName, address, dob, email, gender, contactNumber) {
        return new Promise((resolve, reject) => {
            db.query(
                'INSERT INTO members (user_id, first_name, middle_name, last_name, address, dob, email, gender, contact_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [userId, firstName, middleName, lastName, address, dob, email, gender, contactNumber],
                (err, result) => {
                    if (err) {
                        console.error("Member Model - Error during member creation:", err);
                        return reject(err);
                    }
                    console.log("Member Model - Member created successfully:", result);
                    resolve(result);
                }
            );
        });
    }

    static async findMemberByUserId(userId) {
        return new Promise((resolve, reject) => {
            db.query(
                'SELECT * FROM members WHERE user_id = ?',
                [userId],
                (err, results) => {
                    if (err) {
                        console.error("Member Model - Error finding member:", err);
                        return reject(err);
                    }
                    console.log("Member Model - Retrieved member:", results[0]);
                    resolve(results[0]);
                }
            );
        });
        
    }
    
}
// Function to update the member's status
exports.updateStatus = async (userId, status) => {
    try {
        const query = 'UPDATE members SET status = ? WHERE user_id = ?';
        const [rows] = await db.execute(query, [status, userId]);

        // Check if any rows were affected
        if (rows.affectedRows > 0) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
};

module.exports = Member;
