module.exports = class punjabSSOHelper {

    static encrypt(string = "") {
        return new Promise(async (resolve, reject) => {
            try {

                if(string == "") throw "String cannot be blank."

                // let platformUserRolesData = await database.models.platformRolesExt.find(filterQueryObject,projectionQueryObject).lean();

                return resolve("saddadadadasda");

            } catch (error) {
                return reject(error);
            }
        })
    }

};