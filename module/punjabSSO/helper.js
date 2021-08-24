const { createUser } = require("../../generics/services/sunbird");

const Request = require(GENERIC_HELPERS_PATH+'/http-request');
const punjabServiceBaseUrl = (process.env.PUNJAB_SERVICE_BASE_URL && process.env.PUNJAB_SERVICE_BASE_URL != "") ? process.env.PUNJAB_SERVICE_BASE_URL : ""
const punjabServiceKey = (process.env.PUNJAB_SERVICE_KEY && process.env.PUNJAB_SERVICE_KEY != "") ? process.env.PUNJAB_SERVICE_KEY : ""
const punjabServiceHost = (process.env.PUNJAB_SERVICE_HOST && process.env.PUNJAB_SERVICE_HOST != "") ? process.env.PUNJAB_SERVICE_HOST : ""
const encryptionEndpoint = "encryptedMethod"

const validateStaffLoginCredentialsEndpoint = "staffLogin"
const resendStaffCredentialsEndpoint = "forgetPassword"
const resetPasswordEndpoint = "resetPassword"

const punjabServiceDefaultPassword = (process.env.PUNJAB_SERVICE_DEFAULT_PASSWORD && process.env.PUNJAB_SERVICE_DEFAULT_PASSWORD != "") ? process.env.PUNJAB_SERVICE_DEFAULT_PASSWORD : ""
const punjabServiceDefaultMailDomain = (process.env.PUNJAB_SERVICE_DEFAULT_MAIL_DOMAIN && process.env.PUNJAB_SERVICE_DEFAULT_MAIL_DOMAIN != "") ? process.env.PUNJAB_SERVICE_DEFAULT_MAIL_DOMAIN : "@punjab.sl"

let sunbirdService = require(GENERIC_SERVICES_PATH + "/sunbird");

