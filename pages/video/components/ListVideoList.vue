<!--
 * @Description: 在这个组件对每个tab对应的列表进行渲染
 * @Author: FYT1996
 * @Date: 2023-12-29 09:38:53
 * @LastEditor: FYT1996
 * @LastEditTime: 2023-12-29 10:07:56
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
			:loading-more-no-more-line-custom-style="{ background: '#4F4F50' }" :loading-more-title-custom-style="{ color: '#aaaaaa'}"
			:empty-view-text="$t('zp.empty.nodata')" :empty-view-reload-text="$t('zp.empty.reload')" :empty-view-error-text="$t('zp.empty.error')">
			<view class="content_box">
				<view class="list">
					<view class="item" v-for="(item, index) in dataList" :key="index" @click="openVideoDetail(item.id)">
						<view class="img">
							<image class="image" :src="item.image" mode="aspectFill"></image>
							<view class="mask"></view>
							<view class="views">
								<u-icon name="play-right-fill" color="#fff" size="16"></u-icon>
								<text class="text">{{ item.views }}</text>
							</view>
						</view>
						<view class="info">
							<view class="title u-line-1">{{ item.title }}</view>
						</view>
					</view>
				</view>
			</view>
		</z-paging>
	</view>
</template>

<script>
	export default {
		name: "ListVideoList",
		data() {
			return {
				//v-model绑定的这个变量不要在分页请求结束中自己赋值！！！
				dataList: [],
				//当前组件是否已经加载过了
				firstLoaded: false,
				//是否滚动到当前页
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
					}
				},
				immediate: true
			},
		},
		methods: {
			// 数据
			queryList(page, pagesize) {
				const obj = {
					category_id: this.currentId,
					page,
					pagesize
				}
				this.$request('video.list', obj).then(res => {
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
		padding: 20rpx 40rpx 20rpx 40rpx;
		
		.list {
			display: flex;
			flex-wrap: wrap;

			.item {
				width: calc((100% - 40rpx) / 2);
				margin-right: 40rpx;
				margin-bottom: 40rpx;
				
				&:nth-child(2n) {
					margin-right: 0;
				}
				
				.img {
					height: 440rpx;
					border-radius: 10rpx;
					background: #000;
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
					margin-top: 16rpx;
					
					.title {
						font-size: 28rpx;
						color: #F4F7FA;
					}
					
					.text {
						font-size: 24rpx;
						color: #666;
						margin-top: 4rpx;
					}
				}
			}
		}
	}
</style>
