<template>
  <view class="meme-container">
    <view class="container">
      <view class="title">梗图展示</view>
      <view class="meme-list">
        <!-- 加载状态 -->
        <view v-if="loading" class="loading">
          <view class="loading-spinner"></view>
        </view>
        <!-- 空状态 -->
        <view v-else-if="memeList.length === 0" class="empty-state">
          <text>😢</text>
          <text>暂无梗图数据</text>
        </view>
        <!-- 梗图列表 -->
        <view v-else v-for="(meme, index) in memeList" :key="index" class="meme-item">
          <view class="meme-image-container">
            <image 
                :src="meme.url" 
                :alt="meme.caption"
                class="meme-image"
                @load="meme.loaded = true"
                @error="meme.loaded = false; meme.error = true"
                v-show="!meme.error"
                />
            </view>
          <view class="meme-caption">{{ meme.caption }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      memeList: [
        {
          url: 'https://photo.16pic.com/00/53/26/16pic_5326745_b.jpg',
          caption: '程序员日常：代码一次过',
          loaded: false,
          error: false
        },
        {
          url: 'https://img.zcool.cn/community/01d72060d15c5c11013e87f414a2.jpg?x-oss-process=image/resize,w_1200,h_675,limit_0/auto-orient,1/sharpen,100/format,webp/quality,Q_100',
          caption: '当我尝试修复一个bug，却创造了十个新bug',
          loaded: false,
          error: false
        },
        {
          url: 'https://img.zcool.cn/community/01e2a5ca06e06a801214168c63964.jpg?x-oss-process=image/resize,w_200,h_675,limit_0/auto-orient,1/sharpen,100/format,webp/quality,Q_100',
          caption: '产品经理又改需求了',
          loaded: false,
          error: false
        },
        {
          url: 'https://tva1.sinaimg.cn/large/007S8ZIlgy1gexpkzj305k0t.jpg',
          caption: '测试一下无效图片链接',
          loaded: false,
          error: false
        }
      ]
    }
  },
  mounted() {
    this.handleLoad();
  },
  methods: {
    handleLoad() {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        // 故意设置一个无效URL来测试错误处理
        this.memeList[3].url = 'https://example.com/invalid-image.jpg';
      }, 1500);
    }
  }
}
</script>

<style scoped>
.meme-container {
  padding: 20px;
  background-color: #FFFFFF;
}

.title {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}

.meme-list {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.meme-item {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  width: 300px;
  margin-bottom: 20px;
}

.meme-image-container {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.meme-image {
  width: 100%;
  height: 100%;
}

.meme-caption {
  text-align: center;
  margin-top: 10px;
}

.loading {
  text-align: center;
  padding: 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #FF80AB;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 20px;
}
</style>