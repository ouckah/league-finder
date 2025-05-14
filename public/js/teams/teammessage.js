import * as validation from '../../utils/validation.js';

let chatForm = document.getElementById('teams-chatform');
let error = document.getElementById('error');


if (chatForm) {
  chatForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    error.hidden = true;
    let teamsmessage = document.getElementById('teamsmessage').value;
    
    if (teamsmessage.length == 0 || teamsmessage.length > 128) {
	error.innerHTML = "Message must be between 1 and 128 characters";
	error.hidden = false;
	return;
    }
    try {
	await validation.handleFormSubmit(chatForm, {teamsmessage}, null);
	window.location.reload();
    } catch (e) {
	error.innerHTML = e.error;
	error.hidden = false;
    }
    error.hidden = true;
  });
}
