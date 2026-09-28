# 🎬 Movie Recommendation Webserver

## 📌 Overview

This is the Spring Boot backend service for the ReelFinder movie recommendation system.

It acts as a bridge between:

- Frontend (Next.js)

- Agentic Recommendation Service (Flask + Ollama + FastMCP)

- PostgreSQL movie and user data

The backend handles API requests, communicates with the recommendation service, resolves returned movie IDs into full movie metadata, and sends structured responses to the frontend.

---

## 🧠 Responsibilities

- Expose REST APIs for the frontend

- Communicate with the Flask recommendation service using WebClient

- Support agent-driven semantic movie search

- Resolve recommended movie IDs from PostgreSQL

- Preserve recommendation ranking returned by the agent

- Manage users, movie metadata, and user interactions

- Return frontend-ready API responses

---

# 🏗️ Architecture

Frontend (Next.js)
        ↓
Spring Boot Backend
        ↓
Flask Recommendation Service
        ↓
Ollama Agent
        ↓
FastMCP Semantic Search
        ↓
Sentence Transformers + FAISS

---

## 🚀 API Endpoints

### 🔍 Search Movies

POST /recommender/movies/search

Request:

```json

{

  "query": "movies like Interstellar"

}

Response:
[

  {

    "movieId": 109487,

    "title": "Interstellar (2014)",

    "genres": "Sci-Fi IMAX",

    "posterUrl": "https://image.tmdb.org/t/p/w500/..."

  },

  {

    "movieId": 87306,

    "title": "Super 8 (2011)",

    "genres": "Mystery Sci-Fi Thriller IMAX",

    "posterUrl": "https://image.tmdb.org/t/p/w500/..."

  }

]

```
---

### 👤 Personalized Recommendations

POST /recommender/movies/recommend

Returns personalized movie recommendations based on the user's stored interactions and preferences.

The backend forwards recommendation data to the ML service and resolves the returned movie IDs into movie metadata.

---

## ⚙️ Tech Stack

- Java 17+  
- Spring Boot  
- Spring WebFlux (WebClient)  
- JPA / Hibernate  
- PostgreSQL

---
## 🔧 Key Features

- Integration with agentic recommendation microservice

- Natural-language semantic movie search

- PostgreSQL-backed movie, user, and interaction data

- Ranking preserved from recommendation results

- Clean API layer using DTOs

- Separation between application data and ML/retrieval services

---

## 🧪 Running the Service

### 1. Build project

mvn clean install  

### 2. Run application

mvn spring-boot:run  

---

## 🔗 ML Service Dependency

Make sure the Flask ML service is running:

http://localhost:4400  

---

## 🎯 Summary

This backend connects ReelFinder's frontend with:

Semantic Search + LLM Agent
+
Personalized Recommendations
+
PostgreSQL Persistence
+
ML Microservice Communication

It keeps application data and backend responsibilities separate from the recommendation and retrieval engine.
