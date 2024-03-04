<!--
 * @Description: 此vue组件，在vue和nvue页面中被调用，需使用getApp()方法调用全局变量
 * 例如：this.$request() => getApp().$request(), this.$utils.xxxx => getApp().$utils.xxxx
 * @Author: FYT1996
 * @Date: 2023-08-16 09:16:28
 * @LastEditor: FYT1996
 * @LastEditTime: 2023-12-08 15:42:35
 * @Copyright: by 南阳迈特网络科技有限公司 禁止任何形式（包含二次开发）转售系统源码，违者必究。
-->


<template>
	<view class="CustomPayment" v-if="show" :style="[{ height: winHeight + 'px' }]">
		<view class="mask" :style="[{ height: winHeight + 'px' }]" @click="$emit('close', false)"></view>
		<view class="popup">
			<view class="list">
				<view class="item" v-for="(item, index) in payment" :key="'pay_' + index" @click="selectHandle(item.type)">
					<image class="image" :src="item.logo" mode="heightFix"></image>
					<text class="text">{{ item.name }}</text>
				</view>
				<view class="item" @click="$emit('close', false)">
					<text class="text">{{ getApp.$t('text.cancel') }}</text>
				</view>
			</view>
			<u-safe-bottom></u-safe-bottom>
		</view>
	</view>
</template>

<script>
	import { mapState, mapGetters, mapMutations, mapActions } from "vuex"
	export default {
		name: "CustomPayment",
		props: {
			show: {
				type: Boolean,
				default: false
			},
			type: {
				type: String,
				default: ""
			},
			data: {
				type: Object,
				default: () => {}
			}
		},
		data() {
			return {
				getApp: getApp(), // nvue全局变量
				pay: "",
				winWidth: 0,
				winHeight: 0,
			}
		},
		computed: {
			...mapGetters("user", ["token"]),
			...mapGetters("app", ["payment"])
		},
		created() {
			
		},
		mounted() {
			this.winWidth = uni.getSystemInfoSync().windowWidth
			this.winHeight = uni.getSystemInfoSync().windowHeight
		},
		methods: {
			// 选择支付方式
			selectHandle(pay) {
				this.$emit('close', false)
				if (!this.token) return this.getApp.$u.toast(this.getApp.$t('toast.not.login'))
				this.pay = pay
				this.createOrder()
				uni.showLoading({
					// title: "加载中..."
					// mask: true
				})
			},
			// 创建订单
			createOrder() {
				const { id, price } = this.data
				const platform = this.getApp.$utils.platforms()
				if(this.type == 'integral') {
					this.getApp.$request('integral.create', {
						usable_id: id,
						total_fee: price,
						platform
					}).then(res => {
						if (res.code === 1) {
							this.pullupPay(res.data.order_sn, this.pay, res.data.platform)
						}
					})
				} else if(this.type == 'member') {
					this.getApp.$request('member.create', {
						vip_id: id,
						total_fee: price,
						platform
					}).then(res => {
						if (res.code === 1) {
							this.pullupPay(res.data.order_sn, this.pay, res.data.platform)
						}
					})
				} else if(this.type == 'dealer') {
					this.getApp.$request('dealer.create', {
						reseller_id: id,
						total_fee: price,
						platform
					}).then(res => {
						if (res.code === 1) {
							this.pullupPay(res.data.order_sn, this.pay, res.data.platform)
						}
					})
				}
			},
			// 拉起支付
			pullupPay(order_sn, payment, platform) {
				if(payment === 'paypal' || payment === 'stripe') {
					this.getApp.$request('pay.paypal', {
						order_sn,
						payment,
						platform,
						cancel_url: platform == 'H5' ? this.getApp.$utils.currentPath() : '',
						return_url: platform == 'H5' ? this.getApp.$utils.currentPath() : ''
					}).then(res => {
						if(res.code === 1) {
							// #ifdef H5
							if(payment === 'paypal') {
								window.location.href = res.data.pay_data.links[1].href
							} else {
								window.location.href = res.data.pay_data.url
							}
							// #endif
							
							// #ifdef APP-PLUS
							this.paypalApp(payment, res.data.pay_data)
							// #endif
						}
						setTimeout(() => {
							uni.hideLoading()
						}, 3000)
					})
				}
			},
			// app支付
			paypalApp(payment, data) {
				// #ifdef APP-PLUS
				let orderInfo = {}
				if(payment === 'paypal') {
					const { clientId, orderId, userAction, currency, environment } = data
					orderInfo = {
						clientId, // 客户端id
						orderId, // 订单id
						userAction, // 按钮 paynow(立即付款) / continue(继续)
						currency, // 币种
						environment // 运行环境 sandbox / live
					}
				} else if(payment === 'stripe') {
					const { paymentIntent, publishKey, customer, ephemeralKey } = data
					orderInfo = {
						merchantName: "DCloud",
						paymentIntent,
						publishKey,
						customer,
						ephemeralKey
					}
				}

				uni.getProvider({
					service: 'payment',
					success: res => {
						if (~res.provider.indexOf('paypal') || ~res.provider.indexOf('stripe')) {
							uni.requestPayment({
								provider: payment,
								orderInfo,
								success: success => {},
								fail: fail => {}
							});
						}
					}
				});
				
				uni.hideLoading()
				// #endif
			}
		}
	}
</script>

<style lang="scss" scoped>
	.CustomPayment {
		width: 750rpx;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 99;
		
		.mask {
			width: 750rpx;
			position: absolute;
			bottom: 0;
			left: 0;
			z-index: 1;
			background: rgba(#000, 0.5);
		}
		
		.popup {
			width: 750rpx;
			background: #fff;
			position: absolute;
			bottom: 0;
			left: 0;
			z-index: 2;
			overflow: hidden;

			.list {
				width: 750rpx;
				
				.item {
					display: flex;
					align-items: center;
					justify-content: center;
					padding: 40rpx 0;
					border-bottom: 2rpx solid #EAEAEB;
					
					&:last-child {
						border-bottom: none;
						border-top: 8rpx solid #EAEAEB;
					}
					
					.image {
						width: auto;
						height: 40rpx;
						margin-right: 20rpx;
					}
					
					.text {
						color: #000;
						font-size: 32rpx;
					}
				}
			}
		}
	}
</style>