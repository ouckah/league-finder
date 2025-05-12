import { validateRegistration, throwError, handleFormSubmit } from '../../utils/validation.js';

let registerForm = document.getElementById('signup-form');
let errorDiv = document.getElementById('error');
let successDiv = document.getElementById('success');

if (registerForm) {
  registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    let firstName = document.getElementById('firstName').value;
    let lastName = document.getElementById('lastName').value;
    let email = document.getElementById('email').value;
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let confirmPassword = document.getElementById('confirmPassword').value;

    try {
      validateRegistration(
        firstName,
        lastName,
        email,
        username,
        password,
        confirmPassword);

        errorDiv.hidden = true;
        successDiv.hidden = false;
        successDiv.innerHTML = 'Attempting to register...';
        await handleFormSubmit(registerForm, { firstName, lastName, email, username, password, confirmPassword },'/users/login');
    } catch (e) {
      throwError(e,errorDiv,successDiv);
    }
  });
}