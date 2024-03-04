<!--
 * @Description:
 * @Author: FYT1996
 * @Date: 2023-08-16 09:20:04
 * @LastEditor: FYT1996
 * @LastEditTime: 2023-12-06 14:47:24
 * @Copyright: by 南阳迈特网络科技有限公司 禁止任何形式（包含二次开发）转售系统源码，违者必究。
-->


<template>
	<view class="CustomSharePoster" :class="{ show }" @click="$emit('close', false)">
		<view class="poster_content" v-if="showPoster">
			<view class="poster_box" id="pagePoster" :msg="qrcodeDrawFinish" :change:msg="canvasImage.logicToView">
				<view class="img_box" v-if="posterBackground">
					<img class="bgimg" :src="posterBackground" mode="widthFix" @load="loadImg('posterBackground')" @error="loadImg('posterBackground')"></img>
				</view>
				<!-- <view class="text_box">
					<view class="title">标题</view>
					<view class="content">这里是内容</view>
				</view> -->
				<view class="user_box">
					<view class="infos">
						<view class="avatar">
							<img class="img" :src="userInfo.avatar" mode="aspectFill"></img>
						</view>
						<view class="nickname">
							<view class="text1">{{ userInfo.nickname }}</view>
							<view class="">{{ getApp.$t('poster.text.invite') }}</view>
						</view>
					</view>
					<view class="qrcode">
						<img class="img" :src="posterQrcode" mode="aspectFill" @load="loadImg('posterQrcode')"></img>
					</view>
				</view>
			</view>
			<view class="poster_img" v-if="posterImg">
				<image class="img" :src="posterImg" mode="aspectFit" show-menu-by-longpress></image>
			</view>
		</view>
		<view class="tools_content" v-if="showPoster && posterImg">
			<!-- #ifdef H5 -->
			<view class="btn save">{{ getApp.$t('poster.save.touch') }}</view>
			<!-- #endif -->
			<!-- #ifdef APP-PLUS -->
			<view class="btn save" @click.stop="loadBase64Url">{{ getApp.$t('poster.save.album') }}</view>
			<!-- #endif -->
		</view>
		<tkiQrcode v-if="showPoster" ref="inviteQrcode" cid="invite-qrcode" :val="qrcodeValue" :size="260" :show="false" :loadMake="true" :showLoading="false" @result="qrcodeResult" />
	
		<view class="type_content" :class="{ show: show && !showPoster }" @click.stop="">
			<view class="list_box">
				<view class="item" @click.stop="showPoster = true">
					<view class="icon">
						<u-icon name="photo-fill" color="#FFBA00" size="24"></u-icon>
					</view>
					<view class="text">{{ getApp.$t('poster.generate') }}</view>
				</view>
				<view class="item" @click="copyLink">
					<view class="icon">
						<u-icon name="attach" color="#78B3FC" size="24"></u-icon>
					</view>
					<view class="text">{{ getApp.$t('poster.copy') }}</view>
				</view>
			</view>
			<view class="foot" @click="$emit('close', false)">{{ getApp.$t('text.cancel') }}</view>
		</view>
	</view>
</template>

