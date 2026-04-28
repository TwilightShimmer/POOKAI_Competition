<template>
  <div class="radar-wrap">
    <svg :width="size" :height="size" :viewBox="'0 0 '+size+' '+size">
      <polygon v-for="level in [0.2,0.4,0.6,0.8,1]" :key="level" :points="ringPoints(level)" fill="none" stroke="#E8E0F0" stroke-width="1" />
      <line v-for="(_,i) in abilities" :key="'ax'+i" :x1="cx" :y1="cy" :x2="axisPoint(i,1).x" :y2="axisPoint(i,1).y" stroke="#E8E0F0" stroke-width="1" />
      <polygon :points="dataPoints" fill="rgba(123,97,255,0.12)" stroke="var(--green)" stroke-width="2.5" />
      <circle v-for="(a,i) in abilities" :key="'d'+i" :cx="axisPoint(i,a.value/100).x" :cy="axisPoint(i,a.value/100).y" r="5" :fill="dotColor(i)" stroke="#fff" stroke-width="2" />
      <text v-for="(a,i) in abilities" :key="'t'+i" :x="labelPoint(i).x" :y="labelPoint(i).y" text-anchor="middle" font-size="11" font-weight="800" fill="#5A5A7A">{{ a.name }}</text>
      <text v-for="(a,i) in abilities" :key="'v'+i" :x="labelPoint(i).x" :y="labelPoint(i).y+15" text-anchor="middle" font-size="11" font-weight="800" :fill="dotColor(i)">{{ a.value }}</text>
    </svg>
  </div>
</template>
<script setup>
import { computed } from 'vue'
const props = defineProps({ abilities: Array })
const size=300; const cx=size/2; const cy=size/2; const radius=110
const colors = ['#7B61FF','#FF6B9D','#FF9F43','#06D6A0','#4CC9F0']
function dotColor(i){ return colors[i%colors.length] }
function axisPoint(i,r){ const a=(Math.PI*2*i)/props.abilities.length-Math.PI/2; return {x:cx+radius*r*Math.cos(a),y:cy+radius*r*Math.sin(a)} }
function labelPoint(i){ const a=(Math.PI*2*i)/props.abilities.length-Math.PI/2; return {x:cx+(radius+30)*Math.cos(a),y:cy+(radius+30)*Math.sin(a)} }
function ringPoints(l){ return props.abilities.map((_,i)=>{const p=axisPoint(i,l);return p.x+','+p.y}).join(' ') }
const dataPoints = computed(()=>props.abilities.map((a,i)=>{const p=axisPoint(i,Math.max(a.value,5)/100);return p.x+','+p.y}).join(' '))
</script>
<style scoped>.radar-wrap{display:flex;justify-content:center}</style>
