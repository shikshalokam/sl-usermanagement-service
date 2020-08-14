module.exports = (req) => {

    let userExtensionValidator = {

        create: function () {
            req.checkBody('firstName').exists().withMessage("required firstName");
            req.checkBody('userName').exists().withMessage("required userName");
            req.checkBody('lastName').exists().withMessage("required lastName"); 
            req.checkBody('organisation').exists().withMessage("required organisation");
            req.checkBody('roles').exists().withMessage("required roles");
            req.checkBody('password').exists().withMessage("required password");
        },
        activate: function () {
            req.checkBody('userId').exists().withMessage("required userId");
        },
        getProfile: function() {
            req.checkParams('_id').exists().withMessage("required user id");
        },
        inactivate: function() {
            req.checkBody('userId').exists().withMessage("required userId");
        }
    }

    if (userExtensionValidator[req.params.method]) userExtensionValidator[req.params.method]();





};