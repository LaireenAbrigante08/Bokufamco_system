module.exports = (db) => {
    return {
        // Fetch the first member data
        getMember: (callback) => {
            const query = 'SELECT * FROM members LIMIT 1'; // For simplicity, fetching the first member in the database
            db.query(query, callback);  // Execute the query and pass the result to the callback function
        },

        // Insert or update a member's data
        updateMember: (data, callback) => {
            const query = `
                INSERT INTO members (first_name, middle_name, last_name, address, dob, email, gender, id_number, contact_number)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                    first_name = VALUES(first_name),
                    middle_name = VALUES(middle_name),
                    last_name = VALUES(last_name),
                    address = VALUES(address),
                    dob = VALUES(dob),
                    email = VALUES(email),
                    gender = VALUES(gender),
                    id_number = VALUES(id_number),
                    contact_number = VALUES(contact_number);
            `;
            
            const values = [
                data.first_name, data.middle_name, data.last_name, data.address, data.dob, data.email,
                data.gender, data.id_number, data.contact_number
            ];
            
            db.query(query, values, callback);  // Execute the query with the provided values
        }
    };
};
