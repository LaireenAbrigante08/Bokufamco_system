const Member = require('../models/Member'); // Adjust the path based on your project structure

// Function to render the member form or view a member
const getMemberForm = (req, res) => {
    const memberId = req.params.id;

    Member.getMember(memberId)
        .then(member => {
            // If the member exists, render the form and pass the member data
            if (member) {
                res.render('member-form', { member });
            } else {
                res.status(404).send('Member not found');
            }
        })
        .catch(err => {
            console.error('Error retrieving member:', err);
            res.status(500).send('Internal Server Error');
        });
};

// Handle form submission and update the member's data
const updateMember = (req, res) => {
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

    Member.updateMember(req.params.id, memberData)
        .then(() => {
            // Set a success message in the session
            req.session.successMessage = "Member information updated successfully!";
            // Redirect to the members list page after saving
            res.redirect('/members');
        })
        .catch(err => {
            console.log(err);
            return res.status(500).send("Error updating member data");
        });
};

module.exports = { getMemberForm, updateMember };
