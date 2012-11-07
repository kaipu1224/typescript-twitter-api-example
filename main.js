var App = (function () {
    function App() {
        this.m = new TwitterModel();
        this.v = new TwitterView();
        this.c = new TwitterController(this.m, this.v);
    }
    return App;
})();
var TwitterModel = (function () {
    function TwitterModel() {
    }
    TwitterModel.prototype.search = function (id, successFunc, errorFunc) {
        if(id.length == 0) {
            errorFunc("ID is not inputted...");
        }
        var api = "http://api.twitter.com/1/statuses/user_timeline/" + id + ".json?callback=?";
        console.log("search : " + api);
        $.getJSON(api, function (data) {
            successFunc(data);
        });
    };
    return TwitterModel;
})();
var TwitterView = (function () {
    function TwitterView() {
        var _this = this;
        this.idText = $("#idText");
        this.searchBtn = $("#searchBtn");
        this.resultList = $("#resultList");
        this.errorDialog = $("#errorDialog");
        this.closeBtn = $("#closeBtn");
        this.errorMessage = $("#errorMessage");
        this.messageDialog = $("#messageDialog");
        this.messageDialog.hide();
        this.errorDialog.hide();
        this.closeBtn.on("click", function () {
            return _this.errorDialog.hide();
        });
    }
    TwitterView.prototype.getId = function () {
        return this.idText.val();
    };
    TwitterView.prototype.getSearchButton = function () {
        return this.searchBtn;
    };
    TwitterView.prototype.showError = function (message) {
        this.errorMessage.html(message);
        this.errorDialog.show();
    };
    TwitterView.prototype.startLoading = function () {
        this.messageDialog.show();
    };
    TwitterView.prototype.endLoading = function () {
        this.messageDialog.hide();
    };
    TwitterView.prototype.clear = function () {
        this.resultList.html("");
    };
    TwitterView.prototype.render = function (results) {
        var _this = this;
        if(results.length == 0) {
            this.showError("Not exists data...");
        }
        var li = "";
        var color = "";
        var blue = "bg-color-blueDark";
        var green = "bg-color-greenDark";
        $.each(results, function (i, item) {
            var imageUrl = item.user.profile_image_url;
            var userScreenName = item.user.screen_name;
            var userName = item.user.name;
            var tweet = item.text;
            var createDate = _this.convertDateString(item.created_at);
            if(i % 2 == 0) {
                color = blue;
            } else {
                color = green;
            }
            li += "<li class=\"" + color + " fg-color-white\">";
            li += "<div class=\"icon\"><img src=\"" + imageUrl + "\"/></div>";
            li += "<div class=\"data\">";
            li += "<p><b>" + userScreenName + "</b></p>";
            li += "<p>" + tweet + "</p>";
            li += "<p>Posted:" + createDate + "</p>";
            li += "</div></li>";
        });
        this.resultList.append(li);
    };
    TwitterView.prototype.convertDateString = function (dateString) {
        var date = new Date(dateString);
        return date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes();
    };
    return TwitterView;
})();
var TwitterController = (function () {
    function TwitterController(model, view) {
        var _this = this;
        this.model = model;
        this.view = view;
        this.view.getSearchButton().on("click", function () {
            return _this.search();
        });
    }
    TwitterController.prototype.search = function () {
        var _this = this;
        this.view.clear();
        this.view.startLoading();
        var successFunc = function (data) {
            _this.view.render(data);
            _this.view.endLoading();
        };
        var errorFunc = function (error) {
            _this.view.showError(error);
        };
        this.model.search(this.view.getId(), successFunc, errorFunc);
    };
    return TwitterController;
})();
$(function () {
    var app = new App();
});
