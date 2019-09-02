<template>
    <div>
        <el-row class="container">
            <el-col :span="24" class="header">
                <el-col
                    :span="10"
                    class="logo"
                    :class="isCollapse?'logo-collapse-width':'logo-width'"
                >
                    <img src="@/assets/logo.jpg" />
                    {{isCollapse?'':sysName}}
                </el-col>
                <el-col :span="10">
                    <div class="tools" @click.prevent="collapse">
                        <i class="fa fa-align-justify"></i>
                    </div>
                </el-col>
                <el-col :span="4" class="userinfo">
                    <el-dropdown trigger="hover">
                        <span class="el-dropdown-link userinfo-inner">
                            <img src="../assets/manager.png" />
                            {{sysUserName}}
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>我的消息</el-dropdown-item>
                            <el-dropdown-item>设置</el-dropdown-item>
                            <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-col>
            </el-col>

            <aside :class="isCollapse?'menu-collapsed':'menu-expanded'">
                <!--导航菜单-->
                <el-menu
                    default-active="/"
                    class="el-menu-vertical-demo"
                    @open="handleopen"
                    @close="handleclose"
                    :collapse="isCollapse"
                    router
                    :collapse-transition="false"
                >
                    <el-menu-item index="/main" style="background: #286acb;">
                        <i class="fa fa-th-large fa-lg"></i>
                        <span slot="title">首页</span>
                    </el-menu-item>
                    <template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
                        <el-submenu :index="index+''" v-if="!item.leaf">
                            <template slot="title">
                                <i :class="item.iconCls"></i>
                                <span slot="title">{{item.name}}</span>
                            </template>
                            <el-menu-item
                                v-for="child in item.children"
                                :index="child.path"
                                :key="child.path"
                                v-if="!child.hidden"
                            >
                                <i :class="child.iconCls"></i>
                                <span slot="title">{{child.name}}</span>
                            </el-menu-item>
                        </el-submenu>
                    </template>
                </el-menu>
            </aside>
            <section :class="isCollapse?'content-collapse':'content-container'">
                <div class="grid-content bg-purple-light">
                    <el-col :span="24" class="breadcrumb-container">
                        <strong class="title">{{$route.name}}</strong>
                        <el-breadcrumb separator="/" class="breadcrumb-inner">
                            <el-breadcrumb-item
                                v-for="item in $route.matched"
                                :key="item.path"
                            >{{ item.name }}</el-breadcrumb-item>
                        </el-breadcrumb>
                    </el-col>
                    <el-col :span="24" class="content-wrapper">
                        <transition name="fade" mode="out-in">
                            <router-view></router-view>
                        </transition>
                    </el-col>
                </div>
            </section>
        </el-row>
        <Websocket></Websocket>
    </div>
</template>

