var https = require('https');
var fs = require('fs');
var path = require('path');
var Promise = require('bluebird');
var cheerio = require("cheerio");
var baseUrl = "https://movie.douban.com/top250?start=";
var ranks = [0, 25, 50, 75, 100, 125, 150, 175, 200, 225];
var urlArray = [];
var finalRes = [];

function filterMovies(html) {
    var $ = cheerio.load(html);

    var movies = [];

    $('.item').each(function (item, index) {
        var movie = {
            title: $('.title', this).text(), // 获取电影名称
            star: $('.info .star .rating_num', this).text(), // 获取电影评分
            link: $('a', this).attr('href'), // 获取电影详情页链接
            picUrl: $('.pic img', this).attr('src') // 获取电影图片链接
        };
        movies.push(movie);
        downloadImg('img/', movie.picUrl);
    });

    return movies;
}



function saveData(path, movies) {
    // 调用 fs.writeFile 方法保存数据到本地
    fs.writeFile(path, JSON.stringify(movies, null, 4), { 'flag': 'a' }, function(err) {
        if (err) {
            return console.log(err);
        }
        console.log('数据已保存！');
    });
}

function downloadImg(imgDir, url) {
    https.get(url, function(res) {
        var data = '';

        res.setEncoding('binary');

        res.on('data', function(chunk) {
            data += chunk;
        });

        res.on('end', function() {
            // 调用 fs.writeFile 方法保存图片到本地
            fs.writeFile(imgDir + path.basename(url), data, 'binary', function(err) {
                if (err) {
                    return console.log(err);
                }
                console.log('已下载图片：', path.basename(url));
            });
        });
    }).on('error', function(err) {
        console.log(err);
    });
}


function getPageAsync(url) {
    return new Promise(function (resolve, reject) {
        console.log('正在爬取：' + url)
        https.get(url, function (res) {
            res.setEncoding('utf-8');
            var html = '';
            res.on('data', function (data) {
                html += data;
            })

            res.on("end", function () {
                resolve(html);
            })
        }).on('error', function (e) {
            reject(e)
        });
    })
}

ranks.forEach(function (ranks) {
    urlArray.push(getPageAsync(baseUrl + ranks));
});

Promise
    .all(urlArray)
    .then(function (pages) {
        var finalRes = [];
        pages.forEach(function (html) {
            var movies = filterMovies(html);
            finalRes.push(movies);

        })
        saveData('data/Hot250.json', finalRes);
    });