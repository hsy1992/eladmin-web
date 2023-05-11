<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0"
        :title="crud.status.title" width="550px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
          <el-form-item label="门店名称">
            <el-input v-model="form.name" style="width: 370px;" :maxlength="20" />
          </el-form-item>
          <el-form-item label="门店电话">
            <el-input v-model="form.phone" style="width: 370px;" :maxlength="20" />
          </el-form-item>
          <el-form-item label="门店地址">
            <el-button type="primary" icon="el-icon-map" @click="showMap">选择地址</el-button>
          </el-form-item>
          <el-form-item label="门店详情">
            <el-input v-model="form.addressDetails" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="纬度，经度">
            <div style="width: 370px;">{{ form.latitude }} {{ form.longitude }}</div>
          </el-form-item>
          <el-form-item label="门店logo">
            <el-upload :on-success="handleSuccess" :show-file-list="false" :headers="headers" :action="qiNiuUploadApi"
              class="avatar-uploader">
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过5M</div>
              <img v-if="form.logo" :src="form.logo" class="avatar" style="width: 100px;">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="门头照片">
            <el-upload :on-success="handleSuccessBanner" :show-file-list="false" :headers="headers"
              :action="qiNiuUploadApi" class="avatar-uploader">
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过5M</div>
              <img v-if="form.banner" :src="form.banner" class="avatar" style="width: 100px;">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="门店照片">
            <el-upload :on-success="handleSuccessStore" :show-file-list="false" :headers="headers"
              :action="qiNiuUploadApi" class="avatar-uploader">
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过5M</div>
              <img v-if="form.pics" :src="form.pics" class="avatar" style="width: 100px;">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="店铺介绍">
            <el-input v-model="form.introduce" style="width: 370px;" type="textarea" :rows="3" :maxlength="300" />
          </el-form-item>
          <el-form-item label="营业时间">
            <el-input v-model="form.dayTime" style="width: 370px;" :maxlength="100" />
          </el-form-item>
          <el-form-item label="搜索范围km">
            <el-input-number v-model="form.searchScope" :step="1" step-strictly style="width: 370px;" />
          </el-form-item>
          <el-form-item label="配送范围">
            <el-input-number v-model="form.expressScope" :step="1" step-strictly style="width: 370px;" />
          </el-form-item>
          <el-form-item label="广告">
            <el-input type="textarea" :rows="3" :maxlength="300" v-model="form.advertisement" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!-- 百度地图位置选择 -->
      <BMapAddressSelect ref="bmapAddressSelect" @confirmMapAddress="confirmMapAddress"></BMapAddressSelect>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;"
        @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="门店名称" />
        <el-table-column prop="phone" label="门店电话" />
        <!-- <el-table-column prop="address" label="门店地址" /> -->
        <el-table-column prop="addressDetails" label="门店详情" />
        <el-table-column prop="latitude" label="经纬度" />
        <!-- <el-table-column prop="logo" label="门店logo" /> -->
        <!-- <el-table-column prop="banner" label="门头照片" />
        <el-table-column prop="pics" label="门店照片" /> -->
        <el-table-column prop="introduce" label="店铺介绍" />
        <el-table-column prop="dayTime" label="营业时间" />
        <el-table-column prop="searchScope" label="搜索范围(千米)" />
        <el-table-column prop="expressScope" label="配送范围(千米)" />
        <el-table-column prop="advertisement" label="广告" />
        <el-table-column prop="createdBy" label="创建人" />
        <el-table-column prop="createdTime" label="创建时间" />
        <el-table-column prop="updatedBy" label="更新人" />
        <el-table-column prop="updatedTime" label="更新时间" />
        <el-table-column v-if="checkPer(['admin', 'tsStore:edit', 'tsStore:del'])" label="操作" width="150px"
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
import crudQiNiu from '@/api/tools/qiniu'
import { mapGetters } from 'vuex'
import crudTsStore from '@/api/store/tsStore'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import BMapAddressSelect from "@/views/components/BMapAddressSelect/index"
import { getToken } from '@/utils/auth'

const defaultForm = {
  code: null, name: null, phone: null, address: null, addressDetails: null, latitude: null, longitude: null, logo: null, banner: null, pics: null, introduce: null, dayTime: null, searchScope: null, expressScope: null,
  advertisement: null, createdBy: null, createdTime: null, updatedBy: null, updatedTime: null
}
export default {
  name: 'TsStore',
  components: { pagination, crudOperation, rrOperation, udOperation, BMapAddressSelect },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '仓买', url: 'api/tsStore', idField: 'id', sort: 'id,desc', crudMethod: { ...crudTsStore} })
  },
  data() {
    return {
      permission: {
        add: ['admin', 'tsStore:add'],
        edit: ['admin', 'tsStore:edit'],
        del: ['admin', 'tsStore:del']
      },
      rules: {
      },
      headers: { 'Authorization': getToken() }
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
    /** 显示地图 */
    showMap() {
      this.$refs.bmapAddressSelect.show();
    },
    /** 确认地图地址 */
    confirmMapAddress(addressInfo) {
      console.log(addressInfo);
      this.form.latitude = addressInfo.latitude
      this.form.longitude = addressInfo.longitude
      this.form.addressDetails = addressInfo.province + addressInfo.city + addressInfo.district + addressInfo.address
    },
    // 上传图片
    handleSuccess(response, file) {
      this.form.logo = file.response.data[0]
    },
    // 上传图片
    handleSuccessBanner(response, file) {
      this.form.banner = file.response.data[0]
    },
    // 上传图片
    handleSuccessStore(response, file) {
      this.form.pics = file.response.data[0]
    },
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
