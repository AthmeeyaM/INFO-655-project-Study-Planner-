# Study Planner

## Project Overview

**Study Planner** is a React-based web application designed to help students manage their academic tasks, schedules, and notes efficiently. Built as part of the INFO655 Web Programming course at Drexel University, this project demonstrates proficiency in React concepts, including component interaction, state management, custom hooks, context API, conditional rendering, and styling. It also incorporates features like browser notifications which shows the understanding of the curiculum 

The application is hosted on GitHub Pages at: [https://AthmeeyaM.github.io/INFO-655-project-Study-Planner-/](https://AthmeeyaM.github.io/INFO-655-project-Study-Planner-/).

### Scope and Contents

- **Component Interaction**: Components like `Dashboard`, `TaskList`, `CalendarPage`, `NotesSection`, and `Settings` share data via custom hooks and context.
- **Data Sharing**: The `useTasks` hook centralizes task management, while `DarkModeContext` and `NotificationContext` manage global settings.
- **Custom Hooks**: `useTasks` encapsulates task-related logic with localStorage persistence.
- **Styles**: Inline CSS with dynamic theming for light/dark modes.
- **Conditional Rendering**: Dynamic UI updates based on task status, section edits, and settings toggles.

The project is deployed on GitHub Pages using `HashRouter` to handle routing in a static environment.

## Features

- **Dashboard** (`Dashboard.jsx`):
  - Add, edit, and delete tasks with due dates, times, and notification settings.
  - Toggle task completion with a checkbox.
  - Displays pending and completed tasks separately with styled differentiation.
  - Integrates dark mode theming via `DarkModeContext`.

- **Task Manager** (`TaskList.jsx`):
  - Organize tasks into customizable sections (e.g., "General," "Work").
  - Add, edit, rename, and delete sections.
  - Edit tasks inline with due dates, times, and notification settings.
  - Persistent storage via `useTasks` hook and `localStorage`.

- **Calendar** (`CalendarPage.jsx`):
  - View tasks on a calendar interface using `react-calendar`.
  - Click a date to see tasks due on that day, displaying titles and times.
  - Supports dark mode styling.

- **Notes** (`NotesSection.jsx`):
  - Create, edit, and delete notes with titles and descriptions.
  - View full note details in a modal dialog.
  - Grid layout for notes with truncation and dark mode support.
  - LocalStorage persistence for notes.

- **Settings** (`Settings.jsx`):
  - Toggle dark mode globally using `DarkModeContext`.
  - Enable/disable browser notifications via `NotificationContext`.

- **Navbar** (`Navbar.jsx`):
  - Responsive sidebar navigation with links to all pages.
  - Adapts to dark mode with dynamic styling.

- **Custom Hooks** (`useTasks.js`):
  - Manages tasks and sections with CRUD operations (Create, Read, Update, Delete).
  - Sorts tasks by due date and persists data in `localStorage`.

- **Contexts**:
  - `DarkModeContext.js`: Global dark mode state with `localStorage` persistence and body style updates.
  - `NotificationContext.js`: Manages notification settings and schedules browser notifications for tasks.

## How to Run the Project

### Prerequisites
- **Node.js** (v16 or later recommended) and **npm** installed.
- Git installed for cloning the repository.

### Steps to Run Locally
1. **Clone the Repository**:
```bash
git clone https://github.com/AthmeeyaM/INFO-655-project-Study-Planner-.git
cd INFO-655-project-Study-Planner-
```

2. **To install dependencies**:
```bash
npm install
```

2. **Run the code**:
```bash
npm run dev
```
### Steps to deploy
1. **Build the Project**
```bash
npm run build
```

2. **Deploy**
```bash
npm run deploy
```

### Deployed Site

My project app is running live at https://AthmeeyaM.github.io/INFO-655-project-Study-Planner-/

## Use Cases

### Use Case 1: Managing Daily Tasks

- **User**: A student preparing for midterms.
- **Action**:
  - Navigate to `/dashboard`.
  - Add a task: "Review Chapter 5" with due date "2025-03-22" and time "14:00," setting a 2-hour notification.
  - Toggle the task as completed once finished.
- **Outcome**: Task appears in "Pending Tasks," moves to "Completed Tasks" when checked, and a notification fires 2 hours before 2:00 PM on March 22, 2025.

### Use Case 2: Organizing Tasks by Category

- **User**: A student juggling coursework and projects.
- **Action**:
  - Go to `/tasks`.
  - Add a section "CS Projects" via the "New Section" button.
  - Add "Finish React App" to "CS Projects" with a due date.
  - Drag "Review Chapter 5" from "General" to "CS Projects."
- **Outcome**: Tasks are organized by section, and dragging persists the change in `localStorage`.

### Use Case 3: Checking Due Dates

- **User**: A student planning study sessions.
- **Action**:
  - Visit `/calendar`.
  - Click "March 22, 2025" to see "Finish React App" due at 14:00.
- **Outcome**: Calendar displays tasks for the selected date, aiding in scheduling.

### Use Case 4: Taking Study Notes

- **User**: A student summarizing lectures.
- **Action**:
  - Go to `/notes`.
  - Click "Add Note," enter "Lecture 3: Hooks" with a description.
  - View the note in a dialog, then edit it to add more details.
- **Outcome**: Notes are saved, editable, and viewable in a modal.

### Use Case 5: Customizing Experience

- **User**: A student preferring a dark theme.
- **Action**:
  - Navigate to `/settings`.
  - Enable "Dark Mode" and "Notifications."
- **Outcome**: App switches to dark theme, and notifications are enabled for tasks.

## Shortcomings and Potential Improvements

### Shortcomings

- Drag-and-drop in `TaskList` option can rearrange tasks between sections.
- Calendar doesn’t visually mark dates with tasks.
- Could have improved the UI in the calendar page and overall.

### Improvements

- Add task reordering within sections using `react-beautiful-dnd`.
- Store notification schedules in `localStorage` or a backend.
- Enhance `CalendarPage` with date markers for tasks using `tileContent`.

## Project Highlights

- **Custom Hook**: `useTasks` provides a reusable, centralized task management system.
- **Theming**: Seamless dark mode across all components with context.
- **Notification**: Ability to toggle notification preference.