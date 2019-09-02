<template>
    <div class="home">
        <div class="container">
            <p class="page-container">404 not found</p>
            <el-button class="back" @click="goLogin">回到登录页</el-button>
        </div>

        <footer class="copyright">
            <p>©逸典教育培训机构版权所有 | v1.0</p>
        </footer>
    </div>
</template>

<script>
export default {
    data() {
        return {};
    },
    methods: {
        goLogin() {
            this.$router.push("/login");
        }
    }
};
</script>

<style scoped>
.container {
    margin-top: 20%;
}
.page-container {
    font-size: 40px;
    text-align: center;
    color: rgb(255, 255, 255);
}
.back {
    color: #fff;
    width: 10%;
    margin-left: 45%;
    background-color: rgba(0, 0, 0, 0.2);
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