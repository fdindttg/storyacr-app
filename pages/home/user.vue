<!--
 * @Description:
 * @Author: FYT1996
 * @Date: 2023-08-16 09:17:14
 * @LastEditor: FYT1996
 * @LastEditTime: 2023-12-29 13:48:00
 * @Copyright: by 南阳迈特网络科技有限公司 禁止任何形式（包含二次开发）转售系统源码，违者必究。
-->


<template>
	<view class="page_content">
		<view class="head_content">
			<CustomNavbar :left="0" :title="$t('navbar.user')" color="#2A292C"></CustomNavbar>
		</view>
		<view class="main_content">
			<view class="userinfo_box" v-if="userInfoStore" @click="jumpView('/pages/user/info/index')">
				<view class="avatar">
					<image class="image" :src="userInfoStore.avatar" mode="aspectFill"></image>
				</view>
				<view class="info">
					<view class="nickname">
						<text class="text">{{ userInfoStore.nickname }}</text>
						<image class="image" v-if="userInfoStore.is_vip == 1" src="https://img.nymaite.com/video_short/icons/vip.png" mode="widthFix"></image>
					</view>
					<view class="msg">
						<text class="text">{{ $t('user.userid') }}：{{ userInfoStore.user_id }}</text>	
						<text class="copy" @click.stop="copyText(userInfoStore.user_id)">{{ $t('user.copy') }}</text>
					</view>
				</view>
			</view>
			<view class="userinfo_box" v-else @click="jumpView('/pages/login/login')">
				<view class="avatar">
					<image class="image" src="https://img.nymaite.com/video_short/images/avatar.png" mode="aspectFill"></image>
				</view>
				<view class="info">
					<view class="nickname">
						<text class="text">{{ $t("text.login") }}</text>
					</view>
					<view class="msg"></view>
				</view>
			</view>
			<view class="vip_card">
				<view class="line1">{{ $t('user.vip.text1') }}</view>
				<view class="line2">{{ $t('user.vip.text2') }}</view>
				<view class="line3">
					<image class="left" src="/static/icons/nvip.png" mode="widthFix"></image>
					<view class="right" @click="openVip">{{ userInfoStore.is_vip == 1 ? $t('text.member') : $t('text.inactive') }}</view>
				</view>
			</view>
			<view class="recharge_box">
				<view class="left">
					<view class="text1">{{ userInfoStore.usable || 0 }}</view>
					<view class="text2">{{ $t('text.integral') }}</view>
				</view>
				<view class="right" @click="openRechagre">
					<text class="text">{{ $t('text.recharge') }}</text>
					<u-icon name="arrow-right" color="#677BA5" size="12" :bold="true"></u-icon>
				</view>
			</view>
			<view class="grid_box">
				<view class="item" v-for="(item, index) in gridList" :key="item.id" @click="gridItemClick(item)">
					<view class="img">
						<image class="image" :src="item.img" mode="widthFix"></image>
					</view>
					<view class="text">{{ $t(item.key) }}</view>
				</view>
			</view>
			<view class="menu_box">
				<view class="item" v-for="(item, index) in menuList" :key="item.id" @click="menuItemClick(item)">
					<view class="left">
						<view class="icon">
							<image class="image" :src="item.img" mode="widthFix"></image>
						</view>
						<view class="text">{{ $t(item.key) }}</view>
					</view>
					<view class="right">
						<u-icon name="arrow-right" color="#677BA5" size="12" :bold="true"></u-icon>
					</view>
				</view>
			</view>
			<view class="alert_box" v-if="platform != 'H5' && token && userInfoStore && configStore.system.mobile_switch == 1">
				<view class="item" v-if="!userInfoStore.verification.mobile">
					<text class="text">{{ $t('user.not.phone') }}</text>
					<text class="btn" @click="alertBindButton('mobile')">{{ $t('text.bind') }}</text>
				</view>
			</view>
			<u-modal
				:show="cdkey.show" :title="$t('user.grid.secret')" 
				:cancelText="$t('text.cancel')" :confirmText="$t('text.confirm')"
				:showCancelButton="true" @confirm="cdkeyConfirm" @cancel="cdkey.show = false">
				<view style="width: 100%;">
					<u-input v-model="cdkey.value" :customStyle="inputStyle" clearable :placeholder="$t('text.input.cdkey')" @change="inputChange" @blur="inputChange"></u-input>
				</view>
			</u-modal>
		</view>
	</view>
