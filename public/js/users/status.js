import { throwError, handleFormSubmit } from '../../utils/validation.js';

let statusForm = document.getElementById('status-form');
let errorDiv = document.getElementById('status-error');
let successDiv = document.getElementById('status-success');

if (statusForm) {
  window.addEventListener('DOMContentLoaded', async () => {
    try {
      const res = await fetch(`/users/${userId}`);
      if (!res.ok) throw new Error('Failed to load status.');
      const data = await res.json();
      if (data.status) {
        statusInput.value = data.status;
      }
    } catch (e) {
      console.error('Error loading status:', e);
    }
  });

  statusForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    let status = statusInput.value.trim();

    try {
      if (!status) throw new Error('Status cannot be empty.');

      errorDiv.hidden = true;
      successDiv.hidden = false;
      successDiv.innerHTML = 'Updating status...';

      const response = await fetch(statusForm.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        const data = await response.json();
        window.location.href = `/users/profile/${data.userId}`;
      } else {
        const data = await response.json();
        throwError(data.error, errorDiv, successDiv);
      }
    } catch (e) {
      throwError(e, errorDiv, successDiv);
    }
  });
}