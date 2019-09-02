<template>
    <div>
        <el-form ref="form" :model="form" label-width="150px" class="form" :rules="rules">
            <el-form-item label="考勤日期" prop="signDate">
                <el-date-picker
                    v-model="form.signDate"
                    type="datetime"
                    placeholder="选择日期时间"
                    value-format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
            </el-form-item>
            <el-form-item label="应到人数" prop="shouldNumber">
                <el-input-number :min="0" v-model="form.shouldNumber" @change="unabsentNumber"></el-input-number>
            </el-form-item>
            <el-form-item label="实到人数" prop="actualNumber">
                <el-input-number
                    :max="form.shouldNumber"
                    :min="0"
                    v-model="form.actualNumber"
                    @change="unabsentNumber"
                ></el-input-number>
            </el-form-item>
            <el-form-item label="缺勤人数" prop="unabsentNumber">
                <el-input-number disabled v-model="form.unabsentNumber"></el-input-number>
            </el-form-item>
            <el-form-item label="备注信息" prop="remake">
                <el-input type="textarea" rows="5" v-model="form.remake" resize="none"></el-input>
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
                signDate: "",
                shouldNumber: 0,
                actualNumber: 0,
                unabsentNumber: 0,
                remake: ""
            },
            rules: {
                signDate: [
                    { required: true, message: "请选择时间", trigger: "change" }
                ],
                shouldNumber: [
                    { required: true, message: "请输入人数", trigger: "blur" }
                ],
                actualNumber: [
                    { required: true, message: "请输入人数", trigger: "blur" }
                ]
            }
        };
    },
    watch: {},
    computed: {},
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    // console.log(this.form);
                    this.axios
                        .post(httpURL + "token/signin/save_signin", this.form)
                        .then(res => {
                            if (this.intercept(res.data)) {
                                this.$message({
                                    message: "保存成功！",
                                    type: "success"
                                });
                                this.$refs[formName].resetFields();
                            }
                        });
                } else {
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        unabsentNumber() {
            this.form.unabsentNumber =
                this.form.shouldNumber - this.form.actualNumber;
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
.line {
    text-align: center;
}
</style>