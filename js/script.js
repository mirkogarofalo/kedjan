////////////////////////////////////////////////////////////
// Neisti - Interactive sentence generator for Icelandic
// Mirko Garofalo - mig@hi.is
// All rights reserved
////////////////////////////////////////////////////////////

document.getElementById("subj").style.display = "none";
document.getElementById("obj").style.display = "none";
document.getElementById("strfinal").innerHTML = "";
let resultv = "";
let resultsubj = "";
let resultobj = "";
let verbcaseobj = "";
let verbcasesubj = "";
let stofn = "";
let coord1v = "";


const verbs = [
    ["kaupa", "kaupi", "keypti", "n", "a"],
    ["brjóta", "brýt", "braut", "n", "a"],
    ["drekka", "drekk", "drakk", "n", "a"],
    ["lesa", "les", "las", "n", "a"],
    ["borða", "borða", "borðaði", "n", "a"],
    ["bera", "ber", "bar", "n", "a"],
    ["hjálpa", "hjálpa", "hjálpaði", "n", "d"],
    ["sakna", "sakna", "saknaði", "n", "g"],
    ["skrifa", "skrifa", "skrifaði", "n", "a"],
    ["mála", "mála", "málaði", "n", "a"],
    ["gleyma", "gleymi", "gleymdi", "n", "d"],
    ["skilja", "skil", "skildi", "n", "a"],
];

const nouns = [
    ["ég", "mig", "mér", "mín", "m", 0],
    ["þú", "þig", "þér", "þín", "m", 1],
    ["hann", "hann", "honum", "hans", "m", 2],
    ["hundur", "hund", "hundi", "hunds", "m", 2],
    ["við", "okkur", "okkur", "okkar", "m", 3],
    ["kennari", "kennara", "kennara", "kennara", "m", 2],
    ["bók", "bók", "bók", "bókar", "f", 2],
    ["mynd", "mynd", "mynd", "myndar", "f", 2], 
];

const verbn1 = ["a", "ar", "ar", "um", "ið"];
const verbn2 = ["i", "ir", "ir", "um", "ið"];
const verbn3 = ["", "ur", "ur", "um", "ið"];
const verbn4 = ["", "rð", "r", "um", "ið"];
const verbn5 = ["", "ð", "", "um", "ið"];
const verbn6 = ["", "t", "", "um", "ið"];

function calcverb(infin, fen, pers) {
    stofn = infin.substring(0, infin.length - 1);
    let verbclass;
    if (fen.substring(fen.length - 1) == "a") {
        verbclass = verbn1;
        verbclass.push(infin);
    } else if (fen.substring(fen.length - 1) == "i") {
        verbclass = verbn2;
        verbclass.push(infin);
    } else if (fen.substring(fen.length - 1) == "s") {
        verbclass = verbn6;
        verbclass.push(infin);
    } else if (fen.substring(fen.length - 1) == "r") {
        verbclass = verbn5;
        verbclass.push(infin);
    } else if (fen.substring(fen.length - 1) == /[æýéy]/) {
        verbclass = verbn4;
        verbclass.push(infin);
    } else if (fen.substring(fen.length - 1) !== /[airsýéæy]/) {
        verbclass = verbn3;
        verbclass.push(infin);
    };
    if (pers == 5) {
        resultv = infin;
    } else if (pers == 3) {
        let strfinal = verbclass[pers];
        let p = changecharcheck(stofn);
        resultv = p + strfinal;
    } else if (pers == 4) {
        let strfinal = verbclass[pers];
        resultv = stofn + strfinal;
    } else if (pers < 3 && fen.substring(fen.length - 1) !== "i" && pers < 3 && fen.substring(fen.length - 1) !== "a") {
        let strfinal = verbclass[pers];
        resultv = fen + strfinal;
    } else if (pers < 3 && fen.substring(fen.length - 1) == "i") {
        let strfinal = verbclass[pers];
        resultv = stofn + strfinal;
    } else if (pers < 3 && fen.substring(fen.length - 1) == "a") {
        let strfinal = verbclass[pers];
        resultv = stofn + strfinal;
    };
};

function changecharcheck(a) {
    if (a.indexOf("a") == 1 && a.indexOf("au") < 1) {
        let ch = a.replace("a", "ö");
        return ch;
    } else {
        return a;
    };
};

function createbutton(a, n) {
    var x = document.createElement("BUTTON");
    x.innerHTML = a;
    x.setAttribute("id", "butverb" + n);
    x.setAttribute("class", "boxverb");
    x.addEventListener("click", () => {
        document.getElementById("ave").innerHTML = "";
        coord1v = n;
        document.getElementById("verb").style.display = "none";
        document.getElementById("subj").style.display = "block";
        buttonsubj();
    });
    return x;
};

