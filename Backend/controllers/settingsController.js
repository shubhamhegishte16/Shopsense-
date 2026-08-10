const User = require('../models/User');

// ─── GET /api/settings ────────────────────────────────────────────────────────
// Returns the full settings object for the authenticated user.

exports.getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('settings email fullName createdAt');
    if (!user) return res.status(404).json({ error: 'User not found' });

    // If user was created before settings field existed, return defaults by
    // converting the (empty) embedded doc with its schema defaults
    const settings = user.settings || {};

    res.json({ settings, email: user.email, fullName: user.fullName, memberSince: user.createdAt });
  } catch (err) {
    console.error('getSettings error:', err);
    res.status(500).json({ error: 'Failed to retrieve settings' });
  }
};

// ─── PUT /api/settings ────────────────────────────────────────────────────────
// Accepts a partial settings payload like { section: 'general', data: {...} }
// or { section: 'notifications', data: {...} } and deep-merges into the user doc.
//
// Supported sections: general | notifications | privacy | displayPreferences |
//                     budget | connectedApps

exports.updateSettings = async (req, res) => {
  const { section, data } = req.body;

  const allowedSections = [
    'general',
    'notifications',
    'privacy',
    'displayPreferences',
    'budget',
    'connectedApps',
  ];

  if (!section || !allowedSections.includes(section)) {
    return res.status(400).json({ error: `Invalid or missing section. Allowed: ${allowedSections.join(', ')}` });
  }

  if (!data || typeof data !== 'object') {
    return res.status(400).json({ error: 'Missing data payload' });
  }

  try {
    // Build a $set patch that only touches the fields within the given section
    const patch = {};
    for (const key of Object.keys(data)) {
      patch[`settings.${section}.${key}`] = data[key];
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: patch },
      { new: true, runValidators: true, select: 'settings' }
    );

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ message: 'Settings saved successfully', settings: user.settings });
  } catch (err) {
    console.error('updateSettings error:', err);
    res.status(500).json({ error: 'Failed to save settings' });
  }
};

// ─── PUT /api/settings/connected-apps/:appName ───────────────────────────────
// Toggles the connected status of a named app inside connectedApps array.

exports.toggleConnectedApp = async (req, res) => {
  const { appName } = req.params;

  try {
    const user = await User.findById(req.user.id).select('settings');
    if (!user) return res.status(404).json({ error: 'User not found' });

    const apps = user.settings?.connectedApps || [];
    const appIndex = apps.findIndex(a => a.name === appName);

    if (appIndex === -1) {
      return res.status(404).json({ error: `App "${appName}" not found in connected apps` });
    }

    const now = new Date();
    const monthYear = now.toLocaleString('en-IN', { month: 'short', year: 'numeric' });
    const app = apps[appIndex];

    app.connected = !app.connected;
    app.since = app.connected
      ? `Connected ${monthYear}`
      : 'Not connected';

    // Mark the array as modified so Mongoose persists the change
    user.markModified('settings.connectedApps');
    await user.save();

    res.json({ message: 'App status updated', app });
  } catch (err) {
    console.error('toggleConnectedApp error:', err);
    res.status(500).json({ error: 'Failed to update app connection' });
  }
};
