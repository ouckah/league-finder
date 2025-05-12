import { throwError } from '../../utils/validation.js';

let deleteAccountForm = document.getElementById('deleteAccountForm');
let errorDiv = document.getElementById('error');


// todo, fix this and the route(lowercase username not working)
if (deleteAccountForm) {
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
        throwError(e,errorDiv);
        return; // handle error message
      }
    });
  }
  