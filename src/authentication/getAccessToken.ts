import deserialize from "../serialization/deserialize"
import { AccessToken } from "../types"

export default async function getAccessToken() {
    const result = await fetch('https://open.spotify.com/get_access_token')
    return await deserialize<AccessToken>(result)
}