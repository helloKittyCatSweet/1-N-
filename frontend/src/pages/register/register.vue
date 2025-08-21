<template>
	<form class='registerView' @submit="register">
		<view class="input-view">
			<view class="label-view">
				<text class="label">Username</text>
			</view>
			<input class="input" type="text" placeholder="please input username" name="nameValue" v-model="username" />
		</view>
		<view class="input-view">
			<view class="label-view">
				<text class="label">Password</text>
			</view>
			<input class="input" type="password" placeholder="please input password" name="passwordValue" v-model="password" />
		</view>
		<view class="input-view">
			<view class="label-view">
				<text class="label">Confirm Password</text>
			</view>
			<input class="input" type="password" placeholder="please confirm password" name="confirmPasswordValue" v-model="confirmPassword" />
		</view>
		<view class="button-view">
			<button type="default" class="register" hover-class="hover" formType="submit">Register</button>
			<button type="default" class="login" hover-class="hover" @click="goToLogin">Back to Login</button>
		</view>
	</form>
</template>

<script>
	export default {
		data() {
			return {
				username: '',
				password: '',
				confirmPassword: '',
				apiBaseUrl: 'http://localhost:5000/api'
			};
		},
		methods: {
			register(e) {
				e.preventDefault();
				
				// 验证密码是否匹配
				if (this.password !== this.confirmPassword) {
					uni.showToast({
						title: '两次输入的密码不一致',
						icon: 'none'
					});
					return;
				}
				
				console.log("注册中...", this.username, this.password);
				
				uni.request({
					url: this.apiBaseUrl + '/auth/register',
					method: 'POST',
					data: {
						username: this.username,
						password: this.password
					},
					header: {
						'Content-Type': 'application/json'
					},
					success: (res) => {
						console.log('注册成功:', res.data);
						
						// 保存令牌到本地存储
						uni.setStorageSync('token', res.data.token);
						
						// 显示成功消息
						uni.showToast({
							title: '注册成功',
							icon: 'success'
						});
						
						// 跳转到登录页面
						setTimeout(() => {
							uni.navigateBack();
						}, 1500);
					},
					fail: (err) => {
						console.error('注册失败:', err);
						uni.showToast({
							title: '注册失败: ' + (err.errMsg || '用户名可能已存在'),
							icon: 'none'
						});
					}
				});
			},
			goToLogin() {
				uni.navigateBack();
			}
		}
	}
</script>

<style scoped>
.registerView {
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