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
                <el-dialog title="注册账号" :visible.sync="editVisible" width="33%">
                    <el-form ref="param" :model="registParam" :rules="registRules" label-width="90px">
                        <el-form-item label="账号" prop="id">
                            <el-input v-model="registParam.id"></el-input>
                        </el-form-item>
                         <el-form-item label="昵称" prop="name">
                            <el-input v-model="registParam.name" maxlength="8"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input type="password" v-model="registParam.password"></el-input>
                        </el-form-item>
                        <el-form-item label="确认密码" prop="confirmPassword">
                            <el-input type="password" v-model="registParam.confirmPassword"></el-input>
                        </el-form-item>
                        <el-form-item label="真实姓名" prop="userName">
                            <el-input v-model="registParam.userName" maxlength="8"></el-input>
                        </el-form-item>
                        <el-form-item label="职务" prop="position">
                            <el-input v-model="registParam.position"></el-input>
                        </el-form-item>
                        <el-form-item label="电话" prop="phone">
                            <el-input v-model="registParam.phone"></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="registParam.email"></el-input>
                        </el-form-item>
                        <el-form-item label="通讯地址" prop="address">
                            <el-input v-model="registParam.address"></el-input>
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
import time from '../../utils/time'
import md5 from 'js-md5';

export default {
    data: function() {
        return {
            param: {
                username: '',
                password: ''
            },
            registParam: {},
            editVisible:false,
            rules: {
                username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
            },
            registRules:{
                id:         [{ required: true, message: '请输入账号', trigger: 'blur' },
                            {validator: function(rule, value, callback) {
                                if (
                                    /^[a-z0-9]{8,}$/i.test(
                                    value
                                    ) == false
                                ) {
                                    callback(new Error("最少输入8位字符"));
                                } else {
                                    callback();
                                }
                                },
                                trigger: "blur"
                            }],
                name:       [{ required: true, message: '请输入昵称', trigger: 'blur' }],
                password:   [{ required: true, message: '请输入密码', trigger: 'blur' }],
                confirmPassword: [{ required: true, message: '请输入密码', trigger: 'blur' }],
                userName:   [{ required: true, message: '请输入真实姓名', trigger: 'blur' }],
                position:   [{ required: true, message: '请输入职务', trigger: 'blur' }],
                phone:      [{ required: true, message: '请输入电话', trigger: 'blur' },
                                {validator: function(rule, value, callback) {
                                    if (/^1[34578]\d{9}$/.test(value) == false) {
                                        callback(new Error("手机号格式错误"));
                                    } else {
                                        callback();
                                    }
                                },
                                trigger: "blur"
                            }],
                email:      [{ required: true, message: '请输入邮箱', trigger: 'blur' },
                                {validator: function(rule, value, callback) {
                                    if (
                                        /^\w{1,64}@[a-z0-9\-]{1,256}(\.[a-z]{2,6}){1,2}$/i.test(
                                        value
                                        ) == false
                                    ) {
                                        callback(new Error("邮箱格式错误"));
                                    } else {
                                        callback();
                                    }
                                    },
                                    trigger: "blur"
                                }],
                address:    [{ required: true, message: '请输入地址', trigger: 'blur' }]
            }
            
        };
    },
    methods: {
        //登录方法
        submitForm() {
            this.$refs.login.validate(valid => {
                if (valid) {
                    request({
                        url: './user/loginIn',
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
            this.registParam={};
            this.editVisible = true;
        },
        //保存注册编辑
        saveEdit() {
            if(this.registParam.password == this.registParam.confirmPassword){
                this.registParam.pwd = md5(this.registParam.password);
                this.registParam.userType = 'common';
                this.registParam.roleType = 'business';
                this.registParam.status = '2';
                this.registParam.roleGroup = '';
                // this.registParam.createTime = time.getNowTime();
                // this.registParam.updateTime = time.getNowTime();
                this.registParam.createTime = new Date();
                this.registParam.updateTime = new Date();

                delete this.registParam.password;
                delete this.registParam.confirmPassword;
                request({
                    url: './user/register',
                    method: 'post',
                    data: this.registParam
                }).then(res => {
                    console.log(res)
                    if (res.code === 200) {
                        this.$message.success(res.message);
                    } else {
                        this.$message.error(res.message);                           
                    }
                    this.editVisible = false;
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