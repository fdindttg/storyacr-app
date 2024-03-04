/**
 * @Description: 
 * @Author: FYT1996
 * @Date: 2023-12-02 14:40:57
 * @LastEditor: FYT1996
 * @LastEditTime: 2024-01-03 11:51:39
 * @Copyright: by 南阳迈特网络科技有限公司 禁止任何形式（包含二次开发）转售系统源码，违者必究。
 */

import { setTabBarItem, setTabBarStyle } from "@/common/utils/system.js"

const mixin = {
	data() {
		return {
			shareData: {
				spm: this.$store.state.user.userInfo?.id ? `${this.$store.state.user?.userInfo?.id}.1.0.3.1` : "",
				title: this.$store.state.app.config?.share?.title ? this.$store.state.app.config?.share?.title : "",
				imageUrl: this.$store.state.app.config?.share?.image ? this.$store.state.app.config?.share?.image : "",
				desc: this.$store.state.app.config?.share?.description ? this.$store.state.app.config?.share?.description : ""
			}
		}
	},
	computed: {
		/**
		 * 替换模板字符串
		 * @param { String } key - 语言包key值
		 * @param { String } dynamic - 动态模板字符串 - %s (替换标志)
		 * $t('template.name', '我的替换字符串')
		*/
		$t() {
			return function(key, dynamic) {
				const { language } = this.$store.state.app
				const str = language[key] ? language[key] : ""
				return dynamic ? str.replace("%s", dynamic) : str
			}
		}
	},
	onLoad() {
		
	},
	onShow() {
		setTabBarItem(this.$store.state.app.theme)
		// #ifdef H5
		document.title = this.$store.state.app.title
		// #endif
	},
	methods: {
		// 跳转页面
		jumpView(url) {
			uni.navigateTo({ url })
		},
		// 视频详情
		openVideoDetail(id) {
			this.jumpView(`/pages/video/play?id=${id}`)
		}
	}
}

export default mixin