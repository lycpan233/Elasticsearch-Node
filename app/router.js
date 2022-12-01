'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => { 
  const { router, controller } = app;
  router.get('/',controller.home.index);
  // 批量插入文档
  router.get('/bulk/insert', controller.home.bulkInsert);
  // 查看索引
  router.get('/cat/indices', controller.home.catIndices);
  // 搜索文档
  router.get('/search', controller.home.searchDoc);
  // 根据ID搜索文档
  router.get('/search/:id', controller.home.searchByID);
  // 通过字段搜索
  router.get('/search/term', controller.home.searchByTerm);
  // 通过字段搜索(多条件)
  router.get('/search/terms', controller.home.searchByTerms);
  // 通过关键词字段搜索(多条件)
  router.get('/search/keyword', controller.home.searchByKeyword);
  // 复合查询
  router.get('/search/comp', controller.home.searchByComp);
  // 更新文档
  router.put('/', controller.home.update);
  // 批量删除
  router.delete('/bulk/delete', controller.home.bulkDelete);
  // 根据 id 删除
  router.delete('/:id/delete', controller.home.deleteByID);
};
