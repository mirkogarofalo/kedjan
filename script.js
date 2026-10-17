////////////////////////////////////////////////////////////
// Keðjan 1.0.0 - Interactive sentence builder for Icelandic
// Mirko Garofalo (mig@hi.is)
////////////////////////////////////////////////////////////

let previousMenubuttonWords = new Map();
const verbElement = document.getElementById("verb");
const auxElement = document.getElementById("aux");
const subjectElement = document.getElementById("subj");
const adjSubjElement = document.getElementById("adjsubj");
const objectElement = document.getElementById("obj");
const adjObjElement = document.getElementById("adjobj");
const verbListElement = document.getElementById("verblist");
const auxListElement = document.getElementById("auxlist");
const nounListElement = document.getElementById("nounlist");
const objectListElement = document.getElementById("objlist");
const adjSubjListElement = document.getElementById("adjsubjlist");
const adjObjListElement = document.getElementById("adjobjlist");
const sentenceElement = document.getElementById("strfinal");
const resetElement = document.getElementById("reset");
const aveElement = document.getElementById("ave");
const aboutElement = document.getElementById("textabout");
const instrElement = document.getElementById("textinstr");
const resultElement = document.getElementById("result");
let last;
let pasttense = 0;

let resultv = "";
let resultsubj = "";
let resultobj = "";

let verbcasesubj = "";
let verbcasesubjsaved = "";
let verbcaseobj = "";
let verbcaseobjsaved = "";
let stofn = "";

let selectedVerb = null;
let selectedSubject = null;
let selectedObject = null;
let selectedadjSubj = null;
let isThereSubjAdj = 0;
let selectedadjObj = null;
let isThereObjAdj = 0;
let isThereAux = 0;
let selectedAux = null;

let artsubj = 0;
let artobj = 0;
let appliedartsubj = 0;
let appliedartobj = 0;

const verbs = [
    ["kaupa", "kaupi", "keypti", "nf", "þf", "keypt", "keyptum", ""],
    ["brjóta", "brýt", "braut", "nf", "þf", "brotið", "brutum", ""],
    ["drekka", "drekk", "drakk", "nf", "þf", "drukkið", "drukkum", ""],
    ["lesa", "les", "las", "nf", "þf", "lesið", "lásum", ""],
    ["borða", "borða", "borðaði", "nf", "þf", "borðað", "borðuðum", ""],
    ["bera", "ber", "bar", "nf", "þf", "borið", "bárum", ""],
    ["hjálpa", "hjálpa", "hjálpaði", "nf", "þgf", "hjálpað", "hjálpuðum", ""],
    ["sakna", "sakna", "saknaði", "nf", "ef", "saknað", "söknuðum", ""],
    ["skrifa", "skrifa", "skrifaði", "nf", "þf", "skrifað", "skrifuðum", ""],
    ["mála", "mála", "málaði", "nf", "þf", "málað", "máluðum", ""],
    ["gleyma", "gleymi", "gleymdi", "nf", "þgf", "gleymt", "gleymdum", ""],
    ["skilja", "skil", "skildi", "nf", "þf", "skilið", "skildum", ""],
    ["baka", "baka", "bakaði", "nf", "þf", "bakað", "bökuðum", ""],
    ["aðstoða", "aðstoða", "aðstoðaði", "nf", "þf", "aðstoðað", "aðstoðuðum", ""],
    ["elda", "elda", "eldaði", "nf", "þf", "eldað", "elduðum", ""],
    ["vanta","vanta","vantaði","þf", "þf", "vantað", "vantaði", ""],
    ["langa","langa","langaði","þf", "þf", "langað", "langaði", "í"],
    ["hlusta","hlusta","hlustaði","nf", "þf", "hlustað", "hlustuðum", "á"]
];

const modalverbs = [
    ["ætla", "ætla", "ætlaði"," að + nh.", "ætluðum"],
    ["geta", "get", "gat"," + sagnb.", "gátum"],
    ["þurfa", "þarf", "þurfti"," að + nh.", "þurftum"],
    ["verða", "verð", "varð"," að + nh.", "urðum"],
    ["eiga", "á", "átti"," að + nh.", "áttum"],
    ["hafa", "hef", "hafði"," + sagnb.", "höfðum"],
    ["vilja", "vil", "vildi"," + nh.", "vildum"],
    ["mega", "má", "mátti"," + nh.", "máttum"],
    ["vera", "er", "var"," að + nh.", "vorum"]
];

