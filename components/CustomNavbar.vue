<!--
 * @Description:
 * @Author: FYT1996
 * @Date: 2023-08-16 09:16:36
 * @LastEditor: FYT1996
 * @LastEditTime: 2023-12-02 14:56:54
 * @Copyright: by 南阳迈特网络科技有限公司 禁止任何形式（包含二次开发）转售系统源码，违者必究。
-->


<template>
	<view class="CustomNavbar">
		<u-navbar v-if="left > 0" :title="title" :titleStyle="{ color, fontWeight: 'bold' }" :bgColor="bg" :placeholder="true">
			<view class="n_left" slot="left">
				<view class="back_prev" @click="navBack">
					<u-icon name="arrow-left" :size="left" :color="color"></u-icon>
				</view>
				<u-line :color="color" direction="column" length="10" margin="0 20rpx"></u-line>
				<view class="back_home" @click="backHome">
					<u-icon name="home" size="20" :color="color"></u-icon>
				</view>
				<!-- #ifdef APP-PLUS -->
				<text :style="{ color: color, marginLeft: '20rpx' }">{{ lText }}</text>
				<!-- #endif -->
			</view>
		</u-navbar>
		<u-navbar v-if="left <= 0 && $store.state.app.theme == 2" :leftIconSize="left" :bgColor="bg" :placeholder="true">
			<view class="n_center" slot="center" :style="{ color }">{{ title }}</view>
		</u-navbar>
		<u-navbar v-if="left <= 0 && $store.state.app.theme != 2" :leftIconSize="left" :title="title" :titleStyle="{ color, fontWeight: 'bold' }" :bgColor="bg" :placeholder="true" />
	</view>
</template>

<script>
	export default {
		name: "CustomNavbar",
		props: {
			title: { // 标题
				type: String,
				default: ''
			},
			bg: { // 导航条背景
				type: String,
				default: 'transparent'
			},
			color: { // 文字 图标 颜色
				type: String,
				default: '#000'
			},
			left: { // 左侧图标
				type: Number,
				default: 16
			},
			lText: { // 左侧文字
				type: String,
				default: ''
			},
		},
		methods: {
			backHome() {
				uni.switchTab({
					url: '/pages/home/index'
				})
			},
			navBack() {
				const canNavBack = getCurrentPages()
				if(canNavBack && canNavBack.length > 1) {
					uni.navigateBack()
				} else {
					try {
						history.back()
					} catch(e) {
						uni.switchTab({
							url: '/pages/home/index'
						})
					}
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.CustomNavbar {
		.n_left {
			display: flex;
			align-items: center;
			flex-direction: row;
			margin: 0 -26rpx;
			
			.back_prev {
				padding-left: 26rpx;
			}
			
			.back_home {
				padding-right: 26rpx;
			}
		}
		
		.n_center {
			font-size: 32rpx;
			font-weight: 700;
			width: 100%;
			padding: 0 40rpx;
		}
	}
</style>