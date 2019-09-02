<template>
    <div class="main">
        <p class="title">逸典教育</p>
        <div class="desc">
            <p
                class="container"
            >逸典教育是一家以“立足孩子终生发展、塑造全脑特色儿童”为基本理念，配以全脑六力训练，素质拓展训练、智商情商逆商培养等手段，打造儿童综合素质的大型综合性连锁教育机构。</p>
            <p
                class="container"
            >逸典教育在教育教学组织过程中，融体验式教育、行为习惯养成教育、激励赏识教育等多元素超前教育为一体，用最科学的方法 将孩子引入终身发展的殿堂。</p>
            <p class="container">现设有学生全脑开发训练、学生素质拓展训练、托管、培训、幼教、课业辅导、学生注意力记忆力训练等多种特色课程。</p>
        </div>

        <!-- <Websocket></Websocket> -->
    </div>
</template>

<script>
import Websocket from "@/components/Websocket";
export default {
    components: {
        Websocket
    },
    data() {
        return {};
    },
    watch: {},
    computed: {},
    methods: {},
    created() {},
    mounted() {}
};
</script>
<style scoped>
.main {
    width: 98%;
    height: 90%;
    background: url("../assets/home__bg.png") center center no-repeat;
}
.title {
    display: block;
    font-size: 30px;
    width: 100%;
    margin: 10% auto 0;
    text-align: center;
    color: #966568;
}
.desc {
    position: absolute;
    margin-top: 13%;
    margin-left: 15%;
    width: 70%;
}
.container {
    text-indent: 2em;
    font-size: 20px;
    width: 100%;
    margin-top: 1%;
    color: #966568;
}
</style>