const nouns = [
    ["ég", "mig", "mér", "mín", "m", 0, "f"],
    ["þú", "þig", "þér", "þín", "m", 1, "f"],
    ["hann", "hann", "honum", "hans", "m", 2, "f"],
    ["hundur", "hund", "hundi", "hunds", "m", 2, "n"],
    ["við", "okkur", "okkur", "okkar", "m", 3, "f"],
    ["kennari", "kennara", "kennara", "kennara", "m", 2, "n"],
    ["bók", "bók", "bók", "bókar", "f", 2, "n"],
    ["mynd", "mynd", "mynd", "myndar", "f", 2, "n"],
    ["kaka", "köku", "köku", "köku", "f", 2, "n"],
    ["samloka", "samloku", "samloku", "samloku", "f", 2, "n"],
    ["þið", "ykkur", "ykkur", "ykkar", "m", 4, "f"],
    ["vatn", "vatn", "vatni", "vatns", "n", 2, "n"],
    ["safi", "safa", "safa", "safa", "m", 2, "n"],
    ["bjór", "bjór", "bjóri", "bjórs", "m", 2, "n"],
    ["tölva", "tölvu", "tölvu", "tölvu", "f", 2, "n"],
    ["nemandi", "nemanda", "nemanda", "nemanda", "m", 2, "n"],
    ["kokkur", "kokk", "kokki", "kokks", "m", 2, "n"],
     ["leikkona", "leikkonu", "leikkonu", "leikkonu", "f", 2, "n"],
     ["hamborgari", "hamborgara", "hamborgara", "hamborgara", "m", 2, "n"],
     ["mjólk", "mjólk", "mjólk", "mjólkur", "f", 2, "n"],
     ["fjölskylda", "fjölskyldu", "fjölskyldu", "fjölskyldu", "f", 2, "n"],
      ["tónlist", "tónlist", "tónlist", "tónlistar", "f", 2, "n"],
      ["saga", "sögu", "sögu", "sögu", "f", 2, "n"],
      ["barn", "barn", "barni", "barns", "n", 2, "n"],
];

const adjectivesstrong = [
    ["fallegur", "fallegan", "fallegum", "fallegs", "falleg", "fallega", "fallegri", "fallegrar", "fallegt", "fallegt", "fallegu", "fallegs"],
    ["hvítur", "hvítan", "hvítum", "hvíts", "hvít", "hvíta", "hvítri", "hvítrar", "hvítt", "hvítt", "hvítu", "hvíts"],
    ["vondur", "vondan", "vondum", "vonds", "vond", "vonda", "vondri", "vondrar", "vont", "vont", "vondu", "vonds"],
    ["íslenskur", "íslenskan", "íslenskum", "íslensks", "íslensk", "íslenska", "íslenskri", "íslenskrar", "íslenskt", "íslenskt", "íslensku", "íslensks"],
    ["skemmtilegur", "skemmtilegan", "skemmtilegum", "skemmtilegs", "skemmtileg", "skemmtilega", "skemmtilegri", "skemmtilegrar", "skemmtilegt", "skemmtilegt", "skemmtilegu", "skemmtilegs"],
    ["góður", "góðan", "góðum", "góðs", "góð", "góða", "góðri", "góðrar", "gott", "gott", "góðu", "góðs"],
    ["gamall", "gamlan", "gömlum", "gamals", "gömul", "gamla", "gamalli", "gamallar", "gamalt", "gamalt", "gömlu", "gamals"],
    ["nýr", "nýjan", "nýjum", "nýs", "ný", "nýja", "nýrri", "nýrrar", "nýtt", "nýtt", "nýju", "nýs"],
    ["stór", "stóran", "stórum", "stórs", "stór", "stóra", "stórri", "stórrar", "stórt", "stórt", "stóru", "stórs"]
];

const adjectivesweak = [
    ["fallegi", "fallega", "fallegu"],
    ["hvíti","hvíta","hvítu"],
    ["vondi", "vonda", "vondu"],
    ["íslenski", "íslenska", "íslensku"],
    ["skemmtilegi", "skemmtilega", "skemmtilegu"],
    ["góði", "góða", "góðu"],
    ["gamli", "gamla", "gömlu"],
    ["nýi", "nýja", "nýju"],
    ["stóri","stóra","stóru"]
]

verbs.sort();
modalverbs.sort();
nouns.sort();
adjectivesstrong.sort();
adjectivesweak.sort();

const verbn1 = ["a", "ar", "ar", "um", "ið"];
const verbn2 = ["i", "ir", "ir", "um", "ið"];
const verbn3 = ["", "ur", "ur", "um", "ið"];
const verbn4 = ["", "rð", "r", "um", "ið"];
const verbn5 = ["", "ð", "", "um", "ið"];
const verbn6 = ["", "t", "", "um", "ið"];
const verbn7 = ["", "tt", "", "um", "ið"];

const verbt1 = ["i","ir","i","um","uð","u"];
const verbt2 = ["","st","","um","uð","u"];
const verbt3 = ["","t","","um","uð","u"];

const art1 = ["inn","inn","inum","ins"];
const art2 = ["in","ina","inni","innar"];
const art3 = ["ið","ið","inu","ins"];

