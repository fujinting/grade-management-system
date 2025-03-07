"use strict";

import mongoose from "mongoose";

const Schema = mongoose.Schema;

const adminGradeAnalyazeSchema = new Schema({
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExamInfo',
    required: true
  },
  examNumber: String,
  studentName: String, 
  class: String,
  score: Number,
  chinese: Number,
  math: Number,
  english: Number,
  political: Number,
  history: Number,
  geography: Number,
  biology: Number,
  physics: Number,
  chemistry: Number,
  schoolRank: Number,
  classRank: Number
});

adminGradeAnalyazeSchema.index({ id: 1 });

const AdminGradeAnalyaze = mongoose.model(
  "AdminGradeAnalyaze",
  adminGradeAnalyazeSchema
);

export default AdminGradeAnalyaze;
