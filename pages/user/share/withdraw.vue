<!--
 * @Description:
 * @Author: FYT1996
 * @Date: 2023-08-16 09:20:20
 * @LastEditor: FYT1996
 * @LastEditTime: 2023-12-07 17:32:16
 * @Copyright: by 南阳迈特网络科技有限公司 禁止任何形式（包含二次开发）转售系统源码，违者必究。
-->


<template>
	<view class="page_content" :style="{ '--bgcolor': global.isBgColor }">
		<view class="head_content">
			<CustomNavbar :title="$t('navbar.withdraw')" color="#fff"></CustomNavbar>
		</view>
		<view class="main_content">
			<view class="top_card">
				<view class="line3" v-if="converMoney">
					<view class="left">{{ `${Number(userInfo.money)} ${$t('text.integral')} ≈ ${Number(converMoney)} ${params.currency}` }}</view>
					<view class="right"></view>
				</view>
				<view class="line1">
					<view class="left">{{ $t('withdraw.amount') }}</view>
					<view class="right" @click="jumpView('/pages/user/share/payee')">
						<image class="image" src="https://img.nymaite.com/video_short/icons/setting.png" mode="widthFix"></image>
						<text>{{ $t('withdraw.collection') }}</text>
					</view>
				</view>
				<view class="line2">
					<text class="text"></text>
					<input class="input" type="number" v-model="params.money" :placeholder="$t('text.input.withdraw')" placeholder-class="placeholder">
				</view>
				<view class="line3">
					<view class="left">{{ $t('withdraw.to') }}</view>
					<view class="right" :style="'color:' + global.isColor" @click="typePicker = true">{{ typeText }} > </view>
				</view>
				<view class="line3">
					<view class="left">{{ $t('withdraw.currency') }}</view>
					<view class="right" :style="'color:' + global.isColor" @click="currencyPicker = true">{{ params.currency }} > </view>
				</view>
				<view class="line4">
					<u-button :text="$t('text.confirm')" :customStyle="{ ...buttonStyle, background: global.isBgColor }" @click="withdrawHandle" />
				</view>
				<u-picker
					:show="typePicker" :columns="[types]" keyName="name"
					:cancelText="$t('text.cancel')" :confirmText="$t('text.confirm')"
					confirmColor="#EE7F33" :closeOnClickOverlay="true"
					@close="typePicker = false" @cancel="typePicker = false" @confirm="selectedType">
				</u-picker>
				<u-picker
					:show="currencyPicker" :columns="[currencys]" keyName="currency"
					:cancelText="$t('text.cancel')" :confirmText="$t('text.confirm')"
					confirmColor="#EE7F33" :closeOnClickOverlay="true"
					@close="currencyPicker = false" @cancel="currencyPicker = false" @confirm="selectedCurrency">
				</u-picker>
			</view>
			<view class="content_box">
				<view class="title">{{ $t('withdraw.record') }}</view>
				<view class="block_box">
					<scroll-view class="scroll_view" :scroll-y="true" @scrolltolower="scrollBottom">
						<view class="scroll_content">
							<view class="list_box" v-if="recordData.length">
								<view class="item" v-for="(item, index) in recordData" :key="index">
									<view class="left">
										<view class="photo">
											<image class="image" src="https://img.nymaite.com/video_short/icons/vip.png" mode="widthFix"></image>
										</view>
										<view class="info">
											<view class="text1">{{ `${Number(item.money) + Number(item.charge_money)} (${item.apply_type_text})` }}</view>
											<view class="text3">
												<text>{{ $t('withdraw.currency') }}：</text>
												<text>{{ item.currency }}</text>
											</view>
											<view class="text3">
												<text>{{ $t('withdraw.integral') }}：</text>
												<text>{{ Number(item.money) }} {{ $t('text.integral') }}</text>
											</view>
											<view class="text3">
												<text>{{ $t('withdraw.service') }}：</text>
												<text>{{ Number(item.charge_money) }} {{ $t('text.integral') }}（{{ Number(item.service_fee) * 100 }}%）</text>
											</view>
											<view class="text3">
												<text>{{ $t('withdraw.proceeds') }}：</text>
												<text>{{ item.pay_money }} {{ item.currency }}</text>
											</view>
											<view class="text2">{{ timestampToTime(item.createtime) }}</view>
										</view>
									</view>
									<view class="right">{{ item.status_text }}</view>
								</view>
							</view>
							<view class="be_empty" v-else>{{ $t('withdraw.not.record') }}</view>
						</view>
					</scroll-view>
					
					<!-- 提现信息提醒 -->
					<u-popup :show="withdrawPopup" mode="center" :round="20" :closeable="true" :closeOnClickOverlay="false" @close="withdrawPopup = false">
						<view class="withdraw_popup">
							<view class="title_box">{{ $t('withdraw.confirm') }}</view>
							<view class="text_box">
								<view class="line">
									<text class="label">{{ $t('withdraw.currency') }}：</text>
									<text>{{ params.currency }}</text>
								</view>
								<view class="line">
									<text class="label">{{ $t('withdraw.exchange') }}：</text>
									<text>1 {{ params.currency }} = {{ exObj.exchange_rate }} {{ $t('text.integral') }}</text>
								</view>
								<view class="line">
									<text class="label">{{ $t('withdraw.type') }}：</text>
									<text>{{ typeText }}</text>
								</view>
								<view class="line">
									<text class="label">{{ $t('withdraw.integral') }}：</text>
									<text>{{ exObj.money }} {{ $t('text.integral') }}</text>
								</view>
								<view class="line">
									<text class="label">{{ $t('withdraw.service') }}：</text>
									<text>{{ exObj.charge_money }} {{ $t('text.integral') }}（{{ Number(exObj.service_fee) * 100 }}%）</text>
								</view>
								<view class="line">
									<text class="label">{{ $t('withdraw.proceeds') }}：</text>
									<text>{{ exObj.pay_money }} {{ params.currency }}</text>
								</view>
							</view>
							<view class="button_box">
								<u-button :text="$t('text.cancel')" :customStyle="buttonStyleDisable" @click="withdrawPopup = false"/>
								<u-button :text="$t('text.confirm')" :customStyle="buttonStylePopup" :loading="buttonLoading" @click="withdrawConfirm" />
							</view>
						</view>
					</u-popup>
				</view>
			</view>
		</view>
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
				buttonStyleDisable: {
					width: '200rpx',
					height: '80rpx',
					border: 'none',
					fontSize: '24rpx',
					color: '#fff',
					background: '#E0E0E0',
					borderRadius: '14rpx',
					margin: '0',
					fontWeight: 'bold'
				},
				buttonStylePopup: {
					width: '200rpx',
					height: '80rpx',
					border: 'none',
					fontSize: '24rpx',
					color: '#fff',
					background: '#EE7F33',
					borderRadius: '14rpx',
					margin: '0',
					fontWeight: 'bold'
				},
				buttonLoading: false,
				types: [],
				typePicker: false,
				typeText: '',
				params: {
					type: '',
					money: '',
					currency: '',
					platform: this.$utils.platforms()
				},
				recordData: [],
				page: 1,
				currencys: [],
				currencyPicker: false,
				converMoney: 0,
				withdrawPopup: false,
				exObj: {}
			}
		},
		computed: {
			...mapGetters("user", ["userInfo"]),
			...mapGetters("app", ["lang"])
		},
		watch: {
			"userInfo.money": {
				deep: true,
				handler: function () {
					this.exchangeCurrency()
				}
			}
		},
		onLoad() {
			this.withdrawRule()
			this.recordList()
			this.getCurrencyType()
		},
		methods: {
			...mapActions('user', ['getUserInfo']),
			// 货币种类
			getCurrencyType() {
				this.$request('language.list').then(res => {
					if(res.code === 1) {
						this.currencys = res.data.map(({ currency, lang }) => ({ currency, lang }))
						const def = this.currencys.filter(item => item.lang == this.lang)[0].currency
						this.params.currency = this.currencys.filter(item => item.lang == this.lang)[0].currency
						this.exchangeCurrency()
					}
				})
			},
			// 积分转换货币
			exchangeCurrency() {
				const obj = {
					currency: this.params.currency,
					money: this.userInfo.money
				}

				this.$request('withdraw.exchange', obj).then(res => {
					if(res.code === 1) {
						this.converMoney = res.data.pay_money
					}
				})
			},
			// 提现规则
			withdrawRule() {
				this.$request('withdraw.rule').then(res => {
					if(res.code === 1) {
						// 提现类型
						this.types = res.data.methods
						this.typeText = this.types[0].name
						this.params.type = this.types[0].type
					}
				})
			},
			// 触底
			scrollBottom() {
				this.page++
				this.recordList()
			},
			// 时间戳转日期
			timestampToTime(value) {
				let date = new Date(value * 1000);
				let month = date.getMonth() + 1;
				let hours = date.getHours();
				if (hours < 10) hours = "0" + hours;
				let minutes = date.getMinutes();
				if (minutes < 10) minutes = "0" + minutes;
				let time = date.getFullYear() + "-" + month + "-" + date.getDate() + " " + hours + ":" + minutes;
				return time;
			},
			// 提现
			withdrawHandle() {
				const num = Number(this.params.money)
				if(!num) {
					this.$u.toast(this.$t('text.input.withdraw'))
					return
				}
				
				const obj = {
					currency: this.params.currency,
					pay_money: this.params.money
				}

				this.$request('withdraw.exchange', obj).then(res => {
					if(res.code === 1) {
						this.exObj = res.data
						this.withdrawPopup = true
					}
				})
			},
			// 确认提现
			withdrawConfirm() {
				const { type, currency, platform } = this.params
				const { money } = this.exObj
				const obj = { type, money, currency, platform }
				this.buttonLoading = true
				this.$request('withdraw.apply', obj).then(res => {
					if(res.code === 1) {
						this.$u.toast(res.msg)
						this.params.money = ''
						this.page = 1
						this.recordList()
						this.recordData = []
						this.getUserInfo()
					}
					this.buttonLoading = false
					this.withdrawPopup = false
				}).catch(err => {
					this.buttonLoading = false
					this.withdrawPopup = false
				})
			},
			// 提现记录
			recordList() {
				this.$request('withdraw.record', {
					page: this.page
				}).then(res => {
					if(res.code === 1) {
						if(res.data.data && res.data.data.length) {
							this.recordData = this.recordData.concat(res.data.data)
						} else {
							this.page--
						}
					}
				})
			},
			// 选择提现类型
			selectedType(e) {
				this.params.type = e.value[0].type
				this.typeText = e.value[0].name
				this.typePicker = false
			},
			// 选择提现货币
			selectedCurrency(e) {
				this.params.currency = e.value[0].currency
				this.currencyPicker = false
				this.exchangeCurrency()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page_content {
		background: #F9F9F9;
		
		&::before {
			content: "";
			width: 100%;
			height: 420rpx;
			background:var(--bgcolor);
			position: absolute;
			top: 0;
			left: 0;
		}
		
		.main_content {
			overflow: hidden;
			padding: 24rpx 40rpx 0 40rpx;
			display: flex;
			flex-direction: column;
			
			.top_card {
				position: relative;
				border-radius: 20rpx;
				background: #fff;
				padding: 40rpx;
				font-weight: 700;
				
				.line1 {
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-bottom: 20rpx;
					
					.left {
						font-size: 32rpx;
						color: #000;
					}
					
					.right {
						font-size: 24rpx;
						color: rgba(46, 46, 46, 1);
						display: flex;
						align-items: center;
						
						.image {
							width: 32rpx;
							margin-right: 20rpx;
						}
					}
				}
				
				.line2 {
					display: flex;
					align-items: center;
					padding: 20rpx 0;
					border-bottom: 2rpx solid rgba(221, 221, 221, 1);
					
					.text {
						font-size: 28rpx;
						color: rgba(102, 102, 102, 1);
					}
					
					.input {
						width: 100%;
						font-size: 28rpx;
						color: #000;
					}
				}
				
				.line3 {
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin: 40rpx 0;
					
					.left {
						font-size: 32rpx;
						color: #000;
					}
					
					.right {
						font-size: 24rpx;
						color: #FEB787;
					}
				}
				
				.line4 {
					
				}
			}
			
			.content_box {
				flex: 1;
				overflow: hidden;
				display: flex;
				flex-direction: column;
				
				.title {
					font-size: 32rpx;
					font-weight: 700;
					color: rgba(39, 45, 47, 1);
					padding: 20rpx 0;
				}
				
				.block_box {
					flex: 1;
					overflow: hidden;
					
					.scroll_view {
						height: 100%;
						
						.scroll_content {
							padding-bottom: 60rpx;
						}
					}
				}

				.list_box {
					
					.item {
						padding: 40rpx 0;
						border-bottom: 2rpx solid rgba(240, 240, 240, 1);
						display: flex;
						align-items: center;
						justify-content: space-between;
					
						.left {
							display: flex;
							align-items: center;
							
							.photo {
								width: 100rpx;
								height: 100rpx;
								border-radius: 20rpx;
								background: #fff;
								box-shadow: 0 0 60rpx 0 rgba(202, 202, 202, 0.3);
								overflow: hidden;
								display: flex;
								align-items: center;
								justify-content: center;
								
								.image {
									width: 60rpx;
								}
							}
							
							.info {
								margin-left: 40rpx;
								
								.text1 {
									font-size: 28rpx;
									font-weight: 700;
									color: #272D2F;
									margin-bottom: 12rpx;
								}
								
								.text2 {
									font-size: 24rpx;
									color: #A5ACB6;
									margin-top: 8rpx;
								}
								
								.text3 {
									font-size: 24rpx;
									color: #272D2F;
								}
							}
						}
						
						.right {
							font-size: 28rpx;
							font-weight: 700;
							color: #000;
							white-space: nowrap;
							
							&.type1 {
								color: rgba(81, 37, 105, 1);
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
			
			.withdraw_popup {
				width: 80vw;
				padding: 40rpx;
				
				.title_box {
					font-size: 32rpx;
					font-weight: 700;
					margin-bottom: 30rpx;
				}
				
				.text_box {
					.line {
						font-size: 28rpx;
						margin-top: 16rpx;
						color: #272d2f;
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
	}
</style>
