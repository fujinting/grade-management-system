"use strict";

import mongoose from "mongoose";

const Schema = mongoose.Schema;

// 定义 teachClass 和 manageClass 子文档的 Schema
const classInfoSchema = new Schema({
    grade: {
        type: Number,
        required: true
    },
    class: {
        type: [Number],
        default: []
    }
});

const adminInformationSchema = new Schema({
    account: {
        type: String,
        required: true
    },
    password: {
        type: String,
        select: false,
        set(val) {
            return require("bcryptjs").hashSync(val, 10);
        }
    },
    require_password: {
        type: String,
        select: false,
        set(val) {
            return require("bcryptjs").hashSync(val, 10);
        }
    },
    role: {
        type: [Number],  // 根据集合数据，这里存储的是数字类型的数组
        default: []
    },
    userName: {
        type: String,
        required: true
    },
    teachClass: {
        type: [classInfoSchema],
        default: []
    },
    teachSubject: {
        type: String,
        required: true
    },
    manageClass: {
        type: [classInfoSchema],
        default: []
    }
});

adminInformationSchema.index({ id: 1 });

const AdminInformation = mongoose.model(
    "AdminInformation",
    adminInformationSchema
);

export default AdminInformation;