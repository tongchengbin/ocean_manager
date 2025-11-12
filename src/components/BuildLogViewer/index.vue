<template>
  <el-dialog
    v-model="dialogVisible"
    :close-on-click-modal="false"
    @closed="handleDialogClosed"
    class="log-dialog"
    destroy-on-close
    top="5vh"
    width="70%"
  >
    <template #header>
      <div class="dialog-header">
        <div class="header-left">
          <!-- macOS 风格圆点按钮 -->
          <div class="macos-buttons">
            <span class="macos-btn macos-btn-close" @click="closeDialog" title="关闭"></span>
            <span class="macos-btn macos-btn-minimize" title="最小化"></span>
            <span class="macos-btn macos-btn-maximize" title="最大化"></span>
          </div>
          <el-icon class="header-icon"><Document /></el-icon>
          <span class="header-title">{{ title }}</span>
        </div>
        <div class="header-right">
          <el-tag 
            v-if="buildStatus === 0" 
            type="info" 
            size="small"
            effect="dark"
          >
            <el-icon class="is-loading"><Loading /></el-icon>
            构建中
          </el-tag>
          <el-tag 
            v-else-if="buildStatus === 1" 
            type="success" 
            size="small"
            effect="dark"
          >
            <el-icon><CircleCheck /></el-icon>
            已完成
          </el-tag>
          <el-tag 
            v-else-if="buildStatus === 2" 
            type="danger" 
            size="small"
            effect="dark"
          >
            <el-icon><CircleClose /></el-icon>
            构建失败
          </el-tag>
        </div>
      </div>
    </template>
    
    <div class="log-wrapper">
      <div class="log-container">
        <div v-if="loading && logs.length === 0" class="log-loading">
          <el-icon class="is-loading loading-icon"><Loading /></el-icon>
          <span class="loading-text">{{ loadingText }}</span>
        </div>
        <div v-else-if="logs.length === 0" class="log-empty">
          <el-icon class="empty-icon"><DocumentDelete /></el-icon>
          <span>暂无日志数据</span>
        </div>
        <transition name="fade" mode="out-in">
          <div v-if="logs.length > 0" class="log-content" ref="logContentRef">
            <template v-for="(log, index) in logs" :key="index">
              <!-- 添加分割线 (每10行或遇到重要日志) -->
              <div 
                v-if="shouldShowDivider(log, index)" 
                class="log-divider"
              >
                <span class="divider-line"></span>
                <span class="divider-text">{{ getDividerText(log, index) }}</span>
                <span class="divider-line"></span>
              </div>
              
              <div
                class="log-line"
                :class="{
                  'log-success': isSuccessLog(log),
                  'log-error': isErrorLog(log),
                  'log-warning': isWarningLog(log),
                  'log-info': isInfoLog(log),
                  'log-highlight': isHighlightLog(log)
                }"
              >
                <span class="line-number">{{ index + 1 }}</span>
                <div class="line-content-wrapper">
                  <span v-if="getLogIcon(log)" class="log-icon">{{ getLogIcon(log) }}</span>
                  <pre class="line-content">{{ log }}</pre>
                </div>
              </div>
            </template>
          </div>
        </transition>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import { 
  Loading, 
  Document, 
  CircleCheck, 
  CircleClose,
  DocumentDelete 
} from '@element-plus/icons-vue';
import { http } from '@/utils/http';

