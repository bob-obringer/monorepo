# AI Chatbot Supabase Archiving: Execution Plan

## Overview

**Goal:** Implement a reliable backend system to automatically archive AI chat conversations from the `bob-obringer-net` Next.js application into a Supabase PostgreSQL database.

**Context:**
*   **Primary Interaction:** The user-facing chat interface and real-time interaction are managed by the Vercel AI SDK. Supabase serves purely as a **persistent archive** for historical data.
*   **Archiving Strategy:** Messages (user, assistant, and potentially system events/errors) will be saved **incrementally** as they occur during the chat session, rather than in a batch at the end.
*   **Target Implementation:** The core logic will be integrated into the existing Next.js Server Action: `/Users/bobringer/work/bob-obringer/monorepo/apps/bob-obringer-net/src/features/ai-chatbot/server/send-chatbot-message.tsx`.
*   **State Management:** The Vercel AI SDK's `aiState` will be utilized to store the `supabaseChatId` for the current session, linking messages to the correct chat record.
*   **Technology Stack:**
    *   Database: Supabase PostgreSQL
    *   Client Library: `@supabase/supabase-js`
    *   Framework: Next.js (with Server Actions)
    *   AI Integration: Vercel AI SDK
*   **Database Schema Management:** The database schema (tables, indexes, triggers) will be defined in version-controlled SQL migration files located within the `apps/bob-obringer-net/supabase/migrations/` directory and applied using Supabase's migration tools (via the `mcp3_apply_migration` tool).
*   **Security:** Server-side database operations will use the Supabase **Service Role Key**, stored securely in the `.env.local` file (`SUPABASE_SERVICE_ROLE_KEY`), granting necessary backend privileges while bypassing Row Level Security for archival purposes. The public Supabase URL (`NEXT_PUBLIC_SUPABASE_URL`) is safe for exposure.
*   **Error Handling:** Database archival operations should be designed to be **non-blocking** for the user's chat experience. Errors during archiving will be logged on the server, but should not prevent the chat response from being streamed back to the user.

**Outcome:** A complete, automated chat archiving system leveraging Supabase for data persistence, integrated seamlessly into the existing Next.js application structure. This plan details the specific steps required for setup and implementation.

## 1. Prerequisites

### 1.1. Supabase Project Credentials

- Obtain your Supabase project **URL**.
- Obtain your Supabase project **Service Role Key**.

### 1.2. Environment Variables Setup

