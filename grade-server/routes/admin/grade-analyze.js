'use strict';

import express from 'express'
import AdminGradeAnalyze from '../../controller/admin/grade-analyaze.js'
const router = express.Router()

const multer = require("multer");
const upload = multer({ dest: "./uploads" });

router.post('/analyze/uploadManyClassGrade',upload.single('file'),AdminGradeAnalyze.uploadManyClass);
router.get('/analyze/getGradeList',AdminGradeAnalyze.getGradeList);
router.post('/analyze/postAnalyzeParams',AdminGradeAnalyze.postAnalyzeParams);


export default router
