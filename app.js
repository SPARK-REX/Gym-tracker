const DEFAULT_WORKOUTS = {
    push: [
        { id: '1', name: 'Barbell Bench Press', sets: 4, reps: 8 },
        { id: '2', name: 'Overhead Press', sets: 3, reps: 10 },
        { id: '3', name: 'Incline Dumbbell Press', sets: 3, reps: 10 },
        { id: '4', name: 'Tricep Pushdowns', sets: 3, reps: 12 },
        { id: '5', name: 'Lateral Raises', sets: 4, reps: 15 }
    ],
    pull: [
        { id: '6', name: 'Deadlifts', sets: 3, reps: 5 },
        { id: '7', name: 'Pull-ups', sets: 3, reps: 8 },
        { id: '8', name: 'Barbell Rows', sets: 3, reps: 10 },
        { id: '9', name: 'Face Pulls', sets: 3, reps: 15 },
        { id: '10', name: 'Bicep Curls', sets: 3, reps: 12 }
    ],
    legs: [
        { id: '11', name: 'Squats', sets: 4, reps: 8 },
        { id: '12', name: 'Leg Press', sets: 3, reps: 10 },
        { id: '13', name: 'Romanian Deadlifts', sets: 3, reps: 10 },
        { id: '14', name: 'Leg Extensions', sets: 3, reps: 15 },
        { id: '15', name: 'Calf Raises', sets: 4, reps: 20 }
    ],
    abs: [
        { id: '16', name: 'Crunches', sets: 3, reps: 20 },
        { id: '17', name: 'Hanging Leg Raises', sets: 3, reps: 15 },
        { id: '18', name: 'Plank', sets: 3, reps: 60 },
        { id: '19', name: 'Russian Twists', sets: 3, reps: 20 }
    ],
    chest: [
        { id: '101', name: 'Barbell Bench Press', sets: 4, reps: 8 },
        { id: '102', name: 'Incline Dumbbell Press', sets: 3, reps: 10 },
        { id: '103', name: 'Chest Flyes', sets: 3, reps: 15 }
    ],
    back: [
        { id: '104', name: 'Deadlifts', sets: 3, reps: 5 },
        { id: '105', name: 'Pull-ups', sets: 3, reps: 8 },
        { id: '106', name: 'Barbell Rows', sets: 3, reps: 10 }
    ],
    shoulders: [
        { id: '107', name: 'Overhead Press', sets: 3, reps: 10 },
        { id: '108', name: 'Lateral Raises', sets: 4, reps: 15 },
        { id: '109', name: 'Front Raises', sets: 3, reps: 12 }
    ],
    biceps: [
        { id: '201', name: 'Barbell Curls', sets: 3, reps: 10 },
        { id: '202', name: 'Hammer Curls', sets: 3, reps: 12 }
    ],
    triceps: [
        { id: '203', name: 'Tricep Pushdowns', sets: 3, reps: 12 },
        { id: '204', name: 'Overhead Extensions', sets: 3, reps: 12 }
    ]
};

const SPLIT_MODES = {
    ppl: ['push', 'pull', 'legs', 'abs', 'rest'],
    bro: ['chest', 'back', 'shoulders', 'legs', 'biceps', 'triceps', 'abs', 'rest']
};

function ensureDefaultWorkouts(workoutsObj) {
    const result = { ...(workoutsObj || {}) };
    for (const splitKey in DEFAULT_WORKOUTS) {
        if (!Array.isArray(result[splitKey]) || result[splitKey].length === 0) {
            result[splitKey] = JSON.parse(JSON.stringify(DEFAULT_WORKOUTS[splitKey]));
        }
    }
    return result;
}

const savedWorkouts = JSON.parse(localStorage.getItem('gymWorkouts')) || {};
const mergedWorkouts = ensureDefaultWorkouts(savedWorkouts);

const savedSplitMode = localStorage.getItem('gymSplitMode') || 'ppl';

let appState = {
    workouts: mergedWorkouts,
    splitMode: savedSplitMode,
    activeSplit: SPLIT_MODES[savedSplitMode][0],
    progress: JSON.parse(localStorage.getItem('gymProgress')) || {}, // { "YYYY-MM-DD": { splitCompleted: "push", exercises: ["1", "2"] } }
    streak: parseInt(localStorage.getItem('gymStreak')) || 0,
    lastStreakUpdate: localStorage.getItem('gymLastStreakUpdate') || null
};

// --- DOM Elements ---
const DOM = {
    currentDateDisplay: document.getElementById('current-date'),
    streakCountDisplay: document.getElementById('streak-count'),
    calendarContainer: document.getElementById('calendar-container'),
    splitSelector: document.getElementById('split-selector'),
    toggleSplitTypeBtn: document.getElementById('toggle-split-type-btn'),
    splitTitle: document.getElementById('current-split-title'),
    splitProgressBar: document.getElementById('split-progress-bar'),
    splitStatusText: document.getElementById('split-status-text'),
    exerciseList: document.getElementById('exercise-list'),
    customizeDayBtn: document.getElementById('customize-day-btn'),
    revertTemplateBtn: document.getElementById('revert-template-btn'),

    // Controls & Modals
    editModeBtn: document.getElementById('edit-mode-btn'),
    addExerciseBtn: document.getElementById('add-exercise-btn'),
    modal: document.getElementById('exercise-modal'),
    closeModalBtn: document.getElementById('close-modal-btn'),
    saveExerciseBtn: document.getElementById('save-exercise-btn'),

    // Modal Inputs
    modalTitle: document.getElementById('modal-title'),
    nameInput: document.getElementById('exercise-name-input'),
    setsInput: document.getElementById('exercise-sets-input'),
    repsInput: document.getElementById('exercise-reps-input'),
    editingIdInput: document.getElementById('editing-exercise-id'),

    // Sync
    appTitle: document.getElementById('app-title'),
    syncModal: document.getElementById('sync-modal'),
    closeSyncBtn: document.getElementById('close-sync-btn'),
    googleLoginBtn: document.getElementById('google-login-btn'),
    googleLogoutBtn: document.getElementById('google-logout-btn'),
    syncStatus: document.getElementById('sync-status'),

    // Sync Choice
    syncChoiceModal: document.getElementById('sync-choice-modal'),
    syncKeepLocalBtn: document.getElementById('sync-keep-local-btn'),
    syncLoadCloudBtn: document.getElementById('sync-load-cloud-btn'),
    syncMergeBtn: document.getElementById('sync-merge-btn'),

    // AI Coach
    aiFabBtn: document.getElementById('ai-coach-fab'),
    aiModal: document.getElementById('ai-modal'),
    closeAiBtn: document.getElementById('close-ai-btn'),
    aiSettingsToggleBtn: document.getElementById('ai-settings-toggle-btn'),
    aiSettingsDrawer: document.getElementById('ai-settings-drawer'),
    geminiKeyInput: document.getElementById('gemini-key-input'),
    saveGeminiKeyBtn: document.getElementById('save-gemini-key-btn'),
    aiChatHistory: document.getElementById('ai-chat-history'),
    aiQuickChips: document.getElementById('ai-quick-chips'),
    aiChatForm: document.getElementById('ai-chat-form'),
    aiInput: document.getElementById('ai-input')
};

// --- Firebase Setup ---
const firebaseConfig = {
    apiKey: "AIzaSyD2f6oNnfNG2KzKK8PAwuR47lUMUOy17bc",
    authDomain: "gym-tracker-fb9b3.firebaseapp.com",
    databaseURL: "https://gym-tracker-fb9b3-default-rtdb.firebaseio.com",
    projectId: "gym-tracker-fb9b3",
    storageBucket: "gym-tracker-fb9b3.firebasestorage.app",
    messagingSenderId: "1071913642522",
    appId: "1:1071913642522:web:429d4c001c13eff84ebfa3",
    measurementId: "G-R5ZNQBNEE3"
};

let auth, db, currentUser;

function handleAuthError(err) {
    console.error("Firebase Auth Error:", err);
    if (!DOM.syncStatus) return;
    
    let message = "Sign-in failed. Please try again.";
    if (err.code === 'auth/unauthorized-domain') {
        message = `<strong>Unauthorized Domain!</strong><br><small style="color:var(--neon-red)">Please add <code>${window.location.hostname}</code> to <em>Firebase Console → Authentication → Settings → Authorized domains</em>.</small>`;
    } else if (err.code === 'auth/operation-not-allowed') {
        message = `<strong>Google Sign-In Disabled!</strong><br><small style="color:var(--neon-red)">Enable Google under <em>Firebase Console → Authentication → Sign-in method</em>.</small>`;
    } else if (err.code === 'auth/popup-blocked') {
        message = `<strong>Popup Blocked!</strong><br><small style="color:var(--neon-red)">Please allow popups or try again.</small>`;
    } else if (err.code === 'auth/popup-closed-by-user') {
        message = `<small style="color:var(--text-muted)">Sign-in popup was closed.</small>`;
    } else if (err.message) {
        message = `<small style="color:var(--neon-red)">${err.message}</small>`;
    }
    DOM.syncStatus.innerHTML = message;
}

