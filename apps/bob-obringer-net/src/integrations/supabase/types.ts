/**
 * TypeScript definitions for Supabase database schema
 * 
 * These types provide type safety when interacting with the database
 * through the Supabase client.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      chats: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string | null
        }
        Relationships: Record<string, never>[]
      }
      messages: {
        Row: {
          id: string
          chat_id: string
          role: 'user' | 'assistant' | 'system'
          content: string
          timestamp: string
        }
        Insert: {
          id?: string
          chat_id: string
          role: 'user' | 'assistant' | 'system'
          content: string
          timestamp?: string
        }
        Update: {
          id?: string
          chat_id?: string
          role?: 'user' | 'assistant' | 'system'
          content?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_chat_id_fkey"
            columns: ["chat_id"]
            referencedRelation: "chats"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: Record<string, never>
    Functions: {
      [_ in never]: never
    }
    Enums: Record<string, never>
  }
}
