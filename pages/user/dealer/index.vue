<!--
 * @Description:
 * @Author: FYT1996
 * @Date: 2023-08-16 09:18:29
 * @LastEditor: FYT1996
 * @LastEditTime: 2023-12-07 14:28:29
 * @Copyright: by 南阳迈特网络科技有限公司 禁止任何形式（包含二次开发）转售系统源码，违者必究。
-->


<template>
	<view class="page_content">
		<view class="head_content">
			<CustomNavbar :title="$t('navbar.dealer')"></CustomNavbar>
		</view>
		<view class="main_content">
			<view class="info_box">
				<view class="user">
					<view class="avatar">
						<image class="image" :src="userInfo.avatar" mode="aspectFill"></image>
					</view>
					<view class="content" v-if="level == 0">
						<view class="p1">{{ $t('dealer.default') }}</view>
						<view class="p2">{{ $t('dealer.not') }}</view>
					</view>
					<view class="content" v-else>
						<view class="p1">{{ $t('dealer.welcome', userInfo.levelText) }}</view>
						<view class="p2">{{ $t('dealer.have', userInfo.levelText) }}</view>
					</view>
				</view>
				<view class="card">
					<view class="texts" v-if="level == 0">
						<text class="text1" :style="'color:' + global.isColor">{{ $t('text.platform') }}</text>
						<text class="text3">{{ $t('dealer.deadline') }}</text>
					</view>
					<view class="texts" v-else>
						<text class="text1">{{ userInfo.levelText }}</text>
						<text class="text3">{{ userInfo.expireText }}</text>
					</view>
				</view>
			</view>
			<view class="content_box">
				<view class="level_box">
					<view class="title">{{ $t('dealer.classify') }}</view>
					<view class="list_box" v-if="levelData.length">
						<view class="item"
							:style="item.level == dredgeLevel ? 'background-image: linear-gradient(to right, #000, #000),' + global.isBgColor : ''"
							:class="{ active: item.level == dredgeLevel }" v-for="(item, index) in levelData"
							:key="index" @click="levelCardClick(item)">
							<view class="text1">{{ item.expire_text }}</view>
							<view class="text2" :style="'color:' + global.isColor">
								<text class="num">{{ item.price }}</text>
								<text class="cu">{{ $store.state.app.currency }}</text>
							</view>
							<view class="text3">
								<view class="">{{ $t('text.direct') }}</view>
								<view class="">{{ Number(item.direct) }}%</view>
							</view>
							<view class="text3" style="margin-top: 10rpx;">
								<view class="">{{ $t('text.indirect') }}</view>
								<view class="">{{ Number(item.indirect) }}%</view>
							</view>
							<view class="tip" :style="'background:' + global.isBgColor">{{ item.name }}</view>
						</view>
					</view>
				</view>
				<view class="text_box">
					<u-parse :content="msg"></u-parse>
				</view>
			</view>
		</view>
		<view class="footer_content" v-if="levelData.length">
			<view class="button_box">
				<u-button :text="$t('text.inactive')" v-if="dredgeLevel != 0" :loading="buttonLoading" :customStyle="{ ...buttonStyle, background: global.isBgColor }" @click="touchPrePay" />
			</view>
		</view>
		<CustomPayment :show="isPayShow" type="dealer" :data="prepay" @close="isPayShow = false" />
	</view>
</template>

