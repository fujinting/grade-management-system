<template>
  <div>
    <div
      v-loading="listLoading"
      element-loading-text="拼命加载中..."
      element-loading-spinner="el-icon-loading"
    >
      <el-steps
        :active="analyzeGradeStatus"
        finish-status="success"
        align-center
        :space="'90%'"
      >
        <el-step
          :title="analyzeGradeStatus == 0 ? '待上传成绩' : '已上传成绩'"
          icon="el-icon-upload"
        ></el-step>
        <el-step
          :title="analyzeGradeStatus <= 1 ? '待分析成绩' : '已分析成绩'"
          icon="el-icon-data-line"
        ></el-step>
        <el-step title="待下载结果" icon="el-icon-download"></el-step>
      </el-steps>
      <div class="handle-btn">
        <el-button
          type="primary"
          style="margin-top: 30px"
          @click="dialogShow"
          >{{ handleBtnTittle }}</el-button
        >
      </div>
      <!-- 上传成绩dialog -->
      <upload-grade-dialog
        :visible.sync="uploadDialog"
        @getGradeData="getGradeData"
      />
      <!-- 成绩分析dialog -->
      <grade-analyze-dialog
        :numOfPeople="dataTotal"
        :visible.sync="analyzeDialog"
        @analyzeGradeResult="analyzeGradeResult"
      />
    </div>
    <div v-if="this.analyzeGradeStatus === 1">
      <el-table
        :data="currentGradeList"
        style="width: 100%; margin-top: 20px"
        border
        height="622"
      >
        <el-table-column prop="examNumber" label="考号" width="160">
        </el-table-column>
        <el-table-column prop="studentName" label="姓名"> </el-table-column>
        <el-table-column prop="class" label="班级"> </el-table-column>
        <el-table-column prop="chinese" label="语文"> </el-table-column>
        <el-table-column prop="math" label="数学"> </el-table-column>
        <el-table-column prop="english" label="英语"> </el-table-column>
        <el-table-column prop="political" label="道法"> </el-table-column>
        <el-table-column prop="history" label="历史"> </el-table-column>
        <el-table-column prop="geography" label="地理"> </el-table-column>
        <el-table-column prop="biology" label="生物"> </el-table-column>
        <el-table-column prop="physics" label="物理"> </el-table-column>
        <el-table-column prop="chemistry" label="化学"> </el-table-column>
        <el-table-column prop="score" label="总分"> </el-table-column>
        <el-table-column prop="schoolRank" label="校次"> </el-table-column>
        <el-table-column prop="classRank" label="班次"> </el-table-column>
      </el-table>
      <div class="youxiaoyu">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page="currentPage1"
          :page-size="pageSize"
          :page-count="12"
          layout="total, prev, pager, next"
          :total="dataTotal"
        >
        </el-pagination>
      </div>
    </div>
    <div v-if="this.analyzeGradeStatus === 2">
      <el-table
        :data="analyzeGradeData"
        style="width: 100%; margin-top: 20px"
        border
        height="520"
      >
        <el-table-column prop="className" fixed label="班级"> </el-table-column>
        <el-table-column prop="classSize" fixed label="考试人数">
        </el-table-column>
        <el-table-column prop="numOfParticipants" fixed label="参评人数">
        </el-table-column>
        <el-table-column label="语文" header-align="center">
          <el-table-column
            prop="subjectAverages.chinese"
            label="平均分"
            width="180"
          >
          </el-table-column>
          <el-table-column
            prop="subjectRanks.chinese"
            label="平均分名次"
            width="100"
          >
          </el-table-column>
          <el-table-column
            prop="subjectAverages.chineseInLineCount"
            label="进线人数"
          >
          </el-table-column>
          <el-table-column
            prop="subjectAverages.chineseInLineRate"
            width="180"
            label="进线率"
          >
          </el-table-column>
          <el-table-column
            prop="subjectRanks.chineseInLineRateRank"
            label="进线率名次"
            width="100"
          >
          </el-table-column>
          <el-table-column
            prop="subjectAverages.chineseExcellentCount"
            label="优秀人数"
          >
          </el-table-column>
          <el-table-column
            prop="subjectAverages.chineseExcellentRate"
            width="180"
            label="优秀率"
          >
          </el-table-column>
          <el-table-column
            prop="subjectRanks.chineseExcellentRateRank"
            label="优秀率名次"
            width="100"
          >
          </el-table-column>
          <el-table-column
            prop="subjectAverages.chineseTotalScore"
            label="总评得分"
            width="180"
          >
          </el-table-column>
          <el-table-column
            prop="subjectRanks.chineseTotalRank"
            label="总评名次"
            width="100"
          >
          </el-table-column>
          <el-table-column prop="teacher.chinese" label="教师" width="100">
            <template slot-scope="scope">
              {{ getDisplayTeacher(scope.row, "chinese", "onlyTeacher") }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="数学" header-align="center">
          <el-table-column
            prop="subjectAverages.math"
            label="平均分"
            width="180"
          >
          </el-table-column>
          <el-table-column
            prop="subjectRanks.math"
            label="平均分名次"
            width="100"
          >
          </el-table-column>
          <el-table-column
            prop="subjectAverages.mathInLineCount"
            label="进线人数"
          >
          </el-table-column>
          <el-table-column
            prop="subjectAverages.mathInLineRate"
            label="进线率"
            width="180"
          >
          </el-table-column>
          <el-table-column
            prop="subjectRanks.mathInLineRateRank"
            label="进线率名次"
            width="100"
          >
          </el-table-column>
          <el-table-column
            prop="subjectAverages.mathExcellentCount"
            label="优秀人数"
          >
          </el-table-column>
          <el-table-column
            prop="subjectAverages.mathExcellentRate"
            label="优秀率"
            width="180"
          >
          </el-table-column>
          <el-table-column
            prop="subjectRanks.mathExcellentRateRank"
            label="优秀率名次"
            width="100"
          >
          </el-table-column>
          <el-table-column
            prop="subjectAverages.mathTotalScore"
            label="总评得分"
            width="180"
          >
          </el-table-column>
          <el-table-column
            prop="subjectRanks.mathTotalRank"
            label="总评名次"
            width="100"
          >
          </el-table-column>
          <el-table-column prop="teacher.math" label="教师" width="100">
            <template slot-scope="scope">
              {{ getDisplayTeacher(scope.row, "math", "onlyTeacher") }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="英语" header-align="center">
          <el-table-column
            prop="subjectAverages.english"
            label="平均分"
            width="180"
          >
          </el-table-column>
          <el-table-column
            prop="subjectRanks.english"
            label="平均分名次"
            width="100"
          >
          </el-table-column>
          <el-table-column
            prop="subjectAverages.englishInLineCount"
            label="进线人数"
          >
          </el-table-column>
          <el-table-column
            prop="subjectAverages.englishInLineRate"
            label="进线率"
            width="180"
          >
          </el-table-column>
          <el-table-column
            prop="subjectRanks.englishInLineRateRank"
            label="进线率名次"
            width="100"
          >
          </el-table-column>
          <el-table-column
            prop="subjectAverages.englishExcellentCount"
            label="优秀人数"
          >
          </el-table-column>
          <el-table-column
            prop="subjectAverages.englishExcellentRate"
            label="优秀率"
            width="180"
          >
          </el-table-column>
          <el-table-column
            prop="subjectRanks.englishExcellentRateRank"
            label="优秀率名次"
            width="100"
          >
          </el-table-column>
          <el-table-column
            prop="subjectAverages.englishTotalScore"
            label="总评得分"
            width="180"
          >
          </el-table-column>
          <el-table-column
            prop="subjectRanks.englishTotalRank"
            label="总评名次"
            width="100"
          >
          </el-table-column>
          <el-table-column prop="teacher.english" label="教师" width="100">
             <template slot-scope="scope">
              {{ getDisplayTeacher(scope.row, "english", "onlyTeacher") }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="道法" header-align="center">
          <el-table-column
            prop="subjectAverages.political"
            label="平均分"
            width="180"
          >
          </el-table-column>
          <el-table-column
            prop="subjectRanks.political"
            label="平均分名次"
            width="100"
          >
          </el-table-column>
          <el-table-column
            prop="subjectAverages.politicalInLineCount"
            label="进线人数"
          >
          </el-table-column>
          <el-table-column
            prop="subjectAverages.politicalInLineRate"
            label="进线率"
            width="180"
          >
          </el-table-column>
          <el-table-column
            prop="subjectRanks.politicalInLineRateRank"
            label="进线率名次"
            width="100"
          >
          </el-table-column>
          <el-table-column
            prop="subjectAverages.politicalExcellentCount"
            label="优秀人数"
          >
          </el-table-column>
          <el-table-column
            prop="subjectAverages.politicalExcellentRate"
            label="优秀率"
            width="180"
          >
          </el-table-column>
          <el-table-column
            prop="subjectRanks.politicalExcellentRateRank"
            label="优秀率名次"
            width="100"
          >
          </el-table-column>
          <el-table-column
            prop="subjectAverages.politicalTotalScore"
            label="总评得分"
            width="180"
          >
          </el-table-column>
          <el-table-column
            prop="subjectRanks.politicalTotalRank"
            label="总评名次"
            width="100"
          >
          </el-table-column>
          <el-table-column prop="teacher.political" label="教师" width="100">
             <template slot-scope="scope">
              {{ getDisplayTeacher(scope.row, "political", "onlyTeacher") }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="历史" header-align="center">
          <el-table-column
            prop="subjectAverages.history"
            label="平均分"
            width="180"
          >
          </el-table-column>
          <el-table-column
            prop="subjectRanks.history"
            label="平均分名次"
            width="100"
          >
          </el-table-column>
          <el-table-column
            prop="subjectAverages.historyInLineCount"
            label="进线人数"
          >
          </el-table-column>
          <el-table-column
            prop="subjectAverages.historyInLineRate"
            label="进线率"
            width="180"
          >
          </el-table-column>
          <el-table-column
            prop="subjectRanks.historyInLineRateRank"
            label="进线率名次"
            width="100"
          >
          </el-table-column>
          <el-table-column
            prop="subjectAverages.historyExcellentCount"
            label="优秀人数"
          >
          </el-table-column>
          <el-table-column
            prop="subjectAverages.historyExcellentRate"
            label="优秀率"
            width="180"
          >
          </el-table-column>
          <el-table-column
            prop="subjectRanks.historyExcellentRateRank"
            label="优秀率名次"
            width="100"
          >
          </el-table-column>
          <el-table-column
            prop="subjectAverages.historyTotalScore"
            label="总评得分"
            width="180"
          >
          </el-table-column>
          <el-table-column
            prop="subjectRanks.historyTotalRank"
            label="总评名次"
            width="100"
          >
          </el-table-column>
          <el-table-column prop="teacher.history" label="教师" width="100">
            <template slot-scope="scope">
              {{ getDisplayTeacher(scope.row, "history", "onlyTeacher") }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="地理" header-align="center">
          <el-table-column
            prop="subjectAverages.geography"
            label="平均分"
            width="180"
          >
          </el-table-column>
          <el-table-column
            prop="subjectRanks.geography"
            label="平均分名次"
            width="100"
          >
          </el-table-column>
          <el-table-column
            prop="subjectAverages.geographyInLineCount"
            label="进线人数"
          >
          </el-table-column>
          <el-table-column
            prop="subjectAverages.geographyInLineRate"
            label="进线率"
            width="180"
          >
          </el-table-column>
          <el-table-column
            prop="subjectRanks.geographyInLineRateRank"
            label="进线率名次"
            width="100"
          >
          </el-table-column>
          <el-table-column
            prop="subjectAverages.geographyExcellentCount"
            label="优秀人数"
          >
          </el-table-column>
          <el-table-column
            prop="subjectAverages.geographyExcellentRate"
            label="优秀率"
            width="180"
          >
          </el-table-column>
          <el-table-column
            prop="subjectRanks.geographyExcellentRateRank"
            label="优秀率名次"
            width="100"
          >
          </el-table-column>
          <el-table-column
            prop="subjectAverages.geographyTotalScore"
            label="总评得分"
            width="180"
          >
          </el-table-column>
          <el-table-column
            prop="subjectRanks.geographyTotalRank"
            label="总评名次"
            width="100"
          >
          </el-table-column>
          <el-table-column prop="teacher.geography" label="教师" width="100">
            <template slot-scope="scope">
              {{ getDisplayTeacher(scope.row, "geography", "onlyTeacher") }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="生物" header-align="center">
          <el-table-column
            prop="subjectAverages.biology"
            label="平均分"
            width="180"
          >
          </el-table-column>
          <el-table-column
            prop="subjectRanks.biology"
            label="平均分名次"
            width="100"
          >
          </el-table-column>
          <el-table-column
            prop="subjectAverages.biologyInLineCount"
            label="进线人数"
          >
          </el-table-column>
          <el-table-column
            prop="subjectAverages.biologyInLineRate"
            label="进线率"
            width="180"
          >
          </el-table-column>
          <el-table-column
            prop="subjectRanks.biologyInLineRateRank"
            label="进线率名次"
            width="100"
          >
          </el-table-column>
          <el-table-column
            prop="subjectAverages.biologyExcellentCount"
            label="优秀人数"
          >
          </el-table-column>
          <el-table-column
            prop="subjectAverages.biologyExcellentRate"
            label="优秀率"
            width="180"
          >
          </el-table-column>
          <el-table-column
            prop="subjectRanks.biologyExcellentRateRank"
            label="优秀率名次"
            width="100"
          >
          </el-table-column>
          <el-table-column
            prop="subjectAverages.biologyTotalScore"
            label="总评得分"
            width="180"
          >
          </el-table-column>
          <el-table-column
            prop="subjectRanks.biologyTotalRank"
            label="总评名次"
            width="100"
          >
          </el-table-column>
          <el-table-column prop="teacher.biology" label="教师" width="100">
            <template slot-scope="scope">
              {{ getDisplayTeacher(scope.row, "biology", "onlyTeacher") }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="物理" header-align="center">
          <el-table-column
            prop="subjectAverages.physics"
            label="平均分"
            width="180"
          >
          </el-table-column>
          <el-table-column
            prop="subjectRanks.physics"
            label="平均分名次"
            width="100"
          >
          </el-table-column>
          <el-table-column
            prop="subjectAverages.physicsInLineCount"
            label="进线人数"
          >
          </el-table-column>
          <el-table-column
            prop="subjectAverages.physicsInLineRate"
            label="进线率"
            width="180"
          >
          </el-table-column>
          <el-table-column
            prop="subjectRanks.physicsInLineRateRank"
            label="进线率名次"
            width="100"
          >
          </el-table-column>
          <el-table-column
            prop="subjectAverages.physicsExcellentCount"
            label="优秀人数"
          >
          </el-table-column>
          <el-table-column
            prop="subjectAverages.physicsExcellentRate"
            label="优秀率"
            width="180"
          >
          </el-table-column>
          <el-table-column
            prop="subjectRanks.physicsExcellentRateRank"
            label="优秀率名次"
            width="100"
          >
          </el-table-column>
          <el-table-column
            prop="subjectAverages.physicsTotalScore"
            label="总评得分"
            width="180"
          >
          </el-table-column>
          <el-table-column
            prop="subjectRanks.physicsTotalRank"
            label="总评名次"
            width="100"
          >
          </el-table-column>
          <el-table-column prop="teacher.physics" label="教师" width="100">
            <template slot-scope="scope">
              {{ getDisplayTeacher(scope.row, "physics", "onlyTeacher") }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="化学" header-align="center">
          <el-table-column
            prop="subjectAverages.chemistry"
            label="平均分"
            width="180"
          >
          </el-table-column>
          <el-table-column
            prop="subjectRanks.chemistry"
            label="平均分名次"
            width="100"
          >
          </el-table-column>
          <el-table-column
            prop="subjectAverages.chemistryInLineCount"
            label="进线人数"
          >
          </el-table-column>
          <el-table-column
            prop="subjectAverages.chemistryInLineRate"
            label="进线率"
            width="180"
          >
          </el-table-column>
          <el-table-column
            prop="subjectRanks.chemistryInLineRateRank"
            label="进线率名次"
            width="100"
          >
          </el-table-column>
          <el-table-column
            prop="subjectAverages.chemistryExcellentCount"
            label="优秀人数"
          >
          </el-table-column>
          <el-table-column
            prop="subjectAverages.chemistryExcellentRate"
            label="优秀率"
            width="180"
          >
          </el-table-column>
          <el-table-column
            prop="subjectRanks.chemistryExcellentRateRank"
            label="优秀率名次"
            width="100"
          >
          </el-table-column>
          <el-table-column
            prop="subjectAverages.chemistryTotalScore"
            label="总评得分"
            width="180"
          >
          </el-table-column>
          <el-table-column
            prop="subjectRanks.chemistryTotalRank"
            label="总评名次"
            width="100"
          >
          </el-table-column>
          <el-table-column prop="teacher.chemistry" label="教师" width="100">
            <template slot-scope="scope">
              {{ getDisplayTeacher(scope.row, "chemistry", "onlyTeacher") }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="总分" header-align="center">
          <el-table-column
            prop="subjectAverages.totalScore"
            label="平均分"
            width="180"
          >
          </el-table-column>
          <el-table-column
            prop="subjectRanks.totalScore"
            label="平均分名次"
            width="100"
          >
          </el-table-column>
          <el-table-column
            prop="subjectAverages.totalInLineCount"
            label="进线人数"
          >
          </el-table-column>
          <el-table-column
            prop="subjectAverages.totalInLineRate"
            label="进线率"
            width="180"
          >
          </el-table-column>
          <el-table-column
            prop="subjectRanks.totalInLineRateRank"
            label="进线率名次"
            width="100"
          >
          </el-table-column>
          <el-table-column
            prop="subjectAverages.totalExcellentCount"
            label="优秀人数"
          >
          </el-table-column>
          <el-table-column
            prop="subjectAverages.totalExcellentRate"
            label="优秀率"
            width="180"
          >
          </el-table-column>
          <el-table-column
            prop="subjectRanks.totalExcellentRateRank"
            label="优秀率名次"
            width="100"
          >
          </el-table-column>
          <el-table-column
            prop="subjectAverages.totalTotalScore"
            label="总评得分"
            width="180"
          >
          </el-table-column>
          <el-table-column
            prop="subjectRanks.totalTotalRank"
            label="总评名次"
            width="100"
          >
          </el-table-column>
          <el-table-column prop="classManager" label="班主任" width="100">
            <template slot-scope="scope">
              {{ getDisplayTeacher(scope.row, "", "") }}
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import uploadGradeDialog from "../../components/private/upload-grade-dialog.vue";
import gradeAnalyzeDialog from "../../components/private/grade-analyze-dialog.vue";
import teacherConfigDialog from "../../components/private/teacher-config-dialog.vue";

import { getGradeList, getTeacherList } from "@/api/api";

export default {
  data() {
    return {
      uploadDialog: false,
      analyzeDialog: false,
      configDialog: false,
      gradeList: [],
      listLoading: false,
      //analyzeGradeStatus为0是待上传，为1是待参评，为2是待查看
      analyzeGradeStatus: 0,
      dataTotal: 0,
      currentPage1: 1,
      pageSize: 12,
      analyzeGradeData: [],
      teacherListData: [],
    };
  },
  components: {
    uploadGradeDialog,
    gradeAnalyzeDialog,
    teacherConfigDialog,
  },
  created() {},
  computed: {
    handleBtnTittle() {
      if (this.analyzeGradeStatus == 0) {
        return "1. 点击上传成绩";
      } else if (this.analyzeGradeStatus == 1) {
        return "2. 点击分析成绩";
      } else if (this.analyzeGradeStatus == 2) {
        return "3. 下载分析结果";
      }
    },
    currentGradeList() {
      const start = (this.currentPage1 - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.gradeList.slice(start, end);
    },
  },
  watch: {},
  methods: {
    dialogShow() {
      if (this.analyzeGradeStatus === 0) {
        this.uploadDialog = true;
      } else if (this.analyzeGradeStatus === 1) {
        this.analyzeDialog = true;
      } else if (this.analyzeGradeStatus === 2) {
        // 下载结果
        
      }
    },
    init() {
      this.listLoading = true;
      getGradeList({
        current: this.currentPage,
        limit: this.pageSize,
      }).then((res) => {
        this.gradeList = res.data.data;
        this.dataTotal = this.gradeList.length;
        this.listLoading = false;
        if (this.dataTotal) {
          this.analyzeGradeStatus = 1;
        }
      });
    },
    getGradeData() {
      this.init();
    },
    handleCurrentChange(val) {
      console.log(val);
      this.currentPage1 = val;
    },
    analyzeGradeResult(val, val1) {
      this.analyzeGradeStatus = 2;
      this.analyzeGradeData = val;
      this.getTeacherData(val1);
    },
    getTeacherData(val1) {
      getTeacherList({ examGrade: val1.examGrade }).then((res) => {
        if (res.data && res.data.data) {
          this.teacherListData = res.data.data;
        }
        console.log(res.data.data);
      });
    },
   getDisplayTeacher(row, subject, onlyTeacher) {
  let teacherName = '';
  // 第三个参数代表目前是授课教师，并非班主任
  console.log(
    row.className,
    typeof row.className,
    subject,
  );
  console.log(this.teacherListData, "hdsahasihush");
  if (this.teacherListData.length) {
    this.teacherListData.map((val) => {
      console.log(val, "shihdaishdias");
      // 只包含3不包含2 只是教师
      if (onlyTeacher === "onlyTeacher") {
        if (
          val.teachClass && val.teachClass.length > 0 && val.teachClass[0].class &&
          val.teachClass[0].class.includes(Number(row.className)) &&
          val.teachSubject === subject
        ) {
          teacherName = val.userName;
        } 
      } else {
        if (val.manageClass && val.manageClass.length > 0 && val.manageClass[0].class &&
          val.manageClass[0].class.includes(Number(row.className))) {
          console.log(val.userName, "执行！！");
          teacherName = val.userName;
        }
      }
    });
  }

  return teacherName;
}
  },
};
</script>
<style lang="scss">
.el-table__header th {
  border: 2px solid #ebeef5; /* 设置边框宽度为 2px，颜色为 #333 */
  background-color: #b7cbfa;
}
.youxiaoyu {
  display: flex;
  width: 100%;
  justify-content: flex-end;
  margin-top: 15px;
}
.handle-btn {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>