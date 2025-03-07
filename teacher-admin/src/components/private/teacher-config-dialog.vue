<template>
  <el-dialog
    title="教师配置"
    :visible.sync="dialogVisible"
    width="30%"
    @close="handleVisible(false)"
    :close-on-click-modal="false"
  >
    <div>
      <div style="font-size: 18px">
        <div class="all-rate">
          <span>每班参评人数:</span>
          <el-input type="number" max="100" min="0"
            style="width: 50px; margin-left: 20px"
            v-model="analyzeData.takePartinNum"
             @input="validateRate(analyzeData, 'takePartinNum')"
          ></el-input>  人
        </div>
        <div class="all-rate">
          <span>过线率:</span>
          <el-input type="number" max="100" min="0"
            style="width: 50px; margin-left: 20px"
             v-model="analyzeData.inLineRate"
             @input="validateRate(analyzeData, 'inLineRate')"
          ></el-input> %
        </div>
        <div class="all-rate">
          <span>优秀率:</span>
          <el-input type="number" max="100" min="0"
            style="width: 50px; margin-left: 20px"
             v-model="analyzeData.excellentRate"
             @input="validateRate(analyzeData, 'excellentRate')"
          ></el-input> %
        </div>
        
      </div>
     
    </div>
     <span slot="footer" >
      <div class="dialog-footer">
      <el-button type="primary" @click="gradeAnalyze" :loading="btnstatus" :disabled="btnstatus">进行成绩分析</el-button>

      </div>
    </span>
  </el-dialog>
</template>

<script>

import { getLocalStorage } from "@/utils/local-storage";
import { adminAnalyzeParams } from "@/api/api";

export default {
  props: {
    visible: Boolean,
    numOfPeople: Number

  },
  data() {
    return {
      dialogVisible: false,
      analyzeData: {
        takePartinNum: 46,
        inLineRate: 70,
        excellentRate: 30,
      },
      btnstatus: false
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
   
   
     validateRate(obj, key) {
      const inputValue = obj[key];
      if (inputValue === '') {
        // 如果输入为空，不做处理
        return;
      }
      let value = parseFloat(inputValue);
      if (isNaN(value)) {
        obj[key] = 0;
      } else if (value < 0) {
        obj[key] = 0;
      } else if (value > 100) {
        obj[key] = 100;
      }
    },
    gradeAnalyze() {
      this.btnstatus = true
      this.analyzeData.examId = getLocalStorage("examId").examId
      this.analyzeData.numOfPeople = this.numOfPeople
      adminAnalyzeParams(this.analyzeData).then((res) => {
        console.log(res)
        if(res && res.data){
          this.handleVisible(false);
          this.$emit("analyzeGradeData");
          this.btnstatus = false
        }
      });

    }
  },
};
</script>
<style lang="scss">

/* 去除 Chrome 和 Safari 浏览器中数字输入框的上下箭头 */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* 去除 Firefox 浏览器中数字输入框的上下箭头 */
input[type="number"] {
  -moz-appearance: textfield;
}

.people-title{
  font-size: 21px;
  font-weight: 600;
}

.all-rate {
  margin-top: 17px;
}
.upload-demo {
  width: 100%;
  text-align: center;
  margin-top: 100px;
  .upload-box {
    margin-top: 10px;
  }
}

.dialog-footer{
  text-align: center;
}
</style>