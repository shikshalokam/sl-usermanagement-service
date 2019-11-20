module.exports = class SSOHelper {

    static login(ssoData) {
        return new Promise(async (resolve, reject) => {
            try {

                console.log("here")

                return resolve({
                    status: 200,
                    result: "Success"
                })
            }
            catch (error) {
                return reject(error);
            }
        })
    }

};