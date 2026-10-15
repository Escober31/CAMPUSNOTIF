/* ========================================
   CampusNotify — Phase 1 Interaction Stores
   Modular localStorage stores for:
   - Saved/Bookmarked items
   - Event interest tracking
   - Announcement acknowledgements
   - Event/update reminders
   ======================================== */

// ─── Saved/Bookmark Store ───
const SavedStore = {
  _key: 'campusnotify_saved_items',

  _getUserKey() {
    const user = Auth.getUser();
    return user && user.id ? `${this._key}_${user.id}` : this._key;
  },

  getAll() {
    try {
      const stored = localStorage.getItem(this._getUserKey());
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) { /* corrupted data fallback */ }
    return [];
  },

  _save(items) {
    try {
      localStorage.setItem(this._getUserKey(), JSON.stringify(items));
    } catch (e) { /* quota exceeded fallback */ }
  },

  add(type, id) {
    if (this.isSaved(type, id)) return this.getAll();
    const all = this.getAll();
    all.unshift({ type, id, savedAt: new Date().toISOString() });
    this._save(all);
    return all;
  },

  remove(type, id) {
    const all = this.getAll().filter(item => !(item.type === type && item.id === id));
    this._save(all);
    return all;
  },

  isSaved(type, id) {
    return this.getAll().some(item => item.type === type && item.id === id);
  },

  getByType(type) {
    return this.getAll().filter(item => item.type === type);
  },

  count() {
    return this.getAll().length;
  }
};

