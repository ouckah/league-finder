# League Finder

**A web app for finding other League of Legends players to team up with!**

## **Table of Contents**

- [Introduction](#introduction)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Future Enhancements](#future-enhancements)
- [Contributors](#contributors)
- [License](#license)

---

## **Introduction**

League Finder is a web application designed to help players of *League of Legends* connect with compatible teammates based on rank, role preferences, and region. Our platform enables users to create profiles, search for teammates, and interact with others through a matchmaking system.

---

## **Features**

### **Core Features:**

✅ **User Accounts** – Users can sign up, log in, and save their preferences.\
✅ **Profile Customization** – Set rank, preferred roles, and server region.\
✅ **Post System** – Players can create and filter posts to find teammates.\
✅ **Friend System** – Users can send and accept friend requests.\
✅ **Matchmaking Algorithm** – Posts can be filtered to match users with the best teammates.\
✅ **MongoDB Database** – Stores user data and preferences.

### **Extra Features:**

✨ **Riot API Integration** – Pull users' game stats and profile details.\
✨ **Match History & Performance Stats** – Users can view their recent games.\
✨ **Leaderboard & Reputation System** – A karma-based system for rating teammates.

---

## **Tech Stack**

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js
- **Database:** MongoDB
- **API Integration:** Riot Games API

---

## **Installation**

### **Prerequisites:**

- Node.js (v16+ recommended)
- MongoDB installed or access to a MongoDB Atlas database
- Riot Games API key

### **Setup Instructions:**

1. Clone the repository:
   ```sh
   git clone <GITHUB_REPO_URL>
   cd league-finder
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the root directory and add the following:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   RIOT_API_KEY=your_riot_api_key
   ```
4. Start the development server:
   ```sh
   npm start
   ```
5. Open `http://localhost:3000` in your browser.

---

## **Usage**

1. **Sign up or log in** to create an account.
2. **Set your profile** by selecting your rank, role preferences, and region.
3. **Create or browse posts** to find teammates.
4. **Send friend requests** to connect with potential teammates.
5. **Use Riot API integration** to check stats and performance.
6. **Rate teammates** using the reputation system.

---

## **Future Enhancements**

🚀 **Live Chat System** – In-app chat for users to communicate before teaming up.\
🚀 **Discord Bot Integration** – Automate team-finding via Discord.\
🚀 **Mobile-Friendly UI** – Optimize the platform for mobile users.\
🚀 **Advanced Filters** – Allow users to search based on additional criteria (win rate, champion pool, etc.).

---

## **Contributors**

- **Amane Chibana**
- **Aidan Ouckama**
- **Eddison So**
- **Jimmy Zhang**

---

## **License**

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

### **GitHub Repository:**

🔗 [Insert GitHub Repo Link Here]

