<<<<<<< HEAD
# StreamHub API

A scalable REST API for a video-sharing platform built using Node.js, Express.js and MongoDB.

## Features

- JWT Authentication
- Refresh Tokens
- Video Upload
- Playlist Management
- Comments
- Likes
- Dashboard Analytics

## Tech Stack

- Node.js
- Express
- MongoDB
- Mongoose
- Cloudinary
- JWT

## Folder Structure

...
=======
# Streamify

A YouTube-style backend API built with Node.js, Express, and MongoDB. Streamify handles user auth, video hosting, comments, likes, playlists, subscriptions, tweets (short-text posts), and a creator dashboard — no frontend included, it's a pure REST API.
>>>>>>> aeb95f0 (Update files)

> Database design reference: [Model diagram](https://app.eraser.io/workspace/xpS7iPVYjiTFyAVhyjIZ)

## Tech stack

- **Runtime**: Node.js (ES modules)
- **Framework**: Express 4
- **Database**: MongoDB with Mongoose
- **Auth**: JWT (access + refresh tokens) via httpOnly cookies
- **File storage**: Cloudinary (avatars, cover images, video files, thumbnails)
- **Uploads**: Multer (local temp storage before pushing to Cloudinary)
- **Password hashing**: bcrypt

## Features

- User registration/login/logout with avatar + cover image upload
- Access/refresh token auth flow with token rotation
- Channel profiles with subscriber counts (via MongoDB aggregation pipelines)
- Watch history
- Video CRUD + publish toggle
- Comments on videos
- Likes on videos, comments, and tweets
- Playlists
- Subscriptions (follow/unfollow channels)
- Tweets (short text posts) with likes/comments
- Creator dashboard (channel stats, video list)
- Healthcheck endpoint

## Project structure

```
src/
├── controllers/    # Request handlers / business logic
├── db/             # MongoDB connection setup
├── middlewares/     # auth (JWT) and multer (file upload)
├── models/          # Mongoose schemas
├── routes/          # Express routers, one per resource
├── utils/           # ApiError, ApiResponse, asyncHandler, Cloudinary upload
├── app.js           # Express app setup, route mounting
├── constants.js      # App-wide constants (DB name, etc.)
└── index.js          # Entry point — loads env, connects DB, starts server
```

## Prerequisites

- Node.js (v18+ recommended)
- A MongoDB database (local instance or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)
- A [Cloudinary](https://cloudinary.com/) account (free tier is enough) for file uploads

## Setup

1. **Clone and install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment variables**

   Copy `.env.sample` to `.env` in the project root and fill in your own values:

   ```
   MONGODB_URI=<your MongoDB connection string, without a trailing db name>
   CORS_ORIGIN=*

   ACCESS_TOKEN_SECRET=<a long random string>
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_SECRET=<a different long random string>
   REFRESH_TOKEN_EXPIRY=10d

   CLOUDINARY_CLOUD_NAME=<from your Cloudinary dashboard>
   CLOUDINARY_API_KEY=<from your Cloudinary dashboard>
   CLOUDINARY_API_SECRET=<from your Cloudinary dashboard>
   ```

   The app connects to a database named `videotube` on whatever cluster `MONGODB_URI` points to (see `src/constants.js`) — you don't need to include the db name in the URI yourself.

3. **Run the dev server**

   ```bash
   npm run dev
   ```

   This runs `nodemon -r dotenv/config src/index.js`, which loads `.env` and restarts automatically on file changes.

4. **Verify it's running**

   ```bash
   curl http://localhost:8050/api/v1/healthcheck
   ```

The server listens on **port 8050** (hardcoded in `src/index.js`).

## API overview

All routes are prefixed with `/api/v1`. Routes marked 🔒 require a valid access token (cookie or `Authorization: Bearer <token>` header).

| Resource | Base path |
|---|---|
| Healthcheck | `/healthcheck` |
| Users (auth, profile) | `/users` |
| Videos | `/videos` 🔒 |
| Comments | `/comments` 🔒 |
| Likes | `/likes` 🔒 |
| Playlists | `/playlist` 🔒 |
| Subscriptions | `/subscriptions` 🔒 |
| Tweets | `/tweets` 🔒 |
| Dashboard | `/dashboard` 🔒 |

Key user endpoints:

| Method | Path | Description |
|---|---|---|
| POST | `/users/register` | Register (multipart: `avatar`, optional `coverimage`) |
| POST | `/users/login` | Log in, returns access + refresh tokens |
| POST | `/users/logout` 🔒 | Log out, clears cookies |
| POST | `/users/refresh-token` | Exchange refresh token for a new access token |
| POST | `/users/change-password` 🔒 | Change password |
| GET | `/users/current-user` 🔒 | Get logged-in user |
| PATCH | `/users/update-account` 🔒 | Update name/email |
| PATCH | `/users/avatar` 🔒 | Update avatar |
| PATCH | `/users/cover-image` 🔒 | Update cover image |
| GET | `/users/c/:username` 🔒 | Get a channel profile |
| GET | `/users/history` 🔒 | Get watch history |

## Notes

This is an actively evolving learning project — several controllers (video, comment, like, playlist, tweet, subscription, dashboard) were scaffolded ahead of the models and still have field-name mismatches and broken imports relative to the schemas in `src/models/`. Check the models as the source of truth for field names when fixing or extending these.
