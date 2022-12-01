'use strict';

const { Controller } = require('egg');
/**
 * 本文 demo 的返回值注释, 仅做参考。 跟实际结果不一致 ！！！
 *
 * @class HomeController
 * @augments {Controller}
 */
class HomeController extends Controller {
  async index(){
    this.ctx.body = 'hi, egg';
  }
  // 批量插入文档
  async bulkInsert() {
    const { app, config } = this;
    const es = app.elasticsearch;
    // 根据条件获取数据
    const questionList = config.questionList;
    if (questionList.length) { // 处理数据
      const bulkBody = [];
      questionList.forEach(el => {
        bulkBody.push({
          index: {
            _index: config.elasticsearch.questionIndex, // 指定索引名称
            _type: '_doc', // 指定插入类型
            _id: el.id, // 指定id, 可支持upsert
          },
        });
        bulkBody.push(el);
      });

      // 调用批量插入api进行插入
      try {
        await es.bulk({ body: bulkBody });
      } catch (error) {
        console.log('---> 写入数据至ES 插入失败, error:', error);
      }
    }
  }

  // 查看索引
  async catIndices() {
    const { app } = this;
    const es = app.elasticsearch;
    const { body } = await es.cat.indices();
    console.log(body);
    /*
      green  open .geoip_databases azX7RIU9TvOpmpdNlis38g 1 0    41 38 39.2mb 39.2mb
      green  open .security-7      gw07udmnQm6-OtWO-__srg 1 0     7  0 25.8kb 25.8kb
      yellow open question         X03Al0L-RDeddCODLfFtsA 1 1     2  0 7.2kb  7.2kb
    */
  }

  // 搜索文档
  async searchDoc() {
    const { app } = this;
    const es = app.elasticsearch;
    const { body } = await es.search();
    console.log(body);
    /*
      {
        took: 18,
        timed_out: false,
        _shards: { total: 1, successful: 1, skipped: 0, failed: 0 },
        hits: {
          total: { value: 10000, relation: 'gte' },
          max_score: 12.838578,
          hits: [
            [Object], [Object],
            [Object], [Object],
            [Object], [Object],
            [Object], [Object],
            [Object], [Object]
          ]
        }
      }
    */
  }

  // 根据ID搜索文档
  async searchByID() {
    const { ctx, app, config } = this;
    const es = app.elasticsearch;
    const { body } = await es.search({
      index: config.elasticsearch.questionIndex,
      body: {
        query: {
          ids: {
            values: [ ctx.params.id ],
          },
        },
      },
    });
    console.log(body);
    /*
      {
        took: 2,
        timed_out: false,
        _shards: { total: 1, successful: 1, skipped: 0, failed: 0 },
        hits: {
          total: { value: 1, relation: 'eq' },
          max_score: 1,
          hits: [ [Object] ]
        }
      }
      */
  }

  // 通过字段搜索
  async searchByTerm() {
    const { app, config } = this;
    const es = app.elasticsearch;
    const { body } = await es.search({
      index: config.elasticsearch.questionIndex,
      body: {
        query: {
          term: {
            score: 0,
          },
        },
      },
    });
    console.log(body);
    /*
      {
        took: 2,
        timed_out: false,
        _shards: { total: 1, successful: 1, skipped: 0, failed: 0 },
        hits: {
          total: { value: 430, relation: 'eq' },
          max_score: 1,
          hits: [
            [Object], [Object],
            [Object], [Object],
            [Object], [Object],
            [Object], [Object],
            [Object], [Object]
          ]
        }
      }
    */
  }

  // 通过字段搜索(多条件)
  async searchByTerms() {
    const { app, config } = this;
    const es = app.elasticsearch;
    const { body } = await es.search({
      index: config.elasticsearch.questionIndex,
      body: {
        query: {
          terms: {
            score: [ 0, 1 ],
          },
        },
      },
    });
    console.log(body);
    /*
      {
        took: 2,
        timed_out: false,
        _shards: { total: 1, successful: 1, skipped: 0, failed: 0 },
        hits: {
          total: { value: 430, relation: 'eq' },
          max_score: 1,
          hits: [
            [Object], [Object],
            [Object], [Object],
            [Object], [Object],
            [Object], [Object],
            [Object], [Object]
          ]
        }
      }
    */
  }

