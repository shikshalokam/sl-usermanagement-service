module.exports = (req) => {

    let userProfileValidator = {

        create: function () {
            req.checkBody('userId').exists().withMessage("required user Id");
        }

    }

    if (userProfileValidator[req.params.method]) {
        userProfileValidator[req.params.method]();
    }

};