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
    yearProgressBar: document.getElementById('year-progress-bar'),
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
    editingIdInput: document.getElementById('editing-exercise-id')
};

// --- Utilities ---
function getTodayDateString() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function saveState() {
    localStorage.setItem('gymWorkouts', JSON.stringify(appState.workouts));
    localStorage.setItem('gymProgress', JSON.stringify(appState.progress));
    localStorage.setItem('gymStreak', appState.streak);
    localStorage.setItem('gymLastStreakUpdate', appState.lastStreakUpdate);
    localStorage.setItem('gymSplitMode', appState.splitMode);
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
    updateYearProgress();
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

function updateYearProgress() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const daysInYear = (now.getFullYear() % 4 === 0 && now.getFullYear() % 100 !== 0) || now.getFullYear() % 400 === 0 ? 366 : 365;

    const percent = (dayOfYear / daysInYear) * 100;
    DOM.yearProgressBar.style.width = `${percent}%`;
}

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

    // Get monday of current week
    const currentDay = now.getDay();
    const distanceToMonday = currentDay === 0 ? 6 : currentDay - 1;
    const monday = new Date(now);
    monday.setDate(now.getDate() - distanceToMonday);

    const dayNames = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

        const isToday = dateStr === todayStr;
        const prog = appState.progress[dateStr];
        const isCompleted = prog && prog.splitCompleted;
        const isSelected = dateStr === appState.selectedDate;

        const node = document.createElement('div');
        node.className = `day-node ${isToday ? 'today' : ''} ${isCompleted ? 'completed' : ''} ${isSelected ? 'selected' : ''}`;
        node.dataset.date = dateStr;

        let innerHtml = `
            <span class="day-label">${dayNames[i]}</span>
            <div class="day-circle">${d.getDate()}</div>
        `;

        if (prog && prog.plannedSplit && prog.plannedSplit !== 'rest' && !isCompleted && dateStr > todayStr) {
            innerHtml += `<div class="planned-dot"></div>`;
        }

        node.innerHTML = innerHtml;

        node.addEventListener('click', () => {
            appState.selectedDate = dateStr;
            if (!appState.progress[dateStr]) {
                appState.progress[dateStr] = { splitCompleted: null, exercises: [], plannedSplit: null };
            }
            const p = appState.progress[dateStr];
            const targetSplit = p.splitCompleted || p.plannedSplit || appState.activeSplit || 'push';
            renderCalendar();
            renderSplit(targetSplit);
        });

        DOM.calendarContainer.appendChild(node);
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

    if (isFuture) {
        selectedProg.plannedSplit = splitName === 'rest' ? 'rest' : splitName;
        saveState();
        renderCalendar();
    }

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
        DOM.splitStatusText.textContent = isPast ? 'Rest Day' : 'Rest Planned';
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

// --- Event Handlers ---
function bindEvents() {
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
