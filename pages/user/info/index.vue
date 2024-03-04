<!--
 * @Description:
 * @Author: FYT1996
 * @Date: 2023-08-16 09:18:44
 * @LastEditor: FYT1996
 * @LastEditTime: 2023-12-09 09:44:49
 * @Copyright: by 南阳迈特网络科技有限公司 禁止任何形式（包含二次开发）转售系统源码，违者必究。
-->


<template>
	<view class="page_content">
		<view class="head_content">
			<CustomNavbar :title="$t('navbar.userinfo')"></CustomNavbar>
		</view>
		<view class="main_content">
			<view class="wrapper">
				<view class="label">{{ $t('text.avatar') }}</view>
				<view class="content">
					<button class="avatar" type="default" open-type="chooseAvatar" @chooseavatar="onChooseAvatar" @click="changeAvatar">
						<image class="image" :src="user.avatar" mode="aspectFill"></image>
					</button>
					<image class="arrow" src="https://img.nymaite.com/video_short/icons/arrow.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="wrapper">
				<view class="label">{{ $t('text.nickname') }}</view>
				<view class="content">
					<input class="nickname" v-model="user.nickname" type="nickname" :placeholder="$t('text.input.nickname')" placeholder-class="placeholder"/>
					<image class="arrow" src="https://img.nymaite.com/video_short/icons/arrow.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="wrapper">
				<view class="label">{{ $t('text.email') }}</view>
				<!-- <view class="content" v-if="user.email">
					<input class="mobile" :value="user.email" type="text" disabled />
				</view>
				<view class="content" v-else @click="emailPopup = true">
					<input class="mobile" type="text" :placeholder="$t('text.bind.email')" placeholder-class="placeholder" disabled style="pointer-events: none;" />
					<image class="arrow" src="https://img.nymaite.com/video_short/icons/arrow.png" mode="widthFix"></image>
				</view> -->
				
				<view class="content" @click="emailPopup = true">
					<input class="mobile" :value="user.email" type="text" :placeholder="$t('text.bind.email')" placeholder-class="placeholder" disabled style="pointer-events: none;" />
					<image class="arrow" src="https://img.nymaite.com/video_short/icons/arrow.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="wrapper">
				<view class="label">{{ $t('text.mobile') }}</view>
				<!-- <view class="content" v-if="user.mobile">
					<input class="mobile" :value="user.mobile" type="number" disabled />
				</view>
				<view class="content" v-else @click="mobilePopup = true">
					<input class="mobile" type="number" :placeholder="$t('text.bind.mobile')" placeholder-class="placeholder" disabled style="pointer-events: none;" />
					<image class="arrow" src="https://img.nymaite.com/video_short/icons/arrow.png" mode="widthFix"></image>
				</view> -->
				
				<view class="content" @click="mobilePopup = true">
					<input class="mobile" :value="user.mobile" type="number" :placeholder="$t('text.bind.mobile')" placeholder-class="placeholder" disabled style="pointer-events: none;" />
					<image class="arrow" src="https://img.nymaite.com/video_short/icons/arrow.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="wrapper">
				<view class="label">{{ $t('text.referrer') }}</view>
				<view class="content" v-if="user.parent_id">
					<input class="mobile" :value="user.parent_id" type="number" disabled />
				</view>
				<view class="content" v-else @click="referrerPopup = true">
					<input class="mobile" type="number" :placeholder="$t('text.bind.recommend')" placeholder-class="placeholder" disabled style="pointer-events: none;" />
					<image class="arrow" src="https://img.nymaite.com/video_short/icons/arrow.png" mode="widthFix"></image>
				</view>
			</view>
			<!-- 邮箱 -->
			<u-popup :show="emailPopup" :round="20" :closeable="true" :closeOnClickOverlay="true" @close="emailPopup = false">
				<view class="mobile_popup">
					<view class="input_box">
						<text class="label">{{ $t('text.email') }}</text>
						<u-input v-model="form.email" type="text" border="none" :cursorSpacing="200" clearable :placeholder="$t('text.input.email')"></u-input>
					</view>
					<view class="input_box">
						<text class="label">{{ $t('text.captcha') }}</text>
						<u-input v-model="form.code" type="number" :maxlength="6" border="none" :cursorSpacing="200" clearable :placeholder="$t('text.input.captcha')"></u-input>
						<view class="send" @click="getCode('email')">{{ codeTips }}</view>
					</view>
					<view class="button_box">
						<u-button :text="$t('text.cancel')" :customStyle="buttonStyleDisable" @click="emailPopup = false"/>
						<u-button :text="$t('text.confirm')" :customStyle="buttonStyle" @click="emailConfirm" />
					</view>
				</view>
			</u-popup>
			<!-- 手机号 -->
			<u-popup :show="mobilePopup" :round="20" :closeable="true" :closeOnClickOverlay="true" @close="mobilePopup = false">
				<view class="mobile_popup">
					<view class="input_box">
						<text class="label">{{ $t('text.mobile') }}</text>
						<view class="area" @click="isAreaShow = true">
							<view class="tlabel">
								<view class="text1">{{ $t('text.countrycode') }}</view>
								<view class="text2" v-if="form.area">+{{ form.area }}</view>
							</view>
							<u-icon name="arrow-down-fill" color="#ccc" size="12"></u-icon>
						</view>
						<u-input v-model="form.mobile" type="number" border="none" :cursorSpacing="200" clearable :placeholder="$t('text.input.mobile')"></u-input>
					</view>
					<view class="input_box">
						<text class="label">{{ $t('text.captcha') }}</text>
						<u-input v-model="form.code" type="number" :maxlength="6" border="none" :cursorSpacing="200" clearable :placeholder="$t('text.input.captcha')"></u-input>
						<view class="send" @click="getCode('mobile')">{{ codeTips }}</view>
					</view>
					<view class="button_box">
						<u-button :text="$t('text.cancel')" :customStyle="buttonStyleDisable" @click="mobilePopup = false"/>
						<u-button :text="$t('text.confirm')" :customStyle="buttonStyle" @click="mobileConfirm" />
					</view>
				</view>
			</u-popup>
			<!-- 验证码 -->
			<u-code
				ref="uCode" uniqueKey="info-code" :keepRunning="true" :seconds="60"
				:startText="$t('text.getcode')" changeText="Xs" :endText="$t('text.recode')"
				@change="codeChange">
			</u-code>
			<!-- 推荐人 -->
			<u-popup :show="referrerPopup" :round="20" :closeable="true" :closeOnClickOverlay="true" @close="referrerPopup = false">
				<view class="mobile_popup">
					<view class="input_box">
						<text class="label">{{ $t('text.referrer') }}</text>
						<u-input v-model="referrerId" type="number" border="none" :cursorSpacing="200" clearable :placeholder="$t('text.input.recommendid')"></u-input>
					</view>
					<view class="button_box">
						<u-button :text="$t('text.cancel')" :customStyle="buttonStyleDisable" @click="referrerPopup = false"/>
						<u-button :text="$t('text.confirm')" :customStyle="buttonStyle" @click="referrerConfirm" />
					</view>
				</view>
			</u-popup>
			<!-- 手机区号 -->
			<CustomAreaCode :show="isAreaShow" @close="isAreaShow = false" @code="form.area = $event" />
		</view>
	</view>
