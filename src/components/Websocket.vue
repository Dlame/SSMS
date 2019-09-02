<template>
    <div></div>
</template>

<script>
export default {
    data() {
        return {
            websock: null
        };
    },
    watch: {},
    computed: {},
    methods: {
        initWebSocket() {
            //初始化weosocket
            const wsuri = "ws://127.0.0.1:8080/websocket";
            // const wsuri = "ws://101.132.108.182:8080/websocket";
            this.websock = new WebSocket(wsuri);
            if (this.websock) {
                this.websock.onmessage = this.websocketonmessage;
                //   this.websock.onopen = this.websocketonopen;
                this.websock.onerror = this.websocketonerror;
                this.websock.onclose = this.websocketclose;
                console.log("服务已连接");
            }
        },
        websocketonopen() {
            //连接建立之后执行send方法发送数据
            let actions = { test: "12345" };
            this.websocketsend(JSON.stringify(actions));
        },
        websocketonerror() {
            //连接建立失败重连
            this.initWebSocket();
        },
        websocketonmessage(e) {
            //数据接收
            //const redata = JSON.parse(e.data);
            console.log("正在接收消息", e);
            this.$notify({
                title: "提示",
                message: e.data,
                type: "warning"
            });
        },
        websocketsend(Data) {
            //数据发送
            this.websock.send(Data);
        },
        websocketclose(e) {
            //关闭
            console.log("断开连接", e);
        }
    },
    created() {
        this.initWebSocket();
    },
    mounted() {},
    destroyed() {
        this.websock.close(); //离开路由之后断开websocket连接
    }
};
</script>
<style scoped>
</style>