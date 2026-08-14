# Gym Tracker PWA & PULSE AI Coach 🏋️‍♂️⚡

> **An offline-first Progressive Web Application (PWA) with built-in Cyberpunk PULSE AI Fitness Coach for tracking workouts, generating equipment-aware routines, and checking instant YouTube form tutorials.**

![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=flat-square&logo=javascript)
![PULSE AI Coach](https://img.shields.io/badge/AI-PULSE%20Fitness%20Coach-cyan?style=flat-square&logo=openai)
![YouTube Integration](https://img.shields.io/badge/YouTube-Video%20Tutorials-red?style=flat-square&logo=youtube)
![PWA](https://img.shields.io/badge/PWA-Offline%20Ready-purple?style=flat-square&logo=pwa)
![Theme](https://img.shields.io/badge/UI-Neon%20Dark-brightgreen?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)

---

## 🌟 Overview

**Gym Tracker PWA** is a mobile-first web app built for fast, distraction-free logging in gym and home environments. Powered by **PULSE AI Fitness Coach**, it offers intelligent equipment-aware workout suggestions, targeted muscle split routines, 1-click routine integration, and **integrated YouTube exercise form video tutorials**.

---

## ✨ Key Features

- 🤖 **PULSE AI Fitness Coach**: Floating Cyberpunk AI Assistant supporting built-in offline engine and optional Google Gemini 1.5 Flash API.
- 🏋️‍♂️ **Equipment-Aware Smart Parser**:
  - **No Equipment / Bodyweight** (`"without equipment"`, `"without dumbll"`, `"bodyweight"`)
  - **Dumbbells Only** (`"only i have dumbles"`, `"dumbbell"`)
  - **Full Gym Equipment** (`"barbell"`, `"cable"`, `"gym"`)
  - **Smart Negation Parsing**: Correctly understands queries like *"chest workout without dumbll"* and maps them to pure bodyweight routines.
- 🎯 **Specific Muscle Targeting**: Generates targeted workouts for **Chest, Biceps, Triceps, Back, Shoulders, Legs, and Abs** with 1-click **Add to Workout** buttons that auto-sync to your tracker tabs.
- 🔄 **Conversational Memory for Variations**: Remembers active workout context—type *"more"*, *"more variations"*, or *"give me more"* to receive a fresh batch of alternative exercise variations for your active muscle target & equipment.
- 🎬 **Dynamic YouTube Form Tutorials**: 1-click `<i class="fab fa-youtube"></i>` video links automatically generated for every exercise to check proper form on YouTube.
- 🏋️ **Pre-Configured Workout Splits**: Supports **Push/Pull/Legs (PPL)** and **Bro Split (Chest, Back, Shoulders, Legs, Biceps, Triceps, Abs)**.
- 📱 **Installable PWA**: Add to Home Screen on iOS and Android devices for native app usage.
- 💾 **Offline & Cloud Sync**: Saves custom workouts locally in `localStorage` with Firebase Google Auth cloud backup option.

---

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | HTML5, CSS3 (Neon Dark Theme), Vanilla JavaScript (ES6+) |
| **AI Engine** | Built-in Cyberpunk AI Fitness Engine & Google Gemini 1.5 Flash API |
| **Typography & Icons** | Google Fonts (Outfit), Font Awesome 6 |
| **Cloud Sync** | Firebase Authentication & Realtime Database |
| **API / Deep Links** | YouTube Dynamic Search API Query Parameters |
| **App Architecture** | Progressive Web App (PWA) & Service Workers |

---

## 🚀 Quick Start

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/SPARK-REX/Gym-tracker.git
   cd Gym-tracker
   ```

2. **Open in Browser:**
   Open `index.html` directly in your browser or run a local static server:
   ```bash
   python -m http.server 8080
   ```
   Navigate to `http://localhost:8080` in your browser.
