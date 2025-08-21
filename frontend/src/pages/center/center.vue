<template>
  <view class="center">
    <view class="logo" @click="goLogin" :hover-class="!login ? 'logo-hover' : ''">
	  <image class="logo-img" :src="login ? userInfo.avatarUrl : avatarUrl"></image>
      <view class="logo-title">
        <text class="user-name">Hi，{{ login ? userInfo.username : 'you do not login now' }}</text>
        <text class="go-login navigat-arrow" v-if="!login">&#xe65e;</text>
      </view>
    </view>
    <view class="center-list">
      <view class="center-list-item border-bottom">
        <text class="list-icon">&#xe60c;</text>
        <text class="list-text">Favorite</text>
        <text class="navigat-arrow">&#xe65e;</text>
      </view>
      <view class="center-list-item">
        <text class="list-icon">&#xe60d;</text>
        <text class="list-text">Favorite Albums</text>
        <text class="navigat-arrow">&#xe65e;</text>
      </view>
    </view>
    <view class="center-list">
      <view class="center-list-item border-bottom">
        <text class="list-icon">&#xe60b;</text>
        <text class="list-text">Manage Albums</text>
        <text class="navigat-arrow">&#xe65e;</text>
      </view>
      <view class="center-list-item">
        <text class="list-icon">&#xe61a;</text>
        <text class="list-text">Upload Albums</text>
        <text class="navigat-arrow">&#xe65e;</text>
      </view>
    </view>
    <view class="center-list">
      <view class="center-list-item border-bottom" @click="goAbout">
        <text class="list-icon">&#xe603;</text>
        <text class="list-text">About</text>
        <text class="navigat-arrow">&#xe65e;</text>
      </view>
      <view class="center-list-item">
        <text class="list-icon">&#xe609;</text>
        <text class="list-text">Account Management</text>
        <text class="navigat-arrow">&#xe65e;</text>
      </view>
    </view>
    <view class="center-list" v-if="login">
      <view class="logout-container">
        <button class="standalone-logout-btn" @click="logout">
          <text class="logout-text">Logout</text>
        </button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      login: false,
      avatarUrl: '../../static/default-avatar.png', // 未登录时的默认头像
      userInfo: { username: '', avatarUrl: '../../static/default-login-avatar.png' } // 登录后的默认头像
    };
  },
  created() {
    // 从本地存储获取用户信息
    const userInfo = uni.getStorageSync('user');
    if (userInfo) {
      this.login = true;
      const parsed = JSON.parse(userInfo);
      // 合并默认字段，避免缺少 avatarUrl 等字段导致显示异常
      this.userInfo = { ...this.userInfo, ...parsed };
    }
  },
  methods: {
    goLogin() {
      if (!this.login) {
        uni.navigateTo({
          url: '/pages/login/login'
        });
      }
    },
    goAbout() {
      uni.navigateTo({
        url: '/pages/about/about'
      });
    },
    logout() {
      uni.removeStorageSync('user');
      this.login = false;
      this.userInfo = { username: '', avatarUrl: '../../static/default-login-avatar.png' };
      uni.showToast({
        title: '注销成功',
        icon: 'none',
        complete: () => {
          uni.reLaunch({
            url: '/pages/center/center'
          });
        }
      });
    }
  }
};
</script>

<style>
.standalone-logout-btn {
  width: 100%;
  height: 48px;
  background-color: #ff0000c8;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
}
.logout-text {
  color: #ffffff;
  font-size: 16px;
  text-align: center;
}
.logout-container {
  padding: 20px;
}
</style>