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
          <el-form-item label="商品名称(必填)">
            <el-input v-model="form.name" style="width: 300px;" />
          </el-form-item>
          <el-form-item label="规格型号">
            <el-input v-model="form.model" style="width: 300px;" />
          </el-form-item>
          <el-form-item label="商品类别名称">
            <!-- <el-input v-model="form.cateName" style="width: 370px;" /> -->
            <el-select v-model="form.cateName" filterable placeholder="请选择">
              <el-option v-for="item in classifyList" :key="item.id" :label="item.cateName" :value="item.cateName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品品牌名称">
            <el-input v-model="form.brandName" style="width: 300px;" />
          </el-form-item>
          <el-form-item label="供应商">
            <el-input v-model="form.supplier" style="width: 300px;" />
          </el-form-item>
          <el-form-item label="销售价（必填)">
            <el-input v-model="form.salesPrice" style="width: 300px;" />
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
        <el-table-column prop="code" label="商品条码(必填)" />
        <el-table-column prop="name" label="商品名称(必填)" />
        <el-table-column prop="shortName" label="商品简称(必填)" />
        <el-table-column prop="model" label="规格型号" />
        <el-table-column prop="size" label="库存单位(必填)" />
        <el-table-column prop="cateName" label="商品类别名称(必填)" />
        <el-table-column prop="brandName" label="商品品牌名称(必填)" />
        <el-table-column prop="supplier" label="供应商(必填)" />
        <el-table-column prop="buyPrice" label="进货价" />
        <el-table-column prop="salesPrice" label="销售价" />
        <el-table-column prop="valuationMethod" label="计价方式" />
        <el-table-column prop="createdTime" label="创建时间" />
        <el-table-column v-if="checkPer(['admin', 'tsProductBaseInfo:edit', 'tsProductBaseInfo:del'])" label="操作"
          width="150px" align="center">
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
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import { getToken } from '@/utils/auth'

const defaultForm = {
  createdBy: null, createdTime: null, updatedBy: null, updatedTime: null, isDel: null, code: null, name: null, shortName: null, model: null, size: null, cateName: null, brandName: null,
  supplier: null, buyPrice: null, salesPrice: null, valuationMethod: null, id: null
}
export default {
  name: 'TsProductBaseInfo',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '商品信息', url: 'api/tsProductBaseInfo', idField: 'id', sort: 'id,desc', crudMethod: { ...crudTsProductBaseInfo } })
  },
  data() {
    return {
      permission: {
        add: ['admin', 'tsProductBaseInfo:add'],
        edit: ['admin', 'tsProductBaseInfo:edit'],
        del: ['admin', 'tsProductBaseInfo:del']
      },
      rules: {
      },
      headers: { 'Authorization': getToken() },
      classifyList: [],
    }
  },
  mounted() {
    var flag = this
    crudTsProductBaseInfo.listClassify()
      .then(function (response) {
        console.log(response);
        flag.classifyList = response
      })
      .catch(function (error) {
        console.log(error);
      });
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    }
  }
}
</script>

<style scoped></style>
