---
title: Running LLMs Locally
date: '2026-04-07'
summary: An Honest Guide for Privacy-Conscious Users
---
# About this post 

Recently I have seen lot of coder, researcher, and other that were trying to find other solutions to benefit from AI than suscribing to a cloud AI/LLM. I have made some research, and I will talk about it here. This knowledge is quite volatile and might be outdated next month! However, if it mights help !

# Who this is for

You want to use an AI assistant but you do not want to pay a monthly subscription, and you do not want your conversations, documents, or code sent to a company's servers. This guide is for you.

It is not for people who need maximum performance at any cost. Local models are genuinely good now — but they are not GPT-4o or Claude Opus. I will be straight about that.

---

## The summary upfront

Running a large language model locally is now accessible to most people with a modern computer. The tooling has matured enormously in 2025–2026. If you have a recent Mac with an M-series chip, or a PC with a decent GPU, you can have a capable AI assistant running in under 10 minutes, completely offline, for free.

The catch: the experience is meaningfully worse than frontier cloud models, and the hardware requirements for the best local models are not trivial.

---

## How it actually works

A large language model is a file — a `.gguf` or similar format, typically 2–25 GB depending on the model. Your computer loads it into RAM or GPU memory and runs inference locally. No internet required after the initial download.

The tool that made this accessible to non-engineers is **[Ollama](https://ollama.com)**. It handles model downloading, memory management, and exposes a local API. You do not need to compile anything.

---

## Getting started: step by step

### 1. Install Ollama

**macOS / Linux:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

**Windows:** download the installer from [ollama.com](https://ollama.com).

That is it. Ollama runs as a background service.

### 2. Pull a model

```bash
ollama pull gemma3:4b        # lightweight, fast, good for most tasks
ollama pull gemma3:27b       # much better quality, needs ~20 GB RAM
ollama pull llama3.2:3b      # Meta's small model, very fast
ollama pull mistral:7b       # strong reasoning, good default
ollama pull phi4-mini        # excellent for coding, tiny footprint
```
> If not used to it, you have to run it in your terminal here is a nice [Tutorial on how to use it](https://jussiroine.com/2019/08/getting-started-with-windows-terminal/)

Start with `gemma3:4b` or `llama3.2:3b` if you are unsure about your hardware.

### 3. Chat immediately in the terminal

```bash
ollama run gemma3:4b
```

You are now talking to a local AI. No account. No API key. No data leaving your machine.

### 4. Use a proper interface (optional but recommended)

The terminal works, but a chat UI is more comfortable for daily use.

**[Open WebUI](https://github.com/open-webui/open-webui)** — the most polished option. Runs in your browser, connects to Ollama automatically.

```bash
docker run -d -p 3000:80 \
  -v open-webui:/app/backend/data \
  -e OLLAMA_BASE_URL=http://host.docker.internal:11434 \
  ghcr.io/open-webui/open-webui:main
```

Then open `http://localhost:3000`.

Alternatives: **[Chatbox](https://chatboxai.app)**, **[LM Studio](https://lmstudio.ai)** (includes its own model downloader, no Docker required).

---

## Hardware: the honest picture

This is where most guides get vague. Here is the reality.

### RAM is the bottleneck

Models run in RAM (or VRAM if you have a GPU). If the model does not fit in RAM, it spills to disk and becomes unusably slow.

| Model size | RAM needed | What you get |
|---|---|---|
| 3B parameters | ~3 GB | Fast, limited reasoning, good for simple tasks |
| 7–8B parameters | ~6–8 GB | Solid daily driver, handles most tasks |
| 14–27B parameters | ~12–20 GB | Close to early GPT-4 quality |
| 70B+ parameters | ~48 GB+ | Frontier quality — requires a workstation |

**Practical baseline**: 16 GB RAM gets you a good 7B model with room to breathe. 32 GB RAM gives you access to 27B models, which are genuinely impressive.

### Apple Silicon is exceptional for this

M1/M2/M3/M4 Macs have unified memory, meaning the CPU and GPU share RAM. A MacBook Pro M3 with 36 GB RAM runs a 27B model smoothly. This is not possible on most PC laptops. If privacy and local AI matter to you and you are buying hardware, Apple Silicon is currently the best value for this use case.

### NVIDIA GPUs on Windows/Linux

If you have an NVIDIA GPU with enough VRAM (8 GB+), Ollama uses it automatically. A 4090 with 24 GB VRAM can run a 27B model at high speed. Older cards with less VRAM will offload layers to RAM, which works but is slower.

### No GPU? It still works

CPU-only inference is slow but usable for 3B–7B models. Expect 5–15 tokens per second on a modern CPU. Enough for writing and Q&A. Not great for real-time coding assistance.

---

## Which models to actually use

As of April 2026, these are the best options for local use:

**For general use:**
- `gemma3:27b` (Google, Apache 2.0) — excellent instruction following, long context (128K tokens), multilingual
- `llama3.3:70b` (Meta, Llama license) — best open-weight general model if you have the RAM
- `mistral-small:22b` — strong reasoning, good coding

**For coding:**
- `qwen2.5-coder:14b` (Alibaba) — best dedicated coding model in this size range
- `phi4:14b` (Microsoft) — punches above its weight for reasoning and code

**For low-end hardware (≤8 GB RAM):**
- `gemma3:4b` — best small model overall
- `llama3.2:3b` — very fast, decent quality
- `phi4-mini` — excellent at coding for its size

**To check what is currently available:**
```bash
ollama list        # models you have downloaded
# or browse: https://ollama.com/library
```

---

## What local LLMs are actually good at

- Summarizing documents and PDFs you do not want to upload anywhere
- Drafting emails, reports, and text
- Explaining code you paste in
- Writing and refactoring code (especially with a good coding model)
- Translation
- Brainstorming and ideation
- Answering questions about local files via tools like [AnythingLLM](https://anythingllm.com) or Open WebUI's document upload

---

## Where they fall short — honestly

**Reasoning on hard problems.** The best local 27B model is roughly equivalent to mid-2023 frontier models. For complex multi-step reasoning, math proofs, or nuanced analysis, cloud models are still ahead.

**Speed.** A 27B model on a MacBook Pro generates 20–40 tokens per second. Frontier cloud APIs return 100+ tokens per second. For long outputs, local can feel slow.

**Context window in practice.** Models may advertise 128K context but performance degrades in the latter half of a long context. Keep important information near the end of your prompt.

**Hallucination.** Local models hallucinate as much or more than comparable cloud models. Verify factual claims. Do not use them to answer questions about recent events without enabling web search tools.

**Vision / multimodal.** Gemma 3 supports image inputs. Most other local models do not, or the image understanding is weak. If you need vision, check model support explicitly before relying on it.

**No automatic updates.** Cloud models improve silently. With local models, you must manually pull new versions to get improvements.

---

## Privacy: what "local" actually means

When you run a model with Ollama and no external tools:

- **Nothing leaves your machine.** The model runs entirely on your CPU/GPU. No telemetry, no logging to external servers.
- **Your prompts are not used for training.** There is nothing to send.
- **Your documents stay local.** If you load a contract, a medical record, or sensitive code into the context, it goes nowhere.

**Caveats:**
- Ollama itself checks for updates on startup. You can disable this if needed.
- If you use Open WebUI or similar interfaces with cloud features enabled (web search, external integrations), those specific requests leave your machine.
- The model *file* was trained on internet data by Google, Meta, or whichever organization released it. You are trusting their training process, not their servers.

---

## Cost

| Item | Cost |
|---|---|
| Ollama | Free, open source |
| Models (Gemma, Llama, Mistral, etc.) | Free to download |
| Open WebUI / LM Studio | Free |
| Electricity | Negligible for inference (a 7B model on CPU draws ~20–40W) |
| **Hardware** | **This is where it gets real** |

If you already have a computer with 16 GB+ RAM, your cost is zero. If you need to buy hardware to run good models, the economics change. A used Mac Mini M2 with 16 GB RAM is the best entry point for a dedicated local AI machine.

There is no subscription to cancel. There is no per-token cost. There is no API rate limit at 2 AM.

---

## Connecting local models to your existing tools

Ollama exposes a local API compatible with the OpenAI format. Many tools support this out of the box.

**VS Code / Cursor / Continue.dev** — use local models for code completion and chat in your editor.

**Obsidian** — plugins like Smart Connections connect to Ollama for local AI in your notes.

**Python / scripts:**

```python
from openai import OpenAI

client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")

response = client.chat.completions.create(
    model="gemma3:4b",
    messages=[{"role": "user", "content": "Summarize this text: ..."}]
)
print(response.choices[0].message.content)
```

No API key needed. No billing. Runs offline.

---

## Should you use a local model or a cloud model?

This is not a binary choice. Many people use both.

**Use local when:**
- The content is sensitive (medical, legal, financial, personal)
- You need to process many documents without per-token costs
- You are offline or on a slow connection
- You want zero dependency on a company's pricing or availability

**Use cloud when:**
- You need the best possible quality for a high-stakes output
- You need the latest information (local models have a training cutoff)
- You are doing something computationally heavy and your hardware is limited
- Speed matters more than privacy for this specific task

---

## Quick start summary

```bash
# 1. Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# 2. Pull a model (adjust to your RAM)
ollama pull gemma3:4b      # ≤8 GB RAM
ollama pull gemma3:27b     # 24+ GB RAM

# 3. Chat
ollama run gemma3:4b

# 4. Optional: run Open WebUI for a browser interface
docker run -d -p 3000:80 \
  -v open-webui:/app/backend/data \
  -e OLLAMA_BASE_URL=http://host.docker.internal:11434 \
  ghcr.io/open-webui/open-webui:main
# then open http://localhost:3000
```

---

## Useful resources

- [Ollama library](https://ollama.com/library) — browse all available models
- [Open WebUI](https://github.com/open-webui/open-webui) — best browser-based interface
- [LM Studio](https://lmstudio.ai) — all-in-one app, no Docker required
- [AnythingLLM](https://anythingllm.com) — local RAG (chat with your documents)
- [Hugging Face Open LLM Leaderboard](https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard) — compare model benchmarks

---

*Last updated: April 2026. Model recommendations change fast — check the Ollama library for what is current.*
