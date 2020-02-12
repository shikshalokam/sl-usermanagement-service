/**
 * name : userExtensionController.js
 * author : Akash
 * created-date : 01-feb-2019
 * Description : User extension related functionality.
 */

/**
    * UserExtension
    * @class
*/

module.exports = class UserExtension extends Abstract {
  constructor() {
    super(userExtensionSchema);
  }

  static get name() {
    return "userExtension";
  }

};
