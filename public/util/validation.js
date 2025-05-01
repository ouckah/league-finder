// I assume we have to have the validation helpers in here as well instead of the one in the util/helpers. For now, i will keep it like this.

const exportedMethods = {
  validateRegistration (
    firstName, lastName, email, username, password, confirmPassword
  ) {
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
      if (confirmPassword !== undefined && confirmPassword !== null) {
        checkString(confirmPassword);
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
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

    firstName = validateName(firstName);
    lastName = validateName(lastName);
    email = validateEmail(email);
    username = validateUsername(username);
    validatePassword(password, confirmPassword);
  },
  validateTeam (
      title, desiredRank, desiredRole, region, description
  ) {
      if (typeof desiredRank === 'string') {
	  desiredRank = [desiredRank];
      }
      if (typeof desiredRole === 'string') {
	  desiredRole = [desiredRole];
      }
      checkString(title);
      checkStringArray(desiredRank, 'desiredRank');
      checkStringArray(desiredRole, 'desiredRole');
      checkString(region);
      checkString(description);
  }
}

function checkString(strVal, varName) {
    if (!strVal) throw `Error: You must supply a ${varName}!`;
    if (typeof strVal !== 'string') throw `Error: ${varName} must be a string!`;
    strVal = strVal.trim();
    if (strVal.length === 0)
      throw `Error: ${varName} cannot be an empty string or string with just spaces`;
    if (!isNaN(strVal))
      throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
    return strVal;
  }

function checkStringArray(arr, varName) {
    //We will allow an empty array for this,
    //if it's not empty, we will make sure all tags are strings
    if (!arr || !Array.isArray(arr))
      throw `You must provide an array of ${varName}`;
    for (let i in arr) {
      if (typeof arr[i] !== 'string' || arr[i].trim().length === 0) {
        throw `One or more elements in ${varName} array is not a string or is an empty string`;
      }
      arr[i] = arr[i].trim();
    }

    return arr;
  }

function checkStringWithLength(str, minLength, maxLength, chars) {
    if (str.length < minLength || str.length > maxLength) {
      throw new Error('String must be between ' + minLength + ' and ' + maxLength + ' characters long.');
    }
    if (!chars.test(str)) {
      throw new Error('String contains illegal characters.');
    }
  }

export default exportedMethods;
