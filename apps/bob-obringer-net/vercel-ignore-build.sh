#!/bin/bash

echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"

if npx turbo-ignore --fallback=HEAD^1; then 
  echo "No changes detected, skipping build."
  exit 0
fi

if [ git log -1 --pretty=oneline --abbrev-commit | grep -w "[\skip vercel ci\]" ]; then
  echo "Commit message contains '[skip vercel ci]', skipping build."
  exit 0
else
  echo "Running build..."
  exit 1
fi
