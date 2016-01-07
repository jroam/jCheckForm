//jroam开发的一个表单验证jquery插件
/**
需要验证的input必须设置datatype值   
 errormsg 验证不通过时显示的信息  
 errormsg-bj 比较验证失败后显示的提示信息
 idtypes 目前值可以为:ueditor  表示这次验证的是百度编辑器的内容  没有开发

内置类型 int * str float email tel phone  url cn (中文) zh(中文) 还可以是正则表达式

用法例子: 如:
	  int[6-10] 表示验证6至10之间的数字
	  int[5-] 大于等于5  int[-10]小于等于10的数
	  int[-3--1] 验证-3到-1之间的数
	  float[-20] 小于等于20的浮点数
	  str[4-8]4到8位的字符串
	  cn[3-6] 表示3到6个中文字符
	  zh[3-6] 表示3到6个中文字符
	  /[a-z]{3,}/   表示3个及以上的a至z之间的数

		


循环检查，如果第一个不通过就返回false 全部通过返回true

使用实例1:
<form id="#form_add">
<input type="text" datatype="int[1-100]" errormsg="请填写1至100以内的数" name="v1">
</form>

比较关系(比较和id为passd1的值):eq的值将做为jq选择器传入
<input type="text" eq="#passd1" datatype="str[5-20]" errormsg-bj="密码两次不相同,关且密码长度在5至20位之间" name="passd2">

用法示例:
$("#btn_add").click(function(){
			if($("#form_add").jcheckform()){
				$("#form_add").submit();//检查通过就提交表单
			}
			return false;
		});
*/

