import helpers from './helpers.js';
import xss from 'xss';
const { checkString, checkStringArray, checkStringWithLength, checkId} = helpers;

// Helper function to sanitize input
const sanitizeInput = (input) => {
    if (typeof input === 'string') {
        return xss(input);
    } else if (Array.isArray(input)) {
        for (let i of input) {
            i= sanitizeInput(i);
        }
    }
    return input;
};

const validateName = (name, varname) => {
    name = checkString(name, varname);
    checkStringWithLength(name, 2, 20, /^[a-zA-Z]+$/, varname);
    return sanitizeInput(name);
};

const validateEmail = (email, varname) => {
    email = checkString(email, varname);
    checkStringWithLength(email, 5, 255, /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+\.[a-zA-Z]+$/, varname);
    return sanitizeInput(email);
};

const validateUsername = (username, varname) => {
    username = checkString(username, varname);
    checkStringWithLength(username, 2, 20, /^[a-zA-Z0-9]+$/, varname);
    return sanitizeInput(username);
};

const validatePassword = (password, confirmPassword, varname) => {
    checkString(password, varname);
    checkString(confirmPassword, varname);
    if (password !== confirmPassword) {
        throw 'Passwords do not match.';
    }

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

const validateRegistration = (
    firstName, lastName, email, username, password, confirmPassword
) => {
    firstName = validateName(firstName, "firstName");
    lastName = validateName(lastName, "lastName");
    email = validateEmail(email, "email");
    username = validateUsername(username, "username");
    validatePassword(password, confirmPassword, "password");
}

const validateEdit = (
    username, email, biography, riotId, region, preferredRoles, profilePicture
) => {
    username = validateUsername(username, "username");
    email = validateEmail(email, "email");
    if (typeof biography !== 'string') {
        throw 'Biography must be a string.';
    }
    if (typeof riotId !== 'string') {
        throw 'Riot Username must be a string.';
    }
    if (typeof region !== 'string') {
        throw 'Region must be a string.';
    }
    if (typeof profilePicture !== 'string') {
        throw 'Profile picture link must be a string.';
    }
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
    title = checkString(title, 'title');
    title = sanitizeInput(title);
    desiredRank = checkStringArray(desiredRank, 'desiredRank');
    desiredRole = checkStringArray(desiredRole, 'desiredRole');
    desiredRank = sanitizeInput(desiredRank);
    desiredRole = sanitizeInput(desiredRole);
    region = checkString(region, 'region');
    region = sanitizeInput(region);
    description = checkString(description, 'description');
    description = sanitizeInput(description);
}

const validateLogin = (username, password) => {
    username = validateUsername(username, "username");
    validatePassword(password, password, "password");

    return username, password;
}

const validatePost = (image,title, content, tags) => {
    if (typeof image === 'string' && image.trim() !== '') {
        image = checkString(image, "image");
        image = sanitizeInput(image);
    }
    
    title = checkString(title, "title");
    checkStringWithLength(title, 2, 60, /^.+$/, "title");
    title = sanitizeInput(title);
    
    content = checkString(content, "content");
    checkStringWithLength(content, 2, 1000, /^.+$/, "content");
    content = sanitizeInput(content);
    
    // Handle tags validation
    if (tags) {
        if (typeof tags === 'string') {
            tags = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
        }
        tags = checkStringArray(tags, "tags");
        for (let tag of tags) {
            checkStringWithLength(tag, 2, 20, /^[a-zA-Z]+$/, "tag");
            tag = sanitizeInput(tag);
        }
    }

    return {image,title, content, tags};
}

const validateComment = (postId, content) => {
    postId = checkId(postId, "postId");
    content = checkString(content, "content");
    checkStringWithLength(content, 2, 1000, /^[\s\S]+$/, "content");
    postId = sanitizeInput(postId);
    content = sanitizeInput(content);
  
    return {postId,content};
}

export { validateRegistration, validateTeam, validateLogin, validateEdit, validatePost, validateComment }

