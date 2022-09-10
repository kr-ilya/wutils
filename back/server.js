const port = 3000
const host = '127.0.0.1'

const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs')
const options = {
  key: fs.readFileSync('/etc/ssl/wutils.key'), //ключ
  cert: fs.readFileSync('/etc/ssl/wutils.crt'),	//сертификат
}
var https = require('https').Server(options, app);
const slowDown = require("express-slow-down");
const rateLimit = require("express-rate-limit");
const helmet = require('helmet')
var rp = require('request');
var bodyParser = require('body-parser');
var cors = require('cors')
var URL = require('url').URL;
app.use(cors());
app.use(bodyParser.urlencoded({ limit: "64mb", extended: false, parameterLimit: 50000 }))
app.use(bodyParser.json({ limit: "64mb" }));
app.use(helmet())
const punycode = require('punycode'); //PUNYCODE
var nmap = require('node-nmap'); //PORTS 1
nmap.nmapLocation = "nmap"; //PORTS 2
var CleanCSS = require('clean-css'); //CSS MINIFY
var Terser = require("terser"); //JS MINIFY
var HTMLminify = require('html-minifier').minify; //HTML MINIFY
const puppeteer = require('puppeteer'); //SITESHOT
var QRCode = require('qrcode') //ГЕНЕРАТОР QR КОДОВ


/////////////////////
//БЛОКИРОВКА с 1 IP//
/////////////////////

const apiLimiter = rateLimit({ //ГЛАВНАЯ СТРАНИЦА блокровка >15 в минуту с 1 IP
  windowMs: 60 * 1000, // 1 minutes
  max: 30,
  headers: false
});
app.use("/", apiLimiter);

const apiLimiterPorts = rateLimit({ //СКАНЕР ПОРТОВ блокровка >5 в минуту 
  windowMs: 60 * 1000, // 1 minutes
  max: 5,
  headers: false
});
app.use("/ports", apiLimiterPorts);

const apiLimiterPunycode = rateLimit({ //PUNYCODE блокровка >20 в минуту 
  windowMs: 60 * 1000, // 1 minutes
  max: 20,
  headers: false
});
app.use("/ports", apiLimiterPorts);

const apiLimiterInstagrab = rateLimit({ //INSTAGRAB блокровка >15 в минуту 
  windowMs: 60 * 1000, // 1 minutes
  max: 15,
  headers: false
});
app.use("/instagrab", apiLimiterInstagrab);

const apiLimiterSiteshot = rateLimit({ //SITESHOT блокровка >5 в минуту 
  windowMs: 60 * 1000, // 1 minutes
  max: 5,
  headers: false
});
app.use("/siteshot", apiLimiterSiteshot);

const apiLimiterCssMin = rateLimit({ //CSS MINIFY блокровка >20 в минуту 
  windowMs: 60 * 1000, // 1 minutes
  max: 20,
  headers: false
});
app.use("/css_mini", apiLimiterCssMin);

const apiLimiterJsMin = rateLimit({ //JS MINIFY блокровка >20 в минуту 
  windowMs: 60 * 1000, // 1 minutes
  max: 20,
  headers: false
});
app.use("/js_mini", apiLimiterJsMin);

const apiLimiterHTMLMin = rateLimit({ //HTML MINIFY блокровка >20 в минуту 
  windowMs: 60 * 1000, // 1 minutes
  max: 20,
  headers: false
});
app.use("/html_mini", apiLimiterHTMLMin);

const apiLimiterQRgen = rateLimit({ //QR ГЕНЕРАТОР блокровка >20 в минуту 
  windowMs: 60 * 1000, // 1 minutes
  max: 20,
  headers: false
});
app.use("/qrcode", apiLimiterQRgen);

/////////////////
//ТОРМОЗ c 1 ip//
/////////////////


const speedLimiter = slowDown({ //ГЛАВНАЯ
  windowMs: 60 * 1000, // 1 minutes
  delayAfter: 20, // Если больше 20 запросов в минуту, тормозим
  delayMs: 500 // begin adding 500ms of delay per request above 100:
});
app.use("/", speedLimiter);

const speedLimiterPunycode = slowDown({ //PUNYCODE
  windowMs: 60 * 1000, // 1 minutes
  delayAfter: 10, // Если больше 10 запросов в минуту, тормозим
  delayMs: 100 // begin adding 500ms of delay per request above 100:
});
app.use("/punycode", speedLimiterPunycode);

const speedLimiterInstagrab = slowDown({ //INSTAGRAB
  windowMs: 60 * 1000, // 1 minutes
  delayAfter: 10, // Если больше 10 запросов в минуту, тормозим
  delayMs: 500 // begin adding 500ms of delay per request above 100:
});
app.use("/instagrab", speedLimiterInstagrab);

const speedLimiterCssMin = slowDown({ //CSS MINIFY
  windowMs: 60 * 1000, // 1 minutes
  delayAfter: 10, // Если больше 10 запросов в минуту, тормозим
  delayMs: 100 // begin adding 500ms of delay per request above 100:
});
app.use("/css_mini", speedLimiterCssMin);

