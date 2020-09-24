<template>
    <div>
        <div class="unitmanage">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 单位管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-add" class="handle-del mr10" @click="insertData">新增单位</el-button>
                <el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="delAllSelection" >批量删除</el-button>
                <el-input v-model="query.selectName" clearable placeholder="单位名称/简称" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="getData">搜索</el-button>
            </div>
            <el-table :data="tableData" border class="table" stripe fixed ref="multipleTable" header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" align="center"></el-table-column>
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="sName" label="简称"></el-table-column>
                <el-table-column prop="pName" label="上级单位"></el-table-column>
                <el-table-column prop="remark" label="备注" show-overflow-tooltip></el-table-column>
                <el-table-column prop="createTime" label="创建时间"></el-table-column>
                <el-table-column prop="updateTime" label="修改你时间"></el-table-column>
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
        <el-dialog :title=title :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="单位名称" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="单位简称" prop="sName">
                    <el-input v-model="form.sName"></el-input>
                </el-form-item>
                <el-form-item label="上级单位">
                    <el-select v-model="form.pName" placeholder="无上级单位" class="handle-select mr10">
                        <el-option v-for="(item,index) in pUnitList" :key="index" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注说明">
                    <el-input type="textarea" rows="5" v-model="form.remark"></el-input>
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
import unitApi from '../../../api/unit/index';
export default {
    name: 'unitmanage',
    data() {
        return {
            //查询表格数据参数
            query: {
                pageNum: 1,
                pageSize: 10,
                selectName:"" 
            },
            //表格数据
            tableData: [],
            //多选数据
            multipleSelection: [],
            //删除数据
            delList: [],
            //弹窗开关
            editVisible: false,
            //父级单位
            pUnitList : [],
            //新增单位的对象
            form: {
                name:"",
                sName:"",
                pid:"",
                pName:"",
                remark:""
            },
            //操作类型，区分是新增还是修改,0新增，1，修改
            operationType : 0,
            //标题，当打开新增/修改弹窗显示
            title: "",
            //非空验证的规则
            rules: {
                name: [{ required: true, message: '请输入单位名称', trigger: 'blur' }],
                sName: [{ required: true, message: '请输入单位简称', trigger: 'blur' }],
            },
            pageTotal: 0
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
            unitApi.fetchData(this.query).then(res => {
                this.tableData = res.data;
                this.pageTotal = res.total || 0;
            });
        },
        // 新增一个数据源
        insertData() {
            this.form = {name:"",sName:"",pid:"",pName:"",remark:""};
            unitApi.fetchAllData().then(res => {
                this.pUnitList = res.data;
            });
            this.title = "新增";
            this.operationType = '0';
            this.editVisible = true;
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    unitApi.delUnitData(row.id).then(res => {
                        if(res.code == 200){
                            this.$message.success(res.message);
                            this.getData();
                        }
                    });
                })
                .catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        delAllSelection() {
            if(this.multipleSelection.length > 0){
                unitApi.delBeachUnitData(this.multipleSelection).then(res => {
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
            this.form={
                id :    row.id,
                name:   row.name,
                sName:  row.sName,
                pid :   row.pid,
                pName:  row.pName,
                remark: row.remark,
                creator:row.creator,
                createTime : row.createTime
            },
            unitApi.fetchAllData().then(res => {
                this.pUnitList = res.data;
            });
            this.title = "编辑";
            this.operationType = '1';
            this.editVisible = true;
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
