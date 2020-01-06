import Vue from 'vue'
import CommonSvgIcon from '@/components/common/SvgIcon'// svg component

// register globally
Vue.component('svg-icon', CommonSvgIcon)

const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