function calcverb(infin, firstPersonForm, pers) {
    stofn = infin.substring(0, infin.length - 1);

    const lastCharacter =
        firstPersonForm.substring(firstPersonForm.length - 1);

    let verbclass;

    if (lastCharacter === "a") {
        verbclass = verbn1;
    } else if (lastCharacter === "i") {
        verbclass = verbn2;
    } else if (lastCharacter === "s") {
        verbclass = verbn6;
    } else if (infin == "þurfa" || infin == "vilja" || infin == "vera") {
        verbclass = verbn6;
    } else if (infin == "mega" || infin == "eiga") {
        verbclass = verbn7;
    } else if (lastCharacter === "r") {
        verbclass = verbn5;
    } else if (/[æýéy]/.test(lastCharacter)) {
        verbclass = verbn4;
    } else {
        verbclass = verbn3;
    }

    if (pers === 5) {
        resultv = infin;
    } else if (pers === 3) {
        resultv = changecharcheck(stofn) + verbclass[pers];
    } else if (pers === 4) {
        resultv = stofn + verbclass[pers];
    } else if (pers < 3 && lastCharacter !== "i" && lastCharacter !== "a" && infin !== "vilja" && infin !== "mega" && infin !== "eiga" && infin !== "þurfa") {
        resultv = firstPersonForm + verbclass[pers];
    } else if (pers == 2 && infin == "vilja") {
        resultv = "vill";
    } else if (pers == 1 && (infin == "vilja" || infin == "mega" || infin == "eiga" || infin == "þurfa")) {
        resultv = firstPersonForm + verbclass[pers];
    } else if (pers == 2 && (infin == "vilja" || infin == "mega" || infin == "eiga" || infin == "þurfa")) {
        resultv = firstPersonForm + verbclass[pers];
    } else if (pers == 0 && (infin == "vilja" || infin == "mega" || infin == "eiga" || infin == "þurfa")) {
        resultv = firstPersonForm;
    } else {
        resultv = stofn + verbclass[pers];
    }
    
    if (infin == "vera" && pers === 5) {
    resultv = "eru";
    } else if (infin == "vera" && pers === 4) {
    resultv = "eruð";
    } else if (infin == "vera" && pers === 3) {
    resultv = "erum";
    } else if (infin == "vera" && pers < 3) {
    resultv = firstPersonForm +  verbclass[pers];
    }
    
    if ((verbs[selectedVerb][0] == "vanta" || verbs[selectedVerb][0] == "langa") && (infin == "vilja" || infin == "mega" || infin == "eiga" || infin == "þurfa" || infin == "verða" || infin == "hafa" || infin == "geta")) {
        resultv = firstPersonForm + verbclass[pers];
    }
}

function changetense(index, person) {
if (isThereAux == 0) {
let singular = verbs[index][2];
let plural = verbs[index][6];
let substr = singular.substring(singular.length - 1);
let substr2 = plural.substring(plural.length - 2);
if (person == 0 || person == 2) {
    resultv = singular;
} else if (person == 1 && substr == "i") {
    resultv = singular.substring(0, singular.length - 1) + "ir";
} else if (person == 1 && substr == "s") {
    resultv = singular.substring(0, singular.length - 1) + "t";
} else if (person == 1 && substr == "t") {
    resultv = singular.substring(0, singular.length - 1) + "st";
} else if (person == 1 && substr !== "i" && substr !== "s" && substr !== "t") {
    resultv = singular + "st";
} else if (person == 3) {
    resultv = plural;
}  else if (person == 4) {
    resultv = plural.substring(0, plural.length - 2) + "uð";
}  else if (person == 5) {
    resultv = plural.substring(0, plural.length - 2) + "u";
}
    if (verbs[index][0] == "vanta") {
    resultv == "vantaði";
    } else if (verbs[index][0] == "langa") {
    resultv = "langaði";
    }
} else {
let singular = modalverbs[selectedAux][2];
let plural = modalverbs[selectedAux][4];
let substr = singular.substring(singular.length - 1);
let substr2 = plural.substring(plural.length - 2);
if (person == 0 || person == 2) {
    resultv = singular;
} else if (person == 1 && substr == "i") {
    resultv = singular.substring(0, singular.length - 1) + "ir";
} else if (person == 1 && substr == "s") {
    resultv = singular.substring(0, singular.length - 1) + "t";
} else if (person == 1 && substr == "t") {
    resultv = singular.substring(0, singular.length - 1) + "st";
} else if (person == 1 && substr !== "i" && substr !== "s" && substr !== "t") {
    resultv = singular + "st";
} else if (person == 3) {
    resultv = plural;
}  else if (person == 4) {
    resultv = plural.substring(0, plural.length - 2) + "uð";
}  else if (person == 5) {
    resultv = plural.substring(0, plural.length - 2) + "u";
}
if (verbs[index][0] == "vanta") {
    resultv = singular;
    } else if (verbs[index][0] == "langa") {
    resultv = "langaði";
    }
}
pasttense = 1;
}

function changecharcheck(word) {
    if (word.indexOf("a") === 1 && word.indexOf("au") < 1) {
        return word.replace("a", "ö");
    }

    return word;
}


function getNounForm(caseName, nounIndex) {
    switch (caseName) {
        case "nf":
            return [nouns[nounIndex][0], nouns[nounIndex][6]];

        case "þf":
            return [nouns[nounIndex][1], nouns[nounIndex][6]];

        case "þgf":
            return [nouns[nounIndex][2], nouns[nounIndex][6]];

        case "ef":
            return [nouns[nounIndex][3], nouns[nounIndex][6]];

        default:
            return "";
    }
}


