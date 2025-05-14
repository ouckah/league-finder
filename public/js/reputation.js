const thumbsUpButton = document.getElementById('thumbs-up');
const thumbsDownButton = document.getElementById('thumbs-down');

if (thumbsUpButton || thumbsDownButton) {
  let currentVote = 'pending'; // 'none' | 'upvote' | 'downvote'

  const getReputationElement = () => {
    const statBoxes = document.querySelectorAll('.stat-box');
    for (let box of statBoxes) {
      const label = box.querySelector('.stat-label');
      if (label && label.textContent.trim() === 'Reputation') {
        return box.querySelector('.stat-value');
      }
    }
    return null;
  };

  const updateButtonStyles = () => {
    thumbsUpButton.classList.toggle('active', currentVote === 'upvote');
    thumbsDownButton.classList.toggle('active', currentVote === 'downvote');
  };

  const fetchCurrentVote = async (userId) => {
    try {
      const response = await fetch(`/reputation/vote/${userId}`);
      const result = await response.json();

      if (response.ok) {
        currentVote = result.vote || 'none';
        updateButtonStyles();
      } else {
        console.warn('Could not fetch current vote:', result.error);
      }
    } catch (e) {
      console.error('Error fetching current vote:', e);
    }
  };

  const handleUpvoteClick = async (userId) => {
    if (currentVote === 'upvote') return;

    try {
      const response = await fetch(`/reputation/upvote/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });

      const result = await response.json();

      if (!response.ok) {
        alert(`Error: ${result.error}`);
        return;
      }

      const reputationElement = getReputationElement();
      if (reputationElement) {
        const currentValue = parseInt(reputationElement.textContent, 10);
        if (!isNaN(currentValue)) {
          if (currentVote === 'downvote') {
            reputationElement.textContent = currentValue + result.change;
          } else {
            reputationElement.textContent = currentValue + result.change;
          }
        }
      }

      currentVote = 'upvote';
      updateButtonStyles();
    } catch (e) {
      console.error('Failed to update reputation:', e);
      alert('Something went wrong.');
    }
  };

  const handleDownvoteClick = async (userId) => {
    if (currentVote === 'downvote') return;

    try {
      const response = await fetch(`/reputation/downvote/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });

      const result = await response.json();

      if (!response.ok) {
        alert(`Error: ${result.error}`);
        return;
      }

      const reputationElement = getReputationElement();
      if (reputationElement) {
        const currentValue = parseInt(reputationElement.textContent, 10);
        if (!isNaN(currentValue)) {
          if (currentVote === 'upvote') {
            reputationElement.textContent = currentValue + result.change;
          } else {
            reputationElement.textContent = currentValue + result.change;
          }
        }
      }

      currentVote = 'downvote';
      updateButtonStyles();
    } catch (e) {
      console.error('Failed to update reputation:', e);
      alert('Something went wrong.');
    }
  };

  const userId = thumbsUpButton?.getAttribute('data-user-id') || thumbsDownButton?.getAttribute('data-user-id');
  if (userId) {
    fetchCurrentVote(userId);
  }

  if (thumbsUpButton) {
    thumbsUpButton.addEventListener('click', () => {
      if (currentVote == "pending") return
      handleUpvoteClick(userId);
    });
  }

  if (thumbsDownButton) {
    thumbsDownButton.addEventListener('click', () => {
      if (currentVote == "pending") return
      handleDownvoteClick(userId);
    });
  }
}