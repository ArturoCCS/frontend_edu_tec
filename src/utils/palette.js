const palettes = [
  { from:'#3E5879', to:'#213555', accent:'#7EE7A6' },
  { from:'#7886C7', to:'#2D336B', accent:'#FFD0A6' },
  { from:'#016B61', to:'#70B2B2', accent:'#BFE9FF' },
  { from:'#DC143C', to:'#F75270', accent:'#E6CCFF' },
  { from:'#3F4F44', to:'#2C3930', accent:'#F5E3B1' },
  { from:'#1E293B', to:'#0F172A', accent:'#9FB2C8' },
  { from:'#9FB3DF', to:'#9EC6F3', accent:'#F2B4B4' },
  { from:'#80A1BA', to:'#91C4C3', accent:'#A7F3D0' },
]
function hash(s) {
  let h = 0
  const str = String(s ?? '')
  for (let i = 0; i < str.length; i++) { h = (h << 5) - h + str.charCodeAt(i); h |= 0 }
  return Math.abs(h)
}
export function colorFor(key) {
  const i = hash(key) % palettes.length
  return palettes[i]
}