export default {
  name: 'BuildLogViewer',
  components: {
    Loading,
    Document,
    CircleCheck,
    CircleClose,
    DocumentDelete
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
    taskId: {
      type: String,
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
    const buildStatus = ref(0); // 0: 构建中, 1: 已完成, 2: 构建失败
    const logContentRef = ref(null);
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
        // 构建查询参数
        const params = new URLSearchParams();
        if (logOffset.value > 0) {
          params.append('start', logOffset.value);
        }
        if (props.taskId) {
          params.append('task_id', props.taskId);
        }
        // 添加参数到URL
        const queryString = params.toString();
        if (queryString) {
          apiUrl += `?${queryString}`;
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
          const responseData = response.data.data || response.data;
          
          // 检查构建状态,如果已完成(成功或失败),停止轮询
          // STATUS_BUILD = 1 (已就绪), STATUS_BUILD_ERROR = 2 (构建失败)
          if (responseData.status !== undefined) {
            buildStatus.value = responseData.status;
            if (responseData.status === 1 || responseData.status === 2) {
              console.log('构建已完成,状态:', responseData.status === 1 ? '成功' : '失败');
              stopPolling();
            }
          }
          
          const logData = responseData.data || responseData;
          
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
          
          // 后端返回的是全部日志,不是增量,所以直接替换而不是追加
          // 只有当日志数量发生变化时才更新
          if (newLogs.length !== logs.value.length || isInitial) {
            logs.value = newLogs;
            logOffset.value = newLogs.length;
          }
          
          // 如果日志为空，显示提示信息
          if (logs.value.length === 0 || (logs.value.length === 1 && logs.value[0] === '')) {
            logs.value = ['暂无日志数据，请稍后刷新'];
          }
          
          // 自动滚动到底部
          nextTick(() => {
            if (logContentRef.value) {
              logContentRef.value.scrollTop = logContentRef.value.scrollHeight;
            }
          });
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

    // 判断是否为成功日志
    const isSuccessLog = (log) => {
      return log.includes('SUCCESS') || log.includes('successfully') || 
             log.includes('Successfully') || log.includes('完成') || 
             log.includes('success') || log.includes('done');
    };

    // 判断是否为错误日志
    const isErrorLog = (log) => {
      return log.includes('ERROR') || log.includes('FAIL') || 
             log.includes('错误') || log.includes('error') || 
             log.includes('timeout') || log.includes('exceeded') ||
             log.includes('failed') || log.includes('Failed');
    };

    // 判断是否为警告日志
    const isWarningLog = (log) => {
      return log.includes('WARNING') || log.includes('WARN') || 
             log.includes('Pulling') || log.includes('警告');
    };

    // 判断是否为信息日志
    const isInfoLog = (log) => {
      return log.includes('Step') || log.includes('status') || 
             log.includes('INFO') || log.includes('Building');
    };

    // 判断是否为高亮日志
    const isHighlightLog = (log) => {
      return log.includes('>>>') || log.includes('===') || 
             log.includes('---') || log.includes('###');
    };

    // 获取日志图标
    const getLogIcon = (log) => {
      if (isSuccessLog(log)) return '✓';
      if (isErrorLog(log)) return '✗';
      if (isWarningLog(log)) return '⚠';
      if (isInfoLog(log)) return 'ℹ';
      return '';
    };

    // 判断是否显示分割线
    const shouldShowDivider = (log, index) => {
      // 第一行不显示分割线
      if (index === 0) return false;
      
      // 每15行显示一个分割线
      if (index % 15 === 0) return true;
      
      // 遇到重要日志前显示分割线
      if (isErrorLog(log) || isSuccessLog(log)) {
        const prevLog = logs.value[index - 1];
        if (prevLog && !isErrorLog(prevLog) && !isSuccessLog(prevLog)) {
          return true;
        }
      }
      
      return false;
    };

    // 获取分割线文本
    const getDividerText = (log, index) => {
      if (isErrorLog(log)) return '错误信息';
      if (isSuccessLog(log)) return '成功信息';
      return `第 ${index + 1} 行`;
    };

    // 组件卸载前清理
    onBeforeUnmount(() => {
      stopPolling();
    });

    return {
      dialogVisible,
      loading,
      logs,
      buildStatus,
      logContentRef,
      closeDialog,
      handleDialogClosed,
      isSuccessLog,
      isErrorLog,
      isWarningLog,
      isInfoLog,
      isHighlightLog,
      getLogIcon,
      shouldShowDivider,
      getDividerText
    };
  }
};
</script>

<style lang="scss" scoped>
// 对话框头部样式
.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 0;

  .header-left {
    display: flex;
    align-items: center;
    gap: 12px;

    // macOS 风格圆点按钮
    .macos-buttons {
      display: flex;
      align-items: center;
      gap: 8px;
      padding-right: 12px;
      border-right: 1px solid #e4e7ed;

      .macos-btn {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.2s ease;
        position: relative;

        &::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        &:hover::before {
          opacity: 1;
        }
      }

      .macos-btn-close {
        background: #ff5f57;
        
        &:hover {
          background: #ff4d45;
        }

        &::before {
          content: '×';
          font-size: 10px;
          color: #8b0000;
          font-weight: bold;
          line-height: 1;
        }
      }

      .macos-btn-minimize {
        background: #ffbd2e;
        
        &:hover {
          background: #ffab00;
        }

        &::before {
          content: '−';
          font-size: 10px;
          color: #8b6914;
          font-weight: bold;
          line-height: 1;
        }
      }

      .macos-btn-maximize {
        background: #28c840;
        
        &:hover {
          background: #1fb134;
        }

        &::before {
          content: '+';
          font-size: 10px;
          color: #0d5c1f;
          font-weight: bold;
          line-height: 1;
          transform: translate(-50%, -50%) rotate(45deg);
        }
      }
    }

    .header-icon {
      font-size: 18px;
      color: #409eff;
    }

    .header-title {
      font-size: 16px;
      font-weight: 500;
      color: #303133;
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 8px;

    .el-tag {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px 12px;
      font-size: 13px;

      .el-icon {
        font-size: 14px;
      }
    }
  }
}

// 日志包装器
.log-wrapper {
  display: flex;
  flex-direction: column;
  height: 65vh;
}

// 日志容器
.log-container {
  flex: 1;
  overflow-y: auto;
  background-color: #1e1e1e;
  color: #d4d4d4;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.5;

  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #4a4a4a;
    border-radius: 4px;
    
    &:hover {
      background-color: #5a5a5a;
    }
  }

  &::-webkit-scrollbar-track {
    background-color: #252526;
  }
}

// 加载状态
.log-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #909399;

  .loading-icon {
    font-size: 32px;
    margin-bottom: 12px;
    color: #409eff;
  }

  .loading-text {
    font-size: 14px;
  }
}

