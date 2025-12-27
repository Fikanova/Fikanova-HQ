import{j as e}from"./jsx-runtime.TBa3i5EZ.js";import{r as h}from"./index.CVf8TyFT.js";import{m as v}from"./proxy.DBxViIPh.js";function y(){const[i,r]=h.useState({hours:48,agents:3});return h.useEffect(()=>{const s=setInterval(()=>{r(t=>({hours:t.hours+(Math.random()>.7?1:0),agents:Math.max(2,Math.min(5,t.agents+(Math.random()>.9?Math.random()>.5?1:-1:0)))}))},5e3);return()=>clearInterval(s)},[]),e.jsxs("div",{className:"impact-dashboard",children:[e.jsx("div",{className:"ticker-bar",children:e.jsxs("div",{className:"ticker-content",children:[e.jsx(o,{label:"Hours Saved",value:`${i.hours}h`,type:"highlight"}),e.jsx("span",{className:"ticker-divider"}),e.jsx(o,{label:"Active Agents",value:i.agents,type:"success",pulse:!0}),e.jsx("span",{className:"ticker-divider"}),e.jsx(o,{label:"Clients Onboarded",value:"8",type:"highlight"}),e.jsx("span",{className:"ticker-divider"}),e.jsx(o,{label:"Uptime",value:"99.9%",type:"success"})]})}),e.jsxs("div",{className:"dashboard-header",children:[e.jsxs("div",{className:"header-left",children:[e.jsx("h2",{className:"dashboard-title",children:"System Impact"}),e.jsxs("span",{className:"live-badge",children:[e.jsx("span",{className:"live-dot"}),"Live"]})]}),e.jsx("p",{className:"dashboard-subtitle",children:"Real-time performance metrics across Fikanova operations"})]}),e.jsxs("div",{className:"metrics-grid",children:[e.jsx(x,{title:"Operational Savings",value:"KES 120K",change:15,chartData:[0,5,12,18,25,35,48,65,85,120],type:"green"}),e.jsx(x,{title:"SME Partners",value:"8",change:25,chartData:[0,1,2,3,4,5,6,7,8,8],type:"blue"}),e.jsx(x,{title:"Efficiency Gain",value:"2.4x",change:18,chartData:[1,1.2,1.4,1.6,1.8,2,2.1,2.2,2.3,2.4],type:"default"})]}),e.jsxs("div",{className:"charts-grid",children:[e.jsx(m,{title:"Project Distribution",data:[{label:"Web Development",value:42,color:"var(--accent-blue)"},{label:"AI Integration",value:28,color:"var(--primary)"},{label:"E-commerce",value:18,color:"var(--accent-green)"},{label:"Consulting",value:12,color:"var(--accent-gold)"}]}),e.jsx(m,{title:"Revenue Channels",data:[{label:"Project Work",value:65,color:"var(--accent-blue)"},{label:"Retainers",value:25,color:"var(--accent-green)"},{label:"Licensing",value:10,color:"var(--primary)"}]})]}),e.jsxs("div",{className:"regional-section",children:[e.jsxs("div",{className:"regional-header",children:[e.jsx("span",{className:"regional-title",children:"Regional Impact"}),e.jsx("span",{className:"regional-status",children:"● Real-time"})]}),e.jsxs("table",{className:"regional-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Region"}),e.jsx("th",{children:"Services Offered"}),e.jsx("th",{children:"Clients"}),e.jsx("th",{children:"Satisfaction"}),e.jsx("th",{children:"Status"})]})}),e.jsxs("tbody",{children:[e.jsx(g,{region:"Nairobi, KE",services:4,clients:5,satisfaction:"98%",status:"active"}),e.jsx(g,{region:"Mombasa, KE",services:2,clients:2,satisfaction:"100%",status:"growing"}),e.jsx(g,{region:"Remote / Global",services:3,clients:1,satisfaction:"95%",status:"active"})]})]})]}),e.jsx("style",{jsx:!0,children:`
        .impact-dashboard {
          font-family: 'Inter', sans-serif;
        }

        /* Ticker Bar */
        .ticker-bar {
          background: var(--dark-surface);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          padding: 14px 24px;
          margin-bottom: 32px;
        }

        .ticker-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
          flex-wrap: wrap;
        }

        .ticker-divider {
          width: 1px;
          height: 16px;
          background: var(--border-subtle);
        }

        /* Dashboard Header */
        .dashboard-header {
          margin-bottom: 28px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }

        .dashboard-title {
          font-size: 24px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
        }

        .live-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(16, 185, 129, 0.15);
          color: var(--accent-green);
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent-green);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .dashboard-subtitle {
          color: var(--text-secondary);
          font-size: 14px;
          margin: 0;
        }

        /* Metrics Grid */
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }

        /* Charts Grid */
        .charts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }

        /* Regional Section */
        .regional-section {
          background: var(--dark-card);
          border: 1px solid var(--border-subtle);
          border-radius: 16px;
          overflow: hidden;
        }

        .regional-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid var(--border-subtle);
        }

        .regional-title {
          font-weight: 600;
          color: var(--text-primary);
        }

        .regional-status {
          font-size: 11px;
          color: var(--accent-green);
        }

        .regional-table {
          width: 100%;
          border-collapse: collapse;
        }

        .regional-table th {
          padding: 12px 16px;
          text-align: left;
          font-size: 11px;
          font-weight: 600;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          background: var(--dark-surface);
        }

        .regional-table td {
          padding: 14px 16px;
          font-size: 13px;
          color: var(--text-secondary);
          border-bottom: 1px solid var(--border-subtle);
        }

        .regional-table tr:last-child td {
          border-bottom: none;
        }

        .regional-table tr:hover td {
          background: var(--dark-surface);
        }

        @media (max-width: 768px) {
          .ticker-content {
            gap: 16px;
          }
          .ticker-divider {
            display: none;
          }
          /* Regional table mobile - prevent right margin cutoff */
          .regional-section {
            margin-left: -12px;
            margin-right: -12px;
            border-radius: 0;
            overflow-x: auto;
          }
          .regional-table {
            font-size: 12px;
            min-width: 450px;
          }
          .regional-table th,
          .regional-table td {
            padding: 10px 12px;
            white-space: nowrap;
          }
        }
      `})]})}function o({label:i,value:r,type:s,pulse:t}){const a={highlight:"var(--primary)",success:"var(--accent-green)",default:"var(--text-secondary)"};return e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px",fontSize:"12px"},children:[e.jsxs("span",{style:{color:"var(--text-tertiary)",fontWeight:500},children:[i,":"]}),e.jsx("span",{style:{color:a[s],fontWeight:700,fontFamily:"monospace",animation:t?"pulse 2s infinite":"none"},children:r})]})}function x({title:i,value:r,change:s,chartData:t,type:a}){const n=Math.max(...t),l={green:"var(--accent-green)",blue:"var(--accent-blue)",default:"var(--primary)"},c=l[a]||l.default;return e.jsxs(v.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},style:{background:"var(--dark-card)",border:"1px solid var(--border-subtle)",borderRadius:"16px",padding:"20px"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:"12px"},children:[e.jsx("span",{style:{color:"var(--text-secondary)",fontSize:"13px"},children:i}),e.jsxs("span",{style:{color:"var(--accent-green)",fontSize:"12px",fontWeight:600},children:["+",s,"%"]})]}),e.jsx("div",{style:{fontSize:"28px",fontWeight:800,color:"var(--text-primary)",marginBottom:"16px"},children:r}),e.jsx("div",{style:{height:"50px"},children:e.jsxs("svg",{width:"100%",height:"100%",viewBox:"0 0 100 50",preserveAspectRatio:"none",children:[e.jsx("defs",{children:e.jsxs("linearGradient",{id:`grad-${a}`,x1:"0",y1:"0",x2:"0",y2:"1",children:[e.jsx("stop",{offset:"0%",stopColor:c,stopOpacity:"0.3"}),e.jsx("stop",{offset:"100%",stopColor:c,stopOpacity:"0"})]})}),e.jsx("path",{d:`M0,50 ${t.map((d,p)=>`L${p/(t.length-1)*100},${50-d/n*45}`).join(" ")} L100,50 Z`,fill:`url(#grad-${a})`}),e.jsx("path",{d:`M${t.map((d,p)=>`${p/(t.length-1)*100},${50-d/n*45}`).join(" L")}`,fill:"none",stroke:c,strokeWidth:"2"})]})})]})}function m({title:i,data:r}){const s=r.reduce((a,n)=>a+n.value,0);let t=0;return e.jsxs(v.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},style:{background:"var(--dark-card)",border:"1px solid var(--border-subtle)",borderRadius:"16px",padding:"20px"},children:[e.jsx("div",{style:{marginBottom:"16px",color:"var(--text-secondary)",fontSize:"13px"},children:i}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"24px"},children:[e.jsx("div",{style:{width:"100px",height:"100px",position:"relative"},children:e.jsx("svg",{viewBox:"0 0 100 100",style:{transform:"rotate(-90deg)"},children:r.map((a,n)=>{const l=t;return t+=a.value/s*100,e.jsx("circle",{cx:"50",cy:"50",r:"40",fill:"none",stroke:a.color,strokeWidth:"12",strokeDasharray:`${a.value/s*251.2} 251.2`,strokeDashoffset:-l*2.512},n)})})}),e.jsx("div",{style:{flex:1,display:"flex",flexDirection:"column",gap:"6px"},children:r.map((a,n)=>e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",fontSize:"12px"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[e.jsx("span",{style:{width:"8px",height:"8px",borderRadius:"2px",background:a.color}}),e.jsx("span",{style:{color:"var(--text-secondary)"},children:a.label})]}),e.jsxs("span",{style:{color:"var(--text-primary)",fontWeight:600},children:[a.value,"%"]})]},n))})]})]})}function g({region:i,services:r,clients:s,satisfaction:t,status:a}){return e.jsxs("tr",{children:[e.jsx("td",{style:{fontWeight:500,color:"var(--text-primary)"},children:i}),e.jsx("td",{children:r}),e.jsx("td",{style:{color:"var(--accent-blue)"},children:s}),e.jsx("td",{style:{color:"var(--accent-green)",fontWeight:600},children:t}),e.jsx("td",{children:e.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:"6px"},children:[e.jsx("span",{style:{width:"6px",height:"6px",borderRadius:"50%",background:a==="growing"?"var(--accent-blue)":"var(--accent-green)",animation:a==="growing"?"pulse 2s infinite":"none"}}),e.jsx("span",{style:{color:a==="growing"?"var(--accent-blue)":"var(--accent-green)",fontSize:"12px",textTransform:"capitalize"},children:a})]})})]})}export{y as default};
