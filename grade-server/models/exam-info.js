// exam-info.js
const mongoose = require('mongoose');

const examInfoSchema = new mongoose.Schema({
  examName: {
    type: String,
    required: true
  },
  // 可以添加其他考试相关信息，如考试时间等
  examDate: {
    type: Date,
    default: Date.now
  },
  numOfPeople: {
    type: Number,
  },
  // takePartinRate: {
  //   type: Number,
  // },
  inLineRate: {
    type: Number,
  },
  excellentRate: {
    type: Number,
  },
  examGrade: {
    type: Number,
  },
});

const ExamInfo = mongoose.model('ExamInfo', examInfoSchema);

module.exports = ExamInfo;