// 空状态
.log-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #909399;

  .empty-icon {
    font-size: 48px;
    margin-bottom: 12px;
    color: #c0c4cc;
  }

  span {
    font-size: 14px;
  }
}

// 日志内容
.log-content {
  padding: 12px 0;
}

// 分割线样式 (macOS Terminal 风格)
.log-divider {
  display: flex;
  align-items: center;
  padding: 16px 16px;
  margin: 8px 0;
  gap: 12px;

  .divider-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(
      to right,
      transparent,
      rgba(255, 255, 255, 0.1) 20%,
      rgba(255, 255, 255, 0.1) 80%,
      transparent
    );
  }

  .divider-text {
    flex-shrink: 0;
    font-size: 11px;
    color: #858585;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding: 2px 8px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
    font-weight: 500;
  }
}

.log-line {
  display: flex;
  padding: 3px 16px;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;

  &:hover {
    background-color: #2d2d30;
    border-left-color: #3794ff;
  }

  .line-number {
    flex-shrink: 0;
    width: 50px;
    text-align: right;
    padding-right: 16px;
    color: #858585;
    user-select: none;
    font-size: 12px;
    line-height: 1.6;
  }

  .line-content-wrapper {
    flex: 1;
    display: flex;
    align-items: flex-start;
    gap: 8px;
  }

  .log-icon {
    flex-shrink: 0;
    font-size: 14px;
    line-height: 1.6;
    margin-top: 1px;
  }

  .line-content {
    flex: 1;
    margin: 0;
    padding: 0;
    white-space: pre-wrap;
    word-wrap: break-word;
    color: #d4d4d4;
    font-family: inherit;
    font-size: inherit;
    line-height: 1.6;
  }

  // 不同类型日志的颜色
  &.log-success {
    border-left-color: #4ec9b0;
    
    .log-icon {
      color: #4ec9b0;
    }
    
    .line-content {
      color: #4ec9b0;
      font-weight: 500;
    }
  }

  &.log-error {
    background-color: rgba(244, 67, 54, 0.08);
    border-left-color: #f48771;
    
    .log-icon {
      color: #f48771;
    }
    
    .line-content {
      color: #f48771;
      font-weight: 500;
    }

    &:hover {
      background-color: rgba(244, 67, 54, 0.12);
    }
  }

  &.log-warning {
    border-left-color: #dcdcaa;
    
    .log-icon {
      color: #dcdcaa;
    }
    
    .line-content {
      color: #dcdcaa;
    }
  }

  &.log-info {
    .log-icon {
      color: #569cd6;
    }
    
    .line-content {
      color: #569cd6;
    }
  }

  &.log-highlight {
    background-color: rgba(255, 255, 255, 0.05);
    border-left-color: #c586c0;
    
    .line-content {
      color: #c586c0;
      font-weight: 500;
    }
  }
}

// 对话框全局样式
:deep(.el-dialog) {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

:deep(.el-dialog__header) {
  padding: 16px 20px;
  margin: 0;
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
}

:deep(.el-dialog__body) {
  padding: 0;
  margin: 0;
}

:deep(.el-dialog__headerbtn) {
  top: 16px;
  right: 20px;
  width: 32px;
  height: 32px;

  .el-dialog__close {
    color: #909399;
    font-size: 18px;
    
    &:hover {
      color: #409eff;
    }
  }
}

// 过渡动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
