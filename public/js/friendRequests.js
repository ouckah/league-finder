document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.accept-btn').forEach(button => {
    button.addEventListener('click', async () => {
      const requesterId = button.dataset.requesterId;
      try {
        const res = await fetch(`/friends/request/${requesterId}`, {
          method: 'PATCH',
        });
        if (res.ok) {
          button.closest('.friend-request-item').remove();
        }
      } catch (err) {
        console.error('Error accepting friend request:', err);
      }
    });
  });

  document.querySelectorAll('.reject-btn').forEach(button => {
    button.addEventListener('click', async () => {
      const requesterId = button.dataset.requesterId;
      try {
        const res = await fetch(`/friends/request/${requesterId}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          button.closest('.friend-request-item').remove();
        }
      } catch (err) {
        console.error('Error rejecting friend request:', err);
      }
    });
  });
});