<template>
  <div>
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px 0px"
      @click="showDialog"
    >
      申请售后</el-button
    >
    <!-- 表格组件 -->
    <!-- data是表格组件将来需要展示的数据 -->
    <!-- border是给表格添加边框 -->

    <!-- columns相应的属性
    label:显示的标题
    width:对应列的宽度
    align:标题名称对齐方式
    注意：element-ui当中得table组件展示得数据是一列一列展示
     -->
    <el-table style="width: 100%" border :data="list">
      <!-- 一个<el-table-column>代表一列 -->
      <el-table-column
        type="index"
        label="序号"
        width="80px"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="tmName"
        label="订单名称"
        width="width"
      ></el-table-column>
      <el-table-column prop="logoUrl" label="图片" width="width">
        <template slot-scope="{ row, $index }">
          <img :src="row.logoUrl" alt="" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            aria-setsize="mini"
            @click="updateTradeMark(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            aria-setsize="mini"
            @click="deleteTradeMark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器组件 -->
    <!-- total:一共的数据
         current-page：当前页数
         page-size:每一个需要展示多少条数据
         page-sizes：可以设置每一页展示多少条数据
         pager-count:设置按钮的数量
         layout：可以实现分页器的布局

     -->
    <el-pagination
      style="margin-top: 20px; text-align: center"
      :current-page="page"
      :total="total"
      :page-size="limit"
      :pager-count="7"
      :page-sizes="[3, 5, 10]"
      @current-change="getPageList"
      @size-change="handleSizeChange"
      layout="prev,pager,next,jumper,->,sizes,total"
    >
    </el-pagination>

    <!-- 对话框 
    visible.sync：控制对话框显示与隐藏
    -->
    <el-dialog
      :title="tmForm.id ? '修改订单' : '添加订单'"
      :visible.sync="dialogFormVisible"
    >
      <!-- form表单 :medel:1.把表单上数据收集到tmForm中，将来表单验证也需要这个属性-->
      <el-form style="width: 80%" :model="tmForm" :rules="rules" ref="ruleFrom">
        <el-form-item label="订单名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="图片" label-width="100px" prop="logoUrl">
          <!-- 这里收集数据不能使用v-model，因为不是表单元素
          action属性：设置图片上传的地址
          on-success:可以检测到图片上传成功，当成功会执行这个回调
          before-upload:上传图片之前会执行一次
          
           -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { reqDeleteTradeMark } from "@/api/product/tradeMark";
export default {
  name: "tradeMark",
  data() {
    //自定义校验规则
    var validateTmName = (rule, value, callback) => {
      if (value.length < 2 || value.length > 10) {
        callback(new Error("订单名称需要2-10位"));
      } else {
        callback();
      }
    };
    return {
      //代表分页器第几页
      page: 1,
      //每一页显示多少数据
      limit: 3,
      //总共数据得条数
      total: 0,
      //列表展示得数据
      list: [],
      //对话框显示与隐藏的控制
      dialogFormVisible: false,
      //收集订单信息
      tmForm: {
        tmName: "",
        logoUrl: "",
      },
      rules: {
        tmName: [
          { required: true, message: "请输入订单名称", trigger: "blur" },
          //自定义校验规则
          { validator: validateTmName, trigger: "change" },
        ],

        logoUrl: [{ required: true, message: "请选择订单图片" }],
      },
    };
  },
  mounted() {
    //获取列表数据方法
    this.getPageList();
  },
  methods: {
    async getPageList(pager = 1) {
      this.page = pager;
      //解构
      const { page, limit } = this;
      //获取订单列表得接口
      let result = await this.$API.trademark.reqTradeMarkList(page, limit);
      if (result.code == 200) {
        this.total = result.data.total;
        this.list = result.data.records;
      }
    },
    //当分页器某一页展示数据条数发生变化时，触发
    handleSizeChange(limit) {
      this.limit = limit;
      this.getPageList();
    },
    //点击添加按钮，显示对话框
    showDialog() {
      this.dialogFormVisible = true;
      //清理数据
      this.tmForm = { tmName: "", logoUrl: "" };
    },
    //点击修改，显示对话框
    updateTradeMark(row) {
      this.dialogFormVisible = true;
      //这里要使用浅拷贝
      this.tmForm = { ...row };
    },

    //上传图片成功回调
    handleAvatarSuccess(res, file) {
      //res是上传成功之后返回给前端的数据
      //file也是上传成功之后返回给前端的数据

      //收集订单图片数据，将来带给服务器
      this.tmForm.logoUrl = res.data;
    },

    //上传图片之前的回调
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //点击确定进行添加订单
    addOrUpdateTradeMark() {
      //当全部字段通过再书写逻辑
      this.$refs.ruleFrom.validate(async (success) => {
        if (success) {
          this.dialogFormVisible = false;
          //发请求
          let result = await this.$API.trademark.reqAddOrUpdateTradeMark(
            this.tmForm
          );
          if (result.code == 200) {
            //弹出成功信息
            this.$message({
              message: this.tmForm.id ? "修改订单成功" : "添加订单成功",
              type: "success",
            });
            //再次发请求
            //如果添加订单，应该再第一页，如果修改，应该停留再当前页
            this.getPageList(this.tmForm.id ? this.page : 1);
          }
        } else {
          console.log("error submit");
          return false;
        }
      });
    },
    //点击删除按钮删除订单
    deleteTradeMark(row) {
      this.$confirm(`你确定删除${row.tmName}吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let result = await this.$API.trademark.reqDeleteTradeMark(row.id);
          if (result.code == 200) {
            //点击确定触发
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            //再次获取数据
            this.getPageList(this.list.length>1?this.page:this.page-1);
          }
        })
        .catch(() => {
          //点击取消触发
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
