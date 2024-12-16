<script setup>
import { User, Lock, Key } from '@element-plus/icons-vue'
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

const isRegister = ref(false)
const registerData = ref({
  username: '',
  password: '',
  rePassword: '',
  verCode: ''
})
const loginData = ref({
  username: '',
  password: ''
})

const key = ref('');  // 初始化 key
const captchaUrl = ref('');  // 初始化 captchaUrl

// 在组件挂载时初始化
onMounted(() => {
  console.log(import.meta.env.VITE_APP_API_BASE_URL);  // 打印环境变量

  refreshCaptcha(); // 初始化时刷新验证码
});

// 刷新验证码的函数
const refreshCaptcha = () => {
  key.value = Math.random().toString(36).substr(2, 9); // 重新生成随机 key
  
  // captchaUrl.value = 'http://localhost:8091/captcha?key=' + key.value; // 更新验证码 URL
  captchaUrl.value = `${import.meta.env.VITE_APP_API_BASE_URL}/captcha?key=${key.value}`;
  console.log(captchaUrl.value)

  registerData.value.verCode = ''; // 清空验证码输入框
}

// 校验密码的函数
const checkRePassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value != registerData.value.password) {
    callback(new Error('请确保两次输入的密码一致'))
  } else {
    callback()
  }
}

// 定义表单校验规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 5, max: 16, message: '长度为5-16位非空字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 5, max: 16, message: '长度为5-16位非空字符', trigger: 'blur' }
  ],
  rePassword: [
    { validator: checkRePassword, trigger: 'blur' }
  ]
}

import { userRegisterService, userLoginService } from '@/api/user.js'

const register = async () => {
  if (registerData.value.username === '' || registerData.value.password === '') {
    ElMessage({
      message: '用户名或密码不能为空',
      type: 'warning',
    })
    return;
  }
  if (registerData.value.password !== registerData.value.rePassword) {
    ElMessage({
      message: '务必保证两次输入的密码一致',
      type: 'warning',
    })
    return;
  }

  // 调用注册服务
  let result = await userRegisterService(registerData.value, key.value);
  if (result.code === 0) {
    ElMessage({
      message: result.message ? result.message : '注册成功',
      type: 'success',
    })
    clearRegisterData();  // 注册成功后清空数据
  } else {
    // 注册失败时刷新验证码
    ElMessage({
      message: result.message ? result.message : '注册失败',
      type: 'error',
    })
  }
  refreshCaptcha();
}

import { useRouter } from 'vue-router'

const router = useRouter()

const login = async () => {
  // 登录逻辑
  let result = await userLoginService(loginData.value);
  console.log(loginData.value)
  console.log(result)
  if (result.code === 0) {
    ElMessage({
      message: '登录成功！',
      type: 'success',
    })
    // 模拟登录成功
    localStorage.setItem('token', 'dummy-token')
    router.push('/')
  } else {
    ElMessage({
      message: result.message ? result.message : '登录失败',
      type: 'error',
    })
  }
}

const clearRegisterData = () => {
  registerData.value = {
    username: '',
    password: '',
    rePassword: '',
    verCode: ''
  }
}

</script>


<template>
    <el-row class="login-page">
        <el-col :span="12" class="bg"></el-col>
        <el-col :span="6" :offset="3" class="form">
            <!-- 注册表单 -->
            <el-form ref="form" size="large" autocomplete="off" :model="registerData" :rules="rules" v-if="isRegister" >
                <el-form-item>
                    <h1>注册</h1>
                </el-form-item>
                <el-form-item prop="username">
                    <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="registerData.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input :prefix-icon="Lock" type="password" placeholder="请输入密码" v-model="registerData.password"></el-input>
                </el-form-item>
                <el-form-item prop="rePassword">
                    <el-input :prefix-icon="Lock" type="password" placeholder="请输入再次密码" v-model="registerData.rePassword"></el-input>
                </el-form-item>
                <el-form-item prop="identifying-code">
                    <el-input :prefix-icon="Key" placeholder="输入验证码" v-model="registerData.verCode"
                      style="width: 46%; margin-right: 30px"
                      ></el-input>
                    <img :src="captchaUrl" @click="refreshCaptcha()" width="140px" height="33px" />
                </el-form-item>
                <!-- 注册按钮 -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space @click="register">
                        注册
                    </el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link type="info" :underline="false" @click="isRegister = false; clearRegisterData()">
                        ← 返回
                    </el-link>
                </el-form-item>
            </el-form>
            <!-- 登录表单 -->
            <el-form ref="form" size="large" autocomplete="off" :model="loginData" :rules="rules" v-else>
                <el-form-item>
                    <h1>登录</h1>
                </el-form-item>
                <el-form-item prop="username">
                    <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="loginData.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input name="password" :prefix-icon="Lock" type="password" placeholder="请输入密码" v-model="loginData.password"></el-input>
                </el-form-item>
                <el-form-item class="flex">
                    <div class="flex">
                        <el-checkbox>记住我</el-checkbox>
                        <el-link type="primary" :underline="false">忘记密码？</el-link>
                    </div>
                </el-form-item>
                <!-- 登录按钮 -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space @click="login">登录</el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link type="info" :underline="false" @click="isRegister = true; clearRegisterData()">
                        注册 →
                    </el-link>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<style lang="scss" scoped>
/* 样式 */
.login-page {
    height: 100vh;
    background-color: #fff;

    .bg {
        background: url('@/assets/logo4.png') no-repeat 60% center / 440px auto,
            url('@/assets/login_bg.jpg') no-repeat center / cover;
        border-radius: 0 20px 20px 0;
    }

    .form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        user-select: none;

        .title {
            margin: 0 auto;
        }

        .button {
            width: 100%;
        }

        .flex {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }
    }
}
</style>