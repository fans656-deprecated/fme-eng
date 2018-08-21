import conf from './conf';

async function get(path) {
  const res = await fetch(conf.base + path);
  if (res.status === 200) {
    return await res.json();
  } else {
    console.log('ERROR', res.status, res.text());
    return null;
  }
}

async function post(path, data) {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  const res = await fetch(conf.base + path, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data),
  });
  if (res.status === 200) {
    return await res.json();
  } else {
    console.log('ERROR', res.status, res.text());
    return null;
  }
}

const api = {
  get: get,
  post: post,
};

export default api;
