<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="订单号">
            <el-input v-model="form.code" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="用户名">
            <el-input v-model="form.realName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="用户电话">
            <el-input v-model="form.userPhone" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="用户地址">
            <el-input v-model="form.userAddress" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="运费金额">
            <el-input v-model="form.expressPrice" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="商品总数">
            <el-input v-model="form.totalNum" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="订单总价">
            <el-input v-model="form.totalPrice" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="支付金额">
            <el-input v-model="form.payPrice" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="支付状态">
            <el-input v-model="form.paid" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="支付方式">
            <el-input v-model="form.payType" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="-1申请退款 -2 退款成功 0 待发货 1待收货 2 已收货 3已完成" prop="status">
            <el-input v-model="form.status" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.remark" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="isDel">
            <el-input v-model="form.isDel" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="1配送 2 自提">
            <el-input v-model="form.shippingType" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="微信订单id">
            <el-input v-model="form.wxId" style="width: 370px;" />
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
        <el-table-column prop="code" label="订单号" />
        <el-table-column prop="realName" label="用户名" />
        <el-table-column prop="userPhone" label="用户电话" />
        <el-table-column prop="userAddress" label="用户地址" />
        <el-table-column prop="expressPrice" label="运费金额" />
        <el-table-column prop="totalNum" label="商品总数" />
        <el-table-column prop="totalPrice" label="订单总价" />
        <el-table-column prop="payPrice" label="支付金额" />
        <el-table-column prop="paid" label="支付状态" />
        <el-table-column prop="payTime" label="支付时间" />
        <el-table-column prop="payType" label="支付方式" />
        <el-table-column prop="status" label="-1申请退款 -2 退款成功 0 待发货 1待收货 2 已收货 3已完成" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column prop="shippingType" label="1配送 2 自提" />
        <el-table-column prop="wxId" label="微信订单id" />
        <el-table-column v-if="checkPer(['admin','tsStoreOrder:edit','tsStoreOrder:del'])" label="操作" width="150px" align="center">
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
import crudTsStoreOrder from '@/api/store/tsStoreOrder'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { createTime: null, updateTime: null, id: null, code: null, userId: null, realName: null, userPhone: null, userAddress: null, cartId: null, expressPrice: null, totalNum: null, totalPrice: null, payPrice: null, paid: null, payTime: null, payType: null, status: null, remark: null, isDel: null, shippingType: null, storeId: null, unique: null, wxId: null }
export default {
  name: 'TsStoreOrder',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '订单', url: 'api/tsStoreOrder', idField: 'id', sort: 'id,desc', crudMethod: { ...crudTsStoreOrder }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'tsStoreOrder:add'],
        edit: ['admin', 'tsStoreOrder:edit'],
        del: ['admin', 'tsStoreOrder:del']
      },
      rules: {
        status: [
          { required: true, message: '-1申请退款 -2 退款成功 0 待发货 1待收货 2 已收货 3已完成不能为空', trigger: 'blur' }
        ]
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
