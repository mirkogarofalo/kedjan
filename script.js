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
const binElement = document.getElementById("bin");
const titbinElement = document.getElementById("tat");
const closebinElement = document.getElementById("closetablebin");
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
let switchnumber = 0;
let switchnumber1 = 0;

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
    ["hundur", "hund", "hundi", "hunds", "m", 2, "n", "hundar", "hunda", "hundum", "hunda"],
    ["við", "okkur", "okkur", "okkar", "m", 3, "f"],
    ["kennari", "kennara", "kennara", "kennara", "m", 2, "n", "kennarar", "kennara", "kennurum", "kennara"],
    ["bók", "bók", "bók", "bókar", "f", 2, "n", "bækur", "bækur", "bókum", "bóka"],
    ["mynd", "mynd", "mynd", "myndar", "f", 2, "n", "myndir", "myndir", "myndum", "mynda"],
    ["kaka", "köku", "köku", "köku", "f", 2, "n", "kökur", "kökur", "kökum", "kakna"],
    ["samloka", "samloku", "samloku", "samloku", "f", 2, "n", "samlokur", "samloka", "samlokum", "samloka"],
    ["þið", "ykkur", "ykkur", "ykkar", "m", 4, "f"],
    ["vatn", "vatn", "vatni", "vatns", "n", 2, "n", "vötn", "vötn", "vötnum", "vatna"],
    ["safi", "safa", "safa", "safa", "m", 2, "n", "safar", "safa", "söfum", "safa"],
    ["bjór", "bjór", "bjóri", "bjórs", "m", 2, "n", "bjórar", "bjóra", "bjórum", "bjóra"],
    ["tölva", "tölvu", "tölvu", "tölvu", "f", 2, "n", "tölvur", "tölva", "tölvum", "tölva"],
    ["nemandi", "nemanda", "nemanda", "nemanda", "m", 2, "n", "nemendur", "nemendur", "nemendum", "nemenda"],
    ["kokkur", "kokk", "kokki", "kokks", "m", 2, "n", "kokkar", "kokka", "kokkum", "kokka"],
     ["leikkona", "leikkonu", "leikkonu", "leikkonu", "f", 2, "n", "leikkonur", "leikkonur", "leikkonum", "leikkvenna"],
     ["hamborgari", "hamborgara", "hamborgara", "hamborgara", "m", 2, "n", "hamborgarar", "hamborgara", "hamborgurum", "hamborgara"],
     ["mjólk", "mjólk", "mjólk", "mjólkur", "f", 2, "n"],
     ["fjölskylda", "fjölskyldu", "fjölskyldu", "fjölskyldu", "f", 2, "n", "fjölskyldur", "fjölskyldur", "fjölskyldum", "fjölskyldna"],
      ["tónlist", "tónlist", "tónlist", "tónlistar", "f", 2, "n"],
      ["saga", "sögu", "sögu", "sögu", "f", 2, "n", "sögur", "sögur", "sögum", "sagna"],
      ["barn", "barn", "barni", "barns", "n", 2, "n", "börn", "börn", "börnum", "barna"],
];

