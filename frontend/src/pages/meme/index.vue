<template>
  <view class="meme-container">
    <view class="container">
      <view class="title">梗图搜索 & 保存</view>

      <!-- 关键词 -->
      <view class="input-group">
        <text>关键词：</text>
        <input v-model="keyword" placeholder="输入你想要的梗图关键词" />
      </view>

      <!-- 本地保存目录 -->
      <view class="input-group">
        <text>保存到：</text>
        <!-- webkitdirectory 允许选择文件夹 -->
        <input
          type="file"
          webkitdirectory
          directory
          @change="handleDirSelect"
          style="width:100%;"
        />
        <text v-if="savePath">{{ savePath }}</text>
      </view>

      <button
        type="primary"
        :disabled="!keyword || !savePath"
        @tap="handleSearch"
      >
        搜索并保存
      </button>

      <!-- 加载/空状态/结果列表 保持原结构 -->
      <view v-if="loading" class="loading">
        <view class="loading-spinner"></view>
      </view>
      <view v-else-if="memeList.length === 0" class="empty-state">
        <text>😢</text>
        <text>暂无结果</text>
      </view>
      <view
        v-else
        v-for="(meme, index) in memeList"
        :key="index"
        class="meme-item"
      >
        <view class="meme-image-container">
          <image
            :src="meme.url"
            class="meme-image"
            mode="aspectFill"
            @load="meme.loaded = true"
            @error="meme.loaded = false; meme.error = true"
            v-show="!meme.error"
          />
        </view>
        <view class="meme-caption">{{ meme.caption }}</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      keyword: "",
      savePath: "",            // 本地目录绝对路径
      loading: false,
      memeList: []             // { url, caption, loaded, error }
    };
  },
  methods: {
    /* 用户选了文件夹后拿到路径 */
    handleDirSelect(e) {
      // e.detail.files[0] 的 path 就是所选文件夹
      if (e.detail.files.length) {
        this.savePath = e.detail.files[0].path.replace(/[^\\/]+$/, ""); // 去掉文件名
      }
    },

    /* 点击搜索 */
    async handleSearch() {
      if (!this.keyword || !this.savePath) return;

      this.loading = true;
      try {
        // 把关键词和目录发给后端
        const res = await uni.request({
          url: "http://localhost:5000/api/meme/search", // 换成你的后端地址
          method: "POST",
          data: { keyword: this.keyword, saveDir: this.savePath }
        });

        // 后端返回 [{ fileName, caption, url }] ，url 可以是本地 file://
        this.memeList = (res.data || []).map(it => ({
          url: "file://" + it.fileName, // 本地绝对路径
          caption: it.caption,
          loaded: false,
          error: false
        }));
      } catch (err) {
        uni.showToast({ title: "搜索失败", icon: "none" });
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
/* 复用你原来的样式，这里只补一点输入框样式 */
.input-group {
  margin: 20rpx 0;
}
input[type="text"],
input[type="file"] {
  border: 1px solid #ccc;
  padding: 10rpx;
  border-radius: 6rpx;
  width: 100%;
}
button {
  margin: 30rpx 0;
}
/* 其余样式保持不变，直接拷贝你原文件的即可 */
</style>