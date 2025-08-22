<template>
  <view class="page">
    <!-- 左侧：已生成梗图展示 -->
    <view class="left-section">
      <view class="image-display">
        <image
          v-if="currentMeme.url"
          :src="currentMeme.url"
          class="main-image"
          mode="aspectFill"
        />
        <view v-else class="empty-main">🖼️ waiting to be generated</view>
      </view>
    </view>

    <!-- 中间：输入和按钮控制区 -->
    <view class="center-section">
      <view class="controls">
        <input
          v-model="keyword"
          placeholder="Input keywords"
          class="keyword-input"
        />
        <button
          type="primary"
          :disabled="!keyword"
          @tap="handleSearch"
          class="gen-btn"
        >
          Create Meme!
        </button>
        <button
          type="primary"
          :disabled="!currentMeme.url"
          @tap="handleSave"
          class="save-btn"
        >
          Save Image
        </button>
      </view>
    </view>

    <!-- 右侧：用户已有图列表 -->
    <view class="right-section">
      <view class="right-header">
        <view class="right-title">我的创作</view>
        <view class="right-stats">共 {{ memeList.length }} 张</view>
      </view>
      
      <scroll-view scroll-y class="right-list">
        <view
          v-for="(meme, i) in memeList"
          :key="i"
          class="thumb-card"
          :class="{ 'active': currentMeme.url === meme.url }"
          @tap="selectMeme(meme)"
        >
          <image :src="meme.url" mode="aspectFill" class="thumb" />
          <view class="thumb-info">
            <text class="thumb-caption">{{ meme.caption }}</text>
            <text class="thumb-date">{{ formatDate(meme.timestamp) }}</text>
          </view>
          <view class="thumb-actions">
            <button class="action-btn" @tap.stop="shareMeme(meme)">
              <text class="action-icon">📤</text>
            </button>
            <button class="action-btn delete" @tap.stop="deleteMeme(i)">
              <text class="action-icon">🗑️</text>
            </button>
          </view>
        </view>
        
        <view v-if="memeList.length === 0" class="empty-right">
          <view class="empty-icon">🎨</view>
          <text class="empty-text">还没有创作哦～</text>
          <text class="empty-desc">输入关键词开始创作吧！</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
