document.addEventListener('DOMContentLoaded', () => {
  const adminLoginCard = document.getElementById('adminLoginCard');
  const dashboardContent = document.getElementById('dashboardContent');
  const loginButton = document.getElementById('loginButton');
  const adminKeyInput = document.getElementById('adminKeyInput');
  const adminMessage = document.getElementById('adminMessage');
  const metricInvited = document.getElementById('metricInvited');
  const metricAttending = document.getElementById('metricAttending');
  const metricDeclined = document.getElementById('metricDeclined');
  const metricPending = document.getElementById('metricPending');
  const searchInput = document.getElementById('searchInput');
  const statusFilter = document.getElementById('statusFilter');
  const exportButton = document.getElementById('exportButton');
  const refreshButton = document.getElementById('refreshButton');
  const tableBody = document.getElementById('rsvpTableBody');

  let adminKey = '';
  let currentRsvps = [];

  async function callAdminApi(endpoint, options = {}) {
    const headers = options.headers || {};
    headers['Content-Type'] = 'application/json';
    headers['x-admin-key'] = adminKey;
    options.headers = headers;

    const response = await fetch(endpoint, options);
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody.error || 'Admin request failed');
    }
    return response.json();
  }

  async function loadMetrics() {
    const data = await callAdminApi('/api/admin/metrics');
    metricInvited.textContent = data.totalInvited;
    metricAttending.textContent = data.confirmedAttendees;
    metricDeclined.textContent = data.declinedInvitations;
    metricPending.textContent = data.pendingResponses;
  }

  async function loadRsvps() {
    const status = statusFilter.value;
    const search = searchInput.value.trim();
    const params = new URLSearchParams({ status, search });
    currentRsvps = await callAdminApi(`/api/admin/rsvps?${params.toString()}`);
    renderTable(currentRsvps);
  }

  function renderTable(entries) {
    tableBody.innerHTML = '';
    if (!entries.length) {
      tableBody.innerHTML = '<tr><td colspan="8">No RSVP records found.</td></tr>';
      return;
    }

    entries.forEach((entry) => {
      const row = document.createElement('tr');

      const dateCell = document.createElement('td');
      dateCell.textContent = new Date(entry.submittedAt).toLocaleString();

      const nameCell = document.createElement('td');
      nameCell.textContent = entry.fullName;

      const emailCell = document.createElement('td');
      emailCell.textContent = entry.email;

      const mobileCell = document.createElement('td');
      mobileCell.textContent = entry.mobile;

      const guestsCell = document.createElement('td');
      const guestsInput = document.createElement('input');
      guestsInput.type = 'number';
      guestsInput.min = '0';
      guestsInput.value = entry.guests;
      guestsInput.className = 'inline-input';
      guestsInput.addEventListener('change', () => updateRsvp(entry.id, { guests: Number(guestsInput.value) }));
      guestsCell.appendChild(guestsInput);

      const statusCell = document.createElement('td');
      const statusSelect = document.createElement('select');
      ['Attending', 'Not Attending'].forEach((optionText) => {
        const option = document.createElement('option');
        option.value = optionText;
        option.textContent = optionText;
        if (entry.status === optionText) option.selected = true;
        statusSelect.appendChild(option);
      });
      statusSelect.className = 'inline-select';
      statusSelect.addEventListener('change', () => updateRsvp(entry.id, { status: statusSelect.value }));
      statusCell.appendChild(statusSelect);

      const updatedCell = document.createElement('td');
      updatedCell.textContent = new Date(entry.updatedAt).toLocaleString();

      const actionCell = document.createElement('td');
      const deleteButton = document.createElement('button');
      deleteButton.type = 'button';
      deleteButton.textContent = 'Delete';
      deleteButton.className = 'btn btn-secondary small-button';
      deleteButton.addEventListener('click', () => deleteRsvp(entry.id));
      actionCell.appendChild(deleteButton);

      row.append(dateCell, nameCell, emailCell, mobileCell, guestsCell, statusCell, updatedCell, actionCell);
      tableBody.appendChild(row);
    });
  }

  async function updateRsvp(id, updates) {
    try {
      await callAdminApi(`/api/admin/rsvps/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
      await loadMetrics();
      adminMessage.textContent = 'RSVP updated successfully.';
      adminMessage.className = 'admin-message success';
    } catch (error) {
      adminMessage.textContent = error.message;
      adminMessage.className = 'admin-message error';
    }
  }

  async function deleteRsvp(id) {
    if (!confirm('Delete this RSVP response?')) {
      return;
    }

    try {
      await callAdminApi(`/api/admin/rsvps/${id}`, { method: 'DELETE' });
      adminMessage.textContent = 'RSVP deleted successfully.';
      adminMessage.className = 'admin-message success';
      await loadMetrics();
      await loadRsvps();
    } catch (error) {
      adminMessage.textContent = error.message;
      adminMessage.className = 'admin-message error';
    }
  }

  function exportCsv(entries) {
    const header = ['Full Name', 'Email', 'Mobile', 'Guests', 'Status', 'Submitted At', 'Updated At'];
    const rows = entries.map((entry) => [
      entry.fullName,
      entry.email,
      entry.mobile,
      entry.guests,
      entry.status,
      entry.submittedAt,
      entry.updatedAt,
    ]);
    const csv = [header, ...rows].map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'wedding-rsvps.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  async function unlockDashboard() {
    const key = adminKeyInput.value.trim();
    if (!key) {
      adminMessage.textContent = 'Enter the admin key to continue.';
      adminMessage.className = 'admin-message error';
      return;
    }

    adminKey = key;
    try {
      await loadMetrics();
      await loadRsvps();
      adminLoginCard.classList.add('hidden');
      dashboardContent.classList.remove('hidden');
      adminMessage.textContent = '';
    } catch (error) {
      adminMessage.textContent = 'Invalid admin key or unable to access dashboard.';
      adminMessage.className = 'admin-message error';
      adminKey = '';
    }
  }

  loginButton.addEventListener('click', unlockDashboard);
  exportButton.addEventListener('click', () => exportCsv(currentRsvps));
  refreshButton.addEventListener('click', loadRsvps);
  searchInput.addEventListener('input', loadRsvps);
  statusFilter.addEventListener('change', loadRsvps);
});
