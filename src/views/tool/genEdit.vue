<template>
  <el-card>
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本信息" name="basic">
        <tool-gen-basic-form ref="genBasicForm" :info="info"/>
      </el-tab-pane>
      <el-tab-pane label="字段信息" name="column">
        <el-table :data="columns" :max-height="tableHeight">
          <el-table-column label="序号" type="index" min-width="5%"/>
          <el-table-column
            label="字段名称"
            prop="columnName"
            min-width="10%"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="字段类型"
            prop="columnType"
            min-width="10%"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="JAVA类型"
            prop="javaType"
            min-width="10%"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="JAVA字段名"
            prop="javaField"
            min-width="10%"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="字段描述" min-width="10%">
            <template slot-scope="scope">
              <el-input v-model="scope.row.columnComment"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="必填" min-width="5%">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.requiredFlag"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="唯一" min-width="5%">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.onlyFlag"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="列表字段" min-width="5%">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.listFlag"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="表单字段" min-width="5%">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.formFlag"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="表单显示类型" min-width="12%">
            <template slot-scope="scope">
              <el-select v-model="scope.row.formHtmlType">
                <el-option
                  v-for="type in htmlTypeOptions"
                  :key="type.value"
                  :label="type.label"
                  :value="type.value"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="查询字段" min-width="5%">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.queryFlag"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="查询方式" min-width="10%">
            <template slot-scope="scope">
              <el-select v-model="scope.row.queryType">
                <el-option
                  v-for="type in queryTypeOptions"
                  :key="type.value"
                  :label="type.label"
                  :value="type.value"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="查询显示类型" min-width="12%">
            <template slot-scope="scope">
              <el-select v-model="scope.row.queryHtmlType">
                <el-option
                  v-for="type in htmlTypeOptions"
                  :key="type.value"
                  :label="type.label"
                  :value="type.value"
                />
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="生成信息" name="info">
        <tool-gen-info-form ref="genInfoForm" :info="info"/>
      </el-tab-pane>
    </el-tabs>
    <el-form label-width="100px">
      <el-form-item style="text-align: center;margin-left:-100px;margin-top:10px;">
        <el-button @click="closed">关 闭</el-button>
        <el-button type="primary" :loading="button.save" @click="handleSave">保 存</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
  import mixin from '@/mixin'
  import {toolGenHtmlTypeEnum, toolGenQueryTypeEnum} from '@/utils/enum'
  import {getGen, updateGen} from '@/api/tool/gen'
  import ToolGenBasicForm from '@/components/tool/gen/ToolGenBasicForm'
  import ToolGenInfoForm from '@/components/tool/gen/ToolGenInfoForm'

  export default {
    name: "GenEdit",
    components: {ToolGenBasicForm, ToolGenInfoForm},
    mixins: [
      mixin.button
    ],
    data() {
      return {
        // 遮罩层
        loading: false,
        // 选中的选项卡
        activeName: "column",
        // 表格的高度
        tableHeight: document.documentElement.scrollHeight - 245 + "px",
        // 表列信息
        columns: [],
        // 表详细信息
        info: {},
        // 查询方式选项
        queryTypeOptions: toolGenQueryTypeEnum,
        // 显示类型选项
        htmlTypeOptions: toolGenHtmlTypeEnum,
        // 保存对象
        gen: {
          info: {},
          columns: []
        }
      };
    },
    beforeCreate() {
      this.loading = true
      const {id} = this.$route.query;
      if (id) {
        // 获取表详细信息
        getGen(id).then(res => {
          this.columns = res.data.columns;
          this.info = res.data.info;
        }).catch(() => {
          this.columns = []
          this.info = {}
        }).then(() => {
          this.loading = false
        })
      }
    },
    methods: {
      // 关闭按钮操作
      closed() {
        this.$refs.genBasicForm.$refs.basicForm.clearValidate()
        this.$refs.genInfoForm.$refs.infoForm.clearValidate()
        this.$store.dispatch("tagsView/delView", this.$route);
        this.$router.push({path: "/tool/gen"})
      },
      // 保存按钮操作
      handleSave() {
        const basicForm = this.$refs.genBasicForm.$refs.basicForm;
        const infoForm = this.$refs.genInfoForm.$refs.infoForm;
        Promise.all([basicForm, infoForm].map(this.getFormPromise)).then(res => {
          const validateResult = res.every(item => !!item);
          if (validateResult) {
            const {id} = this.$route.query;
            const info = Object.assign({}, basicForm.model, infoForm.model);
            this.gen.info = info;
            this.gen.columns = this.columns;
            updateGen(id, this.gen).then(res => {
              this.msgSuccess('修改成功')
              this.closed()
            }).catch(() => {
              this.gen.info = {}
              this.gen.columns = []
            }).then(() => {
              this.clearButtonStatus()
            })
          } else {
            this.msgError("表单校验未通过，请重新检查提交内容");
          }
        });
      },
      getFormPromise(form) {
        return new Promise(resolve => {
          form.validate(res => {
            resolve(res);
          });
        });
      }
    }
  }
</script>
