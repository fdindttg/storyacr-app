<!--
 * @Description:
 * @Author: FYT1996
 * @Date: 2023-08-16 09:16:52
 * @LastEditor: FYT1996
 * @LastEditTime: 2023-12-29 10:01:59
 * @Copyright: by 南阳迈特网络科技有限公司 禁止任何形式（包含二次开发）转售系统源码，违者必究。
-->

<template>
	<z-paging-swiper>
		<template #top>
			<view class="head_content">
				<CustomNavbar color="#B1BCD2"></CustomNavbar>
				<z-tabs ref="tabs" :list="contentList" :current="contentIndex" active-color="#ee7f33" inactive-color="#B1BCD2" :active-style="{ fontWeight: 'bold' }" bg-color="transparent" @change="tabsChange" />
			</view>
		</template>
		<swiper class="swiper" :current="contentIndex" @transition="swiperTransition" @animationfinish="swiperAnimationfinish">
			<swiper-item class="swiper-item" v-for="(item, index) in contentList" :key="index">
				<ListVideoList :tabIndex="index" :currentIndex="contentIndex" :currentId="contentList[contentIndex].id"></ListVideoList>
			</swiper-item>
		</swiper>
	</z-paging-swiper>
</template>

<script>
	import ListVideoList from './components/ListVideoList.vue'
	export default {
		components: { ListVideoList },
		data() {
			return {
				contentList: [],
				contentIndex: 0,
				contentId: 0,
			}
		},
		onLoad(option) {
			if(option.id) this.contentId = option.id
			this.getVideoClassify()
		},
		methods: {
			// 获取视频分类
			getVideoClassify() {
				this.$request('video.classify').then(res => {
					if(res.code === 1) {
						if(res.data && res.data.length) {
							const data = res.data.filter(item => item.type == 'video')[0].children
							const arr = data.map(({ id, name }) => ({ id, name }))
							const def = [{ id: 0, name: this.$t('text.featured') }]
							this.contentList = [...def, ...arr]
							this.contentList.map((item, index) => {
								if(item.id == this.contentId) {
									this.contentIndex = index
								}
							})
						}
					}
				})
			},
			// tabs通知swiper切换
			tabsChange(index) {
				this.contentIndex = index;
			},
			// swiper滑动中
			swiperTransition(e) {
				this.$refs.tabs.setDx(e.detail.dx);
			},
			// swiper滑动结束
			swiperAnimationfinish(e) {
				this.contentIndex = e.detail.current;
				this.$refs.tabs.unlockDx();
			}
		}
	}
</script>

<style>
	page {
		background: #13141E;
	}
</style>
<style lang="scss" scoped>
	.swiper {
		height: 100%;
		color: #fff;
	}
</style>

