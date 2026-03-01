# YouTube Viewer

## Current State
The project has a frontend scaffold (shadcn/ui components, Tailwind, React) and an empty backend (no Motoko actors yet). No App.tsx exists -- the app has never been rendered.

## Requested Changes (Diff)

### Add
- Backend: store and retrieve per-user YouTube API key (v3) and on-site comments per video
- Frontend Settings page: input field to save/load a YouTube Data API v3 key (stored in browser localStorage for simplicity)
- Frontend Home/Search page: search bar that queries YouTube Data API v3 for videos; displays a grid of video thumbnails, titles, channel names, and view counts
- Frontend Watch page: embeds the selected YouTube video via iframe (youtube.com/embed/:id); shows video title and channel; shows on-site comment section
- On-site comments: users can post a comment (display name + text) on any video; comments stored in the Motoko backend by videoId; read publicly, write publicly (no auth required)
- Navigation: top nav bar with logo, Search link, and Settings link

### Modify
- Nothing (new project)

### Remove
- Nothing

## Implementation Plan
1. Motoko backend actor:
   - `postComment(videoId: Text, displayName: Text, body: Text) -> async Nat` (returns comment id)
   - `getComments(videoId: Text) -> async [Comment]` where Comment = { id: Nat; videoId: Text; displayName: Text; body: Text; timestamp: Int }
2. Frontend pages:
   - `SettingsPage`: text input for API key, saved to localStorage key `yt_api_key`
   - `SearchPage` (default/home): search input, calls YouTube Data API v3 `/search` and `/videos` endpoints with the stored key, shows video cards
   - `WatchPage`: YouTube embed iframe + on-site comments wired to backend `postComment` / `getComments`
3. React Router for navigation between pages
4. YouTube API key read from localStorage in all fetch calls; if missing, redirect/prompt user to Settings
