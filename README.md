
![Logo](public\logo.png)

# My Task Planner - Frontend

My Task Planner - Frontend is an Angular-based single-page web application that provides the user interface for the My Task Planner system. It allows users to authenticate, view, and manage their boards and tasks. The frontend communicates with the backend API to perform operations on data. Built with the latest Angular framework, it delivers a modern user experience with clean, component-based code and dynamic views.
## Features

- **Authentication Flow:** Includes login and logout views that interact with the backend’s authentication endpoints. Only authenticated users can access task management features.
- **User Profile Management:** Users can view and update their personal information directly from the application.
- **Board Management:** Create, rename, and delete boards to organize workspaces or projects.
- **Task & Item Hierarchy:** Each board contains tasks, and each task supports multiple items/subtasks enabling multi-level task management.
- **Client-Side Routing:** Seamless navigation across views (e.g., boards, profile) using Angular Router without full page reloads.
- **Tailwind CSS Integration:** Utility-first styling approach using Tailwind CSS, enabling clean, consistent, and easily customizable UI components.
- **Dynamic Component-Based Architecture:** Built with Angular’s modular and reusable component system for maintainability and scalability.
- **Forms & Validation:** Uses Angular’s reactive forms with built-in validation and user-friendly error feedback to improve input handling and data integrity.
- **API Integration:** Communicates with the backend via secure, RESTful HTTP requests to manage and persist user data.

## Tech Stack

**Angular 19:** A powerful, component-based SPA framework offering advanced routing, reactive forms, and a scalable architecture.

**TypeScript:** Adds static typing to JavaScript, enabling early error detection and more maintainable code.

**Tailwind CSS:** Enables a rapid UI development cycle with a utility-first approach. Facilitates responsive design and simplifies maintaining a clean, consistent layout.

**Angular Reactive Forms:** Powers user interactions like login or registration with advanced validation and dynamic form generation.

**Bun:** Adopted as a fast, modern alternative to npm/yarn, providing rapid dependency installs and improved developer experience during local builds and testing.


## Deployment

This frontend application is deployed and maintained in a production environment through automated CI/CD pipelines. It is built using Angular’s production optimization tools and served as a static SPA.


This project is intended to be used in production as a deployed web client. Manual build or local run is not required for end users.


## Roadmap

- Implement role-based UI logic for shared boards: Display and restrict board actions based on user permissions defined in the backend (e.g., view-only vs. edit access).

- Support task due dates and reminders: Integrate date pickers and visual indicators for upcoming deadlines; display reminder banners or modal notifications.

- Add loading and empty states: Provide feedback during asynchronous operations (e.g., loading boards/tasks), and design empty states to improve user guidance.


## Authors

[**Diego Bustos**](https://github.com/DiegoBustos16)