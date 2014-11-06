//jroam开发的一个表单验证jquery插件
/**
需要验证的input必须设置datatype值   errormsg 验证不通过时显示的信息  
 errormsg-bj 比较验证失败后显示的提示信息

内置类型 int * str float email tel phone  url  可以是正则表达式
循环检查，如果第一个不通过就返回false 全部通过返回true

主要是用:$("#form_add").jroamCheckform() 来验证
用法示例:
$("#btn_add").click(function(){
			if($("#form_add").joramCheckform()){
				$("#form_add").submit();//检查通过就提交表单
			}
			return false;
		})


*/

;(function($){
	$.fn.extend({
		jroamCheckform:function(optionss){
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

			

			
			//验证比较关系
			var bijiao=function(obj){
				var v=obj.val();

				
				//验证是否和某一个id的值相等
				var bj=obj.attr("eq");
				if(bj!=undefined) return (v==$("#"+bj).val())?true:false;

				var bj=obj.attr("neq");
				if(bj!=undefined) return (v!=$("#"+bj).val())?true:false;

				//验证大于
				var bj=obj.attr("gt");
				if(bj!=undefined) return (v>$("#"+bj).val())?true:false;
				//验证大于等于
				var bj=obj.attr("ngt");
				if(bj!=undefined) return (v>=$("#"+bj).val())?true:false;

				//验证小于
				var bj=obj.attr("lt");
				if(bj!=undefined) return (v<$("#"+bj).val())?true:false;

				//验证小于等于
				var bj=obj.attr("nlt");
				if(bj!=undefined) return (v<=$("#"+bj).val())?true:false;


				return true;


			};


			
			//正式验证
			var nzrun=function(obj){
				var datatype=obj.attr("datatype");
				
				if(datatype==undefined) return undefined;
				var v=obj.val();
				if(v==null) v=optionss["error"];
				
				//任意字符
				if(datatype.match(/^\*/)){
					if(v=="") return false;
				}
				if(datatype.match(/^str/)){
					if(!v.match(/^[\w\W]+$/)) if(!showtip(obj)) return false;
				}

				if(datatype.match(/^int/)){
					if(!v.match(/^[\d]+$/)) if(!showtip(obj)) return false;
				}
				if(datatype.match(/^email/)){
					if(!v.match(/^[\w\-\.]+@[\w\-\.]+\.[\w]+$/)) if(!showtip(obj)) return false;
				}

				if(datatype.match(/^date/)){
					if(!v.match(/^[\d]{2,4}\-[\d]{1,2}\-[\d]{1,2}/)) if(!showtip(obj)) return false;
				}

				if(datatype.match(/^tel/)){
					if(!v.match(/^[+]{0,1}(\d){2,3}[ ]?([-]?(\d){1,12})+$/)) if(!showtip(obj)) return false;
				}
				if(datatype.match(/^phone/)){
					if(!v.match(/^1\d{10}$/)) if(!showtip(obj)) return false;
				}
				if(datatype.match(/^url/)){
					if(!v.match(/^(\w+:\/\/)?\w+(\.\w+)+.*$/)) if(!showtip(obj)) return false;
				}

				//如果是正则表式
				if(datatype.match(/^\//)){
					if(!v.match(eval(datatype))) if(!showtip(obj)) return false;
				}


				//验证比较关系
				if(bijiao(obj)!=true) if(!showtipbj(obj)) return false;;

			}

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