</template>

<script>
	import { mapState, mapGetters, mapMutations, mapActions } from "vuex"
	export default {
		data() {
			return {
				global: getApp().globalData,
				gridList: [
					{ id: 1, img: '/static/icons/grid1.png', key: "user.grid.viewed", path: '/pages/video/record?id=1' },
					{ id: 2, img: '/static/icons/grid2.png', key: "user.grid.collect", path: '/pages/video/record?id=2' },
					{ id: 3, img: '/static/icons/grid3.png', key: "user.grid.invite", path: '/pages/user/share/index' },
					{ id: 4, img: '/static/icons/grid4.png', key: "user.grid.dealer", path: '/pages/user/dealer/index' },
					{ id: 5, img: '/static/icons/grid5.png', key: "user.grid.team", path: '/pages/user/share/team' },
					{ id: 6, img: '/static/icons/grid6.png', key: "user.grid.secret", path: '', cdkey: true },
				],
				menuList: [
					{ id: 4, img: '/static/icons/menu4.png', key: "user.menu.integral", rid: '', path: '/pages/user/integral/task' },
					{ id: 1, img: '/static/icons/menu1.png', key: "user.menu.contact", rid: '' },
					{ id: 2, img: '/static/icons/menu2.png', key: "user.menu.user", rid: '' },
					{ id: 3, img: '/static/icons/menu3.png', key: "user.menu.setting", rid: '', path: '/pages/user/info/setting' }
				],
				platform: this.$utils.platforms(),
				configStore: this.$store.state.app.config,
				userInfoStore: this.$store.state.user.userInfo,
				debug: {
					count: 0,
					timer: null
				},
				cdkey: {
					show: false,
					value: '',
				},
				inputStyle: {},
			}
		},
		computed: {
			...mapGetters("user", ["token", "userInfo"]),
			...mapGetters("app", ["config", "richtext"]),
		},
		watch: {
			config: {
				deep: true,
				handler: function(newValue, oldValue) {
					this.configStore = newValue
				}
			},
			userInfo: {
				deep: true,
				handler: function(newValue, oldValue) {
					this.userInfoStore = newValue
				}
			},
			richtext(newValue, oldValue) {
				newValue && this.initMenuList(newValue)
			}
		},
		onPullDownRefresh() {
			if(this.token) {
				this.getUserInfo().then(res => {
					uni.stopPullDownRefresh()
				}).catch(err => {
					uni.stopPullDownRefresh()
				})
			} else {
				uni.stopPullDownRefresh()
			}
		},
		onLoad() {
			uni.$on('updateUserInfo', () => {
				this.getUserInfo()
			})
			this.richtext && this.initMenuList(this.richtext)
		},
		onShow() {
			this.token && this.getUserInfo()
		},
		onHide() {
			
		},
		onUnload() {
			uni.$off('updateUserInfo')
		},
		methods: {
			...mapActions('user', ['getUserInfo']),
			// 去绑定
			alertBindButton(type) {
				if(type == 'wxmp') {
					// console.log("绑定微信小程序");
				} else if(type == 'wxoa') {
					// console.log("绑定微信公众号");
				} else if(type == 'mobile') {
					// console.log("绑定手机号");
					this.jumpView('/pages/user/info/index')
				}
			},
			// 复制
			copyText(info) {
				uni.setClipboardData({
					data: String(info),
					success: () => {
						this.$u.toast(this.$t('toast.copy.success'))
					},
					fail: () => {
						this.$u.toast(this.$t('toast.copy.fail'))
					}
				});
			},
			// 富文本ID
			initMenuList(data) {
				this.menuList.map(item => {
					switch(item.key) {
						case "user.menu.contact":
							item.rid = data.contact_us
							break;
						case "user.menu.user":
							item.rid = data.user_protocol
							break;
					}
				})
			},
			// 输入框验证
			inputChange() {
				let result = false
				if(!this.cdkey.value) {
					this.inputStyle = {
						borderColor: 'red !important'
					}
				} else {
					this.inputStyle = {}
					result = true
				}
				return result
			},
			// 卡密兑换
			cdkeyConfirm() {
				if(!this.inputChange()) return
				uni.showLoading({
					// title: '兑换中'
				})

				this.$request('user.cdkey', {
					crypto: this.cdkey.value,
					platform: this.$utils.platforms()
				}).then(res => {
					if(res.code === 1) {
						this.getUserInfo()
						this.$u.toast(res.msg)
					}
					this.cdkey.value = ''
					this.cdkey.show = false
				}).catch(err => {
					this.$u.toast(this.$t('toast.exchange.fail'))
					this.cdkey.value = ''
					this.cdkey.show = false
					uni.hideLoading()
				})
			},
			// 功能区点击
			gridItemClick(item) {
				if(!this.token) return this.$u.toast(this.$t('toast.not.login'))
				if(item.cdkey) return this.cdkey.show = true
				if(item.path) this.jumpView(item.path)
			},
			// 菜单列表点击
			menuItemClick(item) {
				if(item.path) return this.jumpView(item.path)
				if(!item.rid) return this.$u.toast(this.$t('toast.go.config'))
				const obj = { id: item.rid, title: this.$t(item.key) }
				this.jumpView(`/pages/user/info/richtext?d=${encodeURIComponent(JSON.stringify(obj))}`)
			},
			// 会员中心
			openVip() {
				if(!this.token) return this.$u.toast(this.$t('toast.not.login'))
				this.jumpView('/pages/user/member/index')
			},
			// 充值中心
			openRechagre() {
				if(!this.token) return this.$u.toast(this.$t('toast.not.login'))
				this.jumpView('/pages/user/integral/index')
			}
		}
	}