module.exports = class punjabSSOHelper {

    static encrypt(string = "") {
        return new Promise(async (resolve, reject) => {
            try {

                if(string == "") throw new Error("String cannot be blank.")

                const encryptionServiceResponse = await this.callPunjabService(encryptionEndpoint,{"values":string})
                console.log(encryptionServiceResponse)
               
                if(!encryptionServiceResponse.data) throw new Error(encryptionServiceResponse.message);

                const responseExtract = await this.validateWetherResponseIsSuccess(encryptionServiceResponse.data)

                if(responseExtract.data && responseExtract.data != "") {
                    return resolve({ data:responseExtract.data,success:true,message:"Data encrypted succesfully." });
                } else {
                    throw new Error(encryptionServiceResponse.message);
                }

            } catch (error) {
                return reject({
                    data:false,
                    success:false,
                    message:error.message
                });
            }
        })
    }


    static validateStaffLoginCredentials(staffID = "", password = "") {
        return new Promise(async (resolve, reject) => {
            try {

                if(staffID == "" || password == "") throw new Error("Invalid credentials.")

                const staffLoginAPIResponse = await this.callPunjabService(validateStaffLoginCredentialsEndpoint,{"staffID":staffID,"password":password});

                if(!staffLoginAPIResponse.data) throw new Error(staffLoginAPIResponse.message);
               
                let responseExtract = await this.validateWetherResponseIsSuccess(staffLoginAPIResponse.data)

                if(responseExtract.data && responseExtract.data != "") {
                    try {
                        responseExtract = JSON.parse(responseExtract.data)
                    } catch (error) {
                        responseExtract = responseExtract.data;

                        if(_.includes(responseExtract.toLowerCase(), 'message')) {
                            const invalidCharacters = new Array('[',']',':','message','Message','{','}')
                            invalidCharacters.forEach(charToReplace => {
                                responseExtract = _.replace(responseExtract, charToReplace, '');
                            })
                            throw new Error(_.trim(responseExtract))
                        }
                    }

                    return resolve({ data: responseExtract[0],success:true,message:responseExtract[0] });
                } else {
                    throw new Error("Invalid credentials.")
                }
                

            } catch (error) {
                return reject({
                    data:false,
                    success:false,
                    message:error.message
                });
            }
        })
    }


    static resendUserCredentials(staffID = "", mobileNo = "") {
        return new Promise(async (resolve, reject) => {
            try {

                if(staffID == "" || mobileNo == "") throw new Error("Invalid credentials.")

                const staffForgotPasswordAPIResponse = await this.callPunjabService(resendStaffCredentialsEndpoint,{"staffID":staffID,"registeredMobileNo":mobileNo})

                if(!staffForgotPasswordAPIResponse.data) throw new Error(staffForgotPasswordAPIResponse.message);

                let responseExtract = await this.validateWetherResponseIsSuccess(staffForgotPasswordAPIResponse.data)
                
                if(responseExtract.data && responseExtract.data != "") {
                    responseExtract = responseExtract.data;
                    if(responseExtract == "[{Message :Password has sent on your registered mobile number !!!}]") {
                        const message = "Password has been sent on your registered mobile number.";
                        return resolve({ data:message,success:true,message:message });
                    } else {
                        return resolve({  data: responseExtract.replace('[{Message :', '').replace("}]",""), success:true,message:responseExtract.replace('[{Message :', '').replace("}]","") });
                    }
                } else {
                    throw new Error(staffForgotPasswordAPIResponse.message);
                }
                

            } catch (error) {
                return reject({
                    data:false,
                    success:false,
                    message:error.message
                });
            }
        })
    }

    static resetUserCredentials(facultyCode = "", oldPassword = "", password = "", confirmPassword = "") {
        return new Promise(async (resolve, reject) => {
            try {

                if(facultyCode == "" || oldPassword == "" || password == "" || confirmPassword == "") throw new Error("Invalid credentials.")

                const staffResetPasswordAPIResponse = await this.callPunjabService(resetPasswordEndpoint,{"facultyCode":facultyCode,"oldPassword":oldPassword,"password":password,"confirmPassword":confirmPassword})

                if(!staffResetPasswordAPIResponse.data) throw new Error(staffResetPasswordAPIResponse.message);

                let responseExtract = await this.validateWetherResponseIsSuccess(staffResetPasswordAPIResponse.data)
                
                if(responseExtract.data && responseExtract.data != "") { 
                    responseExtract = responseExtract.data;
                    if(responseExtract == "[{Message :Your password has chanced !!!}]") {
                        const message = "Password reset successful.";
                        return resolve({ data:message,success:true, message: message });
                    } else {
                        return resolve({ data:responseExtract.replace('[{Message :', '').replace("}]",""),success:true,message:responseExtract.replace('[{Message :', '').replace("}]","") });
                    }
                } else {
                    throw new Error(staffResetPasswordAPIResponse.message)
                }
                

            } catch (error) {
                return reject({
                    data:false,
                    success:false,
                    message:error.message
                });
            }
        })
    }

    static validateWetherResponseIsSuccess(response) {
        return new Promise(async (resolve, reject) => {
            try {

                if(response && response.status && response.status == 200 && response.message && response.message == "Success" && response.data && response.data.string && response.data.string._text) {
                    return resolve({ data:response.data.string._text,success:true,message:response.data.string._text });
                } else {
                    return resolve({ data:"",success:false,message:"" });
                }
                

            } catch (error) {
                return reject({
                    data:false,
                    success:false,
                    message:error.message
                });
            }
        })
    }

    static callPunjabService(endpoint = "", data = {}) {
        return new Promise(async (resolve, reject) => {
            try {

                if(punjabServiceBaseUrl == "" || punjabServiceKey == "" || punjabServiceHost == "" || endpoint == "") throw new Error("API Credentilas missing.")

                let reqObj = new Request()

                data["key"] = punjabServiceKey
                let options = {
                    type : "https",
                    form: data
                }
                
                options.headers = {
                    "Host": punjabServiceHost,
                    "Connection": 'keep-alive'

                }

                process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

                console.log("--- logs starts in success ------------")
                console.log("url",punjabServiceBaseUrl+"/"+endpoint);
                console.log("options",options);

                let response = await reqObj.post(
                    punjabServiceBaseUrl+"/"+endpoint,
                    options
                )

                console.log("response",response);
                console.log("--- logs ends. In success ------------")

                process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1';
                     
                return resolve({
                    success: true,
                    message : "Punjab MIS API call completed successfully.",
                    data : response
                })

            } catch (error) {
                console.log("error",error);
                console.log("--- logs ends. In error ------------");

                return reject({
                    data:false,
                    success:false,
                    message:error.message
                });
            }
        })
    }


    static getKeyCloakAuthToken(staffID = "", staffDetails = {}) {
        return new Promise(async (resolve, reject) => {
            try {

                if(staffID == "") throw new Error("staffID cannot be blank.")

                if(punjabServiceDefaultPassword == "") throw new Error("Default Password not available.")

                const keyCloakData = await sunbirdService.getKeycloakToken(staffID,punjabServiceDefaultPassword,process.env.DARPAN_APP_KEYCLOAK_CLIENT)
               
                if(keyCloakData.status == HTTP_STATUS_CODE.ok.status && keyCloakData.result) {
                    return resolve({ data: keyCloakData.result,success:true,message:keyCloakData.message });
                }

                if(keyCloakData.status != HTTP_STATUS_CODE.ok.status) {
                    
                    const userCreationResponse = await sunbirdService.createUser({
                        "firstName": staffDetails.staffName,
                        "lastName": "",
                        "userName": staffID,
                        "email": staffID + punjabServiceDefaultMailDomain,
                        "password":punjabServiceDefaultPassword
                    });
                   
                    if(userCreationResponse.status == HTTP_STATUS_CODE.ok.status && userCreationResponse.result && userCreationResponse.result.userId) {
                        
                        await UTILS.sleep(2000); // Wait for 2 seconds for new credentials to reflect in keycloak.
                        
                        keyCloakData = await sunbirdService.getKeycloakToken(staffID,punjabServiceDefaultPassword,process.env.DARPAN_APP_KEYCLOAK_CLIENT)

                        if(keyCloakData.status == HTTP_STATUS_CODE.ok.status && keyCloakData.result) {
                            
                            return resolve({ data : keyCloakData.result,success:true,message:keyCloakData.message });
                        } else {
                            throw new Error(keyCloakData.message)
                        }

                    } else {
                        throw new Error(userCreationResponse.message)
                    }

                } else {
                    throw new Error(keyCloakData.message)
                }

            } catch (error) {

                return reject({
                    data:false,
                    success:false,
                    message:error.message
                });
            }
        })
    }

};