/**
 * name : constants/api-responses.js
 * author : Aman
 * Date : 10-feb-2019
 * Description : All api response messages.
 */


module.exports = {
  USER_PROFILE_UPDATION: "User profile updated successfully",
  USER_PROFILE_NOT_FOUND: "User profile is not found",
  USER_PROFILE_VERIFIED: "User profile is verified",
  USER_EXISTS: "User is already present",
  USER_UPDATED: "User updated successfully",
  USER_NOT_UPDATED: "Could not update user",
  USER_EXTENSION_NOT_FOUND: "User extension not found",
  USER_CREATED: "User created successfully",
  USER_PROFILE_CREATED: "User profile created successfully",
  USER_PROFILE_LIST_FETCHED: "User profile list fetched successfully",
  FAILED_TO_CREATE_USER: "Failed to create User",
  USER_BLOCKED: "User deactivated successfully",
  USER_UNBLOCKED: "User activated successfully",
  FAILED_TO_UPDATE: "Failed to update the status",
  INVALID_REQUEST: "Invalid Request",
  USER_PROFILE: "Platform user profile fetched successfully",
  PLATFORM_ROLES: "Platform roles fetched successfully",
  LOGIN_VERIFED: "Login credentials verified successfully.",
  PASSWORD_SENT: "Password has been sent on your registered mobile number.",
  PASSWORD_RESET: "Password reset successful.",
  ENCRYPTED: "String encryption completed successfully.",
  TOKEN_MISSING_CODE: 'ERR_TOKEN_FIELD_MISSING',
  TOKEN_MISSING_MESSAGE: 'Required field token is missing',
  TOKEN_INVALID_CODE: 'ERR_TOKEN_INVALID',
  TOKEN_INVALID_MESSAGE: 'Access denied',
  MISSING_TOKEN_AND_INTERNAL_ACCESS_TOKEN_CODE: "ERR_REQUEST_FIELDS_MISSING",
  MISSING_TOKEN_AND_INTERNAL_ACCESS_TOKEN_MESSAGE: "Token and Internal access token both are required field",
  MISSING_TOKEN_OR_INTERNAL_ACCESS_TOKEN_CODE: "ERR_REQUEST_ANY_ONE_FIELD_MISSING",
  MISSING_TOKEN_OR_INTERNAL_ACCESS_TOKEN_MESSAGE: "Token or Internal access token either one is required",
  KENDRA_SERVICE_DOWN: "Kendra service is down"
};
