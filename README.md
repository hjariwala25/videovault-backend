# VideoVault Backend API

## 🚀 Live Demo

VideoVault: [https://videovault-iota.vercel.app](https://videovault-iota.vercel.app)

## 📋 Overview

VideoVault is a feature-rich video sharing platform designed with scalability and performance in mind. This repository contains the backend API that powers the VideoVault application, handling everything from authentication to video management, likes, comments, playlists, and subscriptions.

## 🛠️ Tech Stack

- **Node.js & Express.js**: Fast, unopinionated web framework
- **MongoDB & Mongoose**: NoSQL database with elegant ODM
- **JWT Authentication**: Secure authentication and authorization
- **Cloudinary**: Cloud-based media management
- **Multer**: Middleware for handling file uploads
- **Bcrypt**: Password hashing for security

## 🔥 Features

### 👤 User Management

- User registration and authentication
- JWT-based authorization with refresh tokens
- Password management
- Profile management (avatar, cover image)
- Watch history tracking

### 📹 Video Management

- Upload and publish videos
- Update video details
- Toggle publish status
- Video metrics (views, duration)
- Video search and discovery

### 👍 Engagement

- Like/dislike videos and comments
- Comment on videos
- Reply to comments
- Subscribe to channels
- Create and interact with tweets

### 📚 Content Organization

- Create and manage playlists
- Add/remove videos to playlists
- Customize playlist visibility

### 📊 Dashboard

- User channel metrics
- Content performance analytics

## 🗺️ API Endpoints

The API provides comprehensive endpoints for all features. Here's a summary of key endpoint categories:

### 👤 User API

- Authentication (register, login, logout, token refresh)
- Profile management (view, update details, change avatar/cover image)
- Password management
- Channel profiles and watch history

### 📹 Video API

- Video CRUD operations
- Toggle publish status
- Search and filtering

### 💬 Engagement API

- Comments (create, read, update, delete)
- Likes (toggle for videos and comments)
- Tweets (create, update, delete)
- Subscriptions (subscribe/unsubscribe, view subscribers)

### 📚 Content Organization

- Playlist management
- Add/remove videos to playlists

### 📊 Analytics

- Channel statistics
- Video performance metrics

For complete API documentation, check my [Postman Collection](https://www.postman.co/workspace/VideoVault~b3f939af-0efd-4233-89e9-381454b09308/collection/40708315-32ffcc91-0774-40cc-969a-a56dee07fae6)

## 📦 Installation & Setup

### Prerequisites

- Node.js (v14+)
- MongoDB
- Cloudinary account

### Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/hjariwala25/videovault-backend.git
   cd videovault-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the Server**

   ```bash
   npm run dev
   ```

## 🔄 API Integration

This backend service pairs with our [VideoVault Frontend](https://github.com/hjariwala25/videovault-frontend) built with Next.js, a powerful React framework for production-grade applications with server-side rendering, static site generation, and more.

## 👥 Contributing

If you wish to contribute to this project, please feel free to contribute.
    