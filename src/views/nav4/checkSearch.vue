<template>
    <div>
        <el-col :span="24" class="toolbar">
            <div class="block">
                <el-col :span="3.5">
                    <el-date-picker
                        v-model="startDate"
                        type="datetime"
                        placeholder="开始日期"
                        value-format="yyyy-MM-dd hh:mm:ss"
                    ></el-date-picker>
                </el-col>
                <el-col class="to" :span="1">至</el-col>
                <el-col :span="3.5">
                    <el-date-picker
                        v-model="endDate"
                        type="datetime"
                        placeholder="结束日期"
                        value-format="yyyy-MM-dd hh:mm:ss"
                    ></el-date-picker>
                </el-col>
            </div>
            <el-button type="primary" style="margin-left:15px;" @click="searchByTime(1)">查询</el-button>
        </el-col>
        <el-table
            :data="fee"
            style="width: 100%"
            highlight-current-row
            :header-cell-style="{color:'#444'}"
            :cell-style="toRed"
            @selection-change="selsChange"
        >
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column prop="signDate" label="考勤时间" align="center" width="150"></el-table-column>
            <el-table-column prop="shouldNumber" label="应到人数" align="center"></el-table-column>
            <el-table-column prop="actualNumber" label="实到人数" align="center"></el-table-column>
            <el-table-column prop="unabsentNumber" label="缺勤人数" align="center"></el-table-column>
            <el-table-column prop="remake" label="备注(未到人员姓名)" align="center"></el-table-column>
            <el-table-column prop="lastDate" label="创建时间" align="center" width="150"></el-table-column>
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

        <!-- 编辑弹窗 -->
        <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
                <el-form-item label="考勤日期" prop="signDate">
                    <el-date-picker
                        v-model="editForm.signDate"
                        type="datetime"
                        placeholder="选择日期时间"
                        value-format="yyyy-MM-dd HH:mm:ss"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="应到人数" prop="shouldNumber">
                    <el-input-number
                        :min="0"
                        v-model="editForm.shouldNumber"
                        @change="unabsentNumber"
                    ></el-input-number>
                </el-form-item>
                <el-form-item label="实到人数" prop="actualNumber">
                    <el-input-number
                        :max="editForm.shouldNumber"
                        :min="0"
                        v-model="editForm.actualNumber"
                        @change="unabsentNumber"
                    ></el-input-number>
                </el-form-item>
                <el-form-item label="缺勤人数" prop="unabsentNumber">
                    <el-input-number disabled v-model="editForm.unabsentNumber"></el-input-number>
                </el-form-item>
                <el-form-item label="备注信息" prop="remake">
                    <el-input type="textarea" rows="5" v-model="editForm.remake" resize="none"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

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
            startDate: "",
            endDate: "",
            upload: false,
            editFormVisible: false,
            editForm: {},
            oldForm: {},
            editFormRules: {
                signDate: [
                    { required: true, message: "请输入时间", trigger: "blur" }
                ]
            },
            editLoading: false,
            search: false
        };
    },
    watch: {},
    computed: {},
    methods: {
        searchByTime(page) {
            var get_all_signin = {
                startDate: this.startDate,
                endDate: this.endDate,
                page: page,
                size: 10
            };
            console.log(get_all_signin);
            this.axios
                .post(httpURL + "token/signin/get_all_signin", get_all_signin)
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
                    .post(httpURL + "token/signin/get_all_signin", {
                        page: val,
                        size: 10
                    })
                    .then(res => {
                        if (this.intercept(res.data)) {
                            this.fee = clearNull(res.data.data.data);
                        }
                    });
            } else {
                this.searchByTime(val);
            }
            this.currentPage = val;
        },
        //性别显示转换
        formatSex(row, column) {
            return row.sex == 1 ? "男" : row.sex == 0 ? "女" : "";
        },
        toRed({ row, column, rowIndex, columnIndex }) {
            if (row.unabsentNumber > 0) {
                if (columnIndex == 4 || columnIndex == 5) {
                    return "color:red";
                }
            }
            return "";
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
                            httpURL + "token/signin/delete_many_signin_by_id",
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
        //显示编辑界面
        handleEdit: function(index, row) {
            this.editFormVisible = true;
            this.editForm = Object.assign({}, row);
            this.oldForm = Object.assign({}, row);
        },
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
                                    httpURL + "token/signin/update_signin",
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
                                "token/signin/delete_signin_by_id/" +
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
                .post(httpURL + "token/signin/get_all_signin", {
                    page: 1,
                    size: 10
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
        unabsentNumber() {
            this.editForm.unabsentNumber =
                this.editForm.shouldNumber - this.editForm.actualNumber;
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
                .post(httpURL + "token/excel/import_signin", param, config)
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
            window.location.href = `${httpURL}token/excel/export_signin?token=${token}`;
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
.to {
    text-align: center;
    line-height: 40px;
}
</style>