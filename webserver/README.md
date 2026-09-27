# 🎬 Movie Recommendation Backend (Spring Boot)

## 📌 Overview

This is the Spring Boot backend service for the movie recommendation system.

It acts as a bridge between:

- Frontend (Next.js)
- ML Service (Flask + FAISS)

The backend handles API requests, communicates with the ML service, and retrieves movie metadata from the database.

---

## 🧠 Responsibilities

- Expose REST APIs for frontend  
- Call ML service using WebClient  
- Fetch movie details from database  
- Preserve ranking returned by ML service  
- Return clean API responses  

---

## 🏗️ Architecture

Frontend (Next.js)  
        ↓  
Spring Boot Backend  
        ↓  
Flask ML Service  
        ↓  
FAISS + Embeddings  

---

## 🚀 API Endpoints

### 🔍 Search Movies

POST /movies/search  

Request:
{
  "query": "movies like interstellar"
}

Response:
{
    movieIds: [1,2,3]
  }

---

### 👤 User Recommendations

POST /movies/recommend  

Request:
{
  "user": { ... }
}

Response:

  {
    movieIds: [1,2,3]
  }


---

## ⚙️ Tech Stack

- Java 17+  
- Spring Boot  
- Spring WebFlux (WebClient)  
- JPA / Hibernate  
- MySQL / PostgreSQL (or any relational DB)  

---

## 🔧 Key Features

- Integration with ML microservice  
- Ranking preserved from ML results  
- Clean API layer using DTOs  
- Scalable service design  

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

This backend enables:

Semantic Search  
+  
Personalized Recommendations  
+  
Microservice Communication  

It is designed to be scalable, modular, and production-ready
