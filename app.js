/* ========================================
   CampusNotify — Shared Application Logic
   ======================================== */

// ─── Mock Data ───
const MOCK_USERS = {
  student: {
    id: 'STU-2024-0042',
    name: 'Alex Rivera',
    email: 'alex.rivera@campus.edu',
    role: 'student',
    department: 'Computer Science',
    year: '3rd Year',
    avatar: 'AR'
  },
  admin: {
    id: 'ADM-2024-0003',
    name: 'Dr. Sarah Chen',
    email: 'sarah.chen@campus.edu',
    role: 'admin',
    department: 'Administration',
    title: 'Dean of Students',
    avatar: 'SC'
  }
};

const ANNOUNCEMENTS = [
  {
    id: 1,
    title: 'Fall 2026 Semester Registration Now Open',
    body: 'Course registration for the Fall 2026 semester is now open. Please review the updated course catalog and meet with your academic advisor before selecting courses. Registration closes on October 15th.',
    priority: 'urgent',
    category: 'Academic',
    author: 'Office of the Registrar',
    date: '2026-09-28',
    pinned: true
  },
  {
    id: 2,
    title: 'Campus Wi-Fi Maintenance — Oct 2',
    body: 'The campus wireless network will undergo scheduled maintenance on October 2nd from 2:00 AM to 6:00 AM. Internet access may be intermittent during this period. Please plan accordingly.',
    priority: 'important',
    category: 'Facility',
    author: 'IT Services',
    date: '2026-09-27',
    pinned: false
  },
  {
    id: 3,
    title: 'Annual Science Fair — Call for Entries',
    body: 'The annual Campus Science Fair will be held on November 12th. Students from all departments are encouraged to submit their projects by October 20th. Prizes will be awarded in multiple categories.',
    priority: 'normal',
    category: 'Academic',
    author: 'Dept. of Sciences',
    date: '2026-09-26',
    pinned: false
  },
  {
    id: 4,
    title: 'New Library Hours for Midterm Season',
    body: 'Starting October 5th, the university library will extend its hours to 24/7 access through the midterm examination period. Student ID is required for after-hours entry.',
    priority: 'normal',
    category: 'Facility',
    author: 'University Library',
    date: '2026-09-25',
    pinned: false
  },
  {
    id: 5,
    title: 'Mental Health Awareness Week — Oct 6–10',
    body: 'Join us for Mental Health Awareness Week with free workshops, counseling sessions, and wellness activities. Schedule and sign-up available on the Student Services portal.',
    priority: 'important',
    category: 'Student Life',
    author: 'Student Wellness Center',
    date: '2026-09-24',
    pinned: true
  },
  {
    id: 6,
    title: 'Parking Lot B Closure for Renovation',
    body: 'Parking Lot B will be closed from October 1st through October 31st for repaving and expansion. Alternative parking is available at Lot D with a complimentary shuttle service to campus buildings.',
    priority: 'normal',
    category: 'Facility',
    author: 'Campus Facilities',
    date: '2026-09-23',
    pinned: false
  }
];

const EVENTS = [
  {
    id: 1,
    title: 'Homecoming Football Game',
    description: 'Cheer on the Eagles at the annual Homecoming game vs. State University. Pre-game tailgate party starts at 3 PM.',
    date: '2026-10-10',
    time: '5:00 PM',
    location: 'Eagle Stadium',
    category: 'Sports',
    attendees: 1240
  },
  {
    id: 2,
    title: 'Guest Lecture: AI in Education',
    description: 'Dr. James Park from MIT discusses the transformative role of artificial intelligence in modern education.',
    date: '2026-10-05',
    time: '2:00 PM',
    location: 'Auditorium A, Building 3',
    category: 'Academic',
    attendees: 320
  },
  {
    id: 3,
    title: 'Fall Career Fair 2026',
    description: 'Over 80 companies will be recruiting for internships and full-time positions. Bring your resume and dress professionally.',
    date: '2026-10-15',
    time: '10:00 AM – 4:00 PM',
    location: 'Student Center Grand Hall',
    category: 'Career',
    attendees: 890
  },
  {
    id: 4,
    title: 'Cultural Night: Around the World',
    description: 'Celebrate diversity with performances, food, and exhibitions from student cultural organizations.',
    date: '2026-10-20',
    time: '6:00 PM',
    location: 'Campus Green',
    category: 'Student Life',
    attendees: 560
  },
  {
    id: 5,
    title: 'Midterm Study Marathon',
    description: 'Join fellow students for an all-night study session with free coffee, snacks, and tutoring support.',
    date: '2026-10-22',
    time: '8:00 PM – 6:00 AM',
    location: 'University Library',
    category: 'Academic',
    attendees: 210
  }
];

