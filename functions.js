// 定义全局变量
let layer,orginDot;

// 创建图层
function createLayer() {
    layer = new Konva.Layer();
    return layer;
}

// 初始化绘制源点
function initOrginDot(x=100,y=50){
	orginDot = {x,y}
	return orginDot
}

// 定义电路元器件
function creatDiagramCmp(width,height,color,label,Dot=orginDot){
	createRect(Dot.x-width/2, Dot.y, width,height,color,label);
}
// 定义继电器
function createCapacitor(width, height, Dot=orginDot, color, label){
	const x = Dot.x-width/2
	const y = Dot.y
	const group = new Konva.Group({ x, y });
	var imageObj = new Image();
	imageObj.onload = function () {
		var image = new Konva.Image({
			// x: x,
			// y: y,
			image: imageObj,
			width: width,
			height: height,
		});
		var text = new Konva.Text({
            x: 60,
            // y: y, // 图片下方
            text: label,
            fontSize: 18,
            fontFamily: 'Calibri',
            fill: color,
            width: 60,
            align: 'center',
        });
		group.add(image);
		group.add(text);
		// add the shape to the layer
		layer.add(group);
	};
	imageObj.src = '/img/unit.png';
}

// 创建矩形元素
function createRect(x, y, width, height, fill, text) {
	var group = new Konva.Group({ x: x, y: y });
	var rect = new Konva.Rect({
		width: width,
		height: height,
		fill: fill,
		stroke: 'black',
		strokeWidth: 1
	});

	var label = new Konva.Text({
		text: text,
		fontSize: 12,
		fill: 'black',
		width: width,
		align: 'center',
		padding: 5
	});

	// 垂直居中
	label.y((height - label.height()) / 2);

	group.add(rect);
	group.add(label);
	layer.add(group);
	
	return group;
}

// 连线基础逻辑
function createWire(x1, y1, offsetX, offsetY, color) {
	var points = [x1, y1, x1 + offsetX, y1 + offsetY];
	var line = new Konva.Line({
		points: points,
		stroke: color,
		strokeWidth: 2,
		lineCap: 'round',
		lineJoin: 'round'
	});
	layer.add(line);
	return line;
}



// 从折角处向右偏移
function createConnectionDotX(Dot,offsetX=50,bool){
	const offsetY = 0
	const colorArr = [
		{color:'red',doffx:-10,offY:-10},
		{color:'green',doffx:0,offY:0},
		{color:'yellow',doffx:10,offY:10},
	]
	colorArr.map(i=>{
		const offsetX_ = bool?offsetX+i.offY:offsetX
		createWire(Dot.x-i.doffx,Dot.y+i.doffx,offsetX_,offsetY,i.color)
	})
}

// 起始或者平行处 三相线路 纵向偏移
function createConnectionDotY(Dot,offsetY=50,bool){
	const offsetX = 0
	const colorArr = [
		{color:'yellow',doffx:10,offY:10},
		{color:'green',doffx:0,offY:0},
		{color:'red',doffx:-10,offY:-10},
	]
	colorArr.map(i=>{
		const offsetY_ = bool?offsetY+i.offY:offsetY
		createWire(Dot.x-i.doffx,Dot.y,offsetX,offsetY_,i.color)
	})
}

// 折角处向下偏移  
function createConnectionDotY_(Dot,offsetY=50,bool){
	// bool true偏移到平齐，false 偏移相同距离
	const offsetX = 0
	const colorArr = [
		{color:'yellow',doffx:10,offY:10},
		{color:'green',doffx:0,offY:0},
		{color:'red',doffx:-10,offY:-10},
	]
	colorArr.map(i=>{
		const offsetY_ = bool?offsetY-i.offY:offsetY
		createWire(Dot.x-i.doffx,Dot.y+i.doffx,offsetX,offsetY_,i.color)
	})
}

// 显示灯杆盏数
function createConnectionDotYSpl(Dot,offsetY=50,bool){
	const offsetX = 0
	const colorArr = [
		{color:'yellow',doffx:50,offY:10},
		{color:'green',doffx:0,offY:0},
		{color:'red',doffx:-50,offY:-10},
	]
	colorArr.map(i=>{
		const offsetY_ = bool?offsetY+i.offY:offsetY
		createWire(Dot.x-i.doffx,Dot.y,offsetX,offsetY_,i.color)
	})
	createWire(Dot.x+10,Dot.y,40,0,colorArr[2].color)
	createWire(Dot.x-10,Dot.y,-40,0,colorArr[0].color)
}
function createLightNum(Dot,data){
	const width = 30
	const height = 30
	data.map(i=>{
		createRect(Dot.x-width/2+i.offset, Dot.y, width,height,i.color,i.label);
	})
}

// 在电感旁边绘制一个表格
function createTable(x, y, data) {
	const tableGroup = new Konva.Group({ x: x, y: y });
	const cellWidth = 40;
	const cellHeight = 20;
	const headerColor = 'lightgrey';

	data.forEach((row, rowIndex) => {
		row.forEach((cell, cellIndex) => {
			const fill = rowIndex === 0 ? headerColor : 'white';
			const cellGroup = createRect(cellIndex * cellWidth, rowIndex * cellHeight, cellWidth, cellHeight, fill, cell);
			tableGroup.add(cellGroup);
		});
	});

	layer.add(tableGroup);
}