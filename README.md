# Real Life Bingo: A Vue.js-based Interactive Bingo Game

Real Life Bingo is a modern, interactive bingo game built with Vue.js and Firebase. This application allows users to create and join bingo games, providing a fun and engaging experience for players in various settings.

The project leverages Vue.js for the frontend, Firebase for backend services, and Vite for fast development and building. It offers features such as game creation, joining existing games, and real-time updates for an immersive multiplayer experience.

## Repository Structure

```
.
├── firebase.json
├── index.html
├── package.json
├── README.md
├── show-tree.sh
├── src
│   ├── App.vue
│   ├── components
│   │   ├── BingoBoard.vue
│   │   ├── ParticipantBoard.vue
│   │   └── PlayerBoard.vue
│   ├── constants.js
│   ├── firebaseConfig.js
│   ├── main.js
│   ├── router
│   │   └── index.js
│   ├── style.css
│   └── views
│       ├── CreateGame.vue
│       ├── Game.vue
│       ├── JoinGame.vue
│       ├── Landing.vue
│       ├── Lobby.vue
│       ├── NotFound.vue
│       └── ParticipantSelection.vue
└── vite.config.js
```

Key Files:

- `src/main.js`: Entry point of the Vue.js application
- `src/App.vue`: Root Vue component
- `src/router/index.js`: Vue Router configuration
- `src/firebaseConfig.js`: Firebase configuration and initialization
- `vite.config.js`: Vite build tool configuration
- `firebase.json`: Firebase hosting configuration

Important integration points:

- Firebase Firestore: Used for real-time data storage and synchronization
- Vue Router: Handles client-side routing

## Usage Instructions

### Installation

Prerequisites:

- Node.js (v22.0.0 or later)
- npm (v10.0.0 or later)

Steps:

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:
   ```
   npm install
   ```

### Getting Started

To run the application in development mode:

```
npm run dev
```

This command starts the Vite development server with the "secondary" mode.

### Building for Production

To build the application for production:

```
npm run build
```

For environment-specific builds:

- Default environment: `npm run build:default`
- Secondary environment: `npm run build:secondary`

### Deployment

To deploy the application to Firebase:

1. Ensure you have the Firebase CLI installed and are logged in
2. For the default project:
   ```
   npm run deploy:default
   ```
3. For the secondary project:
   ```
   npm run deploy:second
   ```

These commands will build the application for the respective environment and deploy it to Firebase.

### Configuration

The application uses environment variables for configuration. Create a `.env` file in the root directory with the following variables:

```
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
```

Replace `your_firebase_project_id` with your actual Firebase project ID.

### Common Use Cases

1. Creating a new game:

   - Navigate to the "/create" route
   - Fill in the game details
   - Click "Create Game"

2. Joining an existing game:

   - Navigate to the "/join" route
   - Enter the game code
   - Click "Join Game"

3. Playing a game:
   - After joining or creating a game, you'll be redirected to the game board
   - Mark items on your bingo card as they occur
   - The first player to complete a line wins!

### Troubleshooting

1. Issue: Firebase configuration errors

   - Problem: The application fails to connect to Firebase
   - Solution:
     1. Check that the Firebase configuration in `src/firebaseConfig.js` is correct
     2. Ensure that the Firebase project is properly set up in the Firebase Console
     3. Verify that the necessary Firebase services (Firestore, Hosting) are enabled

2. Issue: Build failures
   - Problem: The application fails to build
   - Solution:
     1. Check the console output for specific error messages
     2. Ensure all dependencies are installed: `npm install`
     3. Clear the npm cache: `npm cache clean --force`
     4. Delete the `node_modules` folder and reinstall dependencies

### Debugging

To enable debug mode:

1. Set the `NODE_ENV` environment variable to "development"
2. Add `console.log` statements in the code where needed
3. Use the browser's developer tools to inspect network requests and Vue component state

Log files can be found in the browser's console when running the application in development mode.

## Data Flow

The Real Life Bingo application follows a typical Vue.js and Firebase data flow:

1. User interacts with the Vue.js components in the browser
2. Vue components dispatch actions or commit mutations to the Pinia store
3. The store interacts with Firebase through the Firebase SDK
4. Firebase Firestore handles data persistence and real-time updates
5. Changes in Firestore trigger listeners in the application
6. The store updates its state based on the Firestore changes
7. Vue components reactively update to reflect the new state

```
[User] <-> [Vue Components] <-> [Pinia Store] <-> [Firebase SDK] <-> [Firestore]
```

Important technical considerations:

- Firestore security rules should be properly configured to ensure data integrity and access control
- The application should handle offline scenarios and data synchronization conflicts

## Infrastructure

The Real Life Bingo application uses Firebase for hosting and backend services. The main infrastructure components are defined in the `firebase.json` file:

Firebase Hosting:

- Source directory: Current directory (".")
- Ignored files: "firebase.json", hidden files, and "node_modules" directory
- Frameworks Backend: Configured to use the "europe-west1" region

Firebase services used:

- Firestore: For real-time data storage and synchronization
- Hosting: For serving the Vue.js application

The Firebase configuration (`src/firebaseConfig.js`) initializes the Firebase app and exports the Firestore database instance for use throughout the application.
