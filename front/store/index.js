import { set, toggle } from '@/utils/vuex'

export const state = () => ({
	drawer: true,
	color: 'primary',
	dark: false,
	ip: '...',
	country: '...',
	city: null,
	provaider: '...',
	proxy: '...',
	host: '...',
	complete: false,
	loader: true,
	title: 'Wutils',
	mini: false
})

export const mutations = {
	SET_DRAWER: set('drawer'),
	SET_IMAGE: set('image'),
	SET_COLOR: set('color'),
	TOGGLE_DRAWER: toggle('drawer'),
	SET_IP: set('ip'),
	SET_COUNTRY: set('country'),
	SET_CITY: set('city'),
	SET_PROVAIDER: set('provaider'),
	SET_PROXY: set('proxy'),
	SET_HOST: set('host'),
	SET_COMPLETE: set('complete'),
	SET_LOADER: set('loader'),
	SET_TITLE: set('title'),
	SET_MINI: set('mini')
}
