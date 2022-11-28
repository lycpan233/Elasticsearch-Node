'use strict';
const ELASTICSEARCH = Symbol('Application#ELASTICSEARCH');
const { Client } = require('@elastic/elasticsearch');

module.exports = {
  // 获取 elasticsearch 客户端
  get elasticsearch() {
    if (!this[ELASTICSEARCH]) {
      const client = new Client({
        node: this.config.elasticsearch.url,
        auth: {
          username: this.config.elasticsearch.username,
          password: this.config.elasticsearch.password,
        },
      });
      this[ELASTICSEARCH] = client;
    }
    return this[ELASTICSEARCH];
  },
};
