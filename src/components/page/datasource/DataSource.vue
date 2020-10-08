<template>
    <div>
        <div class="unitmanage">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 数据源管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-add" class="handle-del mr10" @click="insertData">新增数据源</el-button>
                <el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="delAllSelection" >批量删除</el-button>
                <el-input v-model="query.selectName" clearable placeholder="数据源名称" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="getData">搜索</el-button>
            </div>
            <el-table :data="tableData" border class="table" stripe fixed ref="multipleTable" header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" align="center"></el-table-column>
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="driverType" label="类型"></el-table-column>
                <el-table-column prop="version" label="版本"></el-table-column>
                <el-table-column prop="creator" label="创建人"></el-table-column>
                <el-table-column prop="remarks" label="备注" show-overflow-tooltip></el-table-column>
                <el-table-column prop="createTime" label="创建时间"></el-table-column>
                <el-table-column prop="updateTime" label="修改时间"></el-table-column>
                <el-table-column label="操作" width="180" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="page">
                <el-pagination
                @size-change="handlePageSize" 
                @current-change="handlePageChange"
                :page-sizes="[10, 20, 30, 40]"
                :current-page="query.pageNum"
                :page-size="query.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pageTotal">
                </el-pagination>
            </div>
        </div>

        <!-- 新增/编辑弹出框 -->
        <el-dialog :title=popupWindow.title :visible.sync="popupWindow.editVisible" width="35%">
            <el-form ref="form" :model="popupWindow.form" :rules="rules" label-width="110px">
                <el-form-item label="数据库名称" prop="name">
                    <el-input v-model="popupWindow.form.name"></el-input>
                </el-form-item>
                <el-form-item label="数据库类型" prop="driverType">
                    <el-select v-model="popupWindow.form.driverType" placeholder="" class="handle-select mr10">
                        <el-option v-for="(item,index) in popupWindow.driverTypeList" :key="index" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="服务器地址" prop="ip">
                    <el-input v-model="popupWindow.form.ip"></el-input>
                </el-form-item>
                <el-form-item label="端口号" prop="port">
                    <el-input v-model="popupWindow.form.port"></el-input>
                </el-form-item>
                <el-form-item label="库名" prop="db">
                    <el-input v-model="popupWindow.form.db"></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="linkUser">
                    <el-input v-model="popupWindow.form.linkUser"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="popupWindow.form.password"></el-input>
                </el-form-item>
                <el-form-item label="字符集" prop="charset">
                    <el-select v-model="popupWindow.form.charset" placeholder="" class="handle-select mr10">
                        <el-option v-for="(item,index) in popupWindow.charsetList" :key="index" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注说明">
                    <el-input type="textarea" rows="5" v-model="popupWindow.form.remark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import dataSourceApi from '../../../api/datasource/index';
export default {
    name: 'unitmanage',
    data() {
        return {
            //默认页数
            pageTotal: 0,
            //页面初始化查询表格数据参数
            query: {
                pageNum: 1,
                pageSize: 10,
                selectName:"" 
            },
            //表格展示数据绑定
            tableData: [],
            //表格多选数据
            multipleSelection: [],
            //表格删除数据
            delList: [],
            //弹窗数据
            popupWindow:{
                //弹窗开关
                editVisible: false,    
                //操作类型，区分是新增还是修改,0新增，1，修改
                operationType : 0,
                //标题，当打开新增/修改弹窗显示
                title: "新增",
                //新增单位的对象
                form: {},
                driverTypeList:[{id:"mysql",name:"mysql"},{id:"oracle",name:"oracle"},{id:"mssql",name:"mssql"}],
                charsetList:[{id:"utf8",name:"utf-8"},{id:"gbk",name:"gbk"}]
            },
            //非空验证的规则
            rules: {
                name: [{ required: true, message: '请输入单位名称', trigger: 'blur' }],
                sName: [{ required: true, message: '请输入单位简称', trigger: 'blur' }],
            }
        };
    },
    created() {
        this.getData();
    },
    methods: {
        // 修改每页条数
        handlePageSize(value){
            this.query.pageSize = value
            this.getData()
        },
        // 分页导航
        handlePageChange(value) {
            this.query.pageNum = value
            this.getData();
        },
        // 加载表格数据
        getData() {
            dataSourceApi.fetchData(this.query).then(res => {
                this.tableData = res.data;
                this.pageTotal = res.total || 0;
            });
        },
        // 新增一个数据源
        insertData() {
            this.popupWindow.form = {};
            this.popupWindow.title = "新增";
            this.popupWindow.operationType = '0';
            this.popupWindow.editVisible = true;
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            }).then(() => {
                dataSourceApi.delDataSourceData(row.id).then(res => {
                    if(res.code == 200){
                        this.$message.success(res.message);
                        this.getData();
                    }
                });
            }).catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        delAllSelection() {
            if(this.multipleSelection.length > 0){
                dataSourceApi.delBeachDataSourceData(this.multipleSelection).then(res => {
                    if(res.code == 200){
                        this.$message.success(res.message);
                        this.getData();
                    }
                });
            }else{
                this.$message({
                    type: 'info',
                    message: `请选择要删除的数据`
                });
            }
        },
        // 编辑操作
        handleEdit(index, row) {
            this.popupWindow.form={
                id :    row.id,
                name:   row.name,
                remark: row.remark,
                creator:row.creator,
                createTime : row.createTime
            },
            this.popupWindow.title = "编辑";
            this.popupWindow.operationType = '1';
            this.popupWindow.editVisible = true;
        },
        // 保存编辑
        saveEdit() {
            const check = this.checkData();
            if(check){
                //判断是新增还是修改
                if(this.operationType == '0'){
                    //TODO 判断名称是否重复
                    unitApi.insertData(this.form).then(res=>{
                        if(res.code == 200){
                            this.editVisible = false;
                            this.$message.success(res.message);
                            this.getData();
                        }
                    });
                }else{
                    unitApi.updateUnit(this.form).then(res=>{
                        if(res.code == 200){
                            this.editVisible = false;
                            this.$message.success(res.message);
                            this.getData();
                        }
                    });
                }
            }
        },
        //非空校验
        checkData(){
            if(this.form.name == ''){
                 this.$message({
                    type: 'info',
                    message: `名称未填写 `
                });
                return false;
            }
            if(this.form.sName == ''){
                this.$message({
                    type: 'info',
                    message: `简称未填写`
                });
                return false;
            }
            return true;
        }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 100%;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
.page{
    margin-top: 10px;
}
</style>
