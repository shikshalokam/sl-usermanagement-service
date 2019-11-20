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
    * { 
        dbo:"15-Sep-1985",
        designation:"Computer Faculty",
        district/office:"PATIALA",
        facultyCode:"132246",
        gender:"Boy",
        postedAsDesignation:"Assistant Manager",
        school/location:"GSSS MANDAUR",
        staffID:"8146166001",
        staffName:"Gurpreet Singh",
        staffType:"0",
        subject:"COMPUTER SCIENCE",
        punjabSSO:true
        } 
    * @apiParamExample {json} Response:
    * {
    "message": "Login credentials verified successfully.",
    "status": 200,
    "result": {
        "facultyCode": "132246",
        "staffID": "8146166001",
        "district/office": "PATIALA",
        "school/location": "GSSS MANDAUR",
        "staffName": "Gurpreet Singh",
        "dbo": "15-Sep-1985",
        "gender": "Boy",
        "designation": "Computer Faculty",
        "subject": "COMPUTER SCIENCE",
        "staffType": "0",
        "postedAsDesignation": "Assistant Manager",
        "tokenDetails": {
            "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJwZU9VQ3ZTVUR2ekprYzlyeXJVNTNWLXV6ME1nOFVCbk4tSzJfTmFpX2N3In0.eyJqdGkiOiI3NGZkN2YzYy1lZWFlLTQwMGItODQzMC1mYzhhYThhYmFlZDQiLCJleHAiOjE1NzQzMTY4NTEsIm5iZiI6MCwiaWF0IjoxNTc0MjMwNDUxLCJpc3MiOiJodHRwczovL2Rldi5zaGlrc2hhbG9rYW0ub3JnL2F1dGgvcmVhbG1zL3N1bmJpcmQiLCJhdWQiOiJhZG1pbi1jbGkiLCJzdWIiOiJiODM5MGY2MS0wZjE1LTQ3ZWUtODc4Yi1mYzJhOGI1NmNiMmYiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJhZG1pbi1jbGkiLCJhdXRoX3RpbWUiOjAsInNlc3Npb25fc3RhdGUiOiJlYTJkODdmZC02ZDUxLTQwOWYtYjRmZi00MmMwYjgzMWUwOTAiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbXSwicmVzb3VyY2VfYWNjZXNzIjp7fSwibmFtZSI6Ikd1cnByZWV0IFNpbmdoIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiODE0NjE2NjAwMS0xQHNoaWtzaGFsb2thbWRldiIsImdpdmVuX25hbWUiOiJHdXJwcmVldCBTaW5naCIsImZhbWlseV9uYW1lIjoiIiwiZW1haWwiOiI4MTQ2MTY2MDAxQHB1bmphYi5zbCJ9.C2g4RSnsJE58x0e2G5KpnDJN_dQ4P_sBqgCfTigPa0nbXrfnaPiCvVaJKrar8_EmC1BFmEL0U85050S8Y2QJnjN3Cj3vABIGaUhf_uIbt-hF9DgmvghzLTYvZGdQNEIfE3V5CB05OqbmSXWbVhjJXY8O5fH2RrbCUM5uKEB8q9DugfJTu3QozC3vcOtMC_X83xVWtXw7A8eQgq_XmwIks7ujFPvjlBMaBiXHeKQqAMu-sErJHWX_Qas0usSD3RRPi0oSf21wOo9tkduY9n_z9QksgaYk4uEcxU-jDXFpQe-pqtstxqmCjkn_1Q22CJsBU89grPEnISN0qZa281J16Q",
            "expires_in": 86400,
            "refresh_expires_in": 86400,
            "refresh_token": "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJwZU9VQ3ZTVUR2ekprYzlyeXJVNTNWLXV6ME1nOFVCbk4tSzJfTmFpX2N3In0.eyJqdGkiOiI3YzY3Yzc2YS00MTBlLTQyYjAtOTI4Ni00MDkwYzU1ZDE4NWIiLCJleHAiOjE1NzQzMTY4NTEsIm5iZiI6MCwiaWF0IjoxNTc0MjMwNDUxLCJpc3MiOiJodHRwczovL2Rldi5zaGlrc2hhbG9rYW0ub3JnL2F1dGgvcmVhbG1zL3N1bmJpcmQiLCJhdWQiOiJhZG1pbi1jbGkiLCJzdWIiOiJiODM5MGY2MS0wZjE1LTQ3ZWUtODc4Yi1mYzJhOGI1NmNiMmYiLCJ0eXAiOiJSZWZyZXNoIiwiYXpwIjoiYWRtaW4tY2xpIiwiYXV0aF90aW1lIjowLCJzZXNzaW9uX3N0YXRlIjoiZWEyZDg3ZmQtNmQ1MS00MDlmLWI0ZmYtNDJjMGI4MzFlMDkwIiwicmVzb3VyY2VfYWNjZXNzIjp7fX0.MYCUMdoiLorgo3MlASLU3ZGHhkpXdaDLZVwiBOuNAtFQ7GPsjbwJLNsGQ3srxTTzkKeMA1EvRbKlNmRwxHeWvOKhzSQq8QHeyYD9t4pKhUFB5_GJxpu0qq0u719Dhfw-lhS00euDfseINIOhIKdPyf96WUjgimxSotQxNdG39HTJkg81ulbzHmkUtRwovXKRQg4lfYzKbd_xMjyDd0wXVjBH-rWrFwWK7a4Asi5vtqOtagHDj23gg-uHUJXNZEFRsrOSs7SnOkXKz6NTXLlkrErLepWPkYL0mBygvXq6lCY366OyMAUmqan52LkMFcPk-DYjrQnselntELxbmONlPg",
            "token_type": "bearer",
            "not-before-policy": 1548914483,
            "session_state": "ea2d87fd-6d51-409f-b4ff-42c0b831e090"
        }
    }
}
    */

    login(req) {

        return new Promise(async (resolve, reject) => {

            try {

                await ssoHelpers.login(req.body)

                return resolve({
                    message: "sso successfully.",
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

