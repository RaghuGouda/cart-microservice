const nats = require('node-nats-streaming')
class NatsWrapper {
  constructor() {
    this._client = null;
  }

  connect(clusterId, clientId, url) {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise((resolve, reject) => {
      this._client.on('connect', () => {
        console.log('Connected to NATS');
        resolve();
      });

      this._client.on('error', (err) => {
        reject(err);
      });
    });
  }

  get client() {
    if (!this._client) {
      throw new Error('Cannot access NATS client before connecting');
    }

    return this._client;
  }
}

module.exports = new NatsWrapper();

