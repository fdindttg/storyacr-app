/**
  * @Description: 
  * @Author: FYT1996
  * @Date: 2023-08-16 09:12:13
  * @LastEditor: FYT1996
  * @LastEditTime: 2023-12-08 17:40:17
  * @Copyright: by 南阳迈特网络科技有限公司 禁止任何形式（包含二次开发）转售系统源码，违者必究。
  */
 

// #ifdef H5
let BASE_URL = '', SIGN = ''
if (process.env.NODE_ENV === 'development') {
	BASE_URL = 'https://storyacr.com'
	SIGN = ''
} else {
	BASE_URL = window.location.origin
	SIGN = window.location.search.replace(/\?/g, "")
}
// #endif

// #ifdef APP-PLUS
let BASE_URL = 'https://storyacr.com',
	SIGN = ''
// #endif


export {
	BASE_URL,
	SIGN
}