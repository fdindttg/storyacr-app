<!--
 * @Description:
 * @Author: FYT1996
 * @Date: 2023-08-16 09:16:52
 * @LastEditor: FYT1996
 * @LastEditTime: 2023-12-07 15:22:24
 * @Copyright: by 南阳迈特网络科技有限公司 禁止任何形式（包含二次开发）转售系统源码，违者必究。
-->


<template>
	<view class="page_container">
		<view class="head_content" :style="{ marginBottom: -marginBottom + 'px' }">
			<CustomNavbar :left="0" :title="navTitle" color="#fff"></CustomNavbar>
			<view class="lang_box">
				<view class="search" @click="jumpView('/pages/video/search')">
					<u-icon name="search" color="#fff" size="28"></u-icon>
				</view>
				<view class="lang" v-if="languageList[languageIndex]" @click="isLanguage = true">
					<text class="text">{{ languageList[languageIndex].name }}</text>
					<u-icon name="arrow-right" color="#fff" size="12" :bold="true"></u-icon>
				</view>
			</view>
		</view>
		<view class="main_content">
			<view class="swiper_box">
				<swiper class="swiper" :circular="true" :indicator-dots="true" :autoplay="true">
					<swiper-item v-for="(item, index) in swiperList" :key="index" @click="swiperClick(index)">
						<view class="swiper_item">
							<image class="cover" :src="item.image" mode="aspectFill"></image>
							<view class="info">
								<image class="image" src="/static/icons/new.png" mode="widthFix"></image>
								<view class="text">{{ item.title }}</view>
							</view>
						</view>
					</swiper-item>
				</swiper>
			</view>
			<view class="hot_box">
				<view class="content">
					<view class="c_head">
						<image class="left" src="/static/icons/rank.png" mode="widthFix"></image>
						<view class="text">{{ $t('text.hot') }}</view>
						<image class="right" src="/static/icons/rank.png" mode="widthFix"></image>
					</view>
					<view class="c_list">
						<view class="item" v-for="(item, index) in hotList" :key="index" @click="openVideoDetail(item.id)">
							<view class="left">
								<image class="image" :src="item.image" mode="aspectFill"></image>
								<view class="badge" :class="`badge${index + 1}`">{{ index + 1 }}</view>
							</view>
							<view class="right">
								<view class="title u-line-3">{{ item.title }}</view>
								<view class="hot">
									<image class="image" src="/static/icons/hot.png" mode="widthFix"></image>
									<view class="text">{{ item.hots }}</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="type_box">
				<view class="wrapper" v-for="(tItem, tIndex) in videoList" :key="tIndex">
					<view class="title">
						<text class="left">{{ tItem.name }}</text>
						<text class="right" @click="jumpView(`/pages/video/list?id=${tItem.id}`)">{{ $t('text.more') }} ></text>
					</view>
					<view class="list">
						<view class="item" v-for="(item, index) in tItem.videos" :key="index" @click="openVideoDetail(item.id)">
							<view class="img">
								<image class="image" :src="item.image" mode="aspectFill"></image>
								<view class="mask"></view>
								<view class="views">
									<u-icon name="play-right-fill" color="#fff" size="16"></u-icon>
									<text class="text">{{ item.views }}</text>
								</view>
							</view>
							<view class="info u-line-2">{{ item.title }}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<u-picker
			:show="isLanguage" keyName="name" :columns="[languageList]" :defaultIndex="[languageIndex]"
			:cancelText="$t('text.cancel')" :confirmText="$t('text.confirm')"
			confirmColor="#EE7F33" :closeOnClickOverlay="true"
			@cancel="isLanguage = false" @close="isLanguage = false" @confirm="languageConfirm($event)">
		</u-picker>
	</view>
</template>

