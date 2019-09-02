<template>
    <div class="home">
        <el-form
            :model="loginForm"
            :rules="rules2"
            ref="ruleForm2"
            label-position="left"
            label-width="0px"
            class="demo-ruleForm login-container"
        >
            <h3 class="title">内部管理系统登录</h3>
            <el-form-item prop="username">
                <el-input
                    type="text"
                    v-model="loginForm.username"
                    auto-complete="off"
                    placeholder="账号"
                ></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input
                    type="password"
                    v-model="loginForm.password"
                    auto-complete="off"
                    placeholder="密码"
                    @keyup.enter.native="handleSubmit"
                ></el-input>
            </el-form-item>
            <!-- <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox> -->
            <el-form-item style="width:100%;">
                <el-button
                    type="primary"
                    style="width:100%;"
                    @click.native.prevent="handleSubmit"
                    :loading="logining"
                >登录</el-button>
                <!-- <el-button @click.native.prevent="handleReset2">重置</el-button> -->
            </el-form-item>
        </el-form>
        <footer class="copyright">
            <p>©逸典教育培训机构版权所有 | v1.0</p>
        </footer>
    </div>
</template>

<script>
import store from "@/store/index";
import httpURL from "@/assets/api";
import md5 from "js-md5";
import { setToken } from "@/utils/token";
export default {
    data() {
        return {
            logining: false,
            loginForm: {
                username: "",
                password: ""
            },
            ruleForm: {},
            rules2: {
                username: [
                    { required: true, message: "请输入账号", trigger: "blur" }
                    //{ validator: validaePass }
                ],
                password: [
                    { required: true, message: "请输入密码", trigger: "blur" }
                    //{ validator: validaePass2 }
                ]
            },
            checked: true
        };
    },
    store,
    watch: {},
    computed: {},
    methods: {
        handleSubmit() {
            this.$refs.ruleForm2.validate(valid => {
                if (valid) {
                    this.ruleForm.username = this.loginForm.username;
                    this.ruleForm.password = md5(this.loginForm.password);
                    this.axios
                        .post(httpURL + "user/check_user", this.ruleForm)
                        .then(res => {
                            if (this.intercept(res.data)) {
                                this.$message({
                                    message: "登陆成功",
                                    type: "success"
                                });
                                this.$store.commit("setIsLogin", true);
                                // 改变localStorage中isLogin的值，
                                window.localStorage.setItem("isLogin", true);
                                setToken(res.data.data, 1);
                                this.$router.push({ path: "/main" });
                            }
                        });
                }
            });
        }
    },
    created() {},
    mounted() {}
};
</script>
<style scoped>
.login-container {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #a5a4a4;
}
.title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #d0d0d0;
}
.remember {
    margin: 0px 0px 35px 0px;
}

.home {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url("../assets/login_bg.jpg") center center no-repeat;
}
.copyright {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 40px;
    background-color: rgba(255, 255, 255, 0.3);
    text-align: center;
}

.copyright p {
    position: relative;
    bottom: 5px;
    color: black;
    font-size: 16px;
}
</style>