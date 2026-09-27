# ReelFinder

ReelFinder is a full-stack movie discovery application that combines conversational search with personalized recommendations. Users can create an account with genre preferences, ask for movies in natural language, receive ordinary answers for non-movie questions, and refine future suggestions through clicks, ratings, watch status, and interaction recency.

Internally, the Next.js frontend communicates through server-side API routes with a Spring Boot service that handles authentication, PostgreSQL persistence, movie metadata, and user interactions. Search and recommendation requests are sent to a Python service where an Ollama-powered agent decides whether to call a FastMCP semantic-search tool; Sentence Transformers and FAISS retrieve matching movies, while saved preferences and interaction history are combined to generate personalized results.

## Projects

- `webserver/` contains the Next.js frontend and Spring Boot application API.
- `recommendation-engine/` contains the Flask recommendation API, Ollama agent, FastMCP server, embedding pipeline, and FAISS search.
