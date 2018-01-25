var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//新增
var fs=require('fs');
var ueditor = require("ueditor");
var flash = require('connect-flash');
var session = require("express-session");
var partials = require('express-partials');//视图助手
var multer=require('multer');//上传功能
var app = express();
var GlbParam = require('./modules/glbParam');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//即时消息和session
app.use(flash());
//登录拦截

app.use("/js/ueditor/ue", ueditor(path.join(__dirname, 'public'), function(req, res, next) {
    // ueditor 客户发起上传图片请求
    if (req.query.action === 'uploadimage') {
        var foo = req.ueditor;

        var imgname = req.ueditor.filename;

        var img_url = '/ueditor/';
        res.ue_up(img_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
    }
    //  客户端发起图片列表请求
    else if (req.query.action === 'listimage') {
        var dir_url = '/ueditor/';
        res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片
    }
    // 客户端发起其它请求
    else {
        // console.log('config.json')
        res.setHeader('Content-Type', 'application/json');
        res.redirect('/js/ueditor/nodejs/config.json');
    }
}));

app.use(session({
    secret: 'recommand 128 bytes random string',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60*60*1000 }
}));

//动态视图
app.use(function(req,res,next){
    res.locals.user=req.session.user;
    res.locals.success = req.flash("success").toString();
    res.locals.error = req.flash("error").toString();
    //获得系统当前时间戳
    res.locals.glbpath=GlbParam.glbpath;
    res.locals.path=GlbParam.picpath;
    res.locals.nowTime=new Date().getTime()/1000;
    res.locals.nowDate=new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate();
    next();
});
//设置跨域访问
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    next();
});

//注册所有路由
var file=fs.readdirSync('./routes');

for(var i in file){
    if(file[i].indexOf(".js")==-1){
        var fileSmall=fs.readdirSync('./routes/'+file[i]);
        for(var j in fileSmall){
            if(fileSmall[j].indexOf(".js")==-1){
                var fileSmallSmall=fs.readdirSync('./routes/'+file[i]+'/'+fileSmall[j]);
                for(var k in fileSmallSmall){
                    if(fileSmallSmall[k].indexOf(".js")==-1){
                    }else{
                        var nameSmallSmall=fileSmallSmall[k].replace('.js','');
                        app.use('/'+file[i]+'/'+fileSmall[j]+'/'+nameSmallSmall,require('./routes/'+file[i]+'/'+fileSmall[j]+'/'+nameSmallSmall));
                    }
                    if (fileSmallSmall[k].indexOf("index.js")!=-1) {
                        app.use('/' + file[i]+'/'+fileSmall[j], require('./routes/' + file[i]+'/'+fileSmall[j] + '/index'));
                    }
                }
            }else{
                var nameSmall=fileSmall[j].replace('.js','');
                app.use('/'+file[i]+'/'+nameSmall,require('./routes/'+file[i]+'/'+nameSmall));
            }
            if (fileSmall[j].indexOf("index.js")!=-1) {
                app.use('/' + file[i], require('./routes/' + file[i] + '/index'));
            }
        }
    }else{
        var name=file[i].replace('.js','');
        app.use('/'+name,require('./routes/'+name));
    }
}

app.use('/',require('./routes/index'));



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    //res.render('error', {
    //  message: err.message,
    //  error: err
    //});
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  //res.render('error', {
  //  message: err.message,
  //  error: {}
  //});
});


module.exports = app;