try {
    if (typeof firebase !== 'undefined') {
        firebase.initializeApp(firebaseConfig);
        auth = firebase.auth();
        db = firebase.database();

        // Process returning redirect sign-in results for mobile/fallback login
        auth.getRedirectResult().then(result => {
            if (result && result.user) {
                console.log("Logged in via Google redirect:", result.user.displayName || result.user.email);
            }
        }).catch(err => {
            handleAuthError(err);
        });

        auth.onAuthStateChanged(user => {
            currentUser = user;
            if (user) {
                DOM.syncStatus.innerHTML = `Connected as <b>${user.displayName || user.email}</b><br><small style="color:var(--neon-green)">Synced</small>`;
                DOM.googleLoginBtn.style.display = 'none';
                DOM.googleLogoutBtn.style.display = 'flex';
                loadDataFromFirebase();
            } else {
                DOM.syncStatus.textContent = 'Not connected. Data is saved locally.';
                DOM.googleLoginBtn.style.display = 'flex';
                DOM.googleLogoutBtn.style.display = 'none';
            }
        });
    }
} catch (e) {
    console.warn("Firebase not initialized correctly. Please check config.", e);
}

let isSyncing = false;

function saveDataToFirebase() {
    if (!currentUser || !db || isSyncing) return;

    db.ref('users/' + currentUser.uid + '/appState').set({
        workouts: appState.workouts,
        progress: appState.progress,
        streak: appState.streak,
        lastStreakUpdate: appState.lastStreakUpdate || null,
        splitMode: appState.splitMode
    }).catch(err => console.error("Firebase save error:", err));
}

let pendingCloudData = null;

function loadDataFromFirebase() {
    if (!currentUser || !db) return;
    isSyncing = true;
    DOM.syncStatus.innerHTML = `Connected as <b>${currentUser.displayName || currentUser.email}</b><br><small style="color:var(--text-muted)">Syncing...</small>`;

    // Track if user already made a sync choice this session
    const syncChoiceKey = 'gymSyncChoiceMade_' + currentUser.uid;
    const alreadyChosen = sessionStorage.getItem(syncChoiceKey);

    const fetchPromise = db.ref('users/' + currentUser.uid + '/appState').once('value');
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Network timeout. Please check your connection.')), 10000));

    Promise.race([fetchPromise, timeoutPromise]).then(snapshot => {
        const val = snapshot.val();
        if (val) {
            if (alreadyChosen) {
                // Already made a choice this session — silently load cloud data
                applyCloudData(val);
            } else {
                // First login this session — show the choice modal
                pendingCloudData = val;
                DOM.syncModal.classList.add('hidden');
                DOM.syncChoiceModal.classList.remove('hidden');
                isSyncing = false;
            }
        } else {
            // No cloud data — upload local data
            sessionStorage.setItem(syncChoiceKey, 'true');
            isSyncing = false; // Must be false before saving
            saveDataToFirebase();
            DOM.syncStatus.innerHTML = `Connected as <b>${currentUser.displayName || currentUser.email}</b><br><small style="color:var(--neon-green)">Synced</small>`;
        }
    }).catch(err => {
        console.error("Firebase load error:", err);
        DOM.syncStatus.innerHTML = `Connected as <b>${currentUser.displayName || currentUser.email}</b><br><small style="color:var(--neon-red)">Sync Failed</small>`;
        isSyncing = false;
    });
}

function applyCloudData(val) {
    appState.workouts = ensureDefaultWorkouts(val.workouts);
    appState.progress = val.progress || {};
    appState.streak = val.streak || 0;
    appState.lastStreakUpdate = val.lastStreakUpdate || null;
    appState.splitMode = val.splitMode || 'ppl';

    if (!SPLIT_MODES[appState.splitMode].includes(appState.activeSplit)) {
        appState.activeSplit = SPLIT_MODES[appState.splitMode][0];
    }

    const todayStr = getTodayDateString();
    if (!appState.progress[todayStr]) {
        appState.progress[todayStr] = { splitCompleted: null, exercises: [], plannedSplit: null };
    }
    appState.selectedDate = todayStr;

    saveState(true);

    renderHeader();
    renderCalendar();
    renderSplitTabs();
    renderSplit(appState.activeSplit);
    updateStreakDisplay();

    DOM.syncStatus.innerHTML = `Connected as <b>${currentUser.displayName || currentUser.email}</b><br><small style="color:var(--neon-green)">Synced</small>`;
    isSyncing = false;
}

function mergeData(cloudVal) {
    // Merge workouts: combine cloud and local workouts, ensuring defaults fill missing categories
    const combined = { ...(cloudVal.workouts || {}), ...(appState.workouts || {}) };
    const mergedWorkouts = ensureDefaultWorkouts(combined);

    // Merge progress: for each date, keep the one with more completed exercises
    const mergedProgress = { ...(cloudVal.progress || {}) };
    for (const dateKey in appState.progress) {
        const local = appState.progress[dateKey];
        const cloud = mergedProgress[dateKey];

        if (!cloud) {
            mergedProgress[dateKey] = local;
        } else {
            // Keep the entry that has more progress
            const localCount = (local.exercises ? local.exercises.length : 0) + (local.splitCompleted ? 100 : 0);
            const cloudCount = (cloud.exercises ? cloud.exercises.length : 0) + (cloud.splitCompleted ? 100 : 0);
            if (localCount >= cloudCount) {
                mergedProgress[dateKey] = local;
            }
            // else keep cloud version already in mergedProgress
        }
    }

    // Streak: keep the higher one
    const mergedStreak = Math.max(appState.streak || 0, cloudVal.streak || 0);
    const mergedLastStreak = mergedStreak === appState.streak ? appState.lastStreakUpdate : cloudVal.lastStreakUpdate;

    // Apply merged state
    appState.workouts = mergedWorkouts;
    appState.progress = mergedProgress;
    appState.streak = mergedStreak;
    appState.lastStreakUpdate = mergedLastStreak || appState.lastStreakUpdate;
    appState.splitMode = appState.splitMode || cloudVal.splitMode || 'ppl';

    if (!SPLIT_MODES[appState.splitMode].includes(appState.activeSplit)) {
        appState.activeSplit = SPLIT_MODES[appState.splitMode][0];
    }

    const todayStr = getTodayDateString();
    if (!appState.progress[todayStr]) {
        appState.progress[todayStr] = { splitCompleted: null, exercises: [], plannedSplit: null };
    }
    appState.selectedDate = todayStr;

    saveState(true);
    saveDataToFirebase();

    renderHeader();
    renderCalendar();
    renderSplitTabs();
    renderSplit(appState.activeSplit);
    updateStreakDisplay();

    DOM.syncStatus.innerHTML = `Connected as <b>${currentUser.displayName || currentUser.email}</b><br><small style="color:var(--neon-green)">Synced (Merged)</small>`;
}

// --- Utilities ---
function getTodayDateString() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function saveState(skipFirebase = false) {
    localStorage.setItem('gymWorkouts', JSON.stringify(appState.workouts));
    localStorage.setItem('gymProgress', JSON.stringify(appState.progress));
    localStorage.setItem('gymStreak', appState.streak);
    localStorage.setItem('gymLastStreakUpdate', appState.lastStreakUpdate);
    localStorage.setItem('gymSplitMode', appState.splitMode);

    if (!skipFirebase) {
        saveDataToFirebase();
    }
}

function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

// Ensure today's progress entry exists
const todayStr = getTodayDateString();
if (!appState.progress[todayStr]) {
    appState.progress[todayStr] = { splitCompleted: null, exercises: [], plannedSplit: null };
}
appState.selectedDate = todayStr;

// Seed past workout data (March 1–12, 2026) — one-time
if (!localStorage.getItem('seedDataAppliedV2')) {
    const seedData = {
        '2026-03-01': 'push',
        '2026-03-02': 'pull',
        '2026-03-03': 'legs',
        '2026-03-04': 'abs',
        '2026-03-05': 'pull',
        '2026-03-06': 'push',
        '2026-03-07': 'legs',
        '2026-03-08': 'rest',
        '2026-03-09': 'chest',
        '2026-03-10': 'back',
        '2026-03-11': 'shoulders',
        '2026-03-12': 'arms' // Will map to 'biceps' due to custom logic below if 'arms' isn't explicitly defined
    };
    
    // Fallback mapping if 'arms' isn't in default workouts
    const workoutMap = {
        'arms': 'biceps'
    };

    for (const [date, originalSplit] of Object.entries(seedData)) {
        if (!appState.progress[date] || !appState.progress[date].splitCompleted) {
            const split = workoutMap[originalSplit] || originalSplit;
            // Get all exercise IDs for that split, or empty array for rest
            const exercises = split === 'rest' ? [] : (appState.workouts[split] || []).map(ex => ex.id);
            appState.progress[date] = { splitCompleted: split, exercises: exercises };
        }
    }
    appState.streak = 12;
    appState.lastStreakUpdate = '2026-03-12';
    
    // Also save a custom workout for fun on one of the days
    appState.progress['2026-03-10'].customExercises = [
        ...appState.workouts['back'],
        { id: generateId(), name: 'Extra Lat Pulldowns', sets: 4, reps: 15, createdAt: '2026-03-10' }
    ];

    localStorage.setItem('seedDataAppliedV2', 'true');
    saveState();
}

