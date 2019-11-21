module.exports = (req) => {

    let ssoValidator = {

        login: function () {
            req.checkParams('_id').exists().withMessage("required state code");
            req.checkBody('dbo').exists().withMessage("required dob");
            req.checkBody('designation').exists().withMessage("required designation");
            req.checkBody('district/office').exists().withMessage("required district/office");
            req.checkBody('facultyCode').exists().withMessage("required facultyCode");
            req.checkBody('gender').exists().withMessage("required gender");
            req.checkBody('postedAsDesignation').exists().withMessage("required postedAsDesignation");
            req.checkBody('school/location').exists().withMessage("required school/location");
            req.checkBody('staffID').exists().withMessage("required staffID");
            req.checkBody('staffName').exists().withMessage("required staffName");
            req.checkBody('staffType').exists().withMessage("required staffType");
            req.checkBody('subject').exists().withMessage("required subject");
        }

    }

    if (ssoValidator[req.params.method]) {
        ssoValidator[req.params.method]();
    }

};