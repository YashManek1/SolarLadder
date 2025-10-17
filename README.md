
# 🎨 Canvas Editor

A lightweight, web-based canvas editor where anyone can add and edit shapes/text. This project is a real-time collaborative canvas editor built with React and Firebase, allowing users to create shared canvases and edit them with a variety of tools.

---

## 🚀 Features

-   **Real-time Collaboration**: All changes are saved and synced in real-time using Firestore.
-   **Drawing Tools**: Draw rectangles, circles, and freehand using the pencil tool.
-   **Text Tool**: Add and edit text directly on the canvas.
-   **Image Import**: Import images from your local machine onto the canvas.
-   **Object Manipulation**: Select, move, resize, and delete objects easily.
-   **Export**: Export the entire canvas as a PNG image.

---

## 🛠️ Tech Stack

-   **React**: A JavaScript library for building user interfaces.
-   **Fabric.js**: A powerful and simple Javascript HTML5 canvas library.
-   **Firebase Firestore**: A NoSQL cloud database for real-time data syncing.
-   **Firebase Hosting**: Fast and secure web hosting.
-   **React Router**: For client-side routing.

---

## ⚙️ Getting Started

Follow these steps to set up the project locally.

### ✅ Prerequisites

Make sure you have **npm** installed:

```bash
npm install npm@latest -g
````

### 📦 Installation

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/yashmanek1/solarladder.git](https://github.com/yashmanek1/solarladder.git)
    cd solarladder
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up Firebase:**

      * Create a new Firebase project.
      * Create a `.env` file in the root of the project and add your Firebase configuration:

    <!-- end list -->

    ```
    REACT_APP_FIREBASE_API_KEY=your_api_key
    REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
    REACT_APP_FIREBASE_PROJECT_ID=your_project_id
    REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    REACT_APP_FIREBASE_APP_ID=your_app_id
    REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
    ```

### 🏃‍♂️ Running the Application

```bash
npm start
```

This will run the app in development mode. Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) to view it in the browser.

-----

## 🚀 Deployment

The application is deployed on Firebase Hosting. The `.github/workflows` directory contains GitHub Actions for automatic deployment on merge to the main branch and on pull requests.

-----

## 🧷 Special Mentions & Pro Tips

  - **Real-time collaboration:** The use of Firebase Firestore allows for seamless real-time updates across all connected clients.
  - **Modular component architecture:** The application is structured into modular components for better organization and reusability.
  - **Intuitive UX:** The user interface is designed to be intuitive and easy to use, with clear tool selection and property editing.
  - **Undo/Redo Functionality:** Basic undo/redo functionality could be a potential future enhancement for a more robust user experience.

<!-- end list -->

```
```
