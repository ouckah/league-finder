const thumbsUpButton = document.getElementById('thumbs-up');
const thumbsDownButton = document.getElementById('thumbs-down');

if (thumbsUpButton || thumbsDownButton) {
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

  const handleUpvoteClick = async (userId) => {
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
          reputationElement.textContent = currentValue + 1;
        }
      }
    } catch (e) {
      console.error('Failed to update reputation:', e);
      alert('Something went wrong.');
    }
  };

  const handleDownvoteClick = async (userId) => {
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
          reputationElement.textContent = currentValue - 1;
        }
      }
    } catch (e) {
      console.error('Failed to update reputation:', e);
      alert('Something went wrong.');
    }
  };

  if (thumbsUpButton) {
    thumbsUpButton.addEventListener('click', () => {
      const userId = thumbsUpButton.getAttribute('data-user-id');
      handleUpvoteClick(userId);
    });
  }

  if (thumbsDownButton) {
    thumbsDownButton.addEventListener('click', () => {
      const userId = thumbsDownButton.getAttribute('data-user-id');
      handleDownvoteClick(userId);
    });
  }
}