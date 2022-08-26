var ton = sessionStorage.getItem("ton"); // colid的值
// colid的值
var pageNums = 0; // 总页数

//弹出隐藏层
function ShowDiv(show_div) {
	document.getElementById(show_div).style.display = 'block';
};

//关闭弹出层
function CloseDiv(show_div) {
	document.getElementById(show_div).style.display = 'none';
	// 一级目录的id
};
$(document).ready(function() {

	ajax1();
	pageReady(pageNums);
	ajax2(1);

	$('body').on('mouseover', '.simg', function() {
		$(this).siblings('.simg1').css("display", "block");
	});
	$('body').on('mouseout', '.simg', function() {
		$(this).siblings('.simg1').css("display", "none");
	});

	// 添加
	$('#button1').click(function() {
		$('#in_advertising_id').val(null);
		$('#in_advertising_imgUrl').val(null);
		$('#in_advertising_linkUrl').val(null);
		$('#in_advertising_conRemark').val(null);
		$('#comment').css("display", "block");
	});
	// 取消
	$('#push_qx').click(function() {
		$('#comment').css("display", "none");
	});
	// 提交
	$('#push_asd').click(function() {
		addBannerCont();
	});
	// 修改
	$('body').on('click', '.tupdate', function() {
		var id = getnum(this, 0); // id
		var imgUrl = $(this).parent().parent().children().eq(1).children('.simg').attr("src"); //图片路径
		var linkUrl = getnum(this, 7); // 商家链接
		var remark = getnum(this, 6); // 描述
		var site = getnum(this, 8); // 所在位置
		$('#in_advertising_id').val(id);
		$('#in_advertising_imgUrl').val(imgUrl);
		$('#in_advertising_linkUrl').val(linkUrl);
		$('#in_advertising_conRemark').val(remark);
		document.getElementsByClassName('sels')[site].selected = true; // 设置特定的值为下拉框的选中值
		$('#comment').css("display", "block");
	});
	// 删除 
	$('body').on('click', '.tdel', function() {
		if(confirm('确定删除吗？')) {
			var id = getnum(this, 0); // id
			$.ajax({
				type: "post",
				url: getRequestIp() + "delAdvertising",
				async: true,
				data: {
					'id': id
				},
				dataType: "json",
				success: function(data) {
					if(data.success) {
						alert('删除成功!');
						ajax1();
						pageReady(pageNums);
						ajax2(1);
					} else {
						alert('删除失败!');
					}
				}
			});
		}

	});
});
// 添加内容
function addBannerCont() {
	var form = document.getElementById("advertising_form");
	var fo = new FormData(form);
	$.ajax({
		type: "post",
		url: getRequestIp() + "addAdvertising",
		async: true,
		data: fo,
		dataType: "json",
		processData: false, // 告诉jquery 不要去出入发送的数据
		contentType: false, // 告诉jquery不要去设置content-Type的请求头
		success: function(data) {
			if(data.success) {
				alert('添加成功!');
				$('#comment').css("display", "none");
				ajax1();
				pageReady(pageNums);
				ajax2(1);
			} else {
				alert('添加失败!');
			}
		}
	});
}
// 获取对象的某个值
function getnum(obj, num) {
	return $(obj).parent().parent().children().eq(num).text();
}

