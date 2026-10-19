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
  law1: {
    id: 'STU-2024-1501',
    name: 'Marcus Vance',
    email: 'marcus.vance@campus.edu',
    role: 'student',
    department: 'Law',
    year: '1st Year',
    avatar: 'MV'
  },
  law2: {
    id: 'STU-2024-1502',
    name: 'Elena Rostova',
    email: 'elena.rostova@campus.edu',
    role: 'student',
    department: 'Law',
    year: '2nd Year',
    avatar: 'ER'
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

const DEMO_TITLES = new Set([
  'Fall 2026 Semester Registration Now Open',
  'Campus Wi-Fi Maintenance — Oct 2',
  'Annual Science Fair — Call for Entries',
  'New Library Hours for Midterm Season',
  'Mental Health Awareness Week — Oct 6–10',
  'Parking Lot B Closure for Renovation',
  'CS Department: Capstone Project Proposals Due',
  'Engineering Lab Safety Recertification',
  'Business Pitch Competition — $5,000 Prize',
  'CS Hackathon: Build for Good — Oct 18-19',
  '3rd Year Internship Prep Workshop',
  'Law School Moot Court Registration',
  '1st Year Law Case Briefing Workshop',
  'Homecoming Football Game',
  'Guest Lecture: AI in Education',
  'Fall Career Fair 2026',
  'Cultural Night: Around the World',
  'Midterm Study Marathon',
  'CS Senior Project Showcase',
  'Engineering Design Sprint',
  'First Year Orientation Social',
  'Tech Industry Panel: Careers in CS',
  'Law Review Annual Symposium',
  '1st Year Law Legal Research Bootcamp',
  'New Announcement Posted',
  'Assignment Submitted',
  'Payment Reminder',
  'Emergency Drill',
  'Event Reminder',
  'Scholarship Awarded',
  '1st Year Law Briefing Session',
  'Law Moot Court Notice',
  'What activity would you like for Foundation Week?'
]);

function isDemoCard(item) {
  if (!item) return false;
  const numId = Number(item.id);
  // All demo seeds had IDs 1..13. Admin created items have Date.now() timestamp IDs (> 1,000,000)
  if (!isNaN(numId) && numId > 0 && numId <= 100) return true;
  if (item.title && DEMO_TITLES.has(item.title)) return true;
  if (item.question && DEMO_TITLES.has(item.question)) return true;
  return false;
}

if (typeof window !== 'undefined') {
  window.isDemoCard = isDemoCard;
  window.DEMO_TITLES = DEMO_TITLES;
}

// Automatic cleanup of legacy demo cards from localStorage on script load
try {
  if (typeof localStorage !== 'undefined') {
    ['campusnotify_announcements', 'campusnotify_events', 'campusnotify_notifications', 'campusnotify_polls'].forEach(key => {
      const raw = localStorage.getItem(key);
      if (raw) {
        const items = JSON.parse(raw);
        if (Array.isArray(items)) {
          const cleaned = items.filter(it => !isDemoCard(it));
          if (cleaned.length !== items.length) {
            localStorage.setItem(key, JSON.stringify(cleaned));
          }
        }
      }
    });
  }
} catch (e) {}

const ANNOUNCEMENTS = [];
const EVENTS = [];
const DEFAULT_NOTIFICATIONS = [];

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
        id: 'STU-2024-1201',
        name: 'Jordan Miles',
        email: 'jordan.miles@campus.edu',
        password: 'password123',
        role: 'student',
        department: 'Engineering',
        year: '2nd Year',
        avatar: 'JM',
        phone: '+1 (555) 234-1201',
        bio: 'Engineering student focused on robotics and campus events.',
        lastLogin: new Date(Date.now() - 3600000 * 5).toISOString(),
        createdAt: '2026-08-20'
      },
      {
        id: 'STU-2024-1288',
        name: 'Priya Shah',
        email: 'priya.shah@campus.edu',
        password: 'password123',
        role: 'student',
        department: 'Business',
        year: '1st Year',
        avatar: 'PS',
        phone: '+1 (555) 234-1288',
        bio: 'Business student exploring internships and campus life.',
        lastLogin: new Date(Date.now() - 3600000 * 8).toISOString(),
        createdAt: '2026-08-22'
      },
      {
        id: 'STU-2024-1501',
        name: 'Marcus Vance',
        email: 'marcus.vance@campus.edu',
        password: 'password123',
        role: 'student',
        department: 'Law',
        year: '1st Year',
        avatar: 'MV',
        phone: '+1 (555) 345-1501',
        bio: '1st Year Law student passionate about constitutional jurisprudence.',
        lastLogin: new Date(Date.now() - 3600000 * 3).toISOString(),
        createdAt: '2026-08-25'
      },
      {
        id: 'STU-2024-1502',
        name: 'Elena Rostova',
        email: 'elena.rostova@campus.edu',
        password: 'password123',
        role: 'student',
        department: 'Law',
        year: '2nd Year',
        avatar: 'ER',
        phone: '+1 (555) 345-1502',
        bio: '2nd Year Law student focused on civil rights advocacy and moot court.',
        lastLogin: new Date(Date.now() - 3600000 * 6).toISOString(),
        createdAt: '2026-08-26'
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

  _deletedUsersKey: 'campusnotify_users_deleted',

  _getDeletedUserIds() {
    try {
      const stored = localStorage.getItem(this._deletedUsersKey);
      return stored ? JSON.parse(stored) : [];
    } catch (e) { return []; }
  },

  _addDeletedUserId(userId) {
    const deleted = this._getDeletedUserIds();
    const strId = String(userId);
    if (!deleted.includes(strId)) {
      deleted.push(strId);
      try {
        localStorage.setItem(this._deletedUsersKey, JSON.stringify(deleted));
      } catch (e) {}
    }
  },

  getRegisteredUsers() {
    const deletedIds = this._getDeletedUserIds();
    const initial = this._getInitialUsers().filter(u => !deletedIds.includes(String(u.id)));
    const stored = localStorage.getItem(this._usersKey);
    if (stored !== null) {
      try {
        let users = JSON.parse(stored);
        if (Array.isArray(users)) {
          users = users.filter(u => !deletedIds.includes(String(u.id)));
          let changed = false;
          initial.forEach(seed => {
            const exists = users.some(u => String(u.id) === String(seed.id) || (u.email && u.email.toLowerCase() === seed.email.toLowerCase()));
            if (!exists) {
              users.push(seed);
              changed = true;
            }
          });
          if (changed) this.saveRegisteredUsers(users);
          return users;
        }
      } catch (e) {}
    }
    this.saveRegisteredUsers(initial);
    return initial;
  },

  saveRegisteredUsers(users) {
    localStorage.setItem(this._usersKey, JSON.stringify(users));
  },

  _getInitialLogs() {
    return [
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
      },
      {
        id: 3,
        userId: 'STU-2024-1201',
        userName: 'Jordan Miles',
        userEmail: 'jordan.miles@campus.edu',
        userRole: 'student',
        userAvatar: 'JM',
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
        device: 'Windows / Chrome'
      },
      {
        id: 4,
        userId: 'STU-2024-1288',
        userName: 'Priya Shah',
        userEmail: 'priya.shah@campus.edu',
        userRole: 'student',
        userAvatar: 'PS',
        timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
        device: 'Android / Chrome'
      }
    ];
  },

  getLoginLogs() {
    const initialLogs = this._getInitialLogs();
    const stored = localStorage.getItem(this._logsKey);
    if (stored) {
      try {
        const logs = JSON.parse(stored);
        if (Array.isArray(logs)) {
          let changed = false;
          initialLogs.forEach(seed => {
            if (!logs.some(l => l.userId === seed.userId)) {
              logs.push(seed);
              changed = true;
            }
          });
          if (changed) this.saveLoginLogs(logs);
          return logs;
        }
      } catch (e) {}
    }
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
  authenticate(email, password, role, remember = true) {
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

    const storage = remember ? localStorage : sessionStorage;
    storage.setItem('campusnotify_user', JSON.stringify(user));
    storage.setItem('campusnotify_role', user.role);
    if (remember) {
      sessionStorage.removeItem('campusnotify_user');
      sessionStorage.removeItem('campusnotify_role');
    } else {
      localStorage.removeItem('campusnotify_user');
      localStorage.removeItem('campusnotify_role');
    }

    return { success: true, user };
  },

  loginWithUser(user, remember = true) {
    user.lastLogin = new Date().toISOString();
    this.updateUserInStore(user);
    this.addLoginLog(user);

    const storage = remember ? localStorage : sessionStorage;
    storage.setItem('campusnotify_user', JSON.stringify(user));
    storage.setItem('campusnotify_role', user.role);
    // Set flag for daily login reward auto-prompt (students only)
    if (user.role === 'student') {
      localStorage.setItem('campusnotify_just_logged_in', 'true');
    }
    window.location.href = 'dashboard.html';
  },

  deleteUser(userId) {
    const users = this.getRegisteredUsers();
    const target = users.find(u => String(u.id) === String(userId));
    if (!target) return false;

    this._addDeletedUserId(userId);
    const remaining = users.filter(u => String(u.id) !== String(userId));
    this.saveRegisteredUsers(remaining);

    // If the currently active session is the deleted user, log out immediately
    const current = this.getUser();
    if (current && String(current.id) === String(userId)) {
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
    if (localStorage.getItem('campusnotify_user')) {
      localStorage.setItem('campusnotify_user', JSON.stringify(merged));
    }
    if (sessionStorage.getItem('campusnotify_user')) {
      sessionStorage.setItem('campusnotify_user', JSON.stringify(merged));
    }
    this.updateUserInStore(merged);
    return merged;
  },

  logout() {
    localStorage.removeItem('campusnotify_user');
    localStorage.removeItem('campusnotify_role');
    sessionStorage.removeItem('campusnotify_user');
    sessionStorage.removeItem('campusnotify_role');
    window.location.href = 'login.html';
  },

  getUser() {
    const data = sessionStorage.getItem('campusnotify_user') || localStorage.getItem('campusnotify_user');
    return data ? JSON.parse(data) : null;
  },

  getRole() {
    return sessionStorage.getItem('campusnotify_role') || localStorage.getItem('campusnotify_role') || 'student';
  },

  isLoggedIn() {
    return !!(sessionStorage.getItem('campusnotify_user') || localStorage.getItem('campusnotify_user'));
  },

  requireAuth() {
    if (!this.isLoggedIn()) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  }
};

// ─── Audience & Targeting Helpers ───
function normalizeDepartment(dept) {
  if (!dept) return 'all';
  const s = String(dept).trim().toLowerCase();
  if (s === 'all' || s === '' || s === 'all departments') return 'all';
  if (s === 'art and science' || s === 'arts & sciences' || s === 'arts and sciences' || s === 'art & science') {
    return 'arts & sciences';
  }
  return s;
}

function normalizeYear(year) {
  if (!year) return 'all';
  const s = String(year).trim().toLowerCase();
  if (s === 'all' || s === '' || s === 'all year level' || s === 'all years') return 'all';
  if (s === 'graduate' || s === 'graduated') return 'graduate';
  return s;
}

function isAudienceMatch(targetRule, user) {
  if (!user) return false;
  if (user.role === 'admin') return true;

  // Direct student IDs match
  const ids = Array.isArray(targetRule.studentIds) ? targetRule.studentIds : [];
  if (ids.length > 0) {
    return ids.includes(user.id);
  }

  const target = (targetRule.target || (
    ((targetRule.targetDepartment && targetRule.targetDepartment !== 'all') || (targetRule.department && targetRule.department !== 'all'))
      ? 'students'
      : 'all'
  )).toLowerCase();

  if (target === 'all') return true;
  if (target === 'faculty') return user.role === 'admin';
  if (target === 'students') {
    if (user.role !== 'student') return false;
    const userDept = normalizeDepartment(user.department);
    const userYear = normalizeYear(user.year);
    const ruleDept = normalizeDepartment(targetRule.targetDepartment || targetRule.department);
    const ruleYear = normalizeYear(targetRule.targetYear || targetRule.year);

    const deptMatch = (ruleDept === 'all' || ruleDept === userDept);
    const yearMatch = (ruleYear === 'all' || ruleYear === userYear);
    return deptMatch && yearMatch;
  }
  return true;
}

function isCampusHubItem(item, user) {
  if (user && user.role === 'admin') return true;

  const target = (item.target || (
    ((item.targetDepartment && item.targetDepartment !== 'all') || (item.department && item.department !== 'all'))
      ? 'students'
      : 'all'
  )).toLowerCase();

  // "All campus" is sent to the campus hub
  if (target === 'all') {
    const dept = normalizeDepartment(item.targetDepartment || item.department);
    const yr = normalizeYear(item.targetYear || item.year);
    return dept === 'all' && yr === 'all';
  }

  // Items targeted specifically to students only with department/year belong in For You page, NOT campus hub
  return false;
}

function isHubVisible(item, user) {
  // Direct-ID notifications belong in For You, not Hub
  if (Array.isArray(item.studentIds) && item.studentIds.length > 0) return false;
  return isCampusHubItem(item, user);
}

// ─── Announcements Store ───
const AnnouncementsStore = {
  _key: 'campusnotify_announcements',
  _deletedKey: 'campusnotify_announcements_deleted',

  _getDeletedIds() {
    try {
      const stored = localStorage.getItem(this._deletedKey);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  },

  _addDeletedId(id) {
    const deleted = this._getDeletedIds();
    const strId = String(id);
    if (!deleted.includes(strId)) {
      deleted.push(strId);
      try {
        localStorage.setItem(this._deletedKey, JSON.stringify(deleted));
      } catch (e) {}
    }
  },

  getAll() {
    const deletedIds = this._getDeletedIds();
    const stored = localStorage.getItem(this._key);
    if (stored !== null) {
      try {
        let parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter(item => !deletedIds.includes(String(item.id)) && !isDemoCard(item));
          if (filtered.length !== parsed.length) {
            this.save(filtered);
          }
          return filtered;
        }
      } catch (e) {}
    }
    return [];
  },

  save(announcements) {
    localStorage.setItem(this._key, JSON.stringify(announcements));
  },

  add(announcement) {
    const all = this.getAll();
    announcement.id = Date.now();
    announcement.date = new Date().toISOString().split('T')[0];
    announcement.author = Auth.getUser()?.name || 'Admin';

    const target = announcement.target || 'all';
    announcement.target = target;
    announcement.department = target === 'students' ? (announcement.department || 'all') : 'all';
    announcement.year = target === 'students' ? (announcement.year || 'all') : 'all';
    announcement.targetDepartment = announcement.department;
    announcement.targetYear = announcement.year;

    all.unshift(announcement);
    this.save(all);

    // Automatically trigger notification with exact same audience targeting
    try {
      if (typeof NotificationsStore !== 'undefined') {
        NotificationsStore.add({
          type: announcement.priority === 'urgent' ? 'alert' : announcement.priority === 'important' ? 'warning' : 'info',
          icon: '📢',
          title: `New Announcement: ${announcement.title}`,
          message: announcement.body ? (announcement.body.length > 120 ? announcement.body.substring(0, 117) + '...' : announcement.body) : 'A new campus announcement was posted.',
          time: 'Just now',
          target: announcement.target,
          department: announcement.department,
          year: announcement.year,
          targetDepartment: announcement.department,
          targetYear: announcement.year,
          actionType: 'announcement',
          actionId: announcement.id
        });
      }
    } catch (e) {}

    return announcement;
  },

  update(id, data) {
    const all = this.getAll();
    const idx = all.findIndex(a => String(a.id) === String(id));
    if (idx !== -1) {
      const target = data.target || all[idx].target || 'all';
      const dept = target === 'students' ? (data.department || all[idx].department || 'all') : 'all';
      const yr = target === 'students' ? (data.year || all[idx].year || 'all') : 'all';
      all[idx] = {
        ...all[idx],
        ...data,
        target,
        department: dept,
        year: yr,
        targetDepartment: dept,
        targetYear: yr
      };
      this.save(all);
      return all[idx];
    }
    return null;
  },

  delete(id) {
    if (id === null || id === undefined) return this.getAll();
    this._addDeletedId(id);
    const all = this.getAll().filter(a => String(a.id) !== String(id));
    this.save(all);

    // Clean up auxiliary stores
    try {
      if (typeof SavedStore !== 'undefined' && SavedStore.remove) {
        SavedStore.remove('announcement', id);
        SavedStore.remove('announcement', Number(id));
      }
      if (typeof ReminderStore !== 'undefined' && ReminderStore.remove) {
        ReminderStore.remove('announcement', id);
        ReminderStore.remove('announcement', Number(id));
      }
      if (typeof NotificationsStore !== 'undefined' && NotificationsStore._readMaster) {
        const notifs = NotificationsStore._readMaster();
        const cleaned = notifs.filter(n => !(n.actionType === 'announcement' && String(n.actionId) === String(id)));
        if (cleaned.length !== notifs.length) {
          NotificationsStore._saveMaster(cleaned);
          NotificationsStore.updateSidebarBadge();
        }
      }
    } catch (e) {}

    return all;
  },

  getForHub() {
    const user = Auth.getUser();
    return this.getAll().filter(item => isHubVisible(item, user));
  },

  getById(id) {
    return this.getAll().find(a => String(a.id) === String(id));
  }
};

// ─── Events Store (With Admin CRUD) ───
const EventsStore = {
  _key: 'campusnotify_events',
  _deletedKey: 'campusnotify_events_deleted',

  _getDeletedIds() {
    try {
      const stored = localStorage.getItem(this._deletedKey);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  },

  _addDeletedId(id) {
    const deleted = this._getDeletedIds();
    const strId = String(id);
    if (!deleted.includes(strId)) {
      deleted.push(strId);
      try {
        localStorage.setItem(this._deletedKey, JSON.stringify(deleted));
      } catch (e) {}
    }
  },

  getAll() {
    const deletedIds = this._getDeletedIds();
    const stored = localStorage.getItem(this._key);
    if (stored !== null) {
      try {
        let parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter(item => !deletedIds.includes(String(item.id)) && !isDemoCard(item));
          if (filtered.length !== parsed.length) {
            this.save(filtered);
          }
          return filtered;
        }
      } catch (e) {}
    }
    return [];
  },

  save(events) {
    localStorage.setItem(this._key, JSON.stringify(events));
  },

  add(event) {
    const all = this.getAll();
    event.id = Date.now();
    event.attendees = event.attendees || 0;

    const target = event.target || 'all';
    event.target = target;
    event.department = target === 'students' ? (event.department || 'all') : 'all';
    event.year = target === 'students' ? (event.year || 'all') : 'all';
    event.targetDepartment = event.department;
    event.targetYear = event.year;

    all.unshift(event);
    this.save(all);

    // Automatically trigger notification with exact same audience targeting
    try {
      if (typeof NotificationsStore !== 'undefined') {
        NotificationsStore.add({
          type: 'info',
          icon: '📅',
          title: `New Event: ${event.title}`,
          message: event.description ? (event.description.length > 120 ? event.description.substring(0, 117) + '...' : event.description) : `${event.date} at ${event.location}`,
          time: 'Just now',
          target: event.target,
          department: event.department,
          year: event.year,
          targetDepartment: event.department,
          targetYear: event.year,
          actionType: 'event',
          actionId: event.id
        });
      }
    } catch (e) {}

    return event;
  },

  update(id, data) {
    const all = this.getAll();
    const idx = all.findIndex(e => String(e.id) === String(id));
    if (idx !== -1) {
      const target = data.target || all[idx].target || 'all';
      const dept = target === 'students' ? (data.department || all[idx].department || 'all') : 'all';
      const yr = target === 'students' ? (data.year || all[idx].year || 'all') : 'all';
      all[idx] = {
        ...all[idx],
        ...data,
        target,
        department: dept,
        year: yr,
        targetDepartment: dept,
        targetYear: yr
      };
      this.save(all);
      return all[idx];
    }
    return null;
  },

  delete(id) {
    if (id === null || id === undefined) return this.getAll();
    this._addDeletedId(id);
    const all = this.getAll().filter(e => String(e.id) !== String(id));
    this.save(all);

    // Clean up auxiliary stores
    try {
      if (typeof SavedStore !== 'undefined' && SavedStore.remove) {
        SavedStore.remove('event', id);
        SavedStore.remove('event', Number(id));
      }
      if (typeof ReminderStore !== 'undefined' && ReminderStore.remove) {
        ReminderStore.remove('event', id);
        ReminderStore.remove('event', Number(id));
      }
      if (typeof EventInterestStore !== 'undefined' && EventInterestStore.getAll) {
        const interests = EventInterestStore.getAll().filter(item => String(item.eventId) !== String(id));
        EventInterestStore._save(interests);
      }
      if (typeof NotificationsStore !== 'undefined' && NotificationsStore._readMaster) {
        const notifs = NotificationsStore._readMaster();
        const cleaned = notifs.filter(n => !(n.actionType === 'event' && String(n.actionId) === String(id)));
        if (cleaned.length !== notifs.length) {
          NotificationsStore._saveMaster(cleaned);
          NotificationsStore.updateSidebarBadge();
        }
      }
    } catch (e) {}

    return all;
  },

  getForHub() {
    const user = Auth.getUser();
    return this.getAll().filter(item => isHubVisible(item, user));
  },

  getById(id) {
    return this.getAll().find(e => String(e.id) === String(id));
  }
};

// ─── Notifications Store ───
const NotificationsStore = {
  _masterKey: 'campusnotify_notifications',
  _deletedKey: 'campusnotify_notifications_deleted',
  _dismissedKeyPrefix: 'campusnotify_notif_dismissed_',
  _readKeyPrefix: 'campusnotify_notif_read_',

  _getDeletedIds() {
    try {
      const stored = localStorage.getItem(this._deletedKey);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  },

  _addDeletedId(id) {
    const deleted = this._getDeletedIds();
    const strId = String(id);
    if (!deleted.includes(strId)) {
      deleted.push(strId);
      try {
        localStorage.setItem(this._deletedKey, JSON.stringify(deleted));
      } catch (e) {}
    }
  },

  _getDismissedIds() {
    const user = Auth.getUser();
    if (!user || !user.id) return [];
    try {
      const stored = localStorage.getItem(this._dismissedKeyPrefix + user.id);
      return stored ? JSON.parse(stored) : [];
    } catch (e) { return []; }
  },

  _saveDismissedIds(ids) {
    const user = Auth.getUser();
    if (!user || !user.id) return;
    try {
      localStorage.setItem(this._dismissedKeyPrefix + user.id, JSON.stringify(ids));
    } catch (e) {}
  },

  _getReadIds() {
    const user = Auth.getUser();
    if (!user || !user.id) return [];
    try {
      const stored = localStorage.getItem(this._readKeyPrefix + user.id);
      return stored ? JSON.parse(stored) : [];
    } catch (e) { return []; }
  },

  _saveReadIds(ids) {
    const user = Auth.getUser();
    if (!user || !user.id) return;
    try {
      localStorage.setItem(this._readKeyPrefix + user.id, JSON.stringify(ids));
    } catch (e) {}
  },

  _readMaster() {
    const deletedIds = this._getDeletedIds();
    try {
      const stored = localStorage.getItem(this._masterKey);
      if (stored !== null) {
        let parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter(item => !deletedIds.includes(String(item.id)) && !isDemoCard(item));
          if (filtered.length !== parsed.length) {
            this._saveMaster(filtered);
          }
          return filtered;
        }
      }
    } catch (e) {}
    return [];
  },

  _saveMaster(list) {
    try {
      localStorage.setItem(this._masterKey, JSON.stringify(list));
    } catch (e) {}
  },

  getAll() {
    const user = Auth.getUser();
    const master = this._readMaster();
    const readIds = this._getReadIds();
    const dismissedIds = this._getDismissedIds();

    const filtered = master.filter(item => {
      if (dismissedIds.includes(String(item.id))) return false;
      return isAudienceMatch(item, user);
    });

    return filtered.map(item => ({
      ...item,
      read: readIds.includes(item.id) || readIds.includes(String(item.id)) || !!item.read
    }));
  },

  getById(id) {
    return this._readMaster().find(n => String(n.id) === String(id));
  },

  getForHub() {
    const user = Auth.getUser();
    return this.getAll().filter(item => isHubVisible(item, user));
  },

  getUnreadCount() {
    return this.getAll().filter(n => !n.read).length;
  },

  markAsRead(id) {
    const readIds = this._getReadIds();
    if (!readIds.includes(id) && !readIds.includes(String(id))) {
      readIds.push(id);
      this._saveReadIds(readIds);
    }
    return this.getAll();
  },

  markAllAsRead() {
    const all = this.getAll();
    const readIds = this._getReadIds();
    all.forEach(n => {
      if (!readIds.includes(n.id) && !readIds.includes(String(n.id))) readIds.push(n.id);
    });
    this._saveReadIds(readIds);
    return this.getAll();
  },

  add(notif) {
    const target = notif.target || 'all';
    const dept = target === 'students' ? (notif.department || 'all') : 'all';
    const yr = target === 'students' ? (notif.year || 'all') : 'all';

    const item = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      type: notif.type || 'info',
      icon: notif.icon || '📢',
      title: notif.title || 'Notification',
      message: notif.message || '',
      time: notif.time || 'Just now',
      read: false,
      target,
      department: dept,
      year: yr,
      targetDepartment: dept,
      targetYear: yr,
      studentIds: Array.isArray(notif.studentIds) ? notif.studentIds : [],
      actionType: notif.actionType || null,
      actionId: notif.actionId || null
    };

    const master = this._readMaster();
    master.unshift(item);
    this._saveMaster(master);
    this.updateSidebarBadge();
    return item;
  },

  update(id, data) {
    const master = this._readMaster();
    const idx = master.findIndex(n => String(n.id) === String(id));
    if (idx !== -1) {
      master[idx] = { ...master[idx], ...data };
      this._saveMaster(master);
      this.updateSidebarBadge();
      return master[idx];
    }
    return null;
  },

  dismissForUser(id) {
    const dismissed = this._getDismissedIds();
    const strId = String(id);
    if (!dismissed.includes(strId)) {
      dismissed.push(strId);
      this._saveDismissedIds(dismissed);
    }
  },

  delete(id) {
    if (id === null || id === undefined) return this.getAll();
    const user = Auth.getUser();
    if (user && user.role === 'admin') {
      this._addDeletedId(id);
      const master = this._readMaster().filter(n => String(n.id) !== String(id));
      this._saveMaster(master);
    } else {
      this.dismissForUser(id);
    }
    this.updateSidebarBadge();
    return this.getAll();
  },

  updateSidebarBadge() {
    const navCampusHub = document.getElementById('nav-campus-hub');
    const navEvents = document.getElementById('nav-events');
    const navTarget = navCampusHub || navEvents;
    if (!navTarget) return;

    // For students (nav-campus-hub), count only hub-visible unread notifications
    // For admin (nav-events), count all unread notifications
    const unread = navCampusHub
      ? this.getForHub().filter(n => !n.read).length
      : this.getUnreadCount();

    let badge = navTarget.querySelector('.nav-badge');
    if (unread > 0) {
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'nav-badge';
        navTarget.appendChild(badge);
      }
      badge.textContent = unread;
      badge.style.display = 'inline-flex';
    } else if (badge) {
      badge.remove();
    }
  }
};

