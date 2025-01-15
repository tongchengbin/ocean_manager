<script setup lang="ts">
import {ref, Ref} from 'vue';
import {ListItem} from "./data";
import BellIcon from "@iconify-icons/ep/bell";
import {http} from "@/utils/http";
import NoticeItem from "@/layout/components/lay-notice/components/NoticeItem.vue";
import {ApiResponse} from "@/utils/http/types";

const notices: Ref<ListItem[]> = ref([]);
const noticesNum: Ref<number> = ref(0);
const getList = () => {
  http.get<ApiResponse<ListItem>>('/api/admin/message').then(res => {
    notices.value = res.results
    noticesNum.value = res.total
  })
}
getList()


// const getLabel = computed(
//   () => item =>
//     item.name + (item.list.length > 0 ? `(${item.list.length})` : "")
// );
</script>

<template>
  <el-dropdown trigger="click" placement="bottom-end">
    <span
      :class="[
        'dropdown-badge',
        'navbar-bg-hover',
        'select-none',
        Number(noticesNum) !== 0 && 'mr-[10px]'
      ]"
    >
      <el-badge :value="Number(noticesNum) === 0 ? '' : noticesNum" :max="99">
        <span class="header-notice-icon">
          <IconifyIconOffline :icon="BellIcon"/>
        </span>
      </el-badge>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-empty
          v-if="notices.length === 0"
          description="暂无消息"
          :image-size="60"
        />
        <span v-else>
            <el-scrollbar max-height="330px">
                <div class="noticeList-container">
                  <NoticeItem v-for="(item, index) in notices" :key="index" :noticeItem="item"/>
                </div>
              </el-scrollbar>
          </span>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style lang="scss" scoped>
.dropdown-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 48px;
  cursor: pointer;

  .header-notice-icon {
    font-size: 18px;
  }
}

.dropdown-tabs {
  .noticeList-container {
    padding: 15px 24px 0;
  }

  :deep(.el-tabs__header) {
    margin: 0;
  }

  :deep(.el-tabs__nav-wrap)::after {
    height: 1px;
  }

  :deep(.el-tabs__nav-wrap) {
    padding: 0 36px;
  }
}
</style>
