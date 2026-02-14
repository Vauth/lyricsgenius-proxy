# Genius API Proxy (Cloudflare Worker)
A transparent, clean proxy for the Genius.com API running on Cloudflare Workers. It routes traffic to `api.genius.com`, `genius.com/api`, and `genius.com`.

<br>

## 🗜 Features
- **Zero-Config Headers:** Passes `User-Agent`, `Cookies`, and `Referer` exactly as sent by the client.
- **Compression Fix:** Automatically handles GZIP encoding to prevent response corruption (decoding errors).
- **Method Support:** Full support for `GET`, `POST`, `PUT`, etc., ensuring no bodies are sent with GET requests.
- **Hop-by-Hop Cleaning:** Removes headers like `Keep-Alive` and `Connection` to ensure stability.

<br>

## 📡 Routes
| Proxy Path | Target |
|------------|--------|
| `/root/*`  | `https://api.genius.com/*` |
| `/public/*`| `https://genius.com/api/*` |
| `/web/*`   | `https://genius.com/*` |

<br>

## ⚙️ Deploy
- Create a [Cloudflare](https://www.cloudflare.com/) **account**.
- Navigate to `Workers & Pages > Create > Create Worker`.
- Deploy the worker by clicking **Deploy**.
- Edit the code by clicking **Edit Code**.
- Upload [worker.js](worker.js) into **Cloudflare**.
- Finally, **Deploy**.

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/vauth/lyricsgenius-proxy)

> [!NOTE]
> Cloudflare allows `200,000` free requests per day on free plan.

<br>

## 📦 Python Usage ([lyricsgenius](https://github.com/johnwmillr/LyricsGenius))
To use this with `lyricsgenius` library, you must "monkey-patch" the API constants before initializing the client. This forces the library to route requests through your worker.
```python
import lyricsgenius
from lyricsgenius.api.base import Sender

# --- CONFIGURATION ---
WORKER_URL = "https://lyricsgenius-proxy.your-subdomain.workers.dev"
Sender.API_ROOT = f"{WORKER_URL}/root/"
Sender.PUBLIC_API_ROOT = f"{WORKER_URL}/public/"
Sender.WEB_ROOT = f"{WORKER_URL}/web/"

# --- REQUEST ---
genius = lyricsgenius.Genius("GENIUS_ACCESS_TOKEN")
song = genius.search_songs("Killer Eminem", 10)
lyrics = genius.search_song(song_id=song['hits'][0]['result']['id'])
print(lyrics.lyrics)
```

<br>

## ‼️ How to reset?
To reset the `Sender` configuration back to the default Genius URLs, you simply need to reassign the original values to the class attributes.
```python
from lyricsgenius.api.base import Sender

def resetSender():
    Sender.API_ROOT = "https://api.genius.com/"
    Sender.PUBLIC_API_ROOT = "https://genius.com/api/"
    Sender.WEB_ROOT = "https://genius.com/"

resetSender()
```

<br>

## 🔗 Contributing
Contributions are welcome! Feel free to submit a pull request or report an issue.

<br>

## 🔎 License
```
MIT License

Copyright (c) 2026 Vauth

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
