import { UnauthenticatedError } from "../error/index.js";

const checkPermissions = (reqUser, userId) => {
    console.log(reqUser);
    console.log(userId);
    if(reqUser.userId === userId.toString()) return;
    throw new UnauthenticatedError('Not authorized to access this resource');
}

export default checkPermissions;