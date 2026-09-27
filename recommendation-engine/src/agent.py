from ollama import chat
from fastmcp import Client
from src.data.models.semantic_search_outputmodel import SemanticSearchOutputModel
from src.data.PROMPTS.AgentSystemPrompt import SYSTEM_PROMPT
def convert_mcp_tool_to_ollama(tool):
    res =  {

        "type": "function",

        "function": {

            "name": tool.name,

            "description": tool.description or "",

            "parameters": tool.input_schema

        }

    }
    print("Res from convertor ",res)
    return res


async def call_agent(query):
    client = Client("http://127.0.0.1:8000/mcp")
    async with client:
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]

        messages.append({"role": "user", "content": query})

        mcp_tools = await client.list_tools()
        print("mcp tools ",mcp_tools)
        tools = [convert_mcp_tool_to_ollama(tool) for tool in mcp_tools]
        # pass functions directly as tools in the tools list or as a JSON schema
        response = chat(model="qwen3:4b", messages=messages, tools=tools)

        # print("initial response ", SemanticSearchOutputModel.model_validate_json(response.message.content))
        messages.append(response.message)
        if not response.message.tool_calls:
            return {"type":"assistant", "content": response.message.content}
        if response.message.tool_calls:
            # only recommended for models which only return a single tool call
            call = response.message.tool_calls[0]

            print("tool called ", call.function.name)
            print("tool arguments ", call.function.arguments)
            result = await client.call_tool(call.function.name, call.function.arguments)  
            # add the tool result to the messages
            messages.append({"role": "tool", "tool_name": call.function.name, "content": str(result)})

            mcp_response = chat(model="qwen3:4b", messages=messages, tools=tools,format=SemanticSearchOutputModel.model_json_schema(), think=False)
            final_response = SemanticSearchOutputModel.model_validate_json(mcp_response.message.content)
            result ={"type": "movie_recommendation", "movieIds": final_response.movieIds, "response": final_response.response} 
            print("final result ", result, type(result))
            return result