// ─── Event Interest Store ───
const EventInterestStore = {
  _key: 'campusnotify_event_interests',

  _getUserKey() {
    const user = Auth.getUser();
    return user && user.id ? `${this._key}_${user.id}` : this._key;
  },

  getAll() {
    try {
      const stored = localStorage.getItem(this._getUserKey());
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  },

  _save(items) {
    try {
      localStorage.setItem(this._getUserKey(), JSON.stringify(items));
    } catch (e) {}
  },

  toggle(eventId) {
    const all = this.getAll();
    const idx = all.findIndex(item => item.eventId === eventId);
    if (idx !== -1) {
      all.splice(idx, 1);
      this._save(all);
      return { interested: false, items: all };
    }
    all.unshift({ eventId, interestedAt: new Date().toISOString() });
    this._save(all);
    return { interested: true, items: all };
  },

  isInterested(eventId) {
    return this.getAll().some(item => item.eventId === eventId);
  },

  getInterestedEvents() {
    return this.getAll();
  },

  count() {
    return this.getAll().length;
  }
};

// ─── Acknowledgement Store ───
const AcknowledgementStore = {
  _key: 'campusnotify_acknowledgements',

  _getUserKey() {
    const user = Auth.getUser();
    return user && user.id ? `${this._key}_${user.id}` : this._key;
  },

  getAll() {
    try {
      const stored = localStorage.getItem(this._getUserKey());
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  },

  _save(items) {
    try {
      localStorage.setItem(this._getUserKey(), JSON.stringify(items));
    } catch (e) {}
  },

  acknowledge(announcementId) {
    if (this.isAcknowledged(announcementId)) return this.getAll();
    const all = this.getAll();
    all.unshift({ announcementId, acknowledgedAt: new Date().toISOString() });
    this._save(all);
    return all;
  },

  isAcknowledged(announcementId) {
    return this.getAll().some(item => item.announcementId === announcementId);
  },

  count() {
    return this.getAll().length;
  }
};

// ─── Reminder Store ───
const ReminderStore = {
  _key: 'campusnotify_reminders',

  _getUserKey() {
    const user = Auth.getUser();
    return user && user.id ? `${this._key}_${user.id}` : this._key;
  },

  getAll() {
    try {
      const stored = localStorage.getItem(this._getUserKey());
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  },

  _save(items) {
    try {
      localStorage.setItem(this._getUserKey(), JSON.stringify(items));
    } catch (e) {}
  },

  set(type, id, timing) {
    const all = this.getAll();
    const existingIdx = all.findIndex(item => item.type === type && item.id === id);
    const reminder = { type, id, timing, setAt: new Date().toISOString() };
    if (existingIdx !== -1) {
      all[existingIdx] = reminder;
    } else {
      all.unshift(reminder);
    }
    this._save(all);
    return all;
  },

  remove(type, id) {
    const all = this.getAll().filter(item => !(item.type === type && item.id === id));
    this._save(all);
    return all;
  },

  getReminder(type, id) {
    return this.getAll().find(item => item.type === type && item.id === id) || null;
  },

  hasReminder(type, id) {
    return !!this.getReminder(type, id);
  },

  getTimingLabel(timing) {
    const labels = { '10min': '10 minutes before', '1hour': '1 hour before', '1day': '1 day before' };
    return labels[timing] || timing;
  },

  count() {
    return this.getAll().length;
  }
};

// ─── Campus Polls Store ───
const PollsStore = {
  _key: 'campusnotify_polls',
  _deletedKey: 'campusnotify_polls_deleted',

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

  _getSeedPolls() {
    return [];
  },

  getAll() {
    const deletedIds = this._getDeletedIds();
    const stored = localStorage.getItem(this._key);
    if (stored !== null) {
      try {
        let parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const checkDemo = (typeof window !== 'undefined' && window.isDemoCard) ? window.isDemoCard : (p => Number(p.id) === 1);
          const filtered = parsed.filter(p => !deletedIds.includes(String(p.id)) && !checkDemo(p));
          if (filtered.length !== parsed.length) {
            this.save(filtered);
          }
          return filtered;
        }
      } catch (e) {}
    }
    return [];
  },

  save(polls) {
    try {
      localStorage.setItem(this._key, JSON.stringify(polls));
    } catch (e) {}
  },

  getById(id) {
    return this.getAll().find(p => String(p.id) === String(id)) || null;
  },

  getForHub() {
    return this.getAll();
  },

  isClosed(poll) {
    if (!poll) return true;
    if (poll.status === 'closed' || poll.status === 'inactive') return true;
    if (poll.closingDate) {
      const parts = String(poll.closingDate).split('-');
      if (parts.length === 3) {
        const closeDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10), 23, 59, 59, 999);
        if (new Date() > closeDate) return true;
      }
    }
    return false;
  },

  hasUserVoted(pollId, userId) {
    if (!userId) return false;
    const poll = this.getById(pollId);
    if (!poll || !poll.voters) return false;
    return !!poll.voters[userId];
  },

  getUserVote(pollId, userId) {
    if (!userId) return null;
    const poll = this.getById(pollId);
    if (!poll || !poll.voters) return null;
    return poll.voters[userId] || null;
  },

  getTotalVotes(poll) {
    if (!poll || !Array.isArray(poll.choices)) return 0;
    return poll.choices.reduce((sum, c) => sum + (Number(c.votes) || 0), 0);
  },

  add({ question, description, category, closingDate, choices }) {
    const all = this.getAll();
    const id = Date.now();
    const user = (typeof Auth !== 'undefined' && Auth.getUser) ? Auth.getUser() : null;

    const formattedChoices = (choices || []).map((ch, idx) => ({
      id: `c_${idx + 1}_${id}`,
      text: (typeof ch === 'string' ? ch : ch.text || '').trim(),
      votes: 0
    })).filter(c => c.text.length > 0);

    const newPoll = {
      id,
      question: question.trim(),
      description: description ? description.trim() : 'Help us decide on the next event for Foundation Week. Choose one option below.',
      category: category || 'Student Life',
      closingDate: closingDate || '2026-10-20',
      createdAt: new Date().toISOString().split('T')[0],
      author: user?.name || 'Jordan Miles',
      status: 'active',
      choices: formattedChoices,
      voters: {}
    };

    all.unshift(newPoll);
    this.save(all);
    return newPoll;
  },

  update(id, data) {
    const all = this.getAll();
    const idx = all.findIndex(p => String(p.id) === String(id));
    if (idx === -1) return null;

    const existing = all[idx];
    let updatedChoices = existing.choices;
    if (Array.isArray(data.choices)) {
      updatedChoices = data.choices.map((ch, i) => {
        const text = typeof ch === 'string' ? ch.trim() : (ch.text || '').trim();
        const chId = typeof ch === 'object' && ch.id ? ch.id : `c_${i + 1}_${Date.now()}`;
        const existingChoice = existing.choices.find(c => c.id === chId || c.text === text);
        return {
          id: chId,
          text: text,
          votes: existingChoice ? existingChoice.votes : 0
        };
      }).filter(c => c.text.length > 0);
    }

    all[idx] = {
      ...existing,
      ...data,
      choices: updatedChoices,
      id: existing.id,
      voters: existing.voters || {}
    };

    this.save(all);
    return all[idx];
  },

  delete(id) {
    if (id === null || id === undefined) return this.getAll();
    this._addDeletedId(id);
    const all = this.getAll().filter(p => String(p.id) !== String(id));
    this.save(all);
    return all;
  },

  vote(pollId, choiceId, user) {
    if (!user || !user.id) {
      return { success: false, message: 'You must be logged in to vote.' };
    }

    const all = this.getAll();
    const idx = all.findIndex(p => String(p.id) === String(pollId));
    if (idx === -1) {
      return { success: false, message: 'Poll not found.' };
    }

    const poll = all[idx];

    // Check if poll is closed
    if (this.isClosed(poll)) {
      return { success: false, message: 'This poll is closed. Voting has ended.' };
    }

    // Check if user already voted
    if (poll.voters && (poll.voters[user.id] || (user.email && poll.voters[user.email]))) {
      return { success: false, message: 'You have already voted on this poll.' };
    }

    // Find choice
    const choice = poll.choices.find(c => String(c.id) === String(choiceId));
    if (!choice) {
      return { success: false, message: 'Selected choice not found.' };
    }

    // Record vote
    if (!poll.voters) poll.voters = {};
    poll.voters[user.id] = choiceId;
    if (user.email) poll.voters[user.email] = choiceId;
    choice.votes = (Number(choice.votes) || 0) + 1;

    all[idx] = poll;
    this.save(all);

    return {
      success: true,
      poll,
      choiceId,
      choiceText: choice.text
    };
  }
};

// ─── Game Skins & Displays Catalog ───
const GameSkinsCatalog = {
  chess: [
    {
      id: 'chess_default',
      name: 'Classic Slate',
      desc: 'The original refined academy board with slate and charcoal squares.',
      icon: '♟️',
      themeClass: 'skin-slate',
      preview: { light: '#cbd5e1', dark: '#475569', border: '#6366f1' },
      unlockedBy: 'Default'
    },
    {
      id: 'chess_cyber',
      name: 'Neon Cyberpunk',
      desc: 'Glowing electric cyan and magenta cyber-matrix board with neon aura.',
      icon: '⚡',
      themeClass: 'skin-cyber',
      preview: { light: '#132f38', dark: '#0b1a24', border: '#00f5ff' },
      unlockedBy: 'Day 1 Daily Login'
    },
    {
      id: 'chess_emerald',
      name: 'Campus Emerald',
      desc: 'Lush imperial jade and emerald tones with polished ivory accents.',
      icon: '🌲',
      themeClass: 'skin-emerald',
      preview: { light: '#a7f3d0', dark: '#065f46', border: '#10b981' },
      unlockedBy: 'Day 6 Daily Login'
    },
    {
      id: 'chess_gold',
      name: 'Imperial Gold & Obsidian',
      desc: 'Gilded 24k gold leaf and polished obsidian marble tournament board.',
      icon: '👑',
      themeClass: 'skin-gold',
      preview: { light: '#fde047', dark: '#18181b', border: '#eab308' },
      unlockedBy: 'Day 7 Grand Pack'
    }
  ],

  memory: [
    {
      id: 'memory_default',
      name: 'Campus Academics',
      desc: 'Classic study items: books, diplomas, microscopes, and campus halls.',
      icon: '🎓',
      cardBackClass: 'cardback-default',
      cardBackIcon: '❓',
      emojis: ['📚', '🎓', '🔬', '💻', '🏛️', '🎨', '⚽', '🎵'],
      unlockedBy: 'Default'
    },
    {
      id: 'memory_retro',
      name: 'Retro 8-Bit Arcade',
      desc: 'Arcade cabinet nostalgic sprites: joysticks, invaders, gems, and powerups.',
      icon: '👾',
      cardBackClass: 'cardback-retro',
      cardBackIcon: '👾',
      emojis: ['🕹️', '👾', '🍄', '⭐', '🗡️', '🛡️', '💎', '🪙'],
      unlockedBy: 'Day 2 Daily Login'
    },
    {
      id: 'memory_pets',
      name: 'Campus Animal Buddies',
      desc: 'Adorable campus mascot pets: puppies, kittens, pandas, and foxes.',
      icon: '🐾',
      cardBackClass: 'cardback-pets',
      cardBackIcon: '🐾',
      emojis: ['🐱', '🐶', '🦊', '🐼', '🐨', '🐯', '🦁', '🐵'],
      unlockedBy: 'Day 6 Daily Login'
    },
    {
      id: 'memory_cyber',
      name: 'Sci-Fi Cosmos',
      desc: 'Interstellar robots, rockets, galaxies, and futuristic AI drones.',
      icon: '🚀',
      cardBackClass: 'cardback-cyber',
      cardBackIcon: '⚡',
      emojis: ['🤖', '🚀', '🛸', '🌌', '🔋', '🛰️', '📡', '🧬'],
      unlockedBy: 'Day 7 Grand Pack'
    }
  ],

  typing: [
    {
      id: 'typing_default',
      name: 'Dark Studio',
      desc: 'Clean dark slate backdrop with emerald typing speed indicators.',
      icon: '⌨️',
      themeClass: 'skin-typing-default',
      previewColor: '#34d399',
      unlockedBy: 'Default'
    },
    {
      id: 'typing_matrix',
      name: 'Matrix Phosphor Terminal',
      desc: 'Glowing green CRT hacker scanline monitor with cyber terminal text.',
      icon: '💻',
      themeClass: 'skin-typing-matrix',
      previewColor: '#22c55e',
      unlockedBy: 'Day 3 Daily Login'
    },
    {
      id: 'typing_vaporwave',
      name: 'Cyberpunk Vaporwave',
      desc: 'Synthwave neon pink and cyan text glow with retro grid aesthetics.',
      icon: '🌆',
      themeClass: 'skin-typing-vaporwave',
      previewColor: '#f43f5e',
      unlockedBy: 'Day 7 Grand Pack'
    },
    {
      id: 'typing_sunset',
      name: 'Golden Sunset',
      desc: 'Warm amber and radiant copper glow for relaxed marathon typing.',
      icon: '🌅',
      themeClass: 'skin-typing-sunset',
      previewColor: '#fbbf24',
      unlockedBy: 'Day 5 Bonus'
    }
  ],

  sudoku: [
    {
      id: 'sudoku_default',
      name: 'Indigo Modern',
      desc: 'Refined indigo grid dividers with electric blue original clue numbers.',
      icon: '🔢',
      themeClass: 'skin-sudoku-default',
      accentColor: '#6366f1',
      unlockedBy: 'Default'
    },
    {
      id: 'sudoku_amethyst',
      name: 'Midnight Amethyst',
      desc: 'Rich velvet violet grid with glowing lavender numerals and neon highlights.',
      icon: '🔮',
      themeClass: 'skin-sudoku-amethyst',
      accentColor: '#a855f7',
      unlockedBy: 'Day 4 Daily Login'
    },
    {
      id: 'sudoku_cyber',
      name: 'Electric Cyber Grid',
      desc: 'Futuristic high-tech sci-fi cyan matrix with luminous digits.',
      icon: '🌐',
      themeClass: 'skin-sudoku-cyber',
      accentColor: '#06b6d4',
      unlockedBy: 'Day 7 Grand Pack'
    },
    {
      id: 'sudoku_gold',
      name: 'Golden Dynasty',
      desc: 'Imperial golden grid frame with warm topaz numerals.',
      icon: '✨',
      themeClass: 'skin-sudoku-gold',
      accentColor: '#eab308',
      unlockedBy: 'Day 6 Bonus'
    }
  ],

  billiards: [
    {
      id: 'billiards_default',
      name: 'Classic Green Baize',
      desc: 'Championship tournament green wool felt with rich oak wood cushions.',
      icon: '🎱',
      feltBg: '#0f4c3a',
      feltCenter: '#15614a',
      feltEdge: '#0c382b',
      railColor: '#26170d',
      cueBody: '#d97706',
      cueTip: '#38bdf8',
      unlockedBy: 'Default'
    },
    {
      id: 'billiards_midnight',
      name: 'Midnight Blue Velvet',
      desc: 'Deep royal sapphire felt with sleek dark carbon fiber rails & neon cue.',
      icon: '🌊',
      feltBg: '#0c2340',
      feltCenter: '#1e3a8a',
      feltEdge: '#08172e',
      railColor: '#0f172a',
      cueBody: '#38bdf8',
      cueTip: '#93c5fd',
      unlockedBy: 'Day 5 Daily Login'
    },
    {
      id: 'billiards_crimson',
      name: 'Royal Crimson Lounge',
      desc: 'Luxurious ruby red salon felt with dark cherry mahogany rails.',
      icon: '🍷',
      feltBg: '#3b0808',
      feltCenter: '#7f1d1d',
      feltEdge: '#240404',
      railColor: '#1c0505',
      cueBody: '#f59e0b',
      cueTip: '#fbbf24',
      unlockedBy: 'Day 3 Bonus'
    },
    {
      id: 'billiards_neon',
      name: 'Cyber Ultraviolet Table',
      desc: 'Dark ultraviolet neon felt with holographic cushions & laser cue stick.',
      icon: '🌌',
      feltBg: '#180828',
      feltCenter: '#3b0764',
      feltEdge: '#0d0317',
      railColor: '#0a0512',
      cueBody: '#ec4899',
      cueTip: '#22d3ee',
      unlockedBy: 'Day 7 Grand Pack'
    }
  ]
};

