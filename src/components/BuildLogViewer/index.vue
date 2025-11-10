<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="50%"
    :close-on-click-modal="false"
    @closed="handleDialogClosed"
    class="log-dialog"
    destroy-on-close
    top="5vh"
  >
    <div class="log-container">
      <div v-if="loading && logs.length === 0" class="log-loading">
        <el-icon class="is-loading"><Loading /></el-icon>
        <span>{{ loadingText }}</span>
      </div>
      <div v-else-if="logs.length === 0" class="log-empty">
        暂无日志
      </div>
      <transition name="fade" mode="out-in">
        <div v-if="logs.length > 0" class="log-content">
        <pre
          v-for="(log, index) in logs"
          :key="index"
          :class="{
            'log-success': log.includes('SUCCESS') || log.includes('successfully'),
            'log-error': log.includes('ERROR') || log.includes('FAIL') || log.includes('错误') || log.includes('error') || log.includes('timeout') || log.includes('exceeded'),
            'log-warning': log.includes('WARNING') || log.includes('WARN') || log.includes('Pulling'),
            'log-info': log.includes('Step') || log.includes('status')
          }"
        >{{ log }}</pre>
        </div>
      </transition>
    </div>
    <!-- 移除底部关闭按钮 -->
  </el-dialog>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { Loading } from '@element-plus/icons-vue';
import { http } from '@/utils/http';

export default {
  name: 'BuildLogViewer',
  components: {
    Loading
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    resourceId: {
      type: [Number, String],
      default: null
    },
    title: {
      type: String,
      default: '构建日志'
    },
    loadingText: {
      type: String,
      default: '正在加载日志，请稍候...'
    },
    // 日志获取API路径，需要支持 {id} 占位符
    apiPath: {
      type: String,
      default: '/api/admin/docker/resource/{id}/logs'
    },
    // 其他配置项可以在这里添加
  },
  emits: ['update:modelValue', 'closed'],
  setup(props, { emit }) {
    const dialogVisible = ref(props.modelValue);
    const loading = ref(false);
    const logs = ref([]);
    // 日志偏移量，用于增量获取
    const logOffset = ref(0);
    // 自动刷新相关变量，但不显示给用户
    let pollingTimer = null;
    const pollingInterval = 3000; // 轮询间隔，毫秒

    // 监听 modelValue 变化
    watch(() => props.modelValue, (newVal) => {
      dialogVisible.value = newVal;
      if (newVal && props.resourceId) {
        // 对话框打开时初始加载全部日志
        fetchLogs(true);
        // 开启自动刷新
        startPolling();
      } else {
        // 停止自动刷新
        stopPolling();
      }
    });

    // 监听 resourceId 变化
    watch(() => props.resourceId, (newVal) => {
      if (newVal && dialogVisible.value) {
        // 资源ID变化时重新加载全部日志
        fetchLogs(true);
        // 重新开启自动刷新
        startPolling();
      }
    });

    // 监听对话框状态
    watch(dialogVisible, (newVal) => {
      emit('update:modelValue', newVal);
      if (!newVal) {
        // 关闭对话框时停止刷新
        stopPolling();
      }
    });

    // 获取日志
    const fetchLogs = async (isInitial = false) => {
      if (!props.resourceId) return;

      // 首次加载显示加载中，增量加载不显示
      if (isInitial) {
        loading.value = true;
        // 重置偏移量
        logOffset.value = 0;
        logs.value = [];
      }
      
      try {
        // 构造请求URL，并添加start参数实现增量获取
        let apiUrl = props.apiPath.replace('{id}', props.resourceId);
        // 如果有偏移量，添加start参数
        if (logOffset.value > 0) {
          apiUrl += `?start=${logOffset.value}`;
        }

        // 使用错误捕获模式请求，避免直接抛出异常
        const response = await http.get(apiUrl)
          .catch(error => {
            console.error('日志API请求失败:', error);
            // 如果是404错误，说明接口不存在
            if (error.response && error.response.status === 404) {
              return { data: ['日志查询接口不存在，请联系管理员添加相应接口'] };
            }
            return { data: ['获取日志失败: ' + (error.message || '请求异常')] };
          });

        // 处理响应数据
        if (response && response.data) {
          // 处理嵌套的 data 字段
          const logData = response.data.data || response.data;
          
          let newLogs = [];
          
          // 如果是 Docker 日志格式（包含 stream、error 等字段的对象数组）
          if (Array.isArray(logData) && logData.length > 0 && (
              logData[0].stream !== undefined || 
              logData[0].error !== undefined || 
              logData[0].status !== undefined
          )) {
            // 将 Docker 日志格式转换为文本行
            newLogs = logData.map(item => {
              if (item.error) {
                return `错误: ${item.error}`;
              } else if (item.stream) {
                return item.stream.trim();
              } else if (item.status) {
                return `${item.id ? item.id + ': ' : ''}${item.status}`;
              } else {
                return JSON.stringify(item);
              }
            }).filter(line => line.trim() !== ''); // 过滤空行
          } 
          // 如果是普通数组或字符串
          else {
            newLogs = Array.isArray(logData) ? logData : logData.split('\n');
          }
          
          // 更新日志偏移量
          logOffset.value += newLogs.length;
          
          // 如果是初始加载，直接设置日志，否则追加新日志
          if (isInitial) {
            logs.value = newLogs;
          } else if (newLogs.length > 0) {
            logs.value = [...logs.value, ...newLogs];
          }
          
          // 如果日志为空，显示提示信息
          if (logs.value.length === 0 || (logs.value.length === 1 && logs.value[0] === '')) {
            logs.value = ['暂无日志数据，请稍后刷新'];
          }
        } else if (isInitial) { // 只有在初始加载时才设置空日志提示
          logs.value = ['暂无日志数据'];
        }
      } catch (error) {
        console.error('获取日志失败:', error);
        logs.value = ['获取日志失败: ' + (error.message || '请求异常')];
      } finally {
        loading.value = false;
      }
    };

    // 开始轮询
    const startPolling = () => {
      stopPolling(); // 先停止现有的轮询
      pollingTimer = setInterval(() => {
        // 使用增量获取，不传入 isInitial 参数，默认为 false
        fetchLogs(false);
      }, pollingInterval);
    };

    // 停止轮询
    const stopPolling = () => {
      if (pollingTimer) {
        clearInterval(pollingTimer);
        pollingTimer = null;
      }
    };

    
    // 关闭对话框
    const closeDialog = () => {
      dialogVisible.value = false;
    };

    // 对话框关闭后的处理
    const handleDialogClosed = () => {
      stopPolling();
      emit('closed');
    };

    // 组件卸载前清理
    onBeforeUnmount(() => {
      stopPolling();
    });

    return {
      dialogVisible,
      loading,
      logs,
      closeDialog,
      handleDialogClosed
    };
  }
};
</script>

