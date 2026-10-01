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

// Global browser window bindings
if (typeof window !== 'undefined') {
  window.SavedStore = SavedStore;
  window.EventInterestStore = EventInterestStore;
  window.AcknowledgementStore = AcknowledgementStore;
  window.ReminderStore = ReminderStore;
}
