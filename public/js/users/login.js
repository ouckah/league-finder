import { validateLogin, throwError } from '../../utils/validation.js';

let loginForm = document.getElementById('signin-form');
let errorDiv = document.getElementById('error');

if (loginForm) {
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    try {
      username, password = validateLogin(username, password);


      // clear error message?
    } catch (e) {
      throwError(e,errorDiv);
      return;
    }

    loginForm.submit();
  });
}
