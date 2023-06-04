//Canvas Height
document.getElementById("canvas_h").oninput = function() {
    document.getElementById('bio').height = this.value;
    document.getElementById("info_canvas_h").innerHTML = this.value + " px";

    tmp = matrix(c);
    logo(tmp[0],tmp[1]);
}

//Canvas Width
document.getElementById("canvas_w").oninput = function() {
    document.getElementById('bio').width = this.value;
    document.getElementById("info_canvas_w").innerHTML = this.value + " px";
    
    tmp = matrix(c);
    logo(tmp[0],tmp[1]);
}

const downloadImage = document.getElementById("downloadBtn");
const downloadFormatSelect = document.getElementById("downloadFormat");
const downloadFormatP = document.getElementById("p-downloadFormat");
// generate button
document.getElementById("generateBtn").addEventListener("click", generateLogo);

function displayErrorMessage(message) {
    var errorMessageElement = document.getElementById("errorMessage");
    errorMessageElement.textContent = message;
    errorMessageElement.style.display = "block";

    var canvas = document.getElementById("bio");
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
}

function hideErrorMessage() {
    var errorMessageElement = document.getElementById("errorMessage");
    errorMessageElement.style.display = "none";
}


//Input text
function generateLogo() {
    var c = document.getElementById("mset").value;
    var lines = c.split("\n");

    // Limit the number of lines to 16
    if (lines.length > 16) {
        displayErrorMessage("*Warning: Maximum sequence length limit (16) exceeded.");
        return;
    }

    // Limit the number of characters per line to 16
    for (var i = 0; i < lines.length; i++) {
        if (lines[i].length > 16) {
            displayErrorMessage("*Warning: Maximum number of sequences limit (16) exceeded in line " + (i + 1) + ".");
            return;
        }
        
    }

    var lineLength = lines[0].length;

    // Check if the length of each line is different from the first line
    for (var i = 1; i < lines.length; i++) {
        if (lines[i].length !== lineLength) {
            displayErrorMessage("*Warning: The length of each sequence must be the same. The sequence of " + (i + 1) + " rows is not the same length");
            return;
        }
        else{
            downloadImage.style.opacity = 1;
            downloadFormatSelect.style.opacity = 1;
            downloadFormatP.style.opacity = 1;
        }
    }

    hideErrorMessage();


    c = c.replace(/\n/g, ',').replace(/ /g, '').replace(/&emsp;/g, '').replace(/\t/g, '').replace(/	/g, '');
    c = c.replace(/,,/g, ',');
    if (c.charAt(0) == ',') { c = c.substring(1, c.length); }

    var tmp = matrix(c);
    logo(tmp[0], tmp[1]);
}

// Download button event listener
downloadImage.addEventListener("click", downloadLogo);

function downloadLogo() {
    var canvas = document.getElementById("bio");
    var downloadFormat = document.getElementById("downloadFormat").value;

    var imageType;
    if (downloadFormat === "jpg") {
        imageType = "image/jpeg";
    } else if (downloadFormat === "png") {
        imageType = "image/png";
    } 
    // else if (downloadFormat === "svg") {
    //     var svgData = getSVGData();
    //     var svgBlob = new Blob([svgData], { type: "image/svg+xml" });
    //     var svgURL = URL.createObjectURL(svgBlob);
    //     var link = document.createElement("a");
    //     link.href = svgURL;
    //     link.download = "SequenceLogo.svg";
    //     link.click();
    //     return;
    // }

    var imageData = canvas.toDataURL(imageType);
    var link = document.createElement("a");
    link.href = imageData;
    link.download = "SequenceLogo." + downloadFormat;
    link.click();
}

// function getSVGData() {
//     var canvas = document.getElementById("bio");
//     var ctx = canvas.getContext("2d");
//     var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + canvas.width + '" height="' + canvas.height + '">';
//     svg += '<foreignObject width="100%" height="100%">';
//     svg += '<div xmlns="http://www.w3.org/1999/xhtml" style="font-size: 14px">';
//     svg += ctx.canvas.outerHTML;
//     svg += '</div>';
//     svg += '</foreignObject>';
//     svg += '</svg>';
//     return svg;
// }

