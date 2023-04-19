<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="商品图片">
            <el-input v-model="form.image" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="商品名称">
            <el-input v-model="form.name" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="商品简介">
            <el-input v-model="form.info" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="条码">
            <el-input v-model="form.barCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="关键字">
            <el-input v-model="form.keyword" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="分类id">
            <el-input v-model="form.cateId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="价格">
            <el-input v-model="form.price" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="排序">
            <el-input v-model="form.sort" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="是否展示">
            <el-input v-model="form.isShow" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="产品描述">
            <el-input v-model="form.description" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="虚拟销量">
            <el-input v-model="form.ficti" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="销量">
            <el-input v-model="form.sales" style="width: 370px;" />
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
        <el-table-column prop="createdBy" label="创建人" />
        <el-table-column prop="createdTime" label="创建时间" />
        <el-table-column prop="updatedBy" label="更新人" />
        <el-table-column prop="updatedTime" label="更新时间" />
        <el-table-column prop="image" label="商品图片" />
        <el-table-column prop="name" label="商品名称" />
        <el-table-column prop="info" label="商品简介" />
        <el-table-column prop="barCode" label="条码" />
        <el-table-column prop="keyword" label="关键字" />
        <el-table-column prop="cateId" label="分类id" />
        <el-table-column prop="price" label="价格" />
        <el-table-column prop="sort" label="排序" />
        <el-table-column prop="isShow" label="是否展示" />
        <el-table-column prop="description" label="产品描述" />
        <el-table-column prop="ficti" label="虚拟销量" />
        <el-table-column prop="sales" label="销量" />
        <el-table-column v-if="checkPer(['admin','tsProduct:edit','tsProduct:del'])" label="操作" width="150px" align="center">
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
import crudTsProduct from '@/api/store/tsProduct'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { createdBy: null, createdTime: null, updatedBy: null, updatedTime: null, isDel: null, id: null, image: null, name: null, info: null, barCode: null, keyword: null, cateId: null, price: null, sort: null, isShow: null, description: null, ficti: null, sales: null, storeId: null }
export default {
  name: 'TsProduct',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '商品', url: 'api/tsProduct', idField: 'id', sort: 'id,desc', crudMethod: { ...crudTsProduct }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'tsProduct:add'],
        edit: ['admin', 'tsProduct:edit'],
        del: ['admin', 'tsProduct:del']
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
