<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white" alt="OpenAI" />
  
  <br />
  <br />

  # 🎯 AceIt.AI - Mock Interview Simulator
  
  **A full-stack, AI-driven mock interview and ATS scanning platform.**

</div>

---

## 📖 Welcome! How to Use This README
This document serves as both the **official GitHub documentation** and a **comprehensive technical interview cheat sheet**. It explains not just *what* tools were used, but **why** they were chosen, **how** they work together, and the **design patterns** implemented. If a hiring manager asks you about this project, everything you need to know is explicitly documented below.

---

## 📋 Table of Contents
1. [System Architecture Overview](#1-system-architecture-overview)
2. [Frontend Deep Dive (Client)](#2-frontend-deep-dive-client)
3. [Backend Deep Dive (Server)](#3-backend-deep-dive-server)
4. [AI Engineering & Prompt Design](#4-ai-engineering--prompt-design)
5. [Key Implementation Highlights](#5-key-implementation-highlights)
6. [Local Setup Instructions](#6-local-setup-instructions)

---

## 1. System Architecture Overview

AceIt.AI is built on a **Decoupled Client-Server Architecture** (often called a modern SPA backend pattern).
*   **The Client (React)** is completely separated from the server. It handles UI state, routing, and user experience securely in the browser.
*   **The Server (Node/Express)** acts as a stateless REST API layer. It contains the business logic, handles secret API keys (so they don't leak to the browser), and communicates directly with OpenAI.

> **💡 Interview Talking Point:**
> *"I chose a decoupled architecture over a traditional MVC (like Django/Ruby on Rails) or a monolith because it allows the React frontend and Node backend to scale independently. It also secures my OpenAI API keys entirely on the server rather than exposing them in the client browser, which is a critical security vulnerability in purely client-side AI apps."*

---

## 2. Frontend Deep Dive (Client)

The frontend is a **Single Page Application (SPA)** built to be incredibly fast, responsive, and visually distinct.

### 🛠 Tools Used & Why
*   **Vite (`vite`)**: Replaces standard Webpack/Create-React-App.
    *   **Why?** Vite uses native ES modules (`esbuild`) which makes the local dev server spin up instantly. It drastically improves developer experience (DX) and build times compared to legacy Webpack bundlers.
*   **React (`react`)**: The UI component library.
    *   **Why?** Its virtual DOM and massive ecosystem make building complex, state-heavy interactive pages (like the live Interview session) much easier to manage than vanilla JavaScript.
*   **Tailwind CSS (`tailwindcss`)**: A utility-first CSS framework.
    *   **Why?** Instead of maintaining thousands of lines of custom `.css` files, Tailwind allows for rapid prototyping using classes like `flex items-center text-slate-900`. This scales significantly better in teams and prevents CSS specificity bugs. *Note: We created a highly custom Midnight Indigo & White theme, moving far past generic Tailwind defaults to stand out.*
*   **React Router v6 (`react-router-dom`)**: Handles application routing.
    *   **Why?** Allows us to simulate a multi-page website without actually requesting new HTML pages from the server, resulting in zero-refresh page transitions.
*   **React Context API**: Used for state management (`AuthContext`, `InterviewContext`).
    *   **Why not Redux?** Redux is incredibly powerful but adds massive boilerplate. For an application tracking just a session ID, mock user profile, and current question, React's native Context API is perfectly sufficient, faster to implement, and lightweight.

---

## 3. Backend Deep Dive (Server)

The backend acts as a robust, asynchronous REST API.

### 🛠 Tools Used & Why
*   **Node.js & Express (`express`)**: The core server runtime and framework.
    *   **Why?** Since the frontend is React (JavaScript), using Node keeps the entire stack in a single language (JavaScript), allowing full-stack context switching without mental overhead. Express is the industry standard for lightweight, unopinionated routing.
*   **OpenAI SDK (`openai`)**: The official Node wrapper for OpenAI.
    *   **Why?** We interface with the `gpt-3.5-turbo` model for high-speed, cost-effective inference. It handles natural language understanding better than almost any other model for parsing candidate answers.
*   **CORS (`cors`)**: Cross-Origin Resource Sharing.
    *   **Why?** Browsers inherently block requests from `localhost:5173` (React) to `localhost:5000` (Node) for security reasons. The `cors` middleware explicitly allows our frontend origin to communicate with the API securely.
*   **PDFKit (`pdfkit`)**: Node module for PDF generation.
    *   **Why?** Used to programmatically compile and serve the downloadable "Question Bank" PDF. Generating PDFs on the server side ensures styling consistency regardless of what device the user is on.

---

## 4. AI Engineering & Prompt Design

The core of AceIt.AI is strictly controlled LLM (Large Language Model) interactions.

**The Problem with standard LLM apps:**
A common pitfall is that the AI will output random text, markdown, or chatty responses (e.g., *"Sure, here is your answer!"*). This completely breaks a React frontend that is expecting structured data to render scorecards and charts.

> **💡 Interview Talking Point:**
> *"I overcame LLM unpredictability through strict **System Prompt Engineering**. When a user submits an answer, I don't just ask the AI if it's correct. I specifically inject a prompt forcing the AI to act as a Senior Engineer and commanding it: '**You MUST respond with valid JSON in this exact format: {"score": number, "strengths": [], "weaknesses": []}**'. On the Express backend, I then parse this response using a `try/catch` block before serving it to React. If the AI hallucinates or breaks JSON structure, my backend catches the parsing error and safely throws a 500 status rather than crashing the client layout."*

---

## 5. Key Implementation Highlights

If asked about the most complex or interesting parts of this project, you can discuss these precise features:

### A. Dynamic Interview Personas
**The Feature:** Users can select if the AI should act "Standard", as a "Strict Tech Lead", or a "Friendly Mentor".
**How it works:** This is managed via React state on the Landing Page. The chosen persona string is passed in the REST API request payload. The backend then dynamically injects a unique string into the `system` role array of the OpenAI API call, completely shifting the model's grading criteria and tone.

### B. The ATS Resume Scanner
**The Feature:** Users can paste their resume and a target job description to get a match score and missing keywords.
**How it works:** This is entirely backend-driven. We created a separate `/api/ats-scan` endpoint. The backend combines the two massive strings into a heavily engineered OpenAI prompt, requesting statistical matches. The JSON response dynamically paints the UI (Green for >75% match, Red for <70%).

### C. Live Audio Visualizer Animation (Without heavy WebGL)
**The Feature:** When a user clicks "Record", the webcam placeholder transforms into an animated, pulsing audio equalizer.
**How it works:** Instead of relying on heavy JavaScript canvas loops or external 3D libraries, this was accomplished using pure, performant CSS keyframe animations. It simulates active audio tracking without bogging down the browser thread.

### D. Mock Authentication Flow
**The Feature:** A sleek sign-in popup utilizing Context and LocalStorage.
**How it works:** To demonstrate frontend security logic without configuring an entire PostgreSQL/OAuth database for a portfolio project, `AuthContext` was built. It stores a lightweight user object in the browser's `localStorage` and provides global `login` and `logout` functions, seamlessly mimicking a real JWT-based session architecture.

---

## 6. Local Setup Instructions

Prerequisites: Ensure you have [Node.js](https://nodejs.org/) installed.

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/yourusername/aceit-ai.git
cd aceit-ai
\`\`\`

### 2. Configure Environment Variables
Create a \`.env\` file in the \`server\` directory and add your OpenAI Key:
*(Note: If left blank, the app will safely route to highly optimized Mock Data fallbacks automatically!)*
\`\`\`env
OPENAI_API_KEY=your_api_key_here
PORT=5000
\`\`\`

### 3. Start the Backend Server
Open a terminal in the \`server\` folder:
\`\`\`bash
cd server
npm install
npm run dev
\`\`\`

### 4. Start the Frontend Client
Open a second terminal in the \`client\` folder:
\`\`\`bash
cd client
npm install
npm run dev
\`\`\`

### 5. Access the App
Open your browser and navigate to \`http://localhost:5173\`.

---

<div align="center">
  <i>Built with modern architectural standards. Designed to prove comprehensive full-stack capability.</i>
</div>