<script>
	import { mapState, mapGetters, mapMutations, mapActions } from "vuex"
	export default {
		data() {
			return {
				global: getApp().globalData,
				buttonStyle: {
					width: '100%',
					height: '108rpx',
					border: 'none',
					fontSize: '32rpx',
					color: '#fff',
					borderRadius: '16rpx',
					margin: '0',
					fontWeight: 'bold'
				},
				buttonLoading: false,
				msg: '',
				levelData: [], // 等级列表
				level: 0, // 自己的等级
				dredgeLevel: 0, // 需要开通的等级
				maxLevel: 0, // 最大等级
				dredge: { // 需要开通的参数
					reseller_id: '',
					total_fee: ''
				},
				userInfo: '',
				isPayShow: false,
				prepay: {}
			}
		},
		onLoad() {
			this.getPageData()
		},
		methods: {
			...mapActions("user", ["getUserInfo"]),
			// 触发预支付
			touchPrePay() {
				this.prepay = { id: this.dredge.reseller_id, price: this.dredge.total_fee }
				this.isPayShow = true
			},
			// 点击的经销商等级
			levelCardClick(item) {
				this.dredgeLevel = item.level
				this.dredgeLevelId = item.id

				this.dredge.reseller_id = item.id
				this.dredge.total_fee = item.price
			},
			// 经销商等级
			dealerLevelList() {
				this.$request('dealer.level').then(res => {
					if (res.code === 1) {
						this.levelData = res.data.list
						// this.msg = res.data.list[0].content
						this.msg = res.data.reseller_desc.content
						let level = res.data.list.map(obj => obj.level);
						this.maxLevel = Math.max(...level)
						this.dredgeLevel = this.level + 1 > this.maxLevel ? this.maxLevel : this.level + 1
						if (this.dredgeLevel <= this.maxLevel) {
							let item = res.data.list.filter(item => item.level == this.dredgeLevel)[0]
							this.dredge.reseller_id = item.id
							this.dredge.total_fee = item.price
						}
					}
				})
			},
			// 个人信息
			getPageData() {
				this.getUserInfo().then(res => {
					if (res.code === 1) {
						this.level = res.data.reseller ? res.data.reseller.level : 0
						// this.userInfo = { avatar: res.data.avatar }
						this.userInfo = res.data
						if (res.data.reseller) {
							let obj = {
								id: res.data.reseller.reseller_id,
								level: res.data.reseller.level,
								levelText: res.data.reseller.reseller_json.name,
								expireText: res.data.reseller.expiretime_text
							}

							this.userInfo = {
								...this.userInfo,
								...obj
							}
						}
						this.dealerLevelList()
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page_content {
		position: relative;

		&::before {
			content: "";
			width: 100%;
			height: 410rpx;
			position: absolute;
			top: 0;
			left: 0;
			z-index: 0;
			background-image: url('https://img.nymaite.com/video_short/images/v_bg.png');
			background-repeat: no-repeat;
			background-size: auto 100%;
			background-position: 110% 100%;
		}

		.head_content {
			background: #F9F9FB;
		}

		.main_content {
			overflow-x: hidden;
			padding-bottom: 200rpx;

			.info_box {
				width: 140%;
				background: #F9F9FB;
				border-radius: 0 0 50% 50%;
				margin-left: -20%;
				padding: 0 calc(20% + 32rpx);
				overflow: hidden;

				.user {
					position: relative;
					display: flex;
					// align-items: center;
					align-items: flex-start;
					margin-top: 10rpx;

					.avatar {
						width: 114rpx;
						height: 114rpx;
						border-radius: 50%;
						overflow: hidden;

						.image {
							width: 100%;
							height: 100%;
						}
					}

					.content {
						margin-left: 24rpx;

						.p1 {
							font-size: 32rpx;
							color: #333;
							margin-bottom: 8rpx;
							font-weight: 700;
						}

						.p2 {
							font-size: 28rpx;
							color: #999;
						}
					}
				}

				.card {
					position: relative;
					height: 120rpx;
					margin-top: 10rpx;
					border-radius: 16rpx;
					padding: 32rpx 40rpx 0 40rpx;
					background: linear-gradient(269.64deg, rgba(92, 86, 96, 1) 0%, rgba(57, 52, 59, 1) 100%);

					&::before {
						content: "";
						width: 100%;
						height: 100%;
						position: absolute;
						top: 0;
						left: 0;
						background-image: url('https://img.nymaite.com/video_short/images/line_bg.png');
						background-repeat: no-repeat;
						background-size: auto 110%;
						background-position: 50% 0;
					}

					.texts {
						position: relative;
						display: flex;
						align-items: center;
						justify-content: space-between;

						.text1 {
							font-size: 36rpx;
							// color: #E6BD70;
							// color: #F28C46;
							color: #FEB787;
							font-weight: 700;
						}

						.text2 {
							font-size: 24rpx;
							color: #fff;
						}

						.text3 {
							font-size: 24rpx;
							color: #fff;
						}
					}
				}
			}

			.content_box {
				padding: 32rpx;

				.level_box {
					position: relative;
					background: #fff;

					.title {
						font-size: 32rpx;
						font-weight: 700;
						color: #272D2F;
					}

					.list_box {
						display: flex;
						flex-wrap: wrap;
						
						.item {
							position: relative;
							width: calc((100% - 32rpx) / 2);
							border-radius: 20rpx;
							padding: 72rpx 20rpx 36rpx 20rpx;
							border: 4rpx solid transparent;
							background: rgba(77, 77, 77, 1);
							margin: 32rpx 32rpx 0 0;

							&:nth-child(2n) {
								margin-right: 0;
							}

							&.active {
								background-clip: padding-box, border-box;
								background-origin: padding-box, border-box;
								background-image: linear-gradient(to right, #000, #000), linear-gradient(90deg, #F28D48 0%, #FEB685 100%);
							}

							.text1 {
								font-size: 28rpx;
								color: #fff;
							}

							.text2 {
								color: #F28C46;
								margin: 12rpx 0;

								.num {
									font-size: 44rpx;
									font-weight: 700;
								}
								
								.cu {
									font-size: 24rpx;
									display: inline-block;
									transform: scale(0.8);
								}
							}

							.text3 {
								font-size: 24rpx;
								color: #fff;
							}

							.tip {
								font-size: 24rpx;
								font-weight: 700;
								color: #fff;
								padding: 8rpx 16rpx;
								border-radius: 0 20rpx 0 20rpx;
								background: linear-gradient(90deg, #F28B45 0%, #FEB787 100%);
								position: absolute;
								top: -4rpx;
								right: -4rpx;
							}
						}
					}
				}

				.text_box {
					margin-top: 40rpx;
					border-radius: 16rpx;
					box-shadow: 0 0 60rpx 0 rgba(102, 102, 102, 0.15);
					padding: 40rpx;
					font-size: 28rpx;
					color: rgba(51, 51, 51, 1);
					overflow: hidden;

					.title {
						font-weight: bold;
						padding-bottom: 36rpx;
						border-bottom: 2rpx solid rgba(221, 221, 221, 1);
						margin-bottom: 36rpx;
					}
				}
			}
		}

		.footer_content {
			width: 100%;
			padding: 0 32rpx;
			position: fixed;
			bottom: 40rpx;
			left: 0;
		}
	}
</style>