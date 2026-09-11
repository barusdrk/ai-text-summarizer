# AI Text Summarizer

An AI-powered web application that summarizes long articles, emails, meeting notes, and documents into concise bullet points using the OpenAI API. The application includes user authentication, multiple summary lengths, keyword extraction, reading statistics, export options, dark mode, and summary history.

Demo Version

This application currently uses a mock AI summarizer for demonstration purposes.
The production version integrates with the OpenAI API.

---

## Demo Mode

This repository currently uses a mock AI summarizer to demonstrate the application's functionality without requiring an external AI API.

The AI integration layer has been designed so it can be replaced with the OpenAI API by updating the summarization route.

## Features

### Core Features

* AI-powered text summarization
* 5-bullet summary with key action items
* OpenAI API integration
* Clean and responsive interface
* Prompt engineering for structured summaries

### Authentication

* User registration
* User login
* JWT-based authentication
* Password hashing with bcrypt
* Protected API routes
* User profile
* Logout functionality

### Summarization

* Multiple summary lengths

  * Short (3 bullets)
  * Medium (5 bullets)
  * Detailed (10 bullets)
* Key action items
* Keyword extraction
* Summary history (saved per user)

### Productivity

* Copy summary to clipboard
* Export summary as PDF
* Download summary as Microsoft Word (.docx)

### Reading Statistics

* Word count
* Character count
* Sentence count
* Paragraph count
* Estimated reading time
* Estimated speaking time

### User Experience

* Responsive design
* Dark mode
* Theme preference saved locally
* Theme synchronization for authenticated users

---

## Technologies Used

### Frontend

* HTML5
* CSS3
* JavaScript (ES6)

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Authentication

* JSON Web Token (JWT)
* bcrypt

### AI

* OpenAI API

### Export Libraries

* jsPDF
* docx

---

## Project Structure

```text
ai-text-summarizer/
│
├── middleware/
│   └── auth.js
│
├── models/
│   └── User.js
│
├── public/
│   ├── index.html
│   ├── script.js
│   └── style.css
│
├── routes/
│   ├── ai.js
│   └── auth.js
│
├── .env
├── package.json
├── server.js
└── README.md
```

---

## Installation

Clone the repository.

```bash
git clone https://github.com/barusdrk/ai-text-summarizer.git
```

Navigate into the project directory.

```bash
cd ai-text-summarizer
```

Install dependencies.

```bash
npm install
```

Create a `.env` file.

```env
OPENAI_API_KEY=your_openai_api_key
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_secret
PORT=3000
```

Start the development server.

```bash
npm run dev
```

Or run in production.

```bash
npm start
```

Open your browser and visit:

```text
http://localhost:3000
```

---

## API Endpoints

### Authentication

| Method | Endpoint             | Description                    |
| ------ | -------------------- | ------------------------------ |
| POST   | `/api/auth/register` | Register a new user            |
| POST   | `/api/auth/login`    | Login and receive JWT          |
| GET    | `/api/auth/profile`  | Get authenticated user profile |
| POST   | `/api/auth/logout`   | Logout                         |
| PUT    | `/api/auth/theme`    | Update user theme              |

### AI

| Method | Endpoint         | Description              |
| ------ | ---------------- | ------------------------ |
| POST   | `/api/summarize` | Generate AI summary      |
| GET    | `/api/history`   | Retrieve summary history |
| DELETE | `/api/history`   | Clear summary history    |

---

## Usage

1. Register a new account.
2. Log in.
3. Paste or type text into the editor.
4. Choose the desired summary length.
5. Click **Summarize**.
6. Review the generated summary, action items, and keywords.
7. Copy the summary or export it as PDF or Word.
8. Access your saved summaries after logging in again.

---

## Current Features Checklist

* AI text summarization
* OpenAI API integration
* User authentication
* Password encryption
* Protected routes
* Multiple summary lengths
* Action items
* Keyword extraction
* Reading time estimation
* Speaking time estimation
* Word count
* Character count
* Sentence count
* Paragraph count
* Copy to clipboard
* Export to PDF
* Export to Word
* Summary history
* Dark mode
* Responsive interface

---

# License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Author

**Derek Barus**

GitHub: [@barusdrk](https://github.com/barusdrk)