function recalculateSentence() {
    const verb = verbs[selectedVerb];
    let auxarray;
    if (isThereAux == 1) {
    auxarray = modalverbs[selectedAux];
    }
    verbcasesubj = verb[3];
    verbcaseobj = verb[4];
    
    appliedartsubj = 0;
    appliedartobj = 0;
    
    resultsubj = getNounForm(verbcasesubj, selectedSubject);
    if (resultsubj[1] === "f") {
    artsubj = 0;
    } else if (artsubj === 1) {
    artsubj = 1;
    }

resultobj = getNounForm(verbcaseobj, selectedObject);

if (resultobj[1] === "f") {
    artobj = 0;
} else if (artobj === 1) {
   artobj = 1;
}

let fall = nouns[selectedSubject][5];
if (verbs[selectedVerb][0] == "vanta" || verbs[selectedVerb][0] == "langa") {
fall = 2;
}

if (isThereAux == 0 && pasttense == 0) {
    calcverb(
        verb[0],
        verb[1],
        fall
    ); 
} else if (isThereAux == 1 && pasttense == 0) {
calcverb(
        auxarray[0],
        auxarray[1],
        fall
    ); 
} else if (isThereAux == 0 && pasttense == 1) {
    changetense(
        selectedVerb,
        fall
    ); 
} else if (isThereAux == 1 && pasttense == 1) {
changetense(
        selectedAux,
        fall
    ); 
}
    applyverb();
}


function createVerbButton(text, index) {
    const button = document.createElement("button");

    button.innerHTML = text;
    button.id = "butverb" + index;
    button.className = "boxverb";

    button.addEventListener("click", () => {
        selectedVerb = index;

        if (aveElement) {
            aveElement.innerHTML = "";
        }

        verbElement.style.display = "none";

        if (selectedSubject === null) {
    showSubjectSelector();
} else if (selectedObject === null) {
    showObjectSelector();
} else {
    recalculateSentence();
}
    });

    return button;
}

function createAuxButton(text, index) {
    const button = document.createElement("button");

    button.innerHTML = text;
    button.id = "butaux" + index;
    button.className = "boxaux";

    button.addEventListener("click", () => {
        selectedAux = index;

        if (aveElement) {
            aveElement.innerHTML = "";
        }
        isThereAux = 1;
        auxElement.style.display = "none";
        recalculateSentence();
    });

    return button;
}


function createSubjectButton(text, index) {
    const button = document.createElement("button");

    button.innerHTML = text;
    button.id = "butsubj" + index;
    button.className = "boxsubj";

    button.addEventListener("click", () => {
        selectedSubject = index;

        subjectElement.style.display = "none";

        if (selectedObject === null) {
            showObjectSelector();
        } else {
            recalculateSentence();
        }
    });

    return button;
}

function createAdjSubjButton(text, index) {
    const button = document.createElement("button");

    button.innerHTML = text;
    button.id = "butsubjadj" + index;
    button.className = "boxsubjadj";

    button.addEventListener("click", () => {
        selectedadjSubj = index;
        adjSubjElement.style.display = "none";
        isThereSubjAdj = 1;
        recalculateSentence();
    });

    return button;
}

function createAdjObjButton(text, index) {
    const button = document.createElement("button");

    button.innerHTML = text;
    button.id = "butobjadj" + index;
    button.className = "boxobjadj";

    button.addEventListener("click", () => {
        selectedadjObj = index;
        adjObjElement.style.display = "none";
        isThereObjAdj = 1;
        recalculateSentence();
    });

    return button;
}

function createObjectButton(text, index) {
    const button = document.createElement("button");

    button.innerHTML = text;
    button.id = "butobj" + index;
    button.className = "boxobj";

    button.addEventListener("click", () => {
        selectedObject = index;

        objectElement.style.display = "none";
        recalculateSentence();
    });

    return button;
}


function createNounList(container, buttonCreator) {
    container.innerHTML = "";

    let row;

    for (let i = 0; i < nouns.length; i++) {
        if (i % 6 === 0) {
            row = container.appendChild(document.createElement("tr"));
        }

        const cell = row.appendChild(document.createElement("td"));

        const image = document.createElement("img");
        image.src = "img/nouns/" + nouns[i][0] + ".png";

        cell.appendChild(image);
        cell.appendChild(buttonCreator(nouns[i][0], i));
    }
}

function createAdjList(container, buttonCreator) {
    container.innerHTML = "";

    let row;

    for (let i = 0; i < adjectivesstrong.length; i++) {
        if (i % 6 === 0) {
            row = container.appendChild(document.createElement("tr"));
        }

        const cell = row.appendChild(document.createElement("td"));

        const image = document.createElement("img");
        image.src = "img/adj/" + adjectivesstrong[i][0] + ".png";

        cell.appendChild(image);
        cell.appendChild(buttonCreator(adjectivesstrong[i][0], i));
    }
}

function showSubjectSelector() {
    showObjectOrSubjectSelector(subjectElement);

    createNounList(
        nounListElement,
        createSubjectButton
    );
}


function showObjectSelector() {
    showObjectOrSubjectSelector(objectElement);

    createNounList(
        objectListElement,
        createObjectButton
    );
}


function showObjectOrSubjectSelector(element) {
    resultElement.style.display = "none";
    element.style.display = "block";
}


function generateVerbList() {
    verbListElement.innerHTML = "";

    let row;

    for (let i = 0; i < verbs.length; i++) {
        if (i % 6 === 0) {
            row = verbListElement.appendChild(document.createElement("tr"));
        }

        const cell = row.appendChild(document.createElement("td"));

        const image = document.createElement("img");
        image.src = "img/verbs/" + verbs[i][0] + ".png";

        cell.appendChild(image);
        cell.appendChild(createVerbButton(verbs[i][0], i));
    }
}

