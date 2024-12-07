import { OpenSpotifyApi } from "./OpenSpotifyApi.js";

export {
    OpenSpotifyApi
};

export type * from "./types.js";

const test = new OpenSpotifyApi()
test.playlists.getPlaylist('spotify:playlist:37i9dQZF1EIhoSaISLaaJc')