<template>
  <div class="register">
    <el-form ref="form" :model="form" label-width="70px" label-position="right">
      <el-form-item class="input" label="账号">
        <el-input v-model="form.account"></el-input>
      </el-form-item>
      <el-form-item class="input" label="密 码">
        <el-input
          v-model="form.password"
          type="password"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item class="input" label="确认密码">
        <el-input
          v-model="form.require_password"
          type="password"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item label="角色">
        <el-select v-model="selectedRole" placeholder="请选择">
          <el-option
            v-for="item in roleOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="input" label="姓名">
        <el-input v-model="form.userName"></el-input>
      </el-form-item>
      <el-form-item label="教学班级">
        <el-cascader
          style="width: 380px"
          :props="props"
          v-model="form.teachClass"
          :options="teachOptions"
          size="medium"
          @change="handleChange"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="管理班级">
        <el-cascader
          style="width: 380px"
          :props="props"
          v-model="form.manageClass"
          :options="manageOptions"
          size="medium"
          @change="handleChange"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="教学科目">
        <el-select v-model="form.teachSubject" placeholder="请选择">
          <el-option
            v-for="item in subjectOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="btn">
        <el-button type="primary" @click="_register">注册账号</el-button>
        <el-button type="danger" @click="_clear">清空内容</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { adminRegister } from "@/api/api";
export default {
  data() {
    return {
      form: {
        role: [],
        account: "",
        password: "123456",
        require_password: "123456",
        userName: "",
        teachClass: [],
        teachSubject: "",
        manageClass: [],
      },
      selectedRole: null, // 新增一个变量用于存储选中的角色值
      props: { multiple: true },
      subjectOptions: [
        {
          value: "chinese",
          label: "语文",
        },
        {
          value: "math",
          label: "数学",
        },
        {
          value: "english",
          label: "英语",
        },
        {
          value: "political",
          label: "道法",
        },
        {
          value: "history",
          label: "历史",
        },
        {
          value: "geography",
          label: "地理",
        },
        {
          value: "biology",
          label: "生物",
        },
        {
          value: "physics",
          label: "物理",
        },
        {
          value: "chemistry",
          label: "化学",
        },
        {
          value: "sports",
          label: "体育",
        },
      ],
      roleOptions: [
        {
          value: 1,
          label: "管理员",
        },
        {
          value: 2,
          label: "班主任",
        },
        {
          value: 3,
          label: "教师",
        },
        {
          value: 4,
          label: "学生",
        },
      ],
      teachOptions: [
        {
          value: "7",
          label: "七年级",
          children: [
            {
              value: "1",
              label: "1班",
            },
            {
              value: "2",
              label: "2班",
            },
            {
              value: "3",
              label: "3班",
            },
            {
              value: "4",
              label: "4班",
            },
            {
              value: "5",
              label: "5班",
            },
            {
              value: "6",
              label: "6班",
            },
            {
              value: "7",
              label: "7班",
            },
            {
              value: "8",
              label: "8班",
            },
          ],
        },
        {
          value: "7",
          label: "八年级",
          children: [
            {
              value: "1",
              label: "1班",
            },
            {
              value: "2",
              label: "2班",
            },
            {
              value: "3",
              label: "3班",
            },
            {
              value: "4",
              label: "4班",
            },
            {
              value: "5",
              label: "5班",
            },
            {
              value: "6",
              label: "6班",
            },
            {
              value: "7",
              label: "7班",
            },
            {
              value: "8",
              label: "8班",
            },
          ],
        },
      ],
      manageOptions: [
        {
          value: "7",
          label: "七年级",
          children: [
            {
              value: "1",
              label: "1班",
            },
            {
              value: "2",
              label: "2班",
            },
            {
              value: "3",
              label: "3班",
            },
            {
              value: "4",
              label: "4班",
            },
            {
              value: "5",
              label: "5班",
            },
            {
              value: "6",
              label: "6班",
            },
            {
              value: "7",
              label: "7班",
            },
            {
              value: "8",
              label: "8班",
            },
          ],
        },
        {
          value: "7",
          label: "八年级",
          children: [
            {
              value: "1",
              label: "1班",
            },
            {
              value: "2",
              label: "2班",
            },
            {
              value: "3",
              label: "3班",
            },
            {
              value: "4",
              label: "4班",
            },
            {
              value: "5",
              label: "5班",
            },
            {
              value: "6",
              label: "6班",
            },
            {
              value: "7",
              label: "7班",
            },
            {
              value: "8",
              label: "8班",
            },
          ],
        },
      ],
    };
  },
  watch: {
    selectedRole(newValue) {
      switch (newValue) {
        case 1:
          this.form.role = [1];
          break;
        case 2:
          this.form.role = [2, 3];
          break;
        case 3:
          this.form.role = [3];
          break;
        case 4:
          this.form.role = [4];
          break;
        default:
          this.form.role = [];
      }
    },
  },
  methods: {
    _clear() {
      this.form.account = "";
      this.form.password = "";
      this.form.new_password = "";
      this.form.require_password = "";
      this.form.userName = "";
      this.form.teachClass = [];
      this.form.teachSubject = "";
      this.form.manageClass = [];
      this.selectedRole = null; // 清空选中的角色
      this.form.role = []; // 清空角色数组
    },
    _register() {
      if (this.form.password != this.form.require_password) {
        this.$message({
          message: "请保证 确认密码与密码 一致",
          type: "warning",
        });
      } else {
        // 处理 teachClass 和 manageClass
        const processedTeachClass = this.processClassData(this.form.teachClass);
        const processedManageClass = this.processClassData(this.form.manageClass);

        const newFormData = {
          ...this.form,
          teachClass: processedTeachClass,
          manageClass: processedManageClass
        };

        console.log(newFormData);
        adminRegister(newFormData).then((res) => {
          this.$message({
            message: res.data.message,
            type: "success",
          });
        });
      }
    },
    handleChange() {
      // 可以在这里添加级联选择器变化时的处理逻辑
    },
    processClassData(data) {
      const result = {};
      data.forEach(item => {
        const grade = parseInt(item[0]);
        const classNum = parseInt(item[1]);
        if (!result[grade]) {
          result[grade] = { grade, class: [] };
        }
        result[grade].class.push(classNum);
      });
      return Object.values(result);
    }
  },
};
</script>

<style lang="scss">
.register {
  display: flex;
  width: 100%;
  justify-content: center;

  .el-form {
    margin-top: 30px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .el-form-item {
      margin-top: 25px;
    }
    .input {
      width: 450px;
    }
    .btn {
      width: 95%;
      text-align: center;
    }
  }
}
</style>