// 得到数据的总页数
function ajax1() {
	$.ajax({
		type: "post",
		url: getRequestIp() + "getAllAdvertisingByPage",
		data: {
			'limit': 10,
			'page': 0
		},
		async: true,
		dataType: "json",
		success: function(data) {
			var totalSize = data.totalElements;
			var tsize = totalSize / 10;
			pageNums = Math.ceil(tsize);
			pageReady(pageNums);
		},
		error: function(data) {
			alert("服务器异常!")
		}

	});
}
//渲染数据
function ajax2(clickPage) {
	if(clickPage == undefined) {
		clickPage = 1;
	}
	$('.table tr td').remove();
	$.ajax({
		type: "post",
		url: getRequestIp() + "getAllAdvertisingByPage",
		data: {
			'limit': 10,
			'page': clickPage - 1,
		},
		async: true,
		dataType: "json",
		success: function(data) {
			console.log(data.content);
			var item = "";
			$.each(data.content, function(i, result) {
				var remark = result.remark;
				var linkUrl = result.linkUrl;
				if(linkUrl != null) {
					if(linkUrl.length > 30) {
						linkUrl = linkUrl.slice(0, 30);
					}
				}
				if(remark != null) {
					if(remark.length > 15) {
						remark = remark.slice(0, 15);
					}
				}

				item += '<tr>'
				item += '<td class="tid">' + result.id + '</td>'
				item += '<td class="timg"><img class="simg" src="' + result.imgUrl + '" /><img style="position:absolute;left: 180px;" class="simg1" src="' + result.imgUrl + '" /></td>'
				item += '<td>' + linkUrl + '</td>'
				if(result.site == 0) {
					item += '<td>' + "页面上方" + '</td>'
				} else if(result.site == 1) {
					item += '<td>' + "页面左边" + '</td>'
				} else if(result.site == 2) {
					item += '<td>' + "页面右边" + '</td>'
				}

				item += '<td class="banner_remark">' + remark + '</td>'
				item += '<td>'
				item += '<img class="tupdate" src="img/update.png" title="修改" />&nbsp;&nbsp;'
				item += '<img class="tdel" src="img/delete.png" title="删除" /> &nbsp;'
				item += '</td>'
				item += '<td style="display: none;">' + result.remark + '</td>'
				item += '<td style="display: none;">' + result.linkUrl + '</td>'
				item += '<td style="display: none;">' + result.site + '</td>'
				item += '</tr>';
			});
			$('.table').append(item);
		},
		error: function(data) {
			//			alert("服务器异常!")
		}

	});
}
// 分页插件
var pageNavObj = null;

function pageReady(pageNums) {
	//初始化
	//pageNavCreate("PageNav",200,1,pageNavCallBack);
	pageNavObj = new PageNavCreate("PageNavId", {
		pageCount: pageNums, //总页数
		currentPage: 1, //当前页
		perPageNum: 5, //每页按钮数
	})
	pageNavObj.afterClick(pageNavCallBack);
};
//			jQuery(document).ready(function($) {
//				alert(pageNums)
//				//初始化
//				//pageNavCreate("PageNav",200,1,pageNavCallBack);
//				pageNavObj = new PageNavCreate("PageNavId", {
//					pageCount: pageNums, //总页数
//					currentPage: 1, //当前页
//					perPageNum: 5, //每页按钮数
//				});
//				pageNavObj.afterClick(pageNavCallBack);
//			});

//翻页按钮点击后触发的回调函数
function pageNavCallBack(clickPage) {
	//clickPage是被点击的目标页码
	ajax2(clickPage);
	//一般来说可以在这里通过clickPage,执行AJAX请求取数来重写页面

	//最后别忘了更新一遍翻页导航栏
	//pageNavCreate("PageNav",pageCount,clickPage,pageNavCallBack);
	pageNavObj = new PageNavCreate("PageNavId", {
		pageCount: getPageSet().pageCount, //总页数
		currentPage: clickPage, //当前页
		perPageNum: getPageSet().perPageNum, //每页按钮数
	});
	pageNavObj.afterClick(pageNavCallBack);
}

function getPageSet() {
	var obj = {
		pageCount: null, //总页数
		currentPage: null, //当前页
		perPageNum: null, //每页按钮数
	}
	if($("#testPageCount").val() && !isNaN(parseInt($("#testPageCount").val()))) {
		obj.pageCount = parseInt($("#testPageCount").val());
	} else {
		obj.pageCount = parseInt($(".page-input-box > input").attr("placeholder"));
	}

	if($("#testCurrentPage").val() && !isNaN(parseInt($("#testCurrentPage").val()))) {
		obj.currentPage = parseInt($("#testCurrentPage").val());
		obj.currentPage = (obj.currentPage <= obj.pageCount ? obj.currentPage : obj.pageCount);
	} else {
		obj.currentPage = 1;
	}

	if($("#testPerPageNum").val() && !isNaN(parseInt($("#testPerPageNum").val()))) {
		obj.perPageNum = parseInt($("#testPerPageNum").val());
	} else {
		obj.perPageNum = null;
	}

	return obj;
}

$(function() {
	$('.summernote').summernote({
		height: 350,
		tabsize: 2,
		lang: 'zh-CN'
	});
});