var sq = 0;  // position
var li = 3;	 // axis line
var bo = 20; // bottom font size
var lo = 540;// letter size

//RPN4
var c = '';

document.getElementById("mset").innerHTML = c.replace(/,/g, '\n');

var tmp;

tmp = matrix(c);
logo(tmp[0],tmp[1]);


function matrix(c){

var s = [];
var m = [];

m = c.split(',');
var n = m.length;

//THE ALIGNMENT MATRIX
for(var i=0; i<n; i++){
    s[i] = [];
    s[i]=m[i].split('');
}

//DETECT ALL LETTERS USING ARRAYS
var a = [];

var t = c.replace(/,/g, '').split('');
var k = t.length;

for(var i=0; i<=k; i++){
    var q = 1;
    for(var j=0; j<=a.length; j++){
        if (t[i] === a[j]) {q = 0;}
    }
    if (q === 1) {a.push(t[i]);}
}

// PROFILE MATRIX INITIALIZATION
var p = [];

for(var h=0; h<a.length; h++){
    p[h]=[];
    for(var i=0; i<=s[0].length; i++) {
        p[h][i]=0;
        p[h][0]=a[h];
    }
}

// THE POSITION FREQUENCY MATRIX
for(var i=0; i<s.length; i++) {

    for(var j=0; j<s[i].length; j++){
                
        for(var h=0; h<a.length; h++){
        
            if (s[i][j] === a[h]) {p[h][j+1]++;}
        }
    }
}

// THE POSITION PROBABILITY MATRIX
var max = 0;
for(var i=0; i<p.length; i++) {
    for(var j=0; j<p[i].length-1; j++){
    
        p[i][j+1]=p[i][j+1]/s.length;
        p[i][j+1]=p[i][j+1].toFixed(2);
        
        if(max<=p[i][j+1]){max=p[i][j+1];}
        
        p[i][j+1]+='|'+p[i][0] 
    }
}

return [p, max];
}