  // 通过关键词字段搜索(多条件)
  async searchByKeyword() {
    const { app, config } = this;
    const es = app.elasticsearch;
    const { body } = await es.search({
      index: config.elasticsearch.questionIndex,
      body: {
        query: {
          terms: {
            'type.keyword': [ 'fill' ],
          },
        },
      },
    });
    console.log(body);
    /*
      {
        took: 2,
        timed_out: false,
        _shards: { total: 1, successful: 1, skipped: 0, failed: 0 },
        hits: {
          total: { value: 430, relation: 'eq' },
          max_score: 1,
          hits: [
            [Object], [Object],
            [Object], [Object],
            [Object], [Object],
            [Object], [Object],
            [Object], [Object]
          ]
        }
      }
    */
  }

  // 复合查询
  async searchByComp() {
    const { app, config } = this;
    const es = app.elasticsearch;
    const { body } = await es.search({
      index: config.elasticsearch.questionIndex,
      from: 0,
      size: 10,
      body: {
        query: {
          bool: { // 复合查询
            must: [ // must 语句
              {
                match: { // 题干条件
                  stem: {
                    query: '嘟嘟嘟',
                  },
                },
              },
              {
                term: {
                  score: 2,
                },
              },
            ],
          },
        },
      },
    });
    console.log(body);
    /*
      {
        took: 2,
        timed_out: false,
        _shards: { total: 1, successful: 1, skipped: 0, failed: 0 },
        hits: {
          total: { value: 430, relation: 'eq' },
          max_score: 1,
          hits: [
            [Object], [Object],
            [Object], [Object],
            [Object], [Object],
            [Object], [Object],
            [Object], [Object]
          ]
        }
      }
    */
  }

  //  更新文档
  async update() {
    const { app, config } = this;
    const questionInfo = config.questionList[0];
    const es = app.elasticsearch;
    // 拼接参数
    const options = {
      index: config.elasticsearch.questionIndex,
      id: questionInfo.id,
      refresh: true, // 一般插入或者更新完文档以后不能直接查到, 这里直接刷新一下, 可能对性能有影响
    };
    options.body = {
      doc: questionInfo,
      doc_as_upsert: true, // upsert
    };
    try {
      await es.update({ options });
    } catch (error) {
      console.log('---> 更新数据至ES 插入失败, error:', error);
    }
  }

  // 批量删除文档
  async bulkDelete() {
    const { app, config } = this;
    const es = app.elasticsearch;
    // 根据条件获取数据
    const questionList = config.questionList;
    const bulkBody = [];
    if (questionList.length) { // 处理数据
      questionList.forEach(el => {
        bulkBody.push({
          delete: {
            _index: config.elasticsearch.questionIndex,
            _id: el.id,
          },
        });
      });

      // 调用批量插入api进行插入
      try {
        await es.bulk({ body: bulkBody });
      } catch (error) {
        console.log('---> 更新数据至ES 插入失败, error:', error);
      }
    }
  }

  // 根据 id 删除文档
  async deleteByID() {
    const { ctx, app, config } = this;
    const es = app.elasticsearch;
    const { body } = await es.delete({
      id: ctx.params.id,
      index: config.elasticsearch.questionIndex,
      refresh: true,
    });
    console.log(body);
    /*
      {
        _index: 'question',
        _type: '_doc',
        _id: '1',
        _version: 2,
        result: 'deleted',
        forced_refresh: true,
        _shards: { total: 2, successful: 1, failed: 0 },
        _seq_no: 37855,
        _primary_term: 1
      }
    */
  }

}

module.exports = HomeController;