<script>
	import { mapState, mapGetters, mapMutations, mapActions } from "vuex"
	export default {
		data() {
			return {
				languageList: [],
				languageIndex: 0,
				isLanguage: false,
				swiperList: [],
				hotList: [],
				marginBottom: 0,
				videoList: []
			}
		},
		computed: {
			...mapGetters("app", ["title", "lang"]),
			navTitle() {
				return typeof this.title == 'string' ? this.title : ""
			}
		},
		watch: {
			lang(newValue, oldValue) {
				if(oldValue) this.getDefaultLang()
				else this.getLanguageType()
			}
		},
		onLoad() {
			this.lang && this.getLanguageType()
		},
		onReady() {
			uni.createSelectorQuery().select('.head_content').boundingClientRect(data => {
				this.marginBottom = data.height
			}).exec()
		},
		methods: {
			...mapMutations("app", ["setLang", "setCurrency"]),
			// 分类视频
			async getTypeVideo() {
				const res = await this.$request('index.video')
				if(res.code === 1) this.videoList = res.data
			},
			// 热门排行
			async getHotData() {
				const res = await this.$request('video.list', { type: 'top' })
				if(res.code === 1) this.hotList = res.data
			},
			// 轮播点击
			swiperClick(index) {
				if(this.swiperList[index].parsetpl === 0) {
					if(!this.swiperList[index].url) return
					// #ifdef H5
					window.location.href = this.swiperList[index].url
					// #endif

					// #ifdef APP-PLUS
					plus.runtime.openURL(this.swiperList[index].url)
					// #endif
				} else {
					if(!this.swiperList[index].video_id) return
					this.openVideoDetail(this.swiperList[index].video_id)
				}
			},
			// 轮播图
			async getSwiperData() {
				const res = await this.$request('index.swiper')
				if(res.code === 1) this.swiperList = res.data
			},
			// 默认语言
			getDefaultLang() {
				this.languageList.map((item, index) => {
					if(item.value == this.lang) {
						this.languageIndex = index
						this.setCurrency(item.currency)
					}
				})
			},
			// 选择语言
			languageConfirm(e) {
				this.setLang(e.value[0].value)
				this.isLanguage = false
				this.getLanguageType()
			},
			// 获取语言类型
			getLanguageType() {
				this.$request('language.list').then(res => {
					if(res.code === 1) {
						const arr = res.data.map(({ id, lang_text, lang, currency }) => ({ id, name: lang_text, value: lang, currency }))
						this.languageList = arr
						this.getDefaultLang()
						// 开始执行 获取页面数据
						this.getSwiperData()
						this.getHotData()
						this.getTypeVideo()
					}
				})
			},
		}
	}
</script>

<style>
	page {
		background: #13141E;
	}
	
	uni-page-body {
		height: auto;
	}
