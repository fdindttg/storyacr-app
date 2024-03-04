<template>
	<view class="CustomAreaCode">
		<u-popup :show="show" :round="20" :closeable="true" :closeOnClickOverlay="true" @close="closeHandle">
			<view class="area_popup">
				<view class="search">
					<u-input class="input" v-model="area.keyword" clearable prefixIcon="search" prefixIconStyle="font-size: 22px; color: #909399" :placeholder="$t('text.input.keyword')"></u-input>
				</view>
				<view class="list">
					<view class="item" v-for="(item, index) in area.search ? area.view : area.data" :key="index" @click="area.id = item.id">
						<view class="left">{{ item.text }}</view>
						<view class="right" v-if="area.id === item.id">
							<u-icon name="checkmark" color="#EE7F33" size="16"></u-icon>
						</view>
					</view>
				</view>
				<view class="btns">
					<u-button :text="$t('text.cancel')" :customStyle="{ ...buttonStyle }" @click="closeHandle"></u-button>
					<u-button :text="$t('text.confirm')" :customStyle="{ ...buttonStyle, ...confirmStyle }" @click="confirmHandle" />
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import { mapState, mapGetters, mapMutations, mapActions } from "vuex"
	export default {
		name: "CustomAreaCode",
		props: {
			show: {
				type: Boolean,
				default: false
			},
		},
		data() {
			return {
				buttonStyle: {
					width: '280rpx',
					fontSize: '28rpx',
					borderRadius: '20rpx',
					margin: '0',
				},
				confirmStyle: {
					border: 'none',
					color: '#fff',
					background: '#EE7F33',
				},
				area: {
					keyword: "", // 关键词
					data: [], // 原数组
					id: null, // 当前id
					view: [], // 渲染数组
					value: "", // 选中值
					select: null, // 选中id
					search: false // 搜索
				}
			};
		},
		watch: {
			"area.keyword": {
				deep: true,
				handler: function() {
					this.area.view = []
					this.area.search = this.area.keyword ? true : false
					this.area.data.map((item, index) => {
						const reg = new RegExp(this.area.keyword, 'i')
						const result = reg.test(item.text)
						if(result) this.area.view.push(item)
					})
				}
			}
		},
		created() {
			this.getAreaCode()
		},
		methods: {
			// 关闭
			closeHandle() {
				this.area.id = this.area.select
				this.$emit('close', false)
			},
			// 确定
			confirmHandle() {
				if(this.area.id != null) {
					const obj = this.area.data.filter(item => item.id == this.area.id)[0]
					this.area.value = obj.code
					this.area.select = obj.id
					this.$emit('code', this.area.value)
					this.$emit('close', false)
				} else {
					this.$u.toast(this.$t('text.select.countrycode'))
				}
			},
			// 获取区号
			getAreaCode() {
				this.$request('login.areaCode').then(res => {
					if(res.code === 1) {
						this.area.data = res.data.map(({ name_lang, tel }, index) => ({ id: index + 1, name: name_lang, code: tel, text: name_lang + ' ' + tel }))
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.area_popup {
		height: 65vh;
		padding: 100rpx 40rpx 40rpx 40rpx;
		display: flex;
		flex-direction: column;
		
		.search {
			.input {
				border: none;
				background: #F2F2F2;
				border-radius: 100px;
			}
		}
		
		.list {
			flex: 1;
			margin: 40rpx 0;
			overflow-y: auto;
			
			.item {
				height: 80rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 28rpx;
				border-bottom: 2rpx solid #eee;
			}
		}
		
		.btns {
			display: flex;
			justify-content: space-between;
		}
	}
</style>