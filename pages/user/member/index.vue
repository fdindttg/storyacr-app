<!--
 * @Description:
 * @Author: FYT1996
 * @Date: 2023-08-16 09:19:28
 * @LastEditor: FYT1996
 * @LastEditTime: 2023-12-07 14:32:58
 * @Copyright: by 南阳迈特网络科技有限公司 禁止任何形式（包含二次开发）转售系统源码，违者必究。
-->


<template>
	<view class="page_content">
		<view class="head_content">
			<CustomNavbar :title="$t('navbar.member')" color="#fff" bg="#262626"></CustomNavbar>
		</view>
		<view class="main_content">
			<view class="vip_box">
				<view class="top" v-if="userInfo.is_vip == 1">
					<view class="line1">{{ $t('member.vip') }}</view>
					<view class="line2">
						<text class="text1"></text>
						<text class="text2">{{ userInfo.vip_expiretime_text }} {{ $t('member.expire') }}</text>
					</view>
				</view>
				<view class="top" v-else>
					<view class="line1">{{ $t('text.platform') }}</view>
					<view class="line2">
						<text class="text1">{{ $t('member.msg1') }}</text>
					</view>
				</view>
				<view class="bottom">
					<view class="line1">
						<text class="text1">{{ $t('member.msg2') }}</text>
					</view>
					<view class="line2"></view>
				</view>
				<image class="vip_image" src="https://img.nymaite.com/video_short/icons/vip.png" mode="widthFix"></image>
			</view>
			<view class="pay_box box_bg">
				<view class="title_box">
					<image class="image1" src="https://img.nymaite.com/video_short/images/arrow.png" mode="widthFix"></image>
					<text class="text">{{ $t('member.option') }}</text>
					<image class="image2" src="https://img.nymaite.com/video_short/images/arrow.png" mode="widthFix"></image>
				</view>
				<view class="card_box">
					<view class="item" v-for="(item, index) in vipList" :key="item.id" @click="touchPrePay(item.id, item.price)">
						<view class="price">
							<view class="oprice">{{ item.original_price }}</view>
							<view class="cprice">
								<text class="text2">{{ item.price }}</text>
							</view>
							<view class="cprice" style="margin-top: 12rpx;">
								<text class="text3">{{ $store.state.app.currency }}</text>
							</view>
						</view>
						<view class="tips">
							<text class="text" style="margin-right: 4rpx;" v-if="item.num > 1">{{ item.num }}</text>
							<text class="text">{{ item.type_text }}</text>
						</view>
						<view class="button">{{ $t('text.inactive') }}</view>
					</view>
				</view>
			</view>
			<view class="task_box box_bg">
				<view class="title_box">
					<image class="image1" src="https://img.nymaite.com/video_short/images/arrow.png" mode="widthFix"></image>
					<text class="text">{{ textTitle }}</text>
					<image class="image2" src="https://img.nymaite.com/video_short/images/arrow.png" mode="widthFix"></image>
				</view>
				<view class="info_box">
					<u-parse :content="textInfo"></u-parse>
				</view>
			</view>
		</view>
		<CustomPayment :show="isPayShow" type="member" :data="prepay" @close="isPayShow = false" />
	</view>
</template>

