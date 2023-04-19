<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="标题">
            <el-input v-model="form.title" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="明细种类">
            <el-input v-model="form.category" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="明细类型">
            <el-input v-model="form.type" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="明细数字">
            <el-input v-model="form.number" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.mark" style="width: 370px;" />
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
        <el-table-column prop="pm" label="0支出 1获得" />
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="category" label="明细种类" />
        <el-table-column prop="type" label="明细类型" />
        <el-table-column prop="number" label="明细数字" />
        <el-table-column prop="mark" label="备注" />
        <el-table-column prop="createTime" label="createTime" />
        <el-table-column prop="updateTime" label="updateTime" />
        <el-table-column prop="status" label="0 待确认 1有效 -1无效" />
        <el-table-column prop="storeId" label="店铺id" />
        <el-table-column v-if="checkPer(['admin','tsUserBill:edit','tsUserBill:del'])" label="操作" width="150px" align="center">
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
import crudTsUserBill from '@/api/store/tsUserBill'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, isDel: null, uid: null, linkId: null, pm: null, title: null, category: null, type: null, number: null, mark: null, createTime: null, updateTime: null, status: null, storeId: null }
export default {
  name: 'TsUserBill',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '用户订单', url: 'api/tsUserBill', idField: 'id', sort: 'id,desc', crudMethod: { ...crudTsUserBill }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'tsUserBill:add'],
        edit: ['admin', 'tsUserBill:edit'],
        del: ['admin', 'tsUserBill:del']
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
