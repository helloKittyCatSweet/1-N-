<template>
	<form class='loginView' @submit="login">
		<view class="input-view">
			<view class="label-view">
				<text class="label">Username</text>
			</view>
			<input class="input" type="text" placeholder="please input user username" name="nameValue" v-model="username" />
		</view>
		<view class="input-view">
			<view class="label-view">
				<text class="label">Password</text>
			</view>
			<input class="input" type="password" placeholder="please input your password" name="passwordValue" v-model="password" />
		</view>
		<view class="button-view">
			<button type="default" class="login" hover-class="hover" formType="submit">Login</button>
			<button type="default" class="register" hover-class="hover" @click="register">Free Registration</button>
		</view>
	</form>
</template>

<script>
	export default {
		data() {
			return {
				username: '',
				password: '',
				apiBaseUrl: 'http://localhost:5000/api'
			};
		},
		methods: {
			login(e) {
				e.preventDefault();
				console.log("登录中...", this.username, this.password);
				
				uni.request({
					url: this.apiBaseUrl + '/auth/login',
					method: 'POST',
					data: {
						username: this.username,
						password: this.password
					},
					header: {
						'Content-Type': 'application/json'
					},
					success: (res) => {
						console.log('登录成功:', res.data);
						// 保存令牌到本地存储
						uni.setStorageSync('token', res.data.token);
						uni.setStorageSync('user', JSON.stringify(res.data.user));
						
						// 更新选项卡
						this.$emit('updateTabBar');

						// 显示成功消息
						uni.showToast({
							title: '登录成功',
							icon: 'success'
						});
						
						// 跳转到首页
						setTimeout(() => {
							uni.switchTab({
								url: '/pages/new/new'
							});
						}, 1500);
					},
					fail: (err) => {
						console.error('登录失败:', err);
						uni.showToast({
							title: '登录失败: ' + (err.errMsg || '请检查用户名和密码'),
							icon: 'none'
						});
					}
				});
			},
			register() {
				console.log("跳转到注册页面");
				// 这里可以添加跳转到注册页面的逻辑
				uni.navigateTo({
					url: '/pages/register/register'
				});
			}
		}
	}
</script>

<style scoped>
.loginView {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
}

.input-view {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 20px;
}

.label-view {
  margin-bottom: 5px;
}

.label {
  font-size: 16px;
  font-weight: bold;
}

.input {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  font-size: 14px;
}

.button-view {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
}

.login,
.register {
  border-radius: 4px;
  padding: 10px;
}
</style>
