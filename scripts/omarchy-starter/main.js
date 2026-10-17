import presets from './presets.json';
const picker=document.querySelector('#theme');
for(const p of presets){const option=document.createElement('option');option.value=p.id;option.textContent=p.name;picker.append(option);}
picker.value='catppuccin';picker.onchange=()=>document.documentElement.dataset.theme=`omarchy-${picker.value}`;
document.querySelector('#idea-form').onsubmit=e=>{e.preventDefault();const input=document.querySelector('#idea');const value=input.value.trim();if(!value)return;const item=document.createElement('li');item.textContent=value;document.querySelector('#ideas').append(item);document.querySelector('#status').textContent='已添加到当前页面。';input.value='';};
