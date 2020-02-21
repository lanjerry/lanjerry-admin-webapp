<template>
  <el-form ref="basicForm" :model="info" :rules="rules" label-width="150px">
    <el-row>
      <el-col :span="12">
        <el-form-item label="表名称" prop="tableName">
          <el-input placeholder="请输入表名称" v-model="info.tableName" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="表描述" prop="tableComment">
          <el-input placeholder="请输入表描述" v-model="info.tableComment" />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="实体类" prop="className">
          <el-input placeholder="请输入实体类" v-model="info.className" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="作者" prop="functionAuthor">
          <el-input placeholder="请输入作者" v-model="info.functionAuthor" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="备注" prop="remark">
          <el-input placeholder="请输入备注" type="textarea" :rows="3" v-model="info.remark"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
  export default {
    name: "ToolGenBasicForm",
    props: {
      info: {
        type: Object,
        default: null
      }
    },
    data() {
      return {
        rules: {
          tableName: [
            { required: true, message: "表名称不能为空", trigger: "blur" }
          ],
          tableComment: [
            { required: true, message: "表描述不能为空", trigger: "blur" }
          ],
          className: [
            { required: true, message: "实体类名称不能为空", trigger: "blur" }
          ],
          functionAuthor: [
            { required: true, message: "作者不能为空", trigger: "blur" }
          ]
        }
      };
    }
  }
</script>
