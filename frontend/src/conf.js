const port = window.location.port;
const base = port.length ? '' : '/eng';

const conf = {
  port: port,
  base: base,
};

export default conf;
