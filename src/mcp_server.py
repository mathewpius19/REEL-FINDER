from fastmcp import FastMCP
from src.indexing.search import search_query
from src.util.contentFilter import filter_content_type
import requests

mcp = FastMCP("Movie Recommender MCP")

@mcp.tool(name="semantic_search", title="Semantic Movie Search",

    description=(

    "Search the movie catalog using semantic similarity. "

    "This tool MUST be used for movie discovery and recommendation requests, "

    "including short requests such as 'movies like Interstellar', "

    "'something like Insidious', 'psychological horror', or "

    "'action adventure movies'. "

    "Convert the user's request into a concise positive semantic query and "

    "call this tool. Never respond with the rewritten query itself."

))

def semantic_search(query:str) -> dict:
    """
    Search the movie catalog using natural-language semantic similarity.
    Use this tool for movie recommendations, similar movies, or movies
    matching a user's description, genre, mood, theme, or preferences.
    """
    print("query received: ", query)
    response = requests.post(
        "http://127.0.0.1:4400/recommend/searchMovies",
        json={"query": query},
        timeout=30,
    )
    response.raise_for_status()
    return response.json()

if __name__ == "__main__":

    mcp.run(transport="http", host="127.0.0.1", port=8000 )