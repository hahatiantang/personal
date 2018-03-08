(function ($) {
    $.Carousel = function () {
        let $bannerList = $(".bannerList");  //banner图
        let $ListItem = $(".bannerList .bannerItem");  //banner Item
        let ItemWidth = 0;  //bannerItem宽度
        let startPoistion = 0; //手指按下位置
        let endPosition = 0; //手指抬起位置
        let pullX = 0; //拖动距离
        let curIndex = 0; //手指按下当前banner下标
        let startBannerLeft = 0; //banner起始位置
        let endBannerLeft = 0; //banner结束位置
        let timer = null;

        //根据banner图多少插入dot
        let $bannerDot = $("<ul>").addClass("bannerDot");
        for(let i=0; i<$ListItem.length; i++){
            var $dotItem = $("<li>").appendTo($bannerDot).addClass("dotItem");
        }
        $bannerDot.appendTo($(".banner"));
        $bannerDot.css("width", $bannerDot.find("li").outerWidth(true)*$ListItem.length);

        //拖拉转换banner
        $ListItem.on("touchstart", function (ev) {
            $bannerList.css("transition", "none");
            startPoistion = ev.originalEvent.changedTouches[0].clientX;
            ItemWidth = $ListItem.width();
            startBannerLeft = $bannerList.offset().left;
            curIndex = $(this).index()
            clearInterval(timer);

            $ListItem.off("touchmove").on("touchmove", function (ev) {
                $bannerList.css("transition", "none");
                pullX = ev.originalEvent.changedTouches[0].clientX - startPoistion;
                $bannerList.css("left", pullX + startBannerLeft);
            });

            $ListItem.off("touchend").on("touchend", function (ev) {
                endPosition = ev.originalEvent.changedTouches[0].clientX;
                $bannerList.css("transition", "0.5s");
                endBannerLeft = $bannerList.offset().left;
                let bannerWidth = $ListItem.width()*2;
                let disX = endPosition - startPoistion;
                if( endBannerLeft >= 0 ){
                    $bannerList.css("left", "0");
                    curIndex = 0;
                }else if( endBannerLeft <= -bannerWidth ){
                    $bannerList.css("left", -bannerWidth);
                    curIndex = $ListItem.length - 1;
                }else if( disX > 0 &&  disX > ItemWidth/2 ){
                    $bannerList.css("left", startBannerLeft+ItemWidth);
                    curIndex --;
                }else if( disX < 0 &&  disX < -ItemWidth/2){
                    $bannerList.css("left", (startBannerLeft-ItemWidth));
                    curIndex ++;
                }else{
                    $bannerList.css("left", startBannerLeft);
                    curIndex = curIndex;
                }
                console.log(curIndex)
                $dot.eq(curIndex).addClass("activity").siblings("li").removeClass("activity");
                timer = setInterval(function () {
                    timeCarousel();
                },2000);
            });
            return false;
        });

        //定时器进行轮播
        var listWidth = $ListItem.width();
        var $dot = $bannerDot.find("li");
        $dot.eq(curIndex).addClass("activity").siblings("li").removeClass("activity"); //初始化dot的颜色。
        $bannerList.css("left", "0"); //初始化轮播位置。
        //开启定时器
        timer = setInterval(function () {
            timeCarousel();
        },2000);

        //轮播函数
        function timeCarousel() {
            var curLeft = $bannerList.offset().left;
            if( parseInt(curLeft) <= -parseInt(($ListItem.length-1)*listWidth)){
                $bannerList.css("left", "0");
                curIndex = 0;
                $dot.eq(curIndex).addClass("activity").siblings("li").removeClass("activity");
            }else{
                $bannerList.css("left", -(curIndex+1)*listWidth);
                curIndex++;
                $dot.eq(curIndex).addClass("activity").siblings("li").removeClass("activity");
            }
        }
    }
})(jQuery);
