const multer = require("multer");
const upload = multer({ dest: "../uploads" });
const fs = require("fs");
const XLSX = require("xlsx");

import AdminGradeAnalyaze from "../../models/admin-grade-analyaze.js";
import ExamInfo from "../../models/exam-info.js";
import ClassGradeAnalysis from "../../models/class-grade-analysis.js"; // 假设你有这个模型来保存班级成绩分析结果
// 在方法顶部添加
import AdminInformation from "../../models/admin-information.js"; // 假设你的模型路径正确

class AdminGradeAnalyze {
  async uploadManyClass(req, res) {
    console.log(req.body);
    const { convertInto } = req.body;
    try {
      if (!req.file) {
        return res.status(400).send("上传文件失败");
      }

      const workbook = XLSX.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      let pointSeven = 1;
      let pointFive = 1;

      // 保存考试信息并获取 examId
      const examInfo = new ExamInfo({
        examName: req.body.examName,
        examGrade: req.body.examGrade,
      });
      const savedExamInfo = await examInfo.save();
      const examId = savedExamInfo._id;

      if (convertInto === "1") {
        pointSeven = 0.7;
        pointFive = 0.5;
      }

      const documents = data.map((item) => {
        // 辅助函数：将值转换为数字，如果不是有效数字则返回 0
        const toNumber = (value) => {
          const num = Number(value);
          return isNaN(num) ? 0 : num;
        };

        const score =
          toNumber(item["语文"]) +
          toNumber(item["数学"]) +
          toNumber(item["英语"]) +
          toNumber(item["道法"]) * pointFive +
          toNumber(item["历史"]) * pointFive +
          toNumber(item["地理"]) * pointFive +
          toNumber(item["生物"]) * pointFive +
          toNumber(item["物理"]) * pointSeven +
          toNumber(item["化学"]) * pointFive;

        return {
          examId: examId,
          examNumber: item["考号"], // 根据 Excel 列名调整
          studentName: item["姓名"], // 根据 Excel 列名调整
          class: item["班级"],
          score: score,
          chinese: toNumber(item["语文"]),
          math: toNumber(item["数学"]),
          english: toNumber(item["英语"]),
          political: toNumber(item["道法"]) * pointFive,
          history: toNumber(item["历史"]) * pointFive,
          geography: toNumber(item["地理"]) * pointFive,
          biology: toNumber(item["生物"]) * pointFive,
          physics: toNumber(item["物理"]) * pointSeven,
          chemistry: toNumber(item["化学"]) * pointFive,
        };
      });

      // 对 documents 数组按总分从高到低排序
      documents.sort((a, b) => b.score - a.score);

      // 为每个学生添加校次字段
      documents.forEach((document, index) => {
        document.schoolRank = index + 1;
      });

      // 按班级分组
      const classGroups = {};
      documents.forEach((document) => {
        const className = document.class;
        if (!classGroups[className]) {
          classGroups[className] = [];
        }
        classGroups[className].push(document);
      });

      // 为每个班级内的学生添加班次字段
      for (const className in classGroups) {
        const classStudents = classGroups[className];
        classStudents.sort((a, b) => b.score - a.score);
        classStudents.forEach((student, index) => {
          student.classRank = index + 1;
        });
      }

      const result = await AdminGradeAnalyaze.insertMany(documents);
      if (result) {
        res.send({
          status: 200,
          examId: examId,
        });
      }

      // 删除临时上传的文件
      fs.unlinkSync(req.file.path);
    } catch (error) {
      console.error("处理文件或保存数据时出错:", error);
      res.status(500).send("处理文件或保存数据时出错");
    }
  }

  async getGradeList(req, res) {
    try {
      const gradeList = await AdminGradeAnalyaze.find({});
      if (gradeList) {
        res.send({
          status: 200,
          data: gradeList,
        });
      }
    } catch (error) {}
  }

