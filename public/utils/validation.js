const validateName = (name, varname) => {
  name = checkString(name, varname);
  checkStringWithLength(name, 2, 20, /^[a-zA-Z]+$/, varname);
  return name;
};

const validateEmail = (email, varname) => {
  email = checkString(email, varname);
  checkStringWithLength(email, 5, 255, /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+\.[a-zA-Z]+$/, varname);
  return email;
};

const validateUsername = (username, varname) => {
  username = checkString(username, varname);
  checkStringWithLength(username, 2, 20, /^[a-zA-Z0-9]+$/, varname);
  return username;
};

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

function checkStringWithLength(str, minLength, maxLength, chars, varName) {
  if (str.length < minLength || str.length > maxLength) {
    throw `${varName} must be between ${minLength} and ${maxLength} characters long.`;
  }
  if (!chars.test(str)) {
    throw `${varName} does not match the expected format.`;
  }
}

const validatePassword = (password, varname) => {
  checkString(password, varname);

  if (password.length < 8) {
    throw 'Password must be at least 8 characters long';
  }
  if (!/[A-Z]/.test(password)) {
    throw 'Password must contain at least one uppercase letter';
  }
  if (!/[0-9]/.test(password)) {
    throw 'Password must contain at least one number';
  }
  if (!/[^a-zA-Z0-9 ]/.test(password)) {
    throw 'Password must contain at least one special character';
  }
};

const validateLogin = (username, password) => {
  username = validateUsername(username, "username");
  validatePassword(password, "password");

  return username, password;
}

const validateRegistration = (
  firstName, lastName, email, username, password, confirmPassword
) => {
  firstName = validateName(firstName, "firstName");
  lastName = validateName(lastName, "lastName");
  email = validateEmail(email, "email");
  username = validateUsername(username, "username");
  validatePassword(password, "password");
  validatePassword(confirmPassword, "confirmPassword");
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

async function validateEdit (username, email, biography, riotId, region, preferredRoles, profilePicture) {
  username = validateUsername(username, "username");
  email = validateEmail(email, "email");
  if (typeof biography !== 'string') {
    throw 'Biography must be a string.';
  }
  if (typeof riotId !== 'string') {
    throw 'Riot Username must be a string.';
  }
  if (riotId.length > 0) {
    checkStringWithLength(riotId, 3, 22, /^.{1,16}#.{1,5}$/, 'Riot ID');
    const riotName = riotId.split('#');
    const puuid = await riotAPI.getPuuid(riotName[0], riotName[1], region);
  }
  if (typeof region !== 'string') {
    throw 'Region must be a string.';
  }
  if (!Array.isArray(preferredRoles)) {
    throw 'Preferred Roles must be an array.';
  }
  if (typeof profilePicture !== 'string') {
    throw 'Profile picture link must be a string.';
  }
}

function throwError(eMessage, errorDiv, successDiv) {
  successDiv.hidden = true;
  errorDiv.hidden = false;
  errorDiv.innerHTML = eMessage;
}

async function handleFormSubmit(form, data, successRedirect) {
  try {
    const method = form.getAttribute('method') ? form.getAttribute('method').toUpperCase() : form.method;
    const response = await fetch(form.action, {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      window.location.href = successRedirect;
    } else {
      const result = await response.json();
      throw result.error;
    }
  } catch (e) {
    throw e;
  }
}

const validatePost = (image, title, content, tags) => {
  if (typeof image === 'string' && image.trim() !== '') {
    image = checkString(image, "image");
  }
  title = checkString(title, "title");
  checkStringWithLength(title, 2, 60, /^.+$/, "title");
  content = checkString(content, "content");
  checkStringWithLength(content, 2, 1000, /^.+$/, "content");

  // Handle tags validation
  if (tags) {
    let tagsArray;
    if (typeof tags === 'string') {
      tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    }

    for (const tag of tagsArray) {
      checkStringWithLength(tag, 2, 20, /^[a-zA-Z]+$/, "tag");
    }
  }

  return { image, title, content, tags };
}

export {
  checkString,
  validateRegistration,
  validateTeam,
  validateLogin,
  validateEdit,
  throwError,
  handleFormSubmit,
  validatePost
};
