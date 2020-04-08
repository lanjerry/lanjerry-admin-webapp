<template>
  <el-form ref="infoForm" :model="info" :rules="rules" label-width="150px">
    <el-row>
      <el-col :span="12">
        <el-form-item prop="tplFunctions">
          <span slot="label">模板功能</span>
          <el-select v-model="info.tplFunctions" multiple placeholder="请选择" style="width:100%">
            <el-option
              v-for="tplFunction in tplFunctionOptions"
              :key="tplFunction.value"
              :label="tplFunction.label"
              :value="tplFunction.value"
            />
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item prop="packageName">
          <span slot="label">
            生成包路径
            <el-tooltip content="生成在哪个java包下，例如 org.lanjerry.admin" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
          <el-input placeholder="请输入生成包路径" v-model.trim="info.packageName" />
        </el-form-item>
      </el-col>

      <el-col :span="12" prop="moduleName">
        <el-form-item>
          <span slot="label">
            生成模块名
            <el-tooltip content="可理解为子系统名，例如 system" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
          <el-input placeholder="请输入生成模块名" v-model.trim="info.moduleName" />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item prop="businessName">
          <span slot="label">
            生成业务名
            <el-tooltip content="可理解为功能英文名，例如 user" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
          <el-input placeholder="请输入生成业务名" v-model.trim="info.businessName" />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item prop="functionName">
          <span slot="label">
            生成功能名
            <el-tooltip content="用作类描述，例如 用户" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
          <el-input placeholder="请输入生成功能名" v-model.trim="info.functionName" />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
  import { toolGenTplFunctionEnum } from '@/utils/enum'

  export default {
    name: "ToolGenInfoForm",
    props: {
      info: {
        type: Object,
        default: null
      }
    },
    data() {
      return {
        // 功能模板选项
        tplFunctionOptions: toolGenTplFunctionEnum,
        // 表单校验
        rules: {
          tplFunctions: [
            { required: true, message: "请选择功能模板", trigger: "change" }
          ],
          packageName: [
            { required: true, message: "生成包路径不能为空", trigger: "blur" }
          ],
          moduleName: [
            { required: true, message: "生成模块名不能为空", trigger: "blur" }
          ],
          businessName: [
            { required: true, message: "生成业务名不能为空", trigger: "blur" }
          ],
          functionName: [
            { required: true, message: "生成功能名不能为空", trigger: "blur" }
          ]
        }
      }
    },
  }
</script>