const NOTIFICATIONS = [
  { id: 1, type: 'info', icon: '📢', title: 'New Announcement Posted', message: 'Fall 2026 Semester Registration is now open.', time: '2 minutes ago', read: false },
  { id: 2, type: 'success', icon: '✅', title: 'Assignment Submitted', message: 'Your CS301 assignment has been submitted successfully.', time: '1 hour ago', read: false },
  { id: 3, type: 'warning', icon: '⚠️', title: 'Payment Reminder', message: 'Tuition payment for Fall semester is due October 1st.', time: '3 hours ago', read: false },
  { id: 4, type: 'alert', icon: '🔴', title: 'Emergency Drill', message: 'Campus-wide emergency drill scheduled for Oct 3rd at 10 AM.', time: '5 hours ago', read: true },
  { id: 5, type: 'info', icon: '📅', title: 'Event Reminder', message: 'Guest Lecture: AI in Education starts tomorrow at 2 PM.', time: '1 day ago', read: true },
  { id: 6, type: 'success', icon: '🎉', title: 'Scholarship Awarded', message: 'Congratulations! You\'ve been awarded the Dean\'s Merit Scholarship.', time: '2 days ago', read: true },
];

// ─── Auth / Session Utilities ───
const Auth = {
  _usersKey: 'campusnotify_registered_users',
  _logsKey: 'campusnotify_login_logs',

  _getInitialUsers() {
    return [
      {
        id: 'STU-2024-0042',
        name: 'Alex Rivera',
        email: 'alex.rivera@campus.edu',
        password: 'password123',
        role: 'student',
        department: 'Computer Science',
        year: '3rd Year',
        avatar: 'AR',
        phone: '+1 (555) 234-5678',
        bio: 'Computer Science student interested in AI and modern web architectures.',
        lastLogin: new Date(Date.now() - 3600000 * 2).toISOString(),
        createdAt: '2026-08-15'
      },
      {
        id: 'ADM-2024-0003',
        name: 'Dr. Sarah Chen',
        email: 'sarah.chen@campus.edu',
        password: 'password123',
        role: 'admin',
        department: 'Administration',
        title: 'Dean of Students',
        avatar: 'SC',
        phone: '+1 (555) 987-6543',
        bio: 'Dean of Students dedicated to holistic student wellness and campus excellence.',
        lastLogin: new Date(Date.now() - 1800000).toISOString(),
        createdAt: '2026-08-01'
      }
    ];
  },

  getRegisteredUsers() {
    const stored = localStorage.getItem(this._usersKey);
    if (stored) {
      try {
        const users = JSON.parse(stored);
        if (Array.isArray(users) && users.length > 0) return users;
      } catch (e) {}
    }
    const initial = this._getInitialUsers();
    this.saveRegisteredUsers(initial);
    return initial;
  },

  saveRegisteredUsers(users) {
    localStorage.setItem(this._usersKey, JSON.stringify(users));
  },

  getLoginLogs() {
    const stored = localStorage.getItem(this._logsKey);
    if (stored) {
      try { return JSON.parse(stored); } catch (e) {}
    }
    const initialLogs = [
      {
        id: 1,
        userId: 'ADM-2024-0003',
        userName: 'Dr. Sarah Chen',
        userEmail: 'sarah.chen@campus.edu',
        userRole: 'admin',
        userAvatar: 'SC',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        device: 'Windows 11 / Chrome'
      },
      {
        id: 2,
        userId: 'STU-2024-0042',
        userName: 'Alex Rivera',
        userEmail: 'alex.rivera@campus.edu',
        userRole: 'student',
        userAvatar: 'AR',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        device: 'macOS / Safari'
      }
    ];
    this.saveLoginLogs(initialLogs);
    return initialLogs;
  },

  saveLoginLogs(logs) {
    localStorage.setItem(this._logsKey, JSON.stringify(logs));
  },

  addLoginLog(user) {
    const logs = this.getLoginLogs();
    const newLog = {
      id: Date.now(),
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userRole: user.role,
      userAvatar: user.avatar,
      timestamp: new Date().toISOString(),
      device: navigator.userAgent.includes('Windows') ? 'Windows / Chrome' : 'Web Browser'
    };
    logs.unshift(newLog);
    // Keep last 100 logs
    if (logs.length > 100) logs.pop();
    this.saveLoginLogs(logs);
    return newLog;
  },

  getInitials(name) {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/).filter(Boolean);
    const titles = ['dr.', 'dr', 'prof.', 'prof', 'mr.', 'mr', 'ms.', 'ms', 'mrs.', 'mrs', 'dean'];
    const filtered = parts.filter(p => !titles.includes(p.toLowerCase()));
    const target = filtered.length > 0 ? filtered : parts;
    if (target.length === 1) return target[0].slice(0, 2).toUpperCase();
    return (target[0][0] + target[target.length - 1][0]).toUpperCase();
  },

  registerUser({ name, email, password, role = 'student', department = 'Computer Science', year = '1st Year', title = '' }) {
    const initials = this.getInitials(name);
    const randomId = Math.floor(1000 + Math.random() * 9000);
    const prefix = role === 'admin' ? 'ADM' : 'STU';
    const id = `${prefix}-2024-${randomId}`;

    const defaultTitle = role === 'admin' ? (title || (name.toLowerCase().startsWith('dr.') ? 'Dean of Students' : 'Administrator')) : '';
    const defaultBio = role === 'admin' 
      ? 'Academic administrator dedicated to student success and campus operations.' 
      : `${year} student in the Department of ${department}.`;

    const newUser = {
      id,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      department: department || (role === 'admin' ? 'Administration' : 'Computer Science'),
      year: role === 'student' ? (year || '1st Year') : '',
      title: defaultTitle,
      avatar: initials,
      password: password || '',
      phone: '+1 (555) 000-0000',
      bio: defaultBio,
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString().split('T')[0]
    };

    const users = this.getRegisteredUsers();
    const existingIdx = users.findIndex(u => u.email.toLowerCase() === newUser.email);
    if (existingIdx !== -1) {
      users[existingIdx] = { ...users[existingIdx], ...newUser };
    } else {
      users.unshift(newUser);
    }
    this.saveRegisteredUsers(users);
    return newUser;
  },

  // Strict authentication: must exist in registered users and credentials must match
  authenticate(email, password, role) {
    if (!email || !password) {
      return { success: false, message: 'Please enter both email and password.' };
    }

    const cleanEmail = email.trim().toLowerCase();
    const users = this.getRegisteredUsers();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return { 
        success: false, 
        message: 'Invalid email or password. Please create an account first!' 
      };
    }

    if (user.password && user.password !== password) {
      return { 
        success: false, 
        message: 'Incorrect password. Please verify your credentials and try again.' 
      };
    }

    if (role && user.role !== role) {
      const correctRoleLabel = user.role === 'admin' ? 'Admin / Staff' : 'Student';
      return {
        success: false,
        message: `This account is registered as a ${correctRoleLabel}. Please switch roles above.`
      };
    }

    // Success: update last login & log activity
    user.lastLogin = new Date().toISOString();
    this.updateUserInStore(user);
    this.addLoginLog(user);

    localStorage.setItem('campusnotify_user', JSON.stringify(user));
    localStorage.setItem('campusnotify_role', user.role);

    return { success: true, user };
  },

  loginWithUser(user) {
    user.lastLogin = new Date().toISOString();
    this.updateUserInStore(user);
    this.addLoginLog(user);

    localStorage.setItem('campusnotify_user', JSON.stringify(user));
    localStorage.setItem('campusnotify_role', user.role);
    window.location.href = 'dashboard.html';
  },

  deleteUser(userId) {
    const users = this.getRegisteredUsers();
    const target = users.find(u => u.id === userId);
    if (!target) return false;

    const remaining = users.filter(u => u.id !== userId);
    this.saveRegisteredUsers(remaining);

    // If the currently active session is the deleted user, log out immediately
    const current = this.getUser();
    if (current && current.id === userId) {
      this.logout();
    }
    return true;
  },

  updateUserInStore(user) {
    const users = this.getRegisteredUsers();
    const idx = users.findIndex(u => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase());
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...user };
      this.saveRegisteredUsers(users);
    }
  },

  updateUser(updatedFields) {
    const current = this.getUser();
    if (!current) return null;
    const merged = { ...current, ...updatedFields };
    localStorage.setItem('campusnotify_user', JSON.stringify(merged));
    this.updateUserInStore(merged);
    return merged;
  },

  logout() {
    localStorage.removeItem('campusnotify_user');
    localStorage.removeItem('campusnotify_role');
    window.location.href = 'login.html';
  },

  getUser() {
    const data = localStorage.getItem('campusnotify_user');
    return data ? JSON.parse(data) : null;
  },

  getRole() {
    return localStorage.getItem('campusnotify_role') || 'student';
  },

  isLoggedIn() {
    return !!localStorage.getItem('campusnotify_user');
  },

  requireAuth() {
    if (!this.isLoggedIn()) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  }
};

