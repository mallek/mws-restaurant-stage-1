# Credits to HaiyangXu @ https://gist.github.com/HaiyangXu/ec88cbdce3cdbac7b8d5
#
# -*- coding: utf-8 -*-
#test on python 3.4 ,python of lower version  has different module organization.
import http.server
from http.server import HTTPServer, BaseHTTPRequestHandler
import socketserver

PORT = 8000

Handler = http.server.SimpleHTTPRequestHandler

Handler.extensions_map={
    '.manifest': 'text/cache-manifest',
	'.html': 'text/html',
    '.png': 'image/png',
	'.jpg': 'image/jpg',
	'.svg':	'image/svg+xml',
	'.css':	'text/css',
	'.js':	'application/x-javascript',
    # '.json': 'application/json',
    # '.webp': 'image/webp',
	'': 'application/octet-stream', # Default
    }

httpd = socketserver.TCPServer(("", PORT), Handler)
hostmessage = 'http://localhost:' + str(PORT)

print("serving folder at", hostmessage)
httpd.serve_forever()

