// controllers/memberController.js
module.exports = (db) => {
    return {
        // Fetch member data and render the form
        getMemberForm: (req, res) => {
            const memberModel = require('../models/member')(db);

            const userId = req.session.user?.id;
            if (!userId) {
                return res.status(401).send("User not authenticated.");
            }

            memberModel.getMemberByUserId(userId, (err, user) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send("Error fetching member data");
                }
                res.render('memberInformation', { user, successMessage: req.session.successMessage });
                delete req.session.successMessage;
            });
        },

        // Handle form submission: insert or update member data
        saveMemberData: (req, res) => {
            const { first_name, middle_name, last_name, address, dob, email, gender, contact_number } = req.body;
            const userId = req.session.user?.id;

            if (!userId) {
                return res.status(401).send("User not authenticated.");
            }

            const memberData = {
                first_name,
                middle_name,
                last_name,
                address,
                dob,
                email,
                gender,
                contact_number,
                user_id: userId
            };

            const memberModel = require('../models/member')(db);

            memberModel.getMemberByUserId(userId, (err, user) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send("Error checking member data");
                }

                if (user) {
                    // If user data exists, update it
                    memberModel.updateMember(userId, memberData, (err) => {
                        if (err) {
                            console.log("Error updating member data:", err);
                            return res.status(500).send("Error updating member data");
                        }
                        req.session.successMessage = "Member information updated successfully!";
                        res.redirect('/members');
                    });
                } else {
                    // If no user data, create a new record
                    memberModel.createMember(memberData, (err) => {
                        if (err) {
                            console.log("Error creating member data:", err);
                            return res.status(500).send("Error creating member data");
                        }
                        req.session.successMessage = "Member information saved successfully!";
                        res.redirect('/members');
                    });
                }
            });
        }
    };
};
