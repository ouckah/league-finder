import * as validation from '../utils/validation.js';

let loginForm = document.getElementById('signin-form');
let registerForm = document.getElementById('signup-form');
let teamForm = document.getElementById('newteams-form');
let postForm = document.getElementById('newpost-form');
let deleteAccountForm = document.getElementById('deleteAccountForm');
let errorDiv = document.getElementById('error');

if(loginForm){
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        let username = document.getElementById('username').value;
        let password = document.getElementById('password').value;
        try{
            username,password = validation.validateLogin(username, password); 

            
            // clear error message?
          }catch (e){
            throwError(e);
            return;
          }

        loginForm.submit();
    });
}

if(registerForm){
    registerForm.addEventListener('submit', (event) => {
        event.preventDefault();
        let firstName = document.getElementById('firstName').value;
        let lastName = document.getElementById('lastName').value;
        let email = document.getElementById('email').value;
        let username = document.getElementById('username').value;
        let password = document.getElementById('password').value;
        let confirmPassword  = document.getElementById('confirmPassword').value;

        try{
          validation.validateRegistration(
            firstName,
            lastName,
            email,
            username,
            password,
            confirmPassword);
            // clear error message?
          } catch (e){
            // print error message
            throwError(e);
            return;
          }
        registerForm.submit();
    });
}

if(teamForm){
    teamForm.addEventListener('submit', (event) => {
        event.preventDefault();
        let title = document.getElementById('title').value;

        // Not sure how we want to handle this. This works for now but it depends on how new team handblebars is done
        let desiredRoles = Array.from(document.querySelectorAll('input[name="desiredRole[]"]:checked'))
                                  .map(input => input.value);

        let desiredRanks = Array.from(document.querySelectorAll('input[name="desiredRank[]"]:checked'))
                                  .map(input => input.value);

        let region = document.getElementById('region').value;
        let description = document.getElementById('description').value;

        console.log(desiredRanks, desiredRoles);
        try{
          validation.validateTeam(title, desiredRanks, desiredRoles, region, description);
          } catch (e){
            throwError(e);
            return;
          }
        teamForm.submit();
    });
}

/*
if(postForm){
    postForm.addEventListener('submit', (event) => {
        event.preventDefault();
        let title = document.getElementById('title').value;
        let content = document.getElementById('content').value;
        let tags = document.getElementById('tags').value;
        tags = tags?.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

        try{
            title = checkString(title, 'title');
            content = checkString(content, 'content');
            // tags validation 
          } catch (e){
            // print error message
            return;
          }
        postForm.submit();
    });
}
*/

// make sure to input validation and error handle later

if(deleteAccountForm){
  deleteAccountForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      let confirm = document.getElementById('confirm').value;

      if (!confirm) {
        return; // handle empty confirmation 
      }

      try {
        const response = await fetch(deleteAccountForm.action, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ confirm })
        });

        if (response.ok) {
            window.location.href = '/';  // Redirect after successful deletion
        } else {
            const data = await response.json();
            throwError('Bad Response: ' + data.error); // handle error message
            return; // handle error message
        }
    } catch (e) {
      throwError(e);
      return; // handle error message
    }
  });
}

function throwError(eMessage){
  errorDiv.innerHTML = eMessage;
}