module.exports = (req) => {

    let userProfileValidator = {

        create: function () {
            req.checkBody('userId').exists().withMessage("required user Id");
            req.checkBody('firstName').exists().withMessage("required firstName");
            req.checkBody('externalId').exists().withMessage("required externalId");
            req.checkBody('state').exists().withMessage("required state name");
        }

    }

    if (userProfileValidator[req.params.method]) {
        userProfileValidator[req.params.method]();
    }

};