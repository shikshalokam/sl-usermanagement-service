const Request = require(GENERIC_HELPERS_PATH+'/httpRequest');
const keycloakAuthServerUrl = (process.env.sunbird_keycloak_auth_server_url && process.env.sunbird_keycloak_auth_server_url != "") ? process.env.sunbird_keycloak_auth_server_url : ""
const realm = (process.env.sunbird_keycloak_realm && process.env.sunbird_keycloak_realm != "") ? process.env.sunbird_keycloak_realm : "sunbird"
const clientId = (process.env.sunbird_keycloak_client_id && process.env.sunbird_keycloak_client_id != "") ? process.env.sunbird_keycloak_client_id : "admin-cli"
const grantType = (process.env.sunbird_keycloak_grant_type && process.env.sunbird_keycloak_grant_type != "") ? process.env.sunbird_keycloak_grant_type : "password"
const userCreationChannel = (process.env.sunbird_keycloak_default_user_creation_channel && process.env.sunbird_keycloak_default_user_creation_channel != "") ? process.env.sunbird_keycloak_default_user_creation_channel : "SHIKSHALOKAM"
const userCreationEndpoint = "/api/user/v1/create"
// let adminAuthToken = ""
// const keyCloakAdminUserName = (process.env.sunbird_keycloak_admin_username && process.env.sunbird_keycloak_admin_username != "") ? process.env.sunbird_keycloak_admin_username : ""
// const keyCloakAdminPassword = (process.env.sunbird_keycloak_admin_password && process.env.sunbird_keycloak_admin_password != "") ? process.env.sunbird_keycloak_admin_password : ""
const shikshalokamBaseHost = (process.env.SHIKSHALOKAM_BASE_HOST && process.env.SHIKSHALOKAM_BASE_HOST != "") ? process.env.SHIKSHALOKAM_BASE_HOST : ""

