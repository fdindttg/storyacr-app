<!--
 * @Description:
 * @Author: FYT1996
 * @Date: 2023-08-16 08:57:26
 * @LastEditor: FYT1996
 * @LastEditTime: 2023-12-08 17:40:08
 * @Copyright: by 南阳迈特网络科技有限公司 禁止任何形式（包含二次开发）转售系统源码，违者必究。
-->


<script>
	// #ifdef APP-PLUS
	const request = require('./common/request/index').default
	const utils = require('./common/utils/index.js').default
	import checkappupdate from '@/common/utils/checkappupdate.js'
	import api from '@/common/request/api.js'
	// #endif
	import { mapState, mapGetters, mapMutations, mapActions } from "vuex"
	
	export default {
		computed: {
			...mapGetters("app", ["theme"])
		},
		globalData: {
			isColor: '',
			isBgColor: ''
		},
		async onLaunch(options) {
			console.log("App Launch");

			// 保存分享参数（H5）
			options.query.scene && this.setShare({ spm: options.query.scene })
			// 获取配置信息
			await this.getConfigInfo()
			
			// #ifdef APP-PLUS
			// 锁定竖屏模式
			plus.screen.lockOrientation('portrait-primary');
			// app版本检测
			checkappupdate.check({
				api: this.$BASE_URL + api.common.update.url
			})
			// #endif
		},
		onShow() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			...mapActions("user", ["getUserInfo"]),
			...mapActions("app", ["getConfigInfo"]),
			...mapMutations("app", ["setShare"])
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "@/uview-ui/index.scss";
	@import "@/common/style/style.scss";
</style>
