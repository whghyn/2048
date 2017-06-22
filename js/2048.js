var game={
	data:[],
	score:0,//保存分数
	randomNum:function(){
		//对象的方法使用对象的属性必须+this。
		/*在数组的随机一个位置生成一个2或者4 */
		
		/*
		 * step1:随机生成一个行下标：row
		 *       随机生成一个列下标：col
		 *       下标范围：0-3
		 * step2：判断当前元素是否==0
		 *     如果==0
		 *       当前元素中放入2或者4
		 * 		  生成一个随机数，如果随机数<0.5,放入2；否则放入4
		 *       退出循环
		 *     如果！=0
		 *        继续循环（否则什么也不做，继续循环）
		 */
		if(!this.isFull()){//如果不满，才生成随机数 
			while(true){
				var row=Math.floor(Math.random()*4);
				var col=Math.floor(Math.random()*4);
				if(this.data[row][col]==0){
					this.data[row][col]=Math.random()<0.5?2:4;
					break;
				}
			}
		}
	},
	isFull:function(){
		/*检查当前数组是否已满
		
		* 将二维数组按默认格式转换为字符串
		* 用  找
		* 如果找到，返回false，否则，返回true
		* */
		return this.data.toString().search(/(0,)|(,0)/)==-1;
	},
	
	start:function(){
		this.data=[[0,0,0,0],
			   	   [0,0,0,0],
			       [0,0,0,0],
			       [0,0,0,0]
//	];
//	this.data=[[8,16,8,16],
//			   	 [8,16,8,16],
//			       [8,16,8,16],
//			       [8,16,8,16]
//	];
		this.score=0;
		this.randomNum();//对象自己的方法内调用其他方法，也要用this。
		this.randomNum();
		this.updateView();
		
	},
	
	updateView:function(){
		/*
		 * 将当前数组每个元素设置到页面对应的单元格中，遍历二维数组
		 * 中每个元素：row col
		 * Step1：利用div的id找到和当前元素对应位置的div
		 *    	var id="c"+row+col;   cXX
		 * Step2:如果当前元素！=0
		 * 		Step2.1：将元素的值写入div中
		 * 		Step2.2：将当前元素的className属性设置为cell n？
		 * 		div.className="cell n"+?;
		 * Step3:否则：
		 * 		Step3.1：清除div中的内容,将div内容重置为""
		 * 		Step3.2：将div.className重置为"cell"
		 */
		var span=document.getElementById("score");
		span.innerHTML=this.score;
		
		for(var row=0;row<this.data.length;row++){
			for(var col=0;col<this.data[row].length;col++){
				var div = document.getElementById("c"+row+col);
				if(this.data[row][col]!=0){
					div.innerHTML=this.data[row][col];
					div.className="cell n"+this.data[row][col];
				}else{
					div.innerHTML="";
					div.className="cell";
				}
			}
		}
		
		this.gameOver();
		var divOver=document.getElementById("gameOver");
		if(this.state==this.GAMEOVER){
			divOver.style.display="block";
		}else{
			divOver.style.display="none";
		}
	},
	
	moveLeft:function(){/*左移方法*/
		var start=this.data.toString();
		for(var row=0;row<4;row++){
			var col=1;//左移时，第一个格不用检查
			var c=0;//记录当前合并到的位置
			while(col<4){
				var prev=this.data[row][col-1];//临时存储一个格
				var curr=this.data[row][col];//临时存储当前格
				/*判断当前单元格能否向前移动*/
				if(curr!=0){this.merge(row,col,row,col-1);}
				//如果前一个元素==0，且当前格！=0时，
				//且col-1后依然>0(不能是最左侧格)
				//则移动后下标退一格
				//其余情况下标都移动到下一格
				if(curr!=0&&prev==0&&col>1&&(col!=c+1)){
					col--;
				}else{
					col++;
					if(curr!=0&&this.data[row][c]!=0&&prev!=0){
						c++;//合并之前，当前不为0，前一个元素不为0，
						//合并之后，当前元素c所在位置也不能为0
					}
				}
			}
		}
		var end=this.data.toString();
		if(start!=end){//被移动了
			//移动后，生成随机数，更新界面
			this.randomNum();
			this.updateView();
		}
	},
	
	moveRight:function(){/*右移方法*/
		var start=this.data.toString();
		for(var row=0;row<4;row++){
			var col=2;//右移时，第四个格不用检查
			var c=3;//最右侧单元格
			while(col>=0){
				var prev=this.data[row][col+1];//临时存储一个格
				var curr=this.data[row][col];//临时存储当前格
				/*判断当前单元格能否向前移动*/
				if(curr!=0){this.merge(row,col,row,col+1);}
				//如果前一个元素==0，且当前格！=0时，
				//且col+1后<3（不能是最右侧格）
				//则移动后下标退一格
				//其余情况下标都移动到下一格
				if(curr!=0&&prev==0&&(col!=c-1)){
					col++;
				}else{
					col--;
					if(curr!=0&&prev!=0&&this.data[row][c]!==0){
						c--;
					}
				}
			}
		}
		var end=this.data.toString();
		if(start!=end){//被移动了
			//移动后，生成随机数，更新界面
			this.randomNum();
			this.updateView();
		}
	},
	
	moveUp:function(){/*上移方法*/
		var start=this.data.toString();
		for(var col=0;col<4;col++){
			var row=1;//上移时，第一个格不用检查
			var r=0;//记录当前合并到的位置
			while(row<4){
				var prev=this.data[row-1][col];//临时存储一个格
				var curr=this.data[row][col];//临时存储当前格
				/*判断当前单元格能否向前移动*/
				if(row!=0){this.merge(row,col,row-1,col);}
				//如果前一个元素==0，且当前格！=0时，
				//且col-1后依然>0(不能是最左侧格)
				//则移动后下标退一格
				//其余情况下标都移动到下一格
				if(curr!=0&&prev==0&&row>1&&(row!=r+1)){
					row--;
				}else{
					row++;
					if(curr!=0&&this.data[r][col]!=0&&prev!=0){
						r++;//合并之前，当前不为0，前一个元素不为0，
						//合并之后，当前元素c所在位置也不能为0
					}
				} 
			}
		}
		var end=this.data.toString();
		if(start!=end){//被移动了
			//移动后，生成随机数，更新界面
			this.randomNum();
			this.updateView();
		}
	},
	
	moveDown:function(){/*下移方法*/
		var start=this.data.toString();
		for(var col=0;col<4;col++){
			var row=2;//右移时，第四个格不用检查
			var r=3;//最右侧单元格
			while(row>=0){
				var prev=this.data[row+1][col];//临时存储一个格
				var curr=this.data[row][col];//临时存储当前格
				/*判断当前单元格能否向前移动*/
				if(curr!=0){this.merge(row,col,row+1,col);}
				//如果前一个元素==0，且当前格！=0时，
				//且col+1后<3（不能是最右侧格）
				//则移动后下标退一格
				//其余情况下标都移动到下一格
				if(curr!=0&&prev==0&&(row!=r-1)){
					row++;
				}else{
					row--;
					if(curr!=0&&prev!=0&&this.data[r][col]!==0){
						r--;
					}
				}
			}
		}
		var end=this.data.toString();
		if(start!=end){//被移动了
			//移动后，生成随机数，更新界面
			this.randomNum();
			this.updateView();
		}
	},
	
	merge:function(row,col,prevRow,prevCol){
		/*专门判断任意两个单元格合并的方法
		 * 如果前一个单元格==0，用当前格替换前一个格，将当前格=0
		 * 否则，如果当前格==前一个格，将前一个格*=2，将当前格=0
		 * */
		 if(this.data[prevRow][prevCol]==0){
		 	this.data[prevRow][prevCol]=this.data[row][col];
		 	this.data[row][col]=0;
		 }else if(this.data[prevRow][prevCol]
		 	==this.data[row][col]){
		 	this.data[prevRow][prevCol]*=2;
		 	this.score+=this.data[prevRow][prevCol];  
		 	this.data[row][col]=0;
		 }
	},
	
	 state:1,
	 PLAYING:1,
	 GAMEOVER:0,
	 
	 gameOver:function(){
	 	//如果包含8192，则将游戏的state属性改为this.GAMEOVER
	 	//如果满了，且不能移动！
	 	if(this.has8192()){ 
	 		this.state=this.GAMEOVER;
	 	}else if(this.isFull&&!this.canMove()){
	 		this.state=this.GAMEOVER;
	 	}else{
	 		this.state=this.PLAYING;
	 	}
	 },
	 canMove:function(){
	 	/*现在的数组是否可移动
	 	 
	 	 * Step1：遍历数组的每个元素
	 	 * 每得到一个元素，都要判断该元素是否可以左移，右移，上移，下移
	 	 * 左移：如果当前元素不是最左侧元素，
	 	 * 再如果当前元素左侧的值==当前元素
	 	 * 返回true
	 	 * */
	 	for(var row=0;row<this.data.length;row++){
	 		for(var col=0;col<this.data[row].length;col++){
	 			var curr=this.data[row][col];
	 			if(col!=0){
	 				if(curr==this.data[row][col-1])
	 					return true;
	 			}
	 	/*
	 	 * 右移
	 	 */
	 			if(col!=3){
	 				if(curr==this.data[row][col+1])
	 					return true;
	 			}
	 	/*
	 	 * 上移
	 	 */
	 			
	 			if(row!=0){
	 				if(curr==this.data[row-1][col])
	 					return true;
	 			}
	 	
	 	/*
	 	 * 下移
	 	 */
	 	
	 			if(row!=3 ){
	 				if(curr==this.data[row+1][col])
	 					return true;
	 			}
	 		}
	 	}
	 	
	 },
	 
	 has8192:function(){
	 	//将当前数组转为字符串
	 	//用search方法，检索/(8192,)|(8192)/
	 	//如果用到，返回true；否则，返回false
	 	return this.data.toString().search(/(8192,)|(8192)/)!=-1;
	 }
}

/*窗口加载后自动调用
 * 事件：网页自动触发或人为触发的状态变化
 * onload：当窗口加载完之后，自动触发的事件
 * 事件处理函数：当事件发生后自动调用的函数对象
 * 事件名不符合驼峰名，一律小写。
 */

window.onload/*事件*/=function(){
	game.start();
//	console.log(game.data.toString());
//	game.moveLeft();
//	console.log(game.data.toString());
	 document.onkeydown=function(/*event*/){
	 	if(this.state==this.PLAYING){

			var event=window.event||arguments[0];
		             //IE        //event firefox...
				//从事件对象中获得按键号
			var code=event.keyCode;
			//如果是37号，就执行moveLeft()
			if(code==37){
				game.moveLeft();
			}else if(code==39){
				game.moveRight();
			}else if(code==38){
				game.moveUp();
			}else if(code==40){
				game.moveDown();
			}
		}
	}
}