- In the Next.js app (`apps/bob-obringer-net`), create or update the `.env.local` file (ensure it's gitignored) with:
  ```env
  NEXT_PUBLIC_SUPABASE_URL="YOUR_SUPABASE_PROJECT_URL"
  SUPABASE_SERVICE_ROLE_KEY="YOUR_SUPABASE_SERVICE_ROLE_KEY"
  ```

### 1.3. Install Dependencies

- Navigate to your monorepo root in the terminal:
  ```bash
  cd /Users/bobringer/work/bob-obringer/monorepo
  ```
- Install `supabase-js` specifically for the `@bob-obringer/bob-obringer-net` workspace:
  ```bash
  pnpm --filter @bob-obringer/bob-obringer-net add @supabase/supabase-js
  ```

## 2. Database Setup (Using Supabase Migrations)

We will define the database schema in a migration file stored within the codebase and apply it using Supabase's migration tools.

### 2.1. Identify Supabase Project ID

*   The Supabase tools require the Project ID. I will use the `mcp3_list_projects` tool to find the ID corresponding to your project URL: `https://xdskthrguxjopuezgovi.supabase.co`.

### 2.2. Create Migration File

*   **Action:** I will create a new SQL migration file.
*   **Path:** `/Users/bobringer/work/bob-obringer/monorepo/apps/bob-obringer-net/supabase/migrations/YYYYMMDDHHMMSS_create_chat_tables.sql` (Timestamp will be generated).
*   **Content:** The file will contain the necessary SQL `CREATE TABLE`, `CREATE INDEX`, `CREATE FUNCTION`, and `CREATE TRIGGER` statements for the `chats` and `messages` tables, including the `update_chat_updated_at_column` function and its trigger.

    ```sql
    -- /Users/bobringer/work/bob-obringer/monorepo/apps/bob-obringer-net/supabase/migrations/YYYYMMDDHHMMSS_create_chat_tables.sql

    -- Table for Chat Sessions
    CREATE TABLE chats (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Unique identifier for the chat session
        created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()), -- When the chat session started
        updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),  -- When the last message was added to this chat
        title TEXT
    );

    -- Index for faster sorting/filtering by creation time or last update
    CREATE INDEX idx_chats_created_at ON chats(created_at DESC);
    CREATE INDEX idx_chats_updated_at ON chats(updated_at DESC);

    -- Table for Individual Messages
    CREATE TABLE messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Unique identifier for the message
        chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE, -- Link to the chat session
        sender_role TEXT NOT NULL CHECK (sender_role IN ('user', 'assistant', 'system')), -- Who sent the message
        content TEXT NOT NULL,                      -- The actual message text
        timestamp TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()) -- When the message was archived
    );

    -- Crucial index for retrieving messages for a specific chat
    CREATE INDEX idx_messages_chat_id ON messages(chat_id);

    -- Index for ordering messages within a chat efficiently
    CREATE INDEX idx_messages_chat_id_timestamp ON messages(chat_id, timestamp ASC);

    -- Function to update the timestamp
    CREATE OR REPLACE FUNCTION update_chat_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
       UPDATE chats
       SET updated_at = timezone('utc', now())
       WHERE id = NEW.chat_id;
       RETURN NEW;
    END;
    $$ language 'plpgsql';

    -- Trigger to call the function after message insertion
    CREATE TRIGGER update_chats_updated_at
    AFTER INSERT ON messages
    FOR EACH ROW
    EXECUTE FUNCTION update_chat_updated_at_column();

    ```

### 2.3. Apply Migration via MCP

*   **Action:** Once the Project ID is confirmed and the migration file is created, I will use the `mcp3_apply_migration` tool.
*   **Parameters:**
    *   `project_id`: The ID found in step 2.1.
    *   `name`: A descriptive name like `create_chat_tables`.
    *   `query`: The full SQL content from the migration file created in step 2.2.
*   **Outcome:** This command will execute the SQL against your Supabase database, creating the tables and trigger, and Supabase will record that this migration has been applied.

## 3. Supabase Client Setup (TypeScript)

Create a utility file to initialize the Supabase client for server-side use.

### 3.1. Create File

*   **Path:** `/Users/bobringer/work/bob-obringer/monorepo/apps/bob-obringer-net/src/lib/supabase/server.ts`

### 3.2. Add Content

```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types'; // Assuming Supabase generated types

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error('Missing env var: NEXT_PUBLIC_SUPABASE_URL');
}
if (!supabaseServiceKey) {
  // Consider more nuanced error handling/logging in production
  throw new Error('Missing env var: SUPABASE_SERVICE_ROLE_KEY');
}

// IMPORTANT: Use the Service Role Key for server-side operations
// This client has full access and should NEVER be exposed client-side.
export const supabaseServerClient = createClient<Database>(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      // Avoid saving session automatically for server-side client
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  },
);

// Optional: Generate types from Supabase schema
// npx supabase gen types typescript --project-id <your-project-id> --schema public > src/lib/supabase/types.ts
// You'll need to install supabase CLI globally or via devDependency
```

*(Note: You will need to generate the `src/lib/supabase/types.ts` file using the Supabase CLI if you want typed client access, which is highly recommended.)*

## 4. AI State Update (TypeScript)

Modify the AI state type definition to include the Supabase chat ID.

### 4.1. Locate File

*   Find the file where your AI state type (e.g., `AIState`) is defined. This might be within the `send-chatbot-message.tsx` file or a shared types file.

### 4.2. Update Type

*   Add the `supabaseChatId` field:

```typescript
// Example AI State Type
export type AIState = {
  // ... other existing fields
  supabaseChatId: string | null; // Add this line
};

// Ensure the initial state sets this to null
export const initialAIState: AIState = {
  // ... other initial values
  supabaseChatId: null, // Add this line
};
```

## 5. Supabase Helper Functions (TypeScript)

Create helper functions within or imported by the server action to interact with Supabase.

### 5.1. Location

*   These can be defined directly within `send-chatbot-message.tsx` or in a separate helper file (e.g., `src/features/ai-chatbot/server/supabase-helpers.ts`) and imported.

### 5.2. `createSupabaseChat` Function

```typescript
import { supabaseServerClient } from '@/lib/supabase/server'; // Adjust import path

async function createSupabaseChat(initialTitle?: string): Promise<string | null> {
  try {
    const { data, error } = await supabaseServerClient
      .from('chats')
      .insert({ title: initialTitle }) // Insert with optional title
      .select('id') // Select the newly created ID
      .single(); // Expect only one row back

    if (error) {
      console.error('Supabase Error creating chat:', error);
      return null;
    }

    if (!data?.id) {
        console.error('Supabase Error: No ID returned after chat creation');
        return null;
    }

    console.log('Supabase: Created chat session:', data.id);
    return data.id; // Return the new chat ID
  } catch (e) {
    console.error('Error in createSupabaseChat:', e);
    return null;
  }
}
```

### 5.3. `addSupabaseMessage` Function

```typescript
import { supabaseServerClient } from '@/lib/supabase/server'; // Adjust import path

type SenderRole = 'user' | 'assistant' | 'system';

async function addSupabaseMessage(
  chatId: string,
  role: SenderRole,
  content: string,
): Promise<boolean> {
    if (!chatId) {
        console.error('Supabase Error: Attempted to add message with null chatId');
        return false;
    }
  try {
    const { error } = await supabaseServerClient.from('messages').insert({
      chat_id: chatId,
      sender_role: role,
      content: content,
      // timestamp is handled by DB default
    });

    if (error) {
      console.error(`Supabase Error adding ${role} message:`, error);
      return false;
    }

    // console.log(`Supabase: Added ${role} message to chat ${chatId}`); // Optional: Verbose logging
    return true; // Indicate success
  } catch (e) {
    console.error('Error in addSupabaseMessage:', e);
    return false;
  }
}
```

## 6. Server Action Integration (TypeScript)

Modify the main server action (`sendChatbotMessage.tsx`) to call the helper functions.

### 6.1. Locate File

*   `/Users/bobringer/work/bob-obringer/monorepo/apps/bob-obringer-net/src/features/ai-chatbot/server/send-chatbot-message.tsx`

### 6.2. Import Helpers

*   Import `createSupabaseChat` and `addSupabaseMessage` if they are in a separate file.
*   Import the updated `AIState` type if defined elsewhere.

### 6.3. Update Logic

*   Modify the action logic as follows (conceptual outline):

```typescript
// ... imports ...
// import { createSupabaseChat, addSupabaseMessage } from './supabase-helpers'; // If needed
// import { type AIState } from './types'; // If needed

export async function sendChatbotMessage(
  // ... existing parameters ...
) {
  'use server';

  const context = getMessageContext(); // Your context retrieval
  const aiState = context.aiState.get() as AIState; // Get mutable state

  // --- Supabase Integration Start ---

  let currentChatId = aiState.supabaseChatId;
  const userMessageContent = /* ... Get user message content ... */;

  // 1. Handle User Message Archiving
  if (!currentChatId) {
    // First message in this session, create the chat record
    const newChatId = await createSupabaseChat(); // Optional: pass a title if available
    if (newChatId) {
      currentChatId = newChatId;
      // IMPORTANT: Update the AI state immediately
      aiState.supabaseChatId = newChatId;
      context.aiState.done(aiState); // Persist the updated state

       // Now add the first user message
      addSupabaseMessage(currentChatId, 'user', userMessageContent)
        .catch(e => console.error("Fire-and-forget Supabase user message error:", e)); // Log errors but don't block

    } else {
      console.error("Failed to create Supabase chat, cannot archive first message.");
      // Decide if you want to proceed without archiving or handle differently
    }
  } else {
    // Existing chat, just add the user message
    addSupabaseMessage(currentChatId, 'user', userMessageContent)
       .catch(e => console.error("Fire-and-forget Supabase user message error:", e)); // Log errors but don't block
  }

  // --- Supabase Integration End (User Message) ---

  // ... (Existing AI SDK logic: createStreamableUI, createStreamableValue, streamUI, etc.) ...

  streamUI.onFinish(async ({ error, data }) => {
    if (error) {
      // Handle stream errors as before
      console.error('Stream Error:', error);
      // Potentially log this error to Supabase as a 'system' message?
      // if (currentChatId) {
      //   addSupabaseMessage(currentChatId, 'system', `Error during stream: ${error.message}`)
      //     .catch(e => console.error("Fire-and-forget Supabase system message error:", e));
      // }
      return;
    }

    // --- Supabase Integration Start (Assistant Message) ---
    if (currentChatId && typeof data === 'string' /* or check data structure */ ) {
       const assistantMessageContent = data; // Or extract from data object
       addSupabaseMessage(currentChatId, 'assistant', assistantMessageContent)
         .catch(e => console.error("Fire-and-forget Supabase assistant message error:", e)); // Log errors but don't block
    } else if (!currentChatId) {
         console.error("Cannot archive assistant message: Supabase chat ID is missing.");
    }
    // --- Supabase Integration End (Assistant Message) ---

    // ... (Existing onFinish logic: update AI/UI state, etc.) ...
    // Ensure aiState reflects the final state *including* supabaseChatId
    context.aiState.done({ ...aiState, /* other final updates */ });
    context.done();
  });

  // ... return streamable values ...
}

```

*(**Key Points:**)*
*   *State Update:* Crucially update `aiState.supabaseChatId` *immediately* after creating a chat and persist it using `context.aiState.done()`.
*   *Error Handling:* Wrap Supabase calls. Log errors but use `.catch()` for fire-and-forget calls (especially within the streaming path) to avoid blocking the user experience.
*   *Placement:* User message archiving happens *before* the main AI call. Assistant message archiving happens in `streamUI.onFinish`.

## 7. Testing and Verification

*   Start the Next.js application (`pnpm dev` within `apps/bob-obringer-net`).
*   Open the application and initiate a chat.
*   Verify in the Supabase dashboard (Table Editor):
    *   A new row appears in the `chats` table.
    *   Rows for the user message and the assistant's response appear in the `messages` table, linked to the correct `chat_id`.
    *   The `updated_at` timestamp in the `chats` table updates correctly after each message.
*   Test edge cases:
    *   Multiple messages back and forth.
    *   Starting a new chat session (should create a new `chats` entry).
    *   Simulate environment variable errors (e.g., remove `SUPABASE_SERVICE_ROLE_KEY`) and check logs.

## 8. Error Handling and Logging

*   Ensure robust logging (as shown in helper functions and integration points) captures Supabase errors without crashing the application or blocking the user.
*   Consider using a more structured logging library in production.
*   Monitor Supabase logs and application logs for recurring issues.
