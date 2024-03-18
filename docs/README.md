# The Prancing Pony

A RESTful API for a multi-vendor restaurant.

## Table of Contents

1. [Overview](#overview)
2. [Architecture Decisions](#architecture-decisions)
   1. [Tech Stack Selection](#tech-stack-selection)
   2. [Security Measures](#security-measures)
   3. [Authentication Strategy](#authentication-strategy)
   4. [Database Planning](#database-design-decisions-planning)
   5. [Database Record Deletion](#database-design-decisions-record-deletion)
   6. [Development Approach](#development-approach)
   7. [Code Quality and Maintainability](#code-quality-and-maintainability)
3. [Installation](#installation)
4. [Usage](#usage)
5. [Contributing](#contributing)
6. [License](#license)
7. [Bibliography](#bibliography)

## Overview

Welcome to 'The Dancing Pony' - a culinary journey through the heart of Middle Earth. Envisioned by Frogo Baggins, this cozy multi-vendor restuarant complex aims to bring Middle Earthean dishes to life.

This API has it all! From robust federated authentication - through to a well-designed database. Every decision aims to create a seamless and secure space for both restuarant managers and customers, and of course for Frogo Baggins himself.

## Architecture Decisions

The significant architectural decisions made during the project.

### [Tech Stack Selection]

- **Decision:** Decided on TypeORM, MySQL, Node.js, Express.js, and SwaggerUI for the development.
- **Context:** I picked these as I believe they fit well in the specifications of the project requirements while facilitating a streamlined dev process.
- **Alternatives Considered:** I compared Laravel, Spring Boot, and Express.js. Ultimately, I chose Express.js for it's familiarity, community support, and ✨TypeScript✨.
- **Consequences:** Streamlined development, improved security awareness during the dev process with well-supported libraries like Sonar, RedHat and npm audit.
- **Challenges** Minimal prior expreience with ORMs, OAuth 2.0 and Swagger.

### [Security Measures]

- **Decision:** Implemented security measures like environment variables and following Red Hat, Sonar, and network security practices.
- **Context:** Security is a top priority. Protecting of Personal Information and ensuring compliance with industry standards is vital in the modern age.
- **Alternatives Considered:** Explored various security practices, including encryption for cookies, HTTPS, encryption algorithms, multi-factor authentication, and continuous monitoring. I've chosen to implement measures incrementally based on risk and priority.
- **Consequences:** Enhanced code robustness and security. Challenges arose with implementing OAuth and federated authentication as those were new challenges for me.

### [Authentication Strategy]

- **Decision:** Passwords suck - used Microsoft MSAL library for modern authentication instead.
- **Context:** Authentication is a critical aspect of the application, and the decision aimed to ensure a both accessible and secure user authentication process.
- **Alternatives Considered:** Explored other authentication methods: Simple password hashing, OAuth with JWT tokens and Google Authentication. Chose MSAL for its compatibility with Microsoft identity management services and cost effectiveness of Azure.
- **Consequences:** Massively improved authentication reliability, security, accessiblity and presentation.
- **Challenges** Library integration and adapting Microsoft's documentation to my use case were pretty challenging .

### [Database Design Decisions: Planning]

- **Decision:** Ensured proper planning and normalization of the database before implementation, followed by subsequent de-normalization during development with TypeORM to facilitate maintainability.
- **Context:** A well-structured database is vital. I focused on normalization principles like introducing junction tables like `Order_Dish` and `Role_Privilege` and all non-prime attributes depend on their primary key alone. I also removed multi-valued 'enum' dependencies like Role privileges and Ratings scores.
- **Alternatives Considered:** Explored different database planning approaches, like NoSQL and reduced normalization for Agile optimization. Chose a partially normalized approach to ensure data integrity as well as ease of maintenance.
- **Consequences:** The decision facilitated a structured database design, supporting future scalability and modularity and reduced most data redundancy (selective de-normalization).

### [Database Design Decisions: Record Deletion](ADRs/RecordDeletion.md)

- **Decision:** Defined onDelete logic for key entity relationships in the database schema.
- **Context:** Ensuring proper management of data integrity and cascading actions in various entity relationships.
- **Details:** Established onDelete rules for relationships such as RESTRICT, CASCADE, and SET NULL based on specific business needs.
- **Consequences:** Enhanced database reliability, consistency, and aligned behavior with application requirements.
- **Challenges:** Balancing cascading actions and constraints for optimal data handling in complex relationships.

### [Development Approach]

- **Decision:** Adopted a lean and agile development approach.
- **Context:** Agile methodologies align with the project's dynamic nature, allowing for flexibility and adaptability to changing requirements. Examples include de-normalization of the database and the use of SwaggerUi for UI.
- **Alternatives Considered:** Considered waterfall development but I chose to develop in a lean and agile nature and to accommodate evolving project needs.
- **Consequences:** Focused on high-level design initially, deferring low-level optimizations like defining varchar lengths and avoiding excessive componentization and object orientation. Allowed for adaptability.

### [Code Quality and Maintainability]

- **Decision:** Used TypeScript with custom interfaces for better maintenance and debugging.
- **Context:** Code quality and maintainability are essential for long-term project success, and the decision to use TypeScript facilitated great coding practices that enhance readability and collaboration while maintaining the flexibility of JavaScript.
- **Alternatives Considered:** Explored other coding practices, including the use of JavaScript and less strict typing and a PropType linting approach. Chose TypeScript for its static/passive typing benefits and improved developer experience.
- **Consequences:** Ensured a maintainable codebase, avoiding the use of 'any' type variables. The decision supports collaboration and I'm sure eliminated a few runtime errors ahead of time.

## Installation

Guidelines for installing and setting up The Prancing Pony.

```
# Using npm
npm install
npm start

# Using yarn
yarn install
yarn start
```

Create a .env file with the following parameters:

```
NODE_ENV=''
HOST_URL=''
NODE_PORT=''

AZURE_CLIENT_ID=''
AZURE_TENANT_ID=''
AZURE_CLIENT_SECRET=''

EXPRESS_SESSION_SECRET=''

DB_HOST=''
DB_PORT=''
DB_USERNAME=''
DB_PASSWORD=''
DB_NAME=''

REDIRECT_URI=''
POST_LOGOUT_REDIRECT_URI=''
GRAPH_API_ENDPOINT=''
```

## Usage

Access the api directly using the host URL using the `HOST_URL` on the correct `NODE_PORT`
Access the API using the provided Swagger UI on `http://<<HOST_URL>>:<<NODE_PORT>>/api/docs`
