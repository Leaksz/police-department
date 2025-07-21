# Police Department API - TypeScript Implementation

## 🚀 About This Project

This project is my TypeScript implementation of a police department API challenge originally proposed by **WebTech/LEVTY - Journey Backend**. I didn't know it was happening until it was already over the period of registration, so I decided to complete the challenge independently, adding TypeScript for enhanced type safety and developer experience.

The API manages **agents and police cases** with full CRUD operations, following RESTful principles and modern Node.js development practices.

---

## 🎯 Features

### Core Functionality

-   **RESTful API** for managing police agents and cases
-   **TypeScript** implementation with strict type checking
-   **In-memory storage** using arrays (as per original challenge requirements)
-   **Modular architecture** with controllers, routes, and repositories
-   **Express.js** server with proper middleware configuration
-   **Comprehensive error handling** with custom response bodies
-   **API documentation** with Swagger/OpenAPI specification

---

## 🛠️ Tech Stack

-   **Node.js** - Runtime environment
-   **TypeScript** - Type-safe JavaScript with strict compilation
-   **Express.js v5** - Modern web framework
-   **Swagger/OpenAPI** - Interactive API documentation
-   **UUID v11** - Unique identifier generation
-   **TSX** - TypeScript execution and hot reload
-   **tsc-alias** - Path mapping resolution
-   **dotenv** - Environment variable management

---

## 📁 Project Structure

```
📦 police-department
│
├── package.json
├── tsconfig.json
├── .env
│
├── src/
│ ├── controllers/
│ │ ├── agentsController.ts
│ │ └── casesController.ts
│ │
│ ├── repositories/
│ │ ├── agentsRepository.ts
│ │ └── casesRepository.ts
│ │
│ ├── routes/
│ │ ├── agentsRoutes.ts
│ │ └── casesRoutes.ts
│ │
│ ├── types/
│ │ ├── agent.types.ts
│ │ ├── case.types.ts
│ │ └── response.types.ts
│ │
│ ├── utils/
│ │ ├── agentValidations.ts
│ │ ├── caseValidations.ts
│ │ ├── generateMockData.ts
│ │ ├── hasValidationErrors.ts
│ │ ├── parse.ts
│ │ └── response.ts
│ │
│ └── server.ts
│
├── build/ (compiled JavaScript)
└── README.md
```

---

## 🚀 Use Guide

### Prerequisites

-   Node.js (v16 or higher)
-   npm

### Installation

1. **Clone the repository**

    ```bash
    git clone <your-repository-url>
    cd police-department
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Configure environment variables**

    ```bash
    # Create .env file in the root directory
    PORT=3000
    ```

4. **Start the development server**

    ```bash
    npm run dev
    ```

5. **For production build**
    ```bash
    npm run build
    npm start
    ```

The server will start at `http://localhost:3000`

### Available Scripts

-   `npm run dev` - Start development server with hot reload using TSX
-   `npm run watch` - Start development server with file watching
-   `npm run build` - Compile TypeScript to JavaScript with path resolution
-   `npm start` - Start server from compiled build

---

## 📋 API Endpoints

### 👮 Agents (`/agents`)

| Method   | Endpoint      | Description             |
| -------- | ------------- | ----------------------- |
| `GET`    | `/agents`     | List all agents         |
| `GET`    | `/agents/:id` | Get specific agent      |
| `POST`   | `/agents`     | Create new agent        |
| `PUT`    | `/agents/:id` | Update agent (complete) |
| `PATCH`  | `/agents/:id` | Update agent (partial)  |
| `DELETE` | `/agents/:id` | Delete agent            |

**Query Parameters:**

-   `GET /agents?role=Officer` - Filter by role
-   `GET /agents?sort=incorporationDate` - Sort by incorporation date (ascending)
-   `GET /agents?sort=-incorporationDate` - Sort by incorporation date (descending)

#### Agent Model

```typescript
interface Agent {
    id: string; // UUID
    name: string;
    incorporationDate: string; // YYYY/MM/DD format
    role: AgentRole; // Officer, Detective, Captain, Chief
}
```

### 📋 Cases (`/cases`)

| Method   | Endpoint     | Description            |
| -------- | ------------ | ---------------------- |
| `GET`    | `/cases`     | List all cases         |
| `GET`    | `/cases/:id` | Get specific case      |
| `POST`   | `/cases`     | Create new case        |
| `PUT`    | `/cases/:id` | Update case (complete) |
| `PATCH`  | `/cases/:id` | Update case (partial)  |
| `DELETE` | `/cases/:id` | Delete case            |

**Bonus Endpoints:**

-   `GET /cases?agentId=uuid` - Filter by agent ID
-   `GET /cases?status=Open` - Filter by status
-   `GET /cases/:caseId/agent` - Get case's assigned agent
-   `GET /cases/search?q=homicide` - Full-text search

#### Case Model

```typescript
interface Case {
    id: string; // UUID
    title: string;
    description: string;
    status: CaseStatus; // Open, Solved
    agentId: string; // UUID
}
```

---

## 📖 API Documentation

Interactive API documentation is available at:

```
http://localhost:3000/docs
```

The documentation is built with **Swagger UI** and follows **OpenAPI 3.0** specification.

---

## 🔍 Example Usage

### Create a new agent

```bash
POST /agents
Content-Type: application/json

{
  "name": "John Smith",
  "incorporationDate": "2020/03/15",
  "role": "Officer"
}
```

### Create a new case

```bash
POST /cases
Content-Type: application/json

{
  "title": "Vehicle Theft",
  "description": "Vehicle stolen in the downtown area",
  "status": "Open",
  "agentId": "401bccf5-cf9e-489d-8412-446cd169a0f1"
}
```

### Filter and sort agents

```bash
GET /agents?role=Detective&sort=-incorporationDate
```

### Search cases

```bash
GET /cases/search?q=theft downtown
```

---

## ⚡ TypeScript Enhancements

This implementation adds several TypeScript-specific improvements over the original JavaScript version:

### Type Safety & Architecture

-   **Strict type checking** with comprehensive type definitions
-   **Enum-based constants** for roles and statuses
-   **Modular type system** with dedicated type files
-   **Generic validation patterns** for reusable, type-safe input validation
-   **Interface segregation** for different request/response scenarios

### Enhanced Development Experience

-   **Hot reload** development with TSX
-   **Environment variable management** with dotenv
-   **Build optimization** with proper TypeScript compilation

### Mock Data Generation

-   **Automated test data** generation with realistic agent profiles
-   **Weighted role distribution** (60% officers, 30% detectives, 8% captains, 2% chiefs)
-   **Unique name generation** preventing duplicates
-   **Random date generation** within realistic ranges (2007-2024)

---

## 📝 Error Response Format

```json
{
    "status": 400,
    "message": "Invalid Parameters",
    "errors": {
        "status": "Status is not valid. Valid status are: Open, Solved",
        "agentId": "Provided agent id is not valid",
        "role": "Role is not valid. Valid roles are: Officer, Detective, Captain, Chief",
        "incorporationDate": "Incorporation date can't be in the future"
    }
}
```

---

## 🏆 Challenge Compliance

This implementation follows all the original challenge requirements:

✅ **RESTful API** with proper HTTP methods  
✅ **In-memory storage** using arrays  
✅ **Modular architecture** (routes → controllers → repositories)  
✅ **Express.js** server setup  
✅ **Error handling** with appropriate status codes  
✅ **Swagger documentation** available at `/docs`  
✅ **All bonus endpoints** implemented  
✅ **Custom error response bodies**
