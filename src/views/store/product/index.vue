<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <div>
        <!-- 搜索 -->
        <el-input v-model="query.blurry" clearable size="small" placeholder="输入名称或者描述搜索" style="width: 200px;"
          class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-select v-model="crud.query.cateId" filterable placeholder="请选择">
          <el-option v-for="item in classifyList" :key="item.id" :label="item.cateName" :value="item.id">
          </el-option>
        </el-select>
        <rrOperation />
      </div>
      <el-button type="primary" round @click="dialogVisible = true">快速添加</el-button>
      <el-dialog title="快速添加" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
        <el-tabs :tab-position="'left'" style="height: 500px;" v-model="currentCateIndex" :before-leave="clearData">
          <el-tab-pane v-for="item in classifyList" :label="item.cateName" :key="item.cateId">
            <!--表格渲染-->
            <el-input v-model="searchText" clearable size="small" placeholder="输入商品名称" style="width: 200px;"
              class="filter-item" @keyup.enter.native="crud.toQuery" />
            <el-button class="filter-item" size="mini" type="success" icon="el-icon-search"
              @click="searchProduct">搜索</el-button>
            <el-table ref="table" :data="searchProductList" size="small" style="width: 100%; height:400px; overflow:auto"
              @selection-change="selectionChangeHandler">
              <el-table-column type="selection" width="55" />
              <el-table-column prop="code" label="商品条码(必填)" />
              <el-table-column prop="name" label="商品名称(必填)" />
              <el-table-column prop="salesPrice" label="销售价" />
            </el-table>
          </el-tab-pane>
        </el-tabs>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addProduct">确 定</el-button>
        </span>
      </el-dialog>
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0"
        :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="商品名称">
            <el-input v-model="form.name" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="商品类别名称">
            <el-select v-model="form.cateId" filterable placeholder="请选择">
              <el-option v-for="item in classifyList" :key="item.id" :label="item.cateName" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="价格">
            <el-input v-model="form.price" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="商品图片">
            <el-upload :on-success="handleSuccess" :show-file-list="false" :headers="headers" :action="qiNiuUploadApi"
              class="avatar-uploader">
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过5M</div>
              <img v-if="form.logo" :src="form.logo" class="avatar" style="width: 100px;">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="商品简介">
            <el-input v-model="form.info" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="关键字">
            <el-input v-model="form.keyword" style="width: 370px;" />
          </el-form-item>

          <el-form-item label="是否展示">
            <el-switch v-model="form.isShow" active-color="#13ce66" inactive-color="#ff4949">
            </el-switch>
          </el-form-item>
          <el-form-item label="产品描述">
            <el-input v-model="form.description" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="虚拟销量">
            <el-input v-model="form.ficti" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="排序">
            <el-input v-model="form.sort" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>

      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;"
        @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="商品名称" />
        <el-table-column prop="cateName" label="分类" />
        <el-table-column prop="barCode" label="条码" />
        <el-table-column prop="info" label="商品简介" />
        <el-table-column prop="image" label="商品图片" />
        <el-table-column prop="keyword" label="关键字" />
        <el-table-column prop="price" label="价格" />
        <el-table-column prop="sort" label="排序" />
        <el-table-column prop="isShow" label="是否展示" />
        <el-table-column prop="description" label="产品描述" />
        <el-table-column prop="ficti" label="虚拟销量" />
        <el-table-column prop="sales" label="销量" />
        <el-table-column prop="createdTime" label="创建时间" />
        <el-table-column prop="updatedTime" label="更新时间" />
        <el-table-column v-if="checkPer(['admin', 'tsProduct:edit', 'tsProduct:del'])" label="操作" width="150px"
          align="center">
          <template slot-scope="scope">
            <udOperation :data="scope.row" :permission="permission" />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudTsProductBaseInfo from '@/api/store/tsProductBaseInfo'
import crudQiNiu from '@/api/tools/qiniu'
import { mapGetters } from 'vuex'
import crudTsProduct from '@/api/store/tsProduct'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import { getToken } from '@/utils/auth'
import request from '@/utils/request'
import { Notification } from 'element-ui'
const defaultForm = {
  image: null, name: null, info: null, barCode: null,
  keyword: null, cateId: null, price: null, sort: null, isShow: true, description: null, ficti: null, sales: null, storeId: null, cateName: null
}
export default {
  name: 'TsProduct',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '商品', url: 'api/tsProduct', idField: 'id', sort: 'id,desc', crudMethod: { ...crudTsProduct } })
  },
  data() {
    return {
      permission: {
        add: ['admin', 'tsProduct:add'],
        edit: ['admin', 'tsProduct:edit'],
        del: ['admin', 'tsProduct:del']
      },
      rules: {
      },
      headers: { 'Authorization': getToken() },
      classifyList: [],
      dialogVisible: false,
      tabPosition: "left",
      searchProductList: [],
      searchText: "",
      currentCateIndex: 0,
      selections: [],
    }
  },
  computed: {
    ...mapGetters([
      'qiNiuUploadApi'
    ])
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    [CRUD.HOOK.beforeToEdit]() {
      if (this.form.isShow === '1') {
        this.form.isShow = true
      } else {
        this.form.isShow = false
      }
      return true
    },
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeSubmit]() {
      var flag = this
      this.$data.classifyList.forEach(function e(cur, index, arr) {
        if (cur.id === flag.form.cateId) {
          flag.form.cateName = cur.cateName
        }
      })
      if (this.form.isShow) {
        this.form.isShow = '1'
      } else {
        this.form.isShow = '0'
      }
      return true
    },
    // 上传图片
    handleSuccess(response, file) {
      this.form.image = file.response.data[0]
    },
    // 搜索
    searchProduct() {
      var flag = this
      var requestData = { "name": flag.searchText, "cateName": flag.classifyList[flag.currentCateIndex].cateName }
      console.log(requestData)
      request.post('/api/tsProductBaseInfo/byName', requestData)
        .then(function (response) {
          flag.searchProductList = response
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        })
    },
    //快速添加关闭
    handleClose() {
      request.post('/api/tsProductBaseInfo/byName', requestData)
        .then(function (response) {
          flag.searchProductList = response

        })
        .catch(function (error) {
          console.log(error);
        })
    },
    // 选择改变
    selectionChangeHandler(val) {
      this.selections = val
    },
    // 添加商品
    addProduct() {
      console.log(this.selections)
      if (this.selections.length == 0) {
        Notification.error({
          title: "请选择商品",
          duration: 1000
        })
      } else {
        var flag = this
        this.selections.forEach(e => {
          e["cateId"] = flag.classifyList[flag.currentCateIndex].id
        })
        request.post('/api/tsProduct/insertList', this.selections)
          .then(function (response) {
            Notification.success({
              title: "添加成功",
              duration: 1000
            })
            clearData()
          })
          .catch(function (error) {
            console.log(error);
          })
      }
    },
    clearData() {
      this.searchText = ""
      this.searchProductList = []
      this.selections = []
      return true
    },
  },
  mounted() {
    var flag = this
    crudTsProductBaseInfo.listClassify()
      .then(function (response) {
        flag.classifyList = response
      })
      .catch(function (error) {
        console.log(error)
      })
  }
}
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
  border-color: #409EFF;
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

