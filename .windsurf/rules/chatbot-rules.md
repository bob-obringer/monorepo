---
trigger: model_decision
glob: **/*
description: Rules for AI Chatbot conversations
---

# AI Chatbot Rules

- We're using the send-chatbot-message server action to handle AI Chatbot requests
- Do not create endpoints for things that can just be function calls from the server action