;(function($){
	$.fn.extend({
		jcheckform:function(optionss){
			return this.joramCheckform(optionss);
		},
		joramCheckform:function(optionss){
			var _self=$(this);
			//初始化参数
			var optionss=$.extend({
				"error":"请填写正确的值",
				"errorbj":"请填写正确的关系值"
			},optionss);
			var flag=true;

			//显示验证失败后的提示信息
			var showtip=function(obj){
				var htm=obj.attr("errormsg");
				obj.focus();
				flag=false;
				if(htm=="" || htm==undefined) htm=optionss["error"];
				alert(htm);
				
				return false;
			}

			//显示比较验证失败后的提示信息
			var showtipbj=function(obj){
				var htm=obj.attr("errormsg-bj");
				obj.focus();
				flag=false;
				if(htm=="" || htm==undefined) htm=optionss["errorbj"];
				alert(htm);
				return false;
			}

			//用正则获取第一个括号里的内容
			var getkuohaostr=function (str,patter)
			{
				if(str=="") return "";
				temp=str.match(patter)
				if(temp!=null){
					if(temp.length>0) return temp[0].replace(patter,"$1");
				}
				return "";
			}

			var getvnvar=function (bj) {
				//如果是input或select就比较其值,如果是其它的就比较html值
				return ($(bj).is("input") || $(bj).is("select"))?$(bj).val():$(bj).html();
			}

			var nanzhenvs=function (yv,bj,gx) {
				//比较两个数的大小，如果都是数字的话，要先转换后再比较，否则就直接比较大小
				
				var bbv=($(bj).is("input") || $(bj).is("select"))?$(bj).val():$(bj).html();
				c=0;
				if($.isNumeric(yv) && $.isNumeric(bbv)){
					yv=parseInt(yv);
					bbv=parseInt(bbv);
					
					if(gx=="gt") c=(yv>bbv)?true:false;
					if(gx=="egt" || gx=="ngt") c=(yv>=bbv)?true:false;
					if(gx=="lt") c=(yv<bbv)?true:false;
					if(gx=="elt" || gx=="nlt") c=(yv<=bbv)?true:false;
				}else{
					if(gx=="gt") c=(yv>bbv)?true:false;
					if(gx=="egt" || gx=="ngt") c=(yv>=bbv)?true:false;
					if(gx=="lt") c=(yv<bbv)?true:false;
					if(gx=="elt" || gx=="nlt") c=(yv<=bbv)?true:false;

				}
				return c;
				
			}


			//获取值的函数,当验证的类型有很多的时候很有必要
			var getobjval=function(obj){
				//没有实现，暂不开放
				// var temp=obj.attr("idtypes");
				// if(temp){
				// 	if(temp.indexOf("ueditor")){
				// 		alert("dfdsd");
				// 		 return UE.getEditor(getkuohaostr(temp,/(\#[\w]+)/)).getContent();
				// 	}
				// }
				
				return obj.val();
			}

			
			//验证比较关系
			var bijiao=function(obj){
				var v=getobjval(obj);

				//验证是否和某一个id的值相等
				var bj=obj.attr("eq");
				if(bj!=undefined) return (v==getvnvar(bj))?true:false;

				var bj=obj.attr("neq");
				if(bj!=undefined) return (v!=getvnvar(bj))?true:false;

				//验证大于
				var bj=obj.attr("gt");
				if(bj!=undefined) return  nanzhenvs(v,bj,"gt");
				
				var bj=obj.attr("ngt");//弃用
				if(bj!=undefined) return (v>=getvnvar(bj))?true:false;

				//验证大于等于
				var bj=obj.attr("egt");
				if(bj!=undefined) return nanzhenvs(v,bj,"egt");

				//验证小于
				var bj=obj.attr("lt");
				if(bj!=undefined) return nanzhenvs(v,bj,"lt");

				//弃用
				var bj=obj.attr("nlt");
				if(bj!=undefined) return (v<=getvnvar(bj))?true:false;

				//验证小于等于
				var bj=obj.attr("elt");
				if(bj!=undefined) return nanzhenvs(v,bj,"elt");

				return true;
			};



			//比较数字范围
			var nz_num=function(v,v1,v2){
				var flag1=false;
				var flag2=false;
				if(v1){
					if(parseFloat(v)>= parseFloat(v1)) flag1=true;
				}else{
					flag1=true;
				}
				if(v2){
					if(parseFloat(v)<= parseFloat(v2)) flag2=true;
				}else{
					flag2=true;
				}
				return ( flag1 && flag2)?true:false;
			}

			var nz_str=function(v,v1,v2){
				var flag1=false;
					var flag2=false;

					if(!v1) v1="0";
					if(!v2) v2="";
					var strlen=v.length;
					if(v1){
						if(strlen>=parseInt(v1)) flag1=true;
					}else{
						flag1=true;
					}

					if(v2!=""){
						if(strlen<=parseInt(v2)) flag2=true;
					}else{
						flag2=true;
					}
					return ( flag1 && flag2)?true:false;
			}

			
			//验证范围
			var fanwei=function(str,v){

				//数字大小范围验证格式
				if(str.match(/^(int|float)\[[\-]*[\d]*\-[\-]*[\d]*\]/)){
					var newstr=str.replace(/^(int|float)\[/,"").replace("]","");;
					var v1=newstr.replace(/\-[\-]*[\d]+$/,"");
					var v2=newstr.replace(/^[\-]*[\d]+\-/,"");
					return nz_num(v,v1,v2);
					
				}

				//验证字符串的长度
				if(str.match(/^(\*|str)\[[\d]*\-[\d]*\]/)){
					var newstr=str.replace(/^(\*|str)\[/,"").replace("]","");;
					var v1=newstr.replace(/\-[\d]*$/,"");
					var v2=newstr.replace(/^[\d]*\-/,"");
					return nz_str(v,v1,v2);
				}

				//验证中文
				if(str.match(/^(cn|zh)\[[\d]*\-[\d]*\]/)){
					var newstr=str.replace(/^(cn)\[/,"").replace("]","");;
					var v1=newstr.replace(/\-[\d]*$/,"");
					var v2=newstr.replace(/^[\d]*\-/,"");
					return nz_str(v,v1,v2);
				}

				return true;
			}

			
			//正式验证
			var nzrun=function(obj){
				var datatype=obj.attr("datatype");
				
				if(datatype==undefined) return undefined;
				var v=getobjval(obj);
				if(v==null) v=optionss["error"];
				
				//任意字符
				if(datatype.match(/^\*/)){
					if(v=="") return false;
				}
				if(datatype.match(/^str/)){
					if(!v.match(/^[\w\W]+$/)) if(!showtip(obj)) return false;
				}

				if(datatype.match(/^int/)){
					if(!v.match(/^[\-]*[\d]+$/)) if(!showtip(obj)) return false;
				}
				if(datatype.match(/^float/)){
					if(!v.match(/^[\d]+(\.[\d]+)*$/)) if(!showtip(obj)) return false;
				}

				if(datatype.match(/^email/)){
					if(!v.match(/^[\w\-\.]+@[\w\-\.]+\.[\w]+$/)) if(!showtip(obj)) return false;
				}

				if(datatype.match(/^date/)){
					if(!v.match(/^[\d]{2,4}\-[\d]{1,2}\-[\d]{1,2}/)) if(!showtip(obj)) return false;
				}

				if(datatype.match(/^tel/)){
					if(!v.match(/^[\d\-]{10,15}$/)) if(!showtip(obj)) return false;
				}
				if(datatype.match(/^phone/)){
					if(!v.match(/^1\d{10}$/)) if(!showtip(obj)) return false;
				}
				if(datatype.match(/^url/)){
					if(!v.match(/^(\w+:\/\/)?\w+(\.\w+)+.*$/)) if(!showtip(obj)) return false;
				}

				//验证是否是中文
				if(datatype.match(/^(cn|zh)$/)){
					var reg = /^[\u4E00-\u9FA5]+$/;
					if(!v.match(reg)) if(!showtip(obj)) return false;
				}

				//范围验证
				if(!fanwei(datatype,v)) if(!showtip(obj)) return false;

				//如果是正则表式
				if(datatype.match(/^\//)){
					if(!v.match(eval(datatype))) if(!showtip(obj)) return false;
				}

				//验证比较关系
				if(bijiao(obj)!=true) if(!showtipbj(obj)) return false;;

			}

			//验证入口
			$(this).find(":input[datatype!='']").each(function(){
				//不为空时的验证
				flag=nzrun($(this));
				if(flag==false) return false;
			});
			if(flag!=false) flag= true;
			return flag;
		}

	})
})(jQuery);