// Check streak
function checkAndUpdateStreak() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

    // If not completed today and not completed yesterday, and we had a streak, break it.
    // Actually, simple streak logic:
    // If completed today, it's already updated.
    // If opening today, and yesterday wasn't completed, and today isn't completed yet, shouldn't reset until we miss the day.
    // Let's just track if they missed yesterday.

    if (appState.lastStreakUpdate !== todayStr && appState.lastStreakUpdate !== yesterdayStr) {
        if (appState.lastStreakUpdate != null && !appState.progress[yesterdayStr]?.splitCompleted) {
            // Streak broken
            appState.streak = 0;
            appState.lastStreakUpdate = null;
            saveState();
        }
    }
}

// --- Initialization ---
function init() {
    checkAndUpdateStreak();
    renderHeader();
    renderCalendar();

    // Ensure active split is valid for current mode
    if (!SPLIT_MODES[appState.splitMode].includes(appState.activeSplit)) {
        appState.activeSplit = SPLIT_MODES[appState.splitMode][0];
    }

    renderSplitTabs();
    bindEvents();
    initAiCoach();
    renderSplit(appState.activeSplit);
    updateStreakDisplay();
}

// --- Render Functions ---

function renderHeader() {
    const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    DOM.currentDateDisplay.textContent = new Date().toLocaleDateString('en-US', options);
}

function updateStreakDisplay() {
    DOM.streakCountDisplay.textContent = appState.streak;
}

function renderCalendar() {
    DOM.calendarContainer.innerHTML = '';
    const now = new Date();

    const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    // Generate 14 days in the past and 14 days in the future (28 days total)
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - 14);

    let todayNode = null;

    for (let i = 0; i < 29; i++) {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);
        const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

        const isToday = dateStr === todayStr;
        const prog = appState.progress[dateStr];
        const isCompleted = prog && prog.splitCompleted;
        const isSelected = dateStr === appState.selectedDate;

        const node = document.createElement('div');
        node.className = `day-node ${isToday ? 'today' : ''} ${isCompleted ? 'completed' : ''} ${isSelected ? 'selected' : ''}`;
        node.dataset.date = dateStr;

        let innerHtml = `
            <span class="day-label">${dayNames[d.getDay()]}</span>
            <div class="day-circle">${d.getDate()}</div>
        `;

        // Only show planned dot if it's strictly a future incomplete planned workout
        if (prog && prog.plannedSplit && prog.plannedSplit !== 'rest' && !isCompleted && dateStr > todayStr) {
            innerHtml += `<div class="planned-dot"></div>`;
        }

        node.innerHTML = innerHtml;

        node.addEventListener('click', () => {
            appState.selectedDate = dateStr;
            if (!appState.progress[dateStr]) {
                appState.progress[dateStr] = { splitCompleted: null, exercises: [] };
            }
            const p = appState.progress[dateStr];
            // For past days with a completed split, show that split; otherwise keep current active split
            // 'fever' is stored as splitCompleted but maps to the 'rest' tab
            const rawSplit = p.splitCompleted || appState.activeSplit || SPLIT_MODES[appState.splitMode][0];
            const targetSplit = rawSplit === 'fever' ? 'rest' : rawSplit;
            renderCalendar();
            renderSplit(targetSplit);
        });

        DOM.calendarContainer.appendChild(node);

        if (isToday) {
            todayNode = node;
        }
    }

    // After adding all nodes, scroll the calendar so today is visible/centered
    if (todayNode) {
        // Use a short timeout to let the DOM settle before scrolling
        setTimeout(() => {
            const containerCenter = DOM.calendarContainer.offsetWidth / 2;
            const nodeCenter = todayNode.offsetLeft + (todayNode.offsetWidth / 2);
            DOM.calendarContainer.scrollTo({
                left: nodeCenter - containerCenter,
                behavior: 'smooth'
            });
        }, 10);
    }
}

function toggleSplitMode() {
    appState.splitMode = appState.splitMode === 'ppl' ? 'bro' : 'ppl';
    saveState();

    if (!SPLIT_MODES[appState.splitMode].includes(appState.activeSplit)) {
        appState.activeSplit = SPLIT_MODES[appState.splitMode][0];
    }

    renderSplitTabs();
    renderSplit(appState.activeSplit);
}

function renderSplitTabs() {
    DOM.splitSelector.innerHTML = '';
    const tabs = SPLIT_MODES[appState.splitMode];

    tabs.forEach(split => {
        const btn = document.createElement('button');
        btn.className = 'split-tab';
        if (split === appState.activeSplit) btn.classList.add('active');
        btn.dataset.split = split;
        btn.textContent = split.charAt(0).toUpperCase() + split.slice(1);
        
        btn.addEventListener('click', () => {
            renderSplit(split);
        });

        DOM.splitSelector.appendChild(btn);
    });

    scrollActiveTabIntoView();
}

function scrollActiveTabIntoView() {
    setTimeout(() => {
        const activeTab = DOM.splitSelector.querySelector('.split-tab.active');
        if (activeTab && DOM.splitSelector) {
            const container = DOM.splitSelector;
            const containerWidth = container.offsetWidth;
            const tabOffsetLeft = activeTab.offsetLeft;
            const tabWidth = activeTab.offsetWidth;
            container.scrollTo({
                left: tabOffsetLeft - (containerWidth / 2) + (tabWidth / 2),
                behavior: 'smooth'
            });
        }
    }, 20);
}

