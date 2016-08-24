require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

// 获取图片相关的数据
var imageDatas = require('../data/imageDatas.json');

// 获取区间内的一个随机值
var getRangeRandom = (low, high)=>Math.floor(Math.random() * (high - low) + low);

// 获取0-30°之间一个任意正负值
var get30DegRandom = ()=> {
 	let deg = '';
  	deg = (Math.random() > 0.5 ) ? '+' : '-';
  	return deg + Math.ceil(Math.random() * 30);
};

// 利用闭包，将图片名信息转成图片URL路径信息
imageDatas = ((imageDatasArr) => {
	for (var i = 0, j = imageDatasArr.length; i < j; i++) {
		let singleImageData = imageDatasArr[i];
		singleImageData.imageURL = require('../images/' + singleImageData.fileName);
		imageDatasArr[i] = singleImageData;
	}
	return imageDatasArr;
})(imageDatas);



class ImgFigure extends React.Component {
	constructor(props) {
	    super(props);
	    this.handleClick = this.handleClick.bind(this);
	}

	/**
	   *imgsFigue的点击处理函数
	   */
	handleClick(e) {
	    // 翻转和居中图片
	    if (this.props.arrange.isCenter) {
	      	this.props.inverse();
	    } else {
	      	this.props.center();
	    }
	    e.stopPropagation();
	    e.preventDefault();
	}


	render() {
		var styleObj = {};

		// 如果props属性中指定了这张图片的位置，则使用
		if (this.props.arrange.pos) {
			styleObj = this.props.arrange.pos;
		};

		// 如果图片的旋转角度有值并且不为0，添加旋转角度
		if (this.props.arrange.rotate) {
			(['Moz', 'Ms', 'Webkit', '']).forEach(function(value) {
				styleObj[value + 'Transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
			}.bind(this));
		};

		if (this.props.arrange.isCenter) {
	      	styleObj.zIndex = 11;
	    }

		let imgFigureClassName = 'img-figure';
    	imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse ' : '';

		return ( 
			<figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
				<img src={this.props.data.imageURL} alt={this.props.data.title}/> 
				<figcaption>
					<h2 className="img-title"> {this.props.data.title} </h2> 
					<div className="img-back" onClick={this.handleClick}>
						<p> 
							{this.props.data.desc}
						</p>
					</div>
				</figcaption> 
			</figure>
		)
	}
}


class AppComponent extends React.Component {
	
	constructor(props) {
	    super(props);

	    // 定义图片区域范围
	    this.Constant = {
	      	centerPos: {
		        left: 0,
		        right: 0
		    },
	      	hPosRange: { //水平方向的取值范围
		        leftSecX: [0, 0],
		        rightSecX: [0, 0],
		        y: [0, 0]
	      	},
	      	vPosRange: { //垂直方向
		        x: [0, 0],
		        topY: [0, 0]
	      	}
	    };

	    // 状态
	    this.state = {
	      	imgsArrangeArr: [
		        //{
		        //  pos:{
		        //    left:'0',
		        //    top:'0'
		        //  },
		        //    rotate:0, //旋转角度
		        //isInverse:false //正反面
		        //isCenter:false 图片是否居中
		        //}
	      	]
	    };
	}

	// 翻转图片的函数
  	inverse(index) {
	    return ()=> {
	      	let imgsArrangArr = this.state.imgsArrangeArr;
		    imgsArrangArr[index].isInverse = !imgsArrangArr[index].isInverse;
		    this.setState({
		        imgsArrangeArr: imgsArrangArr
		    })
	    }
  	}

  	/**
  	 * 利用rearramhe函数,居中对应index的图片
  	 * @param  {[type]} index [description]
  	 * @return {[type]}       [description]
  	 */
  	center(index) {
    	return ()=> {
      		this.rearrange(index);
    	}
  	}