<script>
import store from "@/store/index";
import Websocket from "@/components/Websocket";
export default {
    components: {
        Websocket
    },
    data() {
        return {
            sysName: "逸典教育",
            isCollapse: false,
            collapsed: false,
            sysUserName: "管理员",
            sysUserAvatar: "/src/assets/manager.png",
            form: {
                name: "",
                region: "",
                date1: "",
                date2: "",
                delivery: false,
                type: [],
                resource: "",
                desc: ""
            }
        };
    },
    store,
    watch: {},
    computed: {},
    methods: {
        onSubmit() {
            // console.log("submit!");
        },
        handleopen() {
            //console.log('handleopen');
        },
        handleclose() {
            //console.log('handleclose');
        },
        handleselect: function(a, b) {},
        logout: function() {
            var _this = this;
            this.$confirm("确认退出吗?", "提示", {
                type: "warning"
            })
                .then(() => {
                    this.$store.commit("setIsLogin", false);
                    // 改变localStorage中isLogin的值，
                    window.localStorage.setItem("isLogin", false);
                    _this.$router.push("/login");
                })
                .catch(() => {});
        },
        //折叠导航栏
        collapse: function() {
            this.isCollapse = !this.isCollapse;
        },
        showMenu(i, status) {
            this.$refs.menuCollapsed.getElementsByClassName(
                "submenu-hook-" + i
            )[0].style.display = status ? "block" : "none";
        }
    },
    created() {},
    mounted() {
        var user = sessionStorage.getItem("user");
        if (user) {
            user = JSON.parse(user);
            this.sysUserName = user.name || "";
            this.sysUserAvatar = user.avatar || "";
        }
    }
};
</script>
<style scoped lang="less">
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 230px;
    min-height: 400px;
}
.el-menu-vertical-demo {
    margin-top: 60px;
}
.el-submenu {
    background: #286acb !important;
}
.el-submenu__title {
    color: #fff;
}
.container {
    position: absolute;
    top: 0px;
    bottom: 0px;
    width: 100%;
    .header {
        height: 60px;
        line-height: 60px;
        background: #286acb;
        color: #fff;
        .userinfo {
            text-align: right;
            padding-right: 35px;
            float: right;
            .userinfo-inner {
                cursor: pointer;
                color: #fff;
                img {
                    width: 40px;
                    height: 40px;
                    border-radius: 20px;
                    margin: 10px 0px 10px 10px;
                    float: right;
                }
            }
        }
        .logo {
            //width:230px;
            height: 60px;
            font-size: 22px;
            padding-left: 20px;
            padding-right: 20px;
            border-color: rgba(238, 241, 146, 0.3);
            border-right-width: 1px;
            border-right-style: solid;
            img {
                width: 40px;
                float: left;
                border-radius: 50%;
                position: relative;
                top: 10px;
                right: 8px;
            }
            .txt {
                color: #fff;
            }
        }
        .logo-width {
            width: 230px;
        }
        .logo-collapse-width {
            width: 65px;
            transform: border-color 0.3s, background-color 0.3s, color 0.3s,
                width 0.3s;
        }
        .tools {
            padding: 0px 23px;
            width: 14px;
            height: 60px;
            line-height: 60px;
            cursor: pointer;
        }
    }
    .main {
        display: flex;
        // background: #324057;
        position: absolute;
        top: 60px;
        bottom: 0px;
        overflow: hidden;
        aside {
            margin-top: 60px;
            flex: 0 0 230px;
            width: 230px;
            display: inline-block;
            // position: absolute;
            // top: 0px;
            // bottom: 0px;
            .el-menu {
                height: 100%;
            }
            .collapsed {
                width: 60px;
                .item {
                    position: relative;
                }
                .submenu {
                    position: absolute;
                    top: 0px;
                    left: 60px;
                    z-index: 99999;
                    height: auto;
                    display: none;
                }
            }
        }
        .menu-collapsed {
            flex: 0 0 60px;
            width: 60px;
        }
        .menu-expanded {
            flex: 0 0 230px;
            width: 230px;
        }
    }
    .content-container {
        // background: #f1f2f7;
        flex: 1;
        position: absolute;
        right: 0px;
        top: 60px;
        bottom: 0px;
        left: 230px;
        overflow-y: scroll;
        padding: 20px;
        .breadcrumb-container {
            //margin-bottom: 15px;
            .title {
                width: 200px;
                float: left;
                color: #475669;
            }
            .breadcrumb-inner {
                float: right;
            }
        }
        .content-wrapper {
            background-color: #fff;
            box-sizing: border-box;
        }
    }

    .content-collapse {
        flex: 1;
        position: absolute;
        right: 0px;
        top: 60px;
        bottom: 0px;
        left: 60px;
        overflow-y: scroll;
        padding: 20px;
        transform: width 0.3s;
        .breadcrumb-container {
            //margin-bottom: 15px;
            .title {
                width: 200px;
                float: left;
                color: #475669;
            }
            .breadcrumb-inner {
                float: right;
            }
        }
        .content-wrapper {
            background-color: #fff;
            box-sizing: border-box;
        }
    }

    .fa {
        margin-right: 5px;
        // color: white;
    }
}
</style>