// ─── Announcements Store ───
const AnnouncementsStore = {
  _key: 'campusnotify_announcements',

  getAll() {
    const stored = localStorage.getItem(this._key);
    if (stored) return JSON.parse(stored);
    localStorage.setItem(this._key, JSON.stringify(ANNOUNCEMENTS));
    return [...ANNOUNCEMENTS];
  },

  save(announcements) {
    localStorage.setItem(this._key, JSON.stringify(announcements));
  },

  add(announcement) {
    const all = this.getAll();
    announcement.id = Date.now();
    announcement.date = new Date().toISOString().split('T')[0];
    announcement.author = Auth.getUser()?.name || 'Admin';
    all.unshift(announcement);
    this.save(all);
    return announcement;
  },

  update(id, data) {
    const all = this.getAll();
    const idx = all.findIndex(a => a.id === id);
    if (idx !== -1) {
      all[idx] = { ...all[idx], ...data };
      this.save(all);
      return all[idx];
    }
    return null;
  },

  delete(id) {
    const all = this.getAll().filter(a => a.id !== id);
    this.save(all);
  },

  getById(id) {
    return this.getAll().find(a => a.id === id);
  }
};

// ─── Events Store (With Admin CRUD) ───
const EventsStore = {
  _key: 'campusnotify_events',

  getAll() {
    const stored = localStorage.getItem(this._key);
    if (stored) {
      try { return JSON.parse(stored); } catch (e) {}
    }
    localStorage.setItem(this._key, JSON.stringify(EVENTS));
    return [...EVENTS];
  },

  save(events) {
    localStorage.setItem(this._key, JSON.stringify(events));
  },

  add(event) {
    const all = this.getAll();
    event.id = Date.now();
    event.attendees = event.attendees || 0;
    all.unshift(event);
    this.save(all);
    return event;
  },

  update(id, data) {
    const all = this.getAll();
    const idx = all.findIndex(e => e.id === id);
    if (idx !== -1) {
      all[idx] = { ...all[idx], ...data };
      this.save(all);
      return all[idx];
    }
    return null;
  },

  delete(id) {
    const all = this.getAll().filter(e => e.id !== id);
    this.save(all);
  },

  getById(id) {
    return this.getAll().find(e => e.id === id);
  }
};

