<template>
  <div class="notice-container">
    <el-badge :value="unreadCount" :hidden="unreadCount === 0" class="notice-badge">
      <el-icon 
        class="notice-icon"
        @click="handleClick"
      >
        <Bell />
      </el-icon>
    </el-badge>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Bell } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { http } from '@/utils/http'

const router = useRouter()
const unreadCount = ref(0)
let timer: any = null

const getUnreadCount = async () => {
  try {
    const res = await http.get('/api/admin/notifications/unread/count')
    unreadCount.value = res.data
  } catch (error) {
    console.error('获取未读通知数量失败:', error)
  }
}

const handleClick = () => {
  router.push('/system/notifications')
}

onMounted(() => {
  getUnreadCount()
  // 每分钟更新一次未读数量
  timer = setInterval(getUnreadCount, 60000)
})

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})
</script>

<style lang="scss" scoped>
.notice-container {
  height: 100%;
  padding: 0 10px;
  display: flex;
  align-items: center;
  cursor: pointer;
  
  .notice-badge {
    line-height: 1;
  }
  
  .notice-icon {
    font-size: 20px;
    color: var(--el-text-color-primary);
    
    &:hover {
      color: var(--el-color-primary);
    }
  }
}
</style>
