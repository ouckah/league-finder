import { validateLogin, throwError, handleFormSubmit } from '../../utils/validation.js';

let loginForm = document.getElementById('signin-form');
let errorDiv = document.getElementById('error');
let successDiv = document.getElementById('success');

if (loginForm) {
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    
    try {
      validateLogin(username, password);
      errorDiv.hidden = true;
      successDiv.hidden = false;
      successDiv.innerHTML = 'Attempting to login...';
      await handleFormSubmit(loginForm, { username, password },'/');
    } catch (e) {
      throwError(e, errorDiv, successDiv);
    }
  });
}