// ─── UI Utilities ───
const UI = {
  // Toast notification
  toast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${icons[type]}</span>
      <span class="toast-message">${message}</span>
      <button class="toast-close" onclick="this.parentElement.remove()">✕</button>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'fadeIn 300ms ease reverse';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  },

  // Modal helpers
  openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('active');
  },

  closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('active');
  },

  // Format date
  formatDate(dateStr) {
    if (!dateStr) return '—';
    const date = new Date(dateStr.includes('T') ? dateStr : dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  },

  // Format date + time
  formatDateTime(dateStr) {
    if (!dateStr) return 'Never';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' at ' +
           date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  },

  // Get priority badge
  priorityBadge(priority) {
    const map = {
      urgent: '<span class="badge badge-danger">🔴 Urgent</span>',
      important: '<span class="badge badge-warning">🟡 Important</span>',
      normal: '<span class="badge badge-info">🔵 General</span>'
    };
    return map[priority] || map.normal;
  },

  // Get category badge
  categoryBadge(category) {
    return `<span class="tag">${category}</span>`;
  }
};

// ─── Sidebar Component ───
function renderSidebar(activePage) {
  const user = Auth.getUser();
  const role = Auth.getRole();
  if (!user) return '';

  const unreadCount = NOTIFICATIONS.filter(n => !n.read).length;

  return `
    <button class="sidebar-toggle" id="sidebarToggle" aria-label="Toggle menu">☰</button>
    <div class="sidebar-overlay" id="sidebarOverlay"></div>
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-brand">
        <div class="brand-icon">🔔</div>
        <div>
          <h2>CampusNotify</h2>
          <span>School Portal</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <div class="nav-section">
          <div class="nav-section-title">Main</div>
          <a href="dashboard.html" class="nav-item ${activePage === 'dashboard' ? 'active' : ''}" id="nav-dashboard">
            <span class="nav-icon">📊</span>
            Dashboard
          </a>
          <a href="announcements.html" class="nav-item ${activePage === 'announcements' ? 'active' : ''}" id="nav-announcements">
            <span class="nav-icon">📢</span>
            Announcements
          </a>
          <a href="events-notifications.html" class="nav-item ${activePage === 'events' ? 'active' : ''}" id="nav-events">
            <span class="nav-icon">📅</span>
            Events & Alerts
            ${unreadCount > 0 ? `<span class="nav-badge">${unreadCount}</span>` : ''}
          </a>
        </div>

        ${role === 'admin' ? `
        <div class="nav-section">
          <div class="nav-section-title">Administration</div>
          <a href="user-management.html" class="nav-item ${activePage === 'users' ? 'active' : ''}" id="nav-users">
            <span class="nav-icon">👥</span>
            Users & Sign-ins
          </a>
        </div>
        ` : ''}

        <div class="nav-section">
          <div class="nav-section-title">Account</div>
          <a href="profile-settings.html" class="nav-item ${activePage === 'profile' ? 'active' : ''}" id="nav-profile">
            <span class="nav-icon">👤</span>
            Profile & Settings
          </a>
        </div>
      </nav>

      <div class="sidebar-footer">
        <div class="sidebar-user" onclick="Auth.logout()" title="Click to logout">
          <div class="user-avatar">${user.avatar}</div>
          <div class="user-info">
            <div class="user-name">${user.name}</div>
            <div class="user-role">${role === 'admin' ? '🛡️ Admin/Staff' : '🎓 Student'}</div>
          </div>
          <span style="color: var(--text-muted); font-size: 0.9rem;">⏻</span>
        </div>
      </div>
    </aside>
  `;
}

// ─── Initialize Sidebar ───
function initSidebar() {
  const toggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');

  if (toggle && sidebar && overlay) {
    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('active');
    });
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
    });
  }
}

// ─── Apply Role ───
function applyRole() {
  const role = Auth.getRole();
  if (role === 'admin') {
    document.body.classList.add('role-admin');
  } else {
    document.body.classList.remove('role-admin');
  }
}

// ─── Page Init ───
function initPage(activePage) {
  if (!Auth.requireAuth()) return false;
  applyRole();

  // Inject sidebar
  const sidebarTarget = document.getElementById('app-sidebar');
  if (sidebarTarget) {
    sidebarTarget.innerHTML = renderSidebar(activePage);
    initSidebar();
  }
  return true;
}
