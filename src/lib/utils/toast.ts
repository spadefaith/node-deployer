import { iziToast } from '$lib';

export function showSimpleToast(conf: {
	id?: number | null;
	class?: string;
	title?: string;
	titleColor?: string;
	titleSize?: string;
	titleLineHeight?: string;
	message: string;
	messageColor?: string;
	messageSize?: string;
	messageLineHeight?: string;
	backgroundColor?: string;
	theme?: string; // dark
	color?: string; // blue, red, green, yellow
	icon?: string;
	iconText?: string;
	iconColor?: string;
	iconUrl?: null | string;
	image?: string;
	imageWidth?: number;
	maxWidth?: null | string;
	zindex?: null | string;
	layout?: number;
	balloon?: boolean;
	close?: boolean;
	closeOnEscape?: boolean;
	closeOnClick?: boolean;
	displayMode?: number; // once, replace
	position?: string; // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter, center
	target?: string;
	targetFirst?: boolean;
	timeout?: number;
	rtl?: boolean;
	animateInside?: boolean;
	drag?: boolean;
	pauseOnHover?: boolean;
	resetOnHover?: boolean;
	progressBar?: boolean;
	progressBarColor?: string;
	progressBarEasing?: string;
	overlay?: boolean;
	overlayClose?: boolean;
	overlayColor?: string;
	transitionIn?: string;
	transitionOut?: string;
	transitionInMobile?: string;
	transitionOutMobile?: string;
	buttons?: any;
	inputs?: any;
	onOpening?: () => void;
	onOpened?: () => void;
	onClosing?: () => void;
	onClosed?: () => void;
}) {
	const c = {
		id: conf.id != undefined ? conf.id : null,
		class: conf.class || '',
		title: conf.title || '',
		titleColor: conf.titleColor || '',
		titleSize: conf.titleSize || '',
		titleLineHeight: conf.titleLineHeight || '',
		message: conf.message || '',
		messageColor: conf.messageColor || '',
		messageSize: conf.messageSize || '',
		messageLineHeight: conf.messageLineHeight || '',
		backgroundColor: conf.backgroundColor || '',
		theme: conf.theme || 'light', // dark
		color: conf.color || '', // blue, red, green, yellow
		icon: conf.icon || '',
		iconText: conf.iconText || '',
		iconColor: conf.iconColor || '',
		iconUrl: conf.iconUrl != undefined ? conf.iconUrl : null,
		image: conf.image || '',
		imageWidth: conf.imageWidth || 50,
		maxWidth: conf.maxWidth != undefined ? conf.maxWidth : null,
		zindex: conf.zindex != undefined ? conf.zindex : null,
		layout: conf.layout || 1,
		balloon: conf.balloon != undefined ? conf.balloon : false,
		close: conf.iconUrl != undefined ? conf.iconUrl : true,
		closeOnEscape: conf.closeOnEscape != undefined ? conf.closeOnEscape : false,
		closeOnClick: conf.closeOnClick != undefined ? conf.closeOnClick : null,
		displayMode: conf.displayMode != undefined ? conf.displayMode : 0, // once, replace
		position: conf.position || 'bottomRight', // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter, center
		target: conf.target || '',
		targetFirst: conf.targetFirst != undefined ? conf.targetFirst : true,
		timeout: conf.timeout != undefined ? conf.timeout : 5000,
		rtl: conf.rtl != undefined ? conf.rtl : false,
		animateInside: conf.animateInside != undefined ? conf.animateInside : true,
		drag: conf.drag != undefined ? conf.drag : true,
		pauseOnHover: conf.pauseOnHover != undefined ? conf.pauseOnHover : true,
		resetOnHover: conf.resetOnHover != undefined ? conf.resetOnHover : false,
		progressBar: conf.progressBar != undefined ? conf.progressBar : true,
		progressBarColor: conf.progressBarColor || '',
		progressBarEasing: conf.progressBarEasing || 'linear',
		overlay: conf.overlay != undefined ? conf.overlay : false,
		overlayClose: conf.overlayClose != undefined ? conf.overlayClose : false,
		overlayColor: conf.overlayColor != undefined ? conf.overlayColor : 'rgba(0, 0, 0, 0.6)',
		transitionIn: conf.transitionIn || 'fadeInUp',
		transitionOut: conf.transitionOut || 'fadeOut',
		transitionInMobile: conf.transitionInMobile || 'fadeInUp',
		transitionOutMobile: conf.transitionOutMobile || 'fadeOutDown',
		buttons: conf.buttons || {},
		inputs: conf.inputs || {},
		onOpening: conf.onOpening || function () {},
		onOpened: conf.onOpened || function () {},
		onClosing: conf.onClosing || function () {},
		onClosed: conf.onClosed || function () {}
	};

	return iziToast.show(c);
}