function createAuxList() {
    auxListElement.innerHTML = "";

    let row;

    for (let i = 0; i < modalverbs.length; i++) {
        if (i % 6 === 0) {
            row = auxListElement.appendChild(document.createElement("tr"));
        }

        const cell = row.appendChild(document.createElement("td"));

        const image = document.createElement("img");
        image.src = "img/aux/" + modalverbs[i][0] + ".png";

        cell.appendChild(image);
        cell.appendChild(createAuxButton(modalverbs[i][0] + modalverbs[i][3], i));
    }
}

function getUnchangedWordIndexes(previousWords, currentWords) {
    const dp = Array.from(
        { length: previousWords.length + 1 },
        () => Array(currentWords.length + 1).fill(0)
    );

    for (let i = 0; i < previousWords.length; i++) {
        for (let j = 0; j < currentWords.length; j++) {
            dp[i + 1][j + 1] =
                previousWords[i] === currentWords[j]
                    ? dp[i][j] + 1
                    : Math.max(dp[i][j + 1], dp[i + 1][j]);
        }
    }

    const unchanged = new Set();
    let i = previousWords.length;
    let j = currentWords.length;

    while (i > 0 && j > 0) {
        if (previousWords[i - 1] === currentWords[j - 1]) {
            unchanged.add(j - 1);
            i--;
            j--;
        } else if (dp[i - 1][j] >= dp[i][j - 1]) {
            i--;
        } else {
            j--;
        }
    }

    return unchanged;
}

