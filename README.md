
# The Bannered Stallion

A RESTful API for a multi-vendor restaurant.

## Table of Contents

1. [Overview](docs/#overview)
2. [Architecture Decisions](docs/#architecture-decisions)
   1. [Tech Stack Selection](docs/#tech-stack-selection)
   2. [Security Measures](docs/#security-measures)
   3. [Authentication Strategy](docs/#authentication-strategy)
   4. [Database Planning](docs/#database-design-decisions-planning)
   5. [Database Record Deletion](#database-design-decisions-record-deletion)
   6. [Development Approach](#development-approach)
   7. [Code Quality and Maintainability](#code-quality-and-maintainability)
3. [Installation](#installation)
4. [Usage](#usage)
5. [Contributing](#contributing)
6. [License](#license)
7. [Bibliography](#bibliography)

## Overview

Welcome to 'The Bannered Stallion' - a RESTful API for a multi-vendor restaurant inspired, in name and spirit, by the world-renowned taverns - The Bannered Mare of Skyrim and The Prancing Pony of Middle Earth.

This API includes robust federated identity management using Auth2.0, a well-designed, normalized database, security protections against cross-site request forgery, script injection and man-in-the-middle attacks. Every decision in this project aims to showcase my expression of a seamless production-focused backend software project, some considerations include the design of the software and infrastructure as a service layer, systems and functional layer, cybersecurity posture, developer experience, continuous integration, and adaptability, compliance and scalability considerations. The API serves to facilitate all viable multi-vendor user stories for network administrators, restaurant managers, and customers as end-users.

## Architecture Decisions

Some significant architectural decisions were made during the project.

### [Tech Stack Selection]

- **Decision:** Decided on a TypeScript foundation, MySQL with TypeORM, Node.js, Express.js, and SwaggerUI documentation.
- **Context:** These fit well to facilitate robust, production-ready product and scaling needs.
- **Alternatives Considered:** I compared PHP's Laravel for it's speed, but decided against it because of its less-intuitive nature leading to a smaller available talent pool, Spring Boot was the strongest option as it's robust, fast and simple to use but ultimately, I chose Express.js for the familiarity, large talent pool with community support, and TypeScript support.
- **Consequences:** Streamlined development, and improved security posture throughout the development process with well-supported libraries like Sonar, RedHat and NPM's Audit.
- **Challenges** Minimal prior experience with ORMs, OAuth 2.0 with Microsoft, ultimately learned a lot and enjoyed the process.

### [Security Measures]

- **Decision:** Implemented multiple security, namely protecting secrets by using environment variables, using encrypted cookies and sessions, preventing cross-site request forgery with key-based verification challenges, HTTPS, preventing script injection with input sanitization and query parameterization, also including various performance and security best practices from Sonar, Red Hat, and followed general network security practices.
- **Context:** Security is a top priority. Protecting personal information and ensuring compliance with industry standards is vital in the modern age.
- **Alternatives Considered:** Explored various security practices. I've chosen to implement measures incrementally based on risk and priority.
- **Consequences:** Enhanced code robustness and cybersecurity posture. Challenges arose with implementing OAuth and federated authentication but the authentication service was completed through reviewing the documentation.

### [Authentication Strategy]

- **Decision:** Passwords suck - utilized Microsoft MSAL library for robust modern authentication instead.
- **Context:** Authentication is a critical aspect of the application, and the decision aimed to ensure both an accessible and secure user authentication process.
- **Alternatives Considered:** Explored other authentication methods: Simple password hashing, OAuth with JWT tokens and Google Authentication. Choose MSAL for its compatibility with Microsoft identity management services and the cost-effectiveness of Azure.
- **Consequences:** Massively improved authentication reliability, security, accessibility and presentation.
- **Challenges** Library integration and adapting Microsoft's documentation to my use case were pretty challenging.

### [Database Design Decisions: Planning]

- **Decision:** Ensured proper planning and normalization of the database before implementation, followed by subsequent de-normalization during development with TypeORM to facilitate maintainability through Join tables to enable instantaneous join calculations.
- **Context:** A well-structured database is vital. I focused on normalization principles like introducing junction tables like `Order_Dish` and `Role_Privilege` and all non-prime attributes depend on their primary key alone. I also removed multi-valued 'enum' dependencies like Role privileges and Rating scores, replacing them with extensible database entities.
- **Alternatives Considered:** Explored different database planning approaches, like NoSQL and reduced normalization for Agile optimization. Choose a partially normalized approach to ensure data integrity, ease of maintenance, extensibility, and instantaneous joins.
- **Consequences:** The decision facilitated a structured database design, supporting future scalability and modularity and reducing most data redundancy with selective de-normalization.

### [Database Design Decisions: Record Deletion](docs/ADRs/RecordDeletion.md)

- **Decision:** Defined onDelete logic for key entity relationships in the database schema.
- **Context:** Ensuring proper management of data integrity and cascading actions in various entity relationships.
- **Details:** Established onDelete rules for relationships such as RESTRICT, CASCADE, and SET NULL based on specific business needs.
- **Consequences:** Enhanced database reliability, consistency, and aligned behaviour with application requirements.
- **Challenges:** Balancing cascading actions and constraints for optimal data handling in complex relationships.

### [Development Approach]

- **Decision:** Adopted a lean and agile development approach.
- **Context:** Agile methodologies align with the project's dynamic nature, allowing for flexibility and adaptability to changing requirements. Examples include the de-normalization of the database and the use of SwaggerUi for UI.
- **Alternatives Considered:** Considered waterfall development but I chose to develop in a lean and agile nature and to accommodate evolving project needs.
- **Consequences:** Focused on high-level design initially, deferring low-level optimizations like defining varchar lengths and avoiding excessive componentization and object orientation. Allowed for adaptability, reducing early optimization, all while allowing for further fine-tuning during the staging phase.

### [Code Quality and Maintainability]

- **Decision:** Used TypeScript with custom interfaces for better maintenance and debugging.
- **Context:** Code quality and maintainability are essential for long-term project success, and the decision to use TypeScript facilitated great coding practices that enhance readability and collaboration while maintaining the flexibility of JavaScript.
- **Alternatives Considered:** Explored other coding practices, including the use of native JavaScript's less loose typing and with a PropType approach. I decided on TypeScript for its static/passive typing benefits which reduce run-time bugs and streamline the developer experience.
- **Consequences:** Ensured a maintainable codebase, avoiding the use of 'any' type variables. The decision supports collaboration and I'm sure eliminated a few runtime errors ahead of time.

## Installation

Guidelines for installation and setup.

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

# Further Context

## Disclaimer
`This project was completed through CodeSubmit.io as part of an open-ended hiring test for an intermediate-senior software developer position at a leading international retailer. Therefore, the initial development history is stored on CodeSubmit.io and unfortunately no longer accessible. For clarity, I've included the assessment briefing below.`

##  Assignment Brief

Your assignment is to implement a REST API for a restaurant.

### Brief

Frogo Baggins, a hobbit from the Shire, has a great idea. He wants to build a restaurant that serves traditional dishes from the world of Middle Earth. The restaurant will be called "The Dancing Pony" and will have a cozy atmosphere.

Frogo has hired you to build the website for his restaurant. As payment, he has offered you either a chest of gold or a ring. Choose wisely.

### Tasks (Specifications)

Deliver a REST API which meets the following requirements:

All functionality of the API must require a logged in user.

Users of the system must be able to register and login.
- At a minimum, the system should support password based authentication.
- Users must always have a name and email

The API needs authorization support for two roles, namely Administrators, and Customers.

Adminstrators must be able to take the following actions:
- Create, View, List, Update, and Delete dishes
- Dishes must always have a name, description, price, and image

Customers must be able to take the following actions:
- Search, View, and Rate dishes
- A dish can only be rated once per customer, and the rating can be updated.

#### Looking for more of a challenge?

If this was all a bit basic, then perhaps you can consider flexing by meeting some of the following bonus requirements:

- To prevent abuse, the API must have rate-limiting per logged in customer
- Allow users to login using OAuth2 based SSO (Google, etc)
- Allow multiple different restaurants to use the product (multi-tenant SaaS)

#### Constraints

- Implement the assignment using any language.
- Implement a REST API utilizing JSON for request and response bodies where applicable.

#### Tips, Advice, Guidance

- Your are encouraged to make use of a web framework, sql ORM, etc. This will help reduce the overhead of writing boilerplate code, and will let you focus on the core requirements.
- You are welcome to make use of AI to help write the code.
- This assessment is open ended, and candidates could spend weeks crafting the perfect API. We encourage you to timebox yourself, and limit the amount of time you spend. When we talk through the assessment, this can be provided as an input, and it is good to talk about the trade-offs made given the time constraint. We recommend about 6-8 hours of focused time.
- This assessment is used for Juniors and Seniors.
  - For junior candidates, start simple and focus on the more approachable code segments first. It's ok to not meet all the requirements.
  - For intermeidate and senior candidates, the expectations are higher, and the solution needs to reflect your capabilities as an intermediate/senior.

### Evaluation Criteria

The test will be evaluated based on functional and non-functional requirements.

For functional requirements, your API needs to work, and meet all the requirements as provided.

For non-functional requirements, your API needs to be production-ready to a reasonable extent. We
are looking for adherence to qualities such as testability, maintainability, observability, and security.

### Supporting Assets

You've been provided with a docker-compose file which will bring up a postgres database and prometheus. These are optional and provided to help get started.

#### Postgres

You can connect to the database via localhost:5432 using the username and password configured in the docker-compose.yml.

#### Prometheus

You can configure prometheus via the provided prometheus.yml file.

### CodeSubmit

Please organize, design, test, and document your code as if it were going into production - then push your changes to the master branch. After you have pushed your code, you may submit the assignment on the assignment page.

Best of luck, and happy coding!
