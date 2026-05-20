/**
 * SpoolControl - Core Application Logic
 * State management, local storage synchronization, UI rendering, Chart.js charts, and calculators.
 */

// ==========================================================================
// Application State
// ==========================================================================
let state = {
  filaments: [],
  logs: [],
  users: [],
  activeOwner: 'all' // Current filtered owner ('all', 'shared', or user ID)
};

// Chart.js instances to destroy/recreate on update
let charts = {
  materials: null,
  status: null,
  usageOwner: null,
  successRate: null
};

// ==========================================================================
// DB Abstraction & Initialization
// ==========================================================================
function initDB() {
  const localData = localStorage.getItem('spoolcontrol_state');
  if (localData) {
    try {
      state = JSON.parse(localData);
      // Backwards compatibility check
      if (!state.activeOwner) state.activeOwner = 'all';
      if (!state.settings) {
        state.settings = {
          appName: 'SpoolControl',
          appSubtitle: 'Filament Manager',
          appLogoEmoji: '🎨'
        };
      }
    } catch (e) {
      console.error('Failed to parse localStorage, resetting to samples.', e);
      loadSampleData();
    }
  } else {
    loadSampleData();
  }
}

function saveState() {
  localStorage.setItem('spoolcontrol_state', JSON.stringify(state));
}

function loadSampleData() {
  state.users = [...SAMPLE_USERS];
  state.filaments = [...SAMPLE_FILAMENTS];
  state.logs = [...SAMPLE_LOGS];
  state.activeOwner = 'all';
  state.settings = {
    appName: 'SpoolControl',
    appSubtitle: 'Filament Manager',
    appLogoEmoji: '🎨'
  };
  saveState();
  showNotification('Sample data loaded successfully!');
  updateUI();
}

function clearDatabase() {
  state.users = [
    { id: "u-default", name: "Devin", color: "#6366f1", avatar: "👤" },
    { id: "shared", name: "Shared Lab", color: "#f59e0b", avatar: "🔬" }
  ];
  state.filaments = [];
  state.logs = [];
  state.activeOwner = 'all';
  state.settings = {
    appName: 'SpoolControl',
    appSubtitle: 'Filament Manager',
    appLogoEmoji: '🎨'
  };
  saveState();
  showNotification('Database cleared. Default user created.', 'error');
  updateUI();
}