</template>

<script>
	import CustomAreaCode from '@/components/CustomAreaCode.vue'
	import api from '@/common/request/api.js'
	import { mapState, mapGetters, mapMutations, mapActions } from "vuex"
	export default {
		components: {
			CustomAreaCode
		},
		data() {
			return {
				buttonStyleDisable: {
					width: '300rpx',
					height: '80rpx',
					border: 'none',
					fontSize: '24rpx',
					color: '#fff',
					background: '#E0E0E0',
					borderRadius: '14rpx',
					margin: '0',
					fontWeight: 'bold'
				},
				buttonStyle: {
					width: '300rpx',
					height: '80rpx',
					border: 'none',
					fontSize: '24rpx',
					color: '#fff',
					background: '#EE7F33',
					borderRadius: '14rpx',
					margin: '0',
					fontWeight: 'bold'
				},
				userInfo: {},
				user: {
					avatar: '',
					nickname: '',
					mobile: '',
					parent_id: '',
					email: ''
				},
				uploadAvatar: '',
				// 推荐人
				referrerPopup: false,
				referrerId: '',
				// 手机号
				mobilePopup: false,
				emailPopup: false,
				codeTips: '', // 验证码文本
				form: {
					mobile: '', // 手机号
					code: '', // 验证码
					email: '', // 邮箱
					area: '', // 手机区号
				},
				isAreaShow: false
			}
		},
		computed: {
			...mapGetters("user", ["token"])
		},
		onLoad() {
			this.getPageData()
		},
		onUnload() {
			this.saveUserInfo()
		},
		methods: {
			...mapActions("user", ["logout", "getUserInfo"]),
			// 邮箱
			emailConfirm() {
				if(!this.form.email) return this.$u.toast(this.$t('text.input.email'))
				if(!this.$u.test.email(this.form.email)) return this.$u.toast(this.$t('text.format.email'))
				if(!this.$u.test.code(this.form.code, 6)) return this.$u.toast(this.$t('text.input.captcha'))
				
				const obj = {
					email: this.form.email,
					captcha: this.form.code
				}
				
				this.$request('login.bindEmail', obj).then(res => {
					if(res.code === 1) {
						this.$u.toast(res.msg)
						this.emailPopup = false
						this.getPageData()
					} else {
						this.emailPopup = false
					}
				}).catch(err => {
					this.emailPopup = false
				})
			},
			// 绑定手机号
			mobileConfirm() {
				if(!this.form.area) return this.$u.toast(this.$t('text.select.countrycode'))
				if(!this.form.mobile) return this.$u.toast(this.$t('text.input.mobile'))
				if(!this.$u.test.code(this.form.code, 6)) return this.$u.toast(this.$t('text.input.captcha'))
				
				const obj = {
					mobile: this.form.mobile,
					captcha: this.form.code,
					nation_code: this.form.area || ""
				}
				
				this.$request('login.bindMobile', obj).then(res => {
					if(res.code === 1) {
						this.$u.toast(res.msg)
						this.mobilePopup = false
						this.getPageData()
					} else {
						this.mobilePopup = false
					}
				}).catch(err => {
					this.mobilePopup = false
				})
			},
			// 绑定推荐人
			referrerConfirm() {
				if(!this.referrerId) return
				this.$request('dealer.superior', { id: this.referrerId, platform: this.$utils.platforms() }).then(res => {
					if(res.code === 1) {
						this.$u.toast(res.msg)
						this.referrerPopup = false
						this.getPageData()
					} else {
						this.referrerPopup = false
					}
				}).catch(err => {
					this.referrerPopup = false
				})
			},
			// 验证码倒计时
			codeChange(text) {
				this.codeTips = text;
			},
			// 获取验证码
			getCode(type) {
				if(type == 'email') {
					if(!this.form.email) return this.$u.toast(this.$t('text.input.email'))
					if(!this.$u.test.email(this.form.email)) return this.$u.toast(this.$t('text.format.email'))
				} else {
					if(!this.form.area) return this.$u.toast(this.$t('text.select.countrycode'))
					if(!this.form.mobile) return this.$u.toast(this.$t('text.input.mobile'))
				}
				
				const obj = {
					account: type == 'email' ? this.form.email : this.form.mobile,
					nation_code: type == 'mobile' ? this.form.area : '',
					event: 'changemobile'
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
			},
			// 获取页面数据
			getPageData() {
				this.getUserInfo().then(res => {
					if(res.code === 1) {
						this.userInfo = res.data
						this.user.avatar = res.data.avatar
						this.user.nickname = res.data.nickname
						this.user.mobile = res.data.mobile
						this.user.email = res.data.email
						res.data.parent_id && (this.user.parent_id = res.data.parent_id)
					}
				})
			},
			// 修改头像
			changeAvatar() {
				// #ifndef MP-WEIXIN
				uni.chooseImage({
					success: (chooseImageRes) => {
						const tempFilePaths = chooseImageRes.tempFilePaths;
						this.uploadFile(tempFilePaths[0])
					}
				})
				// #endif
			},
			// 更换头像
			onChooseAvatar(e) {
				this.uploadFile(e.detail.avatarUrl)
			},
			// 上传文件
			uploadFile(url) {
				if(!url) return
				uni.showLoading({
					// title: '上传中',
					mask: true
				})
				uni.uploadFile({
					url: this.$BASE_URL + api.common.upload.url,
					filePath: url,
					name: 'file',
					header: {
						'Token': this.token || '',
						'Sign': this.$SIGN || ''
					},
					success: file => {
						if(file.statusCode == 200) {
							const data = JSON.parse(file.data)
							if(data.code === 1) {
								this.user.avatar = data.data.fullurl
								this.uploadAvatar = data.data.url
							}
						}
						uni.hideLoading()
					},
					fail: err => {
						uni.hideLoading()
					}
				})
			},
			// 保存修改内容
			saveUserInfo() {
				const obj = {}
				if((this.userInfo.nickname != this.user.nickname) && this.user.nickname) {
					obj.nickname = this.user.nickname
				}
				if((this.userInfo.avatar != this.user.avatar) && this.uploadAvatar) {
					obj.avatar = this.uploadAvatar
				}
				if(Object.keys(obj).length === 0) return
				this.$request('user.updateInfo', obj).then(res => {
					if(res.code === 1) {
						uni.$emit('updateUserInfo', true)
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
						background: transparent;
						
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
					margin-right: 20rpx;
				}
				
				.area {
					display: flex;
					align-items: center;
					padding-right: 12rpx;
					
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