</style>
<style lang="scss" scoped>
	.page_container {
		color: #fff;
		
		.head_content {
			background: rgba(#13141E, 0.2);
			backdrop-filter: blur(14rpx);
			
			position: sticky;
			top: 0;
			left: 0;
			z-index: 10;
			
			.lang_box {
				height: 100rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 0 40rpx;
				
				.lang {
					height: 60rpx;
					color: #fff;
					font-size: 32rpx;
					border: 2rpx solid #fff;
					border-radius: 10rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: 0 16rpx 0 20rpx;
					
					.text {
						margin-right: 20rpx;
						white-space: nowrap;
					}
				}
			}
		}
		
		.main_content {
			
			.swiper_box {
				position: relative;
				width: 100%;
				aspect-ratio: 2/3;
				
				.swiper {
					height: 100%;
					
					/deep/ .uni-swiper-dots {
						transform: translate(0);
						bottom: 30rpx;
						right: 30rpx;
						left: unset;
						top: unset;
						
						.uni-swiper-dot {
							background: rgba(#fff, 0.35);
							width: 20rpx;
							height: 4rpx;
							border-radius: 2rpx;
						}
						
						.uni-swiper-dot-active {
							background: rgba(#fff, 1);
						}
					}
					
					.swiper_item {
						height: 100%;
						position: relative;
						
						&::after {
							content: "";
							width: 100%;
							height: 130px;
							background: linear-gradient(180deg,rgba(19,20,30,0.00), #13141e);
							position: absolute;
							bottom: 0;
							left: 0;
							z-index: 1;
							pointer-events: none;
						}
						
						.cover {
							width: 100%;
							height: 100%;
						}
						
						.info {
							max-width: 500rpx;
							position: absolute;
							bottom: 40rpx;
							left: 40rpx;
							z-index: 2;
							color: #fff;
							
							.image {
								width: 90rpx;
							}
							
							.text {
								font-size: 32rpx;
								margin-top: 12rpx;
							}
						}
					}
				}
			}
			
			.hot_box {
				padding: 30rpx;
				
				.content {
					height: 674rpx;
					background: #252734;
					border-radius: 30rpx;
					padding: 30rpx 10rpx 30rpx 30rpx;
					
					.c_head {
						display: flex;
						align-items: center;
						
						.left {
							width: 24rpx;
						}
						
						.right {
							width: 24rpx;
							transform: rotateY(180deg);
						}
						
						.text {
							margin: 0 4rpx;
							color: #FFD1A8;
							font-size: 32rpx;
						}
					}
					
					.c_list {
						width: 100%;
						height: 100%;
						display: flex;
						flex-direction: column;
						flex-wrap: wrap;
						overflow-x: auto;
						
						.item {
							width: 370rpx;
							height: 170rpx;
							margin: 20rpx 20rpx 0 0;
							display: flex;
							
							.left {
								width: 120rpx;
								height: 100%;
								border-radius: 10rpx;
								position: relative;
								background: #13141E;
								overflow: hidden;
								margin-right: 10rpx;
								
								.image {
									width: 100%;
									height: 100%;
								}
								
								.badge {
									width: 40rpx;
									height: 40rpx;
									line-height: 40rpx;
									text-align: center;
									border-radius: 0 0 10rpx 0;
									backdrop-filter: blur(16rpx);
									color: #fff;
									font-size: 32rpx;
									position: absolute;
									top: 0;
									left: 0;
									z-index: 1;
									
									&.badge1 {
										background: #FFD1A8;
									}
									
									&.badge2 {
										background: #B1BCD2;
									}
									
									&.badge3 {
										background: #B2836A;
									}
								}
							}
							
							.right {
								flex: 1;
								display: flex;
								flex-direction: column;
								justify-content: space-between;
								padding: 4rpx 0;
								
								.title {
									font-size: 28rpx;
									color: #fff;
								}
								
								.hot {
									display: flex;
									align-items: center;
									
									.image {
										width: 20rpx;
										margin-right: 4rpx;
									}
									
									.text {
										font-size: 24rpx;
										color: #B1BCD2;
									}
								}
							}
						}
					}
				}
			}
			
			.type_box {
				.wrapper {
					padding-bottom: 30rpx;
				
					.title {
						padding: 0 30rpx;
						display: flex;
						align-items: center;
						justify-content: space-between;
						
						.left {
							font-size: 32rpx;
							color: #fff;
						}
						
						.right {
							font-size: 28rpx;
							color: #677BA5;
						}
					}
					
					.list {
						width: 100%;
						overflow-x: auto;
						display: flex;
						margin-top: 30rpx;
						padding-left: 30rpx;
						
						.item {
							flex-shrink: 0;
							width: 260rpx;
							margin-right: 30rpx;
							
							.img {
								width: 100%;
								height: 374rpx;
								border-radius: 10rpx;
								background: #252734;
								overflow: hidden;
								position: relative;
								
								.image {
									width: 100%;
									height: 100%;
								}
								
								.mask {
									width: 100%;
									height: 100%;
									position: absolute;
									top: 0;
									left: 0;
									z-index: 1;
									background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 0%, rgba(255, 255, 255, 0) 30%, rgba(0, 0, 0, 0.3) 100%);
								}
								
								.views {
									position: absolute;
									bottom: 20rpx;
									right: 20rpx;
									z-index: 2;
									display: flex;
									align-items: center;
									
									.text {
										font-size: 24rpx;
										color: #fff;
										margin-left: 8rpx;
									}
								}
							}

							.info {
								width: 100%;
								height: 76rpx;
								font-size: 28rpx;
								line-height: 38rpx;
								margin-top: 10rpx;
								color: #fff;
							}
						}
					}
				}
			}
		}
	}
</style>