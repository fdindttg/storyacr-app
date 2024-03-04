<!--
 * @Description:
 * @Author: FYT1996
 * @Date: 2023-08-16 09:20:04
 * @LastEditor: FYT1996
 * @LastEditTime: 2023-12-06 14:47:24
 * @Copyright: by 南阳迈特网络科技有限公司 禁止任何形式（包含二次开发）转售系统源码，违者必究。
-->


<template>
	<view class="page_content">
		<view class="head_content">
			<CustomNavbar :title="$t('navbar.poster')"></CustomNavbar>
		</view>
		<view class="main_content" :style="{ background: backgroundColor }">
			<view class="poster share_canvas" id="pagePoster" :msg="qrcodeDrawFinish" :change:msg="canvasImage.logicToView">
				<img class="image draw_canvas" :src="posterBackground" mode="widthFix" data-mode="widthFix" data-type="image" :data-url="posterBackground" data-base64="1" @load="loadImg('posterBackground')"></img>
				<img class="qrcode draw_canvas" :src="posterQrcode" mode="aspectFill" data-mode="aspectFill" data-type="image" :data-url="posterQrcode" data-base64="1" @load="loadImg('posterQrcode')"></img>
			</view>
			
			<view class="poster1">
				<image class="preview_img" :src="posterImg" mode="widthFix" show-menu-by-longpress></image>
			</view>
			
			<!-- #ifndef MP-WEIXIN -->
			<tki-qrcode ref="inviteQrcode" cid="invite-qrcode" :val="qrcodeValue" :size="260" :show="false" :loadMake="true" :showLoading="false" @result="qrcodeResult" />
			<canvas class="canvas_style" canvas-id="myCanvas" :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }"></canvas>
			<!-- #endif -->
			
			<view class="rule_box" v-if="qrcodeDrawFinish">
				<view class="info">
					<view class="title">{{ $t('poster.invite') }}</view>
					<view class="msg">
						{{ $t('poster.desc1') }}<br>
						{{ $t('poster.desc2') }}
					</view>
				</view>
				<view class="button" :style="'background:' + global.isColor">{{ $t('poster.save') }}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { pathToBase64, base64ToPath } from 'image-tools'
	
	// #ifndef MP-WEIXIN
	import tkiQrcode from "@/components/tki-qrcode/tki-qrcode.vue"
	// #endif
	
	import { mapState, mapGetters, mapMutations, mapActions } from "vuex"
	export default {
		components: {
			// #ifndef MP-WEIXIN
			tkiQrcode
			// #endif
		},
		data() {
			return {
				global: getApp().globalData,
				posterBackground: '', // 海报背景图片
				backgroundColor: '', // 背景颜色
				
				posterImg: '', // 海报图片
				canvasWidth: 0, // 画布宽度
				canvasHeight: 0, // 画布高度
				
				qrcodeValue: '', // 二维码参数
				posterQrcode: '', // 二维码图片
				qrcodeDrawFinish: false, // 二维码绘制完成
				imageLoadFinish: [], // 已加载图片数组
				UID: this.$store.state.user.uid || 0,
			}
		},
		computed: {
			...mapGetters('user', ["uid"]),
			...mapGetters('app', ["config"]),
		},
		watch: {
			uid(newValue, oldValue) {
				this.UID = newValue
				this.shareLink()
			}
		},
		onLoad() {
			uni.showLoading({
				// title: '加载中...',
				mask: true
			})
			
			this.initData()
		},
		onReady() {
			
		},
		methods: {
			// 初始化数据
			initData() {
				const bgimg = this.config?.share?.user_poster_bg || '/pages/user/static/poster.png'
				this.backgroundColor = this.config?.share?.user_poster_bg_color
				
				this.turnBase64Image(bgimg, 'posterBackground')
				
				// #ifndef MP-WEIXIN
				this.shareLink()
				// #endif
			},
			// 分享链接
			shareLink() {
				// #ifdef H5
				if(this.UID) {
					const spm = this.UID + '.1.0.1.2'
					this.qrcodeValue = window.location.origin + window.location.pathname + `?${this.$SIGN}#/pages/home/index?scene=${spm}`
				}
				// #endif
				
				// #ifdef APP-PLUS
				if(this.UID && this.config?.system?.h5) {
					const spm = this.UID + '.1.0.2.2'
					this.qrcodeValue = this.config.system.h5 + `?${this.$SIGN}#/pages/home/index?scene=${spm}`
				}
				// #endif
			},
			// 图片加载完成
			loadImg(id) {
				this.imageLoadFinish.push(id)
				if(this.imageLoadFinish.length === 2) {
					this.qrcodeDrawFinish = true
				}
			},
			// 获取二维码
			qrcodeResult(img) {
				img && this.turnBase64Image(img, 'posterQrcode')
			},
			// 将图片转为base64位url
			turnBase64Image(img, key) {
				uni.getImageInfo({
					src: img,
					success: image => {
						pathToBase64(image.path)
							.then(base64 => {
								this[key] = base64;
							})
							.catch(error => {
								console.log('base 64 error: ', error);
							});
					},
					fail: err => {
						console.log('getImageInfo error: ', err);
					}
				});
			},
			// 获取生成的base64图片路径
			receiveRenderData(val) {
				const url = val.replace(/[\r\n]/g, ''); // 去除base64位中的空格
				this.posterImg = url
			},
			// 显示loading
			_showLoading(str) {
				uni.showLoading({
					// title: str
				});
			},
			// 隐藏loading
			_hideLoading() {
				uni.hideLoading();
			},
			// 报错alert
			_errAlert(content) {
				uni.showModal({
					title: this.$t('modal.system'),
					content: content,
					cancelText: this.$t('text.cancel'),
					confirmText: this.$t('text.confirm'),
				});
			},
		}
	}
