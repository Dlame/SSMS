<template>
    <div>
        <el-col :span="24" class="toolbar">
            <el-col :span="4">
                <el-input
                    placeholder="姓名"
                    class="nameInput"
                    v-model="name"
                    @keyup.enter.native="searchByName(1)"
                ></el-input>
            </el-col>
            <el-button type="primary" style="margin-left:15px;" @click="searchByName(1)">查询</el-button>
        </el-col>
        <el-table
            :data="fee"
            style="width: 100%"
            highlight-current-row
            :header-cell-style="{color:'#444'}"
            @selection-change="selsChange"
        >
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column prop="name" label="姓名" align="center" width="100"></el-table-column>
            <el-table-column prop="sex" label="性别" align="center" width="60" :formatter="formatSex"></el-table-column>
            <el-table-column prop="primaryContact" label="首要联系人姓名" align="center" width="120"></el-table-column>
            <el-table-column prop="phoneNumber" label="首要联系人电话" align="center" width="120"></el-table-column>
            <el-table-column prop="address" label="家庭详细地址" align="center"></el-table-column>
            <el-table-column prop="school" label="所在学校" align="center"></el-table-column>
            <el-table-column prop="hostedForm" label="托管形式" align="center"></el-table-column>
            <el-table-column prop="trainingSubject" label="培训科目" align="center"></el-table-column>
            <el-table-column prop="lastDate" label="创建时间" align="center"></el-table-column>
            <el-table-column label="操作" width="150" align="center">
                <template slot-scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button
                        type="danger"
                        size="small"
                        @click="handleDel(scope.$index, scope.row)"
                    >删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-col :span="24" class="toolbar">
            <el-button type="danger" :disabled="this.sels.length===0" @click="atchRemove">批量删除</el-button>
            <el-upload
                class="upload-demo"
                action="https://jsonplaceholder.typicode.com/posts/"
                :http-request="uploadSectionFile"
                :show-file-list="false"
                accept=".xls"
                style="display:inline-block;margin-left:10px;"
            >
                <el-button type="primary" :loading="upload">
                    点击上传&nbsp;
                    <i class="fa fa-cloud-upload fa-lg"></i>
                </el-button>
            </el-upload>
            <el-button type="success" style="margin-left:10px;" @click="download">
                点击下载&nbsp;
                <i class="fa fa-cloud-download fa-lg"></i>
            </el-button>
            <el-pagination
                background
                @current-change="handleCurrentChange"
                layout="total,prev, pager, next"
                :total="total"
                style="float:right;"
                :current-page.sync="currentPage"
            ></el-pagination>

            <!-- 编辑弹窗 -->
            <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
                <el-form
                    :model="editForm"
                    label-width="120px"
                    :rules="editFormRules"
                    ref="editForm"
                >
                    <el-form-item label="学员姓名" prop="name">
                        <el-input v-model="editForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="学员性别" prop="sex">
                        <el-radio v-model="editForm.sex" label="1">男</el-radio>
                        <el-radio v-model="editForm.sex" label="0">女</el-radio>
                    </el-form-item>
                    <el-form-item label="首要联系人姓名" prop="primaryContact">
                        <el-input v-model="editForm.primaryContact"></el-input>
                    </el-form-item>
                    <el-form-item label="首要联系人电话" prop="phoneNumber">
                        <el-input v-model="editForm.phoneNumber"></el-input>
                    </el-form-item>
                    <el-form-item label="家庭详细地址" prop="address">
                        <el-input v-model="editForm.address"></el-input>
                    </el-form-item>
                    <el-form-item label="所在学校" prop="school">
                        <el-input v-model="editForm.school"></el-input>
                    </el-form-item>
                    <el-form-item label="托管形式" prop="hostedForm">
                        <el-select v-model="editForm.hostedForm" placeholder="请选择">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="培训科目" prop="trainingSubject">
                        <el-select v-model="editForm.trainingSubject" placeholder="请选择">
                            <el-option
                                v-for="item in subjects"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="editFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
                </div>
            </el-dialog>
        </el-col>
        <!-- <Websocket></Websocket> -->
    </div>
</template>

