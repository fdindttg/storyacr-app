<!--
 * @Description:
 * @Author: FYT1996
 * @Date: 2023-08-16 09:19:00
 * @LastEditor: FYT1996
 * @LastEditTime: 2023-12-04 14:00:45
 * @Copyright: by 南阳迈特网络科技有限公司 禁止任何形式（包含二次开发）转售系统源码，违者必究。
-->


<template>
	<view class="page_content">
		<view class="head_content">
			<CustomNavbar :title="$t('navbar.integral')"></CustomNavbar>
		</view>
		<view class="main_content">
			<scroll-view class="scroll_view" :scroll-y="true" @scrolltolower="scrollBottom" >
				<view class="scroll_content">
					<view class="top_card" :style="'background:' + global.isBgColor">
						<view class="left">
							<view class="line1">
								<image class="image" src="https://img.nymaite.com/video_short/icons/integral.png" mode="widthFix"></image>
								<text class="text">{{ $t('integral.current') }}</text>
							</view>
							<view class="line2">{{ userInfo.usable || 0 }}</view>
						</view>
						<view class="right">
							<view class="btn" @click="recharge">{{ $t('text.recharge') }}</view>
						</view>
					</view>
					<view class="content_box">
						<view class="title">{{ $t('integral.record') }}</view>
						<view class="list_box" v-if="list.length">
							<view class="item" v-for="(item, index) in list" :key="index">
								<view class="line">
									<text>{{ $t('text.type') }}：{{ item.type_name }}</text>
									<text>{{ $t('text.integral') }}：{{ item.wallet }}</text>
								</view>
								<view class="line">
									<text>{{ $t('text.remark') }}：{{ item.memo }}</text>
									<text>{{ $utils.timestampToTime(item.createtime) }}</text>
								</view>
							</view>
						</view>
						<view class="be_empty" v-else>{{ $t('integral.not.record') }}</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import { mapState, mapGetters, mapMutations, mapActions } from "vuex"
	export default {
		data() {
			return {
				global: getApp().globalData,
				list: [],
				page: 1,
			}
		},
		computed: {
			...mapGetters("user", ["userInfo"])
		},
		onLoad() {
			
		},
		onShow() {
			this.integralList()
			this.list = []
			this.page = 1
		},
		methods: {
			scrollBottom() {
				this.page++
				this.integralList()
			},
			integralList() {
				this.$request('integral.record', {
					wallet_type: 'usable',
					page: this.page
				}).then(res => {
					if(res.code === 1) {
						if(res.data.wallet_logs.data && res.data.wallet_logs.data.length) {
							this.list = this.list.concat(res.data.wallet_logs.data)
						} else {
							this.page--
						}
					}
				})
			},
			recharge() {
				this.jumpView('/pages/user/integral/recharge')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page_content {
		.main_content {
			overflow: hidden;
			
			.scroll_view {
				height: 100%;
				
				.scroll_content {
					padding: 24rpx 40rpx 60rpx 40rpx;
				}
			}
			
			.top_card {
				height: 220rpx;
				border-radius: 16rpx;
				background: linear-gradient(90deg, rgba(242, 139, 69, 1) 0%, rgba(254, 183, 135, 1) 100%);
				position: relative;
				display: flex;
				justify-content: space-between;
				padding: 50rpx 40rpx;
				
				&::before {
					content: "";
					width: 100%;
					height: 100%;
					position: absolute;
					top: 0;
					left: 0;
					background-image: url('https://img.nymaite.com/video_short/images/texture.png');
					background-repeat: no-repeat;
					background-size: 100% 100%;
				}
				
				.left {
					position: relative;
					color: #fff;
					
					.line1 {
						display: flex;
						align-items: center;
						
						.image {
							width: 32rpx;
							margin-right: 8rpx;
						}
						
						.text {
							font-size: 28rpx;
						}
					}
					
					.line2 {
						font-size: 40rpx;
						font-weight: 900;
						margin-top: 20rpx;
					}
				}
				
				.right {
					.btn {
						position: relative;
						color: #EE7F33;
						font-size: 28rpx;
						min-width: 120rpx;
						height: 52rpx;
						line-height: 52rpx;
						text-align: center;
						border-radius: 8rpx;
						background: #fff;
						font-weight: 700;
						padding: 0 10rpx;
					}
				}
			}
			
			.content_box {
				margin-top: 40rpx;
				
				.title {
					font-size: 32rpx;
					font-weight: 700;
					color: rgba(39, 45, 47, 1);
				}
				
				.list_box {
					.item {
						padding: 32rpx 0;
						border-bottom: 2rpx solid rgba(240, 240, 240, 1);
						
						.line {
							display: flex;
							align-items: center;
							justify-content: space-between;
							font-size: 28rpx;
							color: rgba(39, 45, 47, 1);
							line-height: 52rpx;
							
							.bold {
								font-size: 32rpx;
								font-weight: 700;
							}
						}
					}
				}
				
				.be_empty {
					font-size: 28rpx;
					color: #999;
					text-align: center;
					padding: 40rpx 0;
				}
			}
		}
	}
</style>
