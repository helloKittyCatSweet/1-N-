<template>
	<view class="index">
		<!-- 添加一个容器来包裹卡片列表 -->
		<view class="card-container" style="display: flex; flex-wrap: wrap; justify-content: flex-start; padding: 12px;">
			<block v-for="item in list" :key="item.img_src">
				<!-- 修改卡片宽度为42%，减小边距至4% -->
				<view class="card" @click="goDetail(item)" style="width: 41%; margin: 0 4% 20px 4%;">
					<image class="card-img" :src="item.img_src" mode="aspectFill" style="width: 100%; height: 180px; border-radius: 8px;"></image>
					<text class="card-num-view" style="position: absolute; right: 10px; top: 10px; background: rgba(0,0,0,0.6); color: white; padding: 2px 6px; border-radius: 4px;">{{item.img_num}}P</text>
					<view class="card-bottm row" style="padding: 8px 0;">
						<view class="car-title-view row" style="flex: 1;">
							<text class="card-title" style="font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{item.title}}</text>
						</view>
						<view @click.stop="share(item)" class="card-share-view" style="padding: 0 10px;">
							<text style="font-size: 20px;">📤</text>
						</view>
					</view>
				</view>
			</block>
		</view>
		<text class="loadMore" style="text-align: center; padding: 10px 0; display: block;">加载中...</text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				refreshing: false,
				providerList: [],
				list: [],
				fetchPageNum: 1
			}
		},
		onLoad() {
			this.getData();
			uni.getProvider({
				service: 'share',
				success: (e) => {
					let data = []
					for (let i = 0; i < e.provider.length; i++) {
						switch (e.provider[i]) {
							case 'weixin':
								data.push({
									name: '分享到微信好友',
									id: 'weixin'
								})
								data.push({
									name: '分享到微信朋友圈',
									id: 'weixin',
									type: 'WXSenceTimeline'
								})
								break;
							case 'qq':
								data.push({
									name: '分享到QQ',
									id: 'qq'
								})
								break;
							default:
								break;
						}
					}
					this.providerList = data;
				},
				fail: (e) => {
					console.log('获取分享通道失败', e);
				}
			});
		},
		onReachBottom() {
			console.log('滑动到页面底部')
			this.getData();
		},
		onPullDownRefresh() {
			console.log('下拉刷新');
			this.refreshing = true;
			this.getData();
		},
		methods: {
			getData() {
				uni.request({
					url: this.$serverUrl + '/api/picture/posts.php?page=' + (this.refreshing ? 1 : this.fetchPageNum) +
						'&per_page=5',
					success: (ret) => {
						console.log('data', ret);
						if (ret.statusCode !== 200) {
							console.log('失败!');
						} else {
							if (this.refreshing && ret.data[0].id === this.list[0].id) {
								uni.showToast({
									title: '已经最新',
									icon: 'none',
								})
								this.refreshing = false;
								uni.stopPullDownRefresh();
								return;
							}
							if (this.refreshing) {
								this.refreshing = false;
								uni.stopPullDownRefresh()
								this.list = ret.data;
								this.fetchPageNum = 2;
							} else {
								this.list = this.list.concat(ret.data);
								this.fetchPageNum += 1;
							}
						}
					}
				});
			},
			goDetail(e) {
				uni.navigateTo({
					url: '../detail/detail?data=' + encodeURIComponent(JSON.stringify(e))
				})
			},
			share(e) {
				if (this.providerList.length === 0) {
					uni.showModal({
						title: '当前环境无分享渠道!',
						showCancel: false
					})
					return;
				}
				let itemList = this.providerList.map(function(value) {
					return value.name
				})
				uni.showActionSheet({
					itemList: itemList,
					success: (res) => {
						uni.share({
							provider: this.providerList[res.tapIndex].id,
							scene: this.providerList[res.tapIndex].type && this.providerList[res.tapIndex].type === 'WXSenceTimeline' ?
								'WXSenceTimeline' : 'WXSceneSession',
							type: 0,
							title: 'uni-app模版',
							summary: e.title,
							imageUrl: e.img_src,
							href: 'https://uniapp.dcloud.io',
							success: (res) => {
								console.log('success:' + JSON.stringify(res));
							},
							fail: (e) => {
								uni.showModal({
									content: e.errMsg,
									showCancel: false
								})
							}
						});
					}
				})
			}
		}
	}
</script>

<style>

</style>
