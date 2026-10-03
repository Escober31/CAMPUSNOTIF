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
    pinned: true,
    targetDepartment: 'all',
    targetYear: 'all'
  },
  {
    id: 2,
    title: 'Campus Wi-Fi Maintenance — Oct 2',
    body: 'The campus wireless network will undergo scheduled maintenance on October 2nd from 2:00 AM to 6:00 AM. Internet access may be intermittent during this period. Please plan accordingly.',
    priority: 'important',
    category: 'Facility',
    author: 'IT Services',
    date: '2026-09-27',
    pinned: false,
    targetDepartment: 'all',
    targetYear: 'all'
  },
  {
    id: 3,
    title: 'Annual Science Fair — Call for Entries',
    body: 'The annual Campus Science Fair will be held on November 12th. Students from all departments are encouraged to submit their projects by October 20th. Prizes will be awarded in multiple categories.',
    priority: 'normal',
    category: 'Academic',
    author: 'Dept. of Sciences',
    date: '2026-09-26',
    pinned: false,
    targetDepartment: 'all',
    targetYear: 'all'
  },
  {
    id: 4,
    title: 'New Library Hours for Midterm Season',
    body: 'Starting October 5th, the university library will extend its hours to 24/7 access through the midterm examination period. Student ID is required for after-hours entry.',
    priority: 'normal',
    category: 'Facility',
    author: 'University Library',
    date: '2026-09-25',
    pinned: false,
    targetDepartment: 'all',
    targetYear: 'all'
  },
  {
    id: 5,
    title: 'Mental Health Awareness Week — Oct 6–10',
    body: 'Join us for Mental Health Awareness Week with free workshops, counseling sessions, and wellness activities. Schedule and sign-up available on the Student Services portal.',
    priority: 'important',
    category: 'Student Life',
    author: 'Student Wellness Center',
    date: '2026-09-24',
    pinned: true,
    targetDepartment: 'all',
    targetYear: 'all'
  },
  {
    id: 6,
    title: 'Parking Lot B Closure for Renovation',
    body: 'Parking Lot B will be closed from October 1st through October 31st for repaving and expansion. Alternative parking is available at Lot D with a complimentary shuttle service to campus buildings.',
    priority: 'normal',
    category: 'Facility',
    author: 'Campus Facilities',
    date: '2026-09-23',
    pinned: false,
    targetDepartment: 'all',
    targetYear: 'all'
  },
  {
    id: 7,
    title: 'CS Department: Capstone Project Proposals Due',
    body: 'All Computer Science students in their 3rd and 4th year must submit their capstone project proposals by October 18th. Templates are available on the CS portal. Proposals will be reviewed by faculty advisors.',
    priority: 'urgent',
    category: 'Academic',
    author: 'Dept. of Computer Science',
    date: '2026-09-30',
    pinned: true,
    targetDepartment: 'Computer Science',
    targetYear: '3rd Year'
  },
  {
    id: 8,
    title: 'Engineering Lab Safety Recertification',
    body: 'All Engineering students must complete mandatory lab safety recertification by October 12th. Online modules and in-person practical sessions are available. Failure to recertify will result in restricted lab access.',
    priority: 'important',
    category: 'Academic',
    author: 'Dept. of Engineering',
    date: '2026-09-29',
    pinned: false,
    targetDepartment: 'Engineering',
    targetYear: 'all'
  },
  {
    id: 9,
    title: 'Business Pitch Competition — $5,000 Prize',
    body: 'The annual Business Pitch Competition is accepting entries. First-year Business students are especially encouraged to participate. Form teams of 2-4 and register by October 25th.',
    priority: 'normal',
    category: 'Academic',
    author: 'Dept. of Business',
    date: '2026-09-28',
    pinned: false,
    targetDepartment: 'Business',
    targetYear: '1st Year'
  },
  {
    id: 10,
    title: 'CS Hackathon: Build for Good — Oct 18-19',
    body: 'Join the 48-hour hackathon organized by the CS department! Build solutions for social impact. Open to all CS students. Meals, mentorship, and prizes included.',
    priority: 'important',
    category: 'Academic',
    author: 'CS Student Association',
    date: '2026-10-01',
    pinned: false,
    targetDepartment: 'Computer Science',
    targetYear: 'all'
  },
  {
    id: 11,
    title: '3rd Year Internship Prep Workshop',
    body: 'Career Services is hosting an internship prep workshop specifically for 3rd year students. Topics include resume building, interview skills, and networking strategies. Seats are limited.',
    priority: 'normal',
    category: 'Career',
    author: 'Career Services',
    date: '2026-09-27',
    pinned: false,
    targetDepartment: 'all',
    targetYear: '3rd Year'
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
    attendees: 1240,
    targetDepartment: 'all',
    targetYear: 'all'
  },
  {
    id: 2,
    title: 'Guest Lecture: AI in Education',
    description: 'Dr. James Park from MIT discusses the transformative role of artificial intelligence in modern education.',
    date: '2026-10-05',
    time: '2:00 PM',
    location: 'Auditorium A, Building 3',
    category: 'Academic',
    attendees: 320,
    targetDepartment: 'Computer Science',
    targetYear: 'all'
  },
  {
    id: 3,
    title: 'Fall Career Fair 2026',
    description: 'Over 80 companies will be recruiting for internships and full-time positions. Bring your resume and dress professionally.',
    date: '2026-10-15',
    time: '10:00 AM – 4:00 PM',
    location: 'Student Center Grand Hall',
    category: 'Career',
    attendees: 890,
    targetDepartment: 'all',
    targetYear: 'all'
  },
  {
    id: 4,
    title: 'Cultural Night: Around the World',
    description: 'Celebrate diversity with performances, food, and exhibitions from student cultural organizations.',
    date: '2026-10-20',
    time: '6:00 PM',
    location: 'Campus Green',
    category: 'Student Life',
    attendees: 560,
    targetDepartment: 'all',
    targetYear: 'all'
  },
  {
    id: 5,
    title: 'Midterm Study Marathon',
    description: 'Join fellow students for an all-night study session with free coffee, snacks, and tutoring support.',
    date: '2026-10-22',
    time: '8:00 PM – 6:00 AM',
    location: 'University Library',
    category: 'Academic',
    attendees: 210,
    targetDepartment: 'all',
    targetYear: 'all'
  },
  {
    id: 6,
    title: 'CS Senior Project Showcase',
    description: 'Computer Science 3rd and 4th year students present their capstone projects. Come see cutting-edge demos in AI, web dev, cybersecurity, and more!',
    date: '2026-11-05',
    time: '1:00 PM – 5:00 PM',
    location: 'CS Building, Room 301',
    category: 'Academic',
    attendees: 145,
    targetDepartment: 'Computer Science',
    targetYear: '3rd Year'
  },
  {
    id: 7,
    title: 'Engineering Design Sprint',
    description: 'A 2-day rapid prototyping event for Engineering students. Work in teams to solve real-world engineering challenges.',
    date: '2026-10-25',
    time: '9:00 AM – 5:00 PM',
    location: 'Engineering Lab Complex',
    category: 'Academic',
    attendees: 85,
    targetDepartment: 'Engineering',
    targetYear: 'all'
  },
  {
    id: 8,
    title: 'First Year Orientation Social',
    description: 'A fun mixer event for all first-year students to meet classmates, join clubs, and explore campus resources.',
    date: '2026-10-08',
    time: '4:00 PM – 7:00 PM',
    location: 'Student Center Lounge',
    category: 'Student Life',
    attendees: 320,
    targetDepartment: 'all',
    targetYear: '1st Year'
  },
  {
    id: 9,
    title: 'Tech Industry Panel: Careers in CS',
    description: 'Hear from industry leaders at Google, Microsoft, and startups about career paths in Computer Science. Q&A session included.',
    date: '2026-10-12',
    time: '3:00 PM – 5:00 PM',
    location: 'Auditorium B, CS Building',
    category: 'Career',
    attendees: 210,
    targetDepartment: 'Computer Science',
    targetYear: '3rd Year'
  }
];

