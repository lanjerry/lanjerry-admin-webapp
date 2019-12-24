<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item>
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd"
                   v-hasPermi="['sys:permission:save']">新增
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table
      v-loading="loading"
      :data="permissionList"
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="icon" label="权限名称">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon"/>
          {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column prop="path" label="路由地址" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="component" label="组件路径" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="permission" label="权限标识" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status.value"
            :active-value="1"
            :inactive-value="2"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序"></el-table-column>
      <el-table-column prop="creatorName" label="创建人"></el-table-column>
      <el-table-column prop="createdTime" label="创建时间"></el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                     icon="el-icon-edit"
                     @click="handleUpdate(scope.row)"
                     v-hasPermi="['sys:permission:update']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['sys:permission:save']"
          >新增
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['sys:permission:remove']"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改权限对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级目录" prop="parentId">
              <TreeSelect
                v-model="form.parentId"
                :options="permissionOptions"
                :show-count="true"
                placeholder="选择上级目录"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="类型" prop="type">
              <el-radio-group v-model="form.type">
                <el-radio
                  v-for="type in typeOptions"
                  :key="type.value"
                  :label="type.value"
                >{{type.label}}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item v-if="form.type == 1" label="图标">
              <el-popover
                placement="bottom-start"
                width="460"
                trigger="click"
                @show="$refs['iconSelect'].reset()"
              >
                <IconSelect ref="iconSelect" @selected="selected"/>
                <el-input slot="reference" v-model="form.icon" placeholder="点击选择图标" readonly>
                  <svg-icon
                    v-if="form.icon"
                    slot="prefix"
                    :icon-class="form.icon"
                    class="el-input__icon"
                    style="height: 32px;width: 16px;"
                  />
                  <i v-else slot="prefix" class="el-icon-search el-input__icon"/>
                </el-input>
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="权限名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入权限名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序" prop="sort">
              <el-input-number v-model="form.sort" controls-position="right" :min="0"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.type == 1" label="路由地址" prop="path">
              <el-input v-model="form.path" placeholder="请输入路由地址"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.type == 1" label="组件路径" prop="component">
              <el-input v-model="form.component" placeholder="请输入组件路径"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="权限标识">
              <el-input v-model="form.permission" placeholder="请权限标识" maxlength="50"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="status in statusOptions"
                  :key="status.value"
                  :label="status.value"
                >{{status.label}}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.type == 1" label="是否外链" prop="frameFlag">
              <el-radio-group v-model="form.frameFlag">
                <el-radio
                  v-for="frameFlag in frameFlagOptions"
                  :key="frameFlag.value"
                  :label="frameFlag.value"
                >{{frameFlag.label}}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { listPermissions, getPermission, treePermissions, removePermission, savePermission, updatePermission, changePermissionStatus } from "@/api/sys/permission"
  import TreeSelect from "@riophae/vue-treeselect";
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import IconSelect from '@/components/IconSelect'

  export default {
    name: 'SysPermission',
    components: { TreeSelect, IconSelect },
    data() {
      return {
        // 遮罩层
        loading: true,
        // 权限表格树数据
        permissionList: [],
        // 权限树选项
        permissionOptions: [],
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false,
        // 类型数据字典
        typeOptions: [
          {
            value: 1,
            label: '菜单'
          },
          {
            value: 2,
            label: '按钮'
          }
        ],
        // 状态数据字典
        statusOptions: [
          {
            value: 1,
            label: '启用'
          },
          {
            value: 2,
            label: '停用'
          }
        ],
        // 是否外链数据字典
        frameFlagOptions: [
          {
            value: false,
            label: '否'
          },
          {
            value: true,
            label: '是'
          }
        ],
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          parentId: [
            { required: true, message: '清选择上级目录', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '权限名称不能为空', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '请选择类型', trigger: 'change' }
          ],
          sort: [
            { required: true, message: '排序不能为空', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '请选择状态', trigger: 'change' }
          ],
          frameFlag: [
            { required: true, message: '请选择是否外链', trigger: 'change' }
          ]
        }
      }
    },
    created() {
      this.getPermissionList()
    },
    methods: {
      // 选择图标
      selected(name) {
        this.form.icon = name
      },
      // 查询系统权限列表
      getPermissionList() {
        this.loading = true
        listPermissions().then(response => {
          this.permissionList = response.data
          this.loading = false
        })
      },
      // 查询树形结构系统权限列表
      getTreePermissions() {
        treePermissions().then(response => {
          this.permissionOptions = []
          const permission = { id: 0, label: '主类目', children: [] }
          permission.children = response.data
          this.permissionOptions.push(permission)
        })
      },
      // 取消按钮
      cancel() {
        this.open = false
        this.reset()
      },
      // 锁定或者解锁系统用户
      handleStatusChange(row) {
        let text = row.status.value == '1' ? '启用' : '停用'
        this.$confirm('确认要' + text + '“' + row.name + '”权限吗?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return changePermissionStatus(row.id, row.status.value)
        }).then(() => {
          this.msgSuccess(text + '成功')
        }).catch(function() {
          row.status.value = row.status.value == '1' ? 2 : 1
        })
      },
      // 表单重置
      reset() {
        this.form = {
          id: undefined,
          name: undefined,
          parentId: 0,
          type: 1,
          path: undefined,
          component: undefined,
          permission: undefined,
          icon: undefined,
          sort: 99,
          status: 1,
          frameFlag: false
        }
        this.resetForm('form')
      },
      // 搜索按钮操作
      handleQuery() {
        this.getPermissionList()
      },
      // 新增按钮操作
      handleAdd(row) {
        this.reset()
        this.getTreePermissions()
        if (row != null) {
          this.form.parentId = row.id
        }
        this.open = true
        this.title = '添加权限'
      },
      // 修改按钮操作
      handleUpdate(row) {
        this.reset()
        this.getTreePermissions()
        getPermission(row.id).then(response => {
          this.form = response.data
          this.form.id = row.id
          this.form.type = response.data.type.value
          this.form.status = response.data.status.value
          this.open = true
          this.title = '修改权限'
        })
      },
      // 提交按钮
      submitForm: function() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (this.form.id != undefined) {
              updatePermission(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess('修改成功')
                  this.open = false
                  this.getPermissionList()
                } else {
                  this.msgError(response.msg)
                }
              })
            } else {
              savePermission(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess('新增成功')
                  this.open = false
                  this.getPermissionList()
                } else {
                  this.msgError(response.msg)
                }
              })
            }
          }
        })
      },
      // 删除按钮操作
      handleDelete(row) {
        this.$confirm('是否确认删除名称为"' + row.name + '"的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return removePermission(row.id)
        }).then(() => {
          this.getPermissionList()
          this.msgSuccess('删除成功')
        }).catch(function() {
        })
      }
    }
  }
</script>
