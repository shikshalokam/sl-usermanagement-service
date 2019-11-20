let ssoHelpers = require(ROOT_PATH + "/module/SSO/helper");

module.exports = class SSO {

    /**
     * @apiDefine errorBody
     * @apiError {String} status 4XX,5XX
     * @apiError {String} message Error
     */

    /**
     * @apiDefine successBody
     *  @apiSuccess {String} status 200
     * @apiSuccess {String} result Data
     */

    constructor() {
    }

    static get name() {
        return "sso";
    }


    /**
    * @api {post} /user-management/api/v1/SSO/login SSO Login
    * @apiVersion 1.0.0
    * @apiName language SSO Login
    * @apiGroup SSO
    * @apiHeader {String} X-authenticated-user-token Authenticity token
    * @apiSampleRequest /user-management/api/v1/SSO/login
    * @apiUse successBody
    * @apiUse errorBody
    *  @apiParamExample {json} Request-Body:
    *{ 
        "dbo":"dateOfBirth",
        "designation":"designation",
        "district/office":"district/office",
        "facultyCode":"facultyCode",
        "gender":"gender should be either boy or girl",
        "postedAsDesignation":"Designation",
        "school/location":"school",
        "staffID":"staffId",
        "staffName":"staffname",
        "staffType":"0",
        "subject":"eg:computer science",
        "punjabSSO":true
    }
    * @apiParamExample {json} Response:
    * {
    "message": "Login credentials verified successfully.",
    "status": 200,
    "result": {
        "facultyCode": "",
        "staffID": "",
        "district/office": "",
        "school/location": "",
        "staffName": "",
        "dbo": "",
        "gender": "",
        "designation": "",
        "subject": "",
        "staffType": "",
        "postedAsDesignation": "",
        "tokenDetails": {
            "access_token": "User access token",
            "expires_in": "expireTime In number",
            "refresh_expires_in": "refresh expires In number",
            "refresh_token": "refresh token",
            "token_type": "bearer",
            "not-before-policy": "in number",
            "session_state": "session state"
        }
    }
}
    */

    login(req) {

        return new Promise(async (resolve, reject) => {

            try {

                let ssoLoginToken = await ssoHelpers.login(req.body)

                let ssoLoginResponse = { ...req.body };
                ssoLoginResponse["tokenDetails"] = ssoLoginToken


                return resolve({
                    message: "Login credentials verified successfully",
                    result: ssoLoginResponse
                });

            } catch (error) {

                return reject({
                    status: error.status || 500,
                    message: error.message || "Oops! something went wrong.",
                    errorObject: error
                })

            }


        })
    }
}

