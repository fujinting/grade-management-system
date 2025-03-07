<template>
  <el-dialog
    title="成绩上传"
    :visible.sync="dialogVisible"
    width="30%"
    @close="handleVisible(false)"
    :close-on-click-modal="false"
  >
    <div>
      <div style="font-size: 17px">
        <div>
          <span>考试名称:</span>
          <el-input
            style="width: 75%; margin-left: 20px"
            v-model="uploadData.examName"
          ></el-input>
        </div>
        <div>
          <span>考试年级:</span>
          <el-select
            v-model="uploadData.examGrade"
            placeholder="请选择"
            style="margin-left: 20px; margin-top: 20px"
          >
            <el-option label="七年级" value="七年级"> </el-option>
            <el-option label="八年级" value="八年级"> </el-option>
            <el-option label="九年级" value="九年级"> </el-option>
          </el-select>
        </div>
        <div style="margin-top: 30px">
          <span>折合分数：</span>
          <span style="margin-left: 8px">
            <el-radio v-model="uploadData.convertInto" label="1">是</el-radio>
            <el-radio v-model="uploadData.convertInto" label="2">否</el-radio>
          </span>
        </div>
      </div>
      <el-upload
        class="upload-demo"
        ref="upload"
        action="http://localhost:3000/admin/analyze/uploadManyClassGrade"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        :on-success="handleExcelSuccess"
        :on-error="handleExcelError"
        accept=".xlsx,.xls"
        :limit="1"
        :on-exceed="handleExceed"
        :file-list="fileList"
        :auto-upload="false"
        :data="uploadData"
      >
        <el-button size="medium" type="primary" icon="el-icon-folder-add"
          >①导入整个年级成绩</el-button
        >
        <el-button
          style="margin-left: 10px"
          icon="el-icon-upload"
          type="success"
          @click.stop="submitUpload"
          >②上传成绩到服务器</el-button
        >
      </el-upload>
    </div>
    <div style="margin-top: 60px">
      <h2>注意事项：</h2>
      <p>
        上传列表头须包括：考号、姓名、班级、总分、语文、数学、英语、道法、历史、地理、生物、物理、化学
      </p>
    </div>
  </el-dialog>
</template>

<script>
import { setLocalStorage } from "@/utils/local-storage";

export default {
  props: {
    visible: Boolean,
  },
  data() {
    return {
      dialogVisible: false,
      form: {},
      fileList: [],
      uploadData: {
        examName: "",
        examGrade: "七年级",
        convertInto: "1",
      },
    };
  },
  mounted() {
    this.handleVisible(this.visible);
  },
  watch: {
    visible(val) {
      this.handleVisible(val);
    },
  },
  methods: {
    handleVisible(val) {
      this.dialogVisible = val;
      this.$emit("update:visible", val);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleExcelSuccess(res) {
      setLocalStorage({
        examId: res.examId
      });
      this.handleVisible(false);
      this.$emit("getGradeData");
    },
    submitUpload() {
      console.log(this.fileList);
      if (!this.uploadData.examName) {
        this.$message({
          message: "请输入考试名称",
          type: "error",
        });
      } else {
        this.$refs.upload.submit();
      }
    },
  },
};
</script>
<style lang="scss">
.upload-demo {
  width: 100%;
  text-align: center;
  margin-top: 100px;
  .upload-box {
    margin-top: 10px;
  }
}
</style>