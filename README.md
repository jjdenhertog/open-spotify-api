# Spotify Open Web API SDK - TypeScript

This is an implementation leveraging the open API of Spotify. This is used to access some resources that have been removed from the API as of December 2024.

Note: It can only be used on public playlists. The preferred method is to first attempt to load data using the normal Spotify API. And if that fails retry using this approach.

## Resources

This API can be used to access resources that are publicly available. For example the [Old School Rap Mix](https://open.spotify.com/playlist/37i9dQZF1EIhoSaISLaaJc). 

## How to use

Install the `open-spotify-sdk` library with NPM:

```bash
npm install @jjdenhertog/open-spotify-sdk
```

### Initiate the library

```typescript

import { OpenSpotifyApi } from '@jjdenhertog/open-spotify-api';

const sdk = OpenSpotifyApi()
```

### Get playlist

The code snippet below loads a playlist and all tracks related to that playlist.

```typescript
const playlist = await sdk.playlists.getFull('spotify:playlist:37i9dQZF1EIhoSaISLaaJc')
```

Or if you prefer to do the operation manually it would look like this.

```typescript

const playlistUri = 'spotify:playlist:37i9dQZF1EIhoSaISLaaJc'
let offset = 0;
const limit = 50;
const playlist = await sdk.playlists.get(playlistUri, offset, limit)

// Check if more tracks can be loaded
let hasMoreResults = playlist.tracks.offset + playlist.tracks.limit < playlist.tracks.total;
while(hasMoreResults){

    offset += limit;
    const result = await sdk.playlists.get(playlistUri, offset, limit)
    
    // Append tracks
    playlist.tracks.items = playlist.tracks.items.concat(result.tracks.items)
    hasMoreResults = result.tracks.offset + result.tracks.limit < result.tracks.total;
}
    
// Playlist loaded with all tracks

```

## Support This Open-Source Project ❤️

If you appreciate my work, consider starring this repository or making a donation to support ongoing development. Your support means the world to me—thank you!

[![Buy Me a Coffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/jjdenhertog)

Are you a developer and have some free time on your hand? It would be great if you can help me maintain and improve this library.
