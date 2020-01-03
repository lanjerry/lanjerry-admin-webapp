<template>
  <el-form ref="form" :model="user" :rules="rules" label-width="80px">
    <el-form-item label="昵称" prop="name">
      <el-input v-model="user.name" />
    </el-form-item>
    <el-form-item label="手机号码" prop="phone">
      <el-input v-model="user.phone" maxlength="11" />
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="user.email" maxlength="50" />
    </el-form-item>
    <el-form-item label="性别" prop="sex">
      <el-radio-group v-model="user.sex">
        <el-radio
          v-for="sex in sexOptions"
          :key="sex.value"
          :label="sex.value"
        >{{sex.label}}
        </el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button type="danger" size="mini" @click="close">关闭</el-button>
      <el-button type="primary" size="mini" @click="submit">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { updateUserProfile } from "@/api/common/currentUser";

export default {
  props: {
    user: {
      type: Object
    }
  },
  data() {
    return {
      // 性别数据字典
      sexOptions: [
        {
          value: 1,
          label: '男'
        },
        {
          value: 2,
          label: '女'
        },
        {
          value: 3,
          label: '未知'
        }
      ],
      // 表单校验
      rules: {
        name: [
          { required: true, message: "昵称不能为空", trigger: "blur" }
        ],
        email: [
          {
            type: "email",
            message: "'请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        phone: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ]
      }
    };
  },
  methods: {
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          updateUserProfile(this.user).then(response => {
            if (response.code === 200) {
              this.msgSuccess("修改成功");
            } else {
              this.msgError(response.msg);
            }
          });
        }
      });
    },
    close() {
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.push({ path: "/index" });
    }
  }
};
</script>
