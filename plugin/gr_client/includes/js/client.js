star_symbol = "⭐"
apiKey = jQuery( '#apiKey' ).text();
placeID = jQuery( '#placeID' ).text();
var request = {
  placeId: placeID
};

service = new google.maps.places.PlacesService(map);
service.getDetails(request, processAPIResponse);

function processAPIResponse(place, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    rawReviews = place['reviews'];
    RenderPage(rawReviews);
  }
}
// Manipulate DOM
function RenderPage(reviews){
  for (i = 0; i < reviews.length; i++){
    createReviewObj(reviews[i], i, function(reviewObject){
      // debug
      console.log(reviewObject)
      var reviewWrapper = document.createElement("div")
      reviewWrapper.id = 'reviewWrapper' + reviewObject.id
      reviewWrapper.className = 'panel panel-default'
      $('.reviews').append(reviewWrapper)
      $('#reviewWrapper' + reviewObject.id).addClass('panel panel-default')

      var panelBody = document.createElement("div")
      panelBody.className = 'panel-body'
      panelBody.id = 'panel-body' + reviewObject.id
      $('#reviewWrapper' + reviewObject.id).append(panelBody)
      var panelFooter = document.createElement("div")
      panelFooter.className = 'panel-footer'
      panelFooter.id = 'panel-footer' + reviewObject.id
      $('#reviewWrapper' + reviewObject.id).append(panelFooter)
      // insert user picture
      var image = document.createElement("img")
      image.src = reviewObject.author.imageUrl
      image.id = 'profilePicture'
      $('#panel-body'+ reviewObject.id).append(image)
      // insert rating
      var rating = document.createElement("div")
      rating.id = 'rating'
      rating.innerHTML = star_symbol.repeat(reviewObject.rating)
      $('#panel-body'+ reviewObject.id).append(rating)
      // insert date
      var date = document.createElement("div")
      date.id = 'date'
      date.innerHTML = getFormatedDate(reviewObject.time)
      $('#panel-body'+ reviewObject.id).append(date)
      // insert author
      var author = document.createElement("div")
      author.id = 'author'
      author.innerHTML = reviewObject.author.name
      $('#panel-body'+ reviewObject.id).append(author)
      // insert review
      var review = document.createElement("div")
      review.id = 'review'
      review.innerHTML = reviewObject.text
      $('#panel-footer'+ reviewObject.id).append(review)
      });
  }
}
// Merge review and user data in one object
function createReviewObj(review,id,callback){
  getUserPicture(review, apiKey, function(review, userPicUrl){
    console.log(review)
    var processedReview = new Review();
    processedReview.text = review.text
    processedReview.id = id
    processedReview.rating = review.rating
    processedReview.time = review.time
    var author = new Author();
    author.name = review.author_name
    author.imageUrl = userPicUrl
    processedReview.author = author
    callback(processedReview)
  });
}
function getUserPicture(review, api_key, callback){
  gapi.client.setApiKey(api_key);
  getAuthorId(review.author_url, function(author_id){
    gapi.client.load('plus', 'v1').then(function() {
      var request = gapi.client.plus.people.get({
              'userId': author_id
            });
      request.then(function(resp){
        console.log(resp.result.image.url)
        callback(review, resp.result.image.url);
      });
    }, function(reason) {
              console.log('Error: ' + reason.result.error.message); });
  });
}
function getAuthorId(author_url, callback){
  var author_url = document.createElement('a');
  author_url.href = rawReviews[i].author_url
  var author_id = author_url.pathname.replace('/', "")
  callback(author_id);
}
function Review(author, text, id, rating, time){
  this.author = author;
  this.text = text;
  this.id = id;
  this.rating = rating;
  this.time = time;
}
function Author(name, imageUrl, link){
  this.name = name;
  this.imageUrl = imageUrl;
  this.link = link;
}
function getFormatedDate(date){
  // debug
  var d = new Date(0);
  d.setUTCSeconds(date)
  console.log(formatDate(d, "d MMM yyyy"))
  return formatDate(d, "d MMM yyyy");
}

