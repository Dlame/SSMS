<template>
    <div>
        <el-form ref="form" :model="form" label-width="150px" class="form" :rules="rules">
            <el-form-item label="学员姓名" prop="name">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="学员性别" prop="sex">
                <el-radio v-model="form.sex" label="1">男</el-radio>
                <el-radio v-model="form.sex" label="0">女</el-radio>
            </el-form-item>
            <el-form-item label="所在学校" prop="school">
                <el-input v-model="form.school"></el-input>
            </el-form-item>
            <el-form-item label="托管形式" prop="hostedForm">
                <el-select v-model="form.hostedForm" placeholder="请选择">
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="培训科目" prop="trainingSubject">
                <el-select v-model="form.trainingSubject" placeholder="请选择">
                    <el-option
                        v-for="item in subjects"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="备注" prop="gradeString">
                <el-input type="textarea" :rows="5" resize="none" v-model="form.gradeString"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('form')">提交</el-button>
                <el-button @click="resetForm('form')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import httpURL from "@/assets/api";
export default {
    data() {
        return {
            form: {
                name: "",
                sex: "",
                school: "",
                gradeString: "",
                hostedForm: "",
                trainingSubject: ""
            },
            options: [
                {
                    value: "午托",
                    label: "午托"
                },
                {
                    value: "全日托",
                    label: "全日托"
                },
                {
                    value: "周末托",
                    label: "周末托"
                },
                {
                    value: "暑期托",
                    label: "暑期托"
                },
                {
                    value: "寒假托",
                    label: "寒假托"
                }
            ],
            subjects: [
                {
                    value: "美术",
                    label: "美术"
                },
                {
                    value: "作文",
                    label: "作文"
                },
                {
                    value: "英语",
                    label: "英语"
                },
                {
                    value: "初中一对一",
                    label: "初中一对一"
                }
            ],
            rules: {
                name: [
                    { required: true, message: "请输入姓名", trigger: "blur" }
                ],
                sex: [
                    { required: true, message: "请选择性别", trigger: "change" }
                ],
                hostedForm: [
                    {
                        required: true,
                        message: "请选择托管形式",
                        trigger: "change"
                    }
                ],
                trainingSubject: [
                    { required: true, message: "请选择科目", trigger: "change" }
                ],
                gradeString: [
                    {
                        required: true,
                        message: "请输入成绩信息",
                        trigger: "blur"
                    }
                ],
                school: []
            }
        };
    },
    watch: {},
    computed: {},
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.axios
                        .post(httpURL + "token/grade/save_grade", this.form)
                        .then(res => {
                            // console.log(res.data.code);
                            if (this.intercept(res.data)) {
                                this.$message({
                                    message: "保存成功！",
                                    type: "success"
                                });
                            }
                            this.$refs[formName].resetFields();
                        });
                } else {
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
    },
    created() {},
    mounted() {}
};
</script>
<style scoped>
.form {
    margin-left: 5%;
    width: 35%;
}
</style>