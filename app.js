const sanitizeHtml = require('sanitize-html');
const request = require('request');
const cheerio = require('cheerio');
const v = require('voca');
var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");
let date = getDate(0);
function getDate(dayplus){
  return moment().add(dayplus,"days").format('M D').split(" ")
}
console.log(date)
var now_obj = {
  month: parseInt(date[0]),
  day: parseInt(date[1])
}
url = 'https://school.iamservice.net/organization/16777/group/2068031'
request({url: url}, function (err, res, body) {
  let correct_lunch;
  const $ = cheerio.load(body, {decodeEntities: true});
  const $each_menu_info = $('div.school_menu._page_panel ul')
  let lunches = []
  $each_menu_info.find('li.menu_info').each(function(index, elem){
    let date_in_strong = $(this).find('strong').text()

    let date_string = v.trim(date_in_strong)
    let date_month_and_day= date_in_strong.replace("월", "").replace("일", "").split(" ")
    let lunch = ""
    $(this).find('ul li').each(function(index, elem){
      each_lunch_menu = v.trim($(this).text());
      lunch = lunch + each_lunch_menu + "\n"


    })
    let lunch_with_date = {
      menu: lunch,
      date:{
        month: parseInt(date_month_and_day[0]),
        day: parseInt(date_month_and_day[1])
      }
    }
    lunches.push(lunch_with_date)



  })

  for(lunch in lunches){

    if(lunches[lunch].date.month === now_obj.month && lunches[lunch].date.day === now_obj.day){
      correct_lunch = lunches[lunch]
      break;
    }
  }
  if(correct_lunch !== undefined){
    lunch_str = `${correct_lunch.date.month}월 ${correct_lunch.date.day}일 급식: ${correct_lunch.menu}`
  }

  console.log(correct_lunch)



  /*const content = sanitizeHtml(lunches, {
    parser: {
      decodeEntities: true
    }
  });*/


  //console.log(content);
});