function renderSplit(splitName) {
    appState.activeSplit = splitName;
    const selectedDateStr = appState.selectedDate;
    if (!appState.progress[selectedDateStr]) {
        appState.progress[selectedDateStr] = { splitCompleted: null, exercises: [], plannedSplit: null };
    }
    const selectedProg = appState.progress[selectedDateStr];

    const isToday = selectedDateStr === todayStr;
    const isFuture = selectedDateStr > todayStr;
    const isPast = selectedDateStr < todayStr;

    // No auto-assignment of splits to days — user can freely pick any workout

    // Update Tabs
    const isCompletedSplit = selectedProg.splitCompleted === splitName || (splitName === 'rest' && selectedProg.splitCompleted === 'fever');
    const currentTabs = document.querySelectorAll('.split-tab');
    currentTabs.forEach(tab => {
        if (tab.dataset.split === splitName) {
            tab.classList.add('active');
            if (isCompletedSplit) {
                tab.classList.add('completed');
            } else {
                tab.classList.remove('completed');
            }
        } else {
            tab.classList.remove('active');
            tab.classList.remove('completed');
        }
    });

    scrollActiveTabIntoView();

    if (splitName === 'rest') {
        DOM.splitTitle.textContent = 'Rest / Sick Day';
        const restCompleted = selectedProg.splitCompleted === 'rest';
        const feverCompleted = selectedProg.splitCompleted === 'fever';
        const anyCompleted = restCompleted || feverCompleted;

        // Build a rest day card with a checkbox
        // For past/future days: completed items still glow, only unchecked items are dimmed
        const restCursorStyle = (isPast || isFuture)
            ? (restCompleted ? 'cursor: not-allowed;' : 'cursor: not-allowed; opacity: 0.5;')
            : 'cursor: pointer;';
        const feverCursorStyle = (isPast || isFuture)
            ? (feverCompleted ? 'cursor: not-allowed;' : 'cursor: not-allowed; opacity: 0.5;')
            : 'cursor: pointer;';

        DOM.exerciseList.innerHTML = `
            <li class="exercise-item ${restCompleted ? 'checked' : ''}" id="rest-day-item">
                <div class="exercise-bg-animation"></div>
                <div class="exercise-info">
                    <div class="custom-checkbox ${restCompleted ? 'checked' : ''} ${(isPast || isFuture) ? 'disabled' : ''}" id="rest-day-checkbox" style="${restCursorStyle}">
                        <i class="fas fa-check"></i>
                    </div>
                    <div class="exercise-details">
                        <h4>Rest Day</h4>
                        <span class="exercise-meta">Take a break! Recovery is important 💤</span>
                    </div>
                </div>
            </li>
            <li class="exercise-item ${feverCompleted ? 'checked' : ''}" id="fever-day-item">
                <div class="exercise-bg-animation"></div>
                <div class="exercise-info">
                    <div class="custom-checkbox ${feverCompleted ? 'checked' : ''} ${(isPast || isFuture) ? 'disabled' : ''}" id="fever-day-checkbox" style="${feverCursorStyle}">
                        <i class="fas fa-check"></i>
                    </div>
                    <div class="exercise-details">
                        <h4>Sick / Fever</h4>
                        <span class="exercise-meta">Rest up and get well soon! 🤒</span>
                    </div>
                </div>
            </li>
        `;

        // Add click handler for checkbox (only for today)
        if (isToday) {
            const handleToggle = (type) => {
                const currentCompleted = selectedProg.splitCompleted;
                if (currentCompleted === type) {
                    // Uncheck
                    selectedProg.splitCompleted = null;
                    if (appState.lastStreakUpdate === selectedDateStr) {
                        appState.streak = Math.max(0, appState.streak - 1);
                        appState.lastStreakUpdate = null;
                        updateStreakDisplay();
                    }
                } else {
                    // Check
                    const wasAlreadyCompleted = currentCompleted === 'rest' || currentCompleted === 'fever';
                    selectedProg.splitCompleted = type;
                    if (!wasAlreadyCompleted && appState.lastStreakUpdate !== selectedDateStr) {
                        appState.streak++;
                        appState.lastStreakUpdate = selectedDateStr;
                        updateStreakDisplay();
                    }
                }
                saveState();
                renderCalendar();
                renderSplit('rest');
            };

            const restCheckbox = document.getElementById('rest-day-checkbox');
            if (restCheckbox) {
                restCheckbox.addEventListener('click', () => handleToggle('rest'));
            }

            const feverCheckbox = document.getElementById('fever-day-checkbox');
            if (feverCheckbox) {
                feverCheckbox.addEventListener('click', () => handleToggle('fever'));
            }
        }

        DOM.splitProgressBar.style.width = anyCompleted ? '100%' : '0%';
        if (anyCompleted) {
            DOM.splitProgressBar.classList.add('complete');
            DOM.splitStatusText.textContent = feverCompleted ? 'Resting (Sick)!' : 'Rest Day Complete!';
            DOM.splitStatusText.className = 'status-text glow-text-green';
        } else {
            DOM.splitProgressBar.classList.remove('complete');
            DOM.splitStatusText.textContent = 'Rest or Sick Day';
            DOM.splitStatusText.className = 'status-text glow-text-white';
        }
        DOM.addExerciseBtn.style.display = 'none';
        DOM.editModeBtn.style.display = 'none';
        DOM.customizeDayBtn.classList.add('hidden');
        DOM.revertTemplateBtn.classList.add('hidden');
        return;
    } else if (isPast) {
        DOM.addExerciseBtn.style.display = 'none';
        DOM.editModeBtn.style.display = 'none';
        DOM.customizeDayBtn.classList.add('hidden');
        DOM.revertTemplateBtn.classList.add('hidden');
    } else {
        DOM.addExerciseBtn.style.display = 'flex';
        DOM.editModeBtn.style.display = 'flex';
    }

    // Custom Workout Logic
    const isCustom = Array.isArray(selectedProg.customExercises);
    let exercises = isCustom ? selectedProg.customExercises : (appState.workouts[splitName] || []);

    if (!isCustom) {
        exercises = exercises.filter(ex => {
            if (ex.createdAt && ex.createdAt > selectedDateStr) return false;
            if (ex.deletedAt && ex.deletedAt <= selectedDateStr) return false;
            return true;
        });
    }

    if (isCustom) {
        DOM.splitTitle.textContent = splitName.charAt(0).toUpperCase() + splitName.slice(1) + ' Exercises (Custom)';
        DOM.splitTitle.classList.add('glow-text-green');
        DOM.splitTitle.classList.remove('glow-text-white');
        DOM.customizeDayBtn.classList.add('hidden');
        DOM.revertTemplateBtn.classList.remove('hidden');
    } else {
        DOM.splitTitle.textContent = splitName.charAt(0).toUpperCase() + splitName.slice(1) + ' Exercises';
        DOM.splitTitle.classList.add('glow-text-white');
        DOM.splitTitle.classList.remove('glow-text-green');
        DOM.customizeDayBtn.classList.remove('hidden');
        DOM.revertTemplateBtn.classList.add('hidden');
    }

    DOM.exerciseList.innerHTML = '';

    let completedCount = 0;

    if (exercises.length === 0) {
        DOM.exerciseList.innerHTML = `
            <div style="text-align:center; padding:24px 10px;">
                <p style="color:var(--text-muted); margin-bottom: 14px;">No exercises listed for ${splitName.toUpperCase()}.</p>
                <button id="restore-defaults-btn" class="glass-btn glow-btn-green" style="margin:0 auto; max-width: 260px;">
                    <i class="fas fa-redo-alt"></i> Restore Preloaded Workouts
                </button>
            </div>
        `;
        setTimeout(() => {
            const restoreBtn = document.getElementById('restore-defaults-btn');
            if (restoreBtn) {
                restoreBtn.onclick = () => {
                    appState.workouts[splitName] = JSON.parse(JSON.stringify(DEFAULT_WORKOUTS[splitName] || []));
                    saveState();
                    renderSplit(splitName);
                };
            }
        }, 10);
    }

    exercises.forEach(ex => {
        const isChecked = selectedProg.exercises.includes(ex.id);
        if (isChecked) completedCount++;

        const li = document.createElement('li');
        li.className = `exercise-item ${isChecked ? 'checked' : ''}`;

        let checkboxHtml = '';
        if (isFuture || isPast) {
            checkboxHtml = `
             <div class="custom-checkbox disabled ${isChecked ? 'checked' : ''}" style="${!isChecked ? 'opacity: 0.3;' : ''} cursor: not-allowed;" data-id="${ex.id}">
                 <i class="fas fa-check"></i>
             </div>`;
        } else {
            checkboxHtml = `
             <div class="custom-checkbox ${isChecked ? 'checked' : ''}" data-id="${ex.id}">
                 <i class="fas fa-check"></i>
             </div>`;
        }

        const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(ex.name + ' exercise form tutorial')}`;

        li.innerHTML = `
            <div class="exercise-bg-animation"></div>
            <div class="exercise-info">
                ${checkboxHtml}
                <div class="exercise-details">
                    <h4>${ex.name}</h4>
                    <span class="exercise-meta">${ex.sets} Sets × ${ex.reps} Reps</span>
                </div>
            </div>
            <div class="exercise-actions">
                <a href="${youtubeSearchUrl}" target="_blank" rel="noopener noreferrer" class="item-yt-btn" title="Watch Tutorial">
                    <i class="fab fa-youtube"></i>
                </a>
                <button class="item-edit-btn" data-id="${ex.id}"><i class="fas fa-pen"></i></button>
                <button class="item-delete-btn" data-id="${ex.id}"><i class="fas fa-trash"></i></button>
            </div>
        `;
        DOM.exerciseList.appendChild(li);
    });

    // Update Progress
    const progressPercent = exercises.length === 0 ? 0 : (completedCount / exercises.length) * 100;
    DOM.splitProgressBar.style.width = `${progressPercent}%`;

    if (progressPercent === 100 && exercises.length > 0) {
        DOM.splitProgressBar.classList.add('complete');
        DOM.splitStatusText.textContent = 'Workout Complete!';
        DOM.splitStatusText.className = 'status-text glow-text-green';

        if (!selectedProg.splitCompleted) {
            selectedProg.splitCompleted = splitName;

            if (isToday) {
                if (appState.lastStreakUpdate !== selectedDateStr) {
                    appState.streak++;
                    appState.lastStreakUpdate = selectedDateStr;
                    updateStreakDisplay();
                }
            }
            saveState();
            renderCalendar(); // re-render to turn today green
        }
    } else {
        DOM.splitProgressBar.classList.remove('complete');
        if (isFuture) {
            DOM.splitStatusText.textContent = 'Planned Workout';
            DOM.splitStatusText.className = 'status-text glow-text-white';
        } else {
            DOM.splitStatusText.textContent = 'Workout Incomplete';
            DOM.splitStatusText.className = 'status-text glow-text-red';
        }

        if (selectedProg.splitCompleted === splitName && selectedProg.splitCompleted !== 'fever' && selectedProg.splitCompleted !== 'rest') {
            selectedProg.splitCompleted = null;

            if (isToday) {
                if (appState.lastStreakUpdate === selectedDateStr) {
                    appState.streak = Math.max(0, appState.streak - 1);
                    appState.lastStreakUpdate = null;
                    updateStreakDisplay();
                }
            }
            saveState();
            renderCalendar();
        }
    }
}

let eventsBound = false;
// --- Event Handlers ---
function bindEvents() {
    if (eventsBound) return;
    eventsBound = true;

    if (DOM.appTitle) {
        DOM.appTitle.addEventListener('click', () => DOM.syncModal.classList.remove('hidden'));
    }
    if (DOM.closeSyncBtn) {
        DOM.closeSyncBtn.addEventListener('click', () => DOM.syncModal.classList.add('hidden'));
    }
    if (DOM.googleLoginBtn) {
        DOM.googleLoginBtn.addEventListener('click', () => {
            if (!auth) {
                alert("Firebase not configured! Please check your app.js config.");
                return;
            }

            DOM.syncStatus.innerHTML = `<small style="color:var(--neon-green)"><i class="fas fa-spinner fa-spin"></i> Connecting to Google...</small>`;

            const provider = new firebase.auth.GoogleAuthProvider();
            provider.addScope('profile');
            provider.addScope('email');

            // Try popup sign-in first (works on both Desktop and modern Mobile), fallback to redirect if blocked
            auth.signInWithPopup(provider).then(result => {
                if (result && result.user) {
                    console.log("Google popup sign-in successful:", result.user.displayName || result.user.email);
                }
            }).catch(err => {
                if (err.code === 'auth/popup-blocked' || err.code === 'auth/popup-closed-by-user' || err.code === 'auth/operation-not-supported-in-this-environment') {
                    console.warn("Popup unavailable or blocked, falling back to redirect auth...", err);
                    auth.signInWithRedirect(provider).catch(reErr => {
                        handleAuthError(reErr);
                    });
                } else {
                    handleAuthError(err);
                }
            });
        });
    }
    if (DOM.googleLogoutBtn) {
        DOM.googleLogoutBtn.addEventListener('click', () => {
            if (currentUser) {
                sessionStorage.removeItem('gymSyncChoiceMade_' + currentUser.uid);
            }
            if (auth) {
                auth.signOut().then(() => {
                    DOM.syncStatus.textContent = 'Not connected. Data is saved locally.';
                }).catch(err => console.error("Sign out error:", err));
            }
        });
    }

    // Sync Choice buttons
    if (DOM.syncKeepLocalBtn) {
        DOM.syncKeepLocalBtn.addEventListener('click', () => {
            // Upload current local data to cloud, overwriting cloud
            if (currentUser) sessionStorage.setItem('gymSyncChoiceMade_' + currentUser.uid, 'true');
            pendingCloudData = null;
            DOM.syncChoiceModal.classList.add('hidden');
            saveDataToFirebase();
            DOM.syncStatus.innerHTML = `Connected as <b>${currentUser.displayName || currentUser.email}</b><br><small style="color:var(--neon-green)">Synced (Local → Cloud)</small>`;
        });
    }
    if (DOM.syncLoadCloudBtn) {
        DOM.syncLoadCloudBtn.addEventListener('click', () => {
            if (currentUser) sessionStorage.setItem('gymSyncChoiceMade_' + currentUser.uid, 'true');
            DOM.syncChoiceModal.classList.add('hidden');
            if (pendingCloudData) {
                applyCloudData(pendingCloudData);
                pendingCloudData = null;
            }
        });
    }
    if (DOM.syncMergeBtn) {
        DOM.syncMergeBtn.addEventListener('click', () => {
            if (currentUser) sessionStorage.setItem('gymSyncChoiceMade_' + currentUser.uid, 'true');
            DOM.syncChoiceModal.classList.add('hidden');
            if (pendingCloudData) {
                mergeData(pendingCloudData);
                pendingCloudData = null;
            }
        });
    }

    DOM.splitSelector.addEventListener('click', (e) => {
        if (e.target.classList.contains('split-tab')) {
            renderSplit(e.target.dataset.split);
        }
    });

    DOM.toggleSplitTypeBtn.addEventListener('click', toggleSplitMode);

    DOM.exerciseList.addEventListener('click', (e) => {
        // Toggle check
        const checkbox = e.target.closest('.custom-checkbox');
        if (checkbox && !document.body.classList.contains('edit-mode') && !checkbox.classList.contains('disabled')) {
            const id = checkbox.dataset.id;
            const selectedProg = appState.progress[appState.selectedDate];

            if (selectedProg.exercises.includes(id)) {
                selectedProg.exercises = selectedProg.exercises.filter(exId => exId !== id);
            } else {
                selectedProg.exercises.push(id);
            }

            saveState();
            renderSplit(appState.activeSplit); // Re-render to update UI and completion logic
            return;
        }

        // Edit
        const editBtn = e.target.closest('.item-edit-btn');
        if (editBtn) {
            openModal(editBtn.dataset.id);
            return;
        }

        // Delete
        const deleteBtn = e.target.closest('.item-delete-btn');
        if (deleteBtn) {
            const id = deleteBtn.dataset.id;
            if (confirm('Delete this exercise?')) {
                const selectedProg = appState.progress[appState.selectedDate];
                const isCustom = Array.isArray(selectedProg.customExercises);

                if (isCustom) {
                    selectedProg.customExercises = selectedProg.customExercises.filter(e => e.id !== id);
                } else {
                    const ex = appState.workouts[appState.activeSplit].find(e => e.id === id);
                    if (ex) {
                        ex.deletedAt = appState.selectedDate;
                    }
                }

                // Always clean from today track progress array
                selectedProg.exercises = selectedProg.exercises.filter(exId => exId !== id);
                saveState();
                renderSplit(appState.activeSplit);
            }
        }
    });

    // Remove old listeners since we will add event delegation on body for these buttons
    // The previous event listeners for customizeDayBtn and revertTemplateBtn are removed from here

    // Edit Mode Toggle
    DOM.editModeBtn.addEventListener('click', () => {
        document.body.classList.toggle('edit-mode');
        const isEdit = document.body.classList.contains('edit-mode');
        DOM.editModeBtn.innerHTML = isEdit ? '<i class="fas fa-check"></i> Done Editing' : '<i class="fas fa-edit"></i> Edit List';
        DOM.editModeBtn.classList.toggle('glow-text-red', isEdit); // Highlight button slightly
    });

    // Modal
    DOM.addExerciseBtn.addEventListener('click', () => openModal());
    DOM.closeModalBtn.addEventListener('click', closeModal);
    DOM.saveExerciseBtn.addEventListener('click', saveExercise);

    // Header Actions (Event Delegation)
    // Header Actions (Event Delegation)
    document.addEventListener('click', (e) => {
        const customizeBtn = e.target.closest('#customize-day-btn');
        const revertBtn = e.target.closest('#revert-template-btn');

        if (customizeBtn) {
            console.log("Customizing day...");
            const selectedProg = appState.progress[appState.selectedDate];
            const templateExercises = appState.workouts[appState.activeSplit] || [];
            
            const currentExercises = templateExercises.filter(ex => {
                if (ex.createdAt && ex.createdAt > appState.selectedDate) return false;
                if (ex.deletedAt && ex.deletedAt <= appState.selectedDate) return false;
                return true;
            });
            
            selectedProg.customExercises = JSON.parse(JSON.stringify(currentExercises));
            saveState();
            renderSplit(appState.activeSplit);
        }

        if (revertBtn) {
            console.log("Revert button clicked via delegation!", revertBtn);
            if (confirm('Revert to the global template? Any custom exercises for this day will be lost.')) {
                console.log("Reversion confirmed.");
                const selectedProg = appState.progress[appState.selectedDate];
                delete selectedProg.customExercises;
                saveState();
                renderSplit(appState.activeSplit);
            } else {
                console.log("Reversion cancelled.");
            }
        }
    });
}

function openModal(exerciseId = null) {
    DOM.modal.classList.remove('hidden');

    if (exerciseId) {
        DOM.modalTitle.textContent = 'Edit Exercise';
        const selectedProg = appState.progress[appState.selectedDate];
        const isCustom = Array.isArray(selectedProg.customExercises);
        const targetArray = isCustom ? selectedProg.customExercises : appState.workouts[appState.activeSplit];

        const ex = targetArray.find(e => e.id === exerciseId);
        if (ex) {
            DOM.nameInput.value = ex.name;
            DOM.setsInput.value = ex.sets;
            DOM.repsInput.value = ex.reps;
            DOM.editingIdInput.value = ex.id;
        }
    } else {
        DOM.modalTitle.textContent = 'Add Exercise';
        DOM.nameInput.value = '';
        DOM.setsInput.value = '';
        DOM.repsInput.value = '';
        DOM.editingIdInput.value = '';
    }
}

function closeModal() {
    DOM.modal.classList.add('hidden');
}

function saveExercise() {
    const name = DOM.nameInput.value.trim();
    const sets = parseInt(DOM.setsInput.value) || 3;
    const reps = DOM.repsInput.value.trim() || '10'; // Allows strings like 'Till failure'
    const editingId = DOM.editingIdInput.value;

    if (!name) {
        alert("Please enter an exercise name");
        return;
    }

    const selectedProg = appState.progress[appState.selectedDate];
    const isCustom = Array.isArray(selectedProg.customExercises);
    const targetArray = isCustom ? selectedProg.customExercises : appState.workouts[appState.activeSplit];

    if (editingId) {
        // Edit existing
        const exIndex = targetArray.findIndex(e => e.id === editingId);
        if (exIndex > -1) {
            targetArray[exIndex] = { id: editingId, name, sets, reps };
        }
    } else {
        // Add new
        targetArray.push({
            id: generateId(),
            name, sets, reps,
            createdAt: appState.selectedDate
        });
    }

    saveState();
    renderSplit(appState.activeSplit);
    closeModal();
}

// --- PULSE AI Fitness Coach Logic ---
let aiChatHistory = [
    {
        sender: 'assistant',
        html: '⚡ Welcome to <strong>PULSE AI Fitness Coach</strong>!<br>Ask me anything about your workouts, muscle groups (e.g. <em>"What workouts for pull day?"</em>, <em>"Muscles working on Push day"</em>), or ask me to <strong>generate a full week workout plan</strong> for you!'
    }
];

function initAiCoach() {
    if (!DOM.aiFabBtn) return;

    // Load saved Gemini Key if exists
    const savedKey = localStorage.getItem('gymGeminiApiKey') || '';
    if (DOM.geminiKeyInput) DOM.geminiKeyInput.value = savedKey;

    DOM.aiFabBtn.addEventListener('click', openAiModal);
    if (DOM.closeAiBtn) DOM.closeAiBtn.addEventListener('click', closeAiModal);
    if (DOM.aiSettingsToggleBtn) {
        DOM.aiSettingsToggleBtn.addEventListener('click', () => {
            if (DOM.aiSettingsDrawer) DOM.aiSettingsDrawer.classList.toggle('hidden');
        });
    }

    if (DOM.saveGeminiKeyBtn) {
        DOM.saveGeminiKeyBtn.addEventListener('click', () => {
            const key = DOM.geminiKeyInput.value.trim();
            localStorage.setItem('gymGeminiApiKey', key);
            alert(key ? 'Gemini API Key saved!' : 'Gemini Key cleared. Using built-in AI Fitness Engine.');
            if (DOM.aiSettingsDrawer) DOM.aiSettingsDrawer.classList.add('hidden');
        });
    }

    if (DOM.aiChatForm) {
        DOM.aiChatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = DOM.aiInput.value.trim();
            if (!query) return;
            DOM.aiInput.value = '';
            handleUserAiQuery(query);
        });
    }

    if (DOM.aiQuickChips) {
        DOM.aiQuickChips.addEventListener('click', (e) => {
            const chip = e.target.closest('.ai-chip');
            if (chip && chip.dataset.query) {
                handleUserAiQuery(chip.dataset.query);
            }
        });
    }

    renderAiChatHistory();
}

function openAiModal() {
    if (DOM.aiModal) DOM.aiModal.classList.remove('hidden');
    renderAiChatHistory();
    if (DOM.aiInput) DOM.aiInput.focus();
}

function closeAiModal() {
    if (DOM.aiModal) DOM.aiModal.classList.add('hidden');
}

function renderAiChatHistory() {
    if (!DOM.aiChatHistory) return;
    DOM.aiChatHistory.innerHTML = '';

    aiChatHistory.forEach(msg => {
        const div = document.createElement('div');
        div.className = `ai-msg ${msg.sender}`;

        const headerHtml = msg.sender === 'assistant' 
            ? `<div class="msg-header"><i class="fas fa-robot"></i> PULSE AI COACH</div>` 
            : `<div class="msg-header" style="color:var(--neon-green)">YOU</div>`;

        div.innerHTML = `
            ${headerHtml}
            <div class="msg-bubble">${msg.html || msg.text}</div>
        `;
        DOM.aiChatHistory.appendChild(div);
    });

    // Delegate click handler for AI Action buttons inside bubbles
    DOM.aiChatHistory.querySelectorAll('.ai-add-ex-btn').forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault();
            const split = btn.dataset.split;
            const name = btn.dataset.name;
            const sets = btn.dataset.sets;
            const reps = btn.dataset.reps;
            addExerciseFromAi(split, name, sets, reps, btn);
        };
    });

    DOM.aiChatHistory.querySelectorAll('.ai-apply-week-btn').forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault();
            const weekDataRaw = btn.dataset.weekplan;
            try {
                const weekData = JSON.parse(decodeURIComponent(weekDataRaw));
                applyWeekPlanFromAi(weekData, btn);
            } catch (err) {
                console.error("Weekplan parse error:", err);
            }
        };
    });

    DOM.aiChatHistory.scrollTop = DOM.aiChatHistory.scrollHeight;
}

async function handleUserAiQuery(userText) {
    aiChatHistory.push({ sender: 'user', text: escapeHtml(userText) });
    renderAiChatHistory();

    // Add typing indicator placeholder
    const loadingMsgObj = { sender: 'assistant', html: '<i class="fas fa-spinner fa-spin"></i> Analyzing fitness data...' };
    aiChatHistory.push(loadingMsgObj);
    renderAiChatHistory();

    const responseData = await fetchAiResponse(userText);
    
    // Replace loading placeholder
    aiChatHistory.pop();
    aiChatHistory.push({ sender: 'assistant', html: responseData.html });
    renderAiChatHistory();
}

async function fetchAiResponse(query) {
    const apiKey = localStorage.getItem('gymGeminiApiKey');
    if (apiKey) {
        try {
            const prompt = `You are PULSE AI, a Cyberpunk Gym Coach. User query: "${query}". 
Respond concisely in HTML (use standard tags like <strong>, <p>, <ul>, <li>). 
Focus strictly on relevant workouts. Respect any equipment constraints mentioned (e.g. no equipment / bodyweight, dumbbells only, full gym) and targeted body parts (chest, biceps, triceps, back, shoulders, legs, abs, push, pull). 
Whenever suggesting exercises, list each exercise clearly with sets and reps.`;
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            });
            const data = await res.json();
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                const text = data.candidates[0].content.parts[0].text;
                return parseAiTextToHtml(text);
            }
        } catch (e) {
            console.warn("Gemini API call failed, falling back to built-in AI Fitness Engine:", e);
        }
    }

    // Use built-in Cyberpunk AI Fitness Knowledge Engine
    return generateBuiltInAiResponse(query);
}

const EXERCISE_KNOWLEDGE_BASE = {
    no_equipment: {
        chest: [
            { name: 'Standard Push-ups', sets: 3, reps: 15, split: 'chest' },
            { name: 'Wide-Grip Push-ups', sets: 3, reps: 12, split: 'chest' },
            { name: 'Decline Push-ups (Feet Elevated)', sets: 3, reps: 10, split: 'chest' },
            { name: 'Chest Dips (Parallel / Chair)', sets: 3, reps: 12, split: 'chest' },
            { name: 'Diamond Push-ups', sets: 3, reps: 10, split: 'chest' }
        ],
        biceps: [
            { name: 'Doorway Bicep Curls', sets: 3, reps: 15, split: 'biceps' },
            { name: 'Towel Resistance Bicep Curls', sets: 3, reps: 12, split: 'biceps' },
            { name: 'Underhand Inverted Rows', sets: 3, reps: 10, split: 'biceps' },
            { name: 'Chin-ups (Underhand Grip)', sets: 3, reps: 8, split: 'biceps' }
        ],
        triceps: [
            { name: 'Diamond Push-ups', sets: 3, reps: 12, split: 'triceps' },
            { name: 'Bench / Chair Dips', sets: 3, reps: 15, split: 'triceps' },
            { name: 'Cobra Push-ups', sets: 3, reps: 12, split: 'triceps' },
            { name: 'Bodyweight Tricep Extensions', sets: 3, reps: 10, split: 'triceps' }
        ],
        back: [
            { name: 'Bodyweight Inverted Rows', sets: 3, reps: 12, split: 'back' },
            { name: 'Doorway Rows', sets: 3, reps: 15, split: 'back' },
            { name: 'Superman Hold & Raises', sets: 3, reps: 15, split: 'back' },
            { name: 'Reverse Snow Angels', sets: 3, reps: 15, split: 'back' },
            { name: 'Overhand Pull-ups', sets: 3, reps: 8, split: 'back' }
        ],
        shoulders: [
            { name: 'Pike Push-ups', sets: 3, reps: 10, split: 'shoulders' },
            { name: 'Elevated Feet Pike Push-ups', sets: 3, reps: 8, split: 'shoulders' },
            { name: 'Bear Crawl Shoulder Taps', sets: 3, reps: 20, split: 'shoulders' },
            { name: 'Wall Handstand Hold', sets: 3, reps: '30s', split: 'shoulders' }
        ],
        legs: [
            { name: 'Bodyweight Air Squats', sets: 4, reps: 20, split: 'legs' },
            { name: 'Bodyweight Walking Lunges', sets: 3, reps: 15, split: 'legs' },
            { name: 'Bulgarian Split Squats', sets: 3, reps: 12, split: 'legs' },
            { name: 'Jump Squats', sets: 3, reps: 15, split: 'legs' },
            { name: 'Single-leg Calf Raises', sets: 4, reps: 20, split: 'legs' }
        ],
        abs: [
            { name: 'Bodyweight Crunches', sets: 3, reps: 20, split: 'abs' },
            { name: 'Plank Hold', sets: 3, reps: '60s', split: 'abs' },
            { name: 'Mountain Climbers', sets: 3, reps: '30s', split: 'abs' },
            { name: 'Hanging Leg / Knee Raises', sets: 3, reps: 15, split: 'abs' },
            { name: 'Russian Twists', sets: 3, reps: 20, split: 'abs' }
        ]
    },
    dumbbells: {
        chest: [
            { name: 'Flat Dumbbell Bench Press', sets: 4, reps: 10, split: 'chest' },
            { name: 'Incline Dumbbell Press', sets: 3, reps: 10, split: 'chest' },
            { name: 'Dumbbell Chest Flyes', sets: 3, reps: 12, split: 'chest' },
            { name: 'Dumbbell Pullover', sets: 3, reps: 12, split: 'chest' },
            { name: 'Dumbbell Floor Press', sets: 3, reps: 10, split: 'chest' }
        ],
        biceps: [
            { name: 'Dumbbell Bicep Curls', sets: 3, reps: 12, split: 'biceps' },
            { name: 'Dumbbell Hammer Curls', sets: 3, reps: 12, split: 'biceps' },
            { name: 'Incline Dumbbell Curls', sets: 3, reps: 10, split: 'biceps' },
            { name: 'Dumbbell Concentration Curls', sets: 3, reps: 10, split: 'biceps' }
        ],
        triceps: [
            { name: 'Overhead Dumbbell Extension', sets: 3, reps: 12, split: 'triceps' },
            { name: 'Dumbbell Kickbacks', sets: 3, reps: 15, split: 'triceps' },
            { name: 'Dumbbell Close-Grip Press', sets: 3, reps: 10, split: 'triceps' },
            { name: 'Single-Arm Dumbbell Extension', sets: 3, reps: 12, split: 'triceps' }
        ],
        back: [
            { name: 'Single-Arm Dumbbell Row', sets: 3, reps: 10, split: 'back' },
            { name: 'Two-Arm Dumbbell Bent Rows', sets: 3, reps: 10, split: 'back' },
            { name: 'Dumbbell Renegade Rows', sets: 3, reps: 10, split: 'back' },
            { name: 'Dumbbell Shrugs', sets: 3, reps: 15, split: 'back' }
        ],
        shoulders: [
            { name: 'Dumbbell Shoulder Press', sets: 3, reps: 10, split: 'shoulders' },
            { name: 'Dumbbell Lateral Raises', sets: 4, reps: 15, split: 'shoulders' },
            { name: 'Arnold Press', sets: 3, reps: 10, split: 'shoulders' },
            { name: 'Dumbbell Front Raises', sets: 3, reps: 12, split: 'shoulders' },
            { name: 'Dumbbell Rear Delt Flyes', sets: 3, reps: 15, split: 'shoulders' }
        ],
        legs: [
            { name: 'Dumbbell Goblet Squats', sets: 4, reps: 10, split: 'legs' },
            { name: 'Dumbbell Walking Lunges', sets: 3, reps: 12, split: 'legs' },
            { name: 'Dumbbell Romanian Deadlifts', sets: 3, reps: 10, split: 'legs' },
            { name: 'Dumbbell Bulgarian Split Squats', sets: 3, reps: 10, split: 'legs' },
            { name: 'Dumbbell Calf Raises', sets: 4, reps: 20, split: 'legs' }
        ],
        abs: [
            { name: 'Weighted Dumbbell Crunches', sets: 3, reps: 15, split: 'abs' },
            { name: 'Dumbbell Russian Twists', sets: 3, reps: 20, split: 'abs' },
            { name: 'Dumbbell Side Bends', sets: 3, reps: 15, split: 'abs' },
            { name: 'Dumbbell Woodchoppers', sets: 3, reps: 15, split: 'abs' }
        ]
    },
    gym: {
        chest: [
            { name: 'Barbell Bench Press', sets: 4, reps: 8, split: 'chest' },
            { name: 'Incline Dumbbell Press', sets: 3, reps: 10, split: 'chest' },
            { name: 'Cable Chest Flyes', sets: 3, reps: 12, split: 'chest' },
            { name: 'Chest Dips', sets: 3, reps: 10, split: 'chest' },
            { name: 'Pec Deck Flyes', sets: 3, reps: 12, split: 'chest' }
        ],
        biceps: [
            { name: 'Barbell Bicep Curls', sets: 3, reps: 10, split: 'biceps' },
            { name: 'Dumbbell Hammer Curls', sets: 3, reps: 12, split: 'biceps' },
            { name: 'EZ-Bar Preacher Curls', sets: 3, reps: 10, split: 'biceps' },
            { name: 'Cable High Pulley Curls', sets: 3, reps: 12, split: 'biceps' }
        ],
        triceps: [
            { name: 'Tricep Rope Pushdowns', sets: 3, reps: 12, split: 'triceps' },
            { name: 'Overhead Cable Extensions', sets: 3, reps: 12, split: 'triceps' },
            { name: 'EZ-Bar Skullcrushers', sets: 3, reps: 10, split: 'triceps' },
            { name: 'Close-Grip Bench Press', sets: 3, reps: 8, split: 'triceps' }
        ],
        back: [
            { name: 'Barbell Deadlifts', sets: 3, reps: 5, split: 'back' },
            { name: 'Overhand Pull-ups', sets: 3, reps: 8, split: 'back' },
            { name: 'Barbell Bent Over Rows', sets: 3, reps: 10, split: 'back' },
            { name: 'Lat Pulldowns', sets: 3, reps: 12, split: 'back' },
            { name: 'Seated Cable Rows', sets: 3, reps: 12, split: 'back' }
        ],
        shoulders: [
            { name: 'Barbell Overhead Press', sets: 3, reps: 10, split: 'shoulders' },
            { name: 'Dumbbell Lateral Raises', sets: 4, reps: 15, split: 'shoulders' },
            { name: 'Face Pulls (Cable)', sets: 3, reps: 15, split: 'shoulders' },
            { name: 'Machine Shoulder Press', sets: 3, reps: 10, split: 'shoulders' }
        ],
        legs: [
            { name: 'Barbell Back Squats', sets: 4, reps: 8, split: 'legs' },
            { name: 'Leg Press Machine', sets: 3, reps: 10, split: 'legs' },
            { name: 'Barbell Romanian Deadlifts', sets: 3, reps: 10, split: 'legs' },
            { name: 'Leg Extensions', sets: 3, reps: 15, split: 'legs' },
            { name: 'Lying Leg Curls', sets: 3, reps: 12, split: 'legs' },
            { name: 'Standing Calf Raises', sets: 4, reps: 20, split: 'legs' }
        ],
        abs: [
            { name: 'Hanging Leg Raises', sets: 3, reps: 15, split: 'abs' },
            { name: 'Cable Rope Crunches', sets: 3, reps: 15, split: 'abs' },
            { name: 'Ab Wheel Rollouts', sets: 3, reps: 12, split: 'abs' },
            { name: 'Plank Hold', sets: 3, reps: '60s', split: 'abs' }
        ]
    }
};

function generateBuiltInAiResponse(query) {
    const q = query.toLowerCase();

    // 1. Detect Equipment Level
    let equipment = 'gym';
    let equipmentTitle = 'Gym Equipment';
    if (q.includes('no equipment') || q.includes('without equipment') || q.includes('no gear') || q.includes('without gear') || q.includes('bodyweight') || q.includes('calisthenic') || q.includes('at home') || q.includes('home workout')) {
        equipment = 'no_equipment';
        equipmentTitle = 'No Equipment (Bodyweight)';
    } else if (q.includes('dumble') || q.includes('dumbell') || q.includes('dumbbell') || q.includes('dumbles') || q.includes('dumbells') || q.includes('only dumb')) {
        equipment = 'dumbbells';
        equipmentTitle = 'Dumbbells Only';
    }

    const eqData = EXERCISE_KNOWLEDGE_BASE[equipment];

    // 2. Check for Full Week Plan Request
    if (q.includes('week') || q.includes('full plan') || q.includes('schedule') || q.includes('routine')) {
        const weekPlan = {
            push: [
                ...eqData.chest.slice(0, 2).map(ex => ({ ...ex, split: 'push' })),
                ...eqData.shoulders.slice(0, 2).map(ex => ({ ...ex, split: 'push' })),
                ...eqData.triceps.slice(0, 1).map(ex => ({ ...ex, split: 'push' }))
            ],
            pull: [
                ...eqData.back.slice(0, 3).map(ex => ({ ...ex, split: 'pull' })),
                ...eqData.biceps.slice(0, 2).map(ex => ({ ...ex, split: 'pull' }))
            ],
            legs: eqData.legs.slice(0, 5),
            chest: eqData.chest.slice(0, 4),
            back: eqData.back.slice(0, 4),
            shoulders: eqData.shoulders.slice(0, 3),
            biceps: eqData.biceps.slice(0, 3),
            triceps: eqData.triceps.slice(0, 3),
            abs: eqData.abs.slice(0, 3)
        };

        const encodedData = encodeURIComponent(JSON.stringify(weekPlan));

        const html = `
            <p>Here is a complete <strong>Weekly Routine (${equipmentTitle})</strong> tailored for your equipment level:</p>
            <ul>
                <li><strong>Push / Chest & Shoulders</strong>: ${weekPlan.push.length} Exercises</li>
                <li><strong>Pull / Back & Biceps</strong>: ${weekPlan.pull.length} Exercises</li>
                <li><strong>Legs Workout</strong>: ${weekPlan.legs.length} Exercises</li>
                <li><strong>Abs & Core</strong>: ${weekPlan.abs.length} Exercises</li>
            </ul>
            <div class="ai-apply-week-container">
                <button class="ai-apply-week-btn" data-weekplan="${encodedData}">
                    <i class="fas fa-bolt"></i> ⚡ Apply ${equipmentTitle} Plan to Gym Tracker
                </button>
            </div>
        `;
        return { html };
    }

    // 3. Detect Targeted Muscles / Body Parts
    let targetMuscles = [];
    if (q.includes('chest') || q.includes('pec') || q.includes('bench press')) targetMuscles.push('chest');
    if (q.includes('bicep') || q.includes('biceps') || q.includes('arm curl') || q.includes('curls')) targetMuscles.push('biceps');
    if (q.includes('tricep') || q.includes('triceps') || q.includes('pushdown')) targetMuscles.push('triceps');
    if (q.includes('back') || q.includes('lat') || q.includes('pulldown') || q.includes('deadlift')) targetMuscles.push('back');
    if (q.includes('shoulder') || q.includes('shoulders') || q.includes('delt') || q.includes('delts')) targetMuscles.push('shoulders');
    if (q.includes('leg') || q.includes('legs') || q.includes('squat') || q.includes('quad') || q.includes('hamstring') || q.includes('calf') || q.includes('calves') || q.includes('glute')) targetMuscles.push('legs');
    if (q.includes('ab') || q.includes('abs') || q.includes('core') || q.includes('crunch') || q.includes('plank')) targetMuscles.push('abs');

    // Handle Push or Pull specifically if user typed push day or pull day
    const isPushDay = q.includes('push') || q.includes('push day');
    const isPullDay = q.includes('pull') || q.includes('pull day');

    let exercisesToReturn = [];
    let titleHtml = '';

    if (targetMuscles.length > 0) {
        // Precise muscle targeting requested!
        targetMuscles.forEach(m => {
            if (eqData[m]) {
                exercisesToReturn.push(...eqData[m]);
            }
        });
        const muscleNames = targetMuscles.map(m => m.toUpperCase()).join(' & ');
        titleHtml = `<p><strong>${muscleNames} Workout (${equipmentTitle}):</strong></p>
        <p>Here are targeted <strong>${muscleNames}</strong> exercises specifically for your equipment level:</p>`;
    } else if (isPushDay) {
        // Push Day requested
        exercisesToReturn = [
            ...eqData.chest.slice(0, 2).map(ex => ({ ...ex, split: 'push' })),
            ...eqData.shoulders.slice(0, 2).map(ex => ({ ...ex, split: 'push' })),
            ...eqData.triceps.slice(0, 1).map(ex => ({ ...ex, split: 'push' }))
        ];
        titleHtml = `<p><strong>Push Day Routine (${equipmentTitle}):</strong></p>
        <p>Targets your <strong>Chest, Shoulders & Triceps</strong>:</p>`;
    } else if (isPullDay) {
        // Pull Day requested
        exercisesToReturn = [
            ...eqData.back.slice(0, 3).map(ex => ({ ...ex, split: 'pull' })),
            ...eqData.biceps.slice(0, 2).map(ex => ({ ...ex, split: 'pull' }))
        ];
        titleHtml = `<p><strong>Pull Day Routine (${equipmentTitle}):</strong></p>
        <p>Targets your <strong>Back & Biceps</strong>:</p>`;
    } else {
        // Equipment only specified OR General Query
        exercisesToReturn = [
            eqData.chest[0],
            eqData.biceps[0],
            eqData.legs[0],
            eqData.shoulders[0],
            eqData.triceps[0]
        ].filter(Boolean);

        titleHtml = `<p><strong>Custom Workout Recommendation (${equipmentTitle}):</strong></p>
        <p>You can ask for specific body parts (e.g. <em>"chest without equipment"</em>, <em>"biceps with dumbbells"</em>, <em>"legs"</em>)! Here are top picks:</p>`;
    }

    let cardsHtml = exercisesToReturn.map(ex => `
        <div class="ai-ex-card">
            <div class="ai-ex-info">
                <h5>${ex.name}</h5>
                <span>${ex.sets} Sets × ${ex.reps} Reps • ${ex.split.toUpperCase()}</span>
            </div>
            <button class="ai-add-ex-btn" data-split="${ex.split}" data-name="${ex.name}" data-sets="${ex.sets}" data-reps="${ex.reps}">
                <i class="fas fa-plus"></i> Add
            </button>
        </div>
    `).join('');

    const html = `
        ${titleHtml}
        <div class="ai-ex-list">${cardsHtml}</div>
    `;

    return { html };
}

function parseAiTextToHtml(text) {
    let cleanHtml = text.replace(/\n/g, '<br>');
    return { html: cleanHtml };
}

function addExerciseFromAi(targetSplit, name, sets, reps, btnElement) {
    appState.workouts = ensureDefaultWorkouts(appState.workouts);

    if (!appState.workouts[targetSplit]) {
        appState.workouts[targetSplit] = [];
    }

    const newEx = {
        id: generateId(),
        name: name,
        sets: parseInt(sets) || 3,
        reps: String(reps) || '10',
        createdAt: appState.selectedDate
    };

    const selectedProg = appState.progress[appState.selectedDate];
    const isCustom = Array.isArray(selectedProg.customExercises);

    if (isCustom) {
        selectedProg.customExercises.push(newEx);
    } else {
        appState.workouts[targetSplit].push(newEx);
    }

    saveState();

    // Auto-switch to the target split tab (and switch split mode if necessary) so the user immediately sees the exercise!
    if (!SPLIT_MODES[appState.splitMode].includes(targetSplit)) {
        if (['chest', 'back', 'shoulders', 'biceps', 'triceps'].includes(targetSplit)) {
            appState.splitMode = 'bro';
        } else if (['push', 'pull'].includes(targetSplit)) {
            appState.splitMode = 'ppl';
        }
    }
    appState.activeSplit = targetSplit;

    renderSplitTabs();
    renderSplit(targetSplit);

    if (btnElement) {
        btnElement.classList.add('added');
        btnElement.innerHTML = `<i class="fas fa-check"></i> Added to ${targetSplit.toUpperCase()}`;
    }
}

function applyWeekPlanFromAi(weekPlanData, btnElement) {
    for (const splitKey in weekPlanData) {
        if (Array.isArray(weekPlanData[splitKey]) && weekPlanData[splitKey].length > 0) {
            appState.workouts[splitKey] = weekPlanData[splitKey].map(ex => ({
                id: generateId(),
                name: ex.name,
                sets: ex.sets || 3,
                reps: ex.reps || 10,
                createdAt: appState.selectedDate
            }));
        }
    }
    appState.workouts = ensureDefaultWorkouts(appState.workouts);

    saveState();
    renderSplitTabs();
    renderSplit(appState.activeSplit);

    if (btnElement) {
        btnElement.innerHTML = `<i class="fas fa-check-circle"></i> Applied to All Days!`;
        btnElement.style.background = 'var(--neon-green)';
        btnElement.style.color = 'var(--bg-dark)';
    }

    alert('Full Week Routine applied successfully to your Gym Tracker!');
}

function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Fire!
init();
