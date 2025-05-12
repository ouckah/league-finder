const friendRequestButton = document.getElementById('send-friend-request');

async function checkFriendStatus(friendId) {
  try {
    const response = await fetch(`/friends/status/${friendId}`);
    const result = await response.json();

    console.log("Friends?:", result)

    if (result.status === 'pending') {
      friendRequestButton.disabled = true;
      friendRequestButton.innerText = 'Request Pending';
    } else if (result.status === 'accepted') {
      friendRequestButton.disabled = true;
      friendRequestButton.innerText = 'Friends';
    }

  } catch (err) {
    console.error('Failed to fetch friend status:', err);
  }
}

if (friendRequestButton) {
  const friendId = friendRequestButton.getAttribute('data-friend-id');

  checkFriendStatus(friendId);

  friendRequestButton.addEventListener('click', async () => {
    try {
      const response = await fetch('/friends/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ friendId })
      });

      const result = await response.json();

      if (response.ok) {
        alert('Friend request sent!');
        friendRequestButton.disabled = true;
        friendRequestButton.innerText = 'Request Sent';
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong while sending the friend request.');
    }
  });
}