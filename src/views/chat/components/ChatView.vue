<template>
  <div class="chat-container">
    <!-- 聊天记录区域 -->
    <div class="chat-messages" ref="messagesContainer">
      <div v-for="(message, index) in messages" 
           :key="index" 
           :class="['message', message.role]">
        <el-avatar :size="40" :src="message.role === 'user' ? userAvatar : aiAvatar" />
        <div class="message-content" v-html="formatMessage(message.content)">
        </div>
        <!-- 复制按钮 -->
        <el-icon 
          id="copyIcon" :data-clipboard-text="message.content"
          v-if="message.role === 'assistant' && !message.isFirstMessage"  
          class="copy-icon" 
          @click="copyMessage(message.content)"
        >
          <DocumentCopy /> 
        </el-icon>
        <!-- 喜欢按钮 -->
        <el-icon 
          class="like-icon"
          v-if="message.role === 'assistant' && !message.isFirstMessage"  
          :class="{'liked': message.isLiked}"
          @click="clickLikeIcon(index)">
          <Select /> 
        </el-icon>
        <!-- 不喜欢按钮 -->
        <el-icon 
          class="unlike-icon"
          v-if="message.role === 'assistant' && !message.isFirstMessage"  
          :class="{'unLiked': message.isUnLiked}"
          @click="clickUnLikeIcon(index)">
        <CloseBold /> 
      </el-icon>
        <span 
          v-if="message.role === 'assistant'" 
          class="copy-text">
          复制
        </span>
      </div>
      <!-- 正在输入的消息 -->
      <div v-if="currentAssistantMessage" class="message assistant">
        <el-avatar :size="40" :src="aiAvatar" />
        <div class="message-content">
          {{ currentAssistantMessage }}
        </div>
      </div>
    </div>
  
    <!-- 输入区域 -->
    <div class="chat-input">
      <el-input
        v-model="inputMessage"
        class="chat-input-question"
        type="textarea"
        :rows="3"
        placeholder="输入您的问题..."
        @keyup.enter.prevent="sendMessage"
        :disabled="loading"
      />
      <el-button type="primary" 
        @click="sendMessage" 
        :class="{'input-disabled': !inputMessage.trim(), 'text-black': !loading && !inputMessage.trim() }"
        :loading="loading">
          <span v-if="loading">AI回复中...</span>
          <span v-else>发送</span>
        <el-icon><Position /></el-icon>
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { Position, DocumentCopy, CloseBold } from '@element-plus/icons-vue'
import { createSparkConnection, buildRequestData } from '@/utils/sparkApi'
import { ElMessage, ElNotification } from 'element-plus'
import { formatMessage } from '@/utils/markdown'
import Clipboard from 'clipboard'

const inputMessage = ref('')
const messages = ref([ 
  { role: 'assistant', content: '你好！我是林洲的宠物,有什么我可以帮你的吗？', isFirstMessage: true, isLiked: false, isUnLiked: false }
])
const wsConnection = ref(null)
const loading = ref(false)
const messagesContainer = ref(null)
const userAvatar = ref('')
const aiAvatar = new URL('@/assets/logo.png', import.meta.url).href
const currentAssistantMessage = ref('')

// 滚动到底部
const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// 创建WebSocket连接
const createConnection = () => {
  wsConnection.value = createSparkConnection((data) => {
    if (data.header.code !== 0) {
      ElMessage.error('AI响应出错: ' + data.header.message)
      loading.value = false
      return
    }

    const choice = data.payload.choices.text[0]
    if (choice && choice.content) {
      if (data.header.status === 0) {
        currentAssistantMessage.value = choice.content
      } else {
        currentAssistantMessage.value += choice.content
      }

      if (data.header.status === 2) {
        messages.value.push({
          role: 'assistant',
          content: currentAssistantMessage.value,
          isLiked: false,
          isUnLiked: false
        })
        currentAssistantMessage.value = ''
        scrollToBottom()
        loading.value = false
      }
    }
  })

  wsConnection.value.onerror = (error) => {
    console.error('WebSocket错误:', error)
    ElMessage.error('连接出错,请稍后重试')
    loading.value = false
  }

  wsConnection.value.onclose = () => {
    console.log('WebSocket连接已关闭')
    loading.value = false
    wsConnection.value = null
  }
}

onMounted(() => {
  setTimeout(() => {
    userAvatar.value = 'https://big-event-lz.oss-cn-hangzhou.aliyuncs.com/f2212eb3-158a-4cb9-82c9-07b8fa5a4587.jpg'
  }, 100)
  createConnection()
})

// 发送消息到服务器
const sendMessageToServer = () => {
  messages.value.push({
    role: 'user',
    content: inputMessage.value,
    isLiked: false,
    isUnLiked: false
  })
  scrollToBottom()

  loading.value = true
  inputMessage.value = ''  // 清空输入框

  const historyMessages = messages.value.map(msg => ({
    role: msg.role,
    content: msg.content
  }))

  try {
    const requestData = buildRequestData(historyMessages)
    wsConnection.value.send(JSON.stringify(requestData))
  } catch (error) {
    console.error('发送消息失败:', error)
    ElMessage.error('发送失败,请重试')
    loading.value = false
  }
}