<script>
	import { mapState, mapGetters, mapMutations, mapActions } from "vuex"
	export default {
		data() {
			return {
				vipList: [],
				buttonLoading: true,
				textTitle: "",
				textInfo: "",
				isPayShow: false,
				prepay: {}
			}
		},
		computed: {
			...mapGetters("user", ["token", "userInfo"]),
		},
		onLoad() {
			this.getVipList()
		},
		methods: {
			...mapActions("user", ["getUserInfo"]),
			// 触发预支付
			touchPrePay(id, price) {
				this.prepay = { id, price }
				this.isPayShow = true
			},
			// 获取vip类型
			getVipList() {
				this.$request('user.vip').then(res => {
					if (res.code === 1) {
						if (res.data.list && res.data.list.length) {
							this.vipList = res.data.list
						}
						this.textTitle = res.data?.vip_desc?.title || ""
						this.textInfo = res.data?.vip_desc?.content || ""
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page_content {
		background: #262626;

		.main_content {
			overflow-y: auto;
			padding: 24rpx 32rpx 60rpx 32rpx;
			position: relative;

			.vip_box {
				height: 300rpx;
				border: 2rpx solid transparent;
				border-radius: 40rpx;
				background-clip: padding-box, border-box;
				background-origin: padding-box, border-box;
				background-image: linear-gradient(90deg, #1F2123, #141211), linear-gradient(90deg, #D2D2BB, #393834);

				padding: 32rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				position: relative;

				.top {
					.line1 {
						color: transparent;
						background: linear-gradient(90deg, #F1B873 0%, #F2DBA8 100%);
						-webkit-background-clip: text;
						font-size: 40rpx;
						font-weight: 900;
					}

					.line2 {
						font-size: 24rpx;
						margin-top: 12rpx;

						.text1 {
							color: #827F75;
						}

						.text2 {
							color: #E4CEAC;
						}
					}
				}

				.bottom {
					.line1 {
						font-size: 24rpx;
						color: #E4CEAC;
						display: flex;
						align-items: center;
						justify-content: space-between;

						.text1 {}

						.text2 {}
					}

					.line2 {
						width: 100%;
						height: 8rpx;
						border-radius: 8rpx;
						background: linear-gradient(90deg, #EDD9AB 0%, #F6C787 100%);
						margin-top: 12rpx;
					}
				}

				.vip_image {
					width: 260rpx;
					position: absolute;
					top: -52rpx;
					right: 0;
				}
			}

			.title_box {
				margin-bottom: 40rpx;
				display: flex;
				align-items: center;
				justify-content: center;

				.image1 {
					width: 56rpx;
					transform: rotate(180deg);
				}

				.text {
					font-size: 40rpx;
					color: #EAD0AE;
					text-shadow: 0 2rpx 0 0 #000000;
					font-weight: bold;
					margin: 0 56rpx;
					white-space: nowrap;
				}

				.image2 {
					width: 56rpx;
				}
			}

			.info_box {
				color: #FAD9B4;
				font-size: 28rpx;
			}

			.box_bg {
				border-radius: 20rpx;
				padding: 40rpx 32rpx 48rpx 32rpx;
				border: 2rpx solid #96948C;
				background: linear-gradient(225deg, #3D3D3B 0%, #2F2D2D 100%);
				box-shadow: 0 0 16rpx 0rpx rgba(#000, 0.2);
			}

			.pay_box {
				margin-top: 48rpx;

				.card_box {
					display: flex;
					flex-wrap: wrap;
					margin-bottom: -20rpx;

					.item {
						width: calc((100% - 60rpx) / 3);
						height: 284rpx;
						background-image: url('https://img.nymaite.com/video_short/images/card_1.png');
						background-repeat: no-repeat;
						background-size: 100% 100%;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						align-items: center;
						padding: 60rpx 0 24rpx;
						font-weight: bold;
						margin: 0 30rpx 30rpx 0;
						position: relative;

						&:nth-child(3n) {
							margin-right: 0;
						}

						.price {
							text-align: center;
							margin-top: 10rpx;

							.oprice {
								font-size: 24rpx;
								color: #62615D;
								text-decoration: line-through;
								margin-bottom: 4rpx;
							}

							.cprice {
								color: #603B25;

								.text1 {
									font-size: 24rpx;
								}

								.text2 {
									font-size: 32rpx;
								}

								.text3 {
									font-size: 24rpx;
								}
							}
						}
						
						.tips {
							position: absolute;
							top: 0;
							left: -1rpx;
							color: #D2BB9F;
							font-size: 24rpx;
							background: #1E1F21;
							border-radius: 20rpx 0 20rpx 0;
							padding: 4rpx 20rpx;
							
							.text {
								display: inline-block;
								transform: translateY(-2rpx);
							}
						}

						.button {
							width: 164rpx;
							height: 56rpx;
							line-height: 54rpx;
							text-align: center;
							color: #D2BB9F;
							font-size: 28rpx;
							background-image: url('https://img.nymaite.com/video_short/images/button.png');
							background-repeat: no-repeat;
							background-size: 100% 100%;
							font-weight: bold;
							white-space: nowrap;
						}
					}
				}
			}

			.task_box {
				margin-top: 32rpx;
			}
		}
	}
</style>