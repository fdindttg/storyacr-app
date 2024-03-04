<!--
 * @Description:
 * @Author: FYT1996
 * @Date: 2023-08-16 09:20:58
 * @LastEditor: FYT1996
 * @LastEditTime: 2023-12-07 14:34:31
 * @Copyright: by 南阳迈特网络科技有限公司 禁止任何形式（包含二次开发）转售系统源码，违者必究。
-->


<template>
	<view class="VideoPay" :class="{ active: show }" @click="$emit('close')">
		<view class="popup" @click.stop="">
			<view class="p_head">
				<view class="left">
					<text class="text1">{{ $t('play.support') }}</text>
				</view>
				<view class="right" :style="'color:' + global.isColor" @click="$emit('close')">{{ $t('text.close') }}</view>
			</view>
			<view class="p_text">
				<view class="left">
					<text class="text1">{{ $t('play.episode') }}：</text>
					<text class="text2" :style="'color:' + global.isColor">{{ price }}{{ $t('text.integral') }}</text>
				</view>
				<view class="right">{{ $t('play.balance') }}：{{ userInfo.usable || 0 }}{{ $t('text.integral') }}</view>
			</view>
			<view class="p_list">
				<view class="item" v-if="iosIsPay" v-for="(item, index) in integralData" :key="'integral_' + index"
					@click="touchPrePay('integral', item.id, item.price)">
					<view class="content">
						<view class="line1">
							<text class="text1">{{ item.price }}</text>
							<text class="text2">{{ $store.state.app.currency }}</text>
						</view>
						<view class="line2">
							<text class="text1">{{ item.original_usable }}</text>
							<text class="text2" v-if="item.give_usable">+{{ item.give_usable }}</text>
							<text class="text2">{{ $t('text.integral') }}</text>
						</view>
					</view>
					<view class="badge" v-if="item.flag">{{ item.flag }}</view>
				</view>
				<view class="item" v-if="iosIsPay" v-for="(item, index) in vipData" :key="'member_' + index"
					@click="touchPrePay('member', item.id, item.price)">
					<view class="content">
						<view class="line1">
							<text class="text1">{{ item.price }}</text>
							<text class="text2">{{ $store.state.app.currency }}</text>
						</view>
						<view class="line2">
							<text class="text2">{{ $t('play.free') }}</text>
						</view>
					</view>
					<view class="tips">{{ $t('text.inactive') }}</view>
					<view class="ltip">{{ item.type_text }}</view>
				</view>
			</view>
			<view class="p_info">{{ $t('play.tips') }}</view>
		</view>
		<CustomPayment :show="isPayShow" :type="type" :data="prepay" @close="isPayShow = false" />
	</view>
</template>

<script>
	import { mapState, mapGetters, mapMutations, mapActions } from "vuex"
	export default {
		name: "VideoPay",
		props: {
			show: {
				type: Boolean,
				default: false
			},
			price: {
				type: Number,
				default: 0
			},
			ad: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				global: getApp().globalData,
				integralData: [],
				vipData: [],
				buttonLoading: true,
				isAdLoading: false,
				isPayShow: false,
				type: "",
				prepay: {}
			}
		},
		computed: {
			...mapGetters("user", ["token", "userInfo"]),
			...mapGetters("app", ["iosIsPay", "config"]),
		},
		watch: {
			show(newValue, oldValue) {
				if (newValue) {
					this.token && this.getUserInfo()
				}
			},
		},
		created() {
			this.getIntegralList()
			this.getVipList()
		},
		methods: {
			...mapActions('user', ['getUserInfo']),
			// 触发预支付
			touchPrePay(type, id, price) {
				if (!this.token) return this.$u.toast(this.$t('toast.not.login'))
				this.type = type
				this.prepay = { id, price }
				this.isPayShow = true
				this.$emit('close')
			},
			// 获取积分套餐列表
			getIntegralList() {
				this.$request('integral.list').then(res => {
					if (res.code === 1) {
						res.data.list && res.data.list.length && (this.integralData = res.data.list)
					}
				})
			},
			// 获取vip套装列表
			getVipList() {
				this.$request('user.vip').then(res => {
					if (res.code === 1) {
						res.data.list && res.data.list.length && (this.vipData = res.data.list)
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.VideoPay {
		width: 100%;
		height: 100%;
		position: absolute;
		bottom: -100%;
		left: 0;
		z-index: 100;
		transition: all 0.5s;

		&.active {
			bottom: 0;
		}

		.popup {
			width: 100%;
			min-height: 60%;
			background: #000;
			border-radius: 20rpx 20rpx 0 0;
			position: absolute;
			bottom: 0;
			left: 0;
			z-index: 1;
			color: #fff;
			padding: 0 40rpx 60rpx 40rpx;
			border-top: 2rpx solid #333;
			display: flex;
			flex-direction: column;

			.p_head {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				position: relative;
				padding: 30rpx 0;
				font-size: 32rpx;

				.left {
					flex: 1;
					display: flex;
					flex-direction: row;

					.text1 {
						font-weight: 700;
						line-height: 48rpx;
					}

					.text2 {
						font-size: 24rpx;
						color: rgba(#fff, 0.5);
						margin: 0 40rpx;
						white-space: nowrap;
						line-height: 48rpx;
					}
				}

				.right {
					color: #EE7F33;
					white-space: nowrap;
					margin-left: 20rpx;
				}
			}

			.p_text {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				font-size: 28rpx;

				.left {
					display: flex;
					flex-direction: row;
					align-items: center;

					.text2 {
						color: #EE7F33;
					}
				}

				.right {
					color: rgba(#fff, 0.7);
				}
			}

			.p_list {
				flex: 1;
				margin-top: 40rpx;
				display: flex;
				flex-wrap: wrap;
				align-content: flex-start;

				.item {
					width: calc((100% - 40rpx) / 2);
					height: 180rpx;
					border-radius: 20rpx;
					background: #fff;
					margin-bottom: 40rpx;
					position: relative;
					overflow: hidden;
					color: #000;
					display: flex;
					flex-direction: column;
					padding-top: 20rpx;
					
					&:nth-child(2n) {
						margin-left: 40rpx;
					}

					&.item2 {
						background: #EE7F33;
						color: #fff;
					}

					.content {
						flex: 1;
						display: flex;
						flex-direction: column;
						justify-content: center;

						.line1 {
							display: flex;
							flex-direction: row;
							align-items: flex-end;
							justify-content: center;

							.text1 {
								font-size: 36rpx;
								font-weight: 700;
							}

							.text2 {
								font-size: 24rpx;
								display: inline-block;
								transform: scale(0.8);
							}
						}

						.line2 {
							font-size: 28rpx;
							display: flex;
							flex-direction: row;
							align-items: center;
							justify-content: center;

							.text2 {
								color: #EE7F33;
							}
						}
					}

					.tips {
						font-size: 28rpx;
						text-align: center;
						background: #EE7F33;
						padding: 8rpx 0;
						color: #fff;
					}

					.badge {
						position: absolute;
						top: -2rpx;
						right: -2rpx;
						padding: 4rpx 16rpx;
						font-size: 24rpx;
						background: #EE7F33;
						border-radius: 0 0 0 20rpx;
						color: #fff;
					}
					
					.ltip {
						position: absolute;
						top: -2rpx;
						left: -2rpx;
						font-size: 24rpx;
						padding: 4rpx 16rpx;
						background: #EE7F33;
						border-radius: 20rpx 0 20rpx 0;
						color: #fff;
					}
				}
			}

			.p_info {
				font-size: 24rpx;
				text-align: center;
				margin-top: 20rpx;
			}
		}
	}
</style>