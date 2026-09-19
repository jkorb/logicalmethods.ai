// Shared, brief success feedback. The written result remains available without motion.
const COLORS=['--red-gfx','--blue-gfx','--green-gfx','--orange-gfx'];
export function celebrate(host) {
  if(matchMedia('(prefers-reduced-motion: reduce)').matches||host.closest('[data-paused="true"]'))return;
  host.querySelector('.logic-app__confetti')?.remove();
  host.classList.add('logic-app__celebration-anchor');
  const burst=document.createElement('span');burst.className='logic-app__confetti';burst.setAttribute('aria-hidden','true');
  for(let i=0;i<18;i++) {
    const bit=document.createElement('i');
    bit.style.setProperty('--x',`${((Math.random()*2-1)*110).toFixed(0)}px`);
    bit.style.setProperty('--y',`${(-40-Math.random()*110).toFixed(0)}px`);
    bit.style.setProperty('--spin',`${((Math.random()*2-1)*540).toFixed(0)}deg`);
    bit.style.setProperty('--delay',`${(Math.random()*90).toFixed(0)}ms`);
    bit.style.setProperty('--confetti',`var(${COLORS[i%COLORS.length]})`);burst.append(bit);
  }
  host.append(burst);setTimeout(()=>burst.remove(),1200);
}
