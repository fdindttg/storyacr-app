<!--
 * @Description: 在这个组件对每个tab对应的列表进行渲染
 * @Author: FYT1996
 * @Date: 2023-12-29 09:32:53
 * @LastEditor: FYT1996
 * @LastEditTime: 2023-12-29 11:11:38
 * @Copyright: by 南阳迈特网络科技有限公司 禁止任何形式（包含二次开发）转售系统源码，违者必究。
-->


<template>
	<view class="content">
		<z-paging
			v-if="firstLoaded || isCurrentPage" ref="paging" v-model="dataList" @query="queryList" :fixed="false"
			:refresher-default-text="$t('zp.refresh.default')" :refresher-pulling-text="$t('zp.refresh.pulling')"
			:refresher-refreshing-text="$t('zp.refresh.refreshing')" :refresher-complete-text="$t('zp.refresh.complete')"
			:loading-more-default-text="$t('zp.loading.default')" :loading-more-loading-text="$t('zp.loading.loading')"
			:loading-more-no-more-text="$t('zp.loading.nomore')" :loading-more-fail-text="$t('zp.loading.fail')"
			:loading-more-no-more-line-custom-style="{ background: '#e6e6e6' }" :loading-more-title-custom-style="{ color: '#aaaaaa'}"
			:empty-view-text="$t('zp.empty.nodata')" :empty-view-reload-text="$t('zp.empty.reload')" :empty-view-error-text="$t('zp.empty.error')">
			<view class="content_box">
				<view class="list">
					<view class="item" v-for="(lItem, lIndex) in dataList" :key="lIndex" @click="openVideoDetail(lItem.video.id)">
						<view class="img">
							<image class="image" :src="lItem.video.image" mode="aspectFill"></image>
						</view>
						<view class="info">
							<view class="title u-line-1">{{ lItem.video.title }}</view>
							<view class="text1 u-line-2">{{ lItem.video.description }}</view>
							<view class="text2">{{ $t('watch.see') }}{{ lItem.episode.name }} / {{ $t('video.total', lItem.video.episodes) }}</view>
							<view class="btns">
								<view class="button" v-if="currentId == 1" :class="{ collect: lItem.is_favorite == 1 }" hover-class="active" :hover-start-time="0" :hover-stay-time="200" @click.stop="handleCollect(lItem.vid, lItem.is_favorite, lIndex)">
									<u-icon :name="lItem.is_favorite == 1 ? 'star-fill' : 'star'" color="#eee" size="18"></u-icon>
									<text class="text">{{ $t('watch.collect') }}</text>
								</view>
								<view class="button" v-else hover-class="active" :hover-start-time="0" :hover-stay-time="200">
									<u-icon name="play-right-fill" color="#eee" size="18"></u-icon>
									<text class="text">{{ $t('watch.now') }}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</z-paging>
	</view>
</template>

<script>
	// 是否点击了收藏
	let isClickCollect = false
	export default {
		name: "CustomVideoList",
		data() {
			return {
				// v-model绑定的这个变量不要在分页请求结束中自己赋值！！！
				dataList: [],
				// 当前组件是否已经加载过了
				firstLoaded: false,
				// 是否滚动到当前页
				isCurrentPage: false
			}
		},
		props: {
			// 当前组件的index，也就是当前组件是swiper中的第几个
			tabIndex: {
				type: Number,
				default: () => 0
			},
			// 当前swiper切换到第几个index
			currentIndex: {
				type: Number,
				default: () => 0
			},
			// 当前swiper对应id
			currentId: {
				type: Number,
				default: () => 0
			},
			// 当前swiper对应type
			currentType: {
				type: String,
				default: () => ""
			}
		},
		watch: {
			currentIndex: {
				handler(newVal) {
					if(newVal === this.tabIndex) {
						// 懒加载，当滑动到当前的item时，才去加载
						if(!this.firstLoaded) {
							// 这里需要延迟渲染z-paging的原因是为了避免在一些平台上立即渲染可能引发的底层报错问题
							this.$nextTick(() => {
								setTimeout(() => {
									this.isCurrentPage = true;
								}, 100);
							})
						}
						// 定向更新收藏列表数据
						if(newVal == 0) {
							isClickCollect = false
						} else {
							isClickCollect && this.queryList(1, 10)
						}
					}
				},
				immediate: true
			},
		},
		methods: {
			// 	收藏
			handleCollect(vid, collect, index) {
				if(collect == 0) {
					const obj = { vid, type: 'favorite' }
					this.$request('video.addRecord', obj, false).then(res => {
						if(res.code === 1) this.dataList[index].is_favorite = 1
					})
				} else {
					const obj = { ids: vid, type: 'favorite' }
					this.$request('video.deleteRecord', obj, false).then(res => {
						if(res.code === 1) this.dataList[index].is_favorite = 0
					})
				}
				isClickCollect = true
			},
			// 数据
			queryList(page, pagesize) {
				const obj = {
					type: this.currentType,
					page,
					pagesize
				}
				this.$request('video.getRecord', obj).then(res => {
					// 将请求的结果数组传递给z-paging
					this.$refs.paging.complete(res.data);
					this.firstLoaded = true;
				}).catch(err => {
					this.$refs.paging.complete(false);
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	/* 注意: 父节点需要固定高度，z-paging的height:100%才会生效 */
	.content {
		height: 100%;
	}
	
	.content_box {
		padding: 20rpx 40rpx 60rpx 40rpx;
		
		.list {
	
			.item {
				margin-bottom: 40rpx;
				display: flex;
				align-items: center;
				
				.img {
					width: 206rpx;
					height: 276rpx;
					border-radius: 20rpx;
					overflow: hidden;
					background: #e6e6e6;
					
					.image {
						width: 100%;
						height: 100%;
					}
				}
				
				.info {
					flex: 1;
					margin-left: 40rpx;
					
					.title {
						font-size: 32rpx;
						color: #000;
						font-weight: 700;
					}
					
					.text1 {
						height: 68rpx;
						font-size: 24rpx;
						color: #666;
						margin-top: 4rpx;
						line-height: 34rpx;
						margin: 10rpx 0;
					}
					
					.text2 {
						font-size: 24rpx;
						color: #111;
						line-height: 34rpx;
					}
					
					.btns {
						margin-top: 20rpx;
						display: flex;
						align-items: center;
						justify-content: space-between;
						
						.button {
							width: calc((100% - 30rpx) / 2);
							height: 60rpx;
							display: flex;
							align-items: center;
							justify-content: center;
							font-size: 28rpx;
							background: #484B52;
							border-radius: 10rpx;
							color: #fff;
							
							&.collect {
								opacity: 0.6;
							}
						
							&.active {
								background: rgba(#000, 0.9);
							}
							
							.text {
								margin-left: 8rpx;
							}
						}
					}
				}
			}
		}
	}
</style>