</script>

<style>
	page {
		background: #F4F7FA;
	}
</style>
<style lang="scss" scoped>
	.page_content {
		position: relative;
		
		.head_content {}
		
		.main_content {
			padding: 24rpx 40rpx 152rpx 40rpx;
			overflow-y: auto;
			
			.userinfo_box {
				display: flex;
				align-items: center;
				position: relative;
				margin-bottom: 30rpx;
				
				.arrow {
					position: absolute;
					top: 50%;
					right: 0;
					transform: translateY(-50%) rotate(0deg);
					width: 44rpx;
				}
				
				.avatar {
					width: 130rpx;
					height: 130rpx;
					border-radius: 50%;
					overflow: hidden;
					
					.image {
						width: 100%;
						height: 100%;
						border-radius: 50%;
					}
				}
				
				.info {
					flex: 1;
					margin-left: 32rpx;
					
					.nickname {
						display: flex;
						
						.text {
							font-size: 34rpx;
							color: #000;
							font-weight: 900;
						}
						
						.image {
							width: 52rpx;
							margin-left: 8rpx;
						}
					}
					
					.msg {
						margin-top: 20rpx;
						font-size: 28rpx;
						
						.text {
							color: #EE7F33;
							background: rgba(#EE7F33, 0.1);
							padding: 4rpx 20rpx;
							border-radius: 20rpx;
						}
						
						.copy {
							color: #677BA5;
							margin-left: 10rpx;
							text-decoration: underline;
							display: inline-block;
						}
					}
				}
			}
			
			.vip_card {
				background: linear-gradient(180deg, #3d3e51, #5a5768);
				border: 2rpx solid #5a5768;
				border-radius: 30rpx;
				box-shadow: 0 4rpx 20rpx 0 rgba(#5a5768, 0.5);
				padding: 30rpx;
				font-size: 32rpx;
				
				.line1 {
					color: #FFDDAE;
				}
				
				.line2 {
					font-size: 28rpx;
					color: #FFDDAE;
					opacity: 0.6;
				}
				
				.line3 {
					margin-top: 20rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;

					.left {
						width: 128rpx;
					}
					
					.right {
						white-space: nowrap;
						color: #3F4053;
						padding: 8rpx 20rpx;
						border-radius: 10rpx;
						background: #FFDDAE;
					}
				}
			}
			
			.recharge_box {
				display: flex;
				align-items: flex-end;
				justify-content: space-between;
				padding: 30rpx 0;
				
				.left {
					.text1 {
						font-size: 56rpx;
						font-weight: 700;
					}
					
					.text2 {
						font-size: 32rpx;
					}
				}
				
				.right {
					display: flex;
					align-items: center;
					font-size: 32rpx;
					color: #677BA5;
					border: 2rpx solid #677BA5;
					border-radius: 10rpx;
					padding: 8rpx 16rpx 8rpx 20rpx;
					
					.text {
						margin-right: 10rpx;
					}
				}
			}
			
			.grid_box {
				display: flex;
				flex-wrap: wrap;
				padding: 20rpx 30rpx;
				background: #fff;
				border-radius: 30rpx;
				margin-bottom: 60rpx;
				
				.item {
					width: calc(100% / 3);
					height: 192rpx;
					padding-top: 30rpx;
					
					&:nth-child(4n-3) {
						.img {
							background: linear-gradient(180deg, #f8a87b, #f3c86b);
							box-shadow: 0 6rpx 6rpx 0 rgba(247, 175, 119, 0.30);
						}
					}
					
					&:nth-child(4n-2) {
						.img {
							background: linear-gradient(180deg, #7a86f5, #69a0f8);
							box-shadow: 0 6rpx 6rpx 0 rgba(106, 159, 248, 0.30);
						}
					}
					
					&:nth-child(4n-1) {
						.img {
							background: linear-gradient(180deg, #ed6d6f, #fa9b9e);
							box-shadow: 0 6rpx 6rpx 0 rgba(250, 153, 156, 0.30);
						}
					}
					
					&:nth-child(4n) {
						.img {
							background: linear-gradient(180deg, #23cfe5, #42b0f4);
							box-shadow: 0 6rpx 6rpx 0 rgba(63, 178, 243, 0.30);
						}
					}
					
					.img {
						width: 88rpx;
						height: 88rpx;
						margin: 0 auto;
						border-radius: 36rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						
						.image {
							width: 40rpx;
						}
					}
					
					.text {
						font-size: 24rpx;
						color: #272F37;
						margin-top: 10rpx;
						text-align: center;
					}
				}
			}
		
			.menu_box {
				padding: 0 30rpx;
				
				.item {
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-bottom: 60rpx;
					
					.left {
						display: flex;
						align-items: center;
						
						.icon {
							width: 40rpx;
							height: 40rpx;
							display: flex;
							align-items: center;
							justify-content: center;
							
							.image {
								width: 100%;
							}
						}
						
						.text {
							font-size: 32rpx;
							color: #272F37;
							margin-left: 20rpx;
						}
					}
				}
			}
			
			.alert_box {
				width: 100%;
				padding: 0 40rpx;
				position: absolute;
				bottom: 20rpx;
				left: 0;

				.item {
					padding: 20rpx;
					border-radius: 20rpx;
					background: rgba(0, 0, 0, 0.9);
					color: #fff;
					font-size: 28rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					
					.text {}
					
					.btn {
						background: #C78021;
						padding: 8rpx 20rpx;
						border-radius: 10rpx;
					}
				}
			}
		}
	}
</style>
