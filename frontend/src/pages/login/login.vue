<template>
	<form class='loginView' @submit="login">
		<view class="input-view">
			<view class="label-view">
				<text class="label">Username</text>
			</view>
			<input class="input" type="text" placeholder="please input user username" name="nameValue" />
		</view>
		<view class="input-view">
			<view class="label-view">
				<text class="label">Password</text>
			</view>
			<input class="input" type="password" placeholder="please input your password" name="passwordValue" />
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
			return {};
		},
		methods: {
			login(e) {
				console.log("Get the account:"+ e.detail.value.nameValue + '; get the password:' + e.detail.value.passwordValue)
			},
			register() {
				console.log("Go to registration page")
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
