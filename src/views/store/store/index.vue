<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="550px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
          <el-form-item label="门店名称">
            <el-input v-model="form.name" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="门店电话">
            <el-input v-model="form.phone" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="门店地址省市区">
            <el-input v-model="form.address" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="门店详情">
            <el-input v-model="form.addressDetails" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="纬度">
            <el-input v-model="form.latitude" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="经度">
            <el-input v-model="form.longitude" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="门店logo">
            <el-input v-model="form.logo" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="门头照片">
            <el-input v-model="form.banner" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="门店照片">
            <el-input v-model="form.pics" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="店铺介绍">
            <el-input v-model="form.introduce" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="营业时间">
            <el-input v-model="form.dayTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="搜索范围km">
            <el-input-number v-model="form.searchScope" :step="1" step-strictly style="width: 370px;" />
          </el-form-item>
          <el-form-item label="配送范围">
            <el-input-number v-model="form.expressScope" :step="1" step-strictly style="width: 370px;" />
          </el-form-item>
          <el-form-item label="广告">
            <el-input v-model="form.advertisement" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="门店名称" />
        <el-table-column prop="phone" label="门店电话" />
        <el-table-column prop="address" label="门店地址省市区" />
        <el-table-column prop="addressDetails" label="门店详情" />
        <el-table-column prop="latitude" label="纬度" />
        <el-table-column prop="longitude" label="经度" />
        <el-table-column prop="logo" label="门店logo" />
        <el-table-column prop="banner" label="门头照片" />
        <el-table-column prop="pics" label="门店照片" />
        <el-table-column prop="introduce" label="店铺介绍" />
        <el-table-column prop="dayTime" label="营业时间" />
        <el-table-column prop="searchScope" label="搜索范围(千米)" />
        <el-table-column prop="expressScope" label="配送范围(千米)" />
        <el-table-column prop="advertisement" label="广告" />
        <el-table-column prop="createdBy" label="创建人" />
        <el-table-column prop="createdTime" label="创建时间" />
        <el-table-column prop="updatedBy" label="更新人" />
        <el-table-column prop="updatedTime" label="更新时间" />
        <el-table-column v-if="checkPer(['admin','tsStore:edit','tsStore:del'])" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudTsStore from '@/api/store/tsStore'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { code: null, name: null, phone: null, address: null, addressDetails: null, latitude: null, longitude: null, logo: null, banner: null, pics: null, introduce: null, dayTime: null, searchScope: null, expressScope: null,
  advertisement: null, createdBy: null, createdTime: null, updatedBy: null, updatedTime: null }
export default {
  name: 'TsStore',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '仓买', url: 'api/tsStore', idField: 'id', sort: 'id,desc', crudMethod: { ...crudTsStore }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'tsStore:add'],
        edit: ['admin', 'tsStore:edit'],
        del: ['admin', 'tsStore:del']
      },
      rules: {
      }}
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    }
  }
}
</script>

<style scoped>

</style>
