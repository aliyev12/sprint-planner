# Sprint Planner

A real-time collaborative planning poker application for agile teams to estimate work efficiently.

<!-- ![Sprint Planner Demo](https://i.imgur.com/example.png) -->

## 📋 Overview

Sprint Planner is a full-stack web application that allows agile teams to participate in planning poker sessions remotely. Team members can join rooms, vote on estimations, and see real-time results.

### Key Features

- **Real-time collaboration** via WebSockets
- **Multiple estimation categories** (story points, time, complexity, etc.)
- **Customizable voting cards**
- **Admin controls** for managing sessions
- **Statistics and results** visualization
- **Dark/light mode** support
- **Responsive design** for desktop and mobile

## 🛠️ Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- React Router 7
- Socket.io Client
- Materialize CSS
- XState for state management
- React Toastify

### Backend

- Node.js
- Express
- Socket.io
- TypeScript

## 🚀 Getting Started

### Prerequisites

- Node.js >=18.x
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/aliyev12/sprint-planner.git
   cd sprint-planner
   ```

2. Install server dependencies:

   ```bash
   cd server
   npm install
   ```

3. Install client dependencies:
   ```bash
   cd ../client
   npm install
   ```

### Development

1. Start the server:

   ```bash
   cd server
   npm run dev
   ```

2. Start the client:

   ```bash
   cd client
   npm run dev
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

### Building for Production

1. Build the server:

   ```bash
   cd server
   npm run build
   ```

2. Build the client:
   ```bash
   cd client
   npm run build
   ```

## 🌐 Deployment

The application is configured for deployment on Render.com using the included `render.yaml` configuration.

### Deployment Configuration

```yaml
services:
  - type: web
    name: sprint-planner-backend
    env: node
    rootDir: server
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: CLIENT_URLS
        value: https://sprint-planner-frontend.onrender.com

  - type: web
    name: sprint-planner-frontend
    env: static
    rootDir: client
    buildCommand: npm install && npm run build
    staticPublishPath: ./dist
    envVars:
      - key: VITE_SERVER_URL
        value: https://sprint-planner-backend.onrender.com
```

## 🎮 How to Use

1. **Create a Room**:

   - Navigate to the home page
   - Enter your name and a room name
   - Click "Create"

2. **Join a Room**:

   - Enter an existing room ID
   - Enter your name
   - Click "Join"

3. **Admin Controls** (for room creator):

   - Edit categories and cards
   - Start voting sessions
   - End voting sessions
   - View statistics

4. **Participant Actions**:
   - Select estimation cards to vote
   - View real-time results when revealed
   - See who has and hasn't voted

## 📖 Usage Examples

### Creating a Room

1. Enter your name (e.g., "John")
2. Enter a room name (e.g., "Sprint 42 Planning")
3. Click "Create"
4. Share the generated room ID with your team

### Customizing Categories

1. As an admin, click "Edit" and select "Edit Categories"
2. Add new categories (e.g., "Story Points", "Time Estimate")
3. For each category, define the singular form (e.g., "Point", "Hour")
4. Save your changes

### Starting a Voting Session

1. Select the desired category
2. Click "Start Voting"
3. Wait for team members to cast their votes
4. Click "End Voting" to reveal results

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgements

- [Socket.io](https://socket.io/) for real-time communication
- [Materialize CSS](https://materializecss.com/) for UI components
- [XState](https://xstate.js.org/) for state management
- [Vite](https://vitejs.dev/) for frontend tooling
