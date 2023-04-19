<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="用户账户">
            <el-input v-model="form.username" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="用户密码">
            <el-input v-model="form.password" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="真实姓名">
            <el-input v-model="form.realName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="生日">
            <el-input v-model="form.birthday" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="身份证号码">
            <el-input v-model="form.idcard" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.mark" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="昵称">
            <el-input v-model="form.nickName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="用户头像">
            <el-input v-model="form.avatar" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="form.phone" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="详细地址">
            <el-input v-model="form.address" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="用户登录类型">
            <el-input v-model="form.loginType" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="用户状态1正常0禁止">
            <el-input v-model="form.status" style="width: 370px;" />
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
        <el-table-column prop="username" label="用户账户" />
        <el-table-column prop="password" label="用户密码" />
        <el-table-column prop="realName" label="真实姓名" />
        <el-table-column prop="birthday" label="生日" />
        <el-table-column prop="idcard" label="身份证号码" />
        <el-table-column prop="mark" label="备注" />
        <el-table-column prop="nickName" label="昵称" />
        <el-table-column prop="avatar" label="用户头像" />
        <el-table-column prop="phone" label="手机号" />
        <el-table-column prop="createTime" label="添加时间" />
        <el-table-column prop="lastLoginTime" label="最后登录时间" />
        <el-table-column prop="address" label="详细地址" />
        <el-table-column prop="loginType" label="用户登录类型" />
        <el-table-column prop="wxProfile" label="微信用户json信息" />
        <el-table-column prop="status" label="用户状态1正常0禁止" />
        <el-table-column v-if="checkPer(['admin','tsUser:edit','tsUser:del'])" label="操作" width="150px" align="center">
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
import crudTsUser from '@/api/store/tsUser'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { isDel: null, id: null, username: null, password: null, realName: null, birthday: null, idcard: null, mark: null, nickName: null, avatar: null, phone: null, createTime: null, lastLoginTime: null, address: null, loginType: null, wxProfile: null, status: null }
export default {
  name: 'TsUser',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '用户表', url: 'api/tsUser', idField: 'id', sort: 'id,desc', crudMethod: { ...crudTsUser }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'tsUser:add'],
        edit: ['admin', 'tsUser:edit'],
        del: ['admin', 'tsUser:del']
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