// 保持你原来的 data / methods 不变
export default {
  data() {
    return {
      keyword: "",
      memeList: [
        // 示例数据，展示右侧区域的功能
        {
          url: "https://via.placeholder.com/400x300/ff6b6b/ffffff?text=加班",
          caption: "加班",
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1天前
        },
        {
          url: "https://via.placeholder.com/400x300/4ecdc4/ffffff?text=咖啡",
          caption: "咖啡",
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2天前
        },
        {
          url: "https://via.placeholder.com/400x300/45b7d1/ffffff?text=程序员",
          caption: "程序员",
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3天前
        }
      ],
      currentMeme: {},        // 左侧大图当前展示
      savePath: "",           // 保存路径
      showSaveDialog: false   // 是否显示保存对话框
    };
  },
  methods: {
    /* 点击搜索/生成后把返回结果推到 memeList 并设为当前 */
    async handleSearch() {
      if (!this.keyword) return;
      /* 这里换成你真实的 API 调用 */
      const newMeme = {
        url: `https://via.placeholder.com/400x300/667eea/ffffff?text=${encodeURIComponent(
          this.keyword
        )}`,
        caption: this.keyword,
        timestamp: new Date().toISOString() // Add timestamp
      };
      this.memeList.unshift(newMeme);
      this.currentMeme = newMeme;
    },
    
    /* 保存图片 */
    async handleSave() {
      if (!this.currentMeme.url) {
        uni.showToast({
          title: '请先生成图片',
          icon: 'none'
        });
        return;
      }
      
      try {
        // 在H5环境下，使用下载链接
        if (uni.getSystemInfoSync().platform === 'h5') {
          this.downloadImage();
        } else {
          // 在其他平台，可以选择保存路径
          this.selectSavePath();
        }
      } catch (error) {
        console.error('保存失败:', error);
        uni.showToast({
          title: '保存失败',
          icon: 'none'
        });
      }
    },
    
    /* 下载图片（H5环境） */
    downloadImage() {
      const link = document.createElement('a');
      link.href = this.currentMeme.url;
      link.download = `meme_${this.currentMeme.caption}_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      uni.showToast({
        title: '下载成功',
        icon: 'success'
      });
    },
    
    /* 选择保存路径（非H5环境） */
    selectSavePath() {
      // 尝试使用uni-app的文件系统API选择保存目录
      if (uni.chooseDirectory) {
        // 直接选择保存目录
        uni.chooseDirectory({
          success: (res) => {
            this.savePath = res.path;
            this.saveImageToPath();
          },
          fail: (err) => {
            console.log('选择目录失败，使用默认路径');
            this.useDefaultPath();
          }
        });
      } else {
        // 如果不支持选择目录，直接显示路径输入对话框
        this.showPathInputDialog();
      }
    },
    
    /* 显示路径输入对话框 */
    showPathInputDialog() {
      uni.showModal({
        title: '输入保存路径',
        content: '请输入图片保存的完整路径（如：/Documents/Memes/ 或 C:\\Users\\YourName\\Pictures\\Memes\\）',
        editable: true,
        placeholderText: '/Documents/Memes/',
        success: (res) => {
          if (res.confirm && res.content) {
            this.savePath = res.content;
            this.saveImageToPath();
          }
        }
      });
    },
    
    /* 使用默认路径 */
    useDefaultPath() {
      // 根据平台设置默认路径
      const platform = uni.getSystemInfoSync().platform;
      let defaultPath = '';
      
      if (platform === 'android') {
        defaultPath = '/storage/emulated/0/Download/Memes/';
      } else if (platform === 'ios') {
        defaultPath = '/Documents/Memes/';
      } else if (platform === 'windows') {
        defaultPath = 'C:\\Users\\' + (process.env.USERNAME || 'User') + '\\Pictures\\Memes\\';
      } else if (platform === 'mac') {
        defaultPath = '/Users/' + (process.env.USER || 'User') + '/Pictures/Memes/';
      } else {
        defaultPath = '/Downloads/Memes/';
      }
      
      this.savePath = defaultPath;
      this.saveImageToPath();
    },
    
    /* 保存图片到指定路径 */
    async saveImageToPath() {
      try {
        if (!this.savePath) {
          throw new Error('保存路径未设置');
        }
        
        // 确保路径以正确的分隔符结尾
        let normalizedPath = this.savePath;
        if (!normalizedPath.endsWith('/') && !normalizedPath.endsWith('\\')) {
          // 根据平台添加正确的路径分隔符
          const platform = uni.getSystemInfoSync().platform;
          if (platform === 'windows') {
            normalizedPath += '\\';
          } else {
            normalizedPath += '/';
          }
        }
        
        const fileName = `meme_${this.currentMeme.caption}_${Date.now()}.png`;
        const fullPath = normalizedPath + fileName;
        
        console.log('尝试保存到路径:', fullPath);
        
        // 尝试使用uni-app的文件系统API保存
        if (uni.saveFile) {
          // 先下载图片到临时文件
          const downloadRes = await this.downloadToTemp();
          if (downloadRes.success) {
            // 保存到指定路径
            uni.saveFile({
              tempFilePath: downloadRes.tempPath,
              filePath: fullPath,
              success: (res) => {
                uni.showToast({
                  title: `保存成功: ${fileName}`,
                  icon: 'success'
                });
                console.log('文件保存到:', res.savedFilePath);
              },
              fail: (err) => {
                console.error('保存文件失败:', err);
                this.fallbackSave(fullPath, fileName);
              }
            });
          }
        } else {
          // 降级方案
          this.fallbackSave(fullPath, fileName);
        }
        
        // 清空保存路径
        this.savePath = '';
        
      } catch (error) {
        console.error('保存到路径失败:', error);
        uni.showToast({
          title: '保存失败: ' + error.message,
          icon: 'none'
        });
      }
    },
    
    /* 下载图片到临时文件 */
    async downloadToTemp() {
      return new Promise((resolve) => {
        // 在H5环境下，模拟下载到临时文件
        if (uni.getSystemInfoSync().platform === 'h5') {
          // H5环境下，直接返回成功（实际会触发下载）
          resolve({
            success: true,
            tempPath: this.currentMeme.url
          });
        } else {
          // 其他平台，尝试下载到临时文件
          uni.downloadFile({
            url: this.currentMeme.url,
            success: (res) => {
              resolve({
                success: true,
                tempPath: res.tempFilePath
              });
            },
            fail: (err) => {
              resolve({
                success: false,
                error: err
              });
            }
          });
        }
      });
    },
    
    /* 降级保存方案 */
    fallbackSave(fullPath, fileName) {
      // 如果无法直接保存到指定路径，提供降级方案
      uni.showModal({
        title: '保存提示',
        content: `无法直接保存到 ${fullPath}\n建议使用下载功能，然后手动移动到目标文件夹`,
        showCancel: true,
        cancelText: '取消',
        confirmText: '下载图片',
        success: (res) => {
          if (res.confirm) {
            this.downloadImage();
          }
        }
      });
    },
    
    selectMeme(meme) {
      this.currentMeme = meme;
    },
    shareMeme(meme) {
      uni.showToast({
        title: `分享 ${meme.caption}`,
        icon: 'none'
      });
    },
    deleteMeme(index) {
      uni.showModal({
        title: '提示',
        content: '确定要删除这张图片吗？',
        success: (res) => {
          if (res.confirm) {
            this.memeList.splice(index, 1);
            if (this.currentMeme.url === this.memeList[index]?.url) {
              this.currentMeme = {};
            }
            uni.showToast({
              title: '删除成功',
              icon: 'none'
            });
          }
        }
      });
    },
    formatDate(timestamp) {
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    }
  }
};
</script>

<style scoped>
.page {
  display: flex;
  height: 100vh;
  box-sizing: border-box;
  padding: 16rpx;
  gap: 16rpx;
  width: 100%;
  overflow: hidden; /* 防止页面滚动 */
}

/* 左侧：图片展示区域 32% */
.left-section {
  flex: 3.2;
  display: flex;
  flex-direction: column;
  height: 100vh;
  box-sizing: border-box;
}

.image-display {
  flex: 1;
  border-radius: 16rpx;
  overflow: hidden;
  background: #f1f3f5;
  min-height: 0; /* 防止内容溢出 */
  height: calc(100vh - 32rpx); /* 减去页面padding */
  box-sizing: border-box;
}

.main-image,
.empty-main {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.empty-main {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  color: #adb5bd;
  height: 100%;
}

/* 中间：控制区域 13% */
.center-section {
  flex: 1.3;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0; /* 防止内容溢出 */
  height: 100vh;
  box-sizing: border-box;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  width: 100%;
  max-width: 260rpx;
}

.keyword-input {
  height: 80rpx;
  border: 2rpx solid #dee2e6;
  border-radius: 12rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  background: #ffffff;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.keyword-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 4rpx rgba(102, 126, 234, 0.1);
}

.gen-btn {
  height: 80rpx;
  line-height: 80rpx;
  border-radius: 12rpx;
  font-size: 30rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  font-weight: 600;
  box-shadow: 0 4rpx 16rpx rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
  width: 100%;
}

.gen-btn:not(.disabled):hover {
  transform: translateY(-2rpx);
  box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.4);
}

.gen-btn.disabled {
  background: #bdc3c7;
  box-shadow: none;
  cursor: not-allowed;
}

.save-btn {
  height: 80rpx;
  line-height: 80rpx;
  border-radius: 12rpx;
  font-size: 30rpx;
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  border: none;
  color: #ffffff;
  font-weight: 600;
  box-shadow: 0 4rpx 16rpx rgba(40, 167, 69, 0.3);
  transition: all 0.3s ease;
  width: 100%;
}

.save-btn:not(:disabled):hover {
  transform: translateY(-2rpx);
  box-shadow: 0 8rpx 24rpx rgba(40, 167, 69, 0.4);
}

.save-btn:disabled {
  background: #bdc3c7;
  box-shadow: none;
  cursor: not-allowed;
}

/* 右侧：用户创作展示 54.7% */
.right-section {
  flex: 5.47;
  display: flex;
  flex-direction: column;
  min-width: 0; /* 防止内容溢出 */
  height: 100vh;
  box-sizing: border-box;
}

.right-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  padding: 16rpx;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12rpx;
  flex-shrink: 0; /* 防止头部被压缩 */
}

.right-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #2c3e50;
}

.right-stats {
  font-size: 24rpx;
  color: #6c757d;
}

.right-list {
  flex: 1;
  overflow-y: auto;
  padding-right: 8rpx; /* 为滚动条留出空间 */
  height: calc(100vh - 120rpx); /* 减去头部和padding的高度 */
  box-sizing: border-box;
}

.thumb-card {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 16rpx;
  margin-bottom: 16rpx;
  background: #fff;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;
}

.thumb-card:hover {
  transform: translateY(-2rpx);
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.12);
}

.thumb-card.active {
  border: 2rpx solid #667eea;
  box-shadow: 0 4rpx 16rpx rgba(102, 126, 234, 0.2);
}

.thumb {
  width: 80rpx;
  height: 80rpx;
  border-radius: 8rpx;
  flex-shrink: 0;
}

.thumb-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0; /* 防止文字溢出 */
}

.thumb-caption {
  font-size: 26rpx;
  color: #495057;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-weight: 500;
}

.thumb-date {
  font-size: 20rpx;
  color: #adb5bd;
  margin-top: 6rpx;
}

.thumb-actions {
  display: flex;
  gap: 10rpx;
  margin-left: 10rpx;
  flex-shrink: 0;
}

.action-btn {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f3f5;
  border: none;
  font-size: 32rpx;
  color: #6c757d;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: #e9ecef;
  color: #667eea;
  transform: scale(1.1);
}

.action-btn.delete {
  color: #e74c3c;
}

.action-btn.delete:hover {
  background: #fde3e3;
  color: #c0392b;
}

.action-icon {
  font-size: 32rpx;
}

.empty-right {
  text-align: center;
  color: #adb5bd;
  margin-top: 100rpx;
  font-size: 28rpx;
}

.empty-icon {
  font-size: 80rpx;
  margin-bottom: 10rpx;
}

.empty-text {
  font-size: 32rpx;
  font-weight: 600;
  margin-bottom: 8rpx;
}

.empty-desc {
  font-size: 24rpx;
  color: #868e96;
}

/* 响应式设计 */
@media (max-width: 1200rpx) {
  .page {
    flex-direction: column;
    height: auto;
    gap: 16rpx;
  }
  
  .left-section,
  .center-section,
  .right-section {
    flex: none;
  }
  
  .center-section {
    order: 1;
  }
  
  .controls {
    flex-direction: row;
    max-width: none;
    gap: 16rpx;
  }
  
  .keyword-input {
    flex: 1;
  }
  
  .gen-btn {
    width: auto;
    padding: 0 40rpx;
  }
}

@media (max-width: 750rpx) {
  .page {
    padding: 16rpx;
  }
  
  .controls {
    flex-direction: column;
  }
  
  .gen-btn {
    width: 100%;
  }
}
</style>