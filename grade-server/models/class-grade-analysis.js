const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const classGradeAnalysisSchema = new Schema({
    examId: {
        type: Schema.Types.ObjectId,
        ref: 'ExamInfo',
        required: true
    },
    className: {
        type: String,
        required: true
    },
    classSize: {
        type: Number,
        required: true
    },
    numOfParticipants: {
        type: Number,
        required: true
    },
    subjectAverages: {
        chinese: { type: Number },
        math: { type: Number },
        english: { type: Number },
        political: { type: Number },
        history: { type: Number },
        geography: { type: Number },
        biology: { type: Number },
        physics: { type: Number },
        chemistry: { type: Number },
        totalScore: { type: Number }, // 总分平均分
        chineseInLineCount: { type: Number }, // 语文进线人数
        chineseInLineRate: { type: Number },  // 语文进线率
        chineseExcellentCount: { type: Number }, // 语文优秀人数
        chineseExcellentRate: { type: Number },  // 语文优秀率
        mathInLineCount: { type: Number },
        mathInLineRate: { type: Number },
        mathExcellentCount: { type: Number },
        mathExcellentRate: { type: Number },
        englishInLineCount: { type: Number },
        englishInLineRate: { type: Number },
        englishExcellentCount: { type: Number },
        englishExcellentRate: { type: Number },
        politicalInLineCount: { type: Number },
        politicalInLineRate: { type: Number },
        politicalExcellentCount: { type: Number },
        politicalExcellentRate: { type: Number },
        historyInLineCount: { type: Number },
        historyInLineRate: { type: Number },
        historyExcellentCount: { type: Number },
        historyExcellentRate: { type: Number },
        geographyInLineCount: { type: Number },
        geographyInLineRate: { type: Number },
        geographyExcellentCount: { type: Number },
        geographyExcellentRate: { type: Number },
        biologyInLineCount: { type: Number },
        biologyInLineRate: { type: Number },
        biologyExcellentCount: { type: Number },
        biologyExcellentRate: { type: Number },
        physicsInLineCount: { type: Number },
        physicsInLineRate: { type: Number },
        physicsExcellentCount: { type: Number },
        physicsExcellentRate: { type: Number },
        chemistryInLineCount: { type: Number },
        chemistryInLineRate: { type: Number },
        chemistryExcellentCount: { type: Number },
        chemistryExcellentRate: { type: Number },
        totalInLineCount: { type: Number }, // 总分进线人数
        totalInLineRate: { type: Number },  // 总分进线率
        totalExcellentCount: { type: Number }, // 总分优秀人数
        totalExcellentRate: { type: Number },  // 总分优秀率
        // 新增每个学科的总评得分字段
        chineseTotalScore: { type: Number },
        mathTotalScore: { type: Number },
        englishTotalScore: { type: Number },
        politicalTotalScore: { type: Number },
        historyTotalScore: { type: Number },
        geographyTotalScore: { type: Number },
        biologyTotalScore: { type: Number },
        physicsTotalScore: { type: Number },
        chemistryTotalScore: { type: Number },
        // 新增总分的总评得分字段
        totalTotalScore: { type: Number }
    },
    subjectRanks: {
        chinese: { type: Number },
        math: { type: Number },
        english: { type: Number },
        political: { type: Number },
        history: { type: Number },
        geography: { type: Number },
        biology: { type: Number },
        physics: { type: Number },
        chemistry: { type: Number },
        totalScore: { type: Number }, // 总分平均分排名
        chineseInLineRateRank: { type: Number }, // 语文进线率排名
        chineseExcellentRateRank: { type: Number }, // 语文优秀率排名
        mathInLineRateRank: { type: Number },
        mathExcellentRateRank: { type: Number },
        englishInLineRateRank: { type: Number },
        englishExcellentRateRank: { type: Number },
        politicalInLineRateRank: { type: Number },
        politicalExcellentRateRank: { type: Number },
        historyInLineRateRank: { type: Number },
        historyExcellentRateRank: { type: Number },
        geographyInLineRateRank: { type: Number },
        geographyExcellentRateRank: { type: Number },
        biologyInLineRateRank: { type: Number },
        biologyExcellentRateRank: { type: Number },
        physicsInLineRateRank: { type: Number },
        physicsExcellentRateRank: { type: Number },
        chemistryInLineRateRank: { type: Number },
        chemistryExcellentRateRank: { type: Number },
        totalInLineRateRank: { type: Number }, // 总分进线率排名
        totalExcellentRateRank: { type: Number }, // 总分优秀率排名
        // 新增每个学科的总评名次字段
        chineseTotalRank: { type: Number },
        mathTotalRank: { type: Number },
        englishTotalRank: { type: Number },
        politicalTotalRank: { type: Number },
        historyTotalRank: { type: Number },
        geographyTotalRank: { type: Number },
        biologyTotalRank: { type: Number },
        physicsTotalRank: { type: Number },
        chemistryTotalRank: { type: Number },
        // 新增总分的总评名次字段
        totalTotalRank: { type: Number }
    },
    classManager: String, // 班主任姓名
    teachers: Schema.Types.Mixed // 各科教师姓名，结构如 { chinese: '张三', math: '李四' }
});

const ClassGradeAnalysis = mongoose.model('ClassGradeAnalysis', classGradeAnalysisSchema);

module.exports = ClassGradeAnalysis;