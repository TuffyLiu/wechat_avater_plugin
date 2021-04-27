const popup = document.createElement('div');
popup.className = 'XingFu_popup';
popup.id = 'XingFu_popup';
popup.style.display = 'none';
popup.innerHTML = `
<div class="XingFu_container" id="XingFu_container">
    <div class="XingFu_flex">
        <div class="XingFu_item_1">
            <div class="XingFu_item">
                <button class="XingFu_btn" id="XingFu_btn">生成全家福</button>   
                <div class="XingFu_line">
                    <label class="XingFu_title">班级</label>
                    <input type="text" id = "XingFu_input_c"> 
                </div>
                <div class="XingFu_line">
                    <label class="XingFu_title">班主任圆圈大小</label>
                    <input type="number" id = "XingFu_input_t"> 
                </div>
                <div class="XingFu_line">
                    <label class="XingFu_title">助理圆圈大小</label>
                    <input type="number" id = "XingFu_input_h"> 
                </div>
                <div class="XingFu_line">
                    <label class="XingFu_title">学员圆圈大小</label>
                    <input type="number" id = "XingFu_input_s"> 
                </div>
                <div class="XingFu_line">
                    <label class="XingFu_title">班主任/助理距离</label>
                    <input type="number" id = "XingFu_input_t_h"> 
                </div>
                <div class="XingFu_line">
                    <label class="XingFu_title">助理/学员距离</label>
                    <input type="number" id = "XingFu_input_h_s"> 
                </div>
                <div class="XingFu_line">
                    <label class="XingFu_title">学员之间距离</label>
                    <input type="number" id = "XingFu_input_l"> 
                </div>
            </div>
            <div class="XingFu_item">
                <div class="drag_file" id="dragFile">
                    <p>+ 添加头像图片</p>
                    <input type="file" multiple accept="image/png, image/jpeg, mage/jpg" id="xFile"  style="position:absolute;clip:rect(0 0 0 0);">
                </div>
            </div>
            <div class="XingFu_item">
                <div class="drag_file" id="dragFileJson">
                    <p>+ 上传头像文件</p>
                    <input type="file" accept="application/json" id="xFileJson"  style="position:absolute;clip:rect(0 0 0 0);">
                </div>
            </div>
            <div class="XingFu_item">
                <div class="drag_file" id="btn-clear">
                    <p>- 清除所有头像</p>
                </div>
            </div>
        </div>
        <div class="XingFu_item_2">
            <div class="XingFu_item">
                <p class="XingFu_title">班主任</p>
                <div class="XingFu_list" id="XingFu_teacher"></div>
            </div>
            <div class="XingFu_item">
                <p class="XingFu_title">班主任助理</p>
                <div class="XingFu_list" id="XingFu_help"></div>
            </div>
            <div class="XingFu_item">
                <p class="XingFu_title">移除部分</p>
                <div class="XingFu_list" id="XingFu_remove"></div>
            </div>
        </div>
    </div>
    
    <p class="XingFu_title">学员</p>
    <div class="XingFu_list" id="XingFu_student"></div>
    <canvas id="XingFu_canvas" class="XingFu_canvas" width="1123" height="1587"></canvas>
    <div class="XingFu_img" id="XingFu_img">
        <img class="XingFu_card" id="XingFu_card" src="https://pic.downk.cc/item/5e5fcc0a98271cb2b8385524.jpg"></img>
        <img class="XingFu_close" id="XingFu_close" src="https://pic.downk.cc/item/5e611b1f98271cb2b8d06810.png" alt="">
    </div>
</div>
`;

document.body.appendChild(popup);

const dragFile = document.getElementById('dragFile');
const dragFileJson = document.getElementById('dragFileJson');
const xFile = document.getElementById('xFile');
const xFileJson = document.getElementById('xFileJson');
const btnClear = document.getElementById('btn-clear');
const list = popup.querySelectorAll('.XingFu_list');

dragFile.addEventListener(
    'click',
    (e) => {
        e.preventDefault();
        e.stopPropagation();
        xFile.click();
    },
    false
);
dragFileJson.addEventListener(
    'click',
    (e) => {
        e.preventDefault();
        e.stopPropagation();
        xFileJson.click();
    },
    false
);