<script>
	import { pathToBase64, base64ToPath } from 'image-tools'
	import tkiQrcode from "@/components/tki-qrcode/tki-qrcode.vue"
	import { mapState, mapGetters, mapMutations, mapActions } from "vuex"
	export default {
		name: "CustomSharePoster",
		components: { tkiQrcode },
		props: {
			show: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				getApp: getApp(),
				global: getApp().globalData,
				posterBackground: '', // 海报背景图片
				backgroundColor: '', // 背景颜色
				
				posterImg: '', // 海报图片
				
				qrcodeValue: '', // 二维码参数
				posterQrcode: '', // 二维码图片
				qrcodeDrawFinish: false, // 二维码绘制完成
				imageLoadFinish: [], // 已加载图片数组
				UID: this.$store.state.user.uid || 0,
				showPoster: false, // 海报
			}
		},
		computed: {
			...mapGetters('user', ["uid", "userInfo"]),
			...mapGetters('app', ["config"]),
		},
		watch: {
			show(newValue, oldValue) {
				if(!newValue) this.showPoster = false
			},
			uid(newValue, oldValue) {
				this.UID = newValue
				this.shareLink()
			},
			showPoster(newValue, oldValue) {
				if(newValue && !this.posterImg) {
					uni.showLoading({
						// title: '加载中...',
						mask: true
					})
					this.initData()
				}
			}
		},
		created() {
			this.shareLink()
		},
		methods: {
			// 初始化数据
			initData() {
				const bgimg = this.config?.share?.user_poster_bg || ''
				// this.backgroundColor = this.config?.share?.user_poster_bg_color
				
				if(!bgimg) return this.getApp.$u.toast(this.getApp.$t('toast.go.config')), this.$emit('close', false)
				// 判断网络图片或本地图片
				const reg = new RegExp(/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/)
				const result = reg.test(bgimg)
				if(result) {
					this.getApp.$request('common.base64', { url: bgimg }).then(res => {
						if(res.code === 1) this.turnBase64Image(res.data.image, 'posterBackground')
					})
				} else this.turnBase64Image(bgimg, 'posterBackground')
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
			// 复制链接
			copyLink() {
				uni.setClipboardData({
					data: String(this.qrcodeValue),
					success: () => {
						this.$u.toast(this.$t('toast.copy.success'))
					},
					fail: () => {
						this.$u.toast(this.$t('toast.copy.fail'))
					}
				});
				this.$emit('close', false)
			},
			// 图片加载完成
			loadImg(id) {
				this.imageLoadFinish.push(id)
				if(this.imageLoadFinish.length === 2) {
					this.imageLoadFinish = []
					this.qrcodeDrawFinish = true
				}
			},
			// 获取二维码
			qrcodeResult(img) {
				img && this.turnBase64Image(img, 'posterQrcode')
			},
			// 将base64位的图片路径转换为 临时路径
			loadBase64Url() {
				base64ToPath(this.posterImg)
					.then(path => {
						this.saveImage(path)
					})
					.catch(error => {
						console.error('path error: ', error);
					});
			},
			// 保存图片到手机相册
			saveImage(filePath) {
				uni.saveImageToPhotosAlbum({
					filePath, // 需要临时文件路径，base64无法保存
					success: () => {
						this.getApp.$u.toast(this.getApp.$t('poster.save.success'))
					},
					fail: () => {
						this.getApp.$u.toast(this.getApp.$t('poster.save.fail'))
					}
				});
				this.$emit('close', false)
			},
			// 将图片转为base64位url
			turnBase64Image(img, key) {
				const reg = /^\s*data:image\/(png|jpg|jpeg|gif);base64,.+/i
				if(reg.test(img)) {
					this[key] = img
				} else {
					uni.getImageInfo({
						src: img,
						success: image => {
							pathToBase64(image.path)
								.then(base64 => {
									this[key] = base64
								})
								.catch(error => {
									console.log('base64 error: ', error)
								})
						},
						fail: err => {
							console.log('getImageInfo error: ', err)
						}
					})
				}
			},
			// 获取生成的base64图片路径
			_receiveRenderData(val) {
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
					const canvas = document.getElementById('pagePoster') // 需要生成图片内容的 canvas 节点
					html2canvas(canvas, {
						width: canvas.clientWidth, // canvas 原始宽度
						height: canvas.clientHeight, // canvas 原始高度
						backgroundColor: 'transparent', // canvas 背景颜色
						scrollY: 0, // html2canvas默认绘制视图内的页面，需要把scrollY，scrollX设置为0
						scrollX: 0,
						useCORS: true, // 支持跨域
						scale: 3, // 设置生成图片的像素比例，默认是1，如果生成的图片模糊的话可以开启该配置项
					}).then(canvas => {
						// 生成成功, html2canvas 生成成功的图片链接需要转成 base64位的url
						ownerFun.callMethod('_receiveRenderData', canvas.toDataURL('image/png'))
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
	.CustomSharePoster {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 100;
		background: rgba(#000, 0.5);
		padding: 60rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		transition: all 0.3s;
		opacity: 0;
		pointer-events: none;
		
		&.show {
			opacity: 1;
			pointer-events: auto;
		}
		
		.type_content {
			width: 100%;
			padding-top: 30rpx;
			background: #fff;
			border-radius: 20rpx 20rpx 0 0;
			font-size: 28rpx;
			position: absolute;
			bottom: 0;
			left: 0;
			transform: translateY(100%);
			transition: all 0.3s;
			
			&.show {
				transform: translateY(0);
			}

			.list_box {
				display: flex;
				padding-bottom: 20rpx;
				
				.item {
					width: 50%;
					height: 78px;
					display: flex;
					flex-direction: column;
					align-items: center;
					
					.icon {
						width: 76rpx;
						height: 76rpx;
						border-radius: 50%;
						background: #F6F6FE;
						display: flex;
						align-items: center;
						justify-content: center;
					}
					
					.text {
						margin-top: 10rpx;
					}
				}
			}
			
			.foot {
				text-align: center;
				color: #666;
				border-top: 2rpx solid #eee;
				padding: 30rpx 0;
			}
		}
		
		.poster_content {
			height: 80%;
			overflow: hidden;
			position: relative;

			display: flex;
			flex-direction: column;
			justify-content: center;
			
			.poster_box {
				width: 100%;
				background: #fff;
				border-radius: 20rpx;
				background: linear-gradient(#EDCA86, #EDCA86, #F8EACF, #FFFFFF);
				overflow: hidden;
				
				position: fixed;
				top: -99999rpx;
				left: 0;
				
				.img_box {
					padding: 40rpx;
					
					.bgimg {
						width: 100%;
						height: auto;
						border-radius: 20rpx;
					}
				}
				
				.text_box {
					padding: 0 40rpx;
					
					.title {
						font-size: 32rpx;
						font-weight: 700;
						margin-bottom: 20rpx;
					}
					
					.content {
						font-size: 28rpx;
						white-space: pre-line;
						word-break: break-all;
						word-wrap: break-word;
					}
				}
				
				.user_box {
					padding: 40rpx;
					
					display: flex;
					align-items: center;
					justify-content: space-between;
					
					.infos {
						flex: 1;
						margin-right: 20rpx;
						display: flex;
						align-items: center;
						
						.avatar {
							width: 120rpx;
							height: 120rpx;
							border-radius: 50%;
							overflow: hidden;
							
							.img {
								width: 100%;
								height: 100%;
								border-radius: 50%;
							}
						}
						
						.nickname {
							flex: 1;
							font-size: 24rpx;
							margin-left: 20rpx;
							color: #000;
							
							.text1 {
								font-weight: 700;
								margin-bottom: 8rpx;
							}
						}
					}
					
					.qrcode {
						width: 120rpx;
						height: 120rpx;
						
						.img {
							width: 100%;
							height: 100%;
						}
					}
				}
			}
			
			.poster_img {
				width: 100%;
				height: 100%;
				
				position: absolute;
				top: 0;
				left: 0;
				z-index: 1;
				
				display: flex;
				align-items: center;
				justify-content: center;
				
				// display: none;
			
				.img {
					width: 100%;
					height: 100%;
				}
			}
		}
	
		.tools_content {
			margin-top: 60rpx;
			width: 100%;
			text-align: center;
			font-size: 28rpx;
			
			display: flex;
			align-items: center;
			justify-content: center;
			
			.btn {
				padding: 0 40rpx;
				height: 70rpx;
				line-height: 70rpx;
				border-radius: 70rpx;
			}
			
			.cancel {
				background: #fff;
				color: #000;
			}
			
			.save {
				background: #EAB665;
				color: #fff;
			}
		}
	}
</style>