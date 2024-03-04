<!--
 * @Description:
 * @Author: FYT1996
 * @Date: 2023-08-16 09:21:26
 * @LastEditor: FYT1996
 * @LastEditTime: 2023-12-08 15:53:31
 * @Copyright: by 南阳迈特网络科技有限公司 禁止任何形式（包含二次开发）转售系统源码，违者必究。
-->


<template>
	<view class="page_content">
		<view class="head_content" v-if="!isDrag">
			<CustomNavbar color="#fff"></CustomNavbar>
		</view>
		<view class="vmask" v-if="isNeedToPay">
			<image class="bg" :src="videoInfo.cover" mode="aspectFill"></image>
			<view class="centerinfo">
				<view class="text">{{ $t('play.paid') }}</view>
				<view class="btn" :style="'background:' + global.isColor" @click="beforePlay">{{ $t('play.unlock') }}</view>
			</view>
			<view class="infobox">
				<view class="content">
					<view class="left">
						<text class="text1">{{ videoInfo.title }}</text>
						<text class="text2">{{ videoData[videoIndex].name }}</text>
					</view>
					<view class="right" :style="'color:' + global.isColor" @click="isShowMenu = true">{{ $t('play.select') }}</view>
				</view>
			</view>
		</view>
		<view class="vmask" v-if="isLastPage">
			<image class="bg" :src="videoInfo.cover" mode="aspectFill"></image>
			<view class="centerinfo">
				<view class="text">{{ $t('play.last') }} <br> {{ $t('play.unlocked', lockCount) }}</view>
				<view class="btn" @click="changeOriginIndex(lockCount)">{{ $t('play.next') }}</view>
			</view>
			<view class="infobox">
				<view class="content">
					<view class="left">
						<text class="text1">{{ videoInfo.title }}</text>
						<text class="text2">{{ videoData[videoIndex].name }}</text>
					</view>
					<view class="right" @click="isShowMenu = true">{{ $t('play.select') }}</view>
				</view>
			</view>
		</view>
		<view class="main_content" :style="[{ paddingTop: barHeight + 'px' }]">
			<swiper class="swiper" :circular="circular" :vertical="true" :duration="300" :current="current" @change="swiperChange">
				<block v-for="(item, index) in videoData" :key="index">
					<swiper-item class="swiper_item">
						<view class="videos" v-if="videoIndex == index" @click="videoClick">
							<video class="video" v-if="!isNeedToPay" :id="'vplayer' + index" :ref="'vplayer' + index"
								:loop="false" :controls="false" :autoplay="false" :object-fit="isLandscape ? 'contain' : 'cover'"
								:enable-progress-gesture="true" :show-center-play-btn="false" :src="item.url" :poster="item.image"
								@play="isPlaying = true, isPlayError = false" @pause="isPlaying = false" @timeupdate="videoTimeUpdate"
								@ended="videoEnded" @error="videoError" @loadedmetadata="videoLoadedmetadata">
							</video>
							<view class="verror" v-if="isPlayError">
								<image class="image" :src="videoInfo.cover" mode="aspectFill"></image>
								<view class="content">
									<u-icon name="info-circle-fill" color="#fff" size="50"></u-icon>
									<text class="text">{{ $t('video.error') }}</text>
								</view>
							</view>
						</view>
						<view class="vcover" v-else>
							<image class="image" :src="videoInfo.cover" mode="aspectFill"></image>
						</view>
						<view class="buttons" v-if="!isDrag && !isNeedToPay && !isPlayError && videoIndex == index">
							<u-icon v-if="!isPlaying" name="play-right-fill" color="rgba(255, 255, 255, 0.8)" :size="60"></u-icon>
						</view>
						<view class="sidebar" v-if="!isDrag && !isNeedToPay && !isPlayError && videoIndex == index">
							<view class="item" @click="handleLikes(item.id, index)">
								<image class="image" :src="`https://img.nymaite.com/video_short/icons/likes_${item.is_like ? 1 : 0 }.png`" mode="widthFix"></image>
								<text class="text" :class="{ active: item.is_like }">{{ item.likes }}</text>
							</view>
							<view class="item" @click="handleCollect">
								<u-icon name="star-fill" :color="videoInfo.isCollect ? '#E17B37' : '#F5F5F5'" size="32"></u-icon>
								<text class="text" :class="{ active: videoInfo.isCollect }">{{ videoInfo.collect }}</text>
							</view>
						</view>
						<view class="progress" v-if="!isNeedToPay && duration > 0 && videoIndex == index">
							<view class="bartext" v-if="isDrag">
								<text class="text1">{{ dragStarTime }}</text>
								<text class="text0">/</text>
								<text class="text2">{{ dragEndTime }}</text>
							</view>
							<view class="barview" :class="{ active: isDrag }">
								<slider :value="currentTime" :min="0" :max="duration"
									:blockSize="6" backgroundColor="#333" activeColor="#fff"
									@change="sliderChange" @changing="sliderChanging">
								</slider>
							</view>
						</view>
					</swiper-item>
				</block>
			</swiper>
			<view class="infobox" v-if="!isDrag && !isNeedToPay && videoData.length">
				<view class="content">
					<view class="left">
						<text class="text1">{{ videoInfo.title }}</text>
						<text class="text2">{{ originData[originIndex].name }}</text>
					</view>
					<view class="right" :style="'color:' + global.isColor" @click="isShowMenu = true">{{ $t('play.select') }}</view>
				</view>
			</view>
			<VideoMenu
				:show="isShowMenu" :info="{ title: videoInfo.title, length: videoInfo.length }" :data="originData" :current="originIndex"
				@selected="changeOriginIndex" @close="isShowMenu = false" @showpay="isShowPay = true">
			</VideoMenu>
			<VideoPay :show="isShowPay" :price="currentPrice" :ad="isLoaded" @close="isShowPay = false"></VideoPay>
		</view>
		<view class="footer_content">
			<u-safe-bottom></u-safe-bottom>
		</view>
		<u-notify ref="uNotify"></u-notify>
	</view>