xFile.addEventListener(
    'click',
    (e) => {
        e.stopPropagation();
    },
    false
);
xFileJson.addEventListener(
    'click',
    (e) => {
        e.stopPropagation();
    },
    false
);
xFileJson.addEventListener(
    'change',
    (e) => {
        appendFileJson(xFileJson.files);
        xFileJson.value = null;
    },
    false
);

xFile.addEventListener(
    'change',
    (e) => {
        appendFile(xFile.files);
        xFile.value = null;
    },
    false
);
btnClear.addEventListener(
    'click',
    (e) => {
        e.stopPropagation();
        list[0].innerHTML = '';
        list[1].innerHTML = '';
        list[2].innerHTML = '';
        list[3].innerHTML = '';
    },
    false
);

function appendFileJson(files) {
    for (file of files) {
        const reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        reader.onload = function (evt) {
            const fileJson = JSON.parse(evt.target.result);
            fileJson.forEach((item) => {
                if (item.head_img) {
                    const temp = document.createElement('div');
                    let liStr = `
                    <div  data-id="${item.head_img}">
                        <img id="${item.head_img}" class="XingFu_avater" src="${item.head_img}" alt="">
                        <p class="XingFu_nickname">${item.nick_name}</p>
                    </div>
                `;
                    temp.innerHTML = liStr.trim();
                    if (item.nick_name.indexOf('班主任') !== -1 || item.nick_name.indexOf('班班') !== -1) {
                        list[0].insertBefore(temp.firstChild, list[0].firstChild);
                    } else if (item.nick_name.indexOf('学长') !== -1 || item.nick_name.indexOf('学姐') !== -1 || item.nick_name.indexOf('副班') !== -1) {
                        list[1].insertBefore(temp.firstChild, list[2].firstChild);
                    } else {
                        list[3].insertBefore(temp.firstChild, list[3].firstChild);
                    }
                }
            });
        };
    }
}

function appendFile(files) {
    for (file of files) {
        let url = window.URL.createObjectURL(file);
        const key = '编号' + Math.round(Math.random() * 1000);
        const temp = document.createElement('div');

        let liStr = `
            <div  data-id="${url}">
                <img class="XingFu_avater" src="${url}" alt="">
                <p class="XingFu_nickname">${key}</p>
            </div>
        `;
        temp.innerHTML = liStr.trim();
        list[3].insertBefore(temp.firstChild, list[3].firstChild);
    }
}

popup.addEventListener(
    'click',
    () => {
        if (popup.style.display === 'block') {
            popup.style.display = 'none';
        } else {
            getImgs().then(
                (imgs) => {
                    addUser(imgs);
                    popup.style.display = 'block';
                },
                () => {
                    alert('找不到群头像,请打开需要获取群头像的群聊天窗口!');
                }
            );
        }
    },
    false
);
document.getElementById('XingFu_container').addEventListener(
    'click',
    (e) => {
        e.preventDefault();
        e.stopPropagation();
    },
    false
);

const teacher = new Sortable(document.getElementById('XingFu_teacher'), {
    multiDrag: true,
    group: 'user',
    selectedClass: 'selected',
    animation: 150
});
const help = new Sortable(document.getElementById('XingFu_help'), {
    multiDrag: true,
    group: 'user',
    selectedClass: 'selected',
    animation: 150
});
const student = new Sortable(document.getElementById('XingFu_student'), {
    multiDrag: true,
    group: 'user',
    selectedClass: 'selected',
    animation: 150
});
const remove = new Sortable(document.getElementById('XingFu_remove'), {
    multiDrag: true,
    group: 'user',
    selectedClass: 'selected',
    animation: 150
});

document.getElementById('XingFu_btn').addEventListener(
    'click',
    (e) => {
        e.preventDefault();
        e.stopPropagation();
        const option = {
            XingFu_input_t: document.getElementById('XingFu_input_t').value,
            XingFu_input_h: document.getElementById('XingFu_input_h').value,
            XingFu_input_s: document.getElementById('XingFu_input_s').value,
            XingFu_input_t_h: document.getElementById('XingFu_input_t_h').value,
            XingFu_input_h_s: document.getElementById('XingFu_input_h_s').value,
            XingFu_input_l: document.getElementById('XingFu_input_l').value,
            XingFu_input_c: document.getElementById('XingFu_input_c').value
        };
        localStorage.XingFu_option = JSON.stringify(option);
        createCard(teacher.toArray(), help.toArray(), student.toArray());
    },
    false
);

