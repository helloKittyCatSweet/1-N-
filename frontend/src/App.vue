<script>
export default {
  onLaunch: function() {
    console.log('App Launch');
    this.updateTabBar();
  },
  onShow: function() {
    console.log('App Show');
    this.updateTabBar();
  },
  onHide: function() {
    console.log('App Hide');
  },
  methods: {
	updateTabBar() {
		const userInfo = uni.getStorageSync('user');
		const isLoggedIn = !!userInfo;

		// 第 5 个 tab（索引 4）
		uni.setTabBarItem({
		index: 4,
		text: isLoggedIn ? 'Create MY MEME' : '',
		iconPath: isLoggedIn ? 'static/innovate-0.png' : '',
		selectedIconPath: isLoggedIn ? 'static/innovate-1.png' : ''
		});

		// 未登录时，把第 5 个 tab 的页面路径换成空页面
		if (!isLoggedIn) {
		uni.setTabBarItem({
			index: 4,
			pagePath: 'pages/empty/empty'
		});
		} else {
		uni.setTabBarItem({
			index: 4,
			pagePath: 'pages/create/create' // 实际页面
		});
		}
	}
	}
}
</script>

<style>
@import './common/common.css';

page,
view {
  display: flex;
}

page {
  display: flex;
  min-height: 100%;
  background-color: #EFEFEF;
}

template {
  display: flex;
  flex: 1;
}
</style>