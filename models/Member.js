const db = require('../config/db');

class Member {
    // Create a new member
    static async createMember(userId, firstName, middleName, lastName, address, dob, email, gender, contactNumber, shareCapital) {
        return new Promise((resolve, reject) => {
            db.query(
                `INSERT INTO members 
                (user_id, first_name, middle_name, last_name, address, dob, email, gender, contact_number, share_capital) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [userId, firstName, middleName, lastName, address, dob, email, gender, contactNumber, shareCapital],
                (err, result) => {
                    if (err) {
                        console.error("Error creating member:", err);
                        return reject(err);
                    }
                    resolve(result);
                }
            );
        });
    }

    // Find a member by user ID
    static async findMemberByUserId(userId) {
        return new Promise((resolve, reject) => {
            db.query(
                'SELECT * FROM members WHERE user_id = ?',
                [userId],
                (err, results) => {
                    if (err) {
                        console.error("Error finding member:", err);
                        return reject(err);
                    }
                    resolve(results[0]);
                }
            );
        });
    }


    // Update a member's status
    static async updateStatus(userId, status) {
        try {
            const [rows] = await db.execute(
                'UPDATE members SET status = ? WHERE user_id = ?',
                [status, userId]
            );
            return rows.affectedRows > 0;
        } catch (error) {
            console.error("Error updating member status:", error);
            throw error;
        }
    }

    // Get user details by ID
    static async getUserById(userId) {
        const [rows] = await db.execute('SELECT * FROM users WHERE user_id = ?', [userId]);
        return rows[0];
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

exports.getMemberProfile = async (req, res) => {
    try {
        const [members] = await db.promise().query('SELECT * FROM members');
        res.render('member-profile', { members });
    } catch (err) {
        console.error("Error fetching member data: ", err);
        res.status(500).send('Server Error');
    }
};



module.exports = Member;
