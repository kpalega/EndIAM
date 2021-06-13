
//function to load background image
function imageLoad(url){
    var image = new Image()
    image.src = url
    image.onload = function(){
        var pattern = c.createPattern(this, "repeat")
        c.fillStyle = pattern
    }
}