const adjectivesstrong = [
    ["fallegur", "fallegan", "fallegum", "fallegs", "falleg", "fallega", "fallegri", "fallegrar", "fallegt", "fallegt", "fallegu", "fallegs","fallegir","fallega","fallegum","fallegra","fallegar","fallegar","fallegum","fallegra","falleg","falleg","fallegum","fallegra"],
    ["hvítur", "hvítan", "hvítum", "hvíts", "hvít", "hvíta", "hvítri", "hvítrar", "hvítt", "hvítt", "hvítu", "hvíts","hvítir","hvíta","hvítum","hvítra","hvítar","hvítar","hvítum","hvítra","hvít","hvít","hvítum","hvítra"],
    ["vondur", "vondan", "vondum", "vonds", "vond", "vonda", "vondri", "vondrar", "vont", "vont", "vondu", "vonds","vondir","vonda","vondum","vondra","vondar","vondar","vondum","vondra","vond","vond","vondum","vondra"],
    ["íslenskur", "íslenskan", "íslenskum", "íslensks", "íslensk", "íslenska", "íslenskri", "íslenskrar", "íslenskt", "íslenskt", "íslensku", "íslensks","íslenskir","íslenska","íslenskum","íslenskra","íslenskar","íslenskar","íslenskum","íslenskra","íslensk","íslensk","íslenskum","íslenskra"],
    ["skemmtilegur", "skemmtilegan", "skemmtilegum", "skemmtilegs", "skemmtileg", "skemmtilega", "skemmtilegri", "skemmtilegrar", "skemmtilegt", "skemmtilegt", "skemmtilegu", "skemmtilegs","skemmtilegir","skemmtilega","skemmtilegum","skemmtilegra","skemmtilegar","skemmtilegar","skemmtilegum","skemmtilegra","skemmtileg","skemmtileg","skemmtilegum","skemmtilegra"],
    ["góður", "góðan", "góðum", "góðs", "góð", "góða", "góðri", "góðrar", "gott", "gott", "góðu", "góðs","góðir","góða","góðum","góðra","góðar","góðar","góðum","góðra","góð","góð","góðum","góðra"],
    ["gamall", "gamlan", "gömlum", "gamals", "gömul", "gamla", "gamalli", "gamallar", "gamalt", "gamalt", "gömlu", "gamals","gamlir","gamla","gömlum","gamalla","gamlar","gamlar","gömlum","gamalla","gömul","gömul","gömlum","gamalla"],
    ["nýr", "nýjan", "nýjum", "nýs", "ný", "nýja", "nýrri", "nýrrar", "nýtt", "nýtt", "nýju", "nýs","nýir","nýja","nýjum","nýrra","nýjar","nýjar","nýjum","nýrra","ný","ný","nýjum","nýrra"],
    ["stór", "stóran", "stórum", "stórs", "stór", "stóra", "stórri", "stórrar", "stórt", "stórt", "stóru", "stórs","stórir","stóra","stórum","stórra","stórar","stórar","stórum","stórra","stór","stór","stórum","stórra"]
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

const verbforms = ["GM-FH-NT-1P-ET", "GM-FH-NT-2P-ET", "GM-FH-NT-3P-ET","GM-FH-NT-1P-FT", "GM-FH-NT-2P-FT", "GM-FH-NT-3P-FT","GM-FH-ÞT-1P-ET", "GM-FH-ÞT-2P-ET", "GM-FH-ÞT-3P-ET","GM-FH-ÞT-1P-FT", "GM-FH-ÞT-2P-FT", "GM-FH-ÞT-3P-FT"];

const verbt1 = ["i","ir","i","um","uð","u"];
const verbt2 = ["","st","","um","uð","u"];
const verbt3 = ["","t","","um","uð","u"];

const art1 = ["inn","inn","inum","ins","nir","na","num","nna"];
const art2 = ["in","ina","inni","innar","nar","nar","num","nna"];
const art3 = ["ið","ið","inu","ins","in","in","num","nna"];

function getBinCaseRow(caseName) {
    return {
        nf: 1,   
        "þf": 2,
        "þgf": 3,
        ef: 4    
    }[caseName] ?? null;
}

function highlightBinCell(rowIndex, cellIndex) {
    binElement
        .querySelectorAll(".bin-current-form")
        .forEach(cell => cell.classList.remove("bin-current-form"));

    const cell = binElement.rows[rowIndex]?.cells[cellIndex];
    if (cell) {
        cell.classList.add("bin-current-form");
    }
}

function highlightNounBin(role) {
    const isSubject = role === "subject";
    const caseName = isSubject ? verbcasesubj : verbcaseobj;
    const nounIndex = isSubject ? selectedSubject : selectedObject;
    const number = isSubject ? switchnumber : switchnumber1;
    const hasPlural = nouns[nounIndex][7] !== undefined;
    const isPlural = number === 1 && hasPlural;
    const isDefinite = isSubject ? artsubj === 1 : artobj === 1;

    const row = getBinCaseRow(caseName);
    if (row === null) return;

    // Table columns: label, singular, plural, singular definite, plural definite.
    const column = (isPlural ? 2 : 1) + (isDefinite ? 2 : 0);
    highlightBinCell(row, column);
}

function highlightAdjectiveBin(role, tableIsWeak) {
    const isSubject = role === "subject";
    const nounIndex = isSubject ? selectedSubject : selectedObject;
    const caseName = isSubject ? verbcasesubj : verbcaseobj;
    const number = isSubject ? switchnumber : switchnumber1;
    const isWeak = isSubject ? artsubj === 1 : artobj === 1;

    if (tableIsWeak !== isWeak) return;

    const gender = nouns[nounIndex][4];
    const genderOffset = { m: 0, f: 1, n: 2 }[gender];
    const caseRow = getBinCaseRow(caseName);

    if (genderOffset === undefined || caseRow === null) return;

    const row = caseRow + 1;
    const column = 1 + genderOffset + (number === 1 ? 3 : 0);

    highlightBinCell(row, column);
}

function highlightVerbBin() {
    if (isThereAux === 1) return;

    let person = nouns[selectedSubject][5];

    if (verbs[selectedVerb][0] === "vanta" ||
        verbs[selectedVerb][0] === "langa") {
        person = 2;
    }
    if (switchnumber === 1) {
        person = 5;
    }

    if (!Number.isInteger(person) || person < 0 || person > 5) return;

    const isPlural = person >= 3;
    const row = (person % 3) + 1;
    const column = pasttense === 1
        ? (isPlural ? 4 : 3)
        : (isPlural ? 2 : 1);

    highlightBinCell(row, column);
}

async function getNounBin(lemma, targetCase) {
let url;
if (lemma == "saga") {
    url = 'https://bin.arnastofnun.is/api/ord/943f39cd50e2e17412f2ca9526373d40';
    } else {
    url = 'https://bin.arnastofnun.is/api/ord/no/' + encodeURIComponent(lemma);
    }

    try {
        const response = await fetch(url, {
            headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0 || !data[0].bmyndir) {
            return lemma;
        }

        const paradigm = data[0].bmyndir;

        const match =
    paradigm.find(item => (item.g || "") === targetCase) ??
    paradigm.find(item => (item.g || "").split(/[-\s]/).includes(targetCase)) ??
    paradigm.find(item => (item.g || "").includes(targetCase));

return match?.b ?? lemma;

    } catch (error) {
        console.error("Error fetching from BÍN:", error);
        return "-";
    }
}

async function getVerbBin(lemma, targetForm) {
let url;
    if (lemma == "bera") {
    url = 'https://bin.arnastofnun.is/api/ord/51ba23638c3764ca4b6a75e0bbeae71a';
    } else {
    url = 'https://bin.arnastofnun.is/api/ord/so/' + encodeURIComponent(lemma);
    }
    try {
        const response = await fetch(url, {
            headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0 || !data[0].bmyndir) {
            return lemma;
        }

        const paradigm = data[0].bmyndir;

        const match =
    paradigm.find(item => (item.g || "") === targetForm) ??
    paradigm.find(item => (item.g || "").split(/[-\s]/).includes(targetForm)) ??
    paradigm.find(item => (item.g || "").includes(targetForm));

return match?.b ?? lemma;

    } catch (error) {
        console.error("Error fetching from BÍN:", error);
        return "-";
    }
}

async function getAdjBin(lemma, targetForm) {
let url;
    //if (lemma == "bera") {
    //} else {
    url = 'https://bin.arnastofnun.is/api/ord/lo/' + encodeURIComponent(lemma);
    //}
    try {
        const response = await fetch(url, {
            headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0 || !data[0].bmyndir) {
            return lemma;
        }

        const paradigm = data[0].bmyndir;

        const match =
    paradigm.find(item => (item.g || "") === targetForm) ??
    paradigm.find(item => (item.g || "").split(/[-\s]/).includes(targetForm)) ??
    paradigm.find(item => (item.g || "").includes(targetForm));

return match?.b ?? lemma;

    } catch (error) {
        console.error("Error fetching from BÍN:", error);
        return "-";
    }
}

async function genTableBinSubjNoun() {
binElement.innerHTML = "";
const row = document.querySelector("#strfinal tr:last-child");
row.style.borderBottom = "1px dotted #ddd";
titbinElement.innerHTML = "Noun <i>" + nouns[selectedSubject][0] + "</i> on BÍN";
closebinElement.innerHTML = "<button class='menubutton' onclick='deactbin()'>Close</button>";
for (let i = 0; i < 5; i++) {
const tableRow = binElement.appendChild(
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
const fifthCell = tableRow.appendChild(
            document.createElement("td")
        );
if (i == 0) {
    firstCell.innerHTML = "<b>Case</b>";
    secondCell.innerHTML = "<b>Singular without art.</b>";
    thirdCell.innerHTML = "<b>Plural without art.</b>";
     fourthCell.innerHTML = "<b>Singular with art.</b>";
      fifthCell.innerHTML = "<b>Plural with art.</b>";
} 
if (i == 1) {
    firstCell.innerHTML = "<b>Nf.</b>";
    secondCell.innerHTML = await getNounBin(nouns[selectedSubject][0], "NFET");
    thirdCell.innerHTML = await getNounBin(nouns[selectedSubject][0], "NFFT");
     fourthCell.innerHTML = await getNounBin(nouns[selectedSubject][0], "NFETgr");
      fifthCell.innerHTML = await getNounBin(nouns[selectedSubject][0], "NFFTgr");
}
if (i == 2) {
    firstCell.innerHTML = "<b>Þf.</b>";
    secondCell.innerHTML = await getNounBin(nouns[selectedSubject][0], "ÞFET");
    thirdCell.innerHTML = await getNounBin(nouns[selectedSubject][0], "ÞFFT");
     fourthCell.innerHTML = await getNounBin(nouns[selectedSubject][0], "ÞFETgr");
      fifthCell.innerHTML = await getNounBin(nouns[selectedSubject][0], "ÞFFTgr");
}
if (i == 3) {
    firstCell.innerHTML = "<b>Þgf.</b>";
    secondCell.innerHTML = await getNounBin(nouns[selectedSubject][0], "ÞGFET");
    thirdCell.innerHTML = await getNounBin(nouns[selectedSubject][0], "ÞGFFT");
     fourthCell.innerHTML = await getNounBin(nouns[selectedSubject][0], "ÞGFETgr");
      fifthCell.innerHTML = await getNounBin(nouns[selectedSubject][0], "ÞGFFTgr");
}
if (i == 4) {
    firstCell.innerHTML = "<b>Ef.</b>";
    secondCell.innerHTML = await getNounBin(nouns[selectedSubject][0], "EFET");
    thirdCell.innerHTML = await getNounBin(nouns[selectedSubject][0], "EFFT");
     fourthCell.innerHTML = await getNounBin(nouns[selectedSubject][0], "EFETgr");
      fifthCell.innerHTML = await getNounBin(nouns[selectedSubject][0], "EFFTgr");
}
}
highlightNounBin("subject");
}

async function genTableBinObjAdjVeik() {
binElement.innerHTML = "";
const row = document.querySelector("#strfinal tr:last-child");
row.style.borderBottom = "1px dotted #ddd";
titbinElement.innerHTML = "Adjective <i>" + adjectivesstrong[selectedadjObj][0] + "</i> on BÍN - Veik beyging";
closebinElement.innerHTML = "<button class='menubutton' onclick='deactbin()'>Close</button> <button class='menubutton' onclick='genTableBinObjAdj()'>Sterk beyging</button>";
for (let i = 0; i < 6; i++) {
const tableRow = binElement.appendChild(
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
const fifthCell = tableRow.appendChild(
            document.createElement("td")
        );
const sixthCell = tableRow.appendChild(
            document.createElement("td")
        );
const seventhCell = tableRow.appendChild(
            document.createElement("td")
        );
if (i == 0) {
    firstCell.innerHTML = "<b>Case</b>";
    secondCell.innerHTML = "";
    thirdCell.innerHTML = "<b>Singular</b>";
     fourthCell.innerHTML = "";
      fifthCell.innerHTML = "";
      sixthCell.innerHTML = "<b>Plural</b>";
      seventhCell.innerHTML = "";
} 
if (i == 1) {
    firstCell.innerHTML = "";
    secondCell.innerHTML = "<b>Masc</b>";
    thirdCell.innerHTML = "<b>Fem</b>";
     fourthCell.innerHTML = "<b>Neut</b>";
      fifthCell.innerHTML = "<b>Masc</b>";
      sixthCell.innerHTML = "<b>Fem</b>";
      seventhCell.innerHTML = "<b>Neut</b>";
} 
if (i == 2) {
    firstCell.innerHTML = "<b>Nf.</b>";
    secondCell.innerHTML = adjectivesweak[selectedadjObj][0];
    thirdCell.innerHTML = adjectivesweak[selectedadjObj][1];
     fourthCell.innerHTML = adjectivesweak[selectedadjObj][1];
      fifthCell.innerHTML = adjectivesweak[selectedadjObj][2];
      sixthCell.innerHTML = adjectivesweak[selectedadjObj][2];
      seventhCell.innerHTML = adjectivesweak[selectedadjObj][2];
}
if (i == 3) {
    firstCell.innerHTML = "<b>Þf.</b>";
    secondCell.innerHTML = adjectivesweak[selectedadjObj][1];
    thirdCell.innerHTML = adjectivesweak[selectedadjObj][2];
     fourthCell.innerHTML = adjectivesweak[selectedadjObj][1];
      fifthCell.innerHTML = adjectivesweak[selectedadjObj][2];
      sixthCell.innerHTML = adjectivesweak[selectedadjObj][2];
      seventhCell.innerHTML = adjectivesweak[selectedadjObj][2];
}
if (i == 4) {
    firstCell.innerHTML = "<b>Þgf.</b>";
  secondCell.innerHTML = adjectivesweak[selectedadjObj][1];
    thirdCell.innerHTML = adjectivesweak[selectedadjObj][2];
     fourthCell.innerHTML = adjectivesweak[selectedadjObj][1];
      fifthCell.innerHTML = adjectivesweak[selectedadjObj][2];
      sixthCell.innerHTML = adjectivesweak[selectedadjObj][2];
      seventhCell.innerHTML = adjectivesweak[selectedadjObj][2];
}
if (i == 5) {
    firstCell.innerHTML = "<b>Ef.</b>";
  secondCell.innerHTML = adjectivesweak[selectedadjObj][1];
    thirdCell.innerHTML = adjectivesweak[selectedadjObj][2];
     fourthCell.innerHTML = adjectivesweak[selectedadjObj][1];
      fifthCell.innerHTML = adjectivesweak[selectedadjObj][2];
      sixthCell.innerHTML = adjectivesweak[selectedadjObj][2];
      seventhCell.innerHTML = adjectivesweak[selectedadjObj][2];
}
}
highlightAdjectiveBin("object", true);  
}

async function genTableBinObjAdj() {
binElement.innerHTML = "";
const row = document.querySelector("#strfinal tr:last-child");
row.style.borderBottom = "1px dotted #ddd";
titbinElement.innerHTML = "Adjective <i>" + adjectivesstrong[selectedadjObj][0] + "</i> on BÍN - Sterk beyging";
closebinElement.innerHTML = "<button class='menubutton' onclick='deactbin()'>Close</button> <button class='menubutton' onclick='genTableBinObjAdjVeik()'>Veik beyging</button>";
for (let i = 0; i < 6; i++) {
const tableRow = binElement.appendChild(
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
const fifthCell = tableRow.appendChild(
            document.createElement("td")
        );
const sixthCell = tableRow.appendChild(
            document.createElement("td")
        );
const seventhCell = tableRow.appendChild(
            document.createElement("td")
        );
if (i == 0) {
    firstCell.innerHTML = "<b>Case</b>";
    secondCell.innerHTML = "";
    thirdCell.innerHTML = "<b>Singular</b>";
     fourthCell.innerHTML = "";
      fifthCell.innerHTML = "";
      sixthCell.innerHTML = "<b>Plural</b>";
      seventhCell.innerHTML = "";
} 
if (i == 1) {
    firstCell.innerHTML = "";
    secondCell.innerHTML = "<b>Masc</b>";
    thirdCell.innerHTML = "<b>Fem</b>";
     fourthCell.innerHTML = "<b>Neut</b>";
      fifthCell.innerHTML = "<b>Masc</b>";
      sixthCell.innerHTML = "<b>Fem</b>";
      seventhCell.innerHTML = "<b>Neut</b>";
} 
if (i == 2) {
    firstCell.innerHTML = "<b>Nf.</b>";
    secondCell.innerHTML = await getAdjBin(adjectivesstrong[selectedadjObj][0], "FSB-KK-NFET");
    thirdCell.innerHTML = await getAdjBin(adjectivesstrong[selectedadjObj][0], "FSB-KVK-NFET");
     fourthCell.innerHTML = await getAdjBin(adjectivesstrong[selectedadjObj][0], "FSB-HK-NFET");
      fifthCell.innerHTML = await getAdjBin(adjectivesstrong[selectedadjObj][0], "FSB-KK-NFFT");
      sixthCell.innerHTML = await getAdjBin(adjectivesstrong[selectedadjObj][0], "FSB-KVK-NFFT");
      seventhCell.innerHTML = await getAdjBin(adjectivesstrong[selectedadjObj][0], "FSB-HK-NFFT");
}
if (i == 3) {
    firstCell.innerHTML = "<b>Þf.</b>";
      secondCell.innerHTML = await getAdjBin(adjectivesstrong[selectedadjObj][0], "FSB-KK-ÞFET");
    thirdCell.innerHTML = await getAdjBin(adjectivesstrong[selectedadjObj][0], "FSB-KVK-ÞFET");
     fourthCell.innerHTML = await getAdjBin(adjectivesstrong[selectedadjObj][0], "FSB-HK-ÞFET");
      fifthCell.innerHTML = await getAdjBin(adjectivesstrong[selectedadjObj][0], "FSB-KK-ÞFFT");
      sixthCell.innerHTML = await getAdjBin(adjectivesstrong[selectedadjObj][0], "FSB-KVK-ÞFFT");
      seventhCell.innerHTML = await getAdjBin(adjectivesstrong[selectedadjObj][0], "FSB-HK-ÞFFT");
}
if (i == 4) {
    firstCell.innerHTML = "<b>Þgf.</b>";
    secondCell.innerHTML = await getAdjBin(adjectivesstrong[selectedadjObj][0], "FSB-KK-ÞGFET");
    thirdCell.innerHTML = await getAdjBin(adjectivesstrong[selectedadjObj][0], "FSB-KVK-ÞGFET");
     fourthCell.innerHTML = await getAdjBin(adjectivesstrong[selectedadjObj][0], "FSB-HK-ÞGFET");
      fifthCell.innerHTML = await getAdjBin(adjectivesstrong[selectedadjObj][0], "FSB-KK-ÞGFFT");
      sixthCell.innerHTML = await getAdjBin(adjectivesstrong[selectedadjObj][0], "FSB-KVK-ÞGFFT");
      seventhCell.innerHTML = await getAdjBin(adjectivesstrong[selectedadjObj][0], "FSB-HK-ÞGFFT");
}
if (i == 5) {
    firstCell.innerHTML = "<b>Ef.</b>";
      secondCell.innerHTML = await getAdjBin(adjectivesstrong[selectedadjObj][0], "FSB-KK-EFET");
    thirdCell.innerHTML = await getAdjBin(adjectivesstrong[selectedadjObj][0], "FSB-KVK-EFET");
     fourthCell.innerHTML = await getAdjBin(adjectivesstrong[selectedadjObj][0], "FSB-HK-EFET");
      fifthCell.innerHTML = await getAdjBin(adjectivesstrong[selectedadjObj][0], "FSB-KK-EFFT");
      sixthCell.innerHTML = await getAdjBin(adjectivesstrong[selectedadjObj][0], "FSB-KVK-EFFT");
      seventhCell.innerHTML = await getAdjBin(adjectivesstrong[selectedadjObj][0], "FSB-HK-EFFT");
}
}
highlightAdjectiveBin("object", false); 
}

async function genTableBinSubjAdjVeik() {
binElement.innerHTML = "";
const row = document.querySelector("#strfinal tr:last-child");
row.style.borderBottom = "1px dotted #ddd";
titbinElement.innerHTML = "Adjective <i>" + adjectivesstrong[selectedadjSubj][0] + "</i> on BÍN - Veik beyging";
closebinElement.innerHTML = "<button class='menubutton' onclick='deactbin()'>Close</button> <button class='menubutton' onclick='genTableBinSubjAdj()'>Sterk beyging</button>";
for (let i = 0; i < 6; i++) {
const tableRow = binElement.appendChild(
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
const fifthCell = tableRow.appendChild(
            document.createElement("td")
        );
const sixthCell = tableRow.appendChild(
            document.createElement("td")
        );
const seventhCell = tableRow.appendChild(
            document.createElement("td")
        );
if (i == 0) {
    firstCell.innerHTML = "<b>Case</b>";
    secondCell.innerHTML = "";
    thirdCell.innerHTML = "<b>Singular</b>";
     fourthCell.innerHTML = "";
      fifthCell.innerHTML = "";
      sixthCell.innerHTML = "<b>Plural</b>";
      seventhCell.innerHTML = "";
} 
if (i == 1) {
    firstCell.innerHTML = "";
    secondCell.innerHTML = "<b>Masc</b>";
    thirdCell.innerHTML = "<b>Fem</b>";
     fourthCell.innerHTML = "<b>Neut</b>";
      fifthCell.innerHTML = "<b>Masc</b>";
      sixthCell.innerHTML = "<b>Fem</b>";
      seventhCell.innerHTML = "<b>Neut</b>";
} 
if (i == 2) {
    firstCell.innerHTML = "<b>Nf.</b>";
    secondCell.innerHTML = adjectivesweak[selectedadjSubj][0];
    thirdCell.innerHTML = adjectivesweak[selectedadjSubj][1];
     fourthCell.innerHTML = adjectivesweak[selectedadjSubj][1];
      fifthCell.innerHTML = adjectivesweak[selectedadjSubj][2];
      sixthCell.innerHTML = adjectivesweak[selectedadjSubj][2];
      seventhCell.innerHTML = adjectivesweak[selectedadjSubj][2];
}
if (i == 3) {
    firstCell.innerHTML = "<b>Þf.</b>";
    secondCell.innerHTML = adjectivesweak[selectedadjSubj][1];
    thirdCell.innerHTML = adjectivesweak[selectedadjSubj][2];
     fourthCell.innerHTML = adjectivesweak[selectedadjSubj][1];
      fifthCell.innerHTML = adjectivesweak[selectedadjSubj][2];
      sixthCell.innerHTML = adjectivesweak[selectedadjSubj][2];
      seventhCell.innerHTML = adjectivesweak[selectedadjSubj][2];
}
if (i == 4) {
    firstCell.innerHTML = "<b>Þgf.</b>";
    secondCell.innerHTML = adjectivesweak[selectedadjSubj][1];
    thirdCell.innerHTML = adjectivesweak[selectedadjSubj][2];
     fourthCell.innerHTML = adjectivesweak[selectedadjSubj][1];
      fifthCell.innerHTML = adjectivesweak[selectedadjSubj][2];
      sixthCell.innerHTML = adjectivesweak[selectedadjSubj][2];
      seventhCell.innerHTML = adjectivesweak[selectedadjSubj][2];
}
if (i == 5) {
    firstCell.innerHTML = "<b>Ef.</b>";
    secondCell.innerHTML = adjectivesweak[selectedadjSubj][1];
    thirdCell.innerHTML = adjectivesweak[selectedadjSubj][2];
     fourthCell.innerHTML = adjectivesweak[selectedadjSubj][1];
      fifthCell.innerHTML = adjectivesweak[selectedadjSubj][2];
      sixthCell.innerHTML = adjectivesweak[selectedadjSubj][2];
      seventhCell.innerHTML = adjectivesweak[selectedadjSubj][2];
}
}
highlightAdjectiveBin("subject", true);
}

async function genTableBinSubjAdj() {
binElement.innerHTML = "";
const row = document.querySelector("#strfinal tr:last-child");
row.style.borderBottom = "1px dotted #ddd";
titbinElement.innerHTML = "Adjective <i>" + adjectivesstrong[selectedadjSubj][0] + "</i> on BÍN - Sterk beyging";
closebinElement.innerHTML = "<button class='menubutton' onclick='deactbin()'>Close</button> <button class='menubutton' onclick='genTableBinSubjAdjVeik()'>Veik beyging</button>";
for (let i = 0; i < 6; i++) {
const tableRow = binElement.appendChild(
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
const fifthCell = tableRow.appendChild(
            document.createElement("td")
        );
const sixthCell = tableRow.appendChild(
            document.createElement("td")
        );
const seventhCell = tableRow.appendChild(
            document.createElement("td")
        );
if (i == 0) {
    firstCell.innerHTML = "<b>Case</b>";
    secondCell.innerHTML = "";
    thirdCell.innerHTML = "<b>Singular</b>";
     fourthCell.innerHTML = "";
      fifthCell.innerHTML = "";
      sixthCell.innerHTML = "<b>Plural</b>";
      seventhCell.innerHTML = "";
} 
if (i == 1) {
    firstCell.innerHTML = "";
    secondCell.innerHTML = "<b>Masc</b>";
    thirdCell.innerHTML = "<b>Fem</b>";
     fourthCell.innerHTML = "<b>Neut</b>";
      fifthCell.innerHTML = "<b>Masc</b>";
      sixthCell.innerHTML = "<b>Fem</b>";
      seventhCell.innerHTML = "<b>Neut</b>";
} 
if (i == 2) {
    firstCell.innerHTML = "<b>Nf.</b>";
    secondCell.innerHTML = await getAdjBin(adjectivesstrong[selectedadjSubj][0], "FSB-KK-NFET");
    thirdCell.innerHTML = await getAdjBin(adjectivesstrong[selectedadjSubj][0], "FSB-KVK-NFET");
     fourthCell.innerHTML = await getAdjBin(adjectivesstrong[selectedadjSubj][0], "FSB-HK-NFET");
      fifthCell.innerHTML = await getAdjBin(adjectivesstrong[selectedadjSubj][0], "FSB-KK-NFFT");
      sixthCell.innerHTML = await getAdjBin(adjectivesstrong[selectedadjSubj][0], "FSB-KVK-NFFT");
      seventhCell.innerHTML = await getAdjBin(adjectivesstrong[selectedadjSubj][0], "FSB-HK-NFFT");
}
if (i == 3) {
    firstCell.innerHTML = "<b>Þf.</b>";
      secondCell.innerHTML = await getAdjBin(adjectivesstrong[selectedadjSubj][0], "FSB-KK-ÞFET");
    thirdCell.innerHTML = await getAdjBin(adjectivesstrong[selectedadjSubj][0], "FSB-KVK-ÞFET");
     fourthCell.innerHTML = await getAdjBin(adjectivesstrong[selectedadjSubj][0], "FSB-HK-ÞFET");
      fifthCell.innerHTML = await getAdjBin(adjectivesstrong[selectedadjSubj][0], "FSB-KK-ÞFFT");
      sixthCell.innerHTML = await getAdjBin(adjectivesstrong[selectedadjSubj][0], "FSB-KVK-ÞFFT");
      seventhCell.innerHTML = await getAdjBin(adjectivesstrong[selectedadjSubj][0], "FSB-HK-ÞFFT");
}
if (i == 4) {
    firstCell.innerHTML = "<b>Þgf.</b>";
    secondCell.innerHTML = await getAdjBin(adjectivesstrong[selectedadjSubj][0], "FSB-KK-ÞGFET");
    thirdCell.innerHTML = await getAdjBin(adjectivesstrong[selectedadjSubj][0], "FSB-KVK-ÞGFET");
     fourthCell.innerHTML = await getAdjBin(adjectivesstrong[selectedadjSubj][0], "FSB-HK-ÞGFET");
      fifthCell.innerHTML = await getAdjBin(adjectivesstrong[selectedadjSubj][0], "FSB-KK-ÞGFFT");
      sixthCell.innerHTML = await getAdjBin(adjectivesstrong[selectedadjSubj][0], "FSB-KVK-ÞGFFT");
      seventhCell.innerHTML = await getAdjBin(adjectivesstrong[selectedadjSubj][0], "FSB-HK-ÞGFFT");
}
if (i == 5) {
    firstCell.innerHTML = "<b>Ef.</b>";
      secondCell.innerHTML = await getAdjBin(adjectivesstrong[selectedadjSubj][0], "FSB-KK-EFET");
    thirdCell.innerHTML = await getAdjBin(adjectivesstrong[selectedadjSubj][0], "FSB-KVK-EFET");
     fourthCell.innerHTML = await getAdjBin(adjectivesstrong[selectedadjSubj][0], "FSB-HK-EFET");
      fifthCell.innerHTML = await getAdjBin(adjectivesstrong[selectedadjSubj][0], "FSB-KK-EFFT");
      sixthCell.innerHTML = await getAdjBin(adjectivesstrong[selectedadjSubj][0], "FSB-KVK-EFFT");
      seventhCell.innerHTML = await getAdjBin(adjectivesstrong[selectedadjSubj][0], "FSB-HK-EFFT");
}
}
highlightAdjectiveBin("subject", false);
}

async function genTableBinObjNoun() {
titbinElement.innerHTML = "Noun <i>" + nouns[selectedObject][0] + "</i> on BÍN";
closebinElement.innerHTML = "<button class='menubutton' onclick='deactbin()'>Close</button>";
binElement.innerHTML = "";
const row = document.querySelector("#strfinal tr:last-child");
row.style.borderBottom = "1px dotted #ddd";
for (let i = 0; i < 5; i++) {
const tableRow = binElement.appendChild(
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
const fifthCell = tableRow.appendChild(
            document.createElement("td")
        );
if (i == 0) {
    firstCell.innerHTML = "<b>Case</b>";
    secondCell.innerHTML = "<b>Singular without art.</b>";
    thirdCell.innerHTML = "<b>Plural without art.</b>";
     fourthCell.innerHTML = "<b>Singular with art.</b>";
      fifthCell.innerHTML = "<b>Plural with art.</b>";
} 
if (i == 1) {
    firstCell.innerHTML = "<b>Nf.</b>";
    secondCell.innerHTML = await getNounBin(nouns[selectedObject][0], "NFET");
    thirdCell.innerHTML = await getNounBin(nouns[selectedObject][0], "NFFT");
     fourthCell.innerHTML = await getNounBin(nouns[selectedObject][0], "NFETgr");
      fifthCell.innerHTML = await getNounBin(nouns[selectedObject][0], "NFFTgr");
}
if (i == 2) {
    firstCell.innerHTML = "<b>Þf.</b>";
    secondCell.innerHTML = await getNounBin(nouns[selectedObject][0], "ÞFET");
    thirdCell.innerHTML = await getNounBin(nouns[selectedObject][0], "ÞFFT");
     fourthCell.innerHTML = await getNounBin(nouns[selectedObject][0], "ÞFETgr");
      fifthCell.innerHTML = await getNounBin(nouns[selectedObject][0], "ÞFFTgr");
}
if (i == 3) {
    firstCell.innerHTML = "<b>Þgf.</b>";
    secondCell.innerHTML = await getNounBin(nouns[selectedObject][0], "ÞGFET");
    thirdCell.innerHTML = await getNounBin(nouns[selectedObject][0], "ÞGFFT");
     fourthCell.innerHTML = await getNounBin(nouns[selectedObject][0], "ÞGFETgr");
      fifthCell.innerHTML = await getNounBin(nouns[selectedObject][0], "ÞGFFTgr");
}
if (i == 4) {
    firstCell.innerHTML = "<b>Ef.</b>";
    secondCell.innerHTML = await getNounBin(nouns[selectedObject][0], "EFET");
    thirdCell.innerHTML = await getNounBin(nouns[selectedObject][0], "EFFT");
     fourthCell.innerHTML = await getNounBin(nouns[selectedObject][0], "EFETgr");
      fifthCell.innerHTML = await getNounBin(nouns[selectedObject][0], "EFFTgr");
}
}
highlightNounBin("object");
}

function deactbin() {
titbinElement.innerHTML = "";
closebinElement.innerHTML = "";
binElement.innerHTML = "";
const row = document.querySelector("#strfinal tr:last-child");
if (row) {
row.style.borderBottom = "1px solid #fff";
}
}

async function genTableBinVerb() {
titbinElement.innerHTML = "Verb <i>" + verbs[selectedVerb][0] + "</i> on BÍN";
closebinElement.innerHTML = "<button class='menubutton' onclick='deactbin()'>Close</button>";
binElement.innerHTML = "";
const row = document.querySelector("#strfinal tr:last-child");
row.style.borderBottom = "1px dotted #ddd";
for (let i = 0; i < 4; i++) {
const tableRow = binElement.appendChild(
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
const fifthCell = tableRow.appendChild(
            document.createElement("td")
        );
if (i == 0) {
    firstCell.innerHTML = "<b>Person</b>";
    secondCell.innerHTML = "<b>Singular present</b>";
    thirdCell.innerHTML = "<b>Plural present</b>";
     fourthCell.innerHTML = "<b>Singular past</b>";
      fifthCell.innerHTML = "<b>Plural past</b>";
} 
if (i == 1) {
    firstCell.innerHTML = "<b>1.ps.</b>";
    secondCell.innerHTML = await getVerbBin(verbs[selectedVerb][0], verbforms[0]);
    thirdCell.innerHTML = await getVerbBin(verbs[selectedVerb][0], verbforms[3]);
     fourthCell.innerHTML = await getVerbBin(verbs[selectedVerb][0], verbforms[6]);
      fifthCell.innerHTML = await getVerbBin(verbs[selectedVerb][0], verbforms[9]);
}
if (i == 2) {
    firstCell.innerHTML = "<b>2.ps.</b>";
    secondCell.innerHTML =  await getVerbBin(verbs[selectedVerb][0], verbforms[1]);
    thirdCell.innerHTML = await getVerbBin(verbs[selectedVerb][0], verbforms[4]);
     fourthCell.innerHTML =  await getVerbBin(verbs[selectedVerb][0], verbforms[7]);
      fifthCell.innerHTML = await getVerbBin(verbs[selectedVerb][0], verbforms[10]);
}
if (i == 3) {
    firstCell.innerHTML = "<b>3.ps.</b>";
    secondCell.innerHTML = await getVerbBin(verbs[selectedVerb][0], verbforms[2]);
    thirdCell.innerHTML = await getVerbBin(verbs[selectedVerb][0], verbforms[5]);
     fourthCell.innerHTML = await getVerbBin(verbs[selectedVerb][0], verbforms[8]);
      fifthCell.innerHTML = await getVerbBin(verbs[selectedVerb][0], verbforms[11]);
}
}
highlightVerbBin();
}

function openSubjAdjBin() {
    return artsubj === 1
        ? genTableBinSubjAdjVeik()
        : genTableBinSubjAdj();
}

function openObjAdjBin() {
    return artobj === 1
        ? genTableBinObjAdjVeik()
        : genTableBinObjAdj();
}

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

function subjplur() {
switchnumber = 1;
recalculateSentence();
}

function subjsing() {
switchnumber = 0;
recalculateSentence();
}

function objplur() {
switchnumber1 = 1;
recalculateSentence();
}

function objsing() {
switchnumber1 = 0;
recalculateSentence();
}

function getNounForm(caseName, nounIndex, type) {
let index;
if (type == "s") {
    if (switchnumber == 0) {
    index = 0;
    } else if (switchnumber == 1) {
    index = 7;
    }
} else if (type == "o") {
    if (switchnumber1 == 0) {
    index = 0;
    } else if (switchnumber1 == 1) {
    index = 7;
    }
}
if (nouns[nounIndex][7] == undefined) {
index = 0;
if (type == "s") {
switchnumber = 0;
} else if (type == "o") {
switchnumber1 = 0;
}
}
    switch (caseName) {
        case "nf":
            return [nouns[nounIndex][0+index], nouns[nounIndex][6]];

        case "þf":
            return [nouns[nounIndex][1+index], nouns[nounIndex][6]];

        case "þgf":
            return [nouns[nounIndex][2+index], nouns[nounIndex][6]];

        case "ef":
            return [nouns[nounIndex][3+index], nouns[nounIndex][6]];

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
    
    resultsubj = getNounForm(verbcasesubj, selectedSubject, "s");
    if (resultsubj[1] === "f") {
    artsubj = 0;
    } else if (artsubj === 1) {
    artsubj = 1;
    }

resultobj = getNounForm(verbcaseobj, selectedObject, "o");

if (resultobj[1] === "f") {
    artobj = 0;
} else if (artobj === 1) {
   artobj = 1;
}

let fall = nouns[selectedSubject][5];
if (verbs[selectedVerb][0] == "vanta" || verbs[selectedVerb][0] == "langa") {
fall = 2;
}

if (switchnumber == 1) {
fall = 5;
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
        if (container.id == "nounlist") {
        image.src = "img/nouns/" + nouns[i][0] + ".jpg";
        } else if (container.id == "objlist") {
        image.src = "img/nouns2/" + nouns[i][0] + ".jpg";
        }

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
        image.src = "img/adj/" + adjectivesstrong[i][0] + ".jpg";

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
        image.src = "img/verbs/" + verbs[i][0] + ".jpg";

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
        image.src = "img/aux/" + modalverbs[i][0] + ".jpg";

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
deactbin();
let xarray = "";
let stringbutton = "";
let yarray = "";
let stringbutton2 = "";
let stringgrsubjact = `<button class="menubuttonf" onclick="activateartsubj()">+gr.</button>`;
let stringgrobjact = `<button class="menubuttonf" onclick="activateartobj()">+gr.</button>`;
let stringgrsubjdeact = `<button class="menubuttonf" onclick="removeartsubj()">-gr.</button>`;
let stringgrobjdeact = `<button class="menubuttonf" onclick="removeartobj()">-gr.</button>`;
let stringsubjpl = "";
let stringobjpl = "";
if (resultsubj[1] == "n" && switchnumber == 0 && nouns[selectedSubject][7] !== undefined) {
stringsubjpl = `<button class="menubuttonf" onclick="subjplur()">+ft.</button>`;
} else if (resultsubj[1] == "n" && switchnumber == 1) {
stringsubjpl = `<button class="menubuttonf" onclick="subjsing()">-ft.</button>`;
} else {
stringsubjpl = "";
}
if (resultobj[1] == "n" && switchnumber1 == 0 && nouns[selectedObject][7] !== undefined) {
stringobjpl = `<button class="menubuttonf" onclick="objplur()">+ft.</button>`;
} else if (resultobj[1] == "n" && switchnumber1 == 1) {
stringobjpl = `<button class="menubuttonf" onclick="objsing()">-ft.</button>`;
} else {
stringobjpl = "";
}
let stateartsubj = "";
let stateartobj = "";
let descrcasesubj = "";
let descrcaseobj = "";
let strtense = "";
let tenseindicator = "";
let stringprep = "";
let binsubj = "";
let binverb = '<button class="openbin" onclick="genTableBinVerb()">' + verbs[selectedVerb][0] + " á BÍN</button>";
let binobj = "";
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
strtense = `<button class="menubuttonf" onclick="activatepast()">+þátíð</button>`;
tenseindicator = "<span class='caseinfo'>nútíð (present)</span>";
} else {
strtense = `<button class="menubuttonf" onclick="restorepresent()">+nútíð</button>`;
tenseindicator = "<span class='caseinfo'>þátíð (past)</span>"
}
    
    if (isThereSubjAdj === 1 && resultsubj[1] == "n" && artsubj == 0) {
        xarray = calcadjform(adjectivesstrong[selectedadjSubj], resultsubj[0], nouns[selectedSubject][4], verbs[selectedVerb][3], "s");
        stringbutton = `<button class="menubutton" onclick="recalcadjsubj()">` + xarray[0] + `</button>`;
        binsubj = `<button class="openbin" onclick="openSubjAdjBin()">` + adjectivesstrong[selectedadjSubj][0] + ` á BÍN</button> <button class="openbin" onclick="genTableBinSubjNoun()">` + nouns[selectedSubject][0] + ` á BÍN</button>`;
        } else if (isThereSubjAdj === 1 && resultsubj[1] == "n" && artsubj == 1) {
        xarray = calcadjformweak(adjectivesweak[selectedadjSubj], resultsubj[0], nouns[selectedSubject][4], verbs[selectedVerb][3], "s");
        stringbutton = `<button class="menubutton" onclick="recalcadjsubj()">` + xarray[0] + `</button>`;
        binsubj = `<button class="openbin" onclick="openSubjAdjBin()">` + adjectivesstrong[selectedadjSubj][0] + ` á BÍN</button> <button class="openbin" onclick="genTableBinSubjNoun()">` + nouns[selectedSubject][0] + ` á BÍN</button>`;
        }
        
    if (isThereObjAdj === 1 && resultobj[1] == "n" && artobj == 0) {
        yarray = calcadjform(adjectivesstrong[selectedadjObj], resultobj[0], nouns[selectedObject][4], verbs[selectedVerb][4], "o");
        stringbutton2 = `<button class="menubutton" onclick="recalcadjobj()">` + yarray[0] + `</button>`;
        binobj = `<button class="openbin" onclick="openObjAdjBin()">` + adjectivesstrong[selectedadjObj][0] + ` á BÍN</button> <button class="openbin" onclick="genTableBinObjNoun()">` + nouns[selectedObject][0] + ` á BÍN</button>`;
        } else if (isThereObjAdj === 1 && resultobj[1] == "n" && artobj == 1) {
        yarray = calcadjformweak(adjectivesweak[selectedadjObj], resultobj[0], nouns[selectedObject][4], verbs[selectedVerb][4], "o");
        stringbutton2 = `<button class="menubutton" onclick="recalcadjobj()">` + yarray[0] + `</button>`;
        binobj = `<button class="openbin" onclick="openObjAdjBin()">` + adjectivesstrong[selectedadjObj][0] + ` á BÍN</button> <button class="openbin" onclick="genTableBinObjNoun()">` + nouns[selectedObject][0] + ` á BÍN</button>`;
        } 
    
     if (isThereSubjAdj === 0 && resultsubj[1] == "n") {
    binsubj = `<button class="openbin" onclick="genTableBinSubjNoun()">` + nouns[selectedSubject][0] + ` á BÍN</button>`;
    }
    
    if (isThereObjAdj === 0 && resultobj[1] == "n") {
    binobj = `<button class="openbin" onclick="genTableBinObjNoun()">` + nouns[selectedObject][0] + ` á BÍN</button>`;
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
            "",
        ],
        [  "Frumlag (subject)",
            resultsubj[0],
            "<span class='caseinfo'>" + descrcasesubj + "</span>",
            "recalcsubj",
            binsubj,
        ],
        [
            "Sögn (verb)",
            resultv,
            tenseindicator,
            "recalcvb",
            binverb,
        ],
        [
            "Andlag (object)",
            resultobj[0],
            "<span class='caseinfo'>" + descrcaseobj + "</span>",
            "recalcobj",
            binobj,
        ],
    ];

    for (let i = 0; i < 5; i++) {
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
        
        //const fourthCell = tableRow.appendChild(
        //    document.createElement("td")
        //);
        
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
             // fourthCell.innerHTML = "";  
        } else if (i === 3) {
            if (resultsubj[1] == "n" && isThereSubjAdj == 0) {
            firstCell.innerHTML = stringsubjpl + ` <button class="menubuttonf" onclick="addadjsubj()">` +
                `+lo.</button> ` + stateartsubj;
            } else if (resultsubj[1] == "n" && isThereSubjAdj == 1) {
            firstCell.innerHTML = stringsubjpl + ` <button class="menubuttonf" onclick="removeadjsubj()">` +
                `-lo.</button> ` + stateartsubj;
            } else {
            firstCell.innerHTML = "";
            }
            if (isThereAux == 0) {
            secondCell.innerHTML = strtense + ` <button class="menubuttonf" onclick="addaux()">+aux</button>`;
            } else {
             secondCell.innerHTML = strtense + ` <button class="menubuttonf" onclick="removeaux()">-aux</button>`;
            }
            if (resultobj[1] == "n" && isThereObjAdj == 0) {
           thirdCell.innerHTML = stringobjpl + ` <button class="menubuttonf" onclick="addadjobj()">` +
                `+lo.</button> ` + stateartobj;
            } else if (resultobj[1] == "n" && isThereObjAdj == 1) {
           thirdCell.innerHTML = stringobjpl + ` <button class="menubuttonf" onclick="removeadjobj()">` +
                `-lo.</button> ` + stateartobj;
            } else {
            thirdCell.innerHTML = "";
            }
           // fourthCell.innerHTML = "";
        } else {
            firstCell.innerHTML = `<p>${rows[1][i]}</p>`;
            secondCell.innerHTML = `<p>${rows[2][i]}</p>`;
            thirdCell.innerHTML = `<p>${rows[3][i]}</p>`;
           // fourthCell.innerHTML = `<p>${rows[4][i]}</p>`;
            
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
sentenceElement.style.display = "flex";
sentenceElement.style.flexDirection = "column";
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
let index;
if (switchnumber == 0) {
    index = 0;
    } else if (switchnumber == 1) {
    index = 4;
    }
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
artform = artarray[0+index];
} else if (verbcasesubj == "þf") {
artform = artarray[1+index];
} else if (verbcasesubj == "þgf") {
artform = artarray[2+index];
} else if (verbcasesubj == "ef") {
artform = artarray[3+index];
}
if (switchnumber == 0) {
if (resultsubj[0].endsWith("a") == true || resultsubj[0].endsWith("i") == true || resultsubj[0].endsWith("u") == true) {
artform = artform.slice(1);
}
}
if (resultsubj[0].endsWith("um") == true) {
resultsubj[0] = resultsubj[0].slice(0,-1);
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
let index;
if (switchnumber1 == 0) {
    index = 0;
    } else if (switchnumber1 == 1) {
    index = 4;
    }
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
artform = artarray[0+index];
} else if (verbcaseobj == "þf") {
artform = artarray[1+index];
} else if (verbcaseobj == "þgf") {
artform = artarray[2+index];
} else if (verbcaseobj == "ef") {
artform = artarray[3+index];
}
if (switchnumber1 == 0) {
if (resultobj[0].endsWith("a") == true || resultobj[0].endsWith("i") == true || resultobj[0].endsWith("u") == true) {
artform = artform.slice(1);
}
}
if (resultobj[0] == "kokki") {
resultobj[0] = "kokk";
}
if (resultobj[0].endsWith("um") == true) {
resultobj[0] = resultobj[0].slice(0,-1);
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

function calcadjform(adjectivearray, noun, noungender, casenoun, type) {
let index;
if (type == "s") {
    if (switchnumber == 0) {
    index = 0;
    } else if (switchnumber == 1) {
    index = 12;
    }
} else if (type == "o") {
    if (switchnumber1 == 0) {
    index = 0;
    } else if (switchnumber1 == 1) {
    index = 12;
    }
}
let a = [];
let x;
if (noungender == "m") {
a = adjectivearray.slice(0+index, 4+index);
} else if (noungender == "f") {
a = adjectivearray.slice(4+index, 8+index);
} else if (noungender == "n") {
a = adjectivearray.slice(8+index, 12+index);
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

function calcadjformweak(adjectivearray, noun, noungender, casenoun, type) {
    let x;
    let index;
    if (type == "s") {
    if (switchnumber == 0) {
    index = 0;
    } else if (switchnumber == 1) {
    index = 1;
    }
} else if (type == "o") {
    if (switchnumber1 == 0) {
    index = 0;
    } else if (switchnumber1 == 1) {
    index = 1;
    }
}
    if (noungender == "m" && casenoun == "nf" && index == 0) {
        x = adjectivearray[0];
    } else if (noungender == "m" && casenoun !== "nf" && index == 0) {
        x = adjectivearray[1];
    } else if (noungender == "n" && index == 0) {
        x = adjectivearray[1];
    } else if (noungender == "f" && casenoun == "nf" && index == 0) {
        x = adjectivearray[1];
    } else {
        x = adjectivearray[2];
    }

    return [x, noun];
}

function showabout() {
const section = document.querySelector("section");
last = lastVisibleDiv(section);
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
