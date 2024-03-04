<!--
 * @Description:
 * @Author: FYT1996
 * @Date: 2023-08-16 09:19:08
 * @LastEditor: FYT1996
 * @LastEditTime: 2023-12-07 14:30:06
 * @Copyright: by 南阳迈特网络科技有限公司 禁止任何形式（包含二次开发）转售系统源码，违者必究。
-->


<template>
	<view class="page_content">
		<view class="head_content">
			<CustomNavbar :title="$t('navbar.recharge')"></CustomNavbar>
		</view>
		<view class="main_content">
			<view class="box1">
				<view class="box_title">{{ $t('recharge.hint') }}</view>
				<view class="box_content">
					<view class="list_box">
						<view class="item" :class="{ active: item.id == integralActiveId, badge: item.flag }"
							:data-flag="item.flag" v-for="(item, index) in integralData" :key="item.id"
							@click="integralItem(item.id, item.price)">
							<view class="line1">{{ item.original_usable }}+{{ item.give_usable }} {{ $t('text.integral') }}</view>
							<view class="line2">
								<text class="text2">{{ item.price }}</text>
								<text class="text1">{{ $store.state.app.currency }}</text>
							</view>
							<view class="line3">
								<text class="text">{{ item.original_price }}</text>
							</view>
							<view class="line4">
								<view class="">{{ item.desc }}</view>
								<!-- <view class="">{{ $t('recharge.explain1') }}</view> -->
								<!-- <view class="">{{ $t('recharge.explain2') }}</view> -->
							</view>
						</view>
					</view>
					<view class="button_box">
						<u-button :loading="!buttonLoading" :text="$t('text.recharge')" :customStyle="buttonStyle" @click="createOrder" />
					</view>
				</view>
			</view>
			<view class="box3">
				<view class="box_title">{{ $t('text.notice') }}</view>
				<view class="box_content">
					<view class="text_info">
						<u-parse :content="textInfo"></u-parse>
					</view>
				</view>
			</view>
		</view>
		<CustomPayment :show="isPayShow" type="integral" :data="prepay" @close="isPayShow = false" />
	</view>
</template>

<script>
	import { mapState, mapGetters, mapMutations, mapActions } from "vuex"
	export default {
		data() {
			return {
				buttonStyle: {
					width: '100%',
					height: '100rpx',
					border: 'none',
					fontSize: '24rpx',
					color: '#fff',
					background: 'linear-gradient(90deg, #F28B45 0%, #FEB787 100%)',
					borderRadius: '16rpx',
					margin: '0',
					fontWeight: 'bold'
				},
				buttonLoading: true,
				integralData: [],
				integralActiveId: 0,
				integralActivePrice: 0,
				textInfo: "",
				prepay: {},
				isPayShow: false
			}
		},
		onLoad() {
			this.getIntegralList()
		},
		methods: {
			...mapActions("user", ["getUserInfo"]),
			// 触发预支付
			touchPrePay(id, price) {
				this.prepay = { id, price }
				this.isPayShow = true
			},
			// 选择套餐
			integralItem(id, price) {
				this.integralActiveId = id
				this.integralActivePrice = price
			},
			// 获取积分套餐列表
			getIntegralList() {
				this.$request('integral.list').then(res => {
					if (res.code === 1) {
						if (res.data.list && res.data.list.length) {
							this.integralData = res.data.list
							this.integralActiveId = res.data.list[0].id
							this.integralActivePrice = res.data.list[0].price
						}
						res.data.usable_desc && (this.textInfo = res.data.usable_desc.content)
					}
				})
			},
			// 创建订单
			createOrder() {
				if (!this.integralActiveId || !this.integralActivePrice) return this.$u.toast(this.$t('toast.select.points'))
				this.touchPrePay(this.integralActiveId, this.integralActivePrice)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page_content {
		.main_content {
			padding: 24rpx 32rpx 60rpx 32rpx;
			overflow-y: auto;

			.box_title {
				font-size: 30rpx;
				color: #000;
				font-weight: 700;
			}

			.box1 {
				margin-bottom: 36rpx;

				.box_content {
					.list_box {
						display: flex;
						flex-wrap: wrap;
						margin: 40rpx 0 16rpx 0;

						.item {
							width: calc((100% - 32rpx) / 2);
							margin: 0 32rpx 32rpx 0;
							border-radius: 10rpx;
							border: 2rpx solid transparent;
							box-shadow: 0 0 12rpx rgba(153, 153, 153, 0.16);
							text-align: center;
							padding: 60rpx 20rpx 20rpx 20rpx;
							
							&:nth-child(2n) {
								margin-right: 0;
							}
							
							&.active {
								background-clip: padding-box, border-box;
								background-origin: padding-box, border-box;
								background-image: linear-gradient(to right, #FFE0CC, #FFE0CC), linear-gradient(90deg, #FEB787 0%, #F18A43 100%);

								.line2 {
									color: #FEB787;

									@supports (-webkit-background-clip: text) or (background-clip: text) {
										background: linear-gradient(to right, #FEB787 20%, #F18A43 100% 100%);
										-webkit-background-clip: text;
										background-clip: text;
										color: transparent;
									}
									
									.text1 {
										color: #FEB787;
									}
								}

								.line3 {
									color: #FEB787;
								}
							}

							&.badge {
								position: relative;

								&::before {
									// content: '限时优惠';
									content: attr(data-flag);
									position: absolute;
									top: 0;
									right: -2rpx;
									transform: translate(0, -50%);
									background: linear-gradient(90deg, #F28B45 0%, #FEB787 100%);
									font-size: 24rpx;
									color: #fff;
									padding: 4rpx 10rpx;
									border-radius: 8rpx;
								}
							}

							.line1 {
								font-size: 28rpx;
							}

							.line2 {
								margin: 20rpx 0;

								.text1 {
									font-size: 24rpx;
									display: inline-block;
									transform: scale(0.7);
								}

								.text2 {
									font-size: 36rpx;
									font-weight: 700;
								}
							}

							.line3 {
								font-size: 24rpx;
								text-decoration: line-through;
								margin-bottom: 8rpx;
							}

							.line4 {
								font-size: 24rpx;
								color: rgba(153, 153, 153, 1);
							}
						}
					}
				}
			}

			.box3 {
				.box_content {
					margin-top: 24rpx;

					.text_info {
						border: 2rpx solid rgba(238, 238, 238, 1);
						font-size: 24rpx;
						color: #7F7F7F;
						padding: 24rpx 32rpx;
						border-radius: 20rpx;
						line-height: 36rpx;
					}
				}
			}
		}
	}
</style>