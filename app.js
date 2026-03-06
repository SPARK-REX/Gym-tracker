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

let appState = {
    workouts: { ...DEFAULT_WORKOUTS, ...(JSON.parse(localStorage.getItem('gymWorkouts')) || {}) },
    splitMode: localStorage.getItem('gymSplitMode') || 'ppl',
    activeSplit: 'push',
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
    syncMergeBtn: document.getElementById('sync-merge-btn')
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
try {
    if (typeof firebase !== 'undefined') {
        firebase.initializeApp(firebaseConfig);
        auth = firebase.auth();
        db = firebase.database();

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

    db.ref('users/' + currentUser.uid + '/appState').once('value').then(snapshot => {
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
            saveDataToFirebase();
            DOM.syncStatus.innerHTML = `Connected as <b>${currentUser.displayName || currentUser.email}</b><br><small style="color:var(--neon-green)">Synced</small>`;
            isSyncing = false;
        }
    }).catch(err => {
        console.error("Firebase load error:", err);
        DOM.syncStatus.innerHTML = `Connected as <b>${currentUser.displayName || currentUser.email}</b><br><small style="color:var(--neon-red)">Sync Failed</small>`;
        isSyncing = false;
    });
}

function applyCloudData(val) {
    appState.workouts = val.workouts || DEFAULT_WORKOUTS;
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
    // Merge workouts: prefer local custom exercises, add any cloud-only splits
    const mergedWorkouts = { ...DEFAULT_WORKOUTS };
    // Apply cloud workouts first
    if (cloudVal.workouts) {
        for (const key in cloudVal.workouts) {
            mergedWorkouts[key] = cloudVal.workouts[key];
        }
    }
    // Then local workouts override (local is more recent on this device)
    for (const key in appState.workouts) {
        mergedWorkouts[key] = appState.workouts[key];
    }

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
            const targetSplit = p.splitCompleted || appState.activeSplit || SPLIT_MODES[appState.splitMode][0];
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
        DOM.splitSelector.appendChild(btn);
    });
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
    const isCompletedSplit = selectedProg.splitCompleted === splitName;
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

    if (splitName === 'rest') {
        DOM.splitTitle.textContent = 'Rest Day';
        DOM.exerciseList.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:20px;">Take a break! No exercises for this day.</p>';
        DOM.splitProgressBar.style.width = '0%';
        DOM.splitProgressBar.classList.remove('complete');
        DOM.splitStatusText.textContent = 'Rest Day';
        DOM.splitStatusText.className = 'status-text glow-text-white';
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
    const exercises = isCustom ? selectedProg.customExercises : (appState.workouts[splitName] || []);

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
        DOM.exerciseList.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:20px;">No exercises here. Add some!</p>';
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

        if (selectedProg.splitCompleted === splitName) {
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
            if (!auth) return alert("Firebase not configured! Please add your config in app.js.");
            const provider = new firebase.auth.GoogleAuthProvider();
            auth.signInWithPopup(provider).catch(err => {
                console.error(err);
                alert("Sign-in error: " + err.message);
            });
        });
    }
    if (DOM.googleLogoutBtn) {
        DOM.googleLogoutBtn.addEventListener('click', () => {
            if (currentUser) {
                sessionStorage.removeItem('gymSyncChoiceMade_' + currentUser.uid);
            }
            if (auth) auth.signOut();
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
                    appState.workouts[appState.activeSplit] = appState.workouts[appState.activeSplit].filter(e => e.id !== id);
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
            selectedProg.customExercises = JSON.parse(JSON.stringify(templateExercises));
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
            name, sets, reps
        });
    }

    saveState();
    renderSplit(appState.activeSplit);
    closeModal();
}

// Fire!
init();
