<!--
 * @Description:
 * @Author: FYT1996
 * @Date: 2023-08-16 09:17:56
 * @LastEditor: FYT1996
 * @LastEditTime: 2023-12-29 10:06:54
 * @Copyright: by 南阳迈特网络科技有限公司 禁止任何形式（包含二次开发）转售系统源码，违者必究。
-->


<template>
	<z-paging-swiper>
		<template #top>
			<view class="">
				<CustomNavbar :title="$t('navbar.video.record')"></CustomNavbar>
				<z-tabs ref="tabs" :list="contentList" :current="contentIndex" active-color="#ee7f33" inactive-color="#999" :active-style="{ fontWeight: 'bold' }" bg-color="transparent" @change="tabsChange" />
			</view>
		</template>
		<swiper class="swiper" :current="contentIndex" @change="swiperChange" @transition="swiperTransition" @animationfinish="swiperAnimationfinish">
			<swiper-item class="swiper-item" v-for="(item, index) in contentList" :key="index">
				<CustomVideoList :tabIndex="index" :currentIndex="contentIndex" :currentId="contentList[contentIndex].id" :currentType="contentList[contentIndex].type" />
			</swiper-item>
		</swiper>
	</z-paging-swiper>
</template>

<script>
	import CustomVideoList from '@/components/CustomVideoList.vue'
	export default {
		components: { CustomVideoList },
		data() {
			return {
				contentList: [
					{ id: 1, name: '', type: 'log' },
					{ id: 2, name: '', type: 'favorite' },
				],
				contentIndex: 0,
			}
		},
		onLoad(option) {
			if(option.id) this.contentIndex = option.id == 1 ? 0 : option.id == 2 ? 1 : 0
		},
		onShow() {
			this.contentList[0].name = this.$t('watch.history.view')
			this.contentList[1].name = this.$t('watch.history.drama')
		},
		methods: {
			// tabs通知swiper切换
			tabsChange(index) {
				this.contentIndex = index;
			},
			// swiper滑动中
			swiperTransition(e) {
				this.$refs.tabs.setDx(e.detail.dx);
			},
			// swiper滑动改变
			swiperChange(e) {
				setTimeout(() => {
					this.contentIndex = e.detail.current;
					this.$refs.tabs.unlockDx();
				}, 100)
			},
			// swiper滑动结束
			swiperAnimationfinish(e) {
				// this.contentIndex = e.detail.current;
				// this.$refs.tabs.unlockDx();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.swiper {
		height: 100%;
	}
</style>