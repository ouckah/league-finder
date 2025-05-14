import * as validation from '../../utils/validation.js';

let teamForm = document.getElementById('newteams-form');
let error = document.getElementById('error');
let success = document.getElementById('success');

if (teamForm) {
    teamForm.addEventListener('submit', async (event) => {
	event.preventDefault();
	let title = document.getElementById('title').value;

	// Not sure how we want to handle this. This works for now but it depends on how new team handblebars is done
	let desiredRoles = Array.from(document.querySelectorAll('input[name="desiredRole[]"]:checked'))
	    .map(input => input.value);

	let desiredRanks = Array.from(document.querySelectorAll('input[name="desiredRank[]"]:checked'))
	    .map(input => input.value);

	let region = document.getElementById('region').value;
	let description = document.getElementById('description').value;

	try {
	    validation.validateTeam(title, desiredRanks, desiredRoles, region, description);
	    error.hidden = true;
	    success.hidden = false;
	    success.innerHTML = 'Attempting to create team...';
	    const id = (await validation.handleFormSubmit(teamForm, { title, desiredRanks, desiredRoles, region, description }, null)).id;
	    window.location.href = `/teams/${id}`;
	} catch (e) {
	    validation.throwError(e,error,success);
	    return;
	}

    });
}
