
/// <reference path="jquery.d.ts" />

class App {
	m : TwitterModel;
	v : TwitterView;
	c : TwitterController;

	constructor(){
		this.m = new TwitterModel();
		this.v = new TwitterView();
		this.c = new TwitterController(this.m, this.v);
		
	}
}

class TwitterModel {
	constructor(){
	}

	public search(id:string, successFunc:any, errorFunc:any) {
		// validate id
		if(id.length == 0){
			errorFunc("ID is not inputted...");
		}

		var url = "http://api.twitter.com/1/statuses/user_timeline/" + id + ".json?callback=?&suppress_response_codes=true";

		$.getJSON(url, function(data){
			if(data.error == undefined){
				successFunc(data);
			}else{
				errorFunc("Data was not found...");
			}
		});
	}
}

class TwitterView {
	// view items
	idText : JQuery;
	searchBtn : JQuery;
	resultList : JQuery;

	messageDialog : JQuery;
	errorDialog : JQuery;
	closeBtn : JQuery;
	errorMessage : JQuery;

	constructor(){
		this.idText = $("#idText");
		this.searchBtn = $("#searchBtn");
		this.resultList = $("#resultList");
		this.errorDialog = $("#errorDialog");
		this.closeBtn = $("#closeBtn");
		this.errorMessage = $("#errorMessage");
		this.messageDialog = $("#messageDialog");

		this.messageDialog.hide();
		this.errorDialog.hide();
		this.closeBtn.on("click", ()=> this.errorDialog.hide());
	}

	public getId():string{
		return this.idText.val();
	}

	public getSearchButton():JQuery{
		return this.searchBtn;
	}

	public showError(message:string){
		this.errorMessage.html(message);
		this.errorDialog.show();
	}

	public startLoading(){
		this.messageDialog.show();
	}

	public endLoading(){
		this.messageDialog.hide();
	}

	public clear(){
		this.resultList.html("");
	}

	public render(results:any){
		// ごちゃごちゃしすぎた(´・ω・｀)
		if(results.length == 0){
			this.showError("Not exists data...");
			return;
		}
		var li = "";
		var color = "";
		var blue = "bg-color-blueDark";
		var green = "bg-color-greenDark";
		$.each(results, (i, item)=>{
			var imageUrl = item.user.profile_image_url;
			var userScreenName = item.user.screen_name;
			var userName = item.user.name;
			var tweet = item.text;
			var createDate = this.convertDateString(item.created_at);

			if(i % 2 == 0){
				color = blue;
			}else{
				color = green;
			}
			li += "<li class=\""+ color + " fg-color-white\">";
			li += "<div class=\"icon\"><img src=\"" + imageUrl + "\"/></div>";
			li += "<div class=\"data\">"
			li += "<p><b>" + userScreenName + "</b></p>";
			li += "<p>" + tweet + "</p>";
			li += "<p>Posted:" + createDate + "</p>";
			li += "</div></li>";
		});
		this.resultList.append(li);
	}

	private convertDateString(dateString){
		var date = new Date(dateString);
        return date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate()+" "+date.getHours()+":"+date.getMinutes();
    }
}

class TwitterController {
	model : TwitterModel;
	view : TwitterView;

	constructor(model:TwitterModel, view:TwitterView){
		this.model = model;
		this.view = view;

		this.view.getSearchButton().on("click", ()=> this.search());
	}

	public search(){
		this.view.clear();
		this.view.startLoading();

		var successFunc = (data)=>{
			this.view.render(data);
			this.view.endLoading();
		};
		var errorFunc = (error)=>{
			this.view.showError(error);
			this.view.endLoading();
		};
		this.model.search(this.view.getId(), successFunc, errorFunc);
	}
}

// start
$(function(){
	var app = new App();
});