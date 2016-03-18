var ModalContainer = React.createClass({
	getInitialState:function(){
		return{
			show:false
		}
	},
	_createChainedFunction:function(one, two){
		var hasOne = typeof one === 'function';
		var hasTwo = typeof two === 'function';
		if (!hasOne && !hasTwo) {
			return null;
		}
		if (!hasOne) {
			return two;
		}
		if (!hasTwo) {
			return one;
		}
		return function chainedFunction() {
			one.apply(this, arguments) === false || two.apply(this, arguments);
		};
	},
	componentDidMount: function() {
		//初始化弹出层的容器
		this.popMask = document.createElement("div");
		this.popContent=document.createElement("div");
		this.popMask.setAttribute("style","width:100%;height:100%;top:0px;bottom:0;left:0px;right:0; z-index:100;position:fixed; opacity:.5;filter:alpha(opacity=50);background-color:#000;");
		this.popContent.setAttribute("style","width:100%;height:100%;top:0px;bottom:0;left:0px;right:0; z-index:100;position:fixed;overflow:auto;");
		document.body.appendChild(this.popMask);
		document.body.appendChild(this.popContent);
		this.popMask.style.display=this.state.show?"":"none";
		this.popContent.style.display=this.state.show?"":"none";
	},
  //对话框打开时触发
  _openHandler:function(){
  	this.props.openHandler&&this.props.openHandler();
  },
  //对话框关闭时触发
  _closeHandler:function(){
  	this.props.closeHandler&&this.props.closeHandler();
  },
  componentDidUpdate:function(){
  	var self=this;

  	//mask的显示与隐藏
	this.popMask.style.display=this.state.show?"":"none";
	this.popContent.style.display=this.state.show?"":"none";
	
	if(this.state.show){
		//渲染dialog
		var props=JSON.parse(JSON.stringify(this.props.modal.props));
		props.closeClick=function(){
			self.setState({show:false});
		}
		var modal=React.cloneElement(this.props.modal,props);
		ReactDOM.render(modal,this.popContent);
		
		//修正弹出的dialog位置
		var $popContent=jQuery( ReactDOM.findDOMNode(this.popContent).children[0]);
		var top=$popContent.height()/2+50;
		var left=$popContent.width()/2;
		$popContent.css('margin','-'+top+'px 0 0 -'+left+'px');
		this._openHandler();
	}else{
		this._closeHandler();
	}
  },
  _toggle:function(){
  	this.setState({show:!this.state.show});
  },
  render: function() {
    if(this.props.children){
    	var popTrigger=this.props.children;
    	var props=JSON.parse(JSON.stringify(this.props.children.props));
    	props.onClick=this._createChainedFunction(this.props.children.props.onClick,this._toggle);
    	return React.cloneElement(this.props.children,props);
    }else{
    	return null;
    }
  },
});
module.exports.ModalContainer=ModalContainer;
/***eg
var TestPop=React.createClass({
	render:function(){
		var style={
	  		width:500+'px',
	  		height:500+'px',
	  		backgroundColor:'#fff',
	  		top:50+'%',
	  		left:50+'%',
	  		position:'absolute'
	  	}
		return <div style={style}>1234     <input type="button" value="ttt" onClick={this.props.closeClick}/> </div>
	}
})
var Dialog = React.createClass({
  render: function() {
  	var testPop=<TestPop ></TestPop>
    return (
		<ModalContainer modal={testPop} openHandler={function(){console.log('1');}} closeHandler={function(){console.log('2');}}>
			<a >测试</a>			
		</ModalContainer>
    );
  }
});
ReactDOM.render(<Dialog />,document.getElementsByClassName('layout')[1]);
**/