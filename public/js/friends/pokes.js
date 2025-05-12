document.querySelectorAll('.acknowledge-poke-btn').forEach(button => {
  button.addEventListener('click', async () => {
    const pokeId = button.dataset.pokeId;

    try {
      const res = await fetch(`/pokes/acknowledge/${pokeId}`, {
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