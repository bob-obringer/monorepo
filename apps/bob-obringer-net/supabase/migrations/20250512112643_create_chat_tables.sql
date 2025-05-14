-- Migration: Create chats and messages tables for AI Chatbot archive
-- Created: 2025-05-12 11:26:43

-- Table for Chat Sessions
CREATE TABLE chats (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    title TEXT,
    location TEXT
);

-- Table for individual messages
CREATE TABLE messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_id uuid NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- Index for retrieving messages for a specific chat
CREATE INDEX idx_messages_chat_id ON messages(chat_id);

-- Index for ordering messages within a chat efficiently
CREATE INDEX idx_messages_chat_id_timestamp ON messages(chat_id, timestamp DESC);

-- Function to update updated_at column in chats table after new message
CREATE OR REPLACE FUNCTION public.update_chat_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.chats SET updated_at = timezone('utc', now()) WHERE id = NEW.chat_id;
    RETURN NEW;
END;
$$ language 'plpgsql'
SECURITY DEFINER
SET search_path = '';

-- Trigger to call the function after message insertion
CREATE TRIGGER update_chats_updated_at
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION public.update_chat_updated_at_column();
