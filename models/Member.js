const db = require('../config/db'); // Adjust the path to your database connection

class Member {
    static getAllMembers() {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM members', (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }

    static getMemberById(id) {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM members WHERE id = ?', [id], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results[0]);
                }
            });
        });
    }
}

module.exports = Member;