function formatDate(date, format, utc) {
    // var MMMM = ["\x00", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    // var MMM = ["\x01", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    // var dddd = ["\x02", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    // var ddd = ["\x03", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var MMMM = ["\x00", "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
    var MMM = ["\x01", "Янв", "Фев", "Март", "Апр", "Май", "Июнь", "Июль", "Авг", "Сен", "Окт", "Нояб", "Дек"];
    var dddd = ["\x02", "Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
    var ddd = ["\x03", "Вск", "Пон", "Вт", "Среда", "Чет", "Пят", "Суб"];

    function ii(i, len) {
        var s = i + "";
        len = len || 2;
        while (s.length < len) s = "0" + s;
        return s;
    }

    var y = utc ? date.getUTCFullYear() : date.getFullYear();
    format = format.replace(/(^|[^\\])yyyy+/g, "$1" + y);
    format = format.replace(/(^|[^\\])yy/g, "$1" + y.toString().substr(2, 2));
    format = format.replace(/(^|[^\\])y/g, "$1" + y);

    var M = (utc ? date.getUTCMonth() : date.getMonth()) + 1;
    format = format.replace(/(^|[^\\])MMMM+/g, "$1" + MMMM[0]);
    format = format.replace(/(^|[^\\])MMM/g, "$1" + MMM[0]);
    format = format.replace(/(^|[^\\])MM/g, "$1" + ii(M));
    format = format.replace(/(^|[^\\])M/g, "$1" + M);

    var d = utc ? date.getUTCDate() : date.getDate();
    format = format.replace(/(^|[^\\])dddd+/g, "$1" + dddd[0]);
    format = format.replace(/(^|[^\\])ddd/g, "$1" + ddd[0]);
    format = format.replace(/(^|[^\\])dd/g, "$1" + ii(d));
    format = format.replace(/(^|[^\\])d/g, "$1" + d);

    var H = utc ? date.getUTCHours() : date.getHours();
    format = format.replace(/(^|[^\\])HH+/g, "$1" + ii(H));
    format = format.replace(/(^|[^\\])H/g, "$1" + H);

    var h = H > 12 ? H - 12 : H == 0 ? 12 : H;
    format = format.replace(/(^|[^\\])hh+/g, "$1" + ii(h));
    format = format.replace(/(^|[^\\])h/g, "$1" + h);

    var m = utc ? date.getUTCMinutes() : date.getMinutes();
    format = format.replace(/(^|[^\\])mm+/g, "$1" + ii(m));
    format = format.replace(/(^|[^\\])m/g, "$1" + m);

    var s = utc ? date.getUTCSeconds() : date.getSeconds();
    format = format.replace(/(^|[^\\])ss+/g, "$1" + ii(s));
    format = format.replace(/(^|[^\\])s/g, "$1" + s);

    var f = utc ? date.getUTCMilliseconds() : date.getMilliseconds();
    format = format.replace(/(^|[^\\])fff+/g, "$1" + ii(f, 3));
    f = Math.round(f / 10);
    format = format.replace(/(^|[^\\])ff/g, "$1" + ii(f));
    f = Math.round(f / 10);
    format = format.replace(/(^|[^\\])f/g, "$1" + f);

    var T = H < 12 ? "AM" : "PM";
    format = format.replace(/(^|[^\\])TT+/g, "$1" + T);
    format = format.replace(/(^|[^\\])T/g, "$1" + T.charAt(0));

    var t = T.toLowerCase();
    format = format.replace(/(^|[^\\])tt+/g, "$1" + t);
    format = format.replace(/(^|[^\\])t/g, "$1" + t.charAt(0));

    var tz = -date.getTimezoneOffset();
    var K = utc || !tz ? "Z" : tz > 0 ? "+" : "-";
    if (!utc) {
        tz = Math.abs(tz);
        var tzHrs = Math.floor(tz / 60);
        var tzMin = tz % 60;
        K += ii(tzHrs) + ":" + ii(tzMin);
    }
    format = format.replace(/(^|[^\\])K/g, "$1" + K);

    var day = (utc ? date.getUTCDay() : date.getDay()) + 1;
    format = format.replace(new RegExp(dddd[0], "g"), dddd[day]);
    format = format.replace(new RegExp(ddd[0], "g"), ddd[day]);

    format = format.replace(new RegExp(MMMM[0], "g"), MMMM[M]);
    format = format.replace(new RegExp(MMM[0], "g"), MMM[M]);

    format = format.replace(/\\(.)/g, "$1");

    return format;
};
