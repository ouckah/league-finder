import * as validation from '../../utils/validation.js';

let requestsForm = document.getElementById('teamsRequestForm');
let kickForm = document.getElementById('teamsKickForm');
let error = document.getElementById('error');
let success = document.getElementById('success');

if (requestsForm) {
    requestsForm.addEventListener('submit', async (event) => {
	event.preventDefault();
	try {
	    const requests = document.querySelector('input[name="teamsRequests"]:checked')?.value;
	    const _method = "PATCH";
	    if(!requests) {
		throw new Error('No requests selected');
	    }
	    error.hidden = true;
	    success.hidden = false;
	    success.innerHTML = 'Attempting to Accept Member Request...';
	    await validation.handleFormSubmit(requestsForm, {requests, _method}, null);
	    window.location.reload()
	} catch (e) {
	    validation.throwError(e,error,success);
	    return;
	}

    });
}

if (kickForm) {
    kickForm.addEventListener('submit', async (event) => {
	event.preventDefault();
	try {
	    const members = document.querySelector('input[name="teamsMembers"]:checked')?.value;
	    const _method = "PATCH";
	    if(!members) {
		throw new Error('No members selected');
	    }
	    error.hidden = true;
	    success.hidden = false;
	    success.innerHTML = 'Attempting to Accept Member Request...';
	    await validation.handleFormSubmit(kickForm, {members, _method}, null);
	    window.location.reload()
	} catch (e) {
	    validation.throwError(e,error,success);
	    return;
	}

    });
}