// 发送消息
const sendMessage = () => {
  if (!inputMessage.value.trim()) {
    ElMessage.warning('请输入内容')
    return
  }

  if (!wsConnection.value || wsConnection.value.readyState !== WebSocket.OPEN) {
    if (wsConnection.value && wsConnection.value.readyState === WebSocket.CLOSED) {
      createConnection()
    } else {
      createConnection()
    }

    wsConnection.value.onopen = () => {
      sendMessageToServer()
    }
    return
  }

  sendMessageToServer()
}


// 复制消息内容
const copyMessage = (messageContent) => {
  var clipBoard = new Clipboard('#copyIcon')
   clipBoard.on('success', function() {
      clipBoard.destroy() // 销毁上一次的复制内容
      clipBoard = new Clipboard('#copyIcon')
      ElMessage.success('消息已复制到剪贴板')
      
      // 给复制按钮添加动画效果
      document.getElementById('copyIcon').classList.add('clicked')
      
      // 延时移除动画
      setTimeout(() => {
        document.getElementById('copyIcon').classList.remove('clicked')
      }, 1000)
   })
   clipBoard.on('error', function() {
      ElMessage.error('复制失败，请重试')
   })
}

// 喜欢按钮
const clickLikeIcon = (index) => {
  messages.value[index].isLiked = !messages.value[index].isLiked

  ElNotification({
    title: 'Success',
    message: '收到了你对这条消息的反馈赞同的通知，感谢你的喜欢😘',
    type: 'success',
  })
}

// 不喜欢按钮
const clickUnLikeIcon = (index) => {
  messages.value[index].isUnLiked = !messages.value[index].isUnLiked

  ElNotification({
    title: 'Success',
    message: '很抱歉这条消息对你造成了困扰，模型会持续改进😫！',
    type: 'success',
  })
}
</script>

<style scoped lang="scss">
.chat-container {
  height: calc(100vh - 104px);
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;

  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 20px;

    .message {
      display: flex;
      gap: 16px;
      margin-bottom: 20px;
      padding: 12px;
      border-radius: 8px;
      max-width: 80%;
      overflow: visible;

      &.user {
        margin-left: auto;
        background-color: #e3f2fd;
      }

      &.assistant {
        margin-right: auto;
        background-color: white;
      }

      .message-content {
        flex: 1;
        line-height: 1.6;
        font-size: 14px;
        word-break: break-word;
        position: relative;
        overflow: visible;
        z-index: 1;
      }

      .copy-icon, .like-icon, .unlike-icon {
        transition: all 0.3s ease;
        cursor: pointer;
      }

      .copy-icon:hover, .like-icon:hover, .unlike-icon:hover {
        transform: scale(1.2);
        color: #1890ff;
      }

      .copy-text {
        display: none;
        position: absolute;
        bottom: -12px;
        right: 2px;
        color: #409eff;
        font-size: 14px;
        transition: opacity 0.3s;
      }

      .copy-icon.clicked + .copy-text {
        display: block;
        opacity: 1;
      }

      .like-icon.liked {
        animation: likeAnimation 0.3s ease-out;
      }

      @keyframes likeAnimation {
        0% {
          transform: scale(1);
          color: #409eff;
        }
        50% {
          transform: scale(1.3);
          color: #ff4d4f;
        }
        100% {
          transform: scale(1);
          color: #409eff;
        }
      }

      .unlike-icon.unLiked {
        animation: unlikeAnimation 0.3s ease-out;
      }

      @keyframes unlikeAnimation {
        0% {
          transform: scale(1);
          color: #409eff;
        }
        50% {
          transform: scale(1.3);
          color: #ff4d4f;
        }
        100% {
          transform: scale(1);
          color: #409eff;
        }
      }
    }
  }

  .chat-input {
    padding: 20px;
    background: white;
    border-top: 1px solid #e6e6e6;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);

    .el-button {
      margin-top: 10px;
      float: right;
    }

    .el-textarea {
      margin-bottom: 10px;
    }
  }

  .chat-input-question:disabled {
    background-color: #f2f2f2;  /* 灰色背景 */
    border-color: #dcdfe6;
    color: #999;  /* 文本变灰 */
  }

  .input-disabled {
    background-color: #f2f2f2;
    border-color: #dcdfe6;
    color: #32bce3;
    cursor: not-allowed;  /* 禁用状态时显示为不可点击 */
  }
  
  .text-black {
    color: rgba(155, 146, 146, 0.792); /* 发送按钮文字颜色为黑色 */
  }

  /* 自定义滚动条样式 */
  .chat-messages::-webkit-scrollbar {
    width: 6px;
  }

  .chat-messages::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 3px;
  }

  .chat-messages::-webkit-scrollbar-track {
    background-color: #f5f5f5;
  }

  /* 代码块样式 */
  .message-content pre {
    background-color: #f5f5f5;
    padding: 10px;
    border-radius: 8px;
    overflow-x: auto;
    font-family: 'Courier New', monospace;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
}
</style>
