import * as validation from '../../utils/validation.js';

let registerForm = document.getElementById('signup-form');
let errorDiv = document.getElementById('error');

if (registerForm) {
  registerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    let firstName = document.getElementById('firstName').value;
    let lastName = document.getElementById('lastName').value;
    let email = document.getElementById('email').value;
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let confirmPassword = document.getElementById('confirmPassword').value;

    try {
      validation.validateRegistration(
        firstName,
        lastName,
        email,
        username,
        password,
        confirmPassword);
    } catch (e) {
      validation.throwError(e,errorDiv);
      return;
    }
    registerForm.submit();
  });
}