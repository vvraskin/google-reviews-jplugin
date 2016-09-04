### Lightweight google reviews plugin for Joomla
The plugin is supposed to work with Joomla versions 2.5.x.
- What it supports:
  * Display up to 5 reviews for a given place_id from Google places
  * Including creation date, reviewer details (name, Google+ profile picture), review rate
- What it doesn't support:
  * Create, Update, Delete reviews

### How to install and configure the plugin
1. Find your place_id at [Google Places API documentation](https://developers.google.com/places/place-id#find-id)
1. Retrieve `Browser API key` from [Google Developers portal](https://console.developers.google.com).
1. Clone this repo

  ```
  git clone https://github.com/vvraskin/google-reviews-jplugin.git
  ```
1. Create zip file with the plugin:
  ```
  $ zip ./google-reviews-jplugin
  ```
1. Install plugin to Joomla according to [these instructions](https://docs.joomla.org/Installing_an_extension)
1. Specify place_id and google_api_key in plugin properties
1. To use plugin simply insert `{gr}{/gr}` inside of your articles

### Known issues
If you see KeyMapError inside in JavaScript debug console you have to check your Google API key. It is either expired, or there was a typo made when you copied it.
