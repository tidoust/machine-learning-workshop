const fs = require("fs");
const talks = require("../_data/talks.json");

const toSlug = title => title.replace(/([A-Z])/g, s => s.toLowerCase())
        .replace(/[^a-z0-9]/g, '_')
        .replace(/_+/g, '_');

let sectionNum = 0;
let prevlink = "", prevtitle = "";
for (let section of talks) {
  sectionNum++;
  const shortnames = Object.keys(section);
  let sectionContent = `<div class="talks">` ;
for(let i = 0; i < shortnames.length; i++) {
  const shortname = shortnames[i];
  const talk = section[shortname];
  const slug = toSlug(talk.title)
  if (talk.video) {
    const duration = talk.duration.split(':')[0].replace(/^0/, '');

    sectionContent += `<details class=talk><summary><a href="talks/${slug}.html"><img src="${talk.thumbnail}" alt="Watch ${talk.title}" width=200 class="tn"></a><a href="talks/${slug}.html">${talk.title}</a><span class="summary"> by ${talk.author}${talk.affiliation ? " (" + talk.affiliation + ")" : ""} - ${duration} min</span><a>more…</a></summary>`;
    sectionContent += `<p><a href="talks/${slug}.html">${duration} minutes presentation</a></p>`;
  } else {
    sectionContent += `<details><summary><span>PENDING </span><a>${talk.title}</a><span class="summary"> by ${talk.author}${talk.affiliation ? " (" + talk.affiliation + ")" : ""}</span><a>more…</a></summary>`;
  }
  sectionContent += `<dl>`;
  sectionContent += `<dt>Speaker</dt>`;
  sectionContent += `<dd>${talk.author}${talk.affiliation ? " (" + talk.affiliation + ")" : ""}</dd>`;
  if (talk.bio) {
    sectionContent += `<dd>${talk.bio}</dd>`;
  }
  if (talk.abstract) {
    sectionContent += `<dt>Abstract</dt>`;
    sectionContent += `<dd>${talk.abstract}</dd>`;
  }
  sectionContent += "</dl></details>\n"; 

  if (!talk.video) continue;
  const format = talk.format || "pdf";
  const slidesurl = talk.noslide ? "" : talk.url || 'https://www.w3.org/2020/Talks/mlws/' + shortname + '.pdf';
  let nextTalk;
  let cur = i;
  let sectionCur = sectionNum - 1;
  while (true) {
    cur++;
    if (cur < Object.keys(talks[sectionCur]).length ) {
      nextTalk = talks[sectionCur][Object.keys(talks[sectionCur])[cur]];
      if (nextTalk && nextTalk.video) break;
    } else if ( sectionCur < talks.length - 1) {
      sectionCur++;
      cur = -1;
    } else {
      break
    }
  }
  const nextlink =  nextTalk ? toSlug(nextTalk.title) + ".html" : "";
  const nexttitle = nextTalk ? nextTalk.title : "";
  const duration_so = "PT" + talk.duration.split(":")[0] + "M" + talk.duration.split(":")[1] + "S";
  const content = `---
title: "${talk.title}"
author: ${talk.author} (${talk.affiliation})
layout: talk
format: ${format}
shortname: ${shortname}
thumbnailurl: ${talk.thumbnail}
videourl: ${talk.video}
slidesurl: ${slidesurl}
prevlink: ${prevlink}
prevtitle: "${prevtitle}"
nextlink: ${nextlink}
nexttitle: "${nexttitle}"
duration_so: "${duration_so}"
---
`;

  fs.writeFileSync("talks/" + slug + ".html", content, {encoding: "utf-8"});
  prevlink = toSlug(talk.title) + ".html";
  prevtitle = talk.title;
}
  sectionContent += "</dl>";
  fs.writeFileSync("_includes/talk-list" + sectionNum + ".html", sectionContent, {encoding: "utf-8"});

}
