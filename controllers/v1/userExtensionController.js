/**
 * name : userExtensionController.js
 * author : Aman
 * created-date : 11-feb-2020
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
