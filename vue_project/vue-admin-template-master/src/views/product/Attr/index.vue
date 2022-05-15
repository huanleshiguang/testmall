<template>
  <div>
    <el-card style="margin: 20px 0px">
      <CategorySelect @getCategoryId="getCategoryId"></CategorySelect>
    </el-card>

    <el-card>
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="isShowTable = false"
          >添加属性</el-button
        >
        <!-- 表格 展示平台属性 -->
        <el-table style="width: 100%" border :data="attrList">
          <el-table-column
            label="序号"
            width="80px"
            type="index"
            align="center"
          ></el-table-column>
          <el-table-column
            label="属性名称"
            width="150px"
            prop="attrName"
          ></el-table-column>
          <el-table-column label="属性值列表" prop="prop" width="width">
            <template slot-scope="{ row, $index }">
              <el-tag
                type="success"
                style="margin: 0 20px"
                v-for="(attrValue, index) in row.attrValueList"
                :key="attrValue"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150px">
            <template slot-scope="{ row, $index }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="isShowTable = false"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 修改，添加属性的结构 -->
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" label-width="80px" :model=" attrInfo">
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名" v-model=" attrInfo.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" 
          >添加属性值</el-button
        >
        <el-button @click="isShowTable=true">取消</el-button>
        <el-table style="width: 100%; margin:20px 0px" border >
            <el-table-column label="序号" type="index" width="80px" align="center"></el-table-column>
              <el-table-column label="属性值名称" prop="prop"></el-table-column>
                <el-table-column label="操作" prop="prop"></el-table-column>
        </el-table>
        <el-button type="primary">保存</el-button>
        <el-button @click="isShowTable=true" >取消</el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      //接收服务器属性的字段
      attrList: [],
      isShowTable: true,
      //收集新增的属性|修改的属性
      attrInfo:{
          attrName:'',
      }
    };
  },
  methods: {
    //自定义事件的回调
    getCategoryId({ categoryId, level }) {
      if (level == 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        //代表三级分类id有了
        //发请求获取平台属性
        this.category3Id = categoryId;
        this.getAttrList();
      }
    },
    //获取平台属性的数据
    //当用户获取三级ID时候，可以向服务器发请求获取商品属性了
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this;
      let result = await this.$API.attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code == 200) {
        this.attrList = result.data;
      }
    },
  },
  mounted() {},
};
</script>
<style scoped lang="less"></style>