const DEFAULT_NOTIFICATIONS = [
  { id: 1, type: 'info', icon: '📢', title: 'New Announcement Posted', message: 'Fall 2026 Semester Registration is now open.', time: '2 minutes ago', read: false, actionType: 'announcement', actionId: 1 },
  { id: 2, type: 'success', icon: '✅', title: 'Assignment Submitted', message: 'Your CS301 assignment has been submitted successfully.', time: '1 hour ago', read: false },
  { id: 3, type: 'warning', icon: '⚠️', title: 'Payment Reminder', message: 'Tuition payment for Fall semester is due October 1st.', time: '3 hours ago', read: false },
  { id: 4, type: 'alert', icon: '🔴', title: 'Emergency Drill', message: 'Campus-wide emergency drill scheduled for Oct 3rd at 10 AM.', time: '5 hours ago', read: true },
  { id: 5, type: 'info', icon: '📅', title: 'Event Reminder', message: 'Guest Lecture: AI in Education starts tomorrow at 2 PM.', time: '1 day ago', read: true, actionType: 'event', actionId: 2 },
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
    const initial = this._getInitialUsers();
    const stored = localStorage.getItem(this._usersKey);
    if (stored) {
      try {
        const users = JSON.parse(stored);
        if (Array.isArray(users) && users.length > 0) {
          let changed = false;
          initial.forEach(seed => {
            const exists = users.some(u => u.id === seed.id || (u.email && u.email.toLowerCase() === seed.email.toLowerCase()));
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

// ─── Notifications Store ───
const NotificationsStore = {
  _baseKey: 'campusnotify_notifications',

  _getKey() {
    const user = Auth.getUser();
    return user && user.id ? `${this._baseKey}_${user.id}` : this._baseKey;
  },

  _readAll() {
    const key = this._getKey();
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    const fallback = localStorage.getItem(this._baseKey);
    if (fallback) {
      try {
        const parsed = JSON.parse(fallback);
        if (Array.isArray(parsed)) {
          this.save(parsed);
          return parsed;
        }
      } catch (e) {}
    }
    const initial = JSON.parse(JSON.stringify(DEFAULT_NOTIFICATIONS));
    this.save(initial);
    return initial;
  },

  getAll() {
    return this._readAll().filter(item => this._isVisibleToCurrentUser(item));
  },

  save(notifications) {
    const key = this._getKey();
    localStorage.setItem(key, JSON.stringify(notifications));
  },

  getById(id) {
    return this.getAll().find(n => n.id === id);
  },

  getUnreadCount() {
    return this.getAll().filter(n => !n.read).length;
  },

  markAsRead(id) {
    const all = this._readAll();
    const notif = all.find(n => n.id === id);
    if (notif) {
      notif.read = true;
      this.save(all);
    }
    return this.getAll();
  },

  markAllAsRead() {
    const all = this._readAll();
    all.forEach(n => { n.read = true; });
    this.save(all);
    return this.getAll();
  },

  _targetingFrom(notif) {
    return {
      target: notif.target || 'all',
      department: notif.department || '',
      year: notif.year || 'all',
      studentIds: Array.isArray(notif.studentIds) ? notif.studentIds : []
    };
  },

  _matchesTarget(user, targeting) {
    if (!user) return false;
    const ids = targeting.studentIds || [];
    if (ids.length > 0) {
      return ids.includes(user.id);
    }
    const target = targeting.target || 'all';
    if (target === 'all') return true;
    if (target === 'faculty') return user.role === 'admin';
    if (target === 'students') {
      if (user.role !== 'student') return false;
      const dept = targeting.department || '';
      const year = targeting.year || 'all';
      if (dept && String(user.department || '').toLowerCase() !== String(dept).toLowerCase()) {
        return false;
      }
      if (year && year !== 'all' && String(user.year || '') !== year) {
        return false;
      }
      return true;
    }
    return true;
  },

  _isVisibleToCurrentUser(item) {
    const user = Auth.getUser();
    if (!user) return true;
    if (user.role === 'admin') return true;
    return this._matchesTarget(user, this._targetingFrom(item));
  },

  add(notif) {
    const targeting = this._targetingFrom(notif);
    const item = {
      id: Date.now(),
      type: notif.type || 'info',
      icon: notif.icon || '📢',
      title: notif.title || 'Notification',
      message: notif.message || '',
      time: notif.time || 'Just now',
      read: false,
      target: targeting.target,
      department: targeting.department,
      year: targeting.year,
      studentIds: targeting.studentIds
    };

    const all = this._readAll();
    all.unshift(item);
    this.save(all);

    const current = Auth.getUser();
    const users = typeof Auth.getRegisteredUsers === 'function' ? Auth.getRegisteredUsers() : [];
    const recipientIds = new Set(
      users.filter(u => this._matchesTarget(u, targeting)).map(u => u.id)
    );
    const broadcastAll = targeting.studentIds.length === 0 && targeting.target === 'all';

    try {
      if (broadcastAll) {
        const baseRaw = localStorage.getItem(this._baseKey);
        let baseList = baseRaw ? JSON.parse(baseRaw) : [];
        if (Array.isArray(baseList)) {
          baseList = baseList.filter(n => n.id !== item.id);
          baseList.unshift({ ...item });
          localStorage.setItem(this._baseKey, JSON.stringify(baseList));
        }
      }

      const prefix = this._baseKey + '_';
      const currentKey = this._getKey();
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(prefix) && k !== currentKey) keys.push(k);
      }

      keys.forEach(k => {
        const uid = k.slice(prefix.length);
        const user = users.find(u => u.id === uid);
        if (!this._matchesTarget(user, targeting)) return;
        let userNotifs = JSON.parse(localStorage.getItem(k) || '[]');
        if (Array.isArray(userNotifs)) {
          userNotifs = userNotifs.filter(n => n.id !== item.id);
          userNotifs.unshift({ ...item, read: false });
          localStorage.setItem(k, JSON.stringify(userNotifs));
        }
      });

      recipientIds.forEach(id => {
        if (current && id === current.id) return;
        const key = prefix + id;
        if (keys.includes(key)) return;
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        const list = Array.isArray(existing) ? existing.filter(n => n.id !== item.id) : [];
        list.unshift({ ...item, read: false });
        localStorage.setItem(key, JSON.stringify(list));
      });
    } catch (e) {}

    return item;
  },

  delete(id) {
    const all = this._readAll().filter(n => n.id !== id);
    this.save(all);
    try {
      const baseRaw = localStorage.getItem(this._baseKey);
      if (baseRaw) {
        let baseList = JSON.parse(baseRaw);
        if (Array.isArray(baseList)) {
          baseList = baseList.filter(n => n.id !== id);
          localStorage.setItem(this._baseKey, JSON.stringify(baseList));
        }
      }
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(this._baseKey + '_') && k !== this._getKey()) {
          let userNotifs = JSON.parse(localStorage.getItem(k) || '[]');
          if (Array.isArray(userNotifs)) {
            userNotifs = userNotifs.filter(n => n.id !== id);
            localStorage.setItem(k, JSON.stringify(userNotifs));
          }
        }
      }
    } catch (e) {}
    return all;
  },

  updateSidebarBadge() {
    const navTarget = document.getElementById('nav-campus-hub') || document.getElementById('nav-events');
    if (!navTarget) return;
    const unread = this.getUnreadCount();
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
  }
};

// ─── Sidebar Component ───
function renderSidebar(activePage) {
  const user = Auth.getUser();
  const role = Auth.getRole();
  if (!user) return '';

  const unreadCount = NotificationsStore.getUnreadCount();

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
  /**
   * Check if an item is relevant to the given student's department and year.
   * An item matches if:
   *   - Its targetDepartment matches the student's department OR is 'all'/empty
   *   - AND its targetYear matches the student's year OR is 'all'/empty
   * BUT: items where BOTH targetDepartment and targetYear are 'all' are campus-wide
   *       and belong in Campus Hub, NOT For You.
   * For You only shows items that are specifically targeted (at least one field is not 'all').
   */
  isForYou(item, user) {
    if (!user || user.role === 'admin') return false;

    const dept = (item.targetDepartment || 'all').toLowerCase();
    const year = (item.targetYear || 'all').toLowerCase();

    // Both 'all' = campus-wide, not personalized
    if (dept === 'all' && year === 'all') return false;

    const userDept = (user.department || '').toLowerCase();
    const userYear = (user.year || '').toLowerCase();

    const deptMatch = dept === 'all' || dept === userDept;
    const yearMatch = year === 'all' || year === userYear;

    return deptMatch && yearMatch;
  },

  /**
   * Check if item is campus-wide (for Campus Hub general feed).
   */
  isCampusWide(item) {
    const dept = (item.targetDepartment || 'all').toLowerCase();
    const year = (item.targetYear || 'all').toLowerCase();
    return dept === 'all' && year === 'all';
  },

  /**
   * Build the For You feed items from announcements, events, and notifications.
   */
  buildFeed(user) {
    if (!user || user.role === 'admin') return [];

    const announcements = AnnouncementsStore.getAll();
    const events = EventsStore.getAll();
    const notifications = NotificationsStore.getAll();
    const feed = [];

    announcements.forEach(a => {
      if (this.isForYou(a, user)) {
        feed.push({
          feedType: 'announcement', id: a.id, title: a.title, body: a.body,
          category: a.category, priority: a.priority, pinned: a.pinned,
          author: a.author, date: a.date,
          targetDepartment: a.targetDepartment, targetYear: a.targetYear,
          sortDate: new Date(a.date + 'T00:00:00').getTime(),
          sortPriority: a.pinned ? 0 : 1,
          data: a
        });
      }
    });

    events.forEach(e => {
      if (this.isForYou(e, user)) {
        feed.push({
          feedType: 'event', id: e.id, title: e.title, body: e.description,
          category: e.category, date: e.date, time: e.time,
          location: e.location, attendees: e.attendees || 0,
          targetDepartment: e.targetDepartment, targetYear: e.targetYear,
          sortDate: new Date(e.date + 'T00:00:00').getTime(),
          sortPriority: 1,
          data: e
        });
      }
    });

    // Notifications that are targeted to this user's department/year
    notifications.forEach(n => {
      const targeting = {
        targetDepartment: n.department || 'all',
        targetYear: n.year || 'all'
      };
      if (this.isForYou(targeting, user)) {
        feed.push({
          feedType: 'notification', id: n.id, title: n.title, body: n.message,
          category: null, notifType: n.type, icon: n.icon,
          time: n.time, read: n.read,
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

  /**
   * Get a targeting label for display (e.g., "Computer Science · 3rd Year")
   */
  getTargetLabel(item) {
    const parts = [];
    const dept = item.targetDepartment || item.data?.targetDepartment || 'all';
    const year = item.targetYear || item.data?.targetYear || 'all';
    if (dept && dept.toLowerCase() !== 'all') parts.push(dept);
    if (year && year.toLowerCase() !== 'all') parts.push(year);
    return parts.join(' · ');
  }
};

if (typeof window !== 'undefined') {
  window.ForYouFeed = ForYouFeed;
}
