<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="收货人">
            <el-input v-model="form.realName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="form.phone" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="省">
            <el-input v-model="form.province" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="市">
            <el-input v-model="form.city" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="区">
            <el-input v-model="form.district" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="详细地址">
            <el-input v-model="form.details" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="邮编">
            <el-input v-model="form.postCode" style="width: 370px;" />
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
        <el-table-column prop="realName" label="收货人" />
        <el-table-column prop="phone" label="电话" />
        <el-table-column prop="province" label="省" />
        <el-table-column prop="city" label="市" />
        <el-table-column prop="district" label="区" />
        <el-table-column prop="details" label="详细地址" />
        <el-table-column prop="postCode" label="邮编" />
        <el-table-column prop="isDefault" label="是否默认" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="updateTime" label="更新时间" />
        <el-table-column v-if="checkPer(['admin','tsUserAddress:edit','tsUserAddress:del'])" label="操作" width="150px" align="center">
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
import crudTsUserAddress from '@/api/store/tsUserAddress'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { isDel: null, id: null, uid: null, realName: null, phone: null, province: null, city: null, district: null, details: null, postCode: null, isDefault: null, createTime: null, updateTime: null }
export default {
  name: 'TsUserAddress',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '用户地址', url: 'api/tsUserAddress', idField: 'id', sort: 'id,desc', crudMethod: { ...crudTsUserAddress }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'tsUserAddress:add'],
        edit: ['admin', 'tsUserAddress:edit'],
        del: ['admin', 'tsUserAddress:del']
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
