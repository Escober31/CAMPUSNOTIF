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
    target: 'students',
    department: 'all',
    year: '3rd Year',
    targetDepartment: 'all',
    targetYear: '3rd Year'
  },
  {
    id: 12,
    title: 'Law School Moot Court Registration',
    body: 'Registration is now open for the Annual Campus Moot Court Competition. All Law students are eligible to form two-person teams. Information sessions will be held this Thursday in Moot Court Room 102.',
    priority: 'important',
    category: 'Academic',
    author: 'Faculty of Law',
    date: '2026-10-01',
    pinned: false,
    target: 'students',
    department: 'Law',
    year: 'all',
    targetDepartment: 'Law',
    targetYear: 'all'
  },
  {
    id: 13,
    title: '1st Year Law Case Briefing Workshop',
    body: 'Mandatory workshop for all 1st Year Law students covering IRAC analysis, case briefing methodologies, and preparing for legal research exams. Led by Senior Law Faculty.',
    priority: 'urgent',
    category: 'Academic',
    author: 'Faculty of Law',
    date: '2026-10-02',
    pinned: true,
    target: 'students',
    department: 'Law',
    year: '1st Year',
    targetDepartment: 'Law',
    targetYear: '1st Year'
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
    target: 'all',
    department: 'all',
    year: 'all',
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
    target: 'students',
    department: 'Computer Science',
    year: 'all',
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
    target: 'all',
    department: 'all',
    year: 'all',
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
    target: 'all',
    department: 'all',
    year: 'all',
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
    target: 'all',
    department: 'all',
    year: 'all',
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
    target: 'students',
    department: 'Computer Science',
    year: '3rd Year',
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
    target: 'students',
    department: 'Engineering',
    year: 'all',
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
    target: 'students',
    department: 'all',
    year: '1st Year',
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
    target: 'students',
    department: 'Computer Science',
    year: '3rd Year',
    targetDepartment: 'Computer Science',
    targetYear: '3rd Year'
  },
  {
    id: 10,
    title: 'Law Review Annual Symposium',
    description: 'Join constitutional law scholars and legal practitioners for a panel discussion on modern data privacy and student digital rights.',
    date: '2026-10-28',
    time: '2:00 PM – 5:00 PM',
    location: 'Law Auditorium, Building 4',
    category: 'Academic',
    attendees: 160,
    target: 'students',
    department: 'Law',
    year: 'all',
    targetDepartment: 'Law',
    targetYear: 'all'
  },
  {
    id: 11,
    title: '1st Year Law Legal Research Bootcamp',
    description: 'Hands-on training session on Westlaw, LexisNexis, and appellate court case research for all 1st Year Law students.',
    date: '2026-10-18',
    time: '10:00 AM – 1:00 PM',
    location: 'Law Library Lab 2',
    category: 'Academic',
    attendees: 75,
    target: 'students',
    department: 'Law',
    year: '1st Year',
    targetDepartment: 'Law',
    targetYear: '1st Year'
  }
];

const DEFAULT_NOTIFICATIONS = [
  { id: 1, type: 'info', icon: '📢', title: 'New Announcement Posted', message: 'Fall 2026 Semester Registration is now open.', time: '2 minutes ago', read: false, target: 'all', department: 'all', year: 'all', targetDepartment: 'all', targetYear: 'all', actionType: 'announcement', actionId: 1 },
  { id: 2, type: 'success', icon: '✅', title: 'Assignment Submitted', message: 'Your CS301 assignment has been submitted successfully.', time: '1 hour ago', read: false, target: 'students', department: 'Computer Science', year: '3rd Year', targetDepartment: 'Computer Science', targetYear: '3rd Year' },
  { id: 3, type: 'warning', icon: '⚠️', title: 'Payment Reminder', message: 'Tuition payment for Fall semester is due October 1st.', time: '3 hours ago', read: false, target: 'all', department: 'all', year: 'all', targetDepartment: 'all', targetYear: 'all' },
  { id: 4, type: 'alert', icon: '🔴', title: 'Emergency Drill', message: 'Campus-wide emergency drill scheduled for Oct 3rd at 10 AM.', time: '5 hours ago', read: true, target: 'all', department: 'all', year: 'all', targetDepartment: 'all', targetYear: 'all' },
  { id: 5, type: 'info', icon: '📅', title: 'Event Reminder', message: 'Guest Lecture: AI in Education starts tomorrow at 2 PM.', time: '1 day ago', read: true, target: 'students', department: 'Computer Science', year: 'all', targetDepartment: 'Computer Science', targetYear: 'all', actionType: 'event', actionId: 2 },
  { id: 6, type: 'success', icon: '🎉', title: 'Scholarship Awarded', message: 'Congratulations! You\'ve been awarded the Dean\'s Merit Scholarship.', time: '2 days ago', read: true, target: 'all', department: 'all', year: 'all', targetDepartment: 'all', targetYear: 'all' },
  { id: 7, type: 'info', icon: '⚖️', title: '1st Year Law Briefing Session', message: 'Case Briefing Workshop starts tomorrow at 10 AM in Room 102.', time: '1 hour ago', read: false, target: 'students', department: 'Law', year: '1st Year', targetDepartment: 'Law', targetYear: '1st Year', actionType: 'announcement', actionId: 13 },
  { id: 8, type: 'info', icon: '⚖️', title: 'Law Moot Court Notice', message: 'Moot Court registration forms are now available for all Law students.', time: '3 hours ago', read: false, target: 'students', department: 'Law', year: 'all', targetDepartment: 'Law', targetYear: 'all', actionType: 'announcement', actionId: 12 }
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
          parsed = parsed.filter(item => !deletedIds.includes(String(item.id)));
          let changed = false;
          ANNOUNCEMENTS.forEach(seed => {
            if (!deletedIds.includes(String(seed.id)) && !parsed.some(item => String(item.id) === String(seed.id) || item.title === seed.title)) {
              parsed.push(seed);
              changed = true;
            }
          });
          if (changed) this.save(parsed);
          return parsed;
        }
      } catch (e) {}
    }
    const initial = ANNOUNCEMENTS.filter(seed => !deletedIds.includes(String(seed.id)));
    this.save(initial);
    return initial;
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
          parsed = parsed.filter(item => !deletedIds.includes(String(item.id)));
          let changed = false;
          EVENTS.forEach(seed => {
            if (!deletedIds.includes(String(seed.id)) && !parsed.some(item => String(item.id) === String(seed.id) || item.title === seed.title)) {
              parsed.push(seed);
              changed = true;
            }
          });
          if (changed) this.save(parsed);
          return parsed;
        }
      } catch (e) {}
    }
    const initial = EVENTS.filter(seed => !deletedIds.includes(String(seed.id)));
    this.save(initial);
    return initial;
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
          parsed = parsed.filter(item => !deletedIds.includes(String(item.id)));
          let changed = false;
          DEFAULT_NOTIFICATIONS.forEach(seed => {
            if (!deletedIds.includes(String(seed.id)) && !parsed.some(item => String(item.id) === String(seed.id) || item.title === seed.title)) {
              parsed.push(seed);
              changed = true;
            }
          });
          if (changed) this._saveMaster(parsed);
          return parsed;
        }
      }
    } catch (e) {}
    const initial = DEFAULT_NOTIFICATIONS.filter(seed => !deletedIds.includes(String(seed.id)));
    this._saveMaster(initial);
    return initial;
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

if (typeof window !== 'undefined') {
  window.ForYouFeed = ForYouFeed;
}