function getImgs() {
    return new Promise(function (resolve, reject) {
        console.log(document.getElementsByClassName('members').length);
        if (document.getElementsByClassName('members').length > 0) {
            let imgs = document.getElementsByClassName('members')[0].getElementsByClassName('avatar');
            imgs = [...imgs];
            imgs = imgs.map((e) => {
                return {
                    nickname: e.nextElementSibling.innerHTML,
                    avatar: e.src
                };
            });
            resolve(imgs);
        } else {
            const poi = document.getElementsByClassName('poi');
            console.log(poi);
            if (poi.length > 0) {
                poi[0].click();
                setTimeout(() => {
                    if (document.getElementsByClassName('members').length > 0) {
                        let imgs = document.getElementsByClassName('members')[0].getElementsByClassName('avatar');
                        imgs = [...imgs];
                        imgs = imgs.map((e) => {
                            return {
                                nickname: e.nextElementSibling.innerHTML,
                                avatar: e.src
                            };
                        });
                        resolve(imgs);
                    } else {
                        resolve([]);
                        // reject(new Error('missing div'));
                    }
                }, 800);
            } else {
                resolve([]);
                // reject(new Error('missing div'));
            }
        }
    });
}
function addUser(user) {
    let teacher = '';
    let help = '';
    let student = '';
    let sLength = 0;

    user.forEach((e) => {
        if (e.nickname.indexOf('班主任') !== -1 || e.nickname.indexOf('班班') !== -1) {
            //班主任
            teacher =
                teacher +
                `
            <div  data-id="${e.avatar}">
                <img class="XingFu_avater" src="${e.avatar}" alt="">
                <p class="XingFu_nickname">${e.nickname}</p>
            </div>
            `;
        } else if (e.nickname.indexOf('学长') !== -1 || e.nickname.indexOf('学姐') !== -1 || e.nickname.indexOf('副班') !== -1) {
            //学长
            help =
                help +
                `
            <div  data-id="${e.avatar}">
                <img class="XingFu_avater" src="${e.avatar}" alt="">
                <p class="XingFu_nickname">${e.nickname}</p>
            </div>
            `;
        } else {
            sLength++;
            student =
                student +
                `
            <div  data-id="${e.avatar}">
                <img class="XingFu_avater" src="${e.avatar}" alt="">
                <p class="XingFu_nickname">${e.nickname}</p>
            </div>
            `;
        }
    });

    list[0].innerHTML = teacher;
    list[1].innerHTML = help;
    list[2].innerHTML = '';
    list[3].innerHTML = student;

    let sr = 14;
    if (sLength > 400) {
        sr = 18;
    } else if (sLength > 300) {
        sr = 20;
    } else if (sLength > 200) {
        sr = 22;
    } else if (sLength > 150) {
        sr = 26;
    } else if (sLength > 100) {
        sr = 30;
    } else {
        sr = 40;
    }
    const option = localStorage.XingFu_option
        ? JSON.parse(localStorage.XingFu_option)
        : {
              XingFu_input_t: 45,
              XingFu_input_h: 34,
              XingFu_input_s: sr,
              XingFu_input_t_h: 5,
              XingFu_input_h_s: 10,
              XingFu_input_l: Math.round(sr / 3),
              XingFu_input_c: '1010班全家福'
          };
    document.getElementById('XingFu_input_t').value = option.XingFu_input_t;
    document.getElementById('XingFu_input_h').value = option.XingFu_input_h;
    document.getElementById('XingFu_input_s').value = option.XingFu_input_s;
    document.getElementById('XingFu_input_t_h').value = option.XingFu_input_t_h;
    document.getElementById('XingFu_input_h_s').value = option.XingFu_input_h_s;
    document.getElementById('XingFu_input_l').value = option.XingFu_input_l;
    document.getElementById('XingFu_input_c').value = option.XingFu_input_c;
    document.getElementById('XingFu_img').style.display = 'none';
    document.getElementById('XingFu_close').addEventListener(
        'click',
        (e) => {
            document.getElementById('XingFu_img').style.display = 'none';
        },
        false
    );
}
const circleImg = function (ctx, imgSrc, x, y, r, line) {
    return new Promise((resolve) => {
        let img = new Image();
        img.src = imgSrc;
        img.setAttribute('crossOrigin', 'anonymous');
        img.onload = () => {
            ctx.save();

            if (line > 0) {
                r = r - line + 1;
            }
            let d = 2 * r;
            let cx = x + r;
            let cy = y + r;
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, 2 * Math.PI);
            ctx.clip();
            ctx.stroke();
            ctx.closePath();
            ctx.drawImage(img, x, y, d, d);
            ctx.restore();
            if (line > 0) {
                ctx.save();
                ctx.beginPath();
                ctx.strokeStyle = '#ecc489';
                ctx.lineWidth = line;
                ctx.arc(cx, cy, r + line, 0, 2 * Math.PI);
                ctx.stroke();
                ctx.closePath();
                ctx.restore();
            }
            resolve();
        };
        img.onerror = () => {
            console.log(imgSrc);
            resolve('加载图片失败');
        };
    });
};