// Global NOTIFICATIONS and NotificationsStore compatibility
if (typeof window !== 'undefined') {
  window.NotificationsStore = NotificationsStore;
  try {
    Object.defineProperty(window, 'NOTIFICATIONS', {
      get() {
        return NotificationsStore.getAll();
      },
      configurable: true
    });
  } catch (e) {
    window.NOTIFICATIONS = DEFAULT_NOTIFICATIONS;
  }
}

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
  },

  // Escape HTML
  escapeHtml(str) {
    if (str === null || str === undefined) return '';
    const div = document.createElement('div');
    div.textContent = String(str);
    return div.innerHTML;
  }
};

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  const div = document.createElement('div');
  div.textContent = String(str);
  return div.innerHTML;
}

if (typeof window !== 'undefined') {
  window.escapeHtml = escapeHtml;
}

// ─── Sidebar Component ───
function renderSidebar(activePage) {
  const user = Auth.getUser();
  const role = Auth.getRole();
  if (!user) return '';

  // For students, show only hub-visible unread count on Campus Hub nav item
  const unreadCount = (role === 'admin')
    ? NotificationsStore.getUnreadCount()
    : NotificationsStore.getForHub().filter(n => !n.read).length;

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
          ${role === 'admin' ? `
          <a href="announcements.html" class="nav-item ${activePage === 'announcements' ? 'active' : ''}" id="nav-announcements">
            <span class="nav-icon">📢</span>
            Announcements
          </a>
          <a href="events-notifications.html" class="nav-item ${activePage === 'events' ? 'active' : ''}" id="nav-events">
            <span class="nav-icon">📅</span>
            Events & Alerts
            ${unreadCount > 0 ? `<span class="nav-badge">${unreadCount}</span>` : ''}
          </a>
          <a href="games.html" class="nav-item ${activePage === 'games' ? 'active' : ''}" id="nav-games">
            <span class="nav-icon">🎮</span>
            Games
          </a>
          ` : `
          <a href="campus-hub.html" class="nav-item ${activePage === 'campus-hub' ? 'active' : ''}" id="nav-campus-hub">
            <span class="nav-icon">📢</span>
            Campus Hub
            ${unreadCount > 0 ? `<span class="nav-badge">${unreadCount}</span>` : ''}
          </a>
          <a href="my-activity.html" class="nav-item ${activePage === 'my-activity' ? 'active' : ''}" id="nav-my-activity">
            <span class="nav-icon">⭐</span>
            My Activity
          </a>
          <a href="games.html" class="nav-item ${activePage === 'games' ? 'active' : ''}" id="nav-games">
            <span class="nav-icon">🎮</span>
            Games
          </a>
          `}
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

// ─── Appearance Preferences ───
const AppearancePrefs = {
  _key: 'campusnotify_appearance',

  getDefaults() {
    return { theme: 'dark', accent: 'indigo', animations: true, compact: false };
  },

  get() {
    try {
      const stored = localStorage.getItem(this._key);
      if (stored) return { ...this.getDefaults(), ...JSON.parse(stored) };
    } catch (e) {}
    return this.getDefaults();
  },

  save(prefs) {
    localStorage.setItem(this._key, JSON.stringify(prefs));
  },

  update(key, value) {
    const prefs = this.get();
    prefs[key] = value;
    this.save(prefs);
    this.apply(prefs);
    return prefs;
  },

  apply(prefs) {
    if (!prefs) prefs = this.get();

    // Theme
    document.body.classList.toggle('light-theme', prefs.theme === 'light');

    // Accent color — remove all accent classes, then add the active one
    document.body.classList.remove('accent-cyan', 'accent-emerald', 'accent-rose', 'accent-amber');
    if (prefs.accent && prefs.accent !== 'indigo') {
      document.body.classList.add('accent-' + prefs.accent);
    }

    // Animations
    document.body.classList.toggle('no-animations', !prefs.animations);

    // Compact mode
    document.body.classList.toggle('compact-mode', !!prefs.compact);
  }
};

// ─── Page Init ───
function initPage(activePage) {
  if (!Auth.requireAuth()) return false;
  applyRole();

  // Apply saved appearance preferences
  AppearancePrefs.apply();

  // Inject sidebar
  const sidebarTarget = document.getElementById('app-sidebar');
  if (sidebarTarget) {
    sidebarTarget.innerHTML = renderSidebar(activePage);
    initSidebar();
  }
  return true;
}

// ─── For You Feed Utility ───
const ForYouFeed = {
  _normalise(item) {
    const rawTarget = item.target || (
      ((item.targetDepartment && item.targetDepartment !== 'all') || (item.department && item.department !== 'all'))
        ? 'students'
        : 'all'
    );

    return {
      audience:   rawTarget.toLowerCase(),
      department: normalizeDepartment(item.targetDepartment || item.department || 'all'),
      year:       normalizeYear(item.targetYear || item.year || 'all'),
      studentIds: Array.isArray(item.studentIds) ? item.studentIds : []
    };
  },

  isForYou(item, user) {
    if (!user || user.role === 'admin') return false;

    const n = this._normalise(item);

    // Direct student-ID targeting: if the student's ID is in the list, always show
    if (n.studentIds.length > 0 && n.studentIds.includes(user.id)) return true;

    // Audience gate: 'faculty' items should not appear for students
    if (n.audience === 'faculty') return false;

    // All campus items belong in Campus Hub, NOT in the personalized For You feed
    if (n.audience === 'all' && n.studentIds.length === 0) return false;

    // Only students have a For You feed
    if (user.role !== 'student') return false;

    const userDept = normalizeDepartment(user.department);
    const userYear = normalizeYear(user.year);

    const deptMatch = (n.department === 'all' || n.department === userDept);
    const yearMatch = (n.year === 'all' || n.year === userYear);

    return deptMatch && yearMatch;
  },

  isCampusWide(item) {
    const n = this._normalise(item);
    return n.audience === 'all' || (n.department === 'all' && n.year === 'all');
  },

  buildFeed(user) {
    if (!user || user.role === 'admin') return [];

    const announcements = AnnouncementsStore.getAll();
    const events = EventsStore.getAll();
    const notifications = NotificationsStore.getAll();
    const feed = [];

    announcements.forEach(a => {
      if (this.isForYou(a, user)) {
        const n = this._normalise(a);
        feed.push({
          feedType: 'announcement', id: a.id, title: a.title, body: a.body,
          category: a.category, priority: a.priority, pinned: a.pinned,
          author: a.author, date: a.date,
          targetDepartment: n.department, targetYear: n.year,
          sortDate: new Date(a.date + 'T00:00:00').getTime(),
          sortPriority: a.pinned ? 0 : 1,
          data: a
        });
      }
    });

    events.forEach(e => {
      if (this.isForYou(e, user)) {
        const n = this._normalise(e);
        feed.push({
          feedType: 'event', id: e.id, title: e.title, body: e.description,
          category: e.category, date: e.date, time: e.time,
          location: e.location, attendees: e.attendees || 0,
          targetDepartment: n.department, targetYear: n.year,
          sortDate: new Date(e.date + 'T00:00:00').getTime(),
          sortPriority: 1,
          data: e
        });
      }
    });

    // Notifications that are targeted to this user's department/year
    notifications.forEach(n => {
      if (this.isForYou(n, user)) {
        const norm = this._normalise(n);
        feed.push({
          feedType: 'notification', id: n.id, title: n.title, body: n.message,
          category: null, notifType: n.type, icon: n.icon,
          time: n.time, read: n.read,
          targetDepartment: norm.department, targetYear: norm.year,
          sortDate: Date.now(),
          sortPriority: n.read ? 2 : 0,
          data: n
        });
      }
    });

    // Sort: pinned/unread first, then by date
    feed.sort((a, b) => {
      if (a.sortPriority !== b.sortPriority) return a.sortPriority - b.sortPriority;
      return b.sortDate - a.sortDate;
    });

    return feed;
  },

  getTargetLabel(item) {
    const raw = item.data || item;
    if (Array.isArray(raw.studentIds) && raw.studentIds.length > 0) {
      return `Direct: ${raw.studentIds.length === 1 ? raw.studentIds[0] : `${raw.studentIds.length} Students`}`;
    }
    const dept = raw.targetDepartment || raw.department;
    const yr = raw.targetYear || raw.year;
    const parts = [];
    if (dept && dept.toLowerCase() !== 'all') parts.push(dept);
    if (yr && yr.toLowerCase() !== 'all') parts.push(yr);
    else if (dept && dept.toLowerCase() !== 'all') parts.push('All Years');
    return parts.length > 0 ? parts.join(' · ') : 'Students Only';
  }
};

// ─── Daily Login UI & Game Skins Controller (Students Only) ───
const DailyLoginUI = {
  _activeLockerGame: 'chess',

  init() {
    // Only student role is eligible for daily login rewards
    const role = Auth.getRole();
    if (role !== 'student') return;

    this.injectModals();
    this.checkAutoPrompt();
  },

  injectModals() {
    if (document.getElementById('dailyLoginModalOverlay')) return;

    // Daily Login Rewards Modal HTML
    const dailyModal = document.createElement('div');
    dailyModal.id = 'dailyLoginModalOverlay';
    dailyModal.className = 'daily-modal-overlay';
    dailyModal.innerHTML = `
      <div class="daily-modal-dialog">
        <button class="daily-modal-close" onclick="DailyLoginUI.closeModal()" title="Close">&times;</button>
        <div id="dailyModalBody"></div>
      </div>
    `;
    document.body.appendChild(dailyModal);

    // Game Skins & Displays Locker Modal HTML
    const lockerModal = document.createElement('div');
    lockerModal.id = 'gameSkinsLockerOverlay';
    lockerModal.className = 'daily-modal-overlay';
    lockerModal.innerHTML = `
      <div class="locker-modal-dialog">
        <button class="daily-modal-close" onclick="DailyLoginUI.closeLockerModal()" title="Close">&times;</button>
        <div class="daily-header" style="text-align:left; margin-bottom:var(--space-lg);">
          <span class="daily-student-pill">🎨 Game Customization</span>
          <h2 class="daily-title" style="font-size:1.8rem; margin-top:0.2rem;">Skins & Displays Locker</h2>
          <p class="daily-subtitle" style="margin:0;">Equip custom board finishes, retro cards, CRT monitors, and table baize unlocked via Student Daily Logins.</p>
        </div>
        <div class="locker-tabs" id="lockerTabs"></div>
        <div class="locker-grid" id="lockerGrid"></div>
        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-subtle); padding-top:var(--space-md); flex-wrap:wrap; gap:10px;">
          <span style="font-size:0.85rem; color:var(--text-muted);">
            💡 Unlocked skins persist across your sessions and apply immediately to games.
          </span>
          <div style="display:flex; gap:8px;">
            <button class="btn btn-secondary btn-sm" onclick="DailyLoginUI.openModal()">🎁 View Daily Rewards</button>
            <button class="btn btn-primary btn-sm" onclick="DailyLoginUI.closeLockerModal()">Done</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(lockerModal);
  },

  checkAutoPrompt() {
    if (Auth.getRole() !== 'student') return;

    const canClaim = DailyLoginStore.canClaimToday();
    const justLoggedIn = localStorage.getItem('campusnotify_just_logged_in') === 'true';
    const promptedThisSession = sessionStorage.getItem('campusnotify_daily_prompted');

    if (canClaim && (justLoggedIn || !promptedThisSession)) {
      localStorage.removeItem('campusnotify_just_logged_in');
      sessionStorage.setItem('campusnotify_daily_prompted', 'true');
      // Delay slightly so the page finish animating
      setTimeout(() => {
        this.openModal();
      }, 700);
    }
  },

  openModal() {
    if (Auth.getRole() !== 'student') {
      UI.toast('Daily Login Rewards are available exclusively for Students.', 'info');
      return;
    }
    this.injectModals();
    this.renderModal();
    const el = document.getElementById('dailyLoginModalOverlay');
    if (el) el.classList.add('active');
  },

  closeModal() {
    const el = document.getElementById('dailyLoginModalOverlay');
    if (el) el.classList.remove('active');
  },

  openLockerModal(game = 'chess') {
    if (Auth.getRole() !== 'student') {
      UI.toast('Game Skins & Displays Locker is available for Students.', 'info');
      return;
    }
    this.injectModals();
    this._activeLockerGame = game;
    this.renderLocker();
    const el = document.getElementById('gameSkinsLockerOverlay');
    if (el) el.classList.add('active');
  },

  closeLockerModal() {
    const el = document.getElementById('gameSkinsLockerOverlay');
    if (el) el.classList.remove('active');
  },

  renderModal() {
    const body = document.getElementById('dailyModalBody');
    if (!body) return;

    const status = DailyLoginStore.getStatus();
    const schedule = DailyLoginStore.getSchedule();
    const user = Auth.getUser();

    // Build 7-day schedule cards
    let calendarHtml = '';
    schedule.forEach(item => {
      const isPastClaimed = status.alreadyClaimedToday
        ? item.day <= status.dayInCycle
        : item.day < status.dayInCycle;
      const isTodayActive = item.day === status.dayInCycle;
      const isLocked = item.day > status.dayInCycle;

      let cardClass = 'daily-day-card';
      let statusLabel = '🔒 Locked';

      if (isPastClaimed) {
        cardClass += ' claimed';
        statusLabel = '✓ Claimed';
      } else if (isTodayActive) {
        cardClass += ' today-active';
        statusLabel = status.alreadyClaimedToday ? '✓ Claimed' : '⭐ Ready!';
      } else {
        cardClass += ' locked';
      }

      if (item.day === 7) {
        cardClass += ' grand-vault';
      }

      const dayLabel = item.day === 7 ? 'Day 7 ★' : (item.badge && item.badge.length <= 6 ? item.badge : `Day ${item.day}`);

      calendarHtml += `
        <div class="${cardClass}" id="dailyCardDay${item.day}" onclick="DailyLoginUI.highlightDayReward(${item.day})" title="${item.title} (+${item.points} pts)">
          <div class="daily-day-num">${dayLabel}</div>
          <div class="daily-day-icon">${item.icon}</div>
          <div class="daily-day-pts">+${item.points} pts</div>
          <span class="daily-day-status-pill">${statusLabel}</span>
        </div>
      `;
    });

    const activeReward = status.todayReward;
    const currentDay = Math.min(7, Math.max(1, status.dayInCycle || 1));
    const progressPercent = ((currentDay - 1) / 6) * 100;

    body.innerHTML = `
      <div class="daily-modal-scrollable">
        <div class="daily-header-merged">
          <div class="daily-header-left">
            <div class="daily-header-title-wrap">
              <h2 class="daily-title">Daily Login Game Rewards</h2>
              <span class="daily-student-pill">🎓 Student Exclusive</span>
            </div>
            <p class="daily-subtitle">
              Sign in daily to unlock skins and themes for 6 games.
              <span class="daily-tooltip-wrap" title="Chess, Memory Match, Typing Racer, Sudoku, 2048 & Billiards">
                <span class="daily-tooltip-trigger">(View Games ℹ️)</span>
                <span class="daily-tooltip-box">🎮 Chess, Memory Match, Typing Racer, Sudoku, 2048 & Billiards</span>
              </span>
            </p>
          </div>

          <div class="daily-header-chips">
            <div class="daily-chip streak-chip" title="Current Active Login Streak">
              <svg class="streak-chip-svg flame-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
              </svg>
              <span><strong>${status.currentStreak}</strong>-day streak</span>
            </div>
            <div class="daily-chip total-chip" title="Total Days Claimed">
              <svg class="streak-chip-svg calendar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span><strong>${status.totalClaims}</strong> total day${status.totalClaims === 1 ? '' : 's'}</span>
            </div>
            <div class="daily-chip skins-chip" title="Unlocked Skins in Locker">
              <svg class="streak-chip-svg palette-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
                <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
                <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>
                <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.563C21.437 6.223 17.215 2 12 2z"/>
              </svg>
              <span><strong>${status.unlockedSkinsCount}</strong> skins</span>
            </div>
          </div>
        </div>

        <div class="daily-calendar-wrap">
          <div class="daily-progress-track" aria-hidden="true">
            <div class="daily-progress-line-bg"></div>
            <div class="daily-progress-line-fill" style="width: ${progressPercent}%;"></div>
            <div class="daily-progress-head ${currentDay === 7 ? 'is-vault' : ''}" style="left: ${progressPercent}%;"></div>
          </div>
          <div class="daily-calendar-grid" id="dailyCalendarGrid">
            ${calendarHtml}
          </div>
        </div>

        <div class="daily-showcase-box" id="dailyShowcaseBox">
          <div class="daily-showcase-icon-wrap">
            ${activeReward.icon}
          </div>
          <div class="daily-showcase-meta">
            <h4>${activeReward.title}</h4>
            <p>${activeReward.description}</p>
            <div class="daily-showcase-tags">
              <span class="showcase-tag game">🎮 ${activeReward.game === 'multi' ? 'Multi-Game Pack' : activeReward.game.toUpperCase()}</span>
              <span class="showcase-tag points">⭐ +${activeReward.points} Arcade Points</span>
              <span class="showcase-tag" style="background:rgba(16,185,129,0.15);color:#34d399;border:1px solid rgba(16,185,129,0.3);">
                🎁 ${status.canClaim ? 'Ready to Claim' : 'Already Claimed Today'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="daily-sticky-footer">
        <div class="daily-actions-info">
          <div class="daily-logged-user">
            Logged in as: <strong style="color:var(--text-primary);">${user ? user.name : 'Student'}</strong> (🎓 Student Account)
          </div>
          <div class="daily-footer-btns">
            <button class="btn btn-secondary btn-sm" onclick="DailyLoginUI.openLockerModal()" title="View unlocked game skins">
              🎨 Skins Locker
            </button>
            <a href="games.html" class="btn btn-ghost btn-sm" title="Go to games arena">
              🕹️ Games Arena →
            </a>
          </div>
        </div>
        <div class="daily-sticky-claim-action">
          ${status.canClaim ? `
            <button class="daily-claim-btn" id="btnClaimDailyReward" onclick="DailyLoginUI.handleClaim()">
              <span>🎁</span> Claim Day ${status.dayInCycle} Reward
            </button>
          ` : `
            <button class="daily-claim-btn" disabled>
              <span>✓</span> Claimed Today
            </button>
          `}
        </div>
      </div>
    `;

    // On mobile screens, smoothly center the active day card into view
    setTimeout(() => {
      const activeCard = body.querySelector('.daily-day-card.today-active');
      if (activeCard && window.innerWidth <= 820) {
        activeCard.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }, 120);
  },

  highlightDayReward(dayNum) {
    const schedule = DailyLoginStore.getSchedule();
    const item = schedule.find(s => s.day === dayNum);
    if (!item) return;

    const box = document.getElementById('dailyShowcaseBox');
    if (!box) return;

    const status = DailyLoginStore.getStatus();
    const isToday = dayNum === status.dayInCycle;

    box.querySelector('.daily-showcase-icon-wrap').innerHTML = item.icon;
    box.querySelector('.daily-showcase-meta h4').textContent = item.title;
    box.querySelector('.daily-showcase-meta p').textContent = item.description;

    const tags = box.querySelector('.daily-showcase-tags');
    if (tags) {
      tags.innerHTML = `
        <span class="showcase-tag game">🎮 ${item.game === 'multi' ? 'Multi-Game Pack' : item.game.toUpperCase()}</span>
        <span class="showcase-tag points">⭐ +${item.points} Arcade Points</span>
        <span class="showcase-tag" style="background:rgba(99,102,241,0.15);color:#a5b4fc;border:1px solid rgba(99,102,241,0.3);">
          ${item.badge}
        </span>
      `;
    }
  },

  handleClaim() {
    const claimBtn = document.getElementById('btnClaimDailyReward');
    if (claimBtn) {
      claimBtn.disabled = true;
      claimBtn.innerHTML = `<span>✨</span> Claiming...`;
    }

    const result = DailyLoginStore.claimToday();
    if (!result.success) {
      UI.toast(result.message, 'warning');
      if (claimBtn) {
        claimBtn.disabled = false;
        claimBtn.innerHTML = `<span>🎁</span> Claim Reward`;
      }
      return;
    }

    const targetPoints = result.reward ? result.reward.points : 100;
    const claimedDay = result.reward ? result.reward.day : 1;

    // Locate active card being claimed
    const activeCard = document.querySelector('.daily-day-card.today-active') ||
                       document.getElementById(`dailyCardDay${claimedDay}`);

    // Anchor for animations (active card or claim button)
    const animAnchor = activeCard || claimBtn;

    // 1. Let the claimed card flip and glow before it turns green
    if (activeCard) {
      activeCard.classList.add('is-claiming');
    }

    // 2. Small colorful confetti burst
    this.spawnConfetti(animAnchor);

    // 3. Points counter animation rolling up from 0 to +X pts
    this.animatePointsCounter(targetPoints, animAnchor);

    // Secondary sparkle burst near claim button if separate
    if (claimBtn && activeCard && claimBtn !== activeCard) {
      setTimeout(() => this.spawnConfetti(claimBtn), 140);
    }

    // 4. After the flip & glow completes, transition card to green, re-render, and celebrate
    setTimeout(() => {
      if (activeCard) {
        activeCard.classList.remove('is-claiming');
        activeCard.classList.add('claimed', 'just-claimed');
        const pill = activeCard.querySelector('.daily-day-status-pill');
        if (pill) pill.textContent = '✓ Claimed';
      }

      // Re-render modal to reflect new state
      this.renderModal();

      // Highlight the claimed card in the freshly re-rendered modal
      const newCard = document.getElementById(`dailyCardDay${claimedDay}`);
      if (newCard) {
        newCard.classList.add('just-claimed');
      }

      UI.toast(`🎉 Claimed ${result.reward.title}! +${result.reward.points} Arcade Points & Game Skins unlocked!`, 'success');

      // Refresh any active on-page widgets
      const banner = document.getElementById('studentDailyBannerContainer');
      if (banner) {
        this.renderBanner('studentDailyBannerContainer');
      }

      // If on games page, refresh games stats & skins
      if (typeof refreshStatsUI === 'function') {
        refreshStatsUI();
      }
      if (typeof applyAllEquippedGameSkins === 'function') {
        applyAllEquippedGameSkins();
      }
    }, 720);
  },

  spawnConfetti(sourceEl) {
    let originX = window.innerWidth / 2;
    let originY = window.innerHeight / 2;

    if (sourceEl) {
      const rect = sourceEl.getBoundingClientRect();
      originX = rect.left + rect.width / 2;
      originY = rect.top + rect.height / 2;
    }

    const colors = [
      '#10b981', '#34d399', '#06b6d4', '#22d3ee',
      '#6366f1', '#818cf8', '#fbbf24', '#f59e0b',
      '#ec4899', '#f43f5e', '#a855f7', '#ffffff'
    ];
    const emojis = ['✨', '⭐', '🎁', '🎉'];

    const count = 38;
    for (let i = 0; i < count; i++) {
      const isEmoji = i % 5 === 0;
      const el = document.createElement('div');
      el.className = 'daily-confetti-particle';

      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.45;
      const velocity = 70 + Math.random() * 200;
      const destX = Math.cos(angle) * velocity + (Math.random() - 0.5) * 35;
      const destY = Math.sin(angle) * velocity - (35 + Math.random() * 110);
      const rot = (Math.random() - 0.5) * 720;
      const scale = 0.6 + Math.random() * 0.7;
      const duration = 0.8 + Math.random() * 0.4;

      if (isEmoji) {
        el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        el.style.fontSize = `${1 + Math.random() * 0.8}rem`;
        el.style.background = 'transparent';
      } else {
        const isCircle = Math.random() > 0.5;
        const w = 7 + Math.random() * 7;
        const h = 5 + Math.random() * 8;
        el.style.width = `${w}px`;
        el.style.height = `${h}px`;
        el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        el.style.borderRadius = isCircle ? '50%' : '2px';
        el.style.boxShadow = `0 0 8px ${el.style.backgroundColor}`;
      }

      el.style.position = 'fixed';
      el.style.left = `${originX}px`;
      el.style.top = `${originY}px`;
      el.style.transform = 'translate(-50%, -50%) scale(0.2)';
      el.style.opacity = '1';
      el.style.transition = `transform ${duration}s cubic-bezier(0.12, 0.8, 0.32, 1), opacity ${duration}s ease-in`;

      document.body.appendChild(el);

      requestAnimationFrame(() => {
        el.style.transform = `translate(calc(-50% + ${destX}px), calc(-50% + ${destY}px)) rotate(${rot}deg) scale(${scale})`;
        el.style.opacity = '0';
      });

      setTimeout(() => el.remove(), duration * 1000 + 100);
    }
  },

  animatePointsCounter(targetPoints, anchorEl) {
    if (!targetPoints) return;

    let posX = window.innerWidth / 2;
    let posY = window.innerHeight / 2;

    if (anchorEl) {
      const rect = anchorEl.getBoundingClientRect();
      posX = rect.left + rect.width / 2;
      posY = Math.max(70, rect.top - 15);
    }

    const bubble = document.createElement('div');
    bubble.className = 'daily-points-counter-bubble';
    bubble.style.left = `${posX}px`;
    bubble.style.top = `${posY}px`;
    bubble.innerHTML = `
      <span class="pts-star">⭐</span>
      <span class="pts-num">+0 PTS</span>
    `;
    document.body.appendChild(bubble);

    const numEl = bubble.querySelector('.pts-num');
    const startTime = performance.now();
    const duration = 520;

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentPts = Math.round(easeProgress * targetPoints);

      if (numEl) {
        numEl.textContent = `+${currentPts} PTS`;
      }

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        if (numEl) numEl.textContent = `+${targetPoints} PTS!`;
      }
    };

    requestAnimationFrame(updateCounter);

    setTimeout(() => {
      bubble.remove();
    }, 1450);
  },

  celebrateBurst(sourceEl) {
    this.spawnConfetti(sourceEl);
  },

  renderBanner(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (Auth.getRole() !== 'student') {
      container.innerHTML = '';
      return;
    }

    const status = DailyLoginStore.getStatus();
    const nextReward = status.todayReward;

    container.innerHTML = `
      <div class="student-daily-banner">
        <div class="student-daily-banner-left">
          <div class="student-daily-banner-icon">
            ${status.canClaim ? '🎁' : '🔥'}
          </div>
          <div>
            <div class="student-daily-banner-title">
              <span>Daily Student Login</span>
              <span class="badge ${status.canClaim ? 'badge-warning' : 'badge-success'}" style="font-size:0.75rem;">
                ${status.canClaim ? '⭐ Ready to Claim' : '✓ Claimed Today'}
              </span>
              ${status.currentStreak > 0 ? `<span style="font-size:0.8rem; color:#f59e0b;">🔥 ${status.currentStreak}-Day Streak</span>` : ''}
            </div>
            <div class="student-daily-banner-subtitle">
              ${status.canClaim
                ? `Today's Reward: <strong>${nextReward.title}</strong> (+${nextReward.points} pts)`
                : `Streak active! Unlocked skins ready in your locker. Next reward unlocks tomorrow.`}
            </div>
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:0.5rem;">
          <button class="student-daily-banner-btn" onclick="DailyLoginUI.openModal()">
            ${status.canClaim ? '🎁 Claim Reward' : '📅 View Calendar'}
          </button>
          <button class="btn btn-ghost btn-sm" onclick="DailyLoginUI.openLockerModal()" title="Open Skins Locker">
            🎨 Locker
          </button>
        </div>
      </div>
    `;
  },

  renderLocker(game = this._activeLockerGame) {
    this._activeLockerGame = game;
    const tabs = document.getElementById('lockerTabs');
    const grid = document.getElementById('lockerGrid');
    if (!tabs || !grid) return;

    const gameTabs = [
      { id: 'chess', name: 'Campus Chess', icon: '♟️' },
      { id: 'memory', name: 'Memory Match', icon: '🃏' },
      { id: 'typing', name: 'Typing Racer', icon: '⌨️' },
      { id: 'sudoku', name: 'Sudoku', icon: '🔢' },
      { id: 'billiards', name: 'Billiards', icon: '🎱' }
    ];

    tabs.innerHTML = gameTabs.map(t => `
      <button class="locker-tab-btn ${t.id === game ? 'active' : ''}" onclick="DailyLoginUI.renderLocker('${t.id}')">
        <span>${t.icon}</span> ${t.name}
      </button>
    `).join('');

    const catalog = GameSkinsCatalog[game] || [];
    const equipped = DailyLoginStore.getEquippedSkin(game);

    grid.innerHTML = catalog.map(skin => {
      const isUnlocked = DailyLoginStore.isSkinUnlocked(game, skin.id);
      const isEquipped = equipped && equipped.id === skin.id;

      let cardClass = 'skin-card';
      if (isEquipped) cardClass += ' is-equipped';
      if (!isUnlocked) cardClass += ' is-locked';

      // Preview miniature box based on game
      let previewContent = '';
      if (game === 'chess') {
        const p = skin.preview || { light: '#cbd5e1', dark: '#475569', border: '#6366f1' };
        previewContent = `
          <div style="display:grid; grid-template-columns:repeat(4, 18px); grid-template-rows:repeat(4, 18px); border:2px solid ${p.border}; border-radius:6px; overflow:hidden;">
            <div style="background:${p.light};"></div><div style="background:${p.dark};"></div><div style="background:${p.light};"></div><div style="background:${p.dark};"></div>
            <div style="background:${p.dark};"></div><div style="background:${p.light};"></div><div style="background:${p.dark};"></div><div style="background:${p.light};"></div>
            <div style="background:${p.light};"></div><div style="background:${p.dark};"></div><div style="background:${p.light};"></div><div style="background:${p.dark};"></div>
            <div style="background:${p.dark};"></div><div style="background:${p.light};"></div><div style="background:${p.dark};"></div><div style="background:${p.light};"></div>
          </div>
        `;
      } else if (game === 'memory') {
        const emojis = skin.emojis || ['📚', '🎓'];
        previewContent = `
          <div style="display:flex; gap:8px;">
            <div style="width:36px; height:48px; border-radius:6px; background:#1e293b; border:1px solid #4f46e5; display:flex; align-items:center; justify-content:center; font-size:1.1rem;">
              ${skin.cardBackIcon || '❓'}
            </div>
            <div style="width:36px; height:48px; border-radius:6px; background:#0f172a; border:1px solid #10b981; display:flex; align-items:center; justify-content:center; font-size:1.1rem;">
              ${emojis[0]}
            </div>
            <div style="width:36px; height:48px; border-radius:6px; background:#0f172a; border:1px solid #10b981; display:flex; align-items:center; justify-content:center; font-size:1.1rem;">
              ${emojis[1]}
            </div>
          </div>
        `;
      } else if (game === 'typing') {
        previewContent = `
          <div style="background:#090d16; border:1px solid ${skin.previewColor || '#34d399'}; border-radius:6px; padding:6px 12px; font-family:monospace; font-size:0.75rem; color:${skin.previewColor || '#34d399'};">
            > campus.speed(wpm_120)<span style="animation:blink 1s infinite;">_</span>
          </div>
        `;
      } else if (game === 'sudoku') {
        previewContent = `
          <div style="display:grid; grid-template-columns:repeat(3, 16px); grid-template-rows:repeat(3, 16px); gap:2px; border:2px solid ${skin.accentColor || '#6366f1'}; border-radius:6px; padding:2px; background:#0f172a;">
            <div style="background:#1e293b; color:${skin.accentColor || '#6366f1'}; font-size:9px; font-weight:800; display:flex; align-items:center; justify-content:center;">5</div>
            <div style="background:#1e293b; color:#fff; font-size:9px; font-weight:800; display:flex; align-items:center; justify-content:center;">3</div>
            <div style="background:#1e293b; color:#94a3b8; font-size:9px; font-weight:800; display:flex; align-items:center; justify-content:center;">.</div>
            <div style="background:#1e293b; color:#94a3b8; font-size:9px; font-weight:800; display:flex; align-items:center; justify-content:center;">6</div>
            <div style="background:#1e293b; color:${skin.accentColor || '#6366f1'}; font-size:9px; font-weight:800; display:flex; align-items:center; justify-content:center;">7</div>
            <div style="background:#1e293b; color:#94a3b8; font-size:9px; font-weight:800; display:flex; align-items:center; justify-content:center;">.</div>
            <div style="background:#1e293b; color:#94a3b8; font-size:9px; font-weight:800; display:flex; align-items:center; justify-content:center;">.</div>
            <div style="background:#1e293b; color:#94a3b8; font-size:9px; font-weight:800; display:flex; align-items:center; justify-content:center;">9</div>
            <div style="background:#1e293b; color:${skin.accentColor || '#6366f1'}; font-size:9px; font-weight:800; display:flex; align-items:center; justify-content:center;">8</div>
          </div>
        `;
      } else if (game === 'billiards') {
        previewContent = `
          <div style="width:110px; height:55px; border-radius:8px; background:${skin.feltCenter || '#15614a'}; border:5px solid ${skin.railColor || '#26170d'}; display:flex; align-items:center; justify-content:center; gap:6px; box-shadow:inset 0 0 10px rgba(0,0,0,0.5);">
            <div style="width:10px; height:10px; border-radius:50%; background:#fff;"></div>
            <div style="width:10px; height:10px; border-radius:50%; background:#ef4444;"></div>
            <div style="width:10px; height:10px; border-radius:50%; background:#000;"></div>
          </div>
        `;
      }

      return `
        <div class="${cardClass}">
          <div class="skin-card-preview" style="background:rgba(255,255,255,0.02);">
            ${previewContent}
          </div>
          <div class="skin-card-header">
            <span class="skin-card-name">${skin.icon} ${skin.name}</span>
            <span class="skin-card-badge ${isUnlocked ? 'badge-primary' : 'badge-secondary'}">
              ${isUnlocked ? 'Unlocked' : 'Locked'}
            </span>
          </div>
          <p class="skin-card-desc">${skin.desc}</p>
          <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:0.75rem;">
            Source: <strong style="color:var(--text-secondary);">${skin.unlockedBy}</strong>
          </div>
          <div class="skin-card-footer">
            ${isEquipped ? `
              <button class="skin-equip-btn btn-equipped">
                <span>✓</span> Currently Equipped
              </button>
            ` : isUnlocked ? `
              <button class="skin-equip-btn btn-equip" onclick="DailyLoginUI.equipSkin('${game}', '${skin.id}')">
                Equip Skin
              </button>
            ` : `
              <button class="skin-equip-btn btn-locked" onclick="DailyLoginUI.openModal()">
                🔒 ${skin.unlockedBy}
              </button>
            `}
          </div>
        </div>
      `;
    }).join('');
  },

  equipSkin(game, skinId) {
    const res = DailyLoginStore.equipSkin(game, skinId);
    if (!res.success) {
      UI.toast(res.message, 'warning');
      return;
    }

    const skin = GameSkinsCatalog[game].find(s => s.id === skinId);
    UI.toast(`Equipped ${skin ? skin.name : skinId} for ${game.toUpperCase()}!`, 'success');

    // Re-render locker UI
    this.renderLocker(game);

    // Apply directly if games page is open
    if (typeof applyAllEquippedGameSkins === 'function') {
      applyAllEquippedGameSkins();
    }
  }
};

// Auto-initialize when DOM ready
if (typeof window !== 'undefined') {
  window.ForYouFeed = ForYouFeed;
  window.DailyLoginUI = DailyLoginUI;
  window.addEventListener('DOMContentLoaded', () => {
    DailyLoginUI.init();
  });
}

