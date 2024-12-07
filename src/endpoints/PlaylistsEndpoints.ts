import getRequestHash from '../authentication/getRequestHash.js';
import { Image, MaxInt, Playlist, SimplifiedAlbum, Track } from './../types';
import EndpointsBase from './EndpointsBase.js';

export default class PlaylistsEndpoints extends EndpointsBase {

    public async getPlaylist(uri: string, offset: number = 0, limit: MaxInt<100> = 100): Promise<Playlist<Track>> {

        if (uri.split(':').length != 3)
            throw new Error(`A playlist uri should be structured as "spotify:playlist:uid"`)

        const url = new URL(`https://api-partner.spotify.com/pathfinder/v1/query`);
        url.searchParams.append('operationName', 'fetchPlaylist')
        url.searchParams.append('variables', JSON.stringify({
            uri,
            offset: offset,
            limit: limit
        }))
        url.searchParams.append('extensions', JSON.stringify({
            persistedQuery: {
                version: 1,
                sha256Hash: getRequestHash('playlist')
            }
        }))

        const data = await this.getRequest<SpotifyPartnerPlaylistResponse>(url.toString())

        const { playlistV2 } = data.data;

        const images: Image[] = []
        playlistV2.images.items.forEach(item => {
            images.push(...item.sources)
        })

        const { content } = playlistV2
        const { pagingInfo, totalCount } = content;

        const result: Playlist<Track> = {
            description: playlistV2.description,
            href: playlistV2.sharingInfo.shareUrl,
            images,
            name: playlistV2.name,
            owner: playlistV2.ownerV2.data,
            uri: playlistV2.uri,
            tracks: {
                items: content.items.map(item => {

                    const { data } = item.itemV2;
                    const { albumOfTrack } = data;
                    const album: SimplifiedAlbum = {
                        uri: albumOfTrack.uri,
                        name: albumOfTrack.name,
                        images: albumOfTrack.coverArt.sources,
                        artists: albumOfTrack.artists.items.map(artist => ({ name: artist.profile.name, uri: artist.uri })),
                    }
                    const artists = data.artists.items.map(artist => ({ name: artist.profile.name, uri: artist.uri }))
                    return {
                        album,
                        artists,
                        discNumber: data.discNumber,
                        trackNumber: data.trackNumber,
                        trackDuration: data.trackDuration.totalMilliseconds,
                        name: data.name,
                        uri: data.uri,
                    }
                }),
                offset: pagingInfo.offset,
                limit: pagingInfo.limit,
                total: totalCount
            }
        }
        return result;

    }
}


/**
 * Inferred typing
 */
type SpotifyPartnerPlaylistResponse = {
    data: {
        playlistV2: {
            __typename: "Playlist";
            content: {
                __typename: "PlaylistItemsPage";
                items: {
                    addedAt: {
                        isoString: string;
                    };
                    addedBy: null | string;
                    attributes: { key: string; value: string }[];
                    itemV2: {
                        __typename: "TrackResponseWrapper";
                        data: {
                            __typename: "Track";
                            albumOfTrack: {
                                artists: {
                                    items: { profile: { name: string }; uri: string }[];
                                };
                                coverArt: {
                                    sources: { height: number; url: string; width: number }[];
                                };
                                name: string;
                                uri: string;
                            };
                            artists: {
                                items: { profile: { name: string }; uri: string }[];
                            };
                            associationsV2: {
                                totalCount: number;
                            };
                            contentRating: {
                                label: string;
                            };
                            discNumber: number;
                            trackDuration: {
                                totalMilliseconds: number;
                            };
                            name: string;
                            playability: {
                                playable: boolean;
                                reason: "PLAYABLE";
                            };
                            playcount: string;
                            trackNumber: number;
                            uri: string;
                        };
                    };
                    uid: string;
                }[];
                pagingInfo: {
                    limit: number;
                    offset: number;
                };
                totalCount: number;
            };
            attributes: { key: string; value: string }[];
            basePermission: "VIEWER";
            description: string;
            followers: number;
            following: boolean;
            format: "format-shows-shuffle";
            images: {
                items: {
                    extractedColors: {
                        colorRaw: {
                            hex: string;
                            isFallback: boolean;
                        };
                    };
                    sources: { height: number; url: string; width: number }[];
                }[];
            };
            name: string;
            ownerV2: {
                data: {
                    __typename: "User";
                    avatar: {
                        sources: { height: number; url: string; width: number }[];
                    };
                    name: string;
                    uri: string;
                    username: string;
                };
            };
            revisionId: string;
            sharingInfo: {
                shareId: string;
                shareUrl: string;
            };
            uri: string;
        };
    };
    extensions: Record<string, unknown>;
}