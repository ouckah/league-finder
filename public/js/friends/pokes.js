document.getElementById('poke-btn')?.addEventListener('click', async (e) => {
  const userId = e.target.dataset.userId;

  try {
    const statusRes = await fetch(`/poke/${userId}`);
    if (!statusRes.ok) {
      alert('Failed to check poke status.');
      return;
    }

    const statusData = await statusRes.json();
    if (statusData.status == false) { // cant do !status cause status can be null
      alert('You already poked this user.');
      return;
    }

    const res = await fetch(`/poke/${userId}`, {
      method: 'POST',
    });

    if (res.ok) {
      alert('You poked them!');
    } else {
      alert('Failed to poke.');
    }
  } catch (err) {
    console.error(err);
    alert('An error occurred.');
  }
});

document.querySelectorAll('.acknowledge-poke-btn').forEach(button => {
  button.addEventListener('click', async () => {
    const pokeId = button.dataset.pokeId;

    try {
      const res = await fetch(`/poke/acknowledge/${pokeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        const { error } = await res.json();
        alert(`Error acknowledging poke: ${error}`);
        return;
      }

      const pokeItem = button.closest('.poke-item');
      if (pokeItem) pokeItem.remove();
    } catch (e) {
      console.error('Failed to acknowledge poke:', e);
      alert('Something went wrong.');
    }
  });
});