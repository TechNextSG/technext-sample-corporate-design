# -*- coding: utf-8 -*-
"""Local preview server that mirrors Vercel's `cleanUrls`.

The built site links to extensionless URLs (/blog/foo), so a plain static server
404s on every internal link. This resolves /x to x.html and /x/ to x/index.html,
the same way the production host does.
"""
import functools, http.server, json, os, pathlib, re, socketserver, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 3960

# Mirror production: apply vercel.json's `headers` rules (matched top to bottom, a later
# rule overriding the same key) so the CSP can be exercised locally before a deploy.
# The rules used here are plain regex groups, so path-to-regexp == re.
HEADER_RULES = []
try:
    for rule in json.loads((ROOT / "vercel.json").read_text(encoding="utf-8")).get("headers", []):
        HEADER_RULES.append((re.compile("^" + rule["source"] + "$"), rule["headers"]))
except (OSError, ValueError, KeyError):
    pass


class Handler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        p = super().translate_path(path)
        if os.path.isdir(p):
            # blog.html and blog/ both exist; Vercel's cleanUrls serves the FILE for /blog,
            # so prefer it and never emit the directory redirect the base class would.
            if os.path.exists(p + ".html"):
                return p + ".html"
            idx = os.path.join(p, "index.html")
            if os.path.exists(idx):
                return idx
        if not os.path.exists(p):
            for cand in (p + ".html", os.path.join(p, "index.html")):
                if os.path.exists(cand):
                    return cand
        return p

    def end_headers(self):
        path = self.path.split("?", 1)[0]
        out = {}
        for rx, hdrs in HEADER_RULES:
            if rx.match(path):
                for h in hdrs:
                    out[h["key"]] = h["value"]
        for k, v in out.items():
            if k == "Content-Security-Policy":
                # loopback is plain http locally; the upgrade directive would rewrite
                # every asset URL to https://127.0.0.1 and break the page under test
                v = v.replace("; upgrade-insecure-requests", "")
            self.send_header(k, v)
        super().end_headers()

    def send_error(self, code, message=None, explain=None):
        if code == 404:
            f = ROOT / "404.html"
            if f.exists():
                body = f.read_bytes()
                self.send_response(404)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.send_header("Content-Length", str(len(body)))
                self.end_headers()
                self.wfile.write(body)
                return
        super().send_error(code, message, explain)

    def log_message(self, fmt, *args):
        pass


if __name__ == "__main__":
    # threaded: a browser holds keep-alive connections open, which stalls a single-threaded server
    socketserver.ThreadingTCPServer.allow_reuse_address = True
    socketserver.ThreadingTCPServer.daemon_threads = True
    # several headless browsers load pages at once during QA; the default backlog (5) refuses connections
    socketserver.ThreadingTCPServer.request_queue_size = 128
    h = functools.partial(Handler, directory=str(ROOT))
    with socketserver.ThreadingTCPServer(("127.0.0.1", PORT), h) as httpd:
        print(f"serving {ROOT} at http://127.0.0.1:{PORT} (cleanUrls)")
        httpd.serve_forever()
