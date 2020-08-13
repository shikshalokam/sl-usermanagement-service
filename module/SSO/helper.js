const punjabSSOHelper = require(MODULES_BASE_PATH + "/punjabSSO/helper")
const PUNJAB_STATE_CODE = "punjab"

module.exports = class SSOHelper {

    static login(state = "", ssoData) {
        return new Promise(async (resolve, reject) => {
            try {

                let tokenDetails;

                if (state == PUNJAB_STATE_CODE) {
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