function applyBranding() {
  if (!state.settings) {
    state.settings = {
      appName: 'SpoolControl',
      appSubtitle: 'Filament Manager',
      appLogoEmoji: '🎨'
    };
  }
  
  const titleDisplay = document.getElementById('app-title-display');
  const subtitleDisplay = document.getElementById('app-subtitle-display');
  const logoContainer = document.getElementById('app-logo-container');
  
  if (titleDisplay) titleDisplay.textContent = state.settings.appName || 'SpoolControl';
  if (subtitleDisplay) subtitleDisplay.textContent = state.settings.appSubtitle || 'Filament Manager';
  
  if (logoContainer) {
    // If emoji is "SVG" or empty, show default logo SVG
    const emoji = (state.settings.appLogoEmoji || '').trim().toUpperCase();
    if (emoji === 'SVG' || !state.settings.appLogoEmoji) {
      logoContainer.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      `;
    } else {
      logoContainer.innerHTML = `<span style="font-size: 22px; line-height: 1; display: flex; align-items: center; justify-content: center;">${state.settings.appLogoEmoji}</span>`;
    }
  }

  // Populate inputs under Customization tab if empty
  const appNameInput = document.getElementById('settings-app-name');
  const appSubInput = document.getElementById('settings-app-subtitle');
  const appLogoInput = document.getElementById('settings-app-logo');
  
  if (appNameInput && !appNameInput.value) appNameInput.value = state.settings.appName || 'SpoolControl';
  if (appSubInput && !appSubInput.value) appSubInput.value = state.settings.appSubtitle || 'Filament Manager';
  if (appLogoInput && !appLogoInput.value) appLogoInput.value = state.settings.appLogoEmoji || '🎨';

  // Dynamically set page title
  document.title = `${state.settings.appName || 'SpoolControl'} - 3D Printer Filament Tracker`;
}

// ==========================================================================
// Notification Manager
// ==========================================================================
function showNotification(message, type = 'success') {
  const banner = document.getElementById('notification');
  banner.querySelector('.notification-text').textContent = message;
  
  if (type === 'error') {
    banner.classList.add('error');
    banner.style.borderColor = 'var(--danger)';
  } else {
    banner.classList.remove('error');
    banner.style.borderColor = 'var(--success)';
  }
  
  banner.classList.add('show');
  setTimeout(() => {
    banner.classList.remove('show');
  }, 3500);
}

// ==========================================================================
// Modal Controllers
// ==========================================================================
function openModal(modalId) {
  document.getElementById(modalId).classList.add('open');
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('open');
}

// ==========================================================================
// UI Rendering Operations
// ==========================================================================
function updateUI() {
  applyBranding();
  renderActiveUserSelectors();
  renderDashboardStats();
  renderCharts();
  renderFilamentsGrid();
  renderLogsTable();
  populateDropdowns();
  updateWeighCalculatorSelection();
}

function populateDropdowns() {
  // Filament form Owner select
  const formOwnerSelect = document.getElementById('form-owner');
  const printUserSelect = document.getElementById('form-print-user');
  const modalUsersSelect = document.getElementById('sidebar-owner-filter');
  const inventoryOwnerSelect = document.getElementById('filter-owner');
  
  // Clear options
  formOwnerSelect.innerHTML = '';
  printUserSelect.innerHTML = '';
  modalUsersSelect.innerHTML = '<option value="all">🌐 All Owners</option>';
  if (inventoryOwnerSelect) {
    inventoryOwnerSelect.innerHTML = '<option value="all">All Owners</option>';
  }
  
  state.users.forEach(user => {
    const opt = document.createElement('option');
    opt.value = user.id;
    opt.textContent = `${user.avatar} ${user.name}`;
    formOwnerSelect.appendChild(opt.cloneNode(true));
    printUserSelect.appendChild(opt.cloneNode(true));
    
    const optFilter = document.createElement('option');
    optFilter.value = user.id;
    optFilter.textContent = `${user.avatar} ${user.name}`;
    modalUsersSelect.appendChild(optFilter);

    if (inventoryOwnerSelect) {
      const optFilterInv = document.createElement('option');
      optFilterInv.value = user.id;
      optFilterInv.textContent = `${user.avatar} ${user.name}`;
      inventoryOwnerSelect.appendChild(optFilterInv);
    }
  });
  
  // Restore filter selection
  modalUsersSelect.value = state.activeOwner;
  if (inventoryOwnerSelect) {
    inventoryOwnerSelect.value = state.activeOwner;
  }

  // Print form filament select
  const printFilamentSelect = document.getElementById('form-print-filament');
  printFilamentSelect.innerHTML = '<option value="" disabled selected>-- Select a spool --</option>';
  
  // Only list filaments that are not empty
  const activeFilaments = state.filaments.filter(f => f.status !== 'Empty');
  activeFilaments.forEach(f => {
    const opt = document.createElement('option');
    opt.value = f.id;
    opt.textContent = `${f.brand} ${f.material} - ${f.colorName} (${f.currentWeight}g left)`;
    printFilamentSelect.appendChild(opt);
  });
}

// 2. Render sidebar owner tags
function renderActiveUserSelectors() {
  const container = document.getElementById('modal-users-list');
  if (!container) return;
  
  container.innerHTML = '';
  
  state.users.forEach(user => {
    const card = document.createElement('div');
    card.className = 'user-manager-card';
    card.style.setProperty('--user-color', user.color);
    card.style.setProperty('--user-color-glow', user.color + '20');
    
    // Cannot delete the final user or the shared account
    const canDelete = state.users.length > 2 && user.id !== 'shared';
    
    card.innerHTML = `
      <div class="user-manager-avatar">${user.avatar}</div>
      <div class="user-manager-name">${user.name}</div>
      ${canDelete ? `<button type="button" class="user-manager-delete" data-id="${user.id}">&times;</button>` : ''}
    `;
    
    if (canDelete) {
      card.querySelector('.user-manager-delete').addEventListener('click', (e) => {
        e.stopPropagation();
        deleteUser(user.id);
      });
    }
    
    container.appendChild(card);
  });
}

// Delete user helper
function deleteUser(userId) {
  // Re-assign any filament/log owned by this user to 'shared'
  state.filaments.forEach(f => {
    if (f.ownerId === userId) f.ownerId = 'shared';
  });
  state.logs.forEach(l => {
    if (l.userId === userId) l.userId = 'shared';
  });
  
  state.users = state.users.filter(u => u.id !== userId);
  if (state.activeOwner === userId) state.activeOwner = 'all';
  
  saveState();
  showNotification('User deleted. Filaments & logs reassigned to Shared Lab.', 'error');
  updateUI();
}

// 3. Render Metric Cards
function renderDashboardStats() {
  const activeFilaments = getFilteredFilaments();
  const activeLogs = getFilteredLogs();
  
  // Total Value
  const totalValue = activeFilaments.reduce((acc, curr) => {
    if (curr.status === 'Empty') return acc;
    // Value proportional to remaining filament
    const cost = curr.cost || 0;
    const netWeight = curr.spoolWeight || 1000;
    const remaining = curr.currentWeight || 0;
    return acc + (cost * (remaining / netWeight));
  }, 0);
  document.getElementById('stat-total-value').textContent = `$${totalValue.toFixed(2)}`;
  
  // Total Stock Weight
  const totalWeightGrams = activeFilaments.reduce((acc, curr) => acc + (curr.currentWeight || 0), 0);
  const totalWeightKg = totalWeightGrams / 1000;
  document.getElementById('stat-total-weight').textContent = `${totalWeightKg.toFixed(2)} kg`;
  
  // Active Spools (not empty, not sealed)
  const activeSpoolsCount = activeFilaments.filter(f => f.status === 'In Use').length;
  document.getElementById('stat-active-spools').textContent = activeSpoolsCount;
  
  // Low Stock alert (In use or Sealed but < 100g)
  const lowStockCount = activeFilaments.filter(f => f.status !== 'Empty' && f.currentWeight < 100).length;
  document.getElementById('stat-low-stock').textContent = lowStockCount;
  
  const lowStockCard = document.getElementById('stat-low-stock-card');
  if (lowStockCount > 0) {
    lowStockCard.style.borderColor = 'var(--danger)';
    lowStockCard.querySelector('.metric-icon').classList.add('val-icon'); // apply alert flash
  } else {
    lowStockCard.style.borderColor = 'var(--card-border)';
  }

  // Update status badge
  const activeOwnerObj = state.users.find(u => u.id === state.activeOwner);
  const ind = document.getElementById('dashboard-filter-indicator');
  if (state.activeOwner === 'all') {
    ind.textContent = '🌐 Showing All Owners';
    ind.className = 'badge badge-info';
  } else if (activeOwnerObj) {
    ind.textContent = `${activeOwnerObj.avatar} ${activeOwnerObj.name}'s Stock`;
    ind.className = 'badge';
    ind.style.backgroundColor = activeOwnerObj.color + '25';
    ind.style.color = activeOwnerObj.color;
  }
}

// 4. Render Filament Spools Grid
function renderFilamentsGrid() {
  const container = document.getElementById('filaments-container');
  const emptyState = document.getElementById('inventory-empty-state');
  container.innerHTML = '';
  
  const filtered = getFilteredFilaments();
  
  // Apply Search
  const searchVal = document.getElementById('global-search').value.toLowerCase().trim();
  const searched = filtered.filter(f => {
    if (!searchVal) return true;
    const owner = state.users.find(u => u.id === f.ownerId);
    const ownerName = owner ? owner.name.toLowerCase() : '';
    return f.brand.toLowerCase().includes(searchVal) ||
           f.material.toLowerCase().includes(searchVal) ||
           f.colorName.toLowerCase().includes(searchVal) ||
           ownerName.includes(searchVal) ||
           (f.location && f.location.toLowerCase().includes(searchVal)) ||
           (f.notes && f.notes.toLowerCase().includes(searchVal));
  });

  // Apply Material and Status select filters (on the inventory tab)
  const matFilter = document.getElementById('filter-material').value;
  const statFilter = document.getElementById('filter-status').value;
  
  let finalFilaments = searched;
  if (matFilter !== 'all') {
    finalFilaments = finalFilaments.filter(f => f.material === matFilter);
  }
  if (statFilter !== 'all') {
    finalFilaments = finalFilaments.filter(f => f.status === statFilter);
  }

  // Apply Sorting
  const sortBy = document.getElementById('sort-by').value;
  finalFilaments.sort((a, b) => {
    if (sortBy === 'remaining-desc') return b.currentWeight - a.currentWeight;
    if (sortBy === 'remaining-asc') return a.currentWeight - b.currentWeight;
    if (sortBy === 'brand') return a.brand.localeCompare(b.brand);
    if (sortBy === 'purchaseDate-desc') {
      const dateA = a.purchaseDate ? new Date(a.purchaseDate) : new Date(0);
      const dateB = b.purchaseDate ? new Date(b.purchaseDate) : new Date(0);
      return dateB - dateA;
    }
    if (sortBy === 'cost-desc') return (b.cost || 0) - (a.cost || 0);
    return 0;
  });

  if (finalFilaments.length === 0) {
    emptyState.style.display = 'flex';
    container.style.display = 'none';
    return;
  } else {
    emptyState.style.display = 'none';
    container.style.display = 'grid';
  }

  finalFilaments.forEach(fil => {
    const owner = state.users.find(u => u.id === fil.ownerId) || { name: 'Unknown', color: '#ccc', avatar: '👤' };
    const pct = Math.min(100, Math.max(0, (fil.currentWeight / fil.spoolWeight) * 100));
    const isLow = fil.currentWeight < 100 && fil.status !== 'Empty';
    
    const card = document.createElement('div');
    card.className = `filament-card ${fil.status === 'Empty' ? 'empty-spool' : ''}`;
    card.style.setProperty('--accent-color', fil.colorHex);
    
    card.innerHTML = `
      <div>
        <div class="filament-card-header">
          <div class="filament-brand-material">
            <span class="filament-brand">${fil.brand}</span>
            <span class="filament-material-name">${fil.material}</span>
          </div>
          <div class="filament-color-indicator">
            <span class="color-dot" style="background-color: ${fil.colorHex}"></span>
            <span>${fil.colorName}</span>
          </div>
        </div>

        <div class="filament-stats">
          <div class="filament-weight-labels">
            <span class="weight-percentage">${pct.toFixed(0)}% left</span>
            <span class="weight-fraction">${fil.currentWeight}g / ${fil.spoolWeight}g</span>
          </div>
          <div class="filament-progress-wrapper">
            <div class="filament-progress-bar ${isLow ? 'low-stock' : ''}" style="width: ${pct}%; background-color: ${fil.colorHex}"></div>
          </div>
        </div>

        <div class="filament-meta-grid">
          <div class="meta-item">
            <span class="meta-label">Owner</span>
            <span class="owner-pill" style="--owner-color: ${owner.color}; --owner-color-glow: ${owner.color}15">
              <span>${owner.avatar}</span> <span>${owner.name}</span>
            </span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Location</span>
            <span class="meta-value">${fil.location || 'Not Specified'}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Specs</span>
            <span class="meta-value">${fil.diameter.toFixed(2)}mm • $${(fil.cost || 0).toFixed(2)}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Status</span>
            <span class="meta-value">
              <span class="badge ${getStatusBadgeClass(fil.status)}">${fil.status}</span>
            </span>
          </div>
        </div>
        
        ${fil.notes ? `
          <div class="form-group" style="margin-top: 10px; margin-bottom: 0;">
            <span class="meta-label">Notes</span>
            <span class="meta-value" style="font-size: 0.72rem; line-height: 1.3; color: var(--text-muted);">${fil.notes}</span>
          </div>
        ` : ''}
      </div>

      <div class="filament-card-footer">
        ${fil.status !== 'Empty' ? `
          <button class="btn btn-primary btn-sm btn-log-quick" data-id="${fil.id}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            Print
          </button>
        ` : ''}
        <button class="btn btn-outline btn-sm btn-weigh-quick" data-id="${fil.id}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/></svg>
          Weigh
        </button>
        <button class="btn btn-outline btn-sm btn-edit-spool" data-id="${fil.id}" style="max-width: 40px; padding: 6px; flex-shrink: 0;" title="Edit Spool">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        </button>
        <button class="btn btn-outline btn-sm btn-delete-spool" data-id="${fil.id}" style="max-width: 40px; padding: 6px; flex-shrink: 0; color: var(--danger); border-color: rgba(244, 63, 94, 0.2);" title="Delete Spool">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 14px; height: 14px;"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      </div>
    `;
    
    // Quick Print Log event listener
    const logBtn = card.querySelector('.btn-log-quick');
    if (logBtn) {
      logBtn.addEventListener('click', () => {
        document.getElementById('form-print-filament').value = fil.id;
        // Trigger select event to update helper
        document.getElementById('form-print-filament').dispatchEvent(new Event('change'));
        openModal('modal-print');
      });
    }

    // Quick Spool Weigh event listener
    card.querySelector('.btn-weigh-quick').addEventListener('click', () => {
      document.getElementById('weigh-filament-select').value = fil.id;
      // Trigger update calculation
      document.getElementById('weigh-filament-select').dispatchEvent(new Event('change'));
      // Navigate to calculators tab
      document.querySelector('button[data-tab="calculators"]').click();
    });

    // Edit Spool event listener
    card.querySelector('.btn-edit-spool').addEventListener('click', () => {
      populateFilamentForm(fil);
      openModal('modal-filament');
    });

    // Quick Delete Spool event listener
    card.querySelector('.btn-delete-spool').addEventListener('click', () => {
      if (confirm(`Are you sure you want to delete the spool: ${fil.brand} ${fil.material} - ${fil.colorName}? The spool will be removed, but historical logs will be preserved.`)) {
        state.filaments = state.filaments.filter(f => f.id !== fil.id);
        saveState();
        showNotification('Filament spool deleted.', 'error');
        populateMaterialFilter();
        updateUI();
      }
    });

    container.appendChild(card);
  });
}

function getStatusBadgeClass(status) {
  if (status === 'In Use') return 'badge-info';
  if (status === 'Sealed') return 'badge-success';
  if (status === 'Stowed') return 'badge-warning';
  return 'badge-danger'; // Empty
}

// 5. Render Logs Table
function renderLogsTable() {
  const body = document.getElementById('logs-table-body');
  const emptyState = document.getElementById('logs-empty-state');
  const table = document.getElementById('logs-table');
  body.innerHTML = '';
  
  const filteredLogs = getFilteredLogs();
  
  if (filteredLogs.length === 0) {
    emptyState.style.display = 'flex';
    table.style.display = 'none';
    return;
  } else {
    emptyState.style.display = 'none';
    table.style.display = 'table';
  }

  // Sort logs by date descending
  const sortedLogs = [...filteredLogs].sort((a, b) => new Date(b.date) - new Date(a.date));

  sortedLogs.forEach(log => {
    // Find filament details
    const fil = state.filaments.find(f => f.id === log.filamentId) || { brand: 'Unknown', material: 'Filament', colorName: 'Deleted', colorHex: '#777' };
    const user = state.users.find(u => u.id === log.userId) || { name: 'Unknown', color: '#777', avatar: '👤' };
    
    const formattedDate = new Date(log.date).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${formattedDate}</td>
      <td>
        <span class="table-user-badge" style="color: ${user.color}">
          <span class="table-user-dot" style="background-color: ${user.color}"></span>
          <span>${user.name}</span>
        </span>
      </td>
      <td style="font-weight: 600; color: white;">${log.printName}</td>
      <td>
        <span class="table-spool-badge">
          <span class="color-dot" style="background-color: ${fil.colorHex}; width: 12px; height: 12px;"></span>
          <span>${fil.brand} ${fil.material} (${fil.colorName})</span>
        </span>
      </td>
      <td>${log.weightUsed}g</td>
      <td>${formatDuration(log.durationMinutes)}</td>
      <td>
        <span class="badge ${log.status === 'success' ? 'badge-success' : 'badge-danger'}">
          ${log.status === 'success' ? 'Success' : 'Failed'}
        </span>
      </td>
      <td style="font-size: 0.8rem; color: var(--text-muted); max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${log.notes || ''}">
        ${log.notes || ''}
      </td>
      <td>
        <button class="btn btn-outline btn-sm btn-delete-log" data-id="${log.id}" style="color: var(--danger); border-color: transparent; padding: 4px 8px;">
          Delete
        </button>
      </td>
    `;
    
    tr.querySelector('.btn-delete-log').addEventListener('click', () => {
      if (confirm('Are you sure you want to delete this print log? The used weight will be restored to the spool.')) {
        deletePrintLog(log.id);
      }
    });

    body.appendChild(tr);
  });
}

function formatDuration(minutes) {
  if (!minutes) return '0m';
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
}

// Delete print log and restore weight to spool
function deletePrintLog(logId) {
  const log = state.logs.find(l => l.id === logId);
  if (!log) return;
  
  // Find associated spool and add weight back
  const fil = state.filaments.find(f => f.id === log.filamentId);
  if (fil) {
    fil.currentWeight = Math.min(fil.spoolWeight, fil.currentWeight + log.weightUsed);
    // If it was marked empty and we restore weight, change status back to 'In Use'
    if (fil.status === 'Empty' && fil.currentWeight > 0) {
      fil.status = 'In Use';
    }
  }

  // Remove log
  state.logs = state.logs.filter(l => l.id !== logId);
  saveState();
  showNotification('Print log deleted. Filament weight restored to spool.');
  updateUI();
}

// 6. Update list of materials filter options
function populateMaterialFilter() {
  const select = document.getElementById('filter-material');
  const selectedVal = select.value;
  select.innerHTML = '<option value="all">All Materials</option>';
  
  // Extract unique materials
  const materials = [...new Set(state.filaments.map(f => f.material))];
  materials.forEach(mat => {
    const opt = document.createElement('option');
    opt.value = mat;
    opt.textContent = mat;
    select.appendChild(opt);
  });
  
  // Restore value if still valid
  if (materials.includes(selectedVal)) {
    select.value = selectedVal;
  }
}

// Update calculator selector
function updateWeighCalculatorSelection() {
  const select = document.getElementById('weigh-filament-select');
  const selectedVal = select.value;
  select.innerHTML = '<option value="" disabled selected>-- Select a spool --</option>';
  
  // Only list spools that aren't empty
  const activeFilaments = state.filaments.filter(f => f.status !== 'Empty');
  activeFilaments.forEach(f => {
    const opt = document.createElement('option');
    opt.value = f.id;
    opt.textContent = `${f.brand} ${f.material} - ${f.colorName} (${f.currentWeight}g left)`;
    select.appendChild(opt);
  });

  if (state.filaments.some(f => f.id === selectedVal)) {
    select.value = selectedVal;
  }
}

// ==========================================================================
// Chart.js Manager
// ==========================================================================
function renderCharts() {
  const activeFilaments = getFilteredFilaments();
  const activeLogs = getFilteredLogs();
  
  // Destroy existing charts to prevent memory leaks/glitches
  Object.keys(charts).forEach(key => {
    if (charts[key]) {
      charts[key].destroy();
      charts[key] = null;
    }
  });

  // Chart configuration defaults
  Chart.defaults.color = 'var(--text-muted)';
  Chart.defaults.font.family = 'var(--font-main)';
  Chart.defaults.font.size = 11;

  // 1. Material Distribution Chart (Doughnut)
  const matCounts = {};
  activeFilaments.forEach(f => {
    if (f.status !== 'Empty') {
      matCounts[f.material] = (matCounts[f.material] || 0) + f.currentWeight;
    }
  });

  const matLabels = Object.keys(matCounts);
  const matValues = Object.values(matCounts).map(v => (v / 1000).toFixed(2)); // to kg

  const ctxMaterials = document.getElementById('chart-materials').getContext('2d');
  charts.materials = new Chart(ctxMaterials, {
    type: 'doughnut',
    data: {
      labels: matLabels,
      datasets: [{
        data: matValues,
        backgroundColor: [
          '#6366f1', '#ec4899', '#10b981', '#f59e0b', '#06b6d4', 
          '#a855f7', '#84cc16', '#06b6d4', '#f43f5e'
        ],
        borderWidth: 1,
        borderColor: 'var(--bg-secondary)'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'right' },
        tooltip: {
          callbacks: {
            label: function(context) {
              return ` ${context.label}: ${context.raw} kg`;
            }
          }
        }
      },
      cutout: '65%'
    }
  });

  // 2. Spool Status Chart (Pie)
  const statusCounts = { 'In Use': 0, 'Sealed': 0, 'Stowed': 0, 'Empty': 0 };
  activeFilaments.forEach(f => {
    statusCounts[f.status] = (statusCounts[f.status] || 0) + 1;
  });

  const ctxStatus = document.getElementById('chart-status').getContext('2d');
  charts.status = new Chart(ctxStatus, {
    type: 'pie',
    data: {
      labels: Object.keys(statusCounts),
      datasets: [{
        data: Object.values(statusCounts),
        backgroundColor: ['#06b6d4', '#10b981', '#f59e0b', '#f43f5e'],
        borderWidth: 1,
        borderColor: 'var(--bg-secondary)'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'right' }
      }
    }
  });

  // 3. Total Usage by Owner Chart (Horizontal Bar)
  const usageOwnerCounts = {};
  state.users.forEach(u => {
    usageOwnerCounts[u.name] = 0;
  });
  
  // Sum print logs weight per user
  activeLogs.forEach(log => {
    const user = state.users.find(u => u.id === log.userId);
    if (user) {
      usageOwnerCounts[user.name] += log.weightUsed;
    }
  });

  const userLabels = Object.keys(usageOwnerCounts);
  const userColors = userLabels.map(name => {
    const user = state.users.find(u => u.name === name);
    return user ? user.color : '#6366f1';
  });

  const ctxUsage = document.getElementById('chart-usage-owner').getContext('2d');
  charts.usageOwner = new Chart(ctxUsage, {
    type: 'bar',
    data: {
      labels: userLabels,
      datasets: [{
        label: 'Grams Used',
        data: Object.values(usageOwnerCounts),
        backgroundColor: userColors,
        borderRadius: 6
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: { grid: { color: 'rgba(255, 255, 255, 0.05)' } },
        y: { grid: { display: false } }
      }
    }
  });

  // 4. Print Success Rate Chart (Doughnut)
  let successCount = 0;
  let failedCount = 0;
  activeLogs.forEach(l => {
    if (l.status === 'success') successCount++;
    else failedCount++;
  });

  const ctxSuccess = document.getElementById('chart-success-rate').getContext('2d');
  charts.successRate = new Chart(ctxSuccess, {
    type: 'doughnut',
    data: {
      labels: ['Success', 'Failed'],
      datasets: [{
        data: [successCount, failedCount],
        backgroundColor: ['#10b981', '#f43f5e'],
        borderWidth: 1,
        borderColor: 'var(--bg-secondary)'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'right' }
      },
      cutout: '65%'
    }
  });
}

// ==========================================================================
// Filter and State Helper Operations
// ==========================================================================
function getFilteredFilaments() {
  if (state.activeOwner === 'all') {
    return state.filaments;
  }
  return state.filaments.filter(f => f.ownerId === state.activeOwner);
}

function getFilteredLogs() {
  if (state.activeOwner === 'all') {
    return state.logs;
  }
  return state.logs.filter(l => l.userId === state.activeOwner);
}

// Populate Edit form when clicking edit
function populateFilamentForm(filament) {
  document.getElementById('modal-filament-title').textContent = 'Edit Filament Spool';
  document.getElementById('form-filament-id').value = filament.id;
  document.getElementById('form-brand').value = filament.brand;
  document.getElementById('form-material').value = filament.material;
  document.getElementById('form-color-name').value = filament.colorName;
  document.getElementById('form-color-hex').value = filament.colorHex;
  document.getElementById('form-color-hex-text').value = filament.colorHex;
  document.getElementById('form-diameter').value = filament.diameter;
  document.getElementById('form-owner').value = filament.ownerId;
  document.getElementById('form-spool-weight').value = filament.spoolWeight;
  document.getElementById('form-empty-spool-weight').value = filament.emptySpoolWeight || '';
  document.getElementById('form-current-weight').value = filament.currentWeight;
  document.getElementById('form-status').value = filament.status;
  document.getElementById('form-cost').value = filament.cost || '';
  document.getElementById('form-purchase-date').value = filament.purchaseDate || '';
  document.getElementById('form-location').value = filament.location || '';
  document.getElementById('form-notes').value = filament.notes || '';
  document.getElementById('form-filament-submit-btn').textContent = 'Save Changes';
  
  // Hide delete button and quantity row during edit
  document.getElementById('form-filament-delete-btn').style.display = 'inline-block';
  document.getElementById('form-filament-qty-row').style.display = 'none';
}

function resetFilamentForm() {
  document.getElementById('modal-filament-title').textContent = 'Add New Filament Spool';
  document.getElementById('form-filament-id').value = '';
  document.getElementById('form-filament').reset();
  
  // Set defaults
  document.getElementById('form-color-hex').value = '#6366f1';
  document.getElementById('form-color-hex-text').value = '#6366f1';
  document.getElementById('form-diameter').value = '1.75';
  document.getElementById('form-spool-weight').value = '1000';
  document.getElementById('form-current-weight').value = '1000';
  document.getElementById('form-status').value = 'In Use';
  document.getElementById('form-filament-submit-btn').textContent = 'Save Filament';
  
  // Hide delete button and show quantity row for add new
  document.getElementById('form-filament-delete-btn').style.display = 'none';
  document.getElementById('form-filament-qty-row').style.display = 'block';
  document.getElementById('form-filament-qty').value = '1';
}

function resetPrintForm() {
  document.getElementById('form-print').reset();
  
  // Set defaults
  const printDateInput = document.getElementById('form-print-date');
  
  // Format local current date/time to YYYY-MM-DDThh:mm for datetime-local
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  printDateInput.value = now.toISOString().slice(0, 16);
  
  document.getElementById('form-print-hours').value = 0;
  document.getElementById('form-print-minutes').value = 0;
  document.getElementById('form-print-status').value = 'success';
}

// Generate unique short IDs
function generateId(prefix = 'id') {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

// ==========================================================================
// Event Listeners & Interactions
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initDB();
  populateMaterialFilter();
  updateUI();

  // 1. Sidebar Switch View Trigger
  const navItems = document.querySelectorAll('.nav-item');
  const tabViews = document.querySelectorAll('.tab-view');
  
  navItems.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      
      // Update sidebar highlight
      navItems.forEach(n => n.classList.remove('active'));
      btn.classList.add('active');
      
      // Update viewport view visibility
      tabViews.forEach(v => v.classList.remove('active'));
      const activeTab = document.getElementById(`view-${tabId}`);
      if (activeTab) activeTab.classList.add('active');
      
      // If going to Dashboard, refresh the charts rendering size
      if (tabId === 'dashboard') {
        renderCharts();
      }
    });
  });

  // 2. Active Owner filter selector (Sidebar)
  document.getElementById('sidebar-owner-filter').addEventListener('change', (e) => {
    state.activeOwner = e.target.value;
    saveState();
    updateUI();
  });

  if (document.getElementById('filter-owner')) {
    document.getElementById('filter-owner').addEventListener('change', (e) => {
      state.activeOwner = e.target.value;
      saveState();
      updateUI();
    });
  }

  // 3. Search and filter triggers
  document.getElementById('global-search').addEventListener('input', () => {
    renderFilamentsGrid();
  });
  document.getElementById('filter-material').addEventListener('change', () => {
    renderFilamentsGrid();
  });
  document.getElementById('filter-status').addEventListener('change', () => {
    renderFilamentsGrid();
  });
  if (document.getElementById('filter-owner')) {
    document.getElementById('filter-owner').addEventListener('change', () => {
      renderFilamentsGrid();
    });
  }
  document.getElementById('sort-by').addEventListener('change', () => {
    renderFilamentsGrid();
  });
  document.getElementById('btn-clear-filters').addEventListener('click', () => {
    document.getElementById('filter-material').value = 'all';
    document.getElementById('filter-status').value = 'all';
    if (document.getElementById('filter-owner')) {
      document.getElementById('filter-owner').value = 'all';
    }
    state.activeOwner = 'all';
    document.getElementById('sidebar-owner-filter').value = 'all';
    document.getElementById('sort-by').value = 'remaining-desc';
    document.getElementById('global-search').value = '';
    saveState();
    updateUI();
  });

  // 4. Modal Open/Close Event Triggers
  document.getElementById('btn-add-filament').addEventListener('click', () => {
    resetFilamentForm();
    // Default form owner dropdown to sidebar active selection if set
    if (state.activeOwner !== 'all') {
      document.getElementById('form-owner').value = state.activeOwner;
    }
    openModal('modal-filament');
  });

  document.getElementById('btn-log-print').addEventListener('click', () => {
    resetPrintForm();
    if (state.activeOwner !== 'all') {
      document.getElementById('form-print-user').value = state.activeOwner;
    }
    openModal('modal-print');
  });

  document.getElementById('btn-manage-users').addEventListener('click', () => {
    openModal('modal-users');
  });

  // Filament Delete Spool event handler
  document.getElementById('form-filament-delete-btn').addEventListener('click', () => {
    const id = document.getElementById('form-filament-id').value;
    if (id && confirm('Are you sure you want to delete this filament spool? The spool will be removed, but its historical print logs will be preserved.')) {
      state.filaments = state.filaments.filter(f => f.id !== id);
      saveState();
      closeModal('modal-filament');
      showNotification('Filament spool deleted.', 'error');
      populateMaterialFilter();
      updateUI();
    }
  });

  // Close modals on clicks of cancel/overlay/close button
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal(btn.getAttribute('data-close'));
    });
  });

  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      e.target.classList.remove('open');
    }
  });

  // 5. Dynamic hex text linkage in Filament Form
  const hexInput = document.getElementById('form-color-hex');
  const hexTextInput = document.getElementById('form-color-hex-text');
  
  hexInput.addEventListener('input', (e) => {
    hexTextInput.value = e.target.value;
  });
  hexTextInput.addEventListener('change', (e) => {
    let val = e.target.value.trim();
    if (!val.startsWith('#')) val = '#' + val;
    // Validate hex regex
    if (/^#[0-9A-F]{6}$/i.test(val)) {
      hexInput.value = val;
    } else {
      hexTextInput.value = hexInput.value;
    }
  });

  // Helper remaining stock check when selecting filament on log print
  const printFilSelect = document.getElementById('form-print-filament');
  const printWeightHelper = document.getElementById('form-print-weight-helper');
  const printWeightInput = document.getElementById('form-print-weight');
  
  printFilSelect.addEventListener('change', () => {
    const filId = printFilSelect.value;
    const fil = state.filaments.find(f => f.id === filId);
    if (fil) {
      printWeightHelper.textContent = `Available filament: ${fil.currentWeight}g`;
      printWeightInput.max = fil.currentWeight;
    } else {
      printWeightHelper.textContent = 'Available: 0g';
      printWeightInput.removeAttribute('max');
    }
  });

  // 6. Filament Form Submission (Add/Edit)
  document.getElementById('form-filament').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const id = document.getElementById('form-filament-id').value;
    const brand = document.getElementById('form-brand').value.trim();
    const material = document.getElementById('form-material').value.trim().toUpperCase();
    const colorName = document.getElementById('form-color-name').value.trim();
    const colorHex = document.getElementById('form-color-hex').value;
    const diameter = parseFloat(document.getElementById('form-diameter').value);
    const ownerId = document.getElementById('form-owner').value;
    const spoolWeight = parseInt(document.getElementById('form-spool-weight').value);
    const emptyWeightVal = document.getElementById('form-empty-spool-weight').value;
    const emptySpoolWeight = emptyWeightVal ? parseInt(emptyWeightVal) : 220; // Default tare
    const currentWeight = Math.min(spoolWeight, parseInt(document.getElementById('form-current-weight').value));
    const status = document.getElementById('form-status').value;
    
    const costVal = document.getElementById('form-cost').value;
    const cost = costVal ? parseFloat(costVal) : null;
    
    const purchaseDate = document.getElementById('form-purchase-date').value || null;
    const location = document.getElementById('form-location').value.trim() || null;
    const notes = document.getElementById('form-notes').value.trim() || null;

    if (id) {
      // Edit mode
      const index = state.filaments.findIndex(f => f.id === id);
      if (index !== -1) {
        state.filaments[index] = {
          id, brand, material, colorName, colorHex, diameter, ownerId,
          spoolWeight, emptySpoolWeight, currentWeight, status, cost,
          purchaseDate, location, notes
        };
        showNotification('Filament updated successfully.');
      }
    } else {
      // Add mode
      const qtyInput = document.getElementById('form-filament-qty');
      const qty = qtyInput ? Math.max(1, parseInt(qtyInput.value) || 1) : 1;
      
      for (let i = 0; i < qty; i++) {
        let spoolLocation = location;
        if (qty > 1) {
          if (location) {
            spoolLocation = `${location} (#${i + 1})`;
          } else {
            spoolLocation = `Copy #${i + 1}`;
          }
        }
        
        const newFil = {
          id: generateId('f'),
          brand, material, colorName, colorHex, diameter, ownerId,
          spoolWeight, emptySpoolWeight, currentWeight, status, cost,
          purchaseDate, location: spoolLocation, notes
        };
        state.filaments.push(newFil);
      }
      
      if (qty > 1) {
        showNotification(`Bulk added ${qty} identical filament spools.`);
      } else {
        showNotification('New filament spool added.');
      }
    }

    saveState();
    closeModal('modal-filament');
    populateMaterialFilter();
    updateUI();
  });

  // 7. Print Log Submission
  document.getElementById('form-print').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const filId = document.getElementById('form-print-filament').value;
    const printName = document.getElementById('form-print-name').value.trim();
    const weightUsed = parseFloat(document.getElementById('form-print-weight').value);
    const userId = document.getElementById('form-print-user').value;
    
    const hrs = parseInt(document.getElementById('form-print-hours').value) || 0;
    const mins = parseInt(document.getElementById('form-print-minutes').value) || 0;
    const durationMinutes = (hrs * 60) + mins;
    
    const status = document.getElementById('form-print-status').value;
    const dateInput = document.getElementById('form-print-date').value;
    const date = dateInput ? new Date(dateInput).toISOString() : new Date().toISOString();
    const notes = document.getElementById('form-print-notes').value.trim() || null;

    // Deduct stock weight from spool
    const fil = state.filaments.find(f => f.id === filId);
    if (!fil) return;
    
    if (weightUsed > fil.currentWeight) {
      alert(`Error: Spool only has ${fil.currentWeight}g remaining. You cannot print ${weightUsed}g.`);
      return;
    }

    fil.currentWeight = Math.max(0, fil.currentWeight - weightUsed);
    
    // Automatically set status to empty if depleted
    if (fil.currentWeight === 0) {
      fil.status = 'Empty';
    }

    // Add print log
    const newLog = {
      id: generateId('l'),
      filamentId: filId,
      printName,
      weightUsed,
      durationMinutes,
      userId,
      date,
      status,
      notes
    };
    state.logs.push(newLog);

    saveState();
    closeModal('modal-print');
    showNotification('Print logged successfully! Filament stock updated.');
    updateUI();
  });

  // 8. Add User Form Submission
  document.getElementById('form-add-user').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('form-user-name').value.trim();
    const color = document.getElementById('form-user-color').value;
    
    // Check duplicate
    if (state.users.some(u => u.name.toLowerCase() === name.toLowerCase())) {
      alert('A user with that name already exists!');
      return;
    }

    const newUser = {
      id: generateId('u'),
      name,
      color,
      avatar: "👤" // Custom standard avatar
    };

    state.users.push(newUser);
    saveState();
    
    // Clear user name input
    document.getElementById('form-user-name').value = '';
    showNotification(`User '${name}' created.`);
    
    updateUI();
  });

  // ==========================================================================
  // Calculators logic
  // ==========================================================================
  
  // 1. Length & Weight Converter
  const calcWeight = document.getElementById('calc-weight');
  const calcLength = document.getElementById('calc-length');
  const calcMaterial = document.getElementById('calc-material');
  const calcDiameter = document.getElementById('calc-diameter');

  // Densities (g/cm3)
  const densities = {
    PLA: 1.24,
    PETG: 1.27,
    ABS: 1.04,
    TPU: 1.20,
    ASA: 1.07,
    Nylon: 1.08
  };

  function getCalcSpecs() {
    const mat = calcMaterial.value;
    const density = densities[mat] || 1.24;
    const diam = parseFloat(calcDiameter.value) || 1.75;
    return { density, diam };
  }

  // Weight -> Length
  // formula: L_meters = 4 * weight / (pi * d_cm^2 * density) / 100
  // radius_cm = (diam / 2) / 10 = diam / 20
  // area_cm2 = pi * (diam/20)^2
  // L_meters = weight / (area_cm2 * density * 100) = weight / (pi * diam^2 * density / 4)
  calcWeight.addEventListener('input', () => {
    const weight = parseFloat(calcWeight.value);
    if (isNaN(weight) || weight <= 0) {
      calcLength.value = '';
      return;
    }
    const { density, diam } = getCalcSpecs();
    const radiusCm = diam / 20;
    const areaCm2 = Math.PI * Math.pow(radiusCm, 2);
    // Weight = Length_meters * 100 * Area_cm2 * density
    const lengthM = weight / (100 * areaCm2 * density);
    calcLength.value = lengthM.toFixed(2);
  });

  // Length -> Weight
  // formula: weight_g = L_meters * 100 * area_cm2 * density
  calcLength.addEventListener('input', () => {
    const length = parseFloat(calcLength.value);
    if (isNaN(length) || length <= 0) {
      calcWeight.value = '';
      return;
    }
    const { density, diam } = getCalcSpecs();
    const radiusCm = diam / 20;
    const areaCm2 = Math.PI * Math.pow(radiusCm, 2);
    const weightG = length * 100 * areaCm2 * density;
    calcWeight.value = weightG.toFixed(1);
  });

  // Refresh calculations on spec parameters changes
  calcMaterial.addEventListener('change', () => {
    calcWeight.dispatchEvent(new Event('input'));
  });
  calcDiameter.addEventListener('change', () => {
    calcWeight.dispatchEvent(new Event('input'));
  });

  // 2. Quick Spool Weigh Tare Tool
  const weighFilSelect = document.getElementById('weigh-filament-select');
  const weighGross = document.getElementById('weigh-gross-weight');
  const weighEmpty = document.getElementById('weigh-empty-weight');
  const weighResult = document.getElementById('weigh-calculated-value');
  const weighApplyBtn = document.getElementById('btn-apply-weigh');

  weighFilSelect.addEventListener('change', () => {
    const fil = state.filaments.find(f => f.id === weighFilSelect.value);
    if (fil) {
      weighEmpty.value = fil.emptySpoolWeight || 220;
      calculateWeigh();
    }
  });

  function calculateWeigh() {
    const gross = parseFloat(weighGross.value);
    const tare = parseFloat(weighEmpty.value);
    
    if (isNaN(gross) || isNaN(tare)) {
      weighResult.textContent = '0 g';
      weighApplyBtn.disabled = true;
      return;
    }
    
    const result = Math.max(0, gross - tare);
    weighResult.textContent = `${result.toFixed(0)} g`;
    weighApplyBtn.disabled = false;
  }

  weighGross.addEventListener('input', calculateWeigh);
  weighEmpty.addEventListener('input', calculateWeigh);

  weighApplyBtn.addEventListener('click', () => {
    const filId = weighFilSelect.value;
    const fil = state.filaments.find(f => f.id === filId);
    if (!fil) return;
    
    const gross = parseFloat(weighGross.value);
    const tare = parseFloat(weighEmpty.value);
    const result = Math.max(0, gross - tare);
    
    if (result > fil.spoolWeight) {
      alert(`Calculated filament weight (${result}g) is larger than the spool's max net capacity (${fil.spoolWeight}g). Please verify your scale measurements.`);
      return;
    }
    
    fil.currentWeight = result;
    fil.emptySpoolWeight = tare;
    
    // Adjust status based on weight
    if (result === 0) fil.status = 'Empty';
    else if (fil.status === 'Empty') fil.status = 'In Use';
    
    saveState();
    showNotification(`Stock weight of spool ${fil.brand} (${fil.colorName}) updated to ${result}g.`);
    
    // Clear inputs and reload
    weighGross.value = '';
    updateUI();
  });

  // ==========================================================================
  // Data Backup / File Management Triggers
  // ==========================================================================
  
  // Export Data JSON
  document.getElementById('btn-export-data').addEventListener('click', () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href",     dataStr     );
    dlAnchorElem.setAttribute("download", `spoolcontrol_backup_${new Date().toISOString().slice(0, 10)}.json`);
    dlAnchorElem.click();
    showNotification('JSON database backup downloaded.');
  });

  // Import Trigger click helper
  const importBtn = document.getElementById('btn-trigger-import');
  const importFileInput = document.getElementById('import-file-input');

  importBtn.addEventListener('click', () => {
    importFileInput.click();
  });

  importFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(evt) {
      try {
        const parsed = JSON.parse(evt.target.result);
        
        // Simple structure validator
        if (parsed.filaments && Array.isArray(parsed.filaments) &&
            parsed.logs && Array.isArray(parsed.logs) &&
            parsed.users && Array.isArray(parsed.users)) {
          
          state = parsed;
          saveState();
          showNotification('Database restored successfully from file!');
          populateMaterialFilter();
          updateUI();
        } else {
          alert('Invalid backup file format. Missing core tables (filaments/logs/users).');
        }
      } catch (err) {
        alert('Failed to parse backup JSON file: ' + err.message);
      }
    };
    reader.readAsText(file);
    // Reset file input value so same file can be imported again
    importFileInput.value = '';
  });

  // Reset database warning trigger
  document.getElementById('btn-reset-db').addEventListener('click', () => {
    if (confirm('⚠️ WARNING: This will permanently wipe your entire inventory and print history logs! Are you sure?')) {
      clearDatabase();
    }
  });

  // Load sample data trigger
  document.getElementById('btn-load-samples').addEventListener('click', () => {
    if (confirm('This will overwrite current inventory and logs with fresh sample data. Continue?')) {
      loadSampleData();
    }
  });

  // Save branding changes trigger
  document.getElementById('btn-save-branding').addEventListener('click', () => {
    const appNameInput = document.getElementById('settings-app-name');
    const appSubInput = document.getElementById('settings-app-subtitle');
    const appLogoInput = document.getElementById('settings-app-logo');
    
    state.settings = {
      appName: appNameInput.value.trim() || 'SpoolControl',
      appSubtitle: appSubInput.value.trim() || 'Filament Manager',
      appLogoEmoji: appLogoInput.value.trim() || '🎨'
    };
    
    saveState();
    showNotification('App branding updated successfully!');
    applyBranding();
  });

  // Auto-open native date & time pickers on click
  document.querySelectorAll('input[type="date"], input[type="datetime-local"]').forEach(input => {
    input.addEventListener('click', (e) => {
      try {
        e.target.showPicker();
      } catch (err) {
        console.log('showPicker not supported', err);
      }
    });
  });
});