function applyverb() {
let xarray = "";
let stringbutton = "";
let yarray = "";
let stringbutton2 = "";
let stringgrsubjact = `<button class="menubutton" onclick="activateartsubj()">+gr.</button>`;
let stringgrobjact = `<button class="menubutton" onclick="activateartobj()">+gr.</button>`;
let stringgrsubjdeact = `<button class="menubutton" onclick="removeartsubj()">-gr.</button>`;
let stringgrobjdeact = `<button class="menubutton" onclick="removeartobj()">-gr.</button>`;
let stateartsubj = "";
let stateartobj = "";
let descrcasesubj = "";
let descrcaseobj = "";
let strtense = "";
let tenseindicator = "";
let stringprep = "";
resultElement.style.display = "block";
sentenceElement.innerHTML = "";
if (artsubj == 1 && appliedartsubj == 0) {
resultsubj[0] = addartsubj();
}
if (artobj == 1 && appliedartobj == 0) {
resultobj[0] = addartobj();
}

if (verbs[selectedVerb][7] !== "") {
stringprep = `<button class="menubutton">` + verbs[selectedVerb][7] + `</button>`;
}

if (pasttense == 0) {
strtense = `<button class="menubutton" onclick="activatepast()">+þátíð</button>`;
tenseindicator = "<span class='caseinfo'>nútíð (present)</span>";
} else {
strtense = `<button class="menubutton" onclick="restorepresent()">+nútíð</button>`;
tenseindicator = "<span class='caseinfo'>þátíð (past)</span>"
}
    
    if (isThereSubjAdj === 1 && resultsubj[1] == "n" && artsubj == 0) {
        xarray = calcadjform(adjectivesstrong[selectedadjSubj], resultsubj[0], nouns[selectedSubject][4], verbs[selectedVerb][3]);
        stringbutton = `<button class="menubutton" onclick="recalcadjsubj()">` + xarray[0] + `</button>`;
        } else if (isThereSubjAdj === 1 && resultsubj[1] == "n" && artsubj == 1) {
        xarray = calcadjformweak(adjectivesweak[selectedadjSubj], resultsubj[0], nouns[selectedSubject][4], verbs[selectedVerb][3]);
        stringbutton = `<button class="menubutton" onclick="recalcadjsubj()">` + xarray[0] + `</button>`;
        }
        
    if (isThereObjAdj === 1 && resultobj[1] == "n" && artobj == 0) {
        yarray = calcadjform(adjectivesstrong[selectedadjObj], resultobj[0], nouns[selectedObject][4], verbs[selectedVerb][4]);
        stringbutton2 = `<button class="menubutton" onclick="recalcadjobj()">` + yarray[0] + `</button>`;
        } else if (isThereObjAdj === 1 && resultobj[1] == "n" && artobj == 1) {
        yarray = calcadjformweak(adjectivesweak[selectedadjObj], resultobj[0], nouns[selectedObject][4], verbs[selectedVerb][4]);
        stringbutton2 = `<button class="menubutton" onclick="recalcadjobj()">` + yarray[0] + `</button>`;
        } 
        
   if (verbcasesubj == "nf") {
    descrcasesubj = "nf. (nom)";
   } else if (verbcasesubj == "þf") {
   descrcasesubj = "þf. (acc)";
   } else if (verbcasesubj == "þgf") {
    descrcasesubj = "þgf. (dat)";
   } else if (verbcasesubj == "ef") {
   descrcasesubj = "ef. (gen)";
    }
    
   if (verbcaseobj == "nf") {
   descrcaseobj = "nf. (nom)";
   } else if (verbcaseobj == "þf") {
   descrcaseobj = "þf. (acc)";
    } else if (verbcaseobj == "þgf") {
    descrcaseobj = "þgf. (dat)";
    } else if (verbcaseobj == "ef") {
    descrcaseobj = "ef. (gen)";
    }

    let rows = [
        [
            "",
            "",
            "",
            "",
            ""
        ],
        [  "Frumlag (subject)",
            resultsubj[0],
            "<span class='caseinfo'>" + descrcasesubj + "</span>",
            "recalcsubj",
            ""
        ],
        [
            "Sögn (verb)",
            resultv,
            tenseindicator,
            "recalcvb",
            ""
        ],
        [
            "Andlag (object)",
            resultobj[0],
            "<span class='caseinfo'>" + descrcaseobj + "</span>",
            "recalcobj",
            ""
        ],
        [
            "Tímaliður (Time phrase)",
            "",
            "",
            "",
            ""
        ]
    ];

    for (let i = 0; i < 4; i++) {
        const tableRow = sentenceElement.appendChild(
            document.createElement("tr")
        );

        const firstCell = tableRow.appendChild(
            document.createElement("td")
        );

        const secondCell = tableRow.appendChild(
            document.createElement("td")
        );

        const thirdCell = tableRow.appendChild(
            document.createElement("td")
        );
        
        const fourthCell = tableRow.appendChild(
            document.createElement("td")
        );
        
        if (resultsubj[1] == "f") {
        artsubj = 0;
        }
        if (resultobj[1] == "f") {
        artobj = 0;
        }
        
    if (artsubj == 1 && resultsubj[1] == "n") {
    stateartsubj = stringgrsubjdeact;
    } else {
     stateartsubj = stringgrsubjact;
     }
    if (artobj == 1 && resultobj[1] == "n") {
    stateartobj = stringgrobjdeact;
    } else {
    stateartobj = stringgrobjact;
    }
        
        if (i === 1) {
            if (artsubj == 0 && resultsubj[1] == "n") {
            firstCell.innerHTML = stringbutton + 
                ` <button class="menubutton" onclick="${rows[1][3]}()">` +
                `${rows[1][1]}</button>`;
            } else if (artsubj !== 0 && resultsubj[1] == "n") {
            firstCell.innerHTML = stringbutton +
                ` <button class="menubutton" onclick="${rows[1][3]}()">` +
                `${rows[1][1]}</button>`;
            } else {
            firstCell.innerHTML = stringbutton +
                ` <button class="menubutton" onclick="${rows[1][3]}()">` +
                `${rows[1][1]}</button>`;
            }
            if (isThereAux == 0) {
            secondCell.innerHTML =
                `<button class="menubutton" onclick="${rows[2][3]}()">` +
                `${rows[2][1]}</button>` + stringprep;
            } else if (isThereAux == 1){
            if (modalverbs[selectedAux][0] == "verða" ||  modalverbs[selectedAux][0] == "eiga" || modalverbs[selectedAux][0] == "þurfa" || modalverbs[selectedAux][0] == "ætla" || modalverbs[selectedAux][0] == "vera") {
            secondCell.innerHTML = `<button class="menubutton" onclick="recalcaux()">` +
                `${rows[2][1]} að</button> <button class="menubutton" onclick="recalcvb()">${verbs[selectedVerb][0]}</button>` + stringprep;
                } else if (modalverbs[selectedAux][0] == "mega" || modalverbs[selectedAux][0] == "vilja") {
            secondCell.innerHTML = `<button class="menubutton" onclick="recalcaux()">` +
                `${rows[2][1]}</button> <button class="menubutton" onclick="recalcvb()">${verbs[selectedVerb][0]}</button>` + stringprep;
                } else if (modalverbs[selectedAux][0] == "geta" || modalverbs[selectedAux][0] == "hafa") {
            secondCell.innerHTML = `<button class="menubutton" onclick="recalcaux()">` +
                `${rows[2][1]}</button> <button class="menubutton" onclick="recalcvb()">${verbs[selectedVerb][5]}</button>` + stringprep;
                }
            }
            if (artobj == 0 && resultobj[1] == "n") {
                 thirdCell.innerHTML = stringbutton2 + 
                ` <button class="menubutton" onclick="${rows[3][3]}()">` +
                `${rows[3][1]}</button>`;
                } else if (artobj !== 0 && resultobj[1] == "n") {
                 thirdCell.innerHTML = stringbutton2 + 
                ` <button class="menubutton" onclick="${rows[3][3]}()">` +
                `${rows[3][1]}</button>`;
                } else { 
                thirdCell.innerHTML = stringbutton2 + 
                ` <button class="menubutton" onclick="${rows[3][3]}()">` +
                `${rows[3][1]}</button>`;
                }
              fourthCell.innerHTML = `<button class="menubutton" onclick="addtimephrase()">` +
                `+</button>`;  
        } else if (i === 3) {
            if (resultsubj[1] == "n" && isThereSubjAdj == 0) {
            firstCell.innerHTML = `<button class="menubutton" onclick="addadjsubj()">` +
                `+lo.</button> ` + stateartsubj;
            } else if (resultsubj[1] == "n" && isThereSubjAdj == 1) {
            firstCell.innerHTML = `<button class="menubutton" onclick="removeadjsubj()">` +
                `-lo.</button> ` + stateartsubj;
            } else {
            firstCell.innerHTML = "";
            }
            if (isThereAux == 0) {
            secondCell.innerHTML = strtense + `<button class="menubutton" onclick="addaux()">+aux</button>`;
            } else {
             secondCell.innerHTML = strtense + `<button class="menubutton" onclick="removeaux()">-aux</button>`;
            }
            if (resultobj[1] == "n" && isThereObjAdj == 0) {
           thirdCell.innerHTML = `<button class="menubutton" onclick="addadjobj()">` +
                `+lo.</button> ` + stateartobj;
            } else if (resultobj[1] == "n" && isThereObjAdj == 1) {
           thirdCell.innerHTML = `<button class="menubutton" onclick="removeadjobj()">` +
                `-lo.</button> ` + stateartobj;
            } else {
            thirdCell.innerHTML = "";
            }
            fourthCell.innerHTML = "";
        } else {
            firstCell.innerHTML = `<p>${rows[1][i]}</p>`;
            secondCell.innerHTML = `<p>${rows[2][i]}</p>`;
            thirdCell.innerHTML = `<p>${rows[3][i]}</p>`;
            fourthCell.innerHTML = `<p>${rows[4][i]}</p>`;
            
        }
    }
const currentWordState = new Map();
const buttons = sentenceElement.querySelectorAll(".menubutton");
const isFirstRender = previousMenubuttonWords.size === 0;
const keyOccurrences = new Map();

buttons.forEach((button) => {
    const row = button.closest("tr");
    const cell = button.closest("td");

    const action = (button.getAttribute("onclick") || "")
        .replace(/^(add|remove)(?=[a-z])/i, "");

    const role = `${Array.from(sentenceElement.querySelectorAll("tr")).indexOf(row)}:` +
        `${Array.from(row.children).indexOf(cell)}:${action}`;

    const occurrence = keyOccurrences.get(role) || 0;
    keyOccurrences.set(role, occurrence + 1);

    const key = `${role}:${occurrence}`;
    const currentWords = button.textContent.trim().split(/\s+/).filter(Boolean);
    const previousWords = previousMenubuttonWords.get(key);

    const unchanged = previousWords
        ? getUnchangedWordIndexes(previousWords, currentWords)
        : new Set(isFirstRender ? currentWords.map((_, index) => index) : []);

    currentWordState.set(key, currentWords);

    button.replaceChildren();

    currentWords.forEach((word, index) => {
        const span = document.createElement("span");
        span.className = unchanged.has(index)
            ? "menubutton-word"
            : "menubutton-word is-changing";
        span.textContent = word;
        button.appendChild(span);
        
        if (index < currentWords.length - 1) {
            button.appendChild(document.createTextNode(" "));
        }
    });
});
previousMenubuttonWords = currentWordState;
}

