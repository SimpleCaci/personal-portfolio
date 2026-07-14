const year=document.querySelector("#year");if(year)year.textContent=String(new Date().getFullYear());
const sections=[...document.querySelectorAll("main section[id]")],links=[...document.querySelectorAll("nav a[href^='#']")];
if("IntersectionObserver" in window&&sections.length&&links.length){const observer=new IntersectionObserver(entries=>{const visible=entries.find(entry=>entry.isIntersecting);if(!visible)return;links.forEach(link=>link.toggleAttribute("aria-current",link.getAttribute("href")===`#${visible.target.id}`))},{rootMargin:"-35% 0px -55%",threshold:0});sections.forEach(section=>observer.observe(section));}