<script>
import Websocket from "@/components/Websocket";
import httpURL from "@/assets/api";
import { getToken, clearNull } from "@/utils/token";
export default {
    components: {
        Websocket
    },
    data() {
        return {
            fee: [],
            sels: [], //列表选中列
            total: 10,
            currentPage: 1,
            name: "",
            upload: false,
            editFormVisible: false, //编辑界面是否显示
            editLoading: false,
            editForm: {},
            oldForm: {},
            editFormRules: {
                name: [
                    { required: true, message: "请输入姓名", trigger: "blur" }
                ]
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
            search: false
        };
    },
    watch: {},
    computed: {},
    methods: {
        searchByName(page) {
            var name = this.name.replace(/(^\s*)|(\s*$)/g, "");
            this.axios
                .get(httpURL + "token/student/get_all_student", {
                    params: {
                        name: name,
                        page: page,
                        size: 10
                    }
                })
                .then(res => {
                    if (this.intercept(res.data)) {
                        // console.log(res.data.totalPage);
                        this.fee = clearNull(res.data.data.data);
                        this.total = res.data.data.totalSize;
                        this.search = true;
                    }
                });
        },
        handleCurrentChange(val) {
            if (!this.search) {
                this.axios
                    .get(httpURL + "token/student/get_all_student", {
                        params: {
                            page: val,
                            size: 10
                        }
                    })
                    .then(res => {
                        if (this.intercept(res.data)) {
                            // console.log(res.data);
                            this.fee = clearNull(res.data.data.data);
                        }
                    });
            } else {
                this.searchByName(val);
            }

            this.currentPage = val;
        },
        //性别显示转换
        formatSex(row, column) {
            return row.sex == 1 ? "男" : row.sex == 0 ? "女" : "";
        },
        //显示编辑界面
        handleEdit: function(index, row) {
            this.editFormVisible = true;
            this.editForm = Object.assign({}, row);
            this.oldForm = Object.assign({}, row);
        },
        //更新信息
        editSubmit() {
            this.$refs.editForm.validate(valid => {
                if (valid) {
                    this.$confirm("确认提交吗？", "提示", {}).then(() => {
                        if (
                            JSON.stringify(this.oldForm) !=
                            JSON.stringify(this.editForm)
                        ) {
                            this.axios
                                .put(
                                    httpURL + "token/student/update_student",
                                    this.editForm
                                )
                                .then(res => {
                                    if (this.intercept(res.data)) {
                                        this.$message({
                                            message: "提交成功",
                                            type: "success"
                                        });
                                        this.getStudents();
                                    }
                                });
                        }
                        this.editFormVisible = false;
                    });
                }
            });
        },
        handleDel(index, row) {
            this.$confirm("确认删除该记录吗?", "提示", {
                type: "warning"
            })
                .then(() => {
                    this.axios
                        .delete(
                            httpURL +
                                "token/student/delete_student_by_id/" +
                                row.id
                        )
                        .then(res => {
                            if (this.intercept(res.data)) {
                                this.$message({
                                    message: "删除成功",
                                    type: "success"
                                });
                                this.getStudents();
                            }
                        });
                })
                .catch(() => {});
        },
        getStudents() {
            this.axios
                .get(httpURL + "token/student/get_all_student", {
                    params: {
                        page: 1,
                        size: 10
                    }
                })
                .then(res => {
                    if (this.intercept(res.data)) {
                        // console.log(res.data.totalPage);
                        this.fee = clearNull(res.data.data.data);
                        this.total = res.data.data.totalSize;
                        this.currentPage = 1;
                    }
                });
        },
        selsChange(sels) {
            this.sels = sels;
            // console.log(sels);
        },
        //批量删除
        atchRemove: function() {
            var ids = this.sels.map(item => item.id).toString();
            console.log(ids);
            this.$confirm("确认删除选中记录吗？", "提示", {
                type: "warning"
            })
                .then(() => {
                    this.listLoading = true;
                    this.axios
                        .delete(
                            httpURL + "token/student/delete_many_student_by_id",
                            {
                                params: {
                                    idStr: ids
                                }
                            }
                        )
                        .then(res => {
                            if (this.intercept(res.data)) {
                                this.$message({
                                    message: "提交成功",
                                    type: "success"
                                });
                                this.getStudents();
                            }
                        });
                })
                .catch(() => {});
        },
        uploadSectionFile(e) {
            let file = e.file;
            let param = new FormData(); //创建form对象
            param.append("file", file); //通过append向form对象添加数据
            // console.log(param.get("file")); //FormData私有类对象，访问不到，可以通过get判断值是否传进去
            let config = {
                headers: { "Content-Type": "multipart/form-data" }
            }; //添加请求头
            this.load = true;
            this.axios
                .post(httpURL + "token/excel/import_student", param, config)
                .then(res => {
                    if (this.intercept(res.data)) {
                        // console.log("success");
                        this.upload = false;
                        this.$message({
                            message: "上传成功",
                            type: "success"
                        });
                    } else {
                        this.upload = false;
                    }
                });
        },
        download() {
            let token = getToken();
            window.location.href = `${httpURL}token/excel/export_student?token=${token}`;
        }
    },
    created() {},
    mounted() {
        this.getStudents();
    }
};
</script>
<style scoped>
.nameInput {
    margin-right: 5px;
}
.btn {
    margin-left: 10px;
}
.toolbar {
    padding: 10px;
    background-color: #f2f2f2;
}
</style>