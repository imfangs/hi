// Shared by the portfolio hero and the full Omarchy tribute player.
const cache = new Map();
export async function loadRecording(word, effect, signal) {
  const key = `${word.toLowerCase()}-${effect}`;
  if (cache.has(key)) return cache.get(key);
  const res = await fetch(`/omarchy/animations/${key}.json.gz`, {signal});
  if (!res.ok) throw new Error(`Recording ${key}: HTTP ${res.status}`);
  const bytes = new Uint8Array(await res.arrayBuffer());
  // Some static hosts send Content-Encoding:gzip, so fetch has already decompressed.
  const data = bytes[0] === 0x1f && bytes[1] === 0x8b
    ? await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).json()
    : JSON.parse(new TextDecoder().decode(bytes));
  cache.set(key, data);
  if (cache.size > 6) cache.delete(cache.keys().next().value);
  return data;
}
export function drawFrame(canvas, recording, index) {
  const ctx = canvas.getContext('2d', {alpha:false});
  index = Math.min(Math.max(0,index),recording.frames.length-1);
  const cw=12,ch=24,W=recording.width,H=recording.height;
  if(canvas.width!==W*cw||canvas.height!==H*ch){canvas.width=W*cw;canvas.height=H*ch;}
  ctx.fillStyle='#000';ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.font=`${ch}px "SFMono-Regular",Consolas,"Liberation Mono",monospace`;ctx.textBaseline='top';
  let x=0,y=0,fg='#fff',bg=null;
  for(const token of recording.frames[index].split(/(\x1b\[[0-9;]*m|\n)/)){
    if(token==='\n'){x=0;y++;continue;}
    if(token.startsWith('\x1b[')){
      const codes=token.slice(2,-1).split(';').map(Number);
      for(let i=0;i<codes.length;i++){
        const c=codes[i];
        if(c===0){fg='#fff';bg=null;}
        else if((c===38||c===48)&&codes[i+1]===2){const color=`rgb(${codes[i+2]},${codes[i+3]},${codes[i+4]})`;if(c===38)fg=color;else bg=color;i+=4;}
        else if(c===39)fg='#fff';else if(c===49)bg=null;
      }
      continue;
    }
    for(const char of token){
      if(bg){ctx.fillStyle=bg;ctx.fillRect(x*cw,y*ch,cw,ch);}
      if(char!==' '){ctx.fillStyle=fg;if(char==='█')ctx.fillRect(x*cw,y*ch,cw,ch);else ctx.fillText(char,x*cw,y*ch,cw);}
      x++;
    }
  }
}
