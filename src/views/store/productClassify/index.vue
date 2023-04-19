<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="父id">
            <el-input v-model="form.pid" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="分类名称">
            <el-input v-model="form.cateName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="排序">
            <el-input v-model="form.sort" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="图标">
            <el-input v-model="form.icon" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="是否推荐">
            <el-input v-model="form.isShow" style="width: 370px;" />
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
        <el-table-column prop="createdTime" label="创建时间" />
        <el-table-column prop="updatedTime" label="更新时间" />
        <el-table-column prop="pid" label="父id" />
        <el-table-column prop="cateName" label="分类名称" />
        <el-table-column prop="sort" label="排序" />
        <el-table-column prop="icon" label="图标" />
        <el-table-column prop="isShow" label="是否推荐" />
        <el-table-column v-if="checkPer(['admin','tsProductClassify:edit','tsProductClassify:del'])" label="操作" width="150px" align="center">
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
import crudTsProductClassify from '@/api/store/tsProductClassify'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { isDel: null, createdTime: null, updatedTime: null, id: null, pid: null, cateName: null, sort: null, icon: null, isShow: null }
export default {
  name: 'TsProductClassify',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '分类配置', url: 'api/tsProductClassify', idField: 'id', sort: 'id,desc', crudMethod: { ...crudTsProductClassify }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'tsProductClassify:add'],
        edit: ['admin', 'tsProductClassify:edit'],
        del: ['admin', 'tsProductClassify:del']
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
