document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('rsvpForm');
  const responseBox = document.getElementById('rsvpResponse');

  if (!form || !responseBox) {
    return;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    responseBox.textContent = '';
    responseBox.classList.remove('success', 'error');

    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const mobile = document.getElementById('mobile').value.trim();
    const guests = document.getElementById('guests').value;
    const status = document.getElementById('status').value;

    if (!fullName || !email || !mobile || !status) {
      responseBox.textContent = 'Please fill in all required fields.';
      responseBox.classList.add('error');
      return;
    }

    const payload = { fullName, email, mobile, guests, status };
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        responseBox.textContent = result.error || 'Unable to submit RSVP. Please try again later.';
        responseBox.classList.add('error');
        return;
      }

      responseBox.textContent = result.message || 'Thank you! Your RSVP has been received.';
      responseBox.classList.add('success');
      form.reset();
      document.getElementById('guests').value = 1;
    } catch (error) {
      responseBox.textContent = 'An error occurred while sending your RSVP. Please check your connection and try again.';
      responseBox.classList.add('error');
    }
  });
});
