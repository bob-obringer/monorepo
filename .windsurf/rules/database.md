---
trigger: model_decision
glob: */**
description: Database or Supabase related rules
---

# Supabase Rules

## Local Development

When working with Supabase locally in the `apps/bob-obringer-net` directory, you can use the following commands:

Please confirm that you are ONLY running these commands locally

1. Reset the local database and reapply all migrations (WARNING: Deletes local data)

```bash
supabase db reset
```
