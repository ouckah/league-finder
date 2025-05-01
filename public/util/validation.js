import helpers from '../../utils/helpers.js'

const exportedMethods = {
  validateRegistration (
    firstName, lastName, email, username, password, confirmPassword
  ) {
    const validateName = (name) => {
      name = helpers.checkString(name);
      helpers.checkStringWithLength(name, 2, 20, /^[a-zA-Z]+$/);
      return name;
    };
  
    const validateEmail = (email) => {
      email = helpers.checkString(email);
      helpers.checkStringWithLength(email, 5, 255, /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+\.[a-zA-Z]+$/);
      return email;
    };
  
    const validateUsername = (username) => {
      username = helpers.checkString(username);
      helpers.checkStringWithLength(username, 2, 20, /^[a-zA-Z0-9]+$/);
      return username;
    };
  
    const validatePassword = (password, confirmPassword) => {
      helpers.checkString(password);
      if (confirmPassword !== undefined && confirmPassword !== null) {
        helpers.checkString(confirmPassword);
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
      helpers.checkString(title);
      helpers.checkStringArray(desiredRank, 'desiredRank');
      helpers.checkStringArray(desiredRole, 'desiredRole');
      helpers.checkString(region);
      helpers.checkString(description);
  }
}

export default exportedMethods;
