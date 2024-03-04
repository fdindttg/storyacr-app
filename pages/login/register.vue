<!--
 * @Description:
 * @Author: FYT1996
 * @Date: 2023-08-16 09:18:16
 * @LastEditor: FYT1996
 * @LastEditTime: 2023-12-06 18:22:07
 * @Copyright: by 南阳迈特网络科技有限公司 禁止任何形式（包含二次开发）转售系统源码，违者必究。
-->


<template>
	<view class="page_content">
		<view class="head_content">
			<CustomNavbar :title="$t('navbar.register')"></CustomNavbar>
		</view>
		<view class="main_content">
			<view class="logo">
				<image class="image" :src="config.system.company" mode="widthFix"></image>
			</view>
			<view class="input_box">
				<view class="type" v-if="config.system.mobile_switch == 1">
					<view class="item" :class="{ active: login.type3 == 1 }" @click="login.type3 = 1">{{ $t('text.email') }}</view>
					<view class="item" :class="{ active: login.type3 == 2 }" @click="login.type3 = 2">{{ $t('text.mobile') }}</view>
				</view>
				<u-form ref="uForm" :model="form" :rules="rules">
					<u-form-item prop="email" v-if="login.type3 == 1">
						<view class="input email">
							<u-input v-model="form.email" type="text" clearable :placeholder="$t('text.input.email')"></u-input>
						</view>
					</u-form-item>
					<u-form-item prop="mobile" v-else>
						<view class="input mobile">
							<view class="area" @click="isAreaShow = true">
								<view class="tlabel">
									<view class="text1">{{ $t('text.countrycode') }}</view>
									<view class="text2" v-if="form.area">+{{ form.area }}</view>
								</view>
								<u-icon name="arrow-down-fill" color="#ccc" size="12"></u-icon>
							</view>
							<u-input v-model="form.mobile" type="number" clearable :placeholder="$t('text.input.mobile')"></u-input>
						</view>
					</u-form-item>
					
					<u-form-item prop="code">
						<view class="input">
							<u-input v-model="form.code" type="number" clearable :placeholder="$t('text.input.captcha')">
								<template slot="suffix">
									<u-code
										ref="uCode" uniqueKey="register-code" :keepRunning="true" seconds="60"
										:startText="$t('text.getcode')" changeText="Xs" :endText="$t('text.recode')"
										@change="codeChange">
									</u-code>
									<view class="codebtn" @click="getCode">{{ login.codeTips }}</view>
								</template>
							</u-input>
						</view>
					</u-form-item>
					<u-form-item prop="registerPassword">
						<view class="input">
							<u-input v-model="form.registerPassword" type="password" clearable :placeholder="$t('register.input.password')"></u-input>
						</view>
					</u-form-item>
					<u-form-item prop="againPassword">
						<view class="input">
							<u-input v-model="form.againPassword" type="password" clearable :placeholder="$t('register.input.again')"></u-input>
						</view>
					</u-form-item>
				</u-form>
			</view>
			<view class="button_box">
				<u-button :text="$t('text.register')" :loading="buttonLoading" :customStyle="buttonStyle" @click="submitHandle" />
			</view>
			<view class="check_box">
				<u-checkbox-group @change="labelChange">
					<u-checkbox :name="true" :label="$t('login.agree')" labelSize="28rpx" labelColor="#333"></u-checkbox>
				</u-checkbox-group>
				<text class="text" @click="agreementClick(1, $t('login.user'))"> {{ $t('login.user') }}</text>
				<text class="text" @click="agreementClick(2, $t('login.privacy'))"> {{ $t('login.privacy') }}</text>
			</view>
			<view class="text_info">
				<text class="text" @click="redirectPath">{{ $t('login.login') }}</text>
			</view>
			<CustomAreaCode :show="isAreaShow" @close="isAreaShow = false" @code="form.area = $event" />
		</view>
	</view>
</template>