<style lang="scss" scoped>
.log-container {
  min-height: 300px;
  max-height: 60vh;
  overflow-y: auto;
  background-color: #1e1e1e;
  color: #f0f0f0;
  padding: 0 10px 10px 10px;
  font-family: 'Consolas', 'Courier New', Courier, monospace;
  font-size: 12px;
  line-height: 1.4;
  border: none;

  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #4a4a4a;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-track {
    background-color: #1e1e1e;
  }
}

.log-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 150px;
  color: #aaa;

  .el-icon {
    font-size: 20px;
    margin-bottom: 8px;
  }
}

.log-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 150px;
  color: #777;
  font-style: italic;
  font-size: 12px;
}

.log-content {
  pre {
    margin: 0;
    padding: 1px 0;
    white-space: pre-wrap;
    word-wrap: break-word;
    line-height: 1.3;
    font-size: 12px;

    &.log-success {
      color: #4caf50;
      font-weight: bold;
    }

    &.log-error {
      color: #f44336;
      font-weight: bold;
    }

    &.log-warning {
      color: #ff9800;
    }
    
    &.log-info {
      color: #2196f3;
    }
  }
}

.dialog-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0 0 0;
}

/* 全局样式，影响对话框的内边距 */
:deep(.el-overlay) {
  background-color: rgba(0, 0, 0, 0.75); /* 加深遮罩层颜色 */
}

:deep(.el-dialog) {
  border: none !important;
  border-radius: 0 !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4) !important;
  overflow: hidden !important;
  margin-top: 0 !important;
  background-color: #1e1e1e !important;
  padding: 0 !important;
}

:deep(.el-dialog__body) {
  padding: 0 !important;
  margin: 0 !important;
  background-color: #1e1e1e !important; /* 与日志容器颜色一致 */
}

:deep(.el-dialog__header) {
  padding: 8px 12px !important;
  margin: 0 !important;
  background-color: #1e1e1e !important;
  border-bottom: 1px solid #333 !important;
  color: #eee !important;
}

:deep(.el-dialog__title) {
  color: #eee !important;
  font-size: 14px !important;
  font-weight: normal !important;
  line-height: 1.5 !important;
}

/* 移除底部样式，因为我们已经移除了底部按钮 */
:deep(.el-dialog__footer) {
  display: none !important;
  padding: 0 !important;
  margin: 0 !important;
  height: 0 !important;
}

:deep(.el-dialog__headerbtn) {
  top: 8px !important;
  right: 12px !important;
}

:deep(.el-dialog__headerbtn .el-dialog__close) {
  color: #aaa !important;
  font-size: 16px !important;
}

:deep(.el-dialog__headerbtn:hover .el-dialog__close) {
  color: #fff !important;
}

/* 添加淡入淡出过渡效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease !important;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
