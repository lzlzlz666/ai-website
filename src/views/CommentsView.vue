<template>
  <div class="message-board">
    <!-- 留言展示区域 -->
    <div class="messages-container">
      <div v-for="(message, index) in messages" :key="index" class="message-item">
        <el-avatar :src="message.avatar" size="40" class="message-avatar" />
        <div class="message-content">
          <div class="message-author">{{ message.author }}</div>
          <div class="message-text">{{ message.content }}</div>
          <div class="message-time">{{ formatTimestamp(message.timestamp) }}</div>
        </div>
      </div>
    </div>

    <!-- 留言输入区域 -->
    <div class="message-input">
      <el-input
        v-model="newMessage"
        placeholder="写下您的留言..."
        type="textarea"
        rows="3"
        :disabled="loading"
        @keyup.enter.prevent="sendMessage"
      />
      <el-button
        type="primary"
        @click="sendMessage"
        :loading="loading"
        :disabled="!newMessage.trim()"
      >
        发送了
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { ElButton, ElInput, ElAvatar } from 'element-plus';

// 留言内容数据
const newMessage = ref('');
const messages = ref([
  {
    author: '张三',
    content: '这是一个示例留言。',
    timestamp: '2024-12-08 10:30',
    avatar: 'https://via.placeholder.com/40',
  },
  {
    author: '李四',
    content: '留言板真好用！',
    timestamp: '2024-12-08 11:15',
    avatar: 'https://via.placeholder.com/40',
  },
]);
const loading = ref(false);

// 发送留言的处理函数
const sendMessage = () => {
  if (!newMessage.value.trim()) return;
  
  loading.value = true;

  // 模拟网络延迟
  setTimeout(() => {
    messages.value.push({
      author: '我',
      content: newMessage.value,
      timestamp: new Date().toLocaleString(),
      avatar: 'https://via.placeholder.com/40',
    });
    
    newMessage.value = ''; // 清空输入框
    loading.value = false;
    
    // 自动滚动到最新消息
    nextTick(() => {
      const container = document.querySelector('.messages-container');
      container.scrollTop = container.scrollHeight;
    });
  }, 1000);
};

// 时间戳格式化函数
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

// 自动滚动到最新消息
onMounted(() => {
  nextTick(() => {
    const container = document.querySelector('.messages-container');
    container.scrollTop = container.scrollHeight;
  });
});

</script>

<style scoped lang="scss">
.message-board {
  max-width: 900px;
  height: 650px;
  margin: 20px auto;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  position: relative;
}

.messages-container {
  max-height: 560px;
  overflow-y: auto;
  margin-bottom: 20px;
  padding-right: 20px; /* 防止右侧滚动条遮挡内容 */
}

.message-item {
  display: flex;
  gap: 16px;
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.3s;

  &:hover {
    background-color: #f9f9f9;
  }

  .message-avatar {
    flex-shrink: 0;
  }

  .message-content {
    flex: 1;
  }

  .message-author {
    font-weight: bold;
    color: #409eff;
    margin-bottom: 6px;
  }

  .message-text {
    font-size: 14px;
    line-height: 1.6;
    color: #333;
  }

  .message-time {
    font-size: 12px;
    color: #999;
    margin-top: 6px;
  }
}

.message-input {
  position: absolute;  /* 设置为绝对定位 */
  bottom: 20px;        /* 距离底部 20px */
  left: 20px;          /* 距离左侧 20px */
  right: 20px;         /* 距离右侧 20px */
  display: flex;
  gap: 10px;
  align-items: flex-start;

  .el-input {
    flex: 1;
  }

  .el-button {
    align-self: flex-end;
  }
}
</style>