</script>
<script lang="renderjs" module="canvasImage">
	import html2canvas from 'html2canvas'
	export default {
		data() {
			return {
				isCanDraw: true
			}
		},
		methods: {
			// 生成图片需要调用的方法
			generateImage() {
				const ownerFun = this.$ownerInstance
				ownerFun.callMethod('_showLoading', '') // 生成图片的 loading 提示
				const timer = setTimeout(() => {
					const dom = document.getElementById('pagePoster') // 需要生成图片内容的 dom 节点
					html2canvas(dom, {
						width: dom.clientWidth, //dom 原始宽度
						height: dom.clientHeight - 6,
						scrollY: 0, // html2canvas默认绘制视图内的页面，需要把scrollY，scrollX设置为0
						scrollX: 0,
						useCORS: true, //支持跨域
						scale: 3, // 设置生成图片的像素比例，默认是1，如果生成的图片模糊的话可以开启该配置项
					}).then(canvas => {
						// 生成成功, html2canvas 生成成功的图片链接需要转成 base64位的url
						ownerFun.callMethod('receiveRenderData', canvas.toDataURL('image/png'))
						// 关闭加载提示框
						ownerFun.callMethod('_hideLoading')
					}).catch(err => {
						// 生成失败 弹出提示弹窗
						ownerFun.callMethod('_errAlert', `${err}`)
						// 关闭加载提示框
						ownerFun.callMethod('_hideLoading')
					})
					clearTimeout(timer)
				}, 300)
			},
			// 接收逻辑层信息
			logicToView(newValue, oldValue) {
				if(newValue === true && this.isCanDraw === true) {
					this.isCanDraw = false
					this.generateImage()
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page_content {
		.main_content {
			flex: auto;
			overflow-y: auto;
			background: #6A62D1;
			position: relative;
			padding-bottom: 60rpx;

			.poster {
				position: relative;
				
				.image {
					width: 100%;
				}

				.qrcode {
					position: absolute;
					bottom: 108rpx;
					left: 66rpx;
					width: 140rpx;
					height: 140rpx;
				}
			}

			.poster1 {
				position: absolute;
				top: 0;
				left: 0;
				z-index: 1;
				width: 100%;

				.preview_img {
					width: 100%;
				}
			}

			.rule_box {
				padding: 0 36rpx;

				.info {
					border: 4rpx solid #000;
					padding: 20rpx 30rpx;
					background: #fff;
					color: #000;
					
					.title {
						font-size: 28rpx;
						margin-bottom: 10rpx;
					}
					
					.msg {
						font-size: 24rpx;
						line-height: 40rpx;
					}
				}
				
				.button {
					width: 100%;
					height: 80rpx;
					line-height: 80rpx;
					color: #fff;
					font-size: 32rpx;
					background: #DF9B45;
					border-radius: 16rpx;
					text-align: center;
					margin-top: -24rpx;
				}
			}

			.canvas_style {
				position: fixed;
				top: -999999999rpx;
				left: 0;
			}
		}
	}
</style>