import { validateEdit, throwError } from '../../utils/validation.js';

let editProfileForm = document.getElementById('edit-profile-form');
let errorDiv = document.getElementById('error');
let successDiv = document.getElementById('success');

if (editProfileForm) {
    editProfileForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      let username = document.getElementById('username').value;
      let email = document.getElementById('email').value;
      let biography = document.getElementById('biography').value;
      let riotId = document.getElementById('riotId').value;
      let region = document.getElementById('region').value;
      let preferredRoles = Array.from(document.querySelectorAll('input[name="preferredRoles[]"]:checked'))
        .map(input => input.value);
      let profilePicture = document.getElementById('profilePicture').value;
      try {
        validateEdit(username, email, biography, riotId, region, preferredRoles, profilePicture);
        errorDiv.hidden = true;
        successDiv.hidden = false;
        successDiv.innerHTML = 'Attempting to edit profile...';
        const response = await fetch(editProfileForm.action, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username,
            email,
            biography,
            riotId,
            region,
            preferredRoles,
            profilePicture
          })
        });
        if (response.ok) {
          const data = await response.json();
          window.location.href = `/users/profile/${data.userId}`;
        } else {
          const data = await response.json();
          throwError(data.error,errorDiv,successDiv);
        }
      } catch (e) {
        throwError(e,errorDiv,successDiv);
      }
    });
  }