  async postAnalyzeParams(req, res) {
    try {
      const { takePartinNum, inLineRate, excellentRate, numOfPeople, examId } =
        req.body;

      // 更新 ExamInfo 数据表中的数据
      const updatedExamInfo = await ExamInfo.findByIdAndUpdate(
        examId,
        {
          takePartinNum: takePartinNum,
          inLineRate: inLineRate,
          excellentRate: excellentRate,
          numOfPeople: numOfPeople,
        },
        { new: true } // 返回更新后的文档
      );

      if (!updatedExamInfo) {
        return res.status(404).send({
          status: 404,
          message: "未找到对应的考试信息",
        });
      }

      // 获取该考试的所有成绩
      const grades = await AdminGradeAnalyaze.find({ examId: examId });

      // 按班级分组
      const classGroups = {};
      grades.forEach((grade) => {
        const className = grade.class;
        if (!classGroups[className]) {
          classGroups[className] = [];
        }
        classGroups[className].push(grade);
      });

      const classAnalysisResults = [];

      // 计算进线人数和优秀人数
      const inLineScores = {};
      const excellentScores = {};
      const subjects = [
        "chinese",
        "math",
        "english",
        "political",
        "history",
        "geography",
        "biology",
        "physics",
        "chemistry",
      ];
      subjects.forEach((subject) => {
        const sortedGrades = [...grades].sort(
          (a, b) => b[subject] - a[subject]
        );
        let inLineCount = Math.floor(numOfPeople * inLineRate * 0.01);
        let excellentCount = Math.floor(numOfPeople * excellentRate * 0.01);

        // 处理重分情况，确定实际进线分数线
        let inLineScore = sortedGrades[inLineCount - 1]
          ? sortedGrades[inLineCount - 1][subject]
          : 0;
        while (
          inLineCount < sortedGrades.length &&
          sortedGrades[inLineCount][subject] === inLineScore
        ) {
          inLineCount++;
        }
        inLineScores[subject] = inLineScore;

        // 处理重分情况，确定实际优秀分数线
        let excellentScore = sortedGrades[excellentCount - 1]
          ? sortedGrades[excellentCount - 1][subject]
          : 0;
        while (
          excellentCount < sortedGrades.length &&
          sortedGrades[excellentCount][subject] === excellentScore
        ) {
          excellentCount++;
        }
        excellentScores[subject] = excellentScore;
      });

      // 计算总分的进线分数线和优秀分数线
      const sortedTotalGrades = [...grades].sort((a, b) => b.score - a.score);
      let totalInLineCount = Math.floor(numOfPeople * inLineRate * 0.01);
      let totalExcellentCount = Math.floor(numOfPeople * excellentRate * 0.01);

      // 处理总分重分情况，确定实际总分进线分数线
      let totalInLineScore = sortedTotalGrades[totalInLineCount - 1]
        ? sortedTotalGrades[totalInLineCount - 1].score
        : 0;
      while (
        totalInLineCount < sortedTotalGrades.length &&
        sortedTotalGrades[totalInLineCount].score === totalInLineScore
      ) {
        totalInLineCount++;
      }

      // 处理总分重分情况，确定实际总分优秀分数线
      let totalExcellentScore = sortedTotalGrades[totalExcellentCount - 1]
        ? sortedTotalGrades[totalExcellentCount - 1].score
        : 0;
      while (
        totalExcellentCount < sortedTotalGrades.length &&
        sortedTotalGrades[totalExcellentCount].score === totalExcellentScore
      ) {
        totalExcellentCount++;
      }

      // 计算每个班级的分析结果
      for (const className in classGroups) {
        const classStudents = classGroups[className];
        const classSize = classStudents.length;
        const numOfParticipants = Math.min(takePartinNum, classSize); // 确保参评人数不超过班级总人数

        const subjectAverages = {};
        const subjectRanks = {};

        subjects.forEach((subject) => {
          // 按当前科目成绩排序并取前 n 名
          const sortedStudents = [...classStudents].sort(
            (a, b) => b[subject] - a[subject]
          );
          const topStudents = sortedStudents.slice(0, numOfParticipants);

          // 计算当前科目平均分
          const subjectScoreSum = topStudents.reduce(
            (sum, student) => sum + student[subject],
            0
          );
          subjectAverages[subject] = subjectScoreSum / numOfParticipants;

          // 计算进线人数和进线率
          const inLineStudentIds = classStudents
            .filter((student) => student[subject] >= inLineScores[subject])
            .map((student) => student._id);
          const inLineCount = inLineStudentIds.length;
          const inLineRateClass = classSize > 0 ? inLineCount / classSize : 0;
          subjectAverages[`${subject}InLineCount`] = inLineCount;
          subjectAverages[`${subject}InLineRate`] = inLineRateClass;

          // 计算优秀人数和优秀率
          const excellentStudentIds = classStudents
            .filter((student) => student[subject] >= excellentScores[subject])
            .map((student) => student._id);
          let excellentCount = excellentStudentIds.length;
          const excellentRateClass =
            classSize > 0 ? excellentCount / classSize : 0;
          subjectAverages[`${subject}ExcellentCount`] = excellentCount;
          subjectAverages[`${subject}ExcellentRate`] = excellentRateClass;
        });

        // 计算总分平均分
        const sortedStudents = [...classStudents].sort(
          (a, b) => b.score - a.score
        );
        const topStudents = sortedStudents.slice(0, numOfParticipants);
        const totalScoreSum = topStudents.reduce(
          (sum, student) => sum + student.score,
          0
        );
        subjectAverages.totalScore = totalScoreSum / numOfParticipants;

        // 计算总分的进线人数和进线率
        const totalInLineStudentIds = classStudents
          .filter((student) => student.score >= totalInLineScore)
          .map((student) => student._id);
        const totalInLineCount = totalInLineStudentIds.length;
        const totalInLineRate =
          classSize > 0 ? totalInLineCount / classSize : 0;
        subjectAverages.totalInLineCount = totalInLineCount;
        subjectAverages.totalInLineRate = totalInLineRate;

        // 计算总分的优秀人数和优秀率
        const totalExcellentStudentIds = classStudents
          .filter((student) => student.score >= totalExcellentScore)
          .map((student) => student._id);
        const totalExcellentCount = totalExcellentStudentIds.length;
        const totalExcellentRate =
          classSize > 0 ? totalExcellentCount / classSize : 0;
        subjectAverages.totalExcellentCount = totalExcellentCount;
        subjectAverages.totalExcellentRate = totalExcellentRate;

        classAnalysisResults.push({
          examId: examId,
          className: className,
          classSize: classSize,
          numOfParticipants: numOfParticipants,
          subjectAverages: subjectAverages,
          subjectRanks: subjectRanks,
        });
      }

      // 统一对各科平均分、进线率、优秀率进行排名
      subjects.forEach((subject) => {
        const sortedResultsByAverage = [...classAnalysisResults].sort(
          (a, b) => b.subjectAverages[subject] - a.subjectAverages[subject]
        );
        sortedResultsByAverage.forEach((result, index) => {
          result.subjectRanks[subject] = index + 1;
        });

        const sortedResultsByInLineRate = [...classAnalysisResults].sort(
          (a, b) =>
            b.subjectAverages[`${subject}InLineRate`] -
            a.subjectAverages[`${subject}InLineRate`]
        );
        sortedResultsByInLineRate.forEach((result, index) => {
          result.subjectRanks[`${subject}InLineRateRank`] = index + 1;
        });

        const sortedResultsByExcellentRate = [...classAnalysisResults].sort(
          (a, b) =>
            b.subjectAverages[`${subject}ExcellentRate`] -
            a.subjectAverages[`${subject}ExcellentRate`]
        );
        sortedResultsByExcellentRate.forEach((result, index) => {
          result.subjectRanks[`${subject}ExcellentRateRank`] = index + 1;
        });
      });

      // 对总分平均分进行排名
      const sortedResultsByTotalScore = [...classAnalysisResults].sort(
        (a, b) => b.subjectAverages.totalScore - a.subjectAverages.totalScore
      );
      sortedResultsByTotalScore.forEach((result, index) => {
        result.subjectRanks.totalScore = index + 1;
      });

      // 对总分进线率进行排名
      const sortedResultsByTotalInLineRate = [...classAnalysisResults].sort(
        (a, b) =>
          b.subjectAverages.totalInLineRate - a.subjectAverages.totalInLineRate
      );
      sortedResultsByTotalInLineRate.forEach((result, index) => {
        result.subjectRanks.totalInLineRateRank = index + 1;
      });

      // 对总分优秀率进行排名
      const sortedResultsByTotalExcellentRate = [...classAnalysisResults].sort(
        (a, b) =>
          b.subjectAverages.totalExcellentRate -
          a.subjectAverages.totalExcellentRate
      );
      sortedResultsByTotalExcellentRate.forEach((result, index) => {
        result.subjectRanks.totalExcellentRateRank = index + 1;
      });

      // 计算每学科总评得分和总评名次
      const numOfClasses = classAnalysisResults.length;
      subjects.forEach((subject) => {
        // 计算每班级该学科总评得分
        classAnalysisResults.forEach((result) => {
          const averageRankScore =
            numOfClasses + 1 - result.subjectRanks[subject];
          const inLineRateRankScore =
            numOfClasses + 1 - result.subjectRanks[`${subject}InLineRateRank`];
          const excellentRateRankScore =
            numOfClasses +
            1 -
            result.subjectRanks[`${subject}ExcellentRateRank`];
          result.subjectAverages[`${subject}TotalScore`] =
            averageRankScore * 0.6 +
            inLineRateRankScore * 0.2 +
            excellentRateRankScore * 0.2;
        });

        // 对该学科总评得分进行排序
        const sortedByTotalScore = [...classAnalysisResults].sort(
          (a, b) =>
            b.subjectAverages[`${subject}TotalScore`] -
            a.subjectAverages[`${subject}TotalScore`]
        );
        sortedByTotalScore.forEach((result, index) => {
          result.subjectRanks[`${subject}TotalRank`] = index + 1;
        });
      });

      // 计算总分总评得分和总评名次
      classAnalysisResults.forEach((result) => {
        const totalAverageRankScore =
          numOfClasses + 1 - result.subjectRanks.totalScore;
        const totalInLineRateRankScore =
          numOfClasses + 1 - result.subjectRanks.totalInLineRateRank;
        const totalExcellentRateRankScore =
          numOfClasses + 1 - result.subjectRanks.totalExcellentRateRank;
        result.subjectAverages.totalTotalScore =
          totalAverageRankScore * 0.6 +
          totalInLineRateRankScore * 0.2 +
          totalExcellentRateRankScore * 0.2;
      });

      const sortedByTotalTotalScore = [...classAnalysisResults].sort(
        (a, b) =>
          b.subjectAverages.totalTotalScore - a.subjectAverages.totalTotalScore
      );
      sortedByTotalTotalScore.forEach((result, index) => {
        result.subjectRanks.totalTotalRank = index + 1;
      });

      // 保存分析结果到数据库
      const analyzeGradeResult = await ClassGradeAnalysis.insertMany(
        classAnalysisResults
      );

      res.send({
        status: 200,
        message: "考试信息更新成功，成绩分析完成",
        data: updatedExamInfo,
        analyzeGradeResult: analyzeGradeResult,
      });
    } catch (error) {
      console.error("更新考试信息或进行成绩分析时出错:", error);
      res.status(500).send("更新考试信息或进行成绩分析时出错");
    }
  }

  async getTeacherList(req, res) {
    try {
      const { examGrade } = req.query; // 从查询字符串中获取年级信息

      if (!examGrade) {
        return res.status(400).send({
          status: 400,
          message: "请求中缺少年级信息",
        });
      }

      // 将 examGrade 转换为数值类型，假设数据库中的 grade 是数值类型
      const gradeToMatch = parseInt(examGrade);

      // 查询数据库中 teachClass 或 manageClass 包含指定年级的教师信息
      const teachers = await AdminInformation.find({
        $or: [
          { "teachClass.grade": gradeToMatch },
          { "manageClass.grade": gradeToMatch },
        ],
      }).select("-_id -password -account"); // 排除敏感字段

      res.send({
        status: 200,
        data: teachers,
      });
    } catch (error) {
      console.error("查询教师列表时出错:", error);
      res.status(500).send("查询教师列表时出错");
    }
  }
}

export default new AdminGradeAnalyze();