module.exports = class shikshalokamHelper {

    static getKeyCloakToken(username = "", password = "") {
        return new Promise(async (resolve, reject) => {
            try {

                if(username == "" || password == "") throw "Invalid Credentials."

                let keyCloakLoginUrl = await this.getKeyCloakLoginUrl()

                let keyCloakLoginResponse = await this.callKeyCloakService(keyCloakLoginUrl,{
                    "client_id":clientId,
                    "username":username, // "a1@shikshalokamdev"
                    "password":password,
                    "grant_type":grantType
                })

                if(keyCloakLoginResponse.status == 200 && keyCloakLoginResponse.data && keyCloakLoginResponse.data.access_token && keyCloakLoginResponse.data.access_token != "") {
                    resolve({
                        status:keyCloakLoginResponse.status,
                        success : true,
                        tokenDetails: keyCloakLoginResponse.data
                    })
                } else {
                    resolve({
                        status:keyCloakLoginResponse.status,
                        success : false,
                        error: keyCloakLoginResponse.data.error_description
                    })
                }

            } catch (error) {
                return reject(error);
            }
        })
    }

    static getKeyCloakLoginUrl() {
        return new Promise(async (resolve, reject) => {
            try {

                if(keycloakAuthServerUrl == "" || realm == "") throw "Keycloak Cofiguration is missing."

                return resolve(keycloakAuthServerUrl+"/realms/"+realm+"/protocol/openid-connect/token");      

            } catch (error) {
                return reject(error);
            }
        })
    }


    static getUserCreationUrl() {
        return new Promise(async (resolve, reject) => {
            try {

                if(shikshalokamBaseHost == "" || userCreationEndpoint == "") throw "User Create Cofiguration is missing."

                return resolve(shikshalokamBaseHost+userCreationEndpoint);      

            } catch (error) {
                return reject(error);
            }
        })
    }


    static getUserCreationHeaders(refreshAdminToken = false) {
        return new Promise(async (resolve, reject) => {
            try {

                if(process.env.AUTHORIZATION == "") throw "User Create Cofiguration Headers is missing."

                // if(adminAuthToken == "" || refreshAdminToken) {
                //     let adminTokenGenerationResponse = await this.generateAdminAuthToken()
                //     if(adminTokenGenerationResponse.success == true && adminTokenGenerationResponse.accessToken) {
                //         adminAuthToken = adminTokenGenerationResponse.accessToken
                //     } else {
                //         throw "Keycloak Admin Token Refresh Failed"
                //     }
                // }

                return resolve({
                        "content-type": "application/json",
                        "authorization": process.env.AUTHORIZATION,
                        // "x-authenticated-user-token": adminAuthToken
                });      

            } catch (error) {
                return reject(error);
            }
        })
    }


    static generateAdminAuthToken() {
        return new Promise(async (resolve, reject) => {
            try {

                if(keyCloakAdminUserName == "" || keyCloakAdminPassword == "") throw "Invalid Keycloak Admin Credentials."

                let keyCloakLoginUrl = await this.getKeyCloakLoginUrl()

                let adminLoginResponse = await this.callKeyCloakService(keyCloakLoginUrl,{
                    "client_id":clientId,
                    "username":keyCloakAdminUserName,
                    "password":keyCloakAdminPassword,
                    "grant_type":grantType
                })

                if(adminLoginResponse.status == 200 && adminLoginResponse.data && adminLoginResponse.data.access_token) {
                    return resolve({
                        success : true,
                        status: adminLoginResponse.status,
                        accessToken : adminLoginResponse.data.access_token
                    })
                } else {
                    throw "Keycloak Admin Login Failed."
                }      

            } catch (error) {
                return reject(error);
            }
        })
    }

    static createUser(userDetails = {}) {
        return new Promise(async (resolve, reject) => {
            try {

                if(
                    !userDetails.firstName  || userDetails.firstName == "" ||
                    !userDetails.userName  || userDetails.userName == "" ||
                    !userDetails.email  || userDetails.email == "" ||
                    !userDetails.password  || userDetails.password == ""
                    ) throw "Invalid User Details."

                userDetails["channel"] = userCreationChannel
                userDetails["emailVerified"] = true

                const reqObj = new Request()

                const requestURL = await this.getUserCreationUrl()

                let requestheaders = await this.getUserCreationHeaders()
                
                userDetails["userName"] = userDetails["userName"]
                userDetails["email"] = userDetails["email"]

                let userCreationResponse = await reqObj.post(
                    requestURL,
                    {
                        headers : requestheaders,
                        json : {
                            request: userDetails
                        }
                    }
                )

                if(userCreationResponse.data && userCreationResponse.data.result && userCreationResponse.data.result.userId && userCreationResponse.data.result.userId != "") {
                    return resolve({
                        success : true,
                        status: "User successfully created.",
                        userId : userCreationResponse.data.result.userId
                    })
                } else if (userCreationResponse.status == 401) {

                    requestheaders = await this.getUserCreationHeaders(true)

                    userCreationResponse = await reqObj.post(
                        requestURL,
                        {
                            headers : requestheaders,
                            json : {
                                request: userDetails
                            }
                        }
                    )
                    
                    if(userCreationResponse.data && userCreationResponse.data.result && userCreationResponse.data.result.userId && userCreationResponse.data.result.userId != "") {
                        return resolve({
                            success : true,
                            status: "User successfully created.",
                            userId : userCreationResponse.data.result.userId
                        })
                    } else {
                        throw userCreationResponse
                    }

                } else {
                    throw userCreationResponse
                }

            } catch (error) {
                return reject(error);
            }
        })
    }

    static refreshKeyCloakAdminSession() {
        return new Promise(async (resolve, reject) => {
            try {

                if(keycloakAuthServerUrl == "" || realm == "") throw "Keycloak Cofiguration is missing."

                return resolve(keycloakAuthServerUrl+"/realms/"+realm+"/protocol/openid-connect/token");      

            } catch (error) {
                return reject(error);
            }
        })
    }

    static callKeyCloakService(completeURL = "", data = {}) {
        return new Promise(async (resolve, reject) => {
            try {

                if(completeURL == "") throw "URL missing."

                let reqObj = new Request()

                let options = {
                    form: data
                }

                let response = await reqObj.post(
                    completeURL,
                    options
                )

                return resolve(response)

            } catch (error) {
                return reject(error);
            }
        })
    }

};