function activatepast() {
pasttense = 1;
recalculateSentence();
}

function restorepresent() {
pasttense = 0;
recalculateSentence();
}

function activateartsubj() {
artsubj = 1;
applyverb();
}

function activateartobj() {
artobj = 1;
applyverb();
}

function addartsubj() {
artsubj = 1;
verbcasesubjsaved = resultsubj[0];
let artarray;
let artform;
if (nouns[selectedSubject][4] == "m") {
artarray = art1;
} else if (nouns[selectedSubject][4] == "f") {
artarray = art2;
} else if (nouns[selectedSubject][4] == "n") {
artarray = art3;
}
if (verbcasesubj == "nf") {
artform = artarray[0];
} else if (verbcasesubj == "þf") {
artform = artarray[1];
} else if (verbcasesubj == "þgf") {
artform = artarray[2];
} else if (verbcasesubj == "ef") {
artform = artarray[3];
}
if (resultsubj[0].endsWith("a") == true || resultsubj[0].endsWith("i") == true || resultsubj[0].endsWith("u") == true) {
artform = artform.slice(1);
}
resultsubj[0] = resultsubj[0] + artform;
appliedartsubj = 1;
return resultsubj[0];
}

function removeartsubj() {
artsubj = 0;
appliedartsubj = 0;
resultsubj[0] = verbcasesubjsaved;
applyverb();
}

function removeaux() {
isThereAux = 0;
recalculateSentence();
}

function removeadjsubj() {
isThereSubjAdj = 0;
recalculateSentence();
}

function removeadjobj() {
isThereObjAdj = 0;
recalculateSentence();
}

function addartobj() {
artobj = 1;
verbcaseobjsaved = resultobj[0];
let artarray;
let artform;
if (nouns[selectedObject][4] == "m") {
artarray = art1;
} else if (nouns[selectedObject][4] == "f") {
artarray = art2;
} else if (nouns[selectedObject][4] == "n") {
artarray = art3;
}
if (verbcaseobj == "nf") {
artform = artarray[0];
} else if (verbcaseobj == "þf") {
artform = artarray[1];
} else if (verbcaseobj == "þgf") {
artform = artarray[2];
} else if (verbcaseobj == "ef") {
artform = artarray[3];
}
if (resultobj[0].endsWith("a") == true || resultobj[0].endsWith("i") == true || resultobj[0].endsWith("u") == true) {
artform = artform.slice(1);
}
resultobj[0] = resultobj[0] + artform;
appliedartobj = 1;
return resultobj[0];
}

