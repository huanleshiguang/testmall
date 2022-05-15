//将4个模块请求得接口函数同意暴露

import * as trademark from './product/tradeMark'
import * as attr from './product/attr'
import * as spu from './product/spu'
import * as sku from './product/sku'


export default{
    trademark,
    attr,
    sku,
    spu
}