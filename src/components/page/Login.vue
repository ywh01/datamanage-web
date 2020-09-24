<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">数据治理系统</div>
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="param.username" placeholder="username">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        placeholder="password"
                        v-model="param.password"
                        @keyup.enter.native="submitForm()">
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                </div>
                <el-button type="text" @click="registForm()">注册账号>></el-button>

                <!-- 编辑弹出框 -->
                <el-dialog title="注册账号" :visible.sync="editVisible" width="30%">
                    <el-form ref="param" :model="registParam" label-width="70px">
                        <el-form-item label="账号">
                            <el-input v-model="registParam.id"></el-input>
                        </el-form-item>
                         <el-form-item label="名称">
                            <el-input v-model="registParam.name"></el-input>
                        </el-form-item>
                        <el-form-item label="密码">
                            <el-input v-model="registParam.password"></el-input>
                        </el-form-item>
                        <el-form-item label="确认密码">
                            <el-input v-model="registParam.confirmPassword"></el-input>
                        </el-form-item>
                        <el-form-item label="上级单位">
                            <el-select v-model="registParam.unitID" placeholder="请选择" class="handle-select mr10">
                                <el-option v-for="(item,index) in unitList" :key="index" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="备注说明">
                            <el-input type="textarea" rows="5" v-model="registParam.remark"></el-input>
                        </el-form-item>
                    </el-form>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="editVisible = false">取 消</el-button>
                        <el-button type="primary" @click="saveEdit">确 定</el-button>
                    </span>
                </el-dialog>
            </el-form>
        </div>
    </div>
</template>

<script>
import request from '../../utils/request';
import localItem from '../../utils/localstorage';
import md5 from 'js-md5';
import unitApi from '../../api/unit/index';

export default {
    data: function() {
        return {
            param: {
                username: '',
                password: ''
            },
            registParam: {
                id:'',
                name: '',
                password: '',
                confirmPassword:'',
                unitID:'',
                remark:''
            },
            unitList:[],
            editVisible:false,
            rules: {
                username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
            },
        };
    },
    methods: {
        //登录方法
        submitForm() {
            this.$refs.login.validate(valid => {
                if (valid) {
                    request({
                        url: './loginIn',
                        method: 'post',
                        params: {
                            id : this.param.username,
                            pwd: md5(this.param.password)
                        }
                    }).then(res => {
                        console.log(res)
                        if (res.code === 200) {
                            this.$message.success('登录成功');
                            // 存储用户信息 
                            localItem.saveUser(res);
                            this.$router.push('/');
                        } else {
                            this.$message.error(res.message);                           
                        }
                    }).catch(err => {
                        console.log(err);
                    });
                } else {
                    this.$message.error('请输入账号和密码');
                    return false;
                }
            });
        },
        //打开注册页面方法
        registForm(){
            this.param={};
            this.editVisible = true;
            unitApi.fetchAllData().then(res => {
                this.unitList = res.data;
            });
        },
        //保存注册编辑
        saveEdit() {
            if(this.registParam.password == this.registParam.confirmPassword){
                request({
                    url: './register',
                    method: 'post',
                    data: {
                        id : this.registParam.id,
                        name : this.registParam.name,
                        pwd: md5(this.registParam.password),
                        remark : this.registParam.remark,
                        unitID : this.registParam.unitID
                    }
                }).then(res => {
                    console.log(res)
                    if (res.code === 200) {
                        this.$message.success(res.message);
                        this.editVisible = false;
                    } else {
                        this.$message.error(res.message);                           
                    }
                }).catch(err => {
                    console.log(err);
                });
            }else{
                this.$message({
                    type: 'info',
                    message: `两次密码不相同，请重新输入!`
                });
                return;
            }
        }
    }
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/img/login-bg.jpg);
    background-size: 100%;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
.handle-select {
    width: 100%;
}
</style>