module.exports = (req) => {

    let punjabSSOValidator = {

        encryptionService: function () {
            req.checkBody('string').exists().withMessage("String is required.")
        }

    }

    if (punjabSSOValidator[req.params.method]) punjabSSOValidator[req.params.method]();

};