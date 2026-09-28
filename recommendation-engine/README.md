# 🎬 ML Recommendation Service (Semantic + Personalized)

## 📌 Overview

This recommendation engine powers the ML and agentic capabilities of **ReelFinder**, a full-stack movie discovery and personalized recommendation platform.

The service combines:

- Semantic search using Sentence Transformer embeddings
- FAISS-based vector similarity search
- Personalized recommendations using user interaction embeddings
- An Ollama-powered LLM agent for natural-language movie discovery
- FastMCP for exposing semantic retrieval as an MCP tool
- Structured agent responses for integration with the Spring Boot backend

The system supports two recommendation paths:

1. **Semantic Discovery** — users describe what they want to watch in natural language. An LLM agent determines whether semantic retrieval is required, constructs a retrieval-oriented query, invokes the MCP search tool, and formats the retrieved results.

2. **Personalized Recommendations** — user ratings, clicks, watch history, interaction recency, and genre preferences are combined into a personalized user vector and compared against movie embeddings.

The recommendation engine runs as a Python microservice and integrates with the ReelFinder Spring Boot backend.

---

# 🧠 Key Features

## 🔍 1. Semantic Search

- Uses an Ollama-powered agent to interpret natural-language movie queries

- Agent decides when semantic retrieval is required and invokes the search capability through a FastMCP server

- Converts the agent's semantic query → Sentence Transformer embedding

- Retrieves top-K similar movies using FAISS

- Returns retrieved movie metadata to the agent for a grounded response

- Supports queries like: “movies like Interstellar”, “horror movies like The Conjuring”

---

## 👤 2. Personalized Recommendations

- Builds user embeddings using:
  - Ratings
  - Clicks
  - Watch history
  - Recency
  - Genre preferences

- Combines:Interaction Vector + Preference Vector → User Embedding

-  Retrieves recommendations via vector similarity
---
## ⚖️ 3. Retrieval & Filtering

- Semantic similarity (embedding-based)
- Content-type filtering (movies vs documentaries)
- Balanced retrieval (avoids bias in results)

---

# 🏗️ Architecture

Client (Spring Boot)

↓

Flask ML Service

↓

Ollama Agent

↓

FastMCP Semantic Search Tool

↓

Embeddings Model (Sentence Transformers)

↓

FAISS Index (Vector Search)

↓

Movie Metadata (Pandas / CSV)

---

# ⚙️ Tech Stack

- Python 3.10+
- Flask
- Sentence Transformers (MiniLM)
- FAISS (vector search)
- NumPy / Pandas

---

# 🚀 API Endpoints

## 🔍 Semantic Search

### Endpoint:
POST /recommend/search
### Request:
```json
{
  "query": "movies like interstellar"
}
```
### Response:
```json
{

  "type": "movie_recommendation",

  "movieIds": [123, 456, 789],

  "response": "Here are some movies that match your request."

}
```
👤 User Recommendations
Endpoint:
POST /recommend/user
## Request:
```json
{
  "user": {
    "interactions": [...],
    "preferences": {
      "genres": ["Sci-Fi", "Action"]
    }
  }
}
```
### Response:
```json
{
  "movieIds": [123, 456, 789]
}
```

🧠 Core Concepts

1. Embeddings
	•	Text → vector representation (384D)
	•	Similar meaning → similar vectors
2. Cosine Similarity
	•	Used via dot product (normalized vectors)
score = embedding @ query_vector

3. FAISS Index
	•	Stores embeddings
	•	Enables fast nearest neighbor search
index.search(query, k)

4. Interaction Vector

Weighted combination of user history:
User = Σ (movie_embedding × interaction_weight)

5. Preference Vector

Genre-based vector:
Preference = Σ (genre_weight × genre_centroid)

6. Final User Embedding
  User Embedding =
    α × interaction_vector
  + (1 - α) × preference_vector


🧪 Running the Service

1. Setup environment
  • python3 -m venv venv
  • source venv/bin/activate
  • pip install -r requirements.txt

2. Start Flask server
   python app.py
   
4. Server runs on:
   http://localhost:4400

🧠 Design Principles
	•	Load model + index once at startup
	•	Keep ML logic separate from backend
	•	Preserve ranking across services
	•	Use hybrid retrieval (semantic + rules)
	•	Keep the LLM provider replaceable without changing the MCP retrieval interface
	•	Expose high-level capabilities through MCP instead of low-level ML functions

