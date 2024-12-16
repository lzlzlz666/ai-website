<template>
    <div class="history-container">
      <el-table :data="chatHistory" style="width: 100%">
        <el-table-column prop="date" label="日期" width="180" />
        <el-table-column prop="title" label="对话标题" />
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button type="primary" link @click="viewChat(scope.row)">
              查看
            </el-button>
            <el-button type="danger" link @click="deleteChat(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  const chatHistory = ref([
    {
      id: 1,
      date: '2024-03-20',
      title: '关于AI的讨论'
    },
    // 添加更多历史记录...
  ])
  
  const viewChat = (row) => {
    router.push(`/chat/${row.id}`)
  }
  
  const deleteChat = (row) => {
    // 添加删除逻辑
  }
  </script>
  
  <style scoped>
  .history-container {
    padding: 20px;
    background: white;
    border-radius: 8px;
  }
  </style>