//这个模块主要获取品牌管理的数据
import request from "@/utils/request";

//获取品牌列表接口
export const reqTradeMarkList = (page, limit) =>
  request({
    url: `/admin/product/baseTrademark/${page}/${limit}`,
    method: "get",
  });

//处理添加品牌的操作
//添加品牌：不需要传id，id由服务器生成
//修改品牌：需要传id，告诉服务器你要修改哪个品牌
export const reqAddOrUpdateTradeMark = (tradeMark) => {
  //如果带给服务器的参数携带id，代表修改
  if (tradeMark.id) {
    return request({
      url: `/admin/product/baseTrademark/update`,
      method: "put",
      data: tradeMark,
    });
  } else {
    //新增品牌
    return request({
      url: `/admin/product/baseTrademark/save`,
      method: "post",
      data: tradeMark,
    });
  }
};

//删除品牌
export const reqDeleteTradeMark = (id)=>request({url:`/admin/product/baseTrademark/remove/${id}`,method:'delete'})
