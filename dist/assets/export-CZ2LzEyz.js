import{f as u,a as c}from"./index-DLzbRoci.js";function d(t,a,e){const o=new Blob([a],{type:e}),n=URL.createObjectURL(o),r=document.createElement("a");r.href=n,r.download=t,document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(n)}function i(t,a=!0){const e=`Lap,Lap Duration,Total Elapsed
`,o=t.map(n=>`${n.number},${u(n.duration,a)},${c(n.total,a)}`).join(`
`);d("chrono-ai-laps.csv",e+o+`
`,"text/csv;charset=utf-8;")}function m(t,a=!0){const e={id:t.id,date:new Date(t.date).toISOString(),totalTime:c(t.totalTime,a),laps:t.laps.map(o=>({number:o.number,duration:u(o.duration,a),total:c(o.total,a)}))};d("chrono-ai-session.json",JSON.stringify(e,null,2),"application/json;charset=utf-8;")}export{i as exportCSV,m as exportJSON};