function removeartobj() {
artobj = 0;
appliedartobj = 0;
resultobj[0] = verbcaseobjsaved;
applyverb();
}

function recalcsubj() {
    resultElement.style.display = "none";
    subjectElement.style.display = "block";

    createNounList(
        nounListElement,
        createSubjectButton
    );
}


function recalcobj() {
    resultElement.style.display = "none";
    objectElement.style.display = "block";

    createNounList(
        objectListElement,
        createObjectButton
    );
}

function recalcadjsubj() {
    resultElement.style.display = "none";
    adjSubjElement.style.display = "block";

    createAdjList(
        adjSubjListElement,
        createAdjSubjButton
    );
}

function recalcadjobj() {
    resultElement.style.display = "none";
    adjObjElement.style.display = "block";

    createAdjList(
        adjObjListElement,
        createAdjObjButton
    );
}

function addadjsubj() {
    resultElement.style.display = "none";
    adjSubjElement.style.display = "block";

    createAdjList(
        adjSubjListElement,
        createAdjSubjButton
    );
}

function addaux() {
    resultElement.style.display = "none";
    auxElement.style.display = "block";

    createAuxList(
        auxListElement,
        createAuxButton
    );
}

function addadjobj() {
    resultElement.style.display = "none";
    adjObjElement.style.display = "block";

    createAdjList(
        adjObjListElement,
        createAdjObjButton
    );
}

function recalcaux() {
    resultElement.style.display = "none";
    auxElement.style.display = "block";

    createAuxList(
        auxListElement,
        createAuxButton
    );
}

function recalcvb() {
    resultElement.style.display = "none";
    subjectElement.style.display = "none";
    objectElement.style.display = "none";
    verbElement.style.display = "block";

    generateVerbList();
}

function calcadjform(adjectivearray, noun, noungender, casenoun) {
let a = [];
let x;
if (noungender == "m") {
a = adjectivearray.slice(0, 4);
} else if (noungender == "f") {
a = adjectivearray.slice(4, 8);
} else if (noungender == "n") {
a = adjectivearray.slice(8, 12);
}
if (casenoun == "nf") {
x = a[0];
} else if (casenoun == "þf") {
x = a[1];
} else if (casenoun == "þgf") {
x = a[2];
} else if (casenoun == "ef") {
x = a[3];
}
return [x, noun];
}

function calcadjformweak(adjectivearray, noun, noungender, casenoun) {
    let x;

    if (noungender == "m" && casenoun == "nf") {
        x = adjectivearray[0];
    } else if (noungender == "m" && casenoun !== "nf") {
        x = adjectivearray[1];
    } else if (noungender == "n") {
        x = adjectivearray[1];
    } else if (noungender == "f" && casenoun == "nf") {
        x = adjectivearray[1];
    } else {
        x = adjectivearray[2];
    }

    return [x, noun];
}

function showabout() {
const section = document.querySelector("section");
last = lastVisibleDiv(section);
console.log(last);
subjectElement.style.display = "none";
objectElement.style.display = "none";
adjSubjElement.style.display = "none";
adjObjElement.style.display = "none";
auxElement.style.display = "none";
aboutElement.style.display = "block";
instrElement.style.display = "none";
verbElement.style.display = "none";
resultElement.style.display = "none";
}

function showinstr() {
const section = document.querySelector("section");
last = lastVisibleDiv(section);
console.log(last);
subjectElement.style.display = "none";
objectElement.style.display = "none";
adjSubjElement.style.display = "none";
adjObjElement.style.display = "none";
auxElement.style.display = "none";
aboutElement.style.display = "none";
verbElement.style.display = "none";
resultElement.style.display = "none";
instrElement.style.display = "block";
}

function hideabout() {
subjectElement.style.display = "none";
objectElement.style.display = "none";
adjSubjElement.style.display = "none";
adjObjElement.style.display = "none";
auxElement.style.display = "none";
aboutElement.style.display = "none";
instrElement.style.display = "none";
verbElement.style.display = "none";
resultElement.style.display = "none";
last.style.display = "block";
}

function hideinstr() {
subjectElement.style.display = "none";
objectElement.style.display = "none";
adjSubjElement.style.display = "none";
adjObjElement.style.display = "none";
auxElement.style.display = "none";
aboutElement.style.display = "none";
instrElement.style.display = "none";
verbElement.style.display = "none";
resultElement.style.display = "none";
last.style.display = "block";
}

function lastVisibleDiv(section) {
  const visibleDivs = [...section.querySelectorAll("div")].filter(div => {
    const rect = div.getBoundingClientRect();
    const style = getComputedStyle(div);

    return (
      rect.width > 0 &&
      rect.height > 0 &&
      rect.bottom > 0 &&
      rect.right > 0 &&
      rect.top < innerHeight &&
      rect.left < innerWidth &&
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      Number(style.opacity) > 0
    );
  });

  return visibleDivs.at(-1) ?? null; // last in DOM order
}

subjectElement.style.display = "none";
objectElement.style.display = "none";
resultElement.style.display = "none";
adjSubjElement.style.display = "none";
adjObjElement.style.display = "none";
auxElement.style.display = "none";
aboutElement.style.display = "none";
instrElement.style.display = "none";

generateVerbList();