function createCard(teacher, help, student) {
    const canvas = document.getElementById('XingFu_canvas');
    const ctx = canvas.getContext('2d');
    const image = new Image();
    image.setAttribute('crossOrigin', 'anonymous');
    image.onload = () => {
        createCardImg(teacher, help, student, ctx, canvas, image);
    };
    image.src = 'https://demo.xfwings.com.cn/h5/camp_bb_dev/dist/bg.jpg';
}

async function createCardImg(teacher, help, student, ctx, canvas, image) {
    ctx.save();
    ctx.drawImage(image, 0, 0);
    ctx.restore();
    ctx.save();
    ctx.font = '68px 方正胖娃简体';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(document.getElementById('XingFu_input_c').value, canvas.width / 2, 320);
    ctx.restore();
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2 + 70;
    let hR = 100;
    let tr = +document.getElementById('XingFu_input_t').value;
    let hr = +document.getElementById('XingFu_input_h').value;
    let thr = +document.getElementById('XingFu_input_t_h').value;
    let tR = 0;
    if (teacher.length === 1) {
        let v = await circleImg(ctx, teacher.shift(), centerX - tr, centerY - tr, tr, 3);
        tR = tr;
    } else if (teacher.length === 2) {
        await circleImg(ctx, teacher.shift(), centerX - tr - tr - 4, centerY - tr, tr, 3);
        await circleImg(ctx, teacher.shift(), centerX - tr + tr + 4, centerY - tr, tr, 3);
        tR = 2 * tr + 8;
    } else if (teacher.length === 3) {
        tR = (2 / 3) * 2 * tr;
        await drawPolygons(teacher, ctx, centerX - tr, centerY - tr, tR, teacher.length, tr, 3);
        tR = tR + tr;
    } else {
        tR = Math.floor((teacher.length * 2 * ((4 / 3) * tr)) / (Math.PI * 2));
        await drawPolygons(teacher, ctx, centerX - tr, centerY - tr, tR, teacher.length, tr, 3);
        tR = tR + tr;
    }

    hR = tR + tr + thr;
    await drawPolygons(help, ctx, centerX - hr, centerY - hr, hR, help.length, hr, 2);

    let sr = +document.getElementById('XingFu_input_s').value;
    let lsr = +document.getElementById('XingFu_input_l').value;
    let hsr = +document.getElementById('XingFu_input_h_s').value;
    let wr = 2 * sr + lsr;

    let i = 1;
    while (student.length > 0) {
        let R = hR + sr + hsr + i * wr;
        await drawPolygons(student, ctx, centerX - sr, centerY - sr, R, Math.min(Math.floor((R * Math.PI * 2) / wr), student.length), sr);
        i++;
    }
    document.getElementById('XingFu_card').src = canvas.toDataURL('image/png');
    document.getElementById('XingFu_img').style.display = 'block';
}

// @param {CanvasRenderingContext2D} ctx
// @param {Number} xCenter 中心坐标X点
// @param {Number} yCenter 中心坐标Y点
// @param {Number} radius 外圆半径
// @param {Number} sides 多边形边数
async function drawPolygons(student, ctx, xCenter, yCenter, radius, sides, picr, line) {
    const radAngle = (Math.PI * 2) / sides;
    const radAlpha = -Math.PI / 2;
    for (var i = 0; i < sides; i++) {
        let rad = radAngle * i + radAlpha;
        let xPos = xCenter + Math.cos(rad) * radius;
        let yPos = yCenter + Math.sin(rad) * radius;
        await circleImg(ctx, student.shift(), xPos, yPos, picr, line);
    }
}
