import asyncio
import json
from typing import List

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI
from pydantic import BaseModel

load_dotenv()

model = ChatOpenAI(model="gpt-4o-mini")

SYSTEM_MESSAGE = """\
You are an expert assistant. Answer the user's question and be friendly.
Format your responses in markdown.
"""


class FileData(BaseModel):
    name: str
    content: str
    type: str


class Message(BaseModel):
    content: str
    files: List[FileData] = []
    history: List[dict] = []


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "Lo sapevi? Did you know?"}


async def message_generator(
    user_message: str, files: List[FileData], history: List[dict]
):
    messages = [SystemMessage(content=SYSTEM_MESSAGE)]

    for msg in history:
        if msg["sender"] == "user":
            messages.append(HumanMessage(content=msg["text"]))
        else:
            messages.append(AIMessage(content=msg["text"]))

    messages.append(HumanMessage(content=user_message))

    async for chunk in model.astream(messages):
        data = json.dumps({"content": chunk.content})
        yield f"data: {data}\n\n"

    # Send additional context at the end of the stream
    # This is just an example - modify the context data as needed
    context = {
        "type": "context",
        "data": {
            "sources": ["example.txt", "reference.md"],
            "additional_info": "This response was generated using...",
            "confidence": 0.95,
        },
    }
    yield f"data: {json.dumps(context)}\n\n"


@app.post("/stream")
async def stream_message(message: Message):
    return StreamingResponse(
        message_generator(message.content, message.files, message.history),
        media_type="text/event-stream",
    )
