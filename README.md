# Youtube Pause

A Chrome extension that pauses all those lost youtube tabs when you open a new one (or resume one).

### Still in development. Want this handy tool now?

- Download a copy
- Go to chrome://extensions
- Ensure developer mode is ticked
- "Load unpacked extension..."
- Select the folder of this download



### TODO


- Do I need to unregister tabs somehow other than when failing to communicate to them?
- Test when a video is paused due to buffering will it auto-continue after the user changes tab? Will this script catch that?
- Investigate event pages instead of background page, and using alarms instead of setInterval

- Add browser action popup which lists the open videos
  - Indicate which is the currently playing video
  - Have a play button beside each to pause current and play selected
  - Link from list to focus/activate tab
