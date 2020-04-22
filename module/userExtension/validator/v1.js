module.exports = (req) => {

    let userExtensionValidator = {

        list: function () {
            // req.checkQuery('type').exists().withMessage("required type")
            // req.checkParams('_id').exists().withMessage("required entity id").isMongoId().withMessage("invalid entity id")
        }


    }

    if (userExtensionValidator[req.params.method]) userExtensionValidator[req.params.method]();

};