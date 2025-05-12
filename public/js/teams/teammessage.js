import * as validation from '../../utils/validation.js';

let chatForm = document.getElementById('teams-chatForm');
let error = document.getElementById('error');


if (chatForm) {
  chatForm.addEventListener('submit', (event) => {
    event.preventDefault();
    error.hidden = true;
    let message = document.getElementById('teamsMessage').value;
    
    if (message.length == 0 || message.length > 128) {
	error.innerHTML = "Message must be between 1 and 128 characters";
	error.hidden = false;
	return;
    }
    chatForm.submit();
    error.hidden = true;
  });
}
