#!/bin/bash

npx turbo-ignore --fallback=HEAD^1
if [ $? -eq 0 ]; then 
  echo "No changes detected, skipping build."
  exit 0
fi

git log -1 --pretty=oneline --abbrev-commit | grep -w "[skip vercel ci]" 
if [ $? -eq 0 ]; then
  echo "Commit message contains '[skip vercel ci]', skipping build."
  exit 0
else
  echo "Running build..."
  exit 1
fi
