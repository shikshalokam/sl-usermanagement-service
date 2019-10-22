module.exports = (req) => {

    let punjabSSOValidator = {

        encryptionService: function () {
            req.checkBody('string').exists().withMessage("String is required.").isLength({ min: 3, max : 100 }).withMessage("Invalid String.")
        },

        staffLogin: function () {
            req.checkBody('staffID').exists().withMessage("Staff ID is required.").isLength({ min: 5, max : 10 }).withMessage("Invalid Staff ID.")
            req.checkBody('password').exists().withMessage("Password is required.").isLength({ min: 5 }).withMessage("Invalid Password.")
        },

        forgotPassword: function () {
            req.checkBody('staffID').exists().withMessage("Staff ID is required.").isLength({ min: 5, max : 10 }).withMessage("Invalid Staff ID.")
            req.checkBody('registeredMobileNo').exists().withMessage("Mobile No is required.").isLength({ min: 10, max:10 }).withMessage("Invalid Mobile No.")
        },

        resetPassword: function () {
            req.checkBody('facultyCode').exists().withMessage("Faculty Code is required.").isLength({ min: 2, max : 10 }).withMessage("Invalid Faculty Code.")
            req.checkBody('oldPassword').exists().withMessage("Old Password is required.").isLength({ min: 2, max:100 }).withMessage("Invalid Old Password.")
            req.checkBody('password').exists().withMessage("Password is required.").isLength({ min: 2, max:100 }).withMessage("Invalid Password.")
            req.checkBody('confirmPassword').exists().withMessage("New Password is required.").isLength({ min: 2, max:100 }).withMessage("Invalid Confirm Password.")
        }
    }

    if (punjabSSOValidator[req.params.method]) punjabSSOValidator[req.params.method]();

};