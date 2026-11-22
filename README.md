# Stillwater

A small daily-ritual app for mental health. You build a morning, midday and evening routine out of tiny habits, follow a short guided journey one step a day, log your mood, and have a few quick tools to hand for when things get heavy.

## What's in it

- **Today**: your three rituals, a progress ring, a streak counter and today's journey step
- **Journey**: three guided programs (Calmer Mind, Quiet Nights, Kinder Voice). One step unlocks per day and each one can add a habit to your routine
- **Mood**: five-point check-in with tags and a note, plus a two-week chart
- **Toolkit**: slow breathing, box breathing, 5-4-3-2-1 grounding and a journal with prompts
- **Need help now?**: always in the header, with crisis lines (988, Crisis Text Line, findahelpline.com)

All data stays in the browser's localStorage. There's no account and no server. You can download your data or wipe it from the Toolkit tab.

## Running it

No build step. Serve the folder with anything static, for example:

```
python3 -m http.server 8000
```

Then open http://localhost:8000 on your phone or in a browser's mobile view. It can be added to the home screen and works offline after the first load.

## Note

This is a self-care tool, not a replacement for professional help.