	/**
	 * 重新布局所有图片
	 * @param  {[type]} centerIndex 指定居中排布哪个图片
	 * @return {[type]}             [description]
	 */
	rearrange(centerIndex) {
		let imgsArrangeArr = this.state.imgsArrangeArr,
			Constant = this.Constant,
			centerPos = Constant.centerPos,
			hPosRange = Constant.hPosRange,
			vPosRange = Constant.vPosRange,
			hPosRangeLeftSecX = hPosRange.leftSecX,
			hPosRangeRightSecX = hPosRange.rightSecX,
			hPosRangeY = hPosRange.y,
			vPosRangeTopY = vPosRange.topY,
			vPosRangeX = vPosRange.x,
			imgsArrangTopArr = [],
			topImgNum = Math.floor(Math.random() * 2), //取一个或者不取
			topImgSpiceIndex = 0,
			imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

		//首先居中centerIndex图片 ,centerIndex图片不需要旋转
		imgsArrangeCenterArr[0] = {
			pos: centerPos,
			rotate: 0,
			isCenter: true
		}

		//取出要布局上测的图片的状态信息
		topImgSpiceIndex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum));
		imgsArrangTopArr = imgsArrangeArr.splice(topImgSpiceIndex, topImgNum);

		//布局位于上侧的图片
		imgsArrangTopArr.forEach((value, index) => {
			imgsArrangTopArr[index] = {
				pos: {
					top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
					left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
				},
				rotate: get30DegRandom(),
				isCenter: false

			};
		});

		//布局左两侧的图片
	    for (let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
	      	let hPosRangeLORX = null;

	      	//前半部分布局左边,右边部分布局右边
	      	if (i < k) {
	        	hPosRangeLORX = hPosRangeLeftSecX;
	      	} else {
	        	hPosRangeLORX = hPosRangeRightSecX
	      	}
	      	imgsArrangeArr[i] = {
	        	pos: {
	          		top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
	          		left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
	        	},
	        	rotate: get30DegRandom(),
	        	isCenter: false
	      	};
	    }
	    if (imgsArrangTopArr && imgsArrangTopArr[0]) {
	      	imgsArrangeArr.splice(topImgSpiceIndex, 0, imgsArrangTopArr[0]);
	    }
	    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

	    // 设置stage，触发重新渲染
	    this.setState({
	      	imgsArrangeArr: imgsArrangeArr
	    });
	}

	// getInitialState() {
	// 	return {
	// 		imgsArrangeArr: []
	// 	}
	// }

	// 组件加载以后，为每张图片计算其位置的范围
	componentDidMount() {
		// 首先拿到舞台的大小
		var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
			stageW = stageDOM.scrollWidth,
			stageH = stageDOM.scrollHeight,
			halfStageW = Math.ceil(stageW / 2),
			halfStageH = Math.ceil(stageH / 2);

		// 拿到第一个imgFigure的大小
		var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
			imgW = imgFigureDOM.scrollWidth,
			imgH = imgFigureDOM.scrollHeight,
			halfImgW = Math.ceil(imgW / 2),
			halfImgH = Math.ceil(imgH / 2);

		// 计算中心图片的位置点
		this.Constant.centerPos = {
			left: halfStageW - halfImgW,
			top: halfStageH - halfImgH
		}

		// 计算水平方向（左侧、右侧）图片的位置点
		this.Constant.hPosRange.leftSecX[0] = -halfImgW;
		this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
		this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
		this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
		this.Constant.hPosRange.y[0] = -halfImgH;
		this.Constant.hPosRange.y[1] = stageH - halfImgH;

		// 计算上侧区域图片的位置点
		this.Constant.vPosRange.topY[0] = -halfImgH;
		this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
		this.Constant.vPosRange.x[0] = halfStageW - imgW;
		this.Constant.vPosRange.x[1] = halfStageW;

		this.rearrange(0);
	}

	render() {
		var controllerUnits = [],
			imgFigures = [];

		imageDatas.forEach(function(value, index) {
			// 初始化状态
			if (!this.state.imgsArrangeArr[index]) {
				this.state.imgsArrangeArr[index] = {
					pos: {
						left: 0,
						top: 0
					},
					rotate: 0,
					isInverse: false,
					isCenter: false
				}
			};
			imgFigures.push( <ImgFigure data = {value} ref = {"imgFigure" + index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>)
		}.bind(this));

		return ( <section className = "stage" ref = "stage"> 
			<section className = "img-sec"> {imgFigures} </section> 
			<nav className = "controller-nav"> {controllerUnits} 
			</nav> 
			</section>
		);
	}
}

AppComponent.defaultProps = {};

export default AppComponent;