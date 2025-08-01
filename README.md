# Polyglot Journey - Language Learning Backend

A comprehensive Node.js/Express backend for an AI-powered language learning platform. This application helps users learn new languages through structured 8-week learning paths, personalized content, and Gemini AI integration.

## Features

- User authentication and profile management
- Customized 8-week learning paths based on language selection
- Gemini AI integration for personalized learning content
- Progress tracking and weekly assessments
- Spaced repetition system for vocabulary
- RESTful API with comprehensive documentation

## Tech Stack

- Node.js
- Express
- MongoDB with Mongoose
- JWT Authentication
- Google Gemini AI
- Swagger API Documentation

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Google Gemini API key

### Installation

1. Clone the repository
2. Install dependencies

```bash
npm install
```

3. Set up environment variables by creating a `.env` file based on `.env.example`
4. Start the development server

```bash
npm run dev
```

## API Documentation

The API documentation is available at `/api/docs` when the server is running. It provides detailed information about all available endpoints, request/response formats, and authentication requirements.

## Database Models

- **User**: Stores user information, authentication details, and learning preferences
- **Language**: Available languages for learning
- **LearningPath**: 8-week structured learning paths for each language and level
- **Lesson**: Individual learning materials within each learning path
- **Progress**: Tracks user progress through learning paths

## Learning Path Structure

Each learning path is designed for an 8-week program with:

- Weekly themes and objectives
- Daily lessons and exercises
- Weekly assessments
- Vocabulary tracking with spaced repetition
- AI-generated personalized content

## Gemini AI Integration

The platform leverages Google's Gemini AI to provide:

- Personalized learning content based on user level
- Conversation practice in the target language
- Feedback on writing and speaking exercises
- Custom weekly assessments
- Language-specific explanations and examples

## Data Seeding

To populate the database with initial data:

```bash
node src/data/seedData.js
```

To clear all data:

```bash
node src/data/seedData.js -d
```