const speedLimiterJsMin = slowDown({ //JS MINIFY
  windowMs: 60 * 1000, // 1 minutes
  delayAfter: 10, // Если больше 10 запросов в минуту, тормозим
  delayMs: 100 // begin adding 500ms of delay per request above 100:
});
app.use("/js_mini", speedLimiterJsMin);

const speedLimiterHTMLMin = slowDown({ //HTML MINIFY
  windowMs: 60 * 1000, // 1 minutes
  delayAfter: 10, // Если больше 10 запросов в минуту, тормозим
  delayMs: 100 // begin adding 500ms of delay per request above 100:
});
app.use("/html_mini", speedLimiterHTMLMin);

const speedLimiterQRgen = slowDown({ //QR ГЕНЕРАТОР
  windowMs: 60 * 1000, // 1 minutes
  delayAfter: 10, // Если больше 10 запросов в минуту, тормозим
  delayMs: 100 // begin adding 500ms of delay per request above 100:
});
app.use("/qrcode", speedLimiterQRgen);

////////////
//СТРАНИЦЫ//
////////////

//ГЛАВНАЯ


app.get('/', function(req, res){
  var fields = 'country,city,isp,reverse,proxy,query';
  if(req.header('x-forwarded-for') !== undefined){
    var i = req.header('x-forwarded-for');
  }else{
    var i = req.connection.remoteAddress
  }
  if(i.indexOf(',')){
    var arr = i.split(', ');
    i = arr[arr.length - 1];
  }
  rp.get({
    url: 'http://ip-api.com/json/' + i + '?fields=' + fields + '&lang=ru'
  }, function (err, result) {
    if (err) {
          res.send(result.body);
        } else {
          res.send(result.body)
      }
  });
});

//PUNYCODE


app.post('/punycode', (req, res) => {
  var data = req.body.pdata.substring(0, 100);
  if(req.body.type == 'text'){
    var conv = punycode.toASCII(data);
  }else{
    var conv = punycode.toUnicode(data);
  }
    res.send(conv);
});


