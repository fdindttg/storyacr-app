<!--
 * @Description:
 * @Author: FYT1996
 * @Date: 2023-08-16 09:19:18
 * @LastEditor: FYT1996
 * @LastEditTime: 2023-12-04 15:01:18
 * @Copyright: by 南阳迈特网络科技有限公司 禁止任何形式（包含二次开发）转售系统源码，违者必究。
-->


<template>
	<view class="page_content">
		<view class="head_content">
			<CustomNavbar :title="$t('navbar.task')" color="#fff" bg="#262626"></CustomNavbar>
		</view>
		<view class="main_content">
			<view class="task_box box_bg">
				<view class="title_box">
					<image class="image1" src="https://img.nymaite.com/video_short/images/arrow.png" mode="widthFix"></image>
					<text class="text">{{ $t('task.title') }}</text>
					<image class="image2" src="https://img.nymaite.com/video_short/images/arrow.png" mode="widthFix"></image>
				</view>
				<view class="item_box">
					<view class="item" v-for="(item, index) in taskData" :key="item.id">
						<view class="texts">
							<view class="line">
								<text>{{ item.title }}</text>
								<text>+{{ item.usable }} {{ $t('text.integral') }}</text>
							</view>
							<view class="line">
								<text v-if="item.type == 'day'">{{ $t('task.daily', item.limit) }}</text>
								<text v-else>{{ $t('task.limit', item.limit) }}</text>
								<text>（{{ item.user_count }} / {{ item.limit }}）</text>
							</view>
						</view>
						<view class="button disabled" v-if="item.user_count == item.limit">{{ $t('task.finish') }}</view>
						<view class="button" v-else @click="taskItemClick(item.hook)">{{ $t('task.unfinish') }}</view>
					</view>
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
				taskData: []
			}
		},
		onLoad() {
			this.getTaskList()
		},
		methods: {
			// 做任务
			taskItemClick(type) {
				if(type == 'share_wx_after' || type == 'share_wxf_after' || type == 'share_success') {
					
				} else if(type == 'user_bind_name_after' || type == 'user_bind_avatar_after') {
					this.jumpView('/pages/user/info/index')
				} else if(type == 'uniad_success') {
					
				}
			},
			// 获取积分任务
			getTaskList() {
				this.$request('task.list', { platform: this.$utils.platforms() }).then(res => {
					if(res.code === 1) {
						this.taskData = res.data
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page_content {
		background: #262626;
		
		.main_content {
			overflow-y: auto;
			padding: 24rpx 32rpx 60rpx 32rpx;
			position: relative;
			
			.title_box {
				margin-bottom: 40rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				
				.image1 {
					width: 56rpx;
					transform: rotate(180deg);
				}
				
				.text {
					font-size: 40rpx;
					color: #EAD0AE;
					text-shadow: 0 2rpx 0 0 #000000;
					font-weight: bold;
					margin: 0 56rpx;
				}
				
				.image2 {
					width: 56rpx;
				}
			}
			
			.box_bg {
				border-radius: 20rpx;
				padding: 40rpx 32rpx 48rpx 32rpx;
				border: 2rpx solid #96948C;
				background: linear-gradient(225deg, #3D3D3B 0%, #2F2D2D 100%);
				box-shadow: 0 0 16rpx 0rpx rgba(#000, 0.2);
			}

			.task_box {
				margin-top: 32rpx;
				
				.item_box {
					.item {
						border-radius: 20rpx;
						background: #42403E;
						padding: 24rpx;
						display: flex;
						align-items: center;
						justify-content: space-between;
						font-weight: bold;
						margin-bottom: 16rpx;
						
						&:last-child {
							margin-bottom: 0;
						}
						
						.texts {
							flex: 1;
							margin-right: 40rpx;
							font-size: 28rpx;
							color: #FAD9B4;
							
							.line {
								margin-bottom: 10rpx;
								
								&:last-child {
									margin-bottom: 0;
								}
							}
						}
						
						.button {
							width: 160rpx;
							height: 56rpx;
							line-height: 56rpx;
							border-radius: 50rpx;
							background: #F3D2A6;
							text-align: center;
							font-size: 28rpx;
							color: #3A3A38;
							
							&.disabled {
								background: rgba(#F3D2A6, 0.3);
							}
						}
					}
				}
			}
		}
	}
</style>
