import helpers from './helpers.js';
const { checkString, checkStringArray, checkStringWithLength } = helpers;

const validateName = (name,varname) => {
    name = checkString(name, varname);
    checkStringWithLength(name, 2, 20, /^[a-zA-Z]+$/);
    return name;
};

const validateEmail = (email,varname) => {
    email = checkString(email,varname);
    checkStringWithLength(email, 5, 255, /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+\.[a-zA-Z]+$/);
    return email;
};

const validateUsername = (username,varname) => {
    username = checkString(username,varname);
    checkStringWithLength(username, 2, 20, /^[a-zA-Z0-9]+$/);
    return username;
};

const validatePassword = (password, confirmPassword,varname) => {
    checkString(password,varname);
	checkString(confirmPassword,varname);
	if (password !== confirmPassword) {
	    throw new Error('Passwords do not match');
	}

    if (password.length < 8) {
	throw new Error('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
	throw new Error('Password must contain at least one uppercase letter');
    }
    if (!/[0-9]/.test(password)) {
	throw new Error('Password must contain at least one number');
    }
    if (!/[^a-zA-Z0-9 ]/.test(password)) {
	throw new Error('Password must contain at least one special character');
    }
};

const validateRegistration = (
    firstName, lastName, email, username, password, confirmPassword
) => {
    firstName = validateName(firstName,"firstName");
    lastName = validateName(lastName,"lastName");
    email = validateEmail(email,"email");
    username = validateUsername(username,"username");
    validatePassword(password, confirmPassword,"password");
}

const validateTeam = (
    title, desiredRank, desiredRole, region, description
) => {
    if (typeof desiredRank === 'string') {
	desiredRank = [desiredRank];
    }
    if (typeof desiredRole === 'string') {
	desiredRole = [desiredRole];
    }
    checkString(title, 'title');
    checkStringArray(desiredRank, 'desiredRank');
    checkStringArray(desiredRole, 'desiredRole');
    checkString(region, 'region');
    checkString(description, 'description');
}

const validateLogin = (username, password) => {
  username = validateUsername(username,"username");
  validatePassword(password, password,"password");

  return username, password;
}

export { validateRegistration, validateTeam,validateLogin }

