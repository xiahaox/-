function rotateSpeed(n = 40, speed = 1) {
    let arr = [];
    let pi = Math.PI / 180;
    for (let i = 0; i <= 360; i += 360 / (n - 1)) {
        let x1 = speed * Math.cos(i * pi);
        let y1 = speed * Math.sin(i * pi);
        arr.push({
            x: x1 / (n - 1), y: y1 / (n - 1)
        });
    }
    return arr;
}

function Arc(ctx, x, y, r, color) {
    return {
        ctx,
        life: Math.random() * (500 - 50) + 50,
        data: {
            x, y, r,
            color,
        },
        draw() {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = `rgba(${this.data.color[0]},${this.data.color[1]},${this.data.color[2]},${this.data.color[3]})`;
            this.ctx.fillStyle = `rgba(${this.data.color[0]},${this.data.color[1]},${this.data.color[2]},${this.data.color[3]})`;
            this.ctx.arc(this.data.x, this.data.y, this.data.r, 0, 360 * (Math.PI / 180));
            this.ctx.fill();
            this.ctx.closePath();
            ctx.restore();
        }
    }
}

function Rect(ctx, x, y, w, h, color) {
    return {
        ctx,
        data: {
            x, y, w, h,
            color,
        },
        draw() {
            this.ctx.beginPath();

            this.ctx.fillStyle = `rgba(${this.data.color[0]},${this.data.color[1]},${this.data.color[2]},${this.data.color[3]})`;
            this.ctx.rect(this.data.x, this.data.y, this.data.w, this.data.h);
            this.ctx.fill();
            this.ctx.closePath();
        }
    }
}

function Fire(ctx) {
    let obj = {
        list: [],
        isAudio: true,
        isShuAudio: true,
        audio: (() => {
            let a = new Audio();
            a.src = "./static/voice/12316.mp3";
            a.onload = () => this.isAudio = true;
            return a;
        })(),
        x: 0,
        y: 0,
        ctx,
        status: 0,
        colorList: [
            [255, 0, 191],
            [189, 0, 247],
            [0, 140, 255],
            [21, 255, 0],
            [255, 230, 0],
            [247, 0, 0]
        ],
        init(x, y) {
            this.x = x;
            this.y = y;
            this.create();
        },
        create() {
            let arc = Arc(this.ctx,

                Math.random() * w
                , Math.random() * 2 * h + h, 2, [...this.colorList[Math.floor(Math.random() * this.colorList.length)], 1]);
            arc.speed = {
                x: 0,
                y: -(Math.random() * 5 + 5),
            }
            this.list.push(arc);
        },
        update() {
            for (let i = this.list.length - 1; i >= 0; i--) {
                this.list[i].draw();
            }

            if (!this.status) {
                this.fireShu();
            } else {
                this.paticle();
            }
        },
        fireShu() {
            // console.log("----fireShu");
            let time = (new Date()).getTime();
            let arc = this.list[0];
            if (arc.data.y < arc.life) {
                this.status = 1;
                let x = arc.data.x, y = arc.data.y, color = arc.data.color;
                this.list = [];

                if (this.isAudio) {
                    this.audio.pause();
                    this.audio.currentTime = 0.6;
                    this.audio.play();
                }

                this.createPaticle(x, y, color);
                return;
            }
            arc.data.color[0] = Math.max(arc.data.color[0] - 1, 0);
            arc.data.color[1] = Math.max(arc.data.color[1] - 1, 0);
            arc.data.color[2] = Math.max(arc.data.color[2] - 1, 0);
            arc.data.x += arc.speed.x;
            arc.data.y += arc.speed.y;
        },

        paticle() {
            for (let i = this.list.length - 1; i >= 0; i--) {
                let arc = this.list[i];
                if (arc.data.r <= 0) {
                    this.list.splice(i, 1);
                    continue;
                }
                arc.data.color[0] = Math.max(arc.data.color[0] - 5, arc.color[0]);
                arc.data.color[1] = Math.max(arc.data.color[1] - 5, arc.color[1]);
                arc.data.color[2] = Math.max(arc.data.color[2] - 5, arc.color[2]);
                // arc.data.color[3] = Math.max(arc.data.color[3]-0.01,0);
                arc.data.r = Math.max(arc.data.r - 0.05, 0);
                arc.data.x += arc.speed.x;
                arc.data.y += arc.speed.y;
                arc.speed.y += arc.speed.s;
                arc.speed.s = arc.speed.s * 1.07;
                arc.speed.x = arc.speed.x * 0.98;
                arc.speed.y = arc.speed.y * 0.98;
            }

            if (this.list.length == 0) {
                this.status = 0;
                this.create();
            }
        },

        createPaticle(x, y, color2) {
            this.list = [];

            let color1 = [...this.colorList[Math.floor(Math.random() * this.colorList.length)], 1]

            let arr = rotateSpeed(25, 120);
            for (let i = 0; i < 25; i++) {
                let color = color1;

                let arc = Arc(this.ctx, x, y, 3, [color[0] + 255, color[1] + 255, color[2] + 255, 1]);
                arc.speed = {
                    x: arr[i].x,
                    y: arr[i].y,
                    s: 0.01
                }
                arc.color = color;
                this.list.push(arc);
            }

            for (let i = 0; i < 30; i++) {
                let color = color2;

                let arc = Arc(this.ctx, x, y, 3, [color[0] + 255, color[1] + 255, color[2] + 255, 1]);
                arc.speed = {
                    x: Math.random() * 6 - 3,
                    y: Math.random() * 6 - 3,
                    s: 0.01
                }
                arc.color = color;
                this.list.push(arc);
            }

        }
    }

    obj.init();
    return obj;

}

let ctx = ctn.getContext("2d");

let w = document.body.clientWidth, h = document.body.clientHeight;
if (w < 500) {
    let t = w;
    w = h;
    h = t;
    // console.log(w,h);
}
ctn.setAttribute("width", w + "px");
ctn.setAttribute("height", h + "px");

let fireList = [];
// 烟花数量
for (let i = 0; i < 10; i++) {
    fireList.push(Fire(ctx, 300, 300));
}

let clearRect = Rect(ctx, 0, 0, w, h, [0, 0, 0, 0.25])

function ani() {

    window.requestAnimationFrame(ani);
    if (window.page3N) {
        // console.log(window.page3N)
        clearRect.draw();
        fireList.forEach(fire => {
            fire.update();
        });
    }
}

window.requestAnimationFrame(ani);

window.addPage3Fn = function () {
    setTimeout(() => {
        var H = '<div class="animated bounceInRight"><div>好</div><div>运</div><div>相</div><div>伴</div><div>哦</div></div>';
        document.querySelector("#page3 .tttt").innerHTML = H;
    }, 3000);
}
window.removePage3Fn = function () {
    setTimeout(() => {
        document.querySelector("#page3 .tttt").innerHTML = "";
    }, 1500);
}