function createbutton2(a, n) {
    var x = document.createElement("BUTTON");
    x.innerHTML = a;
    x.setAttribute("id", "butsubj" + n);
    x.setAttribute("class", "boxsubj");
    x.addEventListener("click", () => {
        verbcasesubj = verbs[coord1v][3];
        verbcaseobj = verbs[coord1v][4];
        calccasesubj(verbcasesubj, n);
        calcverb(verbs[coord1v][0], verbs[coord1v][1], nouns[n][5]);
        document.getElementById("subj").style.display = "none";
        document.getElementById("obj").style.display = "block";
        buttonobj();
    });
    return x;
};

function createbutton3(a, n) {
    var x = document.createElement("BUTTON");
    x.innerHTML = a;
    x.setAttribute("id", "butobj" + n);
    x.setAttribute("class", "boxobj");
    x.addEventListener("click", () => {
        calccaseobj(verbcaseobj, n);
        document.getElementById("obj").style.display = "none";
        applyverb();
    });
    return x;
};

function calccasesubj(a, n) {
    if (a == "n") {
    resultsubj = nouns[n][0];
    } else if (a == "a") {
    resultsubj = nouns[n][1];
    } else if (a == "d") {
    resultsubj = nouns[n][2];
    } else if (a == "g") {
    resultsubj = nouns[n][3];
    }  
};

function calccaseobj(a, n) {
    if (a == "n") {
    resultobj = nouns[n][0];
    } else if (a == "a") {
    resultobj = nouns[n][1];
    } else if (a == "d") {
    resultobj = nouns[n][2];
    } else if (a == "g") {
    resultobj = nouns[n][3];
    }  
};

function buttonsubj() {
    document.getElementById("nounlist").innerHTML = "";
    for (let i = 0; i < nouns.length; i++) {
       if (i % 5 == 0) {
            var x = document.getElementById("nounlist").appendChild(document.createElement("tr"));
            var y = x.appendChild(document.createElement("td"));
            var z = document.createElement("img");
            z.src = "img/imgs" + i + ".png";
            y.appendChild(z);
            y.appendChild(createbutton2(nouns[i][0], i));
        } else if (i % 5 !== 0) {
            var y = x.appendChild(document.createElement("td"));
            var z = document.createElement("img");
            z.src = "img/imgs" + i + ".png";
            y.appendChild(z);
            y.appendChild(createbutton2(nouns[i][0], i));
        };
    };
}

function buttonobj() {
    document.getElementById("objlist").innerHTML = "";
    for (let i = 0; i < nouns.length; i++) {
       if (i % 5 == 0) {
            var x = document.getElementById("objlist").appendChild(document.createElement("tr"));
            var y = x.appendChild(document.createElement("td"));
            var z = document.createElement("img");
            z.src = "img/imgs" + i + ".png";
            y.appendChild(z);
            y.appendChild(createbutton3(nouns[i][0], i));
        } else if (i % 5 !== 0) {
            var y = x.appendChild(document.createElement("td"));
            var z = document.createElement("img");
            z.src = "img/imgs" + i + ".png";
            y.appendChild(z);
            y.appendChild(createbutton3(nouns[i][0], i));
        };
    };
}

function genfirst() {
    for (let i = 0; i < verbs.length; i++) {
        if (i % 5 == 0) {
            var x = document.getElementById("verblist").appendChild(document.createElement("tr"));
            var y = x.appendChild(document.createElement("td"));
            var z = document.createElement("img");
            z.src = "img/imgv" + i + ".png";
            y.appendChild(z);
            y.appendChild(createbutton(verbs[i][0], i));
        } else if (i % 5 !== 0) {
            var y = x.appendChild(document.createElement("td"));
            var z = document.createElement("img");
            z.src = "img/imgv" + i + ".png";
            y.appendChild(z);
            y.appendChild(createbutton(verbs[i][0], i));
        };
    }
};

function applyverb() {
var list = [
    ["Frumlag (subject)", "Sögn (verb)", "Andlag (object)"],
    [resultsubj, resultv, resultobj],
    [verbcasesubj, "Nútíð (present)", verbcaseobj],
];
for (i = 0; i < list.length; i++) {
     var xa = document.getElementById("strfinal").appendChild(document.createElement("tr"));
     var ya = xa.appendChild(document.createElement("td"));
     var yb = xa.appendChild(document.createElement("td"));
     var yc = xa.appendChild(document.createElement("td"));
    console.log(ya);
     ya.innerHTML("a");
     //yb.appendChild("b");
     //yc.appendChild("c");
};
};

document.getElementById("reset").onclick = function() {
    document.getElementById("verblist").innerHTML = "";
    document.getElementById("verb").style.display = "block";
    document.getElementById("subj").style.display = "none";
    document.getElementById("obj").style.display = "none";
    document.getElementById("strfinal").innerHTML = "";
    resultv = "";
    resultsubj = "";
    resultobj = "";
    verbcaseobj = "";
    verbcasesubj = "";
    stofn = "";
    coord1v = "";
    genfirst();
};

genfirst();