</template>

<script>
	import VideoMenu from './components/VideoMenu.vue'
	import VideoPay from './components/VideoPay.vue'
	import { mapState, mapGetters, mapMutations, mapActions } from "vuex"
	export default {
		components: { VideoMenu, VideoPay },
		data() {
			return {
				global: getApp().globalData,
				
				current: 0,
				currentTime: 0, // 当前视频播放进度
				currentPrice: 0, // 当前视频积分
				prevTime: 0, // 上次视频进度
				
				duration: 0, // 当前视频总时长
				isDrag: false, // 拖动进度条状态
				dragStarTime: "00:00", // 拖拽开始时长
				dragEndTime: "00:00", // 拖拽结束时长
				
				isPlaying: false, // 播放状态
				isPlayError: false, // 播放错误
				
				clickNum: 0, // 点击次数
				clickTimer: null, // 点击定时器

				isShowMenu: false, // 显示菜单
				isShowPay: false, // 显示支付
				
				isNeedToPay: false, // 需要支付
				isLoading: true, // 加载中
				barHeight: uni.getSystemInfoSync().statusBarHeight,
				isLastPage: false, // 最后一页

				originData: [], // 源数据
				originIndex: 0, // 源数据索引
				oldIndex: 0, // 源数据上一次索引
				circular: true, // swiper首尾循环
				
				videoInfo: { id: '', title: '', cover: '', length: '', collect: 0, isCollect: 0, share: 0 },
				videoData: [], // 渲染数据
				videoIndex: 0, // 渲染数据索引

				isLandscape: false, // 是否横屏
				
				videoAd: null,
				isLoaded: false
			}
		},
		computed: {
			...mapGetters("user", ["token", "userInfo", "showAd"]),
			...mapGetters("app", ["config"]),
			lockCount() {
				const count = this.originData.findIndex(item => !item.url)
				return count
			}
		},
		watch: {
			// 付费
			isNeedToPay(newValue, oldValue) {
				if(newValue) {
					this.isShowPay = true
				}
			}
		},
		onLoad(option) {
			if(option.id) (this.videoInfo.id = option.id), this.getVideoMenu()
		},
		onUnload() {
			this.saveVideoProgress()
		},
		onHide() {
			this.saveVideoProgress()
		},
		methods: {
			// 保存视频进度
			saveVideoProgress() {
				if(!this.token) return
				if(!this.isNeedToPay) {
					const obj = {
						vid: this.videoInfo.id,
						episode_id: this.videoData[this.videoIndex].id,
						type: 'log',
						view_time: this.currentTime
					}
					this.$request('video.addRecord', obj, false)
				}
			},
			// 选集
			changeOriginIndex(index) {
				this.originIndex = index
				this.initSwiperData(index)
			},
			// 获取节目单
			getVideoMenu() {
				this.$request('video.menu', { id: this.videoInfo.id }).then(res => {
					if(res.code === 1) {
						this.videoInfo.title = res.data.title
						this.videoInfo.cover = res.data.image
						this.videoInfo.length = res.data.episodes
						this.videoInfo.collect = res.data.favorites
						this.videoInfo.isCollect = res.data.is_favorite
						this.videoInfo.share = res.data.shares
						
						if(res.data.episodes_list && res.data.episodes_list.length) {
							this.prevTime = res.data.view_time
							
							const index = res.data.episode_id ? res.data.episodes_list.findIndex(item => item.id == res.data.episode_id) : 0
							this.originIndex = index != -1 ? index : 0
							this.originData = res.data.episodes_list
							
							this.initSwiperData(this.originIndex, 1)
						}
					}
				})
			},
			// 初始化swiper数据
			initSwiperData(originIndex = this.originIndex, init = 0) {
				const originDataLength = this.originData.length;
				const videoList = [];
				videoList[this.videoIndex] = this.originData[originIndex];
				videoList[this.videoIndex - 1 == -1 ? 2 : this.videoIndex - 1] = this.originData[originIndex - 1 == -1 ? originDataLength - 1 : originIndex - 1];
				videoList[this.videoIndex + 1 == 3 ? 0 : this.videoIndex + 1] = this.originData[originIndex + 1 == originDataLength ? 0 : originIndex + 1];
				this.videoData = videoList;
				
				if (this.oldIndex >= this.originData.length) {
					this.oldIndex = 0
				}
				if (this.oldIndex < 0) {
					this.oldIndex = this.originData.length - 1
				}
				
				// 重置进度条状态
				this.duration = 0
				this.currentTime = 0
				this.isDrag = false
				this.isPlayError = false
				this.isLastPage = false
				// 本集价格
				this.currentPrice = Number(this.videoData[this.videoIndex].price)
				// 播放授权
				if(this.videoData[this.videoIndex].url) {
					// #ifdef H5
					const ua = window.navigator.userAgent.toLowerCase();
					if (ua.match(/MicroMessenger/i) == 'micromessenger' && uni.getSystemInfoSync().platform == 'ios') {
						WeixinJSBridge.invoke('getNetworkType', {}, (e) => {
						    this.videoPlay()
						})
					} else {
						const timer = setTimeout(() => {
							this.videoPlay()
							clearTimeout(timer)
						}, 500)
					}
					// #endif
					this.isNeedToPay = false
					this.saveVideoProgress()
				} else {
					// #ifdef H5
					if(this.originIndex == this.originData.length - 1 && this.originIndex != this.originData.findIndex(item => !item.url)) {
						this.isLastPage = true
					} else {
						this.beforePlay(init)
					}
					// #endif
				}
			},
			// swiper切换
			swiperChange(event) {
				const { current } = event.detail;
				const originDataLength = this.originData.length;
				if (this.videoIndex - current == 2 || this.videoIndex - current == -1) {
					this.originIndex = this.originIndex + 1 == originDataLength ? 0 : this.originIndex + 1;
					this.videoIndex = this.videoIndex + 1 == 3 ? 0 : this.videoIndex + 1;
					this.oldIndex = this.originIndex - 1
					this.initSwiperData(this.originIndex);
				} else if (this.videoIndex - current == -2 || this.videoIndex - current == 1) {
					this.originIndex = this.originIndex - 1 == -1 ? originDataLength - 1 : this.originIndex - 1;
					this.videoIndex = this.videoIndex - 1 == -1 ? 2 : this.videoIndex - 1;
					this.oldIndex = this.originIndex + 1
					this.initSwiperData(this.originIndex);
				}
			},
			// 播放之前
			beforePlay(init = 0) {
				const obj = {
					vid: this.videoInfo.id,
					episode_id: this.videoData[this.videoIndex].id,
					platform: this.$utils.platforms()
				}
				
				this.$request('video.play', obj).then(res => {
					if(res.code === 1) {
						this.videoData[this.videoIndex].url = res.data.url
						this.isNeedToPay = false
						this.isShowPay = false
						// #ifdef H5
						const ua = window.navigator.userAgent.toLowerCase();
						if (ua.match(/MicroMessenger/i) == 'micromessenger' && uni.getSystemInfoSync().platform == 'ios') {
							WeixinJSBridge.invoke('getNetworkType', {}, (e) => {
							    this.videoPlay()
							})
						} else {
							const timer = setTimeout(() => {
								this.videoPlay()
								clearTimeout(timer)
							}, 500)
						}
						// #endif
					} else {
						this.isNeedToPay = true
						this.isShowPay = true
					}
				})
			},
			// 播放
			videoPlay() {
				const video = this.getVideoCtx()
				if(!video) return
				video.play()
				// this.isPlaying = true
			},
			// 暂停
			videoPause() {
				const video = this.getVideoCtx()
				if(!video) return
				video.pause()
				// this.isPlaying = false
			},
			// 播放结束
			videoEnded(e) {
				if(this.originIndex == this.originData.length - 1) {
					
				} else {
					// #ifdef H5
					if (this.videoIndex < 2) {
						this.current = this.videoIndex + 1
					} else {
						this.current = 0
					}
					// #endif
				}
			},
			// 播放错误
			videoError() {
				this.isPlayError = true
				this.isLoading = false
			},
			// 点击
			videoClick(e) {
				this.clickTimer && clearTimeout(this.clickTimer)
				this.clickNum++
				this.clickTimer = setTimeout(() => {
					if(this.clickNum >= 2) {
						// 双击
					} else {
						// 单击
						if(this.isPlaying) {
							this.videoPause()
						} else {
							this.videoPlay()
						}
					}
					this.clickNum = 0
				}, 250)
			},
			// 元数据加载完毕
			videoLoadedmetadata(e) {
				const { width, height } = e.detail
				this.isLandscape = width >= height ? true : false
			},
			// 获取video标签上下文
			getVideoCtx() {
				return uni.createVideoContext('vplayer'+ this.videoIndex, this)
			},
			// 点赞
			handleLikes(id, index) {
				const obj = {
					episode_id: id,
					type: 'like'
				}
				this.$request('video.likes', obj, false).then(res => {
					if(res.code === 1) {
						this.videoData[index].is_like = this.videoData[index].is_like == 0 ? 1 : 0
						this.videoData[index].likes = res.data.likes
					}
				})
			},
			// 收藏
			handleCollect() {
				if(this.videoInfo.isCollect == 0) {
					const obj = {
						vid: this.videoInfo.id,
						type: 'favorite'
					}
					this.$request('video.addRecord', obj, false).then(res => {
						if(res.code === 1) {
							this.videoInfo.isCollect = 1
							this.videoInfo.collect = res.data.favorites
						}
					})
				} else {
					const obj = {
						ids: this.videoInfo.id,
						type: 'favorite'
					}
					this.$request('video.deleteRecord', obj, false).then(res => {
						if(res.code === 1) {
							this.videoInfo.isCollect = 0
							this.videoInfo.collect = res.data.favorites
						}
					})
				}
			},
			// 拖拽结束
			sliderChange(e) {
				const video = this.getVideoCtx()
				if(!video) return
				// 停止拖拽
				this.isDrag = false
				// 判断一下是否大于基础时间
				if (this.duration > 0.1) {
					// 跳到指定时间点
					video.seek(e.detail.value)
					// 并调用播放
					video.play()
				}
			},
			// 正在拖拽
			sliderChanging(e) {
				// 开始拖拽
				this.isDrag = true
				// 刷新时间
				this.dragStarTime = this.$utils.formatTime(e.detail.value)
				// 总时间
				this.dragEndTime = this.$utils.formatTime(this.duration)
			},
			// 更新进度
			videoTimeUpdate(e) {
				if(this.isDrag) return
			    const { currentTime, duration } = e.detail
				// 当前进度
				this.currentTime = this.prevTime ? this.prevTime : Math.trunc(currentTime)
				this.duration = Math.trunc(duration)
				// 上次进度
				if(this.prevTime) {
					const video = this.getVideoCtx()
					if(!video) return
					video.seek(this.currentTime)
					this.prevTime = 0
				}
				// 进度文本
				this.dragStarTime = this.$utils.formatTime(this.currentTime)
				this.dragEndTime = this.$utils.formatTime(this.duration)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page_content {
		background: #000;
		position: relative;
		overflow: hidden;
		
		.ad_box {
			position: absolute;
			bottom: 180rpx;
			right: 30rpx;
			z-index: 1;
			
			.button {
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
				background: transparent;
				outline: none;
				background-image: url('https://img.nymaite.com/video_short/icons/jifen.png');
				background-size: cover;
			}
		}
		
		.head_content {
			width: 100%;
			position: absolute;
			top: 0;
			left: 0;
			z-index: 10;
		}
		
		.vmask {
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
			left: 0;
			z-index: 2;
			color: #fff;
			background: #000;
			
			&.loading {
				border-radius: 16rpx;
				overflow: hidden;
				
				.centerinfo {
					.text {
						margin-top: 20rpx;
					}
				}
			}
			
			.bg {
				width: 100%;
				height: 100%;
				opacity: 0.3;
			}
			
			.infobox {
				position: absolute;
				bottom: 130rpx;
				left: 0;
				z-index: 1;
			}
			
			.centerinfo {
				width: 100%;
				position: absolute;
				top: 40%;
				left: 0;
				text-align: center;
				padding: 0 80rpx;
				display: flex;
				flex-direction: column;
				
				.text {
					font-size: 32rpx;
					margin-bottom: 30rpx;
					line-height: 48rpx;
				}
				
				.btn {
					min-width: 300rpx;
					height: 80rpx;
					line-height: 80rpx;
					border-radius: 80rpx;
					background: #EE7F33;
					margin: 0 auto;
					padding: 0 20rpx;
					
					&:active {
						background: rgba(#EE7F33, 0.8);
					}
				}
			}
		}
		
		.infobox {
			width: 100%;
			position: absolute;
			bottom: 20rpx;
			left: 0;
			z-index: 1;
			font-size: 32rpx;
			padding: 0 40rpx;
			
			.content {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
				
				.left {
					flex: 1;
					display: flex;
					flex-direction: row;
					
					.text1 {
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
		}
		
		.main_content {
			position: relative;
			color: #fff;
			background: #000;
			padding-bottom: 130rpx;
			
			.swiper {
				width: 100%;
				height: 100%;
				background: #000;
				border-radius: 16rpx;
				overflow: hidden;
				
				.swiper_item {
					position: relative;
					color: #fff;
					
					.videos {
						width: 100%;
						height: 100%;
						position: relative;
						
						.video {
							width: 100%;
							height: 100%;
							border-radius: 16rpx;
							overflow: hidden;
							
							video {
								border-radius: 16rpx;
								overflow: hidden;
							}
						}
						
						.verror {
							width: 100%;
							height: 100%;
							background: #000;
							position: absolute;
							top: 0;
							left: 0;
							z-index: 1;
							
							.image {
								width: 100%;
								height: 100%;
								opacity: 0.3;
							}
							
							.content {
								width: 100%;
								position: absolute;
								top: 50%;
								left: 0;
								transform: translateY(-50%);
								display: flex;
								flex-direction: column;
								align-items: center;
								
								.text {
									font-size: 32rpx;
									color: #fff;
									margin-top: 40rpx;
								}
							}
						}
					}
					
					.vcover {
						width: 100%;
						height: 100%;
						
						.image {
							width: 100%;
							height: 100%;
							opacity: 0.3;
						}
					}
					
					.buttons {
						position: absolute;
						top: 50%;
						left: 50%;
						z-index: 1;
						transform: translate(-50%, -50%);
						pointer-events: none;
					}
					
					.sidebar {
						position: absolute;
						right: 30rpx;
						bottom: 200rpx;
						z-index: 1;
						
						.item {
							margin-bottom: 40rpx;
							text-align: center;
							display: flex;
							flex-direction: column;
							align-items: center;
							
							&:last-child {
								margin-bottom: 0;
							}
							
							.image {
								width: 70rpx;
								margin: 0 auto;
								opacity: 0.9;
							}
							
							.text {
								font-size: 28rpx;
								
								&.active {
									color: #EE7F33;
								}
							}
							
							.btn {
								display: block;
								background: transparent;
								color: #fff;
								box-sizing: border-box;
								font-size: 28rpx;
								line-height: 40rpx;
								
								&::after {
									display: none;
								}
							}
						}
					}
	
					.progress {
						width: 100%;
						position: absolute;
						bottom: 20rpx;
						left: 0;
						z-index: 1;
						
						uni-slider {
							margin: 0 36rpx;
						}
						
						slider {
							margin: 0 36rpx;
						}
						
						.bartext {
							display: flex;
							flex-direction: row;
							justify-content: center;
							font-size: 40rpx;
							margin-bottom: 60rpx;
							font-weight: 700;
							
							.text1 {
								
							}
							
							.text0 {
								padding: 0 8rpx;
							}
							
							.text2 {
								color: rgba(#fff, 0.5);
							}
						}
						
						.barview {
							@mixin whlt($w, $h, $l, $t) {
								width: $w !important;
								height: $h !important;
								margin-left: $l !important;
								margin-top: $t !important;
							}
							
							::v-deep .uni-slider-handle-wrapper .uni-slider-handle,
							::v-deep .wx-slider-handle-wrapper .wx-slider-handle {
								@include whlt(64rpx, 64rpx, -32rpx, -32rpx);
							}
							
							::v-deep .uni-slider-handle-wrapper,
							::v-deep .wx-slider-handle-wrapper {
								height: 4rpx;
								transition: all 0.3s;
							}
							
							::v-deep .uni-slider-handle-wrapper .uni-slider-thumb,
							::v-deep .wx-slider-handle-wrapper .wx-slider-thumb {
								@include whlt(12rpx, 12rpx, -6rpx, -6rpx);
							}
							
							&.active {
								::v-deep .uni-slider-handle-wrapper,
								::v-deep .wx-slider-handle-wrapper {
									height: 24rpx;
									transition: all 0.3s;
								}
								
								::v-deep .uni-slider-handle-wrapper .uni-slider-thumb,
								::v-deep .wx-slider-handle-wrapper .wx-slider-thumb {
									@include whlt(32rpx, 32rpx, -16rpx, -16rpx);
								}
							}
						}
					}
				}
			}
		}
		
		.footer_content {
			background: #000;
		}
	}
</style>