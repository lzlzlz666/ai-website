<template>
    <div class="settings-container">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>个人设置</span>
          </div>
        </template>
        
        <el-form
          ref="settingsForm"
          :model="formData"
          label-width="100px"
          class="settings-form"
        >
          <!-- 基本信息设置 -->
          <h3>基本信息</h3>
          <el-form-item label="用户名">
            <el-input v-model="formData.username" placeholder="请输入用户名" />
          </el-form-item>
          
          <el-form-item label="邮箱">
            <el-input v-model="formData.email" placeholder="请输入邮箱" disabled />
          </el-form-item>
          
          <el-form-item label="头像">
            <el-upload
              class="avatar-uploader"
              action="#"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="formData.avatar" :src="formData.avatar" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </el-form-item>
  
          <!-- 安全设置 -->
          <h3>安全设置</h3>
          <el-form-item label="修改密码">
            <el-button type="primary" @click="showChangePassword = true">
              修改密码
            </el-button>
          </el-form-item>
  
          <!-- API设置 -->
          <h3>API 设置</h3>
          <el-form-item label="API Key">
            <el-input v-model="formData.apiKey" type="password" show-password />
            <el-button 
              type="primary" 
              link 
              style="margin-left: 10px"
              @click="generateApiKey"
            >
              生成新的 API Key
            </el-button>
          </el-form-item>
  
          <!-- 界面设置 -->
          <h3>界面设置</h3>
          <el-form-item label="主题">
            <el-radio-group v-model="formData.theme">
              <el-radio label="light">浅色</el-radio>
              <el-radio label="dark">深色</el-radio>
              <el-radio label="system">跟随系统</el-radio>
            </el-radio-group>
          </el-form-item>
  
          <el-form-item label="语言">
            <el-select v-model="formData.language">
              <el-option label="简体中文" value="zh-CN" />
              <el-option label="English" value="en-US" />
            </el-select>
          </el-form-item>
  
          <!-- 保存按钮 -->
          <el-form-item>
            <el-button type="primary" @click="saveSettings" :loading="saving">
              保存设置
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
  
      <!-- 修改密码对话框 -->
      <el-dialog
        v-model="showChangePassword"
        title="修改密码"
        width="500px"
      >
        <el-form
          ref="passwordForm"
          :model="passwordData"
          :rules="passwordRules"
          label-width="100px"
        >
          <el-form-item label="当前密码" prop="currentPassword">
            <el-input 
              v-model="passwordData.currentPassword"
              type="password"
              show-password
            />
          </el-form-item>
          
          <el-form-item label="新密码" prop="newPassword">
            <el-input 
              v-model="passwordData.newPassword"
              type="password"
              show-password
            />
          </el-form-item>
          
          <el-form-item label="确认新密码" prop="confirmPassword">
            <el-input 
              v-model="passwordData.confirmPassword"
              type="password"
              show-password
            />
          </el-form-item>
        </el-form>
        
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="showChangePassword = false">取消</el-button>
            <el-button type="primary" @click="changePassword" :loading="changing">
              确认修改
            </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive } from 'vue'
  import { Plus } from '@element-plus/icons-vue'
  import { ElMessage } from 'element-plus'
  
  const formData = reactive({
    username: '用户名',
    email: 'user@example.com',
    avatar: '',
    apiKey: '****************************',
    theme: 'light',
    language: 'zh-CN'
  })
  
  const passwordData = reactive({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const showChangePassword = ref(false)
  const saving = ref(false)
  const changing = ref(false)
  
  const passwordRules = {
    currentPassword: [
      { required: true, message: '请输入当前密码', trigger: 'blur' }
    ],
    newPassword: [
      { required: true, message: '请输入新密码', trigger: 'blur' },
      { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
    ],
    confirmPassword: [
      { required: true, message: '请确认新密码', trigger: 'blur' },
      {
        validator: (rule, value, callback) => {
          if (value !== passwordData.newPassword) {
            callback(new Error('两次输入的密码不一致'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ]
  }
  
  const beforeAvatarUpload = (file) => {
    // 处理头像上传
    return false
  }
  
  const generateApiKey = () => {
    // 生成新的 API Key
    ElMessage.success('新的 API Key 已生成')
  }
  
  const saveSettings = async () => {
    saving.value = true
    try {
      // 保存设置逻辑
      await new Promise(resolve => setTimeout(resolve, 1000))
      ElMessage.success('设置已保存')
    } catch (error) {
      ElMessage.error('保存失败')
    } finally {
      saving.value = false
    }
  }
  
  const changePassword = async () => {
    changing.value = true
    try {
      // 修改密码逻辑
      await new Promise(resolve => setTimeout(resolve, 1000))
      showChangePassword.value = false
      ElMessage.success('密码修改成功')
      passwordData.currentPassword = ''
      passwordData.newPassword = ''
      passwordData.confirmPassword = ''
    } catch (error) {
      ElMessage.error('密码修改失败')
    } finally {
      changing.value = false
    }
  }
  </script>
  
  <style scoped>
  .settings-container {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .settings-form {
    margin-top: 20px;
  }
  
  h3 {
    margin: 30px 0 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
  }
  
  .avatar-uploader {
    text-align: center;
  }
  
  .avatar-uploader .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
  
  .avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 100px;
    height: 100px;
  }
  
  .avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
  }
  
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
  }
  </style>