// ─── Student Daily Login Rewards Store ───
const DailyLoginStore = {
  _baseKey: 'campusnotify_student_daily_rewards',

  _REWARDS_SCHEDULE: [
    {
      day: 1,
      badge: 'Day 1',
      title: 'Neon Cyberpunk Chess Skin',
      game: 'chess',
      skinId: 'chess_cyber',
      skinName: 'Neon Cyberpunk Chess',
      icon: '♟️',
      points: 100,
      description: 'Unlock glowing electric cyan & magenta chessboard and holographic pieces!'
    },
    {
      day: 2,
      badge: 'Day 2',
      title: 'Retro 8-Bit Memory Match',
      game: 'memory',
      skinId: 'memory_retro',
      skinName: 'Retro 8-Bit Arcade',
      icon: '🃏',
      points: 150,
      description: 'Unlock nostalgic pixel arcade cabinet cards and 8-bit gaming emojis!'
    },
    {
      day: 3,
      badge: 'Day 3',
      title: 'Matrix Phosphor Typing Display',
      game: 'typing',
      skinId: 'typing_matrix',
      skinName: 'Matrix Phosphor Terminal',
      icon: '⌨️',
      points: 200,
      description: 'Unlock CRT hacker phosphor green scanline display for Typing Racer!'
    },
    {
      day: 4,
      badge: 'Day 4',
      title: 'Midnight Amethyst Sudoku Grid',
      game: 'sudoku',
      skinId: 'sudoku_amethyst',
      skinName: 'Midnight Amethyst Sudoku',
      icon: '🔢',
      points: 250,
      description: 'Unlock royal velvet purple grid with luminous lavender digits!'
    },
    {
      day: 5,
      badge: 'Day 5',
      title: 'Midnight Blue Velvet Billiards Table',
      game: 'billiards',
      skinId: 'billiards_midnight',
      skinName: 'Midnight Blue Velvet Billiards',
      icon: '🎱',
      points: 300,
      description: 'Unlock sapphire blue baize felt with carbon fiber rails and neon cue!'
    },
    {
      day: 6,
      badge: 'Day 6 Duo Pack',
      title: 'Emerald Chess + Cute Pets Memory',
      game: 'multi',
      skinIds: ['chess_emerald', 'memory_pets', 'sudoku_gold'],
      skinNames: 'Campus Emerald Chess + Campus Pets Memory',
      icon: '🎁',
      points: 400,
      description: 'Double Mystery Pack: Campus Emerald Chessboard and cute Campus Mascot Pets!'
    },
    {
      day: 7,
      badge: 'Day 7 Grand Vault',
      title: 'Grand Champion Prestige Bundle',
      game: 'multi',
      skinIds: ['chess_gold', 'billiards_neon', 'typing_vaporwave', 'sudoku_cyber', 'memory_cyber'],
      skinNames: 'Imperial Gold Chess + Cyber Billiards + Vaporwave Typing + Cyber Sudoku',
      icon: '👑',
      points: 1000,
      description: 'Ultimate Legendary Vault unlocking 5 prestige skins across all Campus Games!'
    }
  ],

  _getUserKey(userId) {
    const user = Auth.getUser();
    const id = userId || (user && user.id ? user.id : 'default');
    return `${this._baseKey}_${id}`;
  },

  isStudent() {
    const role = Auth.getRole();
    return role === 'student';
  },

  getSchedule() {
    return this._REWARDS_SCHEDULE;
  },

  getState(userId) {
    const key = this._getUserKey(userId);
    const defaults = {
      streak: 0,
      lastClaimDate: null,
      totalClaims: 0,
      claimHistory: [],
      unlockedSkins: [
        'chess_default',
        'memory_default',
        'typing_default',
        'sudoku_default',
        'billiards_default'
      ],
      equippedSkins: {
        chess: 'chess_default',
        memory: 'memory_default',
        typing: 'typing_default',
        sudoku: 'sudoku_default',
        billiards: 'billiards_default'
      }
    };

    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...defaults,
          ...parsed,
          unlockedSkins: Array.from(new Set([...defaults.unlockedSkins, ...(parsed.unlockedSkins || [])])),
          equippedSkins: { ...defaults.equippedSkins, ...(parsed.equippedSkins || {}) }
        };
      }
    } catch (e) {}

    return defaults;
  },

  saveState(state, userId) {
    const key = this._getUserKey(userId);
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (e) {}
  },

  _getTodayDateStr() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  _getYesterdayDateStr() {
    const d = new Date(Date.now() - 86400000);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  canClaimToday(userId) {
    if (!this.isStudent()) return false;
    const state = this.getState(userId);
    const today = this._getTodayDateStr();
    return state.lastClaimDate !== today;
  },

  getStatus(userId) {
    const isStudent = this.isStudent();
    if (!isStudent) {
      return {
        isStudent: false,
        canClaim: false,
        streak: 0,
        dayInCycle: 1,
        totalClaims: 0,
        alreadyClaimedToday: false
      };
    }

    const state = this.getState(userId);
    const today = this._getTodayDateStr();
    const yesterday = this._getYesterdayDateStr();
    const alreadyClaimed = state.lastClaimDate === today;

    // Check if streak is unbroken
    let currentStreak = state.streak || 0;
    let nextStreak = currentStreak;

    if (alreadyClaimed) {
      // claimed today
      nextStreak = currentStreak;
    } else if (state.lastClaimDate === yesterday) {
      // eligible to continue streak
      nextStreak = currentStreak + 1;
    } else {
      // streak reset or first time
      nextStreak = 1;
    }

    // day in 7-day cycle (1..7)
    const activeCycleDay = alreadyClaimed
      ? (((currentStreak - 1) % 7) + 1)
      : (((nextStreak - 1) % 7) + 1);

    const todayReward = this._REWARDS_SCHEDULE[activeCycleDay - 1] || this._REWARDS_SCHEDULE[0];

    return {
      isStudent: true,
      canClaim: !alreadyClaimed,
      alreadyClaimedToday: alreadyClaimed,
      currentStreak: currentStreak,
      nextStreak: nextStreak,
      dayInCycle: activeCycleDay,
      todayReward: todayReward,
      totalClaims: state.totalClaims || 0,
      unlockedSkinsCount: state.unlockedSkins.length,
      lastClaimDate: state.lastClaimDate
    };
  },

  claimToday(userId) {
    if (!this.isStudent()) {
      return { success: false, message: 'Daily Login rewards are reserved for students only.' };
    }

    const state = this.getState(userId);
    const today = this._getTodayDateStr();
    const yesterday = this._getYesterdayDateStr();

    if (state.lastClaimDate === today) {
      return { success: false, message: "You've already claimed today's login reward! Come back tomorrow." };
    }

    // Calculate updated streak
    let newStreak = 1;
    if (state.lastClaimDate === yesterday) {
      newStreak = (state.streak || 0) + 1;
    }

    const dayInCycle = ((newStreak - 1) % 7) + 1;
    const reward = this._REWARDS_SCHEDULE[dayInCycle - 1];

    // Collect all skin IDs from this reward
    const newUnlocked = [];
    if (reward.skinId) newUnlocked.push(reward.skinId);
    if (Array.isArray(reward.skinIds)) newUnlocked.push(...reward.skinIds);

    newUnlocked.forEach(sid => {
      if (!state.unlockedSkins.includes(sid)) {
        state.unlockedSkins.push(sid);
      }
    });

    // Auto-equip unlocked skins
    if (reward.game && reward.game !== 'multi' && reward.skinId) {
      state.equippedSkins[reward.game] = reward.skinId;
    } else if (reward.game === 'multi') {
      if (reward.skinIds) {
        reward.skinIds.forEach(sid => {
          for (const [gameType, skins] of Object.entries(GameSkinsCatalog)) {
            if (skins.some(s => s.id === sid)) {
              state.equippedSkins[gameType] = sid;
              break;
            }
          }
        });
      }
    }

    // Add points to arcade game points
    try {
      const gamesKey = 'campusnotify_games_data';
      const gamesData = JSON.parse(localStorage.getItem(gamesKey)) || {
        totalPoints: 0,
        gamesPlayed: 0,
        bestStreak: 0,
        achievements: []
      };
      gamesData.totalPoints = (gamesData.totalPoints || 0) + reward.points;
      localStorage.setItem(gamesKey, JSON.stringify(gamesData));
    } catch (e) {}

    // Update state
    state.streak = newStreak;
    state.lastClaimDate = today;
    state.totalClaims = (state.totalClaims || 0) + 1;
    state.claimHistory.unshift({
      date: today,
      timestamp: new Date().toISOString(),
      streak: newStreak,
      dayInCycle: dayInCycle,
      rewardTitle: reward.title,
      points: reward.points,
      unlocked: newUnlocked
    });

    this.saveState(state, userId);

    return {
      success: true,
      reward,
      newStreak,
      dayInCycle,
      unlockedSkins: newUnlocked,
      totalClaims: state.totalClaims
    };
  },

  equipSkin(game, skinId, userId) {
    const state = this.getState(userId);
    if (!state.unlockedSkins.includes(skinId)) {
      return { success: false, message: 'This skin is locked. Claim your daily login rewards to unlock it!' };
    }
    state.equippedSkins[game] = skinId;
    this.saveState(state, userId);
    return { success: true, game, skinId };
  },

  getEquippedSkin(game, userId) {
    const state = this.getState(userId);
    const sid = state.equippedSkins[game] || `${game}_default`;
    const catalog = GameSkinsCatalog[game] || [];
    return catalog.find(s => s.id === sid) || catalog[0];
  },

  isSkinUnlocked(game, skinId, userId) {
    const state = this.getState(userId);
    return state.unlockedSkins.includes(skinId);
  },

  // Developer / testing simulation helper
  simulateNextDay(userId) {
    const state = this.getState(userId);
    // Move last claim date to yesterday so today can be claimed again
    state.lastClaimDate = this._getYesterdayDateStr();
    this.saveState(state, userId);
    return state;
  }
};

// Global browser window bindings
if (typeof window !== 'undefined') {
  window.SavedStore = SavedStore;
  window.EventInterestStore = EventInterestStore;
  window.AcknowledgementStore = AcknowledgementStore;
  window.ReminderStore = ReminderStore;
  window.PollsStore = PollsStore;
  window.GameSkinsCatalog = GameSkinsCatalog;
  window.DailyLoginStore = DailyLoginStore;
}

