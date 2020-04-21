const popup = document.createElement('div');
popup.className = 'XingFu_popup';
popup.id = 'XingFu_popup';
popup.style.display = 'none';
popup.innerHTML = `
<div class="XingFu_container" id="XingFu_container">
    <div class="XingFu_flex">
        <div class="XingFu_item_1">
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
                <label class="XingFu_title">班主任助理圆圈大小</label>
                <input type="number" id = "XingFu_input_h"> 
            </div>
            <div class="XingFu_line">
                <label class="XingFu_title">学员圆圈大小</label>
                <input type="number" id = "XingFu_input_s"> 
            </div>
            
        </div>
        <div class="XingFu_item_2">
            <p class="XingFu_title">移除部分</p>
            <div class="XingFu_list" id="XingFu_remove"></div>
        </div>
    </div>
    <div class="XingFu_flex">
        <div class="XingFu_item_1">
            <p class="XingFu_title">班主任</p>
            <div class="XingFu_list" id="XingFu_teacher"></div>
        </div>
        <div class="XingFu_item_2">
            <p class="XingFu_title">班主任助理</p>
            <div class="XingFu_list" id="XingFu_help"></div>
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

popup.addEventListener(
    'click',
    () => {
        if (popup.style.display === 'block') {
            popup.style.display = 'none';
        } else {
            getImgs().then(
                imgs => {
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
    e => {
        e.preventDefault();
        e.stopPropagation();
    },
    false
);

const teacher = new Sortable(document.getElementById('XingFu_teacher'), {
    group: 'user',
    selectedClass: 'XingFu_user',
    animation: 150
});
const help = new Sortable(document.getElementById('XingFu_help'), {
    group: 'user',
    selectedClass: 'XingFu_user',
    animation: 150
});
const student = new Sortable(document.getElementById('XingFu_student'), {
    group: 'user',
    selectedClass: 'XingFu_user',
    animation: 150
});
const remove = new Sortable(document.getElementById('XingFu_remove'), {
    group: 'user',
    selectedClass: 'XingFu_user',
    animation: 150
});

document.getElementById('XingFu_btn').addEventListener(
    'click',
    e => {
        createCard(teacher.toArray(), help.toArray(), student.toArray());
    },
    false
);

function getImgs() {
    return new Promise(function(resolve, reject) {
        const poi = document.getElementsByClassName('poi');
        if (poi.length > 0) {
            poi[0].click();
            setTimeout(() => {
                if (document.getElementsByClassName('members').length > 0) {
                    let imgs = document.getElementsByClassName('members')[0].getElementsByClassName('avatar');
                    imgs = [...imgs];
                    imgs = imgs.map(e => {
                        return {
                            nickname: e.nextElementSibling.innerHTML,
                            avatar: e.src
                        };
                    });
                    resolve(imgs);
                } else {
                    reject(new Error('missing div'));
                }
            }, 800);
        } else {
            reject(new Error('missing div'));
        }
    });
}
function addUser(user) {
    const list = popup.querySelectorAll('.XingFu_list');
    let teacher = '';
    let help = '';
    let student = '';
    let sLength = 0;

    user.forEach(e => {
        if (e.nickname.indexOf('班主任') !== -1 || e.nickname.indexOf('班班') !== -1) {
            //班主任
            teacher =
                teacher +
                `
            <div class="XingFu_user" data-id="${e.avatar}">
                <img class="XingFu_avater" src="${e.avatar}" alt="">
                <p class="XingFu_nickname">${e.nickname}</p>
            </div>
            `;
        } else if (e.nickname.indexOf('学长') !== -1 || e.nickname.indexOf('学姐') !== -1 || e.nickname.indexOf('副班') !== -1) {
            //学长
            help =
                help +
                `
            <div class="XingFu_user" data-id="${e.avatar}">
                <img class="XingFu_avater" src="${e.avatar}" alt="">
                <p class="XingFu_nickname">${e.nickname}</p>
            </div>
            `;
        } else {
            sLength++;
            student =
                student +
                `
            <div class="XingFu_user" data-id="${e.avatar}">
                <img class="XingFu_avater" src="${e.avatar}" alt="">
                <p class="XingFu_nickname">${e.nickname}</p>
            </div>
            `;
        }
    });
    list[0].innerHTML = teacher;
    list[2].innerHTML = help;
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
    document.getElementById('XingFu_input_t').value = 45;
    document.getElementById('XingFu_input_h').value = 34;
    document.getElementById('XingFu_input_s').value = sr;
    document.getElementById('XingFu_input_c').value = '1010班全家福';
    document.getElementById('XingFu_img').style.display = 'none';
    document.getElementById('XingFu_close').addEventListener(
        'click',
        e => {
            document.getElementById('XingFu_img').style.display = 'none';
        },
        false
    );
}
function circleImg(ctx, imgSrc, x, y, r, line) {
    // console.log(imgSrc, x, y, r);
    ctx.save();
    let img = new Image();
    img.src = imgSrc;
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
}

function createCard(teacher, help, student) {
    const canvas = document.getElementById('XingFu_canvas');
    const ctx = canvas.getContext('2d');
    const image = new Image();
    image.setAttribute('crossOrigin', 'anonymous');
    image.onload = () => {
        ctx.save();
        ctx.drawImage(image, 0, 0);
        ctx.restore();
        ctx.save();
        ctx.font = '68px 方正胖娃简体';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(document.getElementById('XingFu_input_c').value, canvas.width / 2, 320);
        ctx.restore();
        const centerX = canvas.width / 2 - 26;
        const centerY = canvas.height / 2 + 60;
        let hR = 100;
        let tr = +document.getElementById('XingFu_input_t').value;
        let hr = +document.getElementById('XingFu_input_h').value;
        if (teacher.length === 1) {
            circleImg(ctx, teacher.shift(), centerX - tr / 2, centerY - tr / 2, tr, 3);
            hR = tr + 3 + (hr + 2) + 20;
        } else if (teacher.length === 2) {
            circleImg(ctx, teacher.shift(), centerX - tr - tr / 2, centerY - tr / 2, tr, 3);
            circleImg(ctx, teacher.shift(), centerX + tr - tr / 2, centerY - tr / 2, tr, 3);
            hR = (tr + 3) * 2 + (hr + 2) + 20;
        } else if (teacher.length === 3) {
            drawPolygons(teacher, ctx, centerX, centerY, 2 * tr, teacher.length, tr, 3);
            hR = (tr + 3) * 2 + (hr + 2) + 20;
        } else {
            hR = 150;
        }

        drawPolygons(help, ctx, centerX - hr / 3, centerY - hr / 3, hR, help.length, hr, 2);

        let sr = +document.getElementById('XingFu_input_s').value;
        let wr = 2 * sr + sr / 3;

        let i = 1;
        while (student.length > 0) {
            let R = hR + sr + 20 + i * wr;
            drawPolygons(student, ctx, centerX, centerY, R, Math.min(Math.floor((R * Math.PI * 2) / wr), student.length), sr);
            i++;
        }
        document.getElementById('XingFu_card').src = canvas.toDataURL('image/png');
        document.getElementById('XingFu_img').style.display = 'block';
    };
    image.src = 'https://puui.qpic.cn/fans_admin/0/3_311592059_1583336460712/0';
}

// @param {CanvasRenderingContext2D} ctx
// @param {Number} xCenter 中心坐标X点
// @param {Number} yCenter 中心坐标Y点
// @param {Number} radius 外圆半径
// @param {Number} sides 多边形边数
function drawPolygons(student, ctx, xCenter, yCenter, radius, sides, picr, line) {
    const radAngle = (Math.PI * 2) / sides;
    const radAlpha = -Math.PI / 2;
    for (var i = 0; i < sides; i++) {
        let rad = radAngle * i + radAlpha;
        let xPos = xCenter + Math.cos(rad) * radius;
        let yPos = yCenter + Math.sin(rad) * radius;
        circleImg(ctx, student.shift(), xPos, yPos, picr, line);
    }
}
