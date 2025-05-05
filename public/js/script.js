import * as validation from '../util/validation.js';

let loginForm = document.getElementById('signin-form');
let registerForm = document.getElementById('signup-form');
let teamForm = document.getElementById('newteams-form');
let postForm = document.getElementById('newpost-form');
/*
if(loginForm){
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        try{
            let username = document.getElementById('username').value;
            let password = document.getElementById('password').value;
            // username
            username = validation.validateUsername(username, "username");

          
            // password
            password = validation.validatePassword(password,password, "password"); // there is no confirm password in login form, so... maybe we change idk
            
            // clear error message?
          }catch (e){
            console.log(e);
            // print error message 
            return;
          }

        loginForm.submit();
    });
}
/*
if(registerForm){
    registerForm.addEventListener('submit', (event) => {
        event.preventDefault();
        let firstName = document.getElementById('firstName').value;
        let lastName = document.getElementById('lastName').value;
        let username = document.getElementById('username').value;
        let email = document.getElementById('email').value;
        let password = document.getElementById('password').value;
        let confirmPassword  = document.getElementById('confirmPassword').value;

        try{
            // firstName
            firstName = validation.validateName(firstName, "firstName");
            
            // lastName
            lastName = validation.validateName(lastName, "lastName");

            // username
            username = validation.validateUsername(username, "username");

            // email
            email = validation.validateEmail(email, "email");

            // password
            password = validation.validatePassword(password, confirmPassword, "password"); // works for this 

            // clear error message?
          } catch (e){
            // print error message
            return;
          }
        registerForm.submit();
    });
}

if(teamForm){
    teamForm.addEventListener('submit', (event) => {
        event.preventDefault();
        let title = document.getElementById('title').value;
        let desiredRank = document.getElementById('desiredRank').value;
        let desiredRole = document.getElementById('desiredRole').value;
        let region = document.getElementById('region').value;
        let description = document.getElementById('description').value;

        try{
            // check for length and regex stuff yeahhhh
            if (typeof desiredRank === 'string') {
                desiredRank = [desiredRank];
            }
            if (typeof desiredRole === 'string') {
                desiredRole = [desiredRole];
            }
            title = checkString(title, 'title');
            desiredRank = checkStringArray(desiredRank, 'desiredRank');
            desiredRole = checkStringArray(desiredRole, 'desiredRole');
            region = checkString(region, 'region');
            description = checkString(description, 'description');
          } catch (e){
            // print error message
            return;
          }
        teamForm.submit();
    });
}

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
