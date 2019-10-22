const Request = require(GENERIC_HELPERS_PATH+'/httpRequest');
const punjabServiceBaseUrl = (process.env.PUNJAB_SERVICE_BASE_URL && process.env.PUNJAB_SERVICE_BASE_URL != "") ? process.env.PUNJAB_SERVICE_BASE_URL : ""
const punjabServiceKey = (process.env.PUNJAB_SERVICE_KEY && process.env.PUNJAB_SERVICE_KEY != "") ? process.env.PUNJAB_SERVICE_KEY : ""
const punjabServiceHost = (process.env.PUNJAB_SERVICE_HOST && process.env.PUNJAB_SERVICE_HOST != "") ? process.env.PUNJAB_SERVICE_HOST : ""
const encryptionEndpoint = "encryptedMethod"
// const decryptionEndpoint = "decryptedMethod"
const validateStaffLoginCredentialsEndpoint = "staffLogin"
const resendStaffCredentialsEndpoint = "forgetPassword"
const resetPasswordEndpoint = "resetPassword"

module.exports = class punjabSSOHelper {

    static encrypt(string = "") {
        return new Promise(async (resolve, reject) => {
            try {

                if(string == "") throw "String cannot be blank."

                let encryptionServiceData = await this.callPunjabService(encryptionEndpoint,{"values":string})

                let responseExtract = await this.validateWetherResponseIsSuccess(encryptionServiceData)

                if(responseExtract != "") {
                    return resolve(responseExtract);
                } else {
                    throw encryptionServiceData
                }

            } catch (error) {
                return reject(error);
            }
        })
    }


    static validateStaffLoginCredentials(staffID = "", password = "") {
        return new Promise(async (resolve, reject) => {
            try {

                if(staffID == "" || password == "") throw "Invalid credentials."

                let staffLoginData = await this.callPunjabService(validateStaffLoginCredentialsEndpoint,{"staffID":staffID,"password":password})

                let responseExtract = await this.validateWetherResponseIsSuccess(staffLoginData)

                if(responseExtract != "") {
                    responseExtract = JSON.parse(responseExtract)
                    return resolve(responseExtract[0]);
                } else {
                    throw staffLoginData
                }
                

            } catch (error) {
                return reject(error);
            }
        })
    }


    static resendUserCredentials(staffID = "", mobileNo = "") {
        return new Promise(async (resolve, reject) => {
            try {

                if(staffID == "" || mobileNo == "") throw "Invalid credentials."

                let staffForgotPasswordData = await this.callPunjabService(resendStaffCredentialsEndpoint,{"staffID":staffID,"registeredMobileNo":mobileNo})

                let responseExtract = await this.validateWetherResponseIsSuccess(staffForgotPasswordData)
                
                if(responseExtract != "" && responseExtract == "[{Message :Password has sent on your registered mobile number !!!}]") {
                    return resolve("Password has been sent on your registered mobile number.");
                } else {
                    throw staffLoginData
                }
                

            } catch (error) {
                return reject(error);
            }
        })
    }

    static resetUserCredentials(facultyCode = "", oldPassword = "", password = "", confirmPassword = "") {
        return new Promise(async (resolve, reject) => {
            try {

                if(facultyCode == "" || oldPassword == "" || password == "" || confirmPassword == "") throw "Invalid credentials."

                let staffResetPasswordData = await this.callPunjabService(resetPasswordEndpoint,{"facultyCode":facultyCode,"oldPassword":oldPassword,"password":password,"confirmPassword":confirmPassword})

                let responseExtract = await this.validateWetherResponseIsSuccess(staffResetPasswordData)
                
                if(responseExtract != "" && responseExtract == "[{Message :Your password has chanced !!!}]") {
                    return resolve("Password reset successful.");
                } else {
                    throw staffResetPasswordData
                }
                

            } catch (error) {
                return reject(error);
            }
        })
    }

    static validateWetherResponseIsSuccess(response) {
        return new Promise(async (resolve, reject) => {
            try {

                if(response && response.status && response.status == 200 && response.message && response.message == "Success" && response.data && response.data.string) {
                    return resolve(response.data.string._text);
                } else {
                    return resolve("");
                }
                

            } catch (error) {
                return reject(error);
            }
        })
    }

    static callPunjabService(endpoint = "", data = {}) {
        return new Promise(async (resolve, reject) => {
            try {

                if(punjabServiceBaseUrl == "" || punjabServiceKey == "" || punjabServiceHost == "" || endpoint == "") throw "API Credentilas missing."

                let reqObj = new Request()

                data["key"] = punjabServiceKey
                let options = {
                    type : "http",
                    form: data
                }
                
                options.headers = {
                    "Host": punjabServiceHost
                }

                let response = await reqObj.post(
                    punjabServiceBaseUrl+"/"+endpoint,
                    options
                )

                return resolve(response)

            } catch (error) {
                return reject(error);
            }
        })
    }

};