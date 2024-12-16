<template>
  <el-container class="layout-container">
    <!-- 侧边栏 -->
    <el-aside width="260px" class="aside">
      <div class="logo">
        <img src="@/assets/gpt.jpg" alt="Logo" />
        <span>LZ制造的最强AI</span>
      </div>

      <el-menu
        class="side-menu"
        :default-active="activeMenu"
        background-color="#202123"
        text-color="#ffffff"
      >
        <el-menu-item index="chat" @click="$router.push('/')">
          <el-icon><ChatLineRound /></el-icon>
          <span>新对话</span>
        </el-menu-item>
        <el-menu-item index="history" @click="$router.push({ name: 'history'})">
          <el-icon><Collection /></el-icon>
          <span>历史记录</span>
        </el-menu-item>
        <el-menu-item index="comment" @click="$router.push({ name: 'comments'})">
          <el-icon><Pointer /></el-icon>
          <span>留言板</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 主要内容区 -->
    <el-container>
      <el-header height="64px" class="header">
        <div class="header-left">
          <h2>{{ currentTitle }}</h2>
        </div>
        <div class="header-right">
          <el-dropdown>
            <el-avatar :size="40" :src="userImg" alt="用户头像" />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="goToSettings">个人设置</el-dropdown-item>
                <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ChatLineRound, Collection } from '@element-plus/icons-vue'


// 当前高亮的菜单项
const activeMenu = ref('chat')
const currentTitle = ref('轻享AI 网页端')
const userImg = ref('')

// 获取路由实例
const router = useRouter()
const route = useRoute()
onMounted(() => {
  // 这里模拟从后端接口获取用户头像 URL，实际情况应通过 API 请求获取
  setTimeout(() => {
    // 假设接口返回了用户头像的 URL
    userImg.value = 'https://big-event-lz.oss-cn-hangzhou.aliyuncs.com/f2212eb3-158a-4cb9-82c9-07b8fa5a4587.jpg'
  }, 1000)
})

// 路由变化时，更新 activeMenu
watch(
  () => route.name,
  (newRouteName) => {
    if (newRouteName === 'settings') {
      activeMenu.value = 'settings'
    } else if (newRouteName === 'history') {
      activeMenu.value = 'history'
    } else {
      activeMenu.value = 'chat'
    }
  },
  { immediate: true } // 初始化时立即执行一次
)

// 登出操作
const logout = () => {
  localStorage.removeItem('token') // 清除 token
  window.sessionStorage.clear()

  router.push({ name: 'login' }) // 跳转到登录页
}

// 跳转到设置页
const goToSettings = () => {
  router.push({ name: 'settings' })

}
</script>

<style scoped lang="scss">
.layout-container {
  height: 100vh;
}

.aside {
  background-color: #202123;
  color: white;
  border-right: 2px solid #2f2f2f;

  .logo {
    height: 64px;
    padding: 0 20px;
    display: flex;
    align-items: center;
    gap: 20px;

    img {
      height: 30px;
    }

    span {
      font-size: 18px;
      font-weight: bold;
    }
  }

  .side-menu {
    border-right: none;
  }
}

.header {
  background: white;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;

  .header-right {
    cursor: pointer;
  }
}

.el-main {
  background-color: #f7f7f8;
  padding: 20px;
}
</style>