function logo(M, max) {
    
    //MAKE LOGO
    var a = [];
    var t = M[0].length;

    var canvas = document.getElementById('bio');
    var canvasl = document.getElementById('letter');
    var ctl = canvasl.getContext('2d');
    // var ctx = canvas.getContext('2d');
    // ctx.fillStyle = "#ffffff";
    // ctx.fillRect(0, 0, canvas.width, canvas.height);

    var w = canvas.width - 80;
    var h = canvas.height - 40;

    var wl = canvasl.width;
    var hl = canvasl.height;

    

    if (canvas.getContext) {

        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, w+80, h+40);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, w+80, h+40);

        for(var j=1; j<t; j++){
        
            //ORDER VALUES ON EACH COLUMN
            for(var k=0; k<M.length; k++){
                a[k]=[];
                a[k][0] = M[k][j].split('|')[0];
                a[k][1] = M[k][j].split('|')[1];
            }

            a = iSort(a);
            
            for(var k=0; k<M.length; k++){
                M[k][j] = a[k][0] + '|' + a[k][1];
            }

            // LOGO
            var iw = (w/(t-1))-1;
            var x = 80+(j-1)*iw;
            
            for (var u=0; u<a.length; u++)
            {
                ctl.imageSmoothingQuality = 'high';
                ctl.clearRect(0, 0, wl, hl);
                ctl.font = 'bold ' + lo + 'px Arial';
                
                var cl = 'black';
                if(a[u][1]=='A'){cl='#07d607';}
                if(a[u][1]=='B'){cl='#FFFF00';}
                if(a[u][1]=='C'){cl='#00008A';}
                if(a[u][1]=='D'){cl='#DB0000';}
                if(a[u][1]=='E'){cl='#FFB326';}
                if(a[u][1]=='F'){cl='#00F0F0';}
                if(a[u][1]=='G'){cl='#FFE8BF';}
                if(a[u][1]=='H'){cl='#0000E0';}
                if(a[u][1]=='I'){cl='#6E6EFF';}
                if(a[u][1]=='J'){cl='#4C0085';}
                if(a[u][1]=='K'){cl='#DBABFF';}
                if(a[u][1]=='L'){cl='#BFBFBF';}
                if(a[u][1]=='M'){cl='#00B2B2';}
                if(a[u][1]=='N'){cl='#E000E0';}
                if(a[u][1]=='O'){cl='#946000';}
                if(a[u][1]=='P'){cl='#FFFFAB';}
                if(a[u][1]=='Q'){cl='#FFB5B5';}
                if(a[u][1]=='R'){cl='#850085';}
                if(a[u][1]=='S'){cl='#008000';}
                if(a[u][1]=='T'){cl='#940000';}
                if(a[u][1]=='U'){cl='#FFC9FF';}
                if(a[u][1]=='V'){cl='#BFFFFF';}
                if(a[u][1]=='W'){cl='#AC3BFF';}
                if(a[u][1]=='X'){cl='#BDBD00';}
                if(a[u][1]=='Y'){cl='#FF6363';}
             
                ctl.fillStyle = cl;
                
                var ltr = ctl.measureText(a[u][1]).width;
                ctl.fillText(a[u][1], (wl/2)-(ltr/2), hl-5);
                
                var y = h-(h/max)*a[u][0];
                
                if(u>0){var ih = h-((h/max)*a[u-1][0])-y;}
                if(u==0){var ih = h-y;}

                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(canvasl, x, y, iw, ih);
            }
        }
        
        //AXIS
        if(t>=2){
        
            ctx.lineWidth = li;
            ctx.closePath();
            ctx.beginPath();
            ctx.strokeStyle = '#454545';

            for (var i=1; i<t; i++)
            {
                
                ctx.moveTo(80+Math.floor(iw*i), h+4);
                ctx.lineTo(80+Math.floor(iw*i), h+20);
                  
                  
                ctx.font = bo + 'px Arial';
                var txt = Number(i)+Number(sq);
                var ltr = ctx.measureText(txt).width;
                ctx.fillStyle="black";
                ctx.fillText(txt, (iw/2)-(ltr/2)+80+(i-1)*iw, h+40);
            }
            ctx.stroke();
            
            
            ctx.moveTo(60, h+4);
            
            ctx.lineTo(80+Math.floor(iw*(t-1)), h+4);
            
            ctx.stroke();
            
            //left vertical line
            ctx.moveTo((75), 4);
            ctx.lineTo((75), h+40);
            ctx.stroke();

            //vertical divisions
            for (var i=0; i<10; i++)
            {
                var fi = 65;
                if(i==0){fi = 0}
                ctx.moveTo(75, 4+(Math.floor((h+4)/10)*i));
                ctx.lineTo(fi, 4+(Math.floor((h+4)/10)*i));
            }
            ctx.stroke();
            
            //MAX text
            text = 'Max';
            dim = ctx.measureText(text).width
            ctx.save();
            ctx.translate(0,32);
            ctx.font = "30px Arial";
            ctx.fillStyle = "#000000";
            ctx.textAlign = "left";
            ctx.fillText(text, 0, 0);
            ctx.restore();
            
            text = '0';
            dim = ctx.measureText(text).width
            ctx.save();
            ctx.translate(40,h+15);
            ctx.font = "30px Arial";
            ctx.fillStyle = "#000000";
            ctx.textAlign = "left";
            ctx.fillText(text, 0, 0);
            ctx.restore();
        }
    
    }

}

//SORT
function iSort(a) {
var n = a.length;
for (var i = 1; i < n; i++) {
    let n = a[i][0];
    let j = i-1;
    
    while ((j > -1) && (n < a[j][0])) {
    
        a[j+1][0] = a[j][0];
        
        var t = a[j+1][1];
        a[j+1][1] = a[j][1];
        a[j][1]=t;
        j--;
    }
    a[j+1][0] = n;
}
return a;
}