import json
import random
import hashlib

import pymongo
from flask import *


app = Flask(__name__, static_folder='../frontend/build')


@app.after_request
def after_request(r):
    r.headers['Cache-Control'] = 'no-cache'
    return r


@app.route('/')
@app.route('/<string:fname>')
def index(fname='index.html'):
    return send_from_directory('../frontend/build', fname)


@app.route('/api/rand')
@app.route('/api/rand/<string:md5>')
def get_rand(md5=''):
    return json.dumps(get_rand(md5))


@app.route('/api/all')
def get_all():
    r = getdb().eng.find({}, {'_id': False})
    return json.dumps(list(r))


@app.route('/api/new', methods=['POST'])
def post_sentence():
    content_length = request.headers.get('content-length')
    try:
        content_length = int(content_length)
    except ValueError:
        content_length = 0
    if content_length < 8 or content_length > 1024:
        return 'error', 400
    data = request.json
    text = data.get('text', None)
    if not text:
        return 'no data', 400
    md5 = get_md5(text)
    sentence = {
        '_id': md5,
        'md5': md5,
        'sentence': text,
    }
    r = getdb().eng.update({'md5': md5}, sentence, upsert=True)
    if r['n'] != 1:
        return 'error', 500
    return json.dumps(sentence)


@app.route('/api/delete/<string:md5>')
@app.route('/api/<string:md5>', methods=['DELETE'])
def delete(md5):
    r = getdb().eng.remove({'md5': md5})
    if r['n'] != 1:
        return 'not found', 404
    return json.dumps({})


def get_md5(data):
    m = hashlib.md5()
    m.update(data)
    return m.hexdigest()


def getdb(g={}):
    if 'db' not in g:
        g['db'] = pymongo.MongoClient().fme
    return g['db']


def get_rand(md5):
    r = getdb().eng.find({}, {'_id': False})
    sentences = list(r)
    for _ in xrange(1000):
        sentence = random.choice(sentences)
        if sentence['md5'] != md5:
            break
    return sentence


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, threaded=True, debug=conf.debug)
