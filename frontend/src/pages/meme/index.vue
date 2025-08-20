<template>
  <view class="container">
    <view class="title">梗图展示</view>
    <scroll-view class="meme-list" scroll-y>
      <view v-for="(meme, index) in memeList" :key="index" class="meme-item">
        <image :src="meme.url" mode="widthFix" class="meme-image"></image>
        <view class="meme-caption">{{ meme.caption }}</view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 梗图列表，这里可以替换为从 API 获取的数据
      memeList: [
        {
          url: 'https://photo.16pic.com/00/53/26/16pic_5326745_b.jpg',
          caption: '这是第一个梗图'
        },
        {
          url: 'https://example.com/meme2.jpg',
          caption: '这是第二个梗图'
        },
        // 可以添加更多梗图
      ]
    };
  },
  onLoad() {
    // 可在此处添加从 API 获取梗图数据的逻辑
  }
};
</script>

<style scoped>
.container {
  padding: 20rpx;
}

.title {
  font-size: 48rpx;
  font-weight: bold;
  text-align: center;
  margin-bottom: 40rpx;
}

.meme-list {
  height: 80vh;
}

.meme-item {
  margin-bottom: 40rpx;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.meme-image {
  width: 100%;
}

.meme-caption {
  padding: 20rpx;
  font-size: 28rpx;
  text-align: center;
  background-color: #f5f5f5;
}
</style>