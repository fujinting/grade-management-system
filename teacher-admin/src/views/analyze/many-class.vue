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
        <el-step :title="analyzeGradeStatus <= 2 ? '待下载结果' : '已下载结果'"  icon="el-icon-download"></el-step>
      </el-steps>
      <div class="handle-btn">
        <el-button
          type="primary"
          style="margin-top: 30px"
          @click="dialogShow"
          v-if="analyzeGradeStatus!==3"
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
import * as XLSX from 'xlsx';
import { saveAs } from "file-saver";

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
        this.exportExcel();
        this.analyzeGradeStatus = 3
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
      let teacherName = "";
      // 第三个参数代表目前是授课教师，并非班主任
      console.log(row.className, typeof row.className, subject);
      console.log(this.teacherListData, "hdsahasihush");
      if (this.teacherListData.length) {
        this.teacherListData.map((val) => {
          console.log(val, "shihdaishdias");
          // 只包含3不包含2 只是教师
          if (onlyTeacher === "onlyTeacher") {
            if (
              val.teachClass &&
              val.teachClass.length > 0 &&
              val.teachClass[0].class &&
              val.teachClass[0].class.includes(Number(row.className)) &&
              val.teachSubject === subject
            ) {
              teacherName = val.userName;
            }
          } else {
            if (
              val.manageClass &&
              val.manageClass.length > 0 &&
              val.manageClass[0].class &&
              val.manageClass[0].class.includes(Number(row.className))
            ) {
              console.log(val.userName, "执行！！");
              teacherName = val.userName;
            }
          }
        });
      }

      return teacherName;
    },
    async exportExcel() {
      // 构建表头
      const headers = [
        [
          "班级",
          "考试人数",
          "参评人数",
          "语文",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "数学",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "英语",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "道法",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
           "历史",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
           "地理",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
           "生物",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
            "物理",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
            "化学",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          // 其他科目...
          "总分",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        ],
      ];

      // 二级表头
      const subHeaders = [
        [
          "班级",
          "考试人数",
          "参评人数",
          // 语文
          "平均分",
          "平均分名次",
          "进线人数",
          "进线率",
          "进线率名次",
          "优秀人数",
          "优秀率",
          "优秀率名次",
          "总评得分",
          "总评名次",
          "教师",
          // 数学
          "平均分",
          "平均分名次",
          "进线人数",
          "进线率",
          "进线率名次",
          "优秀人数",
          "优秀率",
          "优秀率名次",
          "总评得分",
          "总评名次",
          "教师",
           // 英语
          "平均分",
          "平均分名次",
          "进线人数",
          "进线率",
          "进线率名次",
          "优秀人数",
          "优秀率",
          "优秀率名次",
          "总评得分",
          "总评名次",
          "教师",
           // 道法
          "平均分",
          "平均分名次",
          "进线人数",
          "进线率",
          "进线率名次",
          "优秀人数",
          "优秀率",
          "优秀率名次",
          "总评得分",
          "总评名次",
          "教师",
           // 历史
          "平均分",
          "平均分名次",
          "进线人数",
          "进线率",
          "进线率名次",
          "优秀人数",
          "优秀率",
          "优秀率名次",
          "总评得分",
          "总评名次",
          "教师",
           // 地理
          "平均分",
          "平均分名次",
          "进线人数",
          "进线率",
          "进线率名次",
          "优秀人数",
          "优秀率",
          "优秀率名次",
          "总评得分",
          "总评名次",
          "教师",
           // 生物
          "平均分",
          "平均分名次",
          "进线人数",
          "进线率",
          "进线率名次",
          "优秀人数",
          "优秀率",
          "优秀率名次",
          "总评得分",
          "总评名次",
          "教师",
           // 物理
          "平均分",
          "平均分名次",
          "进线人数",
          "进线率",
          "进线率名次",
          "优秀人数",
          "优秀率",
          "优秀率名次",
          "总评得分",
          "总评名次",
          "教师",
           // 化学
          "平均分",
          "平均分名次",
          "进线人数",
          "进线率",
          "进线率名次",
          "优秀人数",
          "优秀率",
          "优秀率名次",
          "总评得分",
          "总评名次",
          "教师",
          // 其他科目...
          "平均分",
          "平均分名次",
          "进线人数",
          "进线率",
          "进线率名次",
          "优秀人数",
          "优秀率",
          "优秀率名次",
          "总评得分",
          "总评名次",
          "班主任",
        ],
      ];

      // 处理数据
      const data = this.analyzeGradeData.map((item) => {
        return [
          item.className,
          item.classSize,
          item.numOfParticipants,
          // 语文
          item.subjectAverages.chinese,
          item.subjectRanks.chinese,
          item.subjectAverages.chineseInLineCount,
          item.subjectAverages.chineseInLineRate,
          item.subjectRanks.chineseInLineRateRank,
          item.subjectAverages.chineseExcellentCount,
          item.subjectAverages.chineseExcellentRate,
          item.subjectRanks.chineseExcellentRateRank,
          item.subjectAverages.chineseTotalScore,
          item.subjectRanks.chineseTotalRank,
          this.getDisplayTeacher(item, "chinese", "onlyTeacher"),
          // 数学
          item.subjectAverages.math,
          item.subjectRanks.math,
          item.subjectAverages.mathInLineCount,
          item.subjectAverages.mathInLineRate,
          item.subjectRanks.mathInLineRateRank,
          item.subjectAverages.mathExcellentCount,
          item.subjectAverages.mathExcellentRate,
          item.subjectRanks.mathExcellentRateRank,
          item.subjectAverages.mathTotalScore,
          item.subjectRanks.mathTotalRank,
          this.getDisplayTeacher(item, "math", "onlyTeacher"),
          // 英语
          item.subjectAverages.english,
          item.subjectRanks.english,
          item.subjectAverages.englishInLineCount,
          item.subjectAverages.englishInLineRate,
          item.subjectRanks.englishInLineRateRank,
          item.subjectAverages.englishExcellentCount,
          item.subjectAverages.englishExcellentRate,
          item.subjectRanks.englishExcellentRateRank,
          item.subjectAverages.englishTotalScore,
          item.subjectRanks.englishTotalRank,
          this.getDisplayTeacher(item, "english", "onlyTeacher"),
           // 道法
          item.subjectAverages.political,
          item.subjectRanks.political,
          item.subjectAverages.politicalInLineCount,
          item.subjectAverages.politicalInLineRate,
          item.subjectRanks.politicalInLineRateRank,
          item.subjectAverages.politicalExcellentCount,
          item.subjectAverages.politicalExcellentRate,
          item.subjectRanks.politicalExcellentRateRank,
          item.subjectAverages.politicalTotalScore,
          item.subjectRanks.politicalTotalRank,
          this.getDisplayTeacher(item, "political", "onlyTeacher"),
           // 历史
          item.subjectAverages.history,
          item.subjectRanks.history,
          item.subjectAverages.historyInLineCount,
          item.subjectAverages.historyInLineRate,
          item.subjectRanks.historyInLineRateRank,
          item.subjectAverages.historyExcellentCount,
          item.subjectAverages.historyExcellentRate,
          item.subjectRanks.historyExcellentRateRank,
          item.subjectAverages.historyTotalScore,
          item.subjectRanks.historyTotalRank,
          this.getDisplayTeacher(item, "history", "onlyTeacher"),
           // 地理
          item.subjectAverages.geography,
          item.subjectRanks.geography,
          item.subjectAverages.geographyInLineCount,
          item.subjectAverages.geographyInLineRate,
          item.subjectRanks.geographyInLineRateRank,
          item.subjectAverages.geographyExcellentCount,
          item.subjectAverages.geographyExcellentRate,
          item.subjectRanks.geographyExcellentRateRank,
          item.subjectAverages.geographyTotalScore,
          item.subjectRanks.geographyTotalRank,
          this.getDisplayTeacher(item, "geography", "onlyTeacher"),
           // 生物
          item.subjectAverages.biology,
          item.subjectRanks.biology,
          item.subjectAverages.biologyInLineCount,
          item.subjectAverages.biologyInLineRate,
          item.subjectRanks.biologyInLineRateRank,
          item.subjectAverages.biologyExcellentCount,
          item.subjectAverages.biologyExcellentRate,
          item.subjectRanks.biologyExcellentRateRank,
          item.subjectAverages.biologyTotalScore,
          item.subjectRanks.biologyTotalRank,
          this.getDisplayTeacher(item, "biology", "onlyTeacher"),
           // 物理
          item.subjectAverages.physics,
          item.subjectRanks.physics,
          item.subjectAverages.physicsInLineCount,
          item.subjectAverages.physicsInLineRate,
          item.subjectRanks.physicsInLineRateRank,
          item.subjectAverages.physicsExcellentCount,
          item.subjectAverages.physicsExcellentRate,
          item.subjectRanks.physicsExcellentRateRank,
          item.subjectAverages.physicsTotalScore,
          item.subjectRanks.physicsTotalRank,
          this.getDisplayTeacher(item, "physics", "onlyTeacher"),
           // 化学
          item.subjectAverages.chemistry,
          item.subjectRanks.chemistry,
          item.subjectAverages.chemistryInLineCount,
          item.subjectAverages.chemistryInLineRate,
          item.subjectRanks.chemistryInLineRateRank,
          item.subjectAverages.chemistryExcellentCount,
          item.subjectAverages.chemistryExcellentRate,
          item.subjectRanks.chemistryExcellentRateRank,
          item.subjectAverages.chemistryTotalScore,
          item.subjectRanks.chemistryTotalRank,
          this.getDisplayTeacher(item, "chemistry", "onlyTeacher"),

          // ...其他字段
          // 总分
          item.subjectAverages.totalScore,
          item.subjectRanks.totalScore,
          item.subjectAverages.totalInLineCount,
          item.subjectAverages.totalInLineRate,
          item.subjectRanks.totalInLineRateRank,
          item.subjectAverages.totalExcellentCount,
          item.subjectAverages.totalExcellentRate,
          item.subjectRanks.totalExcellentRateRank,
          item.subjectAverages.totalTotalScore,
          item.subjectRanks.totalTotalRank,
          // ...其他总分字段
          this.getDisplayTeacher(item, "", ""),
        ];
      });

      // 合并表头
      const mergeData = [
        { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } }, // 班级
        { s: { r: 0, c: 1 }, e: { r: 1, c: 1 } }, // 考试人数
        { s: { r: 0, c: 2 }, e: { r: 1, c: 2 } }, // 参评人数
        // 语文合并
        { s: { r: 0, c: 3 }, e: { r: 0, c: 13 } },
        // 数学合并
        { s: { r: 0, c: 14 }, e: { r: 0, c: 24 } },
        // 英语合并
        { s: { r: 0, c: 25 }, e: { r: 0, c: 35 } },
        // 道法合并
        { s: { r: 0, c: 36 }, e: { r: 0, c: 46 } },
        // 历史合并
        { s: { r: 0, c: 47 }, e: { r: 0, c: 57 } },
        // 地理合并
        { s: { r: 0, c: 58 }, e: { r: 0, c: 68 } },
        // 生物合并
        { s: { r: 0, c: 69 }, e: { r: 0, c: 79 } },
        // 物理合并
        { s: { r: 0, c: 80 }, e: { r: 0, c: 90 } },
         // 化学合并
        { s: { r: 0, c: 91 }, e: { r: 0, c: 101 } },
          // 总分合并
        { s: { r: 0, c: 102 }, e: { r: 0, c: 112 } },
        
        // 其他科目合并...
      ];

      // 创建工作簿
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet([...headers, ...subHeaders, ...data]);

      // 设置合并
      ws["!merges"] = mergeData;

      // 设置列宽
      ws["!cols"] = [
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        // 语文列
        { wch: 10 },
        { wch: 13 },
        { wch: 13 },
        { wch: 13 },
        { wch: 13 },
        { wch: 13 },
        { wch: 13 },
        { wch: 13 },
        // 数学列
        { wch: 10 },
        { wch: 13 },
        { wch: 13 },
        { wch: 13 },
        { wch: 13 },
        { wch: 13 },
        { wch: 13 },
        { wch: 13 },
         // 英语列
        { wch: 10 },
        { wch: 13 },
        { wch: 13 },
        { wch: 13 },
        { wch: 13 },
        { wch: 13 },
        { wch: 13 },
        { wch: 13 },
         // 道法列
        { wch: 10 },
        { wch: 13 },
        { wch: 13 },
        { wch: 13 },
        { wch: 13 },
        { wch: 13 },
        { wch: 13 },
        { wch: 13 },
         // 历史列
        { wch: 10 },
        { wch: 13 },
        { wch: 13 },
        { wch: 13 },
        { wch: 13 },
        { wch: 13 },
        { wch: 13 },
        { wch: 13 },
         // 地理列
        { wch: 10 },
        { wch: 13 },
        { wch: 13 },
        { wch: 13 },
        { wch: 13 },
        { wch: 13 },
        { wch: 13 },
        { wch: 13 },
         // 生物列
        { wch: 10 },
        { wch: 13 },
        { wch: 13 },
        { wch: 13 },
        { wch: 13 },
        { wch: 13 },
        { wch: 13 },
        { wch: 13 },
         // 物理列
        { wch: 10 },
        { wch: 13 },
        { wch: 13 },
        { wch: 13 },
        { wch: 13 },
        { wch: 13 },
        { wch: 13 },
        { wch: 13 },
         // 化学列
        { wch: 10 },
        { wch: 13 },
        { wch: 13 },
        { wch: 13 },
        { wch: 13 },
        { wch: 13 },
        { wch: 13 },
        { wch: 13 },
          // 总分列
        { wch: 10 },
        { wch: 13 },
        { wch: 13 },
        { wch: 13 },
        { wch: 13 },
        { wch: 13 },
        { wch: 13 },
        { wch: 13 },
        // ...其他列宽
      ];

      // 添加到工作簿
      XLSX.utils.book_append_sheet(wb, ws, "成绩分析");

      // 生成文件
      const wbout = XLSX.write(wb, {
        bookType: "xlsx",
        type: "array",
        cellStyles: true,
      });

      // 保存文件
      saveAs(
        new Blob([wbout], { type: "application/octet-stream" }),
        `成绩分析_${new Date().toLocaleDateString()}.xlsx`
      );
    },
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