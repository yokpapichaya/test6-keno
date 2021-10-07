import $ from 'jquery';
import Swiper from 'swiper/js/swiper';
import 'bootstrap/js/dist/tab';
import swal from 'sweetalert';
import axios from 'axios';

var gameWindow;

function isMobile() {
    return /android|ip(hone|ad|od)/i.test(navigator.userAgent);
}

function isLine() {
    return /Line/i.test(navigator.userAgent);
}

function checkWindow() {
    if (gameWindow && !gameWindow.closed) {
        gameWindow.close();
    }
    gameWindow = window.open('', "popup", "fullscreen");
    gameWindow.moveTo(0, 0);
    gameWindow.resizeTo(screen.width, screen.height);
    gameWindow.document.write('Loading...');
    return;
}
// Check function login
async function checkLogin() {
    if (!sessionStorage.getItem('token')) {
        location.href = '/login';
        return false
    } else {
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + sessionStorage.getItem('token');
        return true
    }
}

// $('.btn-check').addClass('no-logged');
// if (sessionStorage.getItem("token")) {
//     $('.btn-check').removeClass('no-logged');
//     $('.btn.logout').addClass('no-logged');
// }

if (sessionStorage.getItem("token")) {
    $('[data-action="login"]').addClass('loggedin');
    $('[data-action="logout"]').removeClass('loggedin');
} else {
    $('[data-action="login"]').removeClass('loggedin');
    $('[data-action="logout"]').addClass('loggedin');
}

(function ($) {
    // Use this variable to set up the common and page specific functions. If you
    // rename this variable, you will also need to rename the namespace below.
    var Sage = {
        // All pages
        'common': {
            init: function () {

            },
            finalize: function () {
                AOS.init();

                $('.btn-check').on('click', function (e) {
                    e.preventDefault();
                    if (!sessionStorage.getItem('token')) {
                        swal({
                            title: "กรุณาเข้าสู่ระบบ",
                            text: "Please Login.",
                            icon: "error",
                        }).then(function () {
                            location.href = window.location.origin + '/login';
                        });
                    } else {
                        location.href = $(this).attr('href');
                    }
                });

                // sticky menu
                window.onscroll = function () {
                    myFunction()
                };

                var header = document.getElementById("myHeader");
                var sticky = header.offsetTop;

                function myFunction() {
                    if (window.pageYOffset > sticky) {
                        header.classList.add("sticky");
                    } else {
                        header.classList.remove("sticky");
                    }
                }

                //banner swiper
                var mySwiper = new Swiper('#h-banner', {
                    slidesPerView: 1,
                    autoplay: {
                        delay: 5000,
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                });

                //open submenu desktop
                $('.menu-list__item').mouseover(function () {
                    $(this).find('.sub-menu').addClass('show');
                }).mouseleave(function () {
                    $(this).find('.sub-menu').removeClass('show');
                });

                // menu hamburger
                $('.menu-hamburger').on('click', function () {
                    $('.menu-hamburger__line').toggleClass('active');
                    $('.mobile-menu').toggleClass('open');
                    $('.mobile-menu .nav').toggleClass('open');
                });

                //menu mobile lock a link when it has child
                $('.has-child').on('click', function () {
                    $('.sub-menu').toggleClass('open');
                });

                $('.list-menu a').each(function (index) {
                    var thismenuItem = $(this);

                    thismenuItem.click(function () {

                        $('.menuitem-wrapper').eq(index).addClass('spin');

                        var timer = setTimeout(function () {
                            $('.menuitem-wrapper').eq(index).removeClass('spin');
                            $('.list-menu').removeClass('open');
                            $('.menu-btn').removeClass('click');
                        }, 800);
                    });
                });


                //entrand sport
                $('.sport-item').on("click", function (e) {
                    var domain = $(this).attr('href');
                    e.preventDefault();
                    if (!sessionStorage.getItem('token')) {
                        swal({
                            title: "กรุณาเข้าสู่ระบบ",
                            text: "Please Login.",
                            icon: "error",
                        }).then(function () {
                            location.href = window.location.origin + '/login';
                        });
                    } else {
                        if (isMobile) {
                            window.location.href = 'https://m.' + domain + '/login/auto/?username=' + sessionStorage.getItem('user') + '&password=' + atob(sessionStorage.getItem('redirect')) + '&hash=5ff5845e617b33001178749f&url=' + window.location.origin;
                        } else {
                            window.location.href = 'https://' + domain + '/login/auto/?username=' + sessionStorage.getItem('user') + '&password=' + atob(sessionStorage.getItem('redirect')) + '&hash=5ff5845e617b33001178749f&url=' + window.location.origin;
                        }
                        sessionStorage.removeItem('token');
                        sessionStorage.removeItem('user');
                        sessionStorage.removeItem('redirect');
                    }
                });
            }
        },
        'home': {
            init: function () {

            },
            finalize: async function () {

                if ($(window).width() <= 767) {

                }

                //box all game casino
                var linkURL = [];

                $('.getlink').each(function (index) {
                    let _this = $(this).val();
                    let arrayThis = _this.split(',');
                    linkURL.push(arrayThis);

                    if ($('.getlink').length == index + 1) {
                        $('.getlink').remove();
                    }
                })


                $('.casino_game').on('click', function () {
                    var id = $(this).attr("id");
                    var gameURL;

                    $.each(linkURL, function (index, value) {
                        if (value[0] == id) {
                            gameURL = value[1];
                        }
                    });
                    checkcasino();
                    async function checkcasino() {
                        let chkstatus = await checkLogin();
                        if (chkstatus == true) {
                            let uri = gameURL;
                            if (isMobile()) {
                                uri = uri + 'MB'
                            } else {
                                uri = uri + 'PC'
                            }

                            if (id == '78') {
                                if (isLine()) {
                                    let resp = await axios.get(uri)

                                    if (resp.data.code == 1) {
                                        location.href = resp.data.url
                                    } else {
                                        if (resp.data.code == 1005) {
                                            alert(resp.data.message)
                                            sessionStorage.removeItem('token');
                                            sessionStorage.removeItem('user');
                                            sessionStorage.removeItem('redirect');
                                            window.location.href = location.hostname + '/login'
                                        } else {
                                            alert(resp.data.message)
                                            // gameWindow.close();
                                        }
                                    }
                                } else {
                                    checkWindow();

                                    let resp = await axios.get(uri)
                                    if (resp.data.code == 1) {
                                        gameWindow.location.href = resp.data.url
                                    } else {
                                        if (resp.data.code == 1005) {
                                            alert(resp.data.message)
                                            sessionStorage.removeItem('token');
                                            sessionStorage.removeItem('user');
                                            sessionStorage.removeItem('redirect');
                                            window.location.href = location.hostname + '/login'
                                        } else {
                                            alert(resp.data.message)
                                            gameWindow.close();
                                        }
                                    }
                                }
                            } else {
                                if (isLine()) {
                                    let resp = await axios.get(uri)

                                    if (resp.data.code == 0) {
                                        location.href = resp.data.url
                                    } else {
                                        if (resp.data.code == 1005) {
                                            alert(resp.data.message)
                                            sessionStorage.removeItem('token');
                                            sessionStorage.removeItem('user');
                                            sessionStorage.removeItem('redirect');
                                            window.location.href = location.hostname + '/login'
                                        } else {
                                            alert(resp.data.message)
                                        }
                                    }
                                } else {
                                    checkWindow();
                                    let resp = await axios.get(uri)

                                    if (resp.data.code == 0) {
                                        gameWindow.location.href = resp.data.url
                                    } else {
                                        if (resp.data.code == 1005) {
                                            alert(resp.data.message)
                                            sessionStorage.removeItem('token');
                                            sessionStorage.removeItem('user');
                                            sessionStorage.removeItem('redirect');
                                            window.location.href = location.hostname + '/login'
                                        } else {
                                            alert(resp.data.message)
                                            gameWindow.close();
                                        }
                                    }
                                }
                            }
                        }
                    }
                });

                var linkURLkeno = [];
                
                $('.getlinkkeno').each(function (index) {
                    let _this = $(this).val();
                    let arrayThis = _this.split(',');
                    linkURLkeno.push(arrayThis);
                    if ($('.getlinkkeno').length == index + 1) {
                        $('.getlinkkeno').remove();
                    }
                })

                $('.keno').on('click', function () {
                    var id = $(this).attr("id");
                    var gameURL;

                    $.each(linkURLkeno, function (index, value) {
                        if (value[0] == id) {
                            gameURL = value[1];
                        }
                    });
                    checkkeno();
                    async function checkkeno() {
                        let chkstatus = await checkLogin();
                        if (chkstatus == true) {
                            let uri = gameURL;
                            if (isMobile()) {
                                uri = uri + 'MB'
                            } else {
                                uri = uri + 'PC'
                            }
                            if (isLine()) {
                                let resp = await axios.get(uri)
                                if (resp.data.code == 0) {
                                    location.href = resp.data.url
                                } else {
                                    if (resp.data.code == 1005) {
                                        alert(resp.data.message)
                                        sessionStorage.removeItem('token');
                                        sessionStorage.removeItem('user');
                                        sessionStorage.removeItem('redirect');
                                        window.location.href = location.hostname + '/login';
                                    } else {
                                        alert(resp.data.message)
                                    }
                                }
                            } else {
                                let resp = await axios.get(uri);
                                checkWindow();
                                if (resp.data.code == 0) {
                                    gameWindow.location.href = resp.data.url
                                } else {
                                    if (resp.data.code == 1005) {
                                        alert(resp.data.message)
                                        sessionStorage.removeItem('token');
                                        sessionStorage.removeItem('user');
                                        sessionStorage.removeItem('redirect');
                                        window.location.href = location.hostname + '/login';
                                    } else {
                                        alert(resp.data.message)
                                        gameWindow.close();
                                    }
                                }
                            }
                        }
                    }
                });

                var linkURLtrading = [];

                $('.getlinktrading').each(function (index) {
                    let _this = $(this).val();
                    let arrayThis = _this.split(',');
                    linkURLtrading.push(arrayThis);
                    if ($('.getlinktrading').length == index + 1) {
                        $('.getlinktrading').remove();
                    }
                })

                $('.trading').on('click', function () {
                    var id = $(this).attr("id");
                    var gameURL;

                    $.each(linkURLtrading, function (index, value) {
                        if (value[0] == id) {
                            gameURL = value[1];
                        }
                    });
                    checktrading();
                    async function checktrading() {
                        let chkstatus = await checkLogin();
                        if (chkstatus == true) {
                            let uri = gameURL;
                            if (isMobile()) {
                                uri = uri + 'MB'
                            } else {
                                uri = uri + 'PC'
                            }
                            if (isLine()) {
                                let resp = await axios.get(uri)
                                
                                if (resp.data.code == 0) {
                                    location.href = resp.data.url
                                } else {
                                    if (resp.data.code == 1005) {
                                        alert(resp.data.message)
                                        sessionStorage.removeItem('token');
                                        sessionStorage.removeItem('user');
                                        sessionStorage.removeItem('redirect');
                                        window.location.href = location.hostname + '/login';
                                    } else {
                                        alert(resp.data.message)
                                    }
                                }
                            } else {
                                checkWindow();
                                let resp = await axios.get(uri);
                                if (resp.data.code == 0) {
                                    gameWindow.location.href = resp.data.url
                                } else {
                                    if (resp.data.code == 1005) {
                                        alert(resp.data.message)
                                        sessionStorage.removeItem('token');
                                        sessionStorage.removeItem('user');
                                        sessionStorage.removeItem('redirect');
                                        window.location.href = location.hostname + '/login';
                                    } else {
                                        alert(resp.data.message)
                                        gameWindow.close();
                                    }
                                }
                            }
                        }
                    }
                });

                var listData;
                const getJson = async function () {
                    var data = await axios.get(`https://cdn.ambbet.com/gamelists-ambbet.json`);
                    return data;
                }

                
                if (sessionStorage.getItem('data_slug')) {
                    listData = JSON.parse(sessionStorage.getItem('data_slug'));
                } else {
                    var jsonData = await getJson();
                    var gameItem = jsonData.data;
                    listData = gameItem;
                    sessionStorage.setItem('data_slug', JSON.stringify(gameItem));
                }

                setTimeout(() => {
                    var dataCasino = listData.lists.filter(item => item.type == 'casino');
                    $.each(dataCasino, function(index,value) {
                        if(!value.active) {
                            $(`.casino_game[data-slug=${value.productCode}]`).addClass('disabled');
                            $(`.casino_game[data-slug=${value.productCode}]`).append('<div class="noti">ปิดปรับปรุง</div>');
                        }
                    });
                    
                    var dataKeno = listData.lists.filter(item => item.type == 'keno');
                    $.each(dataKeno, function(index,value) {
                        if(!value.active) {
                            $(`.keno[data-slug=${value.productCode}]`).addClass('disabled');
                            $(`.keno[data-slug=${value.productCode}]`).append('<div class="noti">ปิดปรับปรุง</div>');
                        }
                    });

                    var dataTrading = listData.lists.filter(item => item.type == 'trading');
                    $.each(dataTrading, function(index,value) {
                        if(!value.active) {
                            $(`.trading[data-slug=${value.productCode}]`).addClass('disabled');
                            $(`.trading[data-slug=${value.productCode}]`).append('<div class="noti">ปิดปรับปรุง</div>');
                        }
                    });

                    var dataSlot = listData.lists.filter(item => item.type == 'slot' ||  item.type == 'poker');
                    $.each(dataSlot, function(index,value) {
                        if(!value.active) {
                            $(`.slot_game[data-slug=${value.productCode}]`).addClass('disabled');
                            $(`.slot_game[data-slug=${value.productCode}]`).append('<div class="noti">ปิดปรับปรุง</div>');
                        }
                    });
                }, 500);
            }
        },
        'page_template_page_casino': {
            init: function () {

            },
            finalize: async function () {
                var linkURL = [];

                $('.getlink').each(function (index) {
                    let _this = $(this).val();
                    let arrayThis = _this.split(',');
                    linkURL.push(arrayThis);

                    if ($('.getlink').length == index + 1) {
                        $('.getlink').remove();
                    }
                })

                $('.casino_game').on('click', function () {
                    var id = $(this).attr("id");
                    var gameURL;
                    $.each(linkURL, function (index, value) {
                        if (value[0] == id) {
                            gameURL = value[1];
                        }
                    });
                    checkcasino();
                    async function checkcasino() {
                        let chkstatus = await checkLogin();
                        if (chkstatus == true) {
                            let uri = gameURL;
                            if (isMobile()) {
                                uri = uri + 'MB'
                            } else {
                                uri = uri + 'PC'
                            }

                            if (id == '78') {
                                if (isLine()) {
                                    let resp = await axios.get(uri)

                                    if (resp.data.code == 1) {
                                        location.href = resp.data.url
                                    } else {
                                        if (resp.data.code == 1005) {
                                            alert(resp.data.message)
                                            sessionStorage.removeItem('token');
                                            sessionStorage.removeItem('user');
                                            sessionStorage.removeItem('redirect');
                                            window.location.href = location.hostname + '/login'
                                        } else {
                                            alert(resp.data.message)
                                            // gameWindow.close();
                                        }
                                    }
                                } else {
                                    checkWindow();

                                    let resp = await axios.get(uri)
                                    if (resp.data.code == 1) {
                                        gameWindow.location.href = resp.data.url
                                    } else {
                                        if (resp.data.code == 1005) {
                                            alert(resp.data.message)
                                            sessionStorage.removeItem('token');
                                            sessionStorage.removeItem('user');
                                            sessionStorage.removeItem('redirect');
                                            location.href = '/login';
                                        } else {
                                            alert(resp.data.message)
                                            gameWindow.close();
                                        }
                                    }
                                }
                            } else {
                                if (isLine()) {
                                    let resp = await axios.get(uri)

                                    if (resp.data.code == 0) {
                                        location.href = resp.data.url
                                    } else {
                                        if (resp.data.code == 1005) {
                                            alert(resp.data.message)
                                            sessionStorage.removeItem('token');
                                            sessionStorage.removeItem('user');
                                            sessionStorage.removeItem('redirect');
                                            window.location.href = location.hostname + '/login'
                                        } else {
                                            alert(resp.data.message)
                                        }
                                    }
                                } else {
                                    checkWindow();
                                    let resp = await axios.get(uri)

                                    if (resp.data.code == 0) {
                                        gameWindow.location.href = resp.data.url
                                    } else {
                                        if (resp.data.code == 1005) {
                                            alert(resp.data.message)
                                            sessionStorage.removeItem('token');
                                            sessionStorage.removeItem('user');
                                            sessionStorage.removeItem('redirect');
                                            window.location.href = location.hostname + '/login'
                                        } else {
                                            alert(resp.data.message)
                                            gameWindow.close();
                                        }
                                    }
                                }
                            }
                        }
                    }
                });

                var listData;
                const getJson = async function () {
                    var data = await axios.get(`https://cdn.ambbet.com/gamelists-ambbet.json`);
                    return data;
                }

                if (sessionStorage.getItem('data_slug')) {
                    listData = JSON.parse(sessionStorage.getItem('data_slug'));
                } else {
                    var jsonData = await getJson();
                    var gameItem = jsonData.data;
                    listData = gameItem;
                    sessionStorage.setItem('data_slug', JSON.stringify(gameItem));
                }

                setTimeout(() => {
                    var dataCasino = listData.lists.filter(item => item.type == 'casino');
                    $.each(dataCasino, function(index,value) {
                        if(!value.active) {
                            $(`.casino_game[data-slug=${value.productCode}]`).addClass('disabled');
                            $(`.casino_game[data-slug=${value.productCode}]`).append('<div class="noti">ปิดปรับปรุง</div>');
                        }
                    });
                }, 500);
            }
        },
        'page_template_page_slot': {
            init: function () {
                // checkLogin();
            },
            finalize: async function () {
                //check login after go to single slot by box
                $('.sec-blockslot .box-allgame').on('click', function (e) {
                    if (!sessionStorage.getItem('token')) {
                        e.preventDefault();
                        window.location.href = location.hostname + '/login'
                    } else {
                        window.location.href = $(this).attr('href');
                    }
                });

                var listData;
                const getJson = async function () {
                    var data = await axios.get(`https://cdn.ambbet.com/gamelists-ambbet.json`);
                    return data;
                }

                
                if (sessionStorage.getItem('data_slug')) {
                    listData = JSON.parse(sessionStorage.getItem('data_slug'));
                } else {
                    var jsonData = await getJson();
                    var gameItem = jsonData.data;
                    listData = gameItem;
                    sessionStorage.setItem('data_slug', JSON.stringify(gameItem));
                }

                setTimeout(() => {
                    var dataSlot = listData.lists.filter(item => item.type == 'slot' ||  item.type == 'poker');
                    $.each(dataSlot, function(index,value) {
                        if(!value.active) {
                            $(`.slot_game[data-slug=${value.productCode}]`).addClass('disabled');
                            $(`.slot_game[data-slug=${value.productCode}]`).append('<div class="noti">ปิดปรับปรุง</div>');
                        }
                    });
                }, 500);
            }
        },
        'single_slot_game': {
            init: function () {
        
            },
            finalize: async function () {
                var listData;
                const getJson = async function () {
                    var data = await axios.get(`https://cdn.ambbet.com/gamelists-ambbet.json`);
                    return data;
                }
                if (sessionStorage.getItem('data_slug')) {
                    listData = JSON.parse(sessionStorage.getItem('data_slug'));
                } else {
                    var jsonData = await getJson();
                    var gameItem = jsonData.data;
                    listData = gameItem;
                    sessionStorage.setItem('data_slug', JSON.stringify(gameItem));
                }
        
                var id = $('.game-list').attr("id");
                var url;
                if (!url) url = window.location.href;
                var text = url.split('/');
                var type = text[text.length - 2];
                
                var img =
                    $.ajax({
                        type: "post",
                        dataType: "json",
                        url: myAjax.ajaxurl,
                        data: {
                            action: "get_list_game",
                            post_id: id,
                        },
                        success: function (response) {
                            var url_listgame = response.list_game;
                            var url_login = response.login_link;
                            axios.defaults.headers.common['Authorization'] = 'Bearer ' + sessionStorage.getItem('token');
                            let listGame;
                            var type = response.slugpost;
                            
                            if (type == 'amb-poker') {
                                getGamelistamb();
                                async function getGamelistamb() {
                                    let uri = url_listgame;
                                    let resp = await axios.get(uri)
                                    var status = listData.lists.filter(item => item.productCode == $('.game-list').data('slug'))[0];
                                    if(status.active) {
                                        if (resp.data.code == 0) {
                                            listGame = resp.data.data;
                                            listGame.forEach(data => {
                                                $('.game-list').append(`<div class="col-lg-2 col-md-3 col-6">
                                        <div class="box-card-promotion" data-game="${data.gameId}" data-key="${data.gameKey}" data-active="${data.isActive}">
                                        <div class="box-card-promotion__img"><img class="list-image" src="${data.imageUrl}"></div>
                                            <div class="box-card-promotion__caption">
                                                ${data.gameName.en}
                                            </div>
                                        </div>
                                    </div>`)
                                            })
                                        }else {
                                            if(resp.data.message) {
                                                $('.game-list').append(`<h3>${resp.data.message}</h3>`);
                                            }else {
                                                $('.game-list').append(`<h3>เกมปิดปรับปรุงชั่วคราว ขออภัยในความไม่สะดวก</h3>`);
                                            }
                                        }
                                    }else {
                                        $('.game-list').append(`<h3>เกมปิดปรับปรุงชั่วคราว ขออภัยในความไม่สะดวก</h3>`);
                                    }
                                    $('.box-card-promotion').on('click', function (e) {
                                        if (!sessionStorage.getItem('token')) {
                                            e.preventDefault();
                                            window.location.href = location.hostname + '/login'
                                        } else {
                                            var card = $(this).data('game');
                                            var active = $(this).data('active');
                                            var key = $(this).data('key');
                                            Loginambgame(card, active, key);
                                        }
                                    })
                                }
                            } else {
                                getGamelistall();
                                async function getGamelistall() {
                                    let uri = url_listgame;
                                    let resp = await axios.get(uri)
                                    let listgame;
                                    
                                    $.each(resp.data.data, (index, data) => {
        
                                        if (data.productCode == type) {
                                            listgame = data.lists;
                                        }
                                    });
        
                                    if (resp.data.status == 0) {
                                        if(type == 'pg_slot'){
                                            var status = listData.lists.filter(item => item.productCode == $('.game-list').data('slug'))[0];
                                                if(status.active) {
                                                listgame.forEach(data => {
                                                    $('.game-list').append(`
                                                        <div id="each-list" class="col-lg-2 col-md-3 col-6">
                                                        <div class="box-card-promotion" data-code="${data.gameCode}">
                                                            <div class="box-card-promotion__img"><img class="list-image" src="https://cdn.ambbet.com/${data.imgUrl}" onerror="this.onerror=null;this.src='https://748073e22e8db794416a-cc51ef6b37841580002827d4d94d19b6.ssl.cf3.rackcdn.com/not-found.png';"></div>
                                                            <div class="box-card-promotion__caption">
                                                                ${data.gameName}
                                                            </div>
                                                        </div>
                                                    </div>`)
                                                })
                                            }
                                        } else {
                                            var status = listData.lists.filter(item => item.productCode == $('.game-list').data('slug'))[0];
                                            if(status.active) {
                                                listgame.forEach(data => {
                                                    $('.game-list').append(`
                                                    <div id="each-list" class="col-lg-2 col-md-3 col-6">
                                                    <div class="box-card-promotion" data-id="${data.gameId}" data-code="${data.gameCode}" data-vender="${data.productCode}">
                                                        <div class="box-card-promotion__img"><img class="list-image" src="https://cdn.ambbet.com/${data.imgUrl}" onerror="this.onerror=null;this.src='https://748073e22e8db794416a-cc51ef6b37841580002827d4d94d19b6.ssl.cf3.rackcdn.com/not-found.png';"></div>
                                                        <div class="box-card-promotion__caption">
                                                            ${data.gameName}
                                                        </div>
                                                    </div>
                                                </div>`)
                                                })
                                            }else {
                                                $('.game-list').append(`<h3>เกมปิดปรับปรุงชั่วคราว ขออภัยในความไม่สะดวก</h3>`);
                                            }
                                        }
                                    }else {
                                        if(resp.data.message) {
                                            $('.game-list').append(`<h3>${resp.data.message}</h3>`);
                                        }else {
                                            $('.game-list').append(`<h3>เกมปิดปรับปรุงชั่วคราว ขออภัยในความไม่สะดวก</h3>`);
                                        }
                                    }
                                    
                                    $('.box-card-promotion').on('click', function (e) {
                                        if (!sessionStorage.getItem('token')) {
                                            e.preventDefault();
                                            window.location.href = location.hostname + '/login'
                                        } else {
                                            if (type == 'pg_slot'){
                                                var gameId = $(this).data('code');
                                                Loginpost(gameId);
                                            } else if (type == 'gamatron') {
                                                var gameId = $(this).data('id');
                                                Loginpost(gameId);
                                            } else if(type == 'slotxo'){
                                                var gameCode = $(this).data('id');
                                                LoginpostXO(gameCode);
                                            } else{
                                                var gameId = $(this).data('id');
                                                var gameCode = $(this).data('code');
                                                var productCode = $(this).data('vender');
                                                Loginget(gameId, gameCode, productCode);
                                            }
                                        }
                                    })
                                }
                            }
        
                            //     Loginpost();
                            function isLine() {
                                return /Line/i.test(navigator.userAgent);
                            }
        
                            async function Loginpost(gameId) {
                                let uri_post = url_login;
        
                                if (isLine()) {
        
                                    var data = {
                                        "gameCode": gameId
                                    };
                                    let resp = await axios.post(uri_post, data)
        
                                    if (resp.data.code == 0) {
                                        location.href = resp.data.result;
                                    } else {
                                        alert(JSON.stringify(resp.data.message))
        
                                    }
                                } else {
                                    checkWindow();
                                    var data = {
                                        "gameCode": gameId
                                    };
        
                                    let resp = await axios.post(uri_post, data)
                                    console.log(resp)
                                    if (resp.data.code == 0) {
                                        gameWindow.location.href = resp.data.result;
                                    } else {
                                        alert(JSON.stringify(resp.data.message))
                                        gameWindow.close();
                                    }
                                }
        
                            }
                            async function LoginpostXO(gameCode) {
                                let uri_xo = url_login;
        
                                let data = {
                                    "gameCode": gameCode,
                                    "language": "EN",
                                    "isMobile": "false",
                                    "redirectUrl": ""
                                };
        
                                if (isLine()) {
                                    let resp = await axios.post(uri_xo, data)
        
                                    if (resp.data.code == 0) {
                                        location.href = resp.data.result;
                                    } else {
                                        alert(JSON.stringify(result.data.message))
                                    }
                                } else {
                                    checkWindow()
        
                                    let resp = await axios.post(uri_xo, data)
        
                                    if (resp.data.code == 0) {
                                        gameWindow.location.href = resp.data.result;
                                    } else {
                                        alert(JSON.stringify(result.data.message))
                                        gameWindow.close();
                                    }
                                }
        
        
        
                            }
                            async function Loginget(gameId, gameCode, productCode) {
                                if(type == 'evoplay01'){
                                    var uri_get = url_login + gameId + `&productCode=${productCode}`;
                                }else{
                                    var uri_get = url_login + gameId + `&gameCode=${gameCode}&productCode=${productCode}`;
                                }
                                if (isLine()) {
                                    let resp = await axios.get(uri_get)
        
                                    if (resp.data.code == 0) {
                                        location.href = resp.data.Url ? resp.data.Url : resp.data.url;
                                    } else {
                                        alert(JSON.stringify(result.data.message))
        
                                    }
                                } else {
                                    checkWindow()
        
                                    let resp = await axios.get(uri_get)
        
                                    if (resp.data.code == 0) {
                                        gameWindow.location.href = resp.data.Url ? resp.data.Url : resp.data.url;
                                    } else {
                                        alert(JSON.stringify(result.data.message))
                                        gameWindow.close();
                                    }
                                }
        
                            }
                            async function Loginambgame(gameId, isActive, gameKey) {
        
                                if (!isActive) {
                                    alert('Coming Soon.');
                                    return;
                                }
        
                                let uri = url_login + `gameId=${gameId}&gameKey=${gameKey}`;
                                // alert(uri)
                                if (isLine()) {
                                    let resp = await axios.get(uri);
                                    if (resp.data.code == 0) {
                                        location.href = resp.data.url;
                                    } else {
                                        alert(JSON.stringify(resp.data.message))
                                    }
                                } else {
                                    
                                    checkWindow();
                                    let resp = await axios.get(uri)
                                    if (resp.data.code == 0) {
                                        gameWindow.location.href = resp.data.url;
                                    } else {
                                        alert(resp.data.message);
                                        gameWindow.close();
                                    }
                                }
        
                            }
                        }
                    })
            }
        },
        'page_template_page_wallet': {
            init: function () {},
            finalize: function () {
                if (!sessionStorage.getItem('token')) {
                    swal({
                        title: "กรุณาเข้าสู่ระบบ",
                        text: "Please Login.",
                        icon: "error",
                    }).then(function () {
                        location.href = window.location.origin + '/login';
                    });
                    return;
                } else {
                    axios.defaults.headers.common['Authorization'] = 'Bearer ' + sessionStorage.getItem('token');
                    let uri = $('#wallet-api').val();
                    axios.get(uri).then(function (res) {
                        if (res.data.code == 0) {
                            $('.h_iframe').attr('src', res.data.result);
                            $('#wallet-api').remove();
                        } else {
                            swal({
                                icon: 'error',
                                title: 'กรุณาเข้าสู่ระบบอีกครั้ง',
                                allowOutsideClick: false,
                                button: 'OK',
                                focusConfirm: false,
                                focusCancel: false
                            }).then(function () {
                                sessionStorage.removeItem('token');
                                sessionStorage.removeItem('user');
                                sessionStorage.removeItem('redirect');
                                location.href = window.location.origin + '/login';
                            });
                            return;
                        }

                    }).catch(function (error) {
                        console.log(error);
                    });
                }
            }
        },
        'page_template_page_login': {
            init: function () {},
            finalize: function () {
                if (sessionStorage.getItem('token')) {
                    swal({
                        icon: 'error',
                        title: 'มีการล็อกอินอยู่ในขณะนี้',
                        allowOutsideClick: false,
                        button: 'OK',
                        focusConfirm: false,
                        focusCancel: false
                    }).then(function () {
                        location.href = window.location.origin;
                    });
                } else {
                    // Login 
                    var loginData = {
                        "substring": $('#substring').val(),
                        "prefix": $('#prefix').val(),
                        "loginurl": $('#loginurl').val()
                    }

                    $('#substring').remove();
                    $('#loginurl').remove();
                    $('#prefix').remove();

                    $('.btn-login').on('click', function (e) {
                        e.preventDefault();
                        let data = {
                            "username": $(this).parents('form').find('input[name="username"]').val(),
                            "password": $(this).parents('form').find('input[name="password"]').val()
                        }

                        if (data) {
                            let substring = loginData.substring;
                            let prefix = loginData.prefix;
                            let checkUsername = data.username.substring(0, substring);
                            if (checkUsername.toLowerCase() === prefix) {
                                axios.post(loginData.loginurl, data).then(function (res) {
                                    if (res.data.code === 0) {
                                        sessionStorage.setItem("token", res.data.result.access_token);
                                        sessionStorage.setItem('user', res.data.result.profile.username);
                                        sessionStorage.setItem('redirect', btoa(data.password));
                                        swal({
                                            icon: 'success',
                                            title: 'เข้าสู่ระบบสำเร็จ',
                                            allowOutsideClick: false,
                                            button: 'OK',
                                            focusConfirm: false,
                                            focusCancel: false
                                        }).then(function () {
                                            location.href = window.location.origin;
                                        });
                                    } else if (res.data.code == 1001 || res.data.code == 1003 || res.data.code == 1002) {
                                        swal({
                                            icon: 'error',
                                            title: 'รหัสผู้ใช้ หรือ รหัสผ่านไม่ถูกต้อง.',
                                            allowOutsideClick: false,
                                            button: 'OK',
                                            focusConfirm: false,
                                            focusCancel: false
                                        });
                                    } else if (res.data.code == 1006) {
                                        swal({
                                            icon: 'error',
                                            title: 'รหัสผู้ใช้ ถูกระงับ',
                                            allowOutsideClick: false,
                                            button: 'OK',
                                            focusConfirm: false,
                                            focusCancel: false
                                        }).then(function () {
                                            $('input[name="username"]').val("");
                                            $('input[name="password"]').val("");
                                        });
                                    } else if (res.data.code == 1007) {
                                        swal({
                                            icon: 'error',
                                            title: 'เอเยนของท่านถูกระงับ',
                                            allowOutsideClick: false,
                                            button: 'OK',
                                            focusConfirm: false,
                                            focusCancel: false
                                        }).then(function () {
                                            $('input[name="username"]').val("");
                                            $('input[name="password"]').val("");
                                        });
                                    } else if (res.data.code == 1008) {
                                        swal({
                                            icon: 'error',
                                            title: 'รหัสผ่าน ถูกระงับ',
                                            allowOutsideClick: false,
                                            button: 'OK',
                                            focusConfirm: false,
                                            focusCancel: false
                                        }).then(function () {
                                            $('input[name="username"]').val("");
                                            $('input[name="password"]').val("");
                                        });
                                    }

                                }).catch(function (error) {
                                    if(error.response.data.message) {
                                        swal({
                                            icon: 'error',
                                            title: error.response.data.message,
                                            allowOutsideClick: false,
                                            button: 'OK',
                                            focusConfirm: false,
                                            focusCancel: false
                                        }).then(function () {
                                            $('input[name="username"]').val("");
                                            $('input[name="password"]').val("");
                                        });
                                    }else {
                                        swal({
                                            icon: 'error',
                                            title: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง',
                                            allowOutsideClick: false,
                                            button: 'OK',
                                            focusConfirm: false,
                                            focusCancel: false
                                        }).then(function () {
                                            $('input[name="username"]').val("");
                                            $('input[name="password"]').val("");
                                        });
                                    }
                                });
                            } else {
                                $('.error-pass').addClass('show');
                            }
                        } else {
                            swal({
                                icon: 'error',
                                title: 'รหัสผู้ใช้ไม่ถูกต้อง',
                                allowOutsideClick: false,
                                button: 'OK',
                                focusConfirm: false,
                                focusCancel: false
                            })
                        }

                    })
                }
            }
        },
        'page_template_page_register': {
            init: function () {},
            finalize: function () {
                if (sessionStorage.getItem('token')) {
                    swal({
                        icon: 'error',
                        title: 'มีการล็อกอินอยู่ในขณะนี้',
                        allowOutsideClick: false,
                        button: 'OK',
                        focusConfirm: false,
                        focusCancel: false
                    }).then(function () {
                        location.href = window.location.origin;
                    });
                }
            }
        },
    };

    // The routing fires all common scripts, followed by the page specific scripts.
    // Add additional events for more control over timing e.g. a finalize event
    var UTIL = {
        fire: function (func, funcname, args) {
            var fire;
            var namespace = Sage;
            funcname = (funcname === undefined) ? 'init' : funcname;
            fire = func !== '';
            fire = fire && namespace[func];
            fire = fire && typeof namespace[func][funcname] === 'function';

            if (fire) {
                namespace[func][funcname](args);
            }
        },
        loadEvents: function () {
            // Fire common init JS
            UTIL.fire('common');
            // Fire page-specific init JS, and then finalize JS
            $.each(document.body.className.replace(/-/g, '_').split(/\s+/), function (i, classnm) {
                UTIL.fire(classnm);
                UTIL.fire(classnm, 'finalize');
            });

            // Fire common finalize JS
            UTIL.fire('common', 'finalize');
            //$(#sh);  
        }
    };

    // Load Events
    $(document).ready(UTIL.loadEvents);

})(jQuery); // Fully reference jQuery after this point.