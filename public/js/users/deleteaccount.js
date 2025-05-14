import { throwError, checkString } from '../../utils/validation.js';

let deleteAccountForm = document.getElementById('deleteAccountForm');
let errorDiv = document.getElementById('error');
let successDiv = document.getElementById('success');  


if (deleteAccountForm) {
    deleteAccountForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      let confirm = document.getElementById('confirm').value;
      try {
        if (!confirm) {
          throw 'Confirmation is required'; // handle empty confirmation 
        }

        confirm = checkString(confirm, 'confirm');

        // Show success message before form submission
        errorDiv.hidden = true;
        successDiv.hidden = false;
        successDiv.innerHTML = 'Deleting account...';
        const response = await fetch(deleteAccountForm.action, {
          method: 'DELETE',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ confirm })
        });
        if (response.ok) {
          window.location.href = '/';
        } else {
          const result = await response.json();
          throw result.error;
        }
      } catch (e) {
        throwError(e,errorDiv,successDiv);
      }
    });
  }
  
  