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

/* 输入行：横向布局 */
/* 一行两列：左标签，右输入框 */
.input-view{
  display: grid;
  grid-template-columns: 160px 1fr;  /* 左列固定宽，右列自适应 */
  align-items: center;
  column-gap: 14px;
  width: 100%;
  margin-bottom: 22px;
}

/* 标签不换行并靠右对齐更整齐 */
.label{
  font-size: 16px;
  font-weight: 700;
  white-space: nowrap;    /* 🚫 不自动换行 */
  text-align: right;
  margin: 0;
}

/* 输入框占满右侧列 */
.input{
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 12px 14px;
  font-size: 15px;
  background: #fff;
}

/* 小屏改为上下堆叠，避免拥挤 */
@media (max-width: 480px){
  .input-view{
    grid-template-columns: 1fr;
    row-gap: 8px;
  }
  .label{ text-align: left; }
}

.button-view {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
}

.login,
.register {
  border-radius: 6px;
  padding: 12px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff; 
  font-weight: bold;
  border: none;
}

.register {
  background: linear-gradient(135deg, #43e97b, #38f9d7);
  box-shadow: 0 4px 12px rgba(67, 233, 123, 0.4);
}

.login {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  box-shadow: 0 4px 12px rgba(79, 172, 254, 0.4);
}

.login:active,
.register:active {
  opacity: 0.85;
  transform: scale(0.98);
}
</style>