// controllers/memberController.js
module.exports = (db) => {
    return {
        // Fetch member data and render the form
        getMemberForm: (req, res) => {
            const memberModel = require('../models/member')(db); // Import the member model with db connection

            memberModel.getMember((err, results) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send("Error fetching member data");
                }

                const user = results.length > 0 ? results[0] : null;
                res.render('memberInformation', { user, successMessage: req.session.successMessage }); // Pass success message to the view
                delete req.session.successMessage; // Remove message after it's displayed
            });
        },

        // Handle form submission and update the member's data
        updateMember: (req, res) => {
            const { first, middle, last, address, dob, email, gender, idnum, number } = req.body;

            const memberData = {
                first_name: first,
                middle_name: middle,
                last_name: last,
                address: address,
                dob: dob,
                email: email,
                gender: gender,
                id_number: idnum,
                contact_number: number
            };

            const memberModel = require('../models/member')(db);

            memberModel.updateMember(memberData, (err, results) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send("Error updating member data");
                }

                // Set a success message in the session
                req.session.successMessage = "Member information updated successfully!";
                
                // Redirect to the form page after saving
                res.redirect('/members');
            });
        }
    };
};
