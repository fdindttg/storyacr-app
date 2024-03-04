<!--
 * @Description:
 * @Author: FYT1996
 * @Date: 2023-08-16 09:18:44
 * @LastEditor: FYT1996
 * @LastEditTime: 2023-12-04 09:39:41
 * @Copyright: by 南阳迈特网络科技有限公司 禁止任何形式（包含二次开发）转售系统源码，违者必究。
-->


<template>
	<view class="page_content">
		<view class="head_content">
			<CustomNavbar :title="$t('navbar.setting')"></CustomNavbar>
		</view>
		<view class="main_content">
			<view class="wrapper" v-for="(item, index) in menuList" :key="index" @click="menuItemClick(item)">
				<view class="label">{{ $t(item.key) }}</view>
				<view class="content">
					<image class="arrow" src="https://img.nymaite.com/video_short/icons/arrow.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="wrapper">
				<view class="label">{{ $t('setting.version') }}</view>
				<view class="content" v-if="$store.state.app.config.system">
					<text>{{ $store.state.app.config.system.version || "" }}</text>
				</view>
			</view>
			<view class="button" style="margin-top: 40rpx;" v-if="token">
				<u-button type="error" :plain="true" :text="$t('text.account.logout')" @click="logoutClick"></u-button>
			</view>
			<view class="button" style="margin-top: 40rpx;" v-if="token">
				<u-button type="error" :text="$t('text.account.delete')" @click="deleteClick"></u-button>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState, mapGetters, mapMutations, mapActions } from "vuex"
	export default {
		data() {
			return {
				menuList: [
					{ id: 1, key: "setting.privacy", rid: '' },
					{ id: 2, key: "setting.legal", rid: '' },
					{ id: 3, key: "setting.about", rid: '' }
				],
			}
		},
		computed: {
			...mapGetters("user", ["token"]),
			...mapGetters("app", ["richtext"]),
		},
		watch: {
			richtext(newValue, oldValue) {
				newValue && this.initMenuList(newValue)
			}
		},
		onLoad() {
			this.richtext && this.initMenuList(this.richtext)
		},
		onUnload() {
			
		},
		methods: {
			...mapActions("user", ["logout", "getUserInfo"]),
			// 富文本ID
			initMenuList(data) {
				this.menuList.map(item => {
					switch(item.key) {
						case "setting.privacy":
							item.rid = data.privacy_protocol
							break;
						case "setting.legal":
							item.rid = data.legal_notice
							break;
						case "setting.about":
							item.rid = data.about_us
							break;
					}
				})
			},
			// 菜单列表点击
			menuItemClick(item) {
				if(item.path) {
					this.jumpView(item.path)
				} else {
					if(!item.rid) return this.$u.toast(this.$t('toast.go.config'))
					const obj = { id: item.rid, title: this.$t(item.key) }
					this.jumpView(`/pages/user/info/richtext?d=${encodeURIComponent(JSON.stringify(obj))}`)
				}
			},
			// 退出登录
			logoutClick() {
				uni.showModal({
					title: this.$t('modal.system'),
					content: this.$t('modal.content.logout'),
					cancelText: this.$t('text.cancel'),
					confirmText: this.$t('text.confirm'),
					success: res => {
						if (res.confirm) {
							this.logout()
							uni.switchTab({
								url: '/pages/home/user'
							});
						}
					}
				})
			},
			// 注销账号
			deleteClick() {
				uni.showModal({
					title: this.$t('modal.system'),
					content: this.$t('modal.content.writeoff'),
					cancelText: this.$t('text.cancel'),
					confirmText: this.$t('text.confirm'),
					success: res => {
						if (res.confirm) {
							this.deleteAccount()
						}
					}
				})
			},
			// 删除账号
			deleteAccount() {
				this.$request('user.delete').then(res => {
					if(res.code === 1) {
						this.logout()
						uni.switchTab({
							url: '/pages/home/user'
						});
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page_content {
		.main_content {
			padding: 40rpx;
			overflow-y: auto;
			
			.wrapper {
				height: 100rpx;
				font-size: 32rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				
				.label {
					color: #000;
					white-space: nowrap;
				}
				
				.content {
					display: flex;
					align-items: center;
					color: #999;
					
					.avatar {
						width: 100rpx;
						height: 100rpx;
						border-radius: 50%;
						overflow: hidden;
						
						.image {
							width: 100%;
							height: 100%;
							border-radius: 50%;
						}
					}
					
					.arrow {
						width: 40rpx;
						margin-left: 10rpx;
					}
					
					.nickname,
					.mobile
					{
						font-size: 32rpx;
						color: #999;
						text-align: right;
					}
				}
			}
		}
		
		.mobile_popup {
			padding: 70rpx 40rpx 40rpx 40rpx;
			
			.input_box {
				height: 120rpx;
				position: relative;
				display: flex;
				align-items: center;
				
				.label {
					font-size: 32rpx;
					color: #000;
					white-space: nowrap;
					margin-right: 30rpx;
				}
				
				.input {
					flex: 1;
					font-size: 32rpx;
					color: #000;
					margin-left: 40rpx;
				}
				
				.send {
					font-size: 28rpx;
					color: #000;
					padding: 20rpx 0;
					position: absolute;
					top: 50%;
					right: 0;
					z-index: 10;
					transform: translateY(-50%);
				}
			}
			
			.button_box {
				margin-top: 70rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
			}
		}
	}
</style>
