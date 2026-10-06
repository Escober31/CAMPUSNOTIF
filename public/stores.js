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
    return [
      {
        id: 1,
        question: 'What activity would you like for Foundation Week?',
        description: 'Help us decide on the next event for Foundation Week. Choose one option below.',
        category: 'Student Life',
        closingDate: '2026-10-20',
        createdAt: '2026-10-01',
        author: 'Jordan Miles',
        status: 'active',
        choices: [
          { id: 'c1', text: 'Concert', votes: 36 },
          { id: 'c2', text: 'Sports Tournament', votes: 26 },
          { id: 'c3', text: 'Cultural Night', votes: 48 },
          { id: 'c4', text: 'Gaming Event', votes: 16 }
        ],
        voters: {}
      }
    ];
  },

  getAll() {
    const deletedIds = this._getDeletedIds();
    const stored = localStorage.getItem(this._key);
    if (stored !== null) {
      try {
        let parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.filter(p => !deletedIds.includes(String(p.id)));
        }
      } catch (e) {}
    }
    const seeds = this._getSeedPolls().filter(p => !deletedIds.includes(String(p.id)));
    this.save(seeds);
    return seeds;
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

// Global browser window bindings
if (typeof window !== 'undefined') {
  window.SavedStore = SavedStore;
  window.EventInterestStore = EventInterestStore;
  window.AcknowledgementStore = AcknowledgementStore;
  window.ReminderStore = ReminderStore;
  window.PollsStore = PollsStore;
}
