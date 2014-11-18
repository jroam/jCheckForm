jCheckForm
==========
//jroam开发的一个表单验证jquery插件
/**
需要验证的input必须设置datatype值   errormsg 验证不通过时显示的信息  
 errormsg-bj 比较验证失败后显示的提示信息

内置类型 int * str float email tel phone  url  可以是正则表达式
循环检查，如果第一个不通过就返回false 全部通过返回true

关系验证:eq  比较相等，如:eq="password" 就表示和password的id相比较值

主要是用:$("#form_add").jcheckform() 来验证
用法示例:
$("#btn_add").click(function(){
			if($("#form_add").jcheckform()){
				$("#form_add").submit();//检查通过就提交表单
			}
			return false;
		})


*/