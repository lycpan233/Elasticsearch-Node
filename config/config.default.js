/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1669606001353_5657';

  // add your middleware config here
  config.middleware = [];


  // es 配置
  config.elasticsearch = {
    questionIndex: 'question',
    url: 'http://localhost:9200',
    username: 'elastic',
    password: '123456',
  };

  config.questionList = [{
    id: 1,
    stem: '这是一个题干',
    score: 0,
  }, {
    id: 2,
    stem: '嘟嘟嘟噜嘟嘟嘟',
    score: 2,
  }];

  return {
    ...config,
  };
};