//СКАНЕР ПОРТОВ


  app.get('/ports/:url', function(req, res){
      var ip  = req.params.url.replace(/[.]/g, "");
      ip = +ip;
        if(ip == 127001){
          var mes = 'Ошибка, указанный IP-адрес не поддерживается';
          logs("ERROR: " + req.params.url + mes);
          res.send({type: "Error", text: mes});
          return;
        }
    var scan = req.params.url.replace(/^https?\:\/\//i, "");
    var osandports = new nmap.OsAndPortScan(scan);

    osandports.on('complete', function(data){
      logs("DATA: " + JSON.stringify(data));
      res.send(data);
    });

    osandports.on('error', function(error){
      logs("ERROR: " + JSON.stringify(error));
      res.send(error);
    });

    osandports.startScan();

    function logs(content){
      fs.appendFile('file.log', content + "\n", (err) => {
        if (err) {
          console.error(err);
          return
        }

      })
    } 
  });

  //INSTAGRAB

  app.post('/instagrab', (req, res) => {
    var url = req.body.url.replace(/^https?\:\/\//i, "");
    if(url.indexOf('?') != -1){
      url = url.split('?')[0];
    }
    if( url.slice(-1) == '/' ){
      url = url.substring(0, url.length - 1);
    }
    if(url.indexOf('instagram.com/p/') != -1){
      rp('http://' + url + '/?__a=1', function (error, response, body) {    
          if(error == null){
            if(response.statusCode !== 404){
            var j = JSON.parse(body)
            var arr = []
              if('edge_sidecar_to_children' in j.graphql.shortcode_media){
                var p = j.graphql.shortcode_media.edge_sidecar_to_children.edges
                for (var key in p) {
                    if('video_url' in p[key].node){
                      arr.push(p[key].node.video_url)
                    }else{
                      arr.push(p[key].node.display_url)
                    }
                }
              }else{
                if('video_url' in j.graphql.shortcode_media){
                  arr.push(j.graphql.shortcode_media.video_url)
                }else{
                  arr.push(j.graphql.shortcode_media.display_url)
                }
              }
              }else{
                  res.send({'code': '4004', 'result': 'Not Found'})
                }
            res.send({'code': '2000', 'result': arr})
          }else{
            res.send({'code': '0', 'result': error})
          }
      });
    }else if (url.indexOf('instagram.com/tv/') != -1){
      rp('http://' + url + '/?__a=1', function (error, response, body) {    
          if(error == null){
            if(response.statusCode !== 404){
            var j = JSON.parse(body)
            var arr = []
                  arr.push(j.graphql.shortcode_media.video_url)
            }else{
              res.send({'code': '4004', 'result': 'Not Found'})
            }
            res.send({'code': '20', 'result': arr})
          }else{
            res.send({'code': '0', 'result': error})
          }
      });
    }else if (url.indexOf('instagram.com/') != -1){
      rp('http://' + url + '/?__a=1', function (error, response, body) {    
          if(error == null){
            if(response.statusCode !== 404){
            var j = JSON.parse(body)
            var arr = []
                  arr.push(j.graphql.user.profile_pic_url_hd)
            }else{
              res.send({'code': '404', 'result': 'Not Found'})
            }
            res.send({'code': '200', 'result': arr})
          }else{
            res.send({'code': '0', 'result': error})
          }
      });
    }else{
    res.send({'code': '4000', 'result': 'wrong url'})
    }
  });

  //SITESHOT

  app.post('/siteshot', (req, res) => {
    const pattern = /^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*/gm
    if(pattern.test(req.body.url)){
    var url = req.body.url.replace(/^https?\:\/\//i, "");
    const date = new Date().getTime(); 
    url = url.replace(/^https?\:\/\//i, ""); //убираем http, если есть
    url = 'http://' + url //добавляем http

    var link = new URL(url); //создаем ссылку для названия скрина
    var host = link.hostname //получаем домен из ссылки для названия скрина
    
    if(parseInt(req.body.width) > 319){
      var width = parseInt(req.body.width)
    }else{
      var width = 1024
    }

    if(parseInt(req.body.height) > 219){ //высота изображения, если установлена fullPage - не имеет значения
      var height = parseInt(req.body.height)
    }else{
      var height = 768
    }

    if(req.body.format == 'png' || req.body.format == 'jpg'){
      var format = req.body.format
    }else{
      var format = 'jpg'
    }
    
    var full

    if(!req.body.sizeHeight){
      full = true
    }else{
      full = false
    }

    const rand =  Math.floor(Math.random() * (10000 - 1 + 1)) + 1;

    var resurl = 'https://wutils.ru/siteshots/' + host + '_' + date + rand + '.' + format;

    var opt = {
      path: '../wutils/static/siteshots/' + host + '_' + date + rand + '.' + format, 
      fullPage: full
    };

    (async() => {
      const browser = await puppeteer.launch({
         headless: true,
         args: ['--no-sandbox']
      });
      const page = await browser.newPage();
      await page.setViewport({
        width: width,
        height: height, //игнорируется при fullPage
        quality: 100, //только для jpg
        deviceScaleFactor: 1,
      });
      await page.goto(url);
      await page.screenshot(opt);
      await browser.close();
      await res.send({'code': '200', 'result': resurl}) 
    })();
    
    }else{
      res.send({'code': '400', 'result': 'Wrong url'}) 
    }
  });

  //CSS MINIFY

  app.post('/css_mini', (req, res) => {
    var input = req.body.css;
    var options = { level: 2 };
    var output = new CleanCSS(options).minify(input);
    res.send({'code': '200', 'result': output.styles}) 
  });

  //JS MINIFY

  app.post('/js_mini', (req, res) => {
    var input = req.body.js
    var minCode = Terser.minify(input);
    if(minCode){
      res.send({'code': '200', 'result': minCode})
    }else{
      res.send({'code': '403', 'result': 'Ошибка'}) 
    }
  });

  //HTML MINIFY
  
  app.post('/html_mini', (req, res) => {
    var input = req.body.html
    var minCode = HTMLminify(input, {
      continueOnParseError: true,
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true,
      removeComments: true
    });
    if(minCode){
      res.send({'code': '200', 'result': minCode})
    }else{
      res.send({'code': '403', 'result': 'Ошибка'}) 
    }
  });

  //ГЕНЕРАТОР QR КОДОВ

  app.post('/qrcode', (req, res) => {
    var input = req.body.text
    var margin = req.body.margin
    var width = req.body.width

    if(margin < 0 || margin > 16){
      margin = 4
    }

    if(input.length > 1000){
      res.send({'code': '402', 'result': 'Максимальное количество символов - 1000'}) 
      throw new Error('stop')
    }

    if(width > 1000){
      res.send({'code': '402', 'result': 'Максимальный размер - 1000px'}) 
      throw new Error('stop')
    }
    if(width < 50){
      res.send({'code': '402', 'result': 'Минимальный размер - 50px'}) 
      throw new Error('stop')
    }

    const rand =  Math.floor(Math.random() * (10000 - 1 + 1)) + 1;
    const date = new Date().getTime(); 

    var pathFile = '../wutils/static/qrcodes/' + rand + date + '.png'
    var p = 'https://wutils.ru/qrcodes/' + rand + date + '.png'
    QRCode.toFile(pathFile , input, {width: width, margin: margin}, function (err, result) {
      if (err){
        res.send({'code': '403', 'result': 'Ошибка, попробуйте позже'}) 
      }else{
        res.send({'code': '200', 'result': p})
      }
    })
  });


https.timeout = 1800000; //30 минут таймаут 

https.listen(port, host, function(){
  console.log(`Connection running at https://${host}:${port}!`);
});
