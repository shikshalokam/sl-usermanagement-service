const punjabSSOHelper = require(ROOT_PATH + "/module/punjabSSO/helper")

module.exports = class SSOHelper {

    static login(ssoData) {
        return new Promise(async (resolve, reject) => {
            try {

                let tokenDetails;

                if (ssoData.punjabSSO) {
                    tokenDetails = await punjabSSOHelper.getKeyCloakAuthToken(ssoData.staffID, ssoData);
                }

                return resolve(tokenDetails)
            }
            catch (error) {
                return reject(error);
            }
        })
    }

};