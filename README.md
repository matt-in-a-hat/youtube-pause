# Youtube Pause

A Chrome extension that pauses all those lost youtube tabs when you open a new one (or resume one).

### Still in development. Want this handy tool now?

- Download a copy
- Go to chrome://extensions
- Ensure developer mode is ticked
- "Load unpacked extension..."
- Select the folder of this download




## Notes for my benefit

### TODO


- Investigate event pages instead of background page? Will need to store registered tab ids though. And I doubt this extension is likely to be run on very low memory devices.

- Add browser action popup which lists the open videos
  - Indicate which is the currently playing video
  - Have a play button beside each to pause current and play selected
  - Link from list to focus/activate tab


### Test cases

Page transitions:
- video to video
- video to non-video youtube page
- non-video youtube page to video
- video to non-youtube page
- non-youtube page to video
- youtube playlist auto-play
- refresh video page
- refresh non-video youtube page

Tabs/Windows:
- multiple tabs
- multiple windows
- minimised window