<script>
	import CustomAreaCode from '@/components/CustomAreaCode.vue'
	import { mapState, mapGetters, mapMutations, mapActions } from "vuex"
	export default {
		components: {
			CustomAreaCode
		},
		data() {
			return {
				buttonStyle: {
					width: '100%',
					height: '100rpx',
					border: 'none',
					fontSize: '28rpx',
					color: '#fff',
					background: '#EE7F33',
					borderRadius: '20rpx',
					margin: '0',
					fontWeight: 'bold'
				},
				buttonLoading: false,
				login: {
					codeTips: '', // 验证码提示文字
					checked: false, // 协议勾选
					platform: this.$utils.platforms(), // 平台(H5 / App)
					type3: 1, // 1(邮箱) / 2(手机号)
				},
				form: {
					email: '', // 邮箱
					area: '', // 手机区号
					mobile: '', // 手机号
					code: '', // 验证码
					registerPassword: '', // 密码
					againPassword: '', // 确认密码
				},
				rules: {},
				isAreaShow: false,
			}
		},
		computed: {
			...mapGetters('app', ['config', "share"])
		},
		onLoad() {
			this.formRuleAssign()
		},
		onReady() {
			// this.$nextTick(() => {
			// 	this.$refs.uForm.setRules(this.rules)
			// })
		},
		methods: {
			...mapActions('user', ['getUserInfo']),
			// 表单规则赋值
			formRuleAssign() {
				const rule = {
					email: [
						{ required: true, message: this.$t('text.input.email'), trigger: ['blur', 'change'] },
						{
							validator: (rule, value, callback) => {
								return uni.$u.test.email(value)
							},
							message: this.$t('text.format.email'),
							trigger: ['change','blur'],
						}
					],
					mobile: [
						{ required: true, message: this.$t('text.input.mobile'), trigger: ['blur', 'change'] },
					],
					code: [
						{ required: true, message: this.$t('text.input.captcha'), trigger: ['blur', 'change'] },
						{ min: 4, max: 6, message: this.$t('text.format.captcha'), trigger: ['blur', 'change'] }
					],
					registerPassword: [
						{ required: true, message: this.$t('register.input.password'), trigger: ['blur', 'change'] },
						{ min: 6, max: 20, message: this.$t('text.format.password'), trigger: ['blur', 'change'] },
						{ validator: this.$utils.checkPassword, trigger: ['change','blur'] }
					],
					againPassword: [
						{ required: true, message: this.$t('register.input.again'), trigger: ['blur', 'change'] },
						{
							validator: (rule, value, callback) => {
								this.$utils.checkAgainPassword(rule, value, callback, this.form.registerPassword)
							},
							trigger: ['change','blur'],
						}
					]
				}
				this.rules = rule
			},
			// 提交
			submitHandle() {
				if(!this.login.checked) return this.$u.toast(this.$t('toast.agree'))
				if(this.login.type3 == 2 && !this.form.area) return this.$u.toast(this.$t('text.select.countrycode'))
				this.$refs.uForm.validateField([this.login.type3 == 1 ? 'email' : 'mobile', 'code', 'registerPassword', 'againPassword'], errors => {
					if(!errors.length) {
						const obj = {
							account: this.login.type3 == 1 ? this.form.email : this.form.mobile,
							captcha: this.form.code,
							password: this.form.againPassword,
							nation_code: this.login.type3 == 2 ? this.form.area : "",
							platform: this.login.platform,
							spm: this.share.spm || ''
						}
						this.registerAccount(obj)
					}
				})
			},
			// 1.注册账号
			registerAccount(obj) {
				this.$request('login.codeLogin', obj).then(res => {
					if(res.code === 1) {
						this.$u.toast(this.$t('toast.register.success'))
						this.getUserInfo(res.data.token)
						this.redirectPath(2)
					}
				})
			},
			// 重定向页面
			redirectPath(count = 1) {
				const page = getCurrentPages()[0];
				if(page.route.indexOf('pages/login/register') == -1) {
					uni.navigateBack({
						delta: Number(count)
					})
				} else {
					uni.switchTab({
						url: '/pages/home/index'
					});
				}
			},
			// 协议勾选
			labelChange(detail) {
				this.login.checked = detail[0] ? detail[0] : false
			},
			// 验证码倒计时
			codeChange(text) {
				this.login.codeTips = text;
			},
			// 获取验证码
			getCode() {
				if(this.login.type3 == 1) {
					if(!this.form.email) return this.$u.toast(this.$t('text.input.email'))
					if(!this.$u.test.email(this.form.email)) return this.$u.toast(this.$t('text.format.email'))
				} else {
					if(!this.form.area) return this.$u.toast(this.$t('text.select.countrycode'))
					if(!this.form.mobile) return this.$u.toast(this.$t('text.input.mobile'))
				}
				
				const obj = {
					account: this.login.type3 == 1 ? this.form.email : this.form.mobile,
					nation_code: this.login.type3 == 2 ? this.form.area : "",
					event: "mobilelogin"
				}
				
				if (this.$refs.uCode.canGetCode) {
					uni.showLoading({
						// title: '正在获取验证码'
					})
					this.$request('login.sendCode', obj, false).then(res => {
						if(res.code === 1) {
							uni.hideLoading();
							uni.$u.toast(this.$t('text.captcha.send'));
							this.$refs.uCode.start();
						} else {
							uni.hideLoading();
							uni.$u.toast(res.msg);
						}
					}).catch(err => {
						uni.hideLoading();
						uni.$u.toast(this.$t('text.captcha.error'));
					})
				} else {
					uni.$u.toast(this.$t('text.captcha.resend'));
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.main_content {
		padding: 60rpx;
		overflow-y: auto;
		
		.logo {
			width: 100%;
			padding: 40rpx 100rpx 100rpx 100rpx;
			
			.image {
				width: 100%;
			}
		}
		
		.input_box {
			position: relative;
			
			::v-deep .u-form {
				.u-form-item__body {
					padding: 0 0 40rpx 0 !important;
				}
				
				.u-form-item__body__right__message {
					margin-left: 0 !important;
					line-height: 1.5em;
					font-size: 28rpx;
					padding: 0 10rpx 20rpx 10rpx;
				}
			}
			
			.type {
				position: absolute;
				top: 0;
				left: 0;
				transform: translateY(calc(-100% - 10rpx));
				display: flex;
				align-items: center;
				
				.item {
					padding: 10rpx 20rpx;
					background: #999;
					color: #fff;
					font-size: 28rpx;
					
					&.active {
						background: #EE7F33;
					}
					
					&:first-child {
						border-radius: 16rpx 0 0 16rpx;
					}
					
					&:last-child {
						border-radius: 0 16rpx 16rpx 0;
					}
				}
			}
			
			.input {
				width: 100%;
				background: #F7F8F9;
				border-radius: 16rpx;
				
				::v-deep .u-input {
					height: 100rpx;
					// background: #F7F8F9;
					// border-radius: 16rpx;
					border: none;
					padding: 12rpx 24rpx !important;
				}
				
				.codebtn {
					font-size: 28rpx;
					color: #333;
				}
				
				&.email {
					
				}
				
				&.mobile {
					display: flex;
					align-items: center;
					
					.area {
						display: flex;
						align-items: center;
						padding-left: 24rpx;
						
						.tlabel {
							margin-right: 12rpx;
							
							.text1 {
								font-size: 24rpx;
								color: #999;
							}
							
							.text2 {
								font-size: 28rpx;
								margin-top: 4rpx;
							}
						}
					}
				}
			}
		}
		
		.button_box {
			margin: 40rpx 0;
		}
		
		.check_box {
			display: flex;
			align-items: center;
			font-size: 28rpx;
			flex-wrap: wrap;
			
			.text {
				color: #583EF2;
			}
		}
		
		.text_info {
			margin-top: 60rpx;
			text-align: center;
			
			.text {
				color: #626262;
				font-size: 28rpx;
			